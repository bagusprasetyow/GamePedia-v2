/**
 * storage-stream.e2e-spec.ts
 *
 * Integration test untuk endpoint streaming video GET /storage/video/*path.
 * Menggunakan fixture tempdir mandiri — tidak bergantung pada koleksi video lokal.
 * Sebelum test, STORAGE_VIDEO_ROOT diatur ke direktori sementara yang berisi
 * fixture HLS minimal buatan test itu sendiri.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';

// ---------------------------------------------------------------------------
// Fixture HLS minimal — bukan video nyata, hanya teks yang cukup untuk test
// ---------------------------------------------------------------------------
const FIXTURE_MASTER_M3U8 = [
  '#EXTM3U',
  '#EXT-X-VERSION:3',
  '#EXT-X-STREAM-INF:BANDWIDTH=5000000,RESOLUTION=1920x1080',
  'stream_0.m3u8',
  '',
].join('\n');

const FIXTURE_STREAM0_M3U8 = [
  '#EXTM3U',
  '#EXT-X-VERSION:3',
  '#EXT-X-TARGETDURATION:10',
  '#EXTINF:10.0,',
  'segment-001.ts',
  '#EXT-X-ENDLIST',
  '',
].join('\n');

const FIXTURE_SEGMENT_TS = Buffer.from('FAKE_TS_SEGMENT_DATA');

const FIXTURE_SUBTITLE_VTT = [
  'WEBVTT',
  '',
  '00:00:00.000 --> 00:00:05.000',
  'Teks contoh subtitle',
  '',
].join('\n');

// ---------------------------------------------------------------------------

describe('Storage Streaming (e2e)', () => {
  let app: INestApplication;
  let tempDir: string;

  beforeAll(async () => {
    // Buat direktori fixture sementara
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gp-e2e-stream-'));
    const genshinDir = path.join(tempDir, 'Genshin-Impact');
    const subtitlesDir = path.join(genshinDir, 'subtitles');
    fs.mkdirSync(subtitlesDir, { recursive: true });

    fs.writeFileSync(path.join(genshinDir, 'master.m3u8'), FIXTURE_MASTER_M3U8);
    fs.writeFileSync(path.join(genshinDir, 'stream_0.m3u8'), FIXTURE_STREAM0_M3U8);
    fs.writeFileSync(path.join(genshinDir, 'segment-001.ts'), FIXTURE_SEGMENT_TS);
    fs.writeFileSync(path.join(subtitlesDir, 'id.vtt'), FIXTURE_SUBTITLE_VTT);

    // Arahkan StorageService ke fixture tempdir
    process.env.STORAGE_VIDEO_ROOT = tempDir;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    // Bersihkan direktori fixture setelah test selesai
    fs.rmSync(tempDir, { recursive: true, force: true });
    delete process.env.STORAGE_VIDEO_ROOT;
  });

  // ─── 200 OK: manifest HLS bertingkat ───────────────────────────────────────

  it('GET /storage/video/Genshin-Impact/master.m3u8 melayani manifest HLS dengan 200 OK', async () => {
    const res = await request(app.getHttpServer())
      .get('/storage/video/Genshin-Impact/master.m3u8')
      .expect(200);

    expect(res.headers['content-type']).toMatch(/mpegurl/);
    expect(res.headers['accept-ranges']).toBe('bytes');
    expect(res.text).toContain('#EXTM3U');
    expect(res.text).toContain('stream_0.m3u8');
  });

  it('GET /storage/video/Genshin-Impact/stream_0.m3u8 melayani playlist resolusi dengan 200 OK', async () => {
    const res = await request(app.getHttpServer())
      .get('/storage/video/Genshin-Impact/stream_0.m3u8')
      .expect(200);

    expect(res.text).toContain('#EXT-X-ENDLIST');
    expect(res.text).toContain('segment-001.ts');
  });

  it('GET /storage/video/Genshin-Impact/segment-001.ts melayani segmen TS dengan 200 OK', async () => {
    const res = await request(app.getHttpServer())
      .get('/storage/video/Genshin-Impact/segment-001.ts')
      .expect(200);

    expect(res.headers['content-type']).toMatch(/mp2t/);
    expect(Buffer.from(res.body)).toEqual(FIXTURE_SEGMENT_TS);
  });

  it('GET /storage/video/Genshin-Impact/subtitles/id.vtt melayani subtitle WebVTT dengan 200 OK', async () => {
    const res = await request(app.getHttpServer())
      .get('/storage/video/Genshin-Impact/subtitles/id.vtt')
      .expect(200);

    expect(res.headers['content-type']).toMatch(/vtt/);
    expect(res.text).toContain('WEBVTT');
  });

  // ─── 206 Partial Content ───────────────────────────────────────────────────

  it('GET manifest dengan Range bytes=0-10 melayani chunk partial dengan HTTP 206', async () => {
    const res = await request(app.getHttpServer())
      .get('/storage/video/Genshin-Impact/master.m3u8')
      .set('Range', 'bytes=0-10')
      .expect(206);

    expect(res.headers['content-range']).toMatch(/^bytes 0-10\/\d+/);
    expect(res.headers['content-length']).toBe('11');
  });

  it('GET manifest dengan suffix Range bytes=-5 mengembalikan 5 byte terakhir (206)', async () => {
    const res = await request(app.getHttpServer())
      .get('/storage/video/Genshin-Impact/master.m3u8')
      .set('Range', 'bytes=-5')
      .expect(206);

    const rangeHeader = res.headers['content-range'] as string;
    // Verifikasi format Content-Range: bytes start-end/total
    expect(rangeHeader).toMatch(/^bytes \d+-\d+\/\d+$/);
    expect(res.headers['content-length']).toBe('5');
  });

  // ─── 416 Range Not Satisfiable ─────────────────────────────────────────────

  it('GET manifest dengan Range di luar ukuran berkas mengembalikan 416', async () => {
    const res = await request(app.getHttpServer())
      .get('/storage/video/Genshin-Impact/master.m3u8')
      .set('Range', 'bytes=999999-1000000')
      .expect(416);

    expect(res.headers['content-range']).toMatch(/^bytes \*\/\d+/);
  });

  // ─── Multi-range → 200 fallback ────────────────────────────────────────────

  it('GET manifest dengan multi-range (bytes=0-5,10-15) mengembalikan 200 OK (RFC 9110 §14.2)', async () => {
    const res = await request(app.getHttpServer())
      .get('/storage/video/Genshin-Impact/master.m3u8')
      .set('Range', 'bytes=0-5,10-15')
      .expect(200);

    expect(res.text).toContain('#EXTM3U');
  });

  // ─── 404 Not Found ─────────────────────────────────────────────────────────

  it('GET /storage/video/non-existent.mp4 mengembalikan 404', async () => {
    await request(app.getHttpServer())
      .get('/storage/video/non-existent.mp4')
      .expect(404);
  });

  // ─── 400 Bad Request: allowlist & traversal ────────────────────────────────

  it('GET /storage/video/secret.env menolak berkas non-media dengan 400', async () => {
    await request(app.getHttpServer())
      .get('/storage/video/secret.env')
      .expect(400);
  });

  it('GET /storage/video/sub%2F..%2Fmain.mp4 menolak path traversal dengan 400', async () => {
    await request(app.getHttpServer())
      .get('/storage/video/sub%2F..%2Fmain.mp4')
      .expect(400);
  });
});
