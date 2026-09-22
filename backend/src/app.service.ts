import { Injectable, MessageEvent } from '@nestjs/common';
import { interval, map, Observable } from 'rxjs';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export interface TimePayload {
  timestamp: string;
  timeString: string;
  unix: number;
  jsonData: Record<string, unknown>;
}

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  private readLiveData(): Record<string, unknown> {
    try {
      const primaryPath = join(process.cwd(), 'data', 'live-data.json');
      const fallbackPath = join(
        process.cwd(),
        'backend',
        'data',
        'live-data.json',
      );
      const targetPath = existsSync(primaryPath) ? primaryPath : fallbackPath;

      if (existsSync(targetPath)) {
        const raw = readFileSync(targetPath, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Gagal membaca JSON:', e);
    }
    return { status: 'ERROR', message: 'File JSON tidak ditemukan' };
  }

  getTimeStream(): Observable<MessageEvent> {
    return interval(1000).pipe(
      map(() => {
        const now = new Date();
        const jsonData = this.readLiveData();

        const payload: TimePayload = {
          timestamp: now.toISOString(),
          timeString: now.toLocaleTimeString('id-ID'),
          unix: now.getTime(),
          jsonData,
        };
        return {
          data: payload,
          retry: 3000,
        } as MessageEvent;
      }),
    );
  }
}

