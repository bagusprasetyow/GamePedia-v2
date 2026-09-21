import { Injectable, MessageEvent } from '@nestjs/common';
import { interval, map, Observable } from 'rxjs';

export interface TimePayload {
  timestamp: string;
  timeString: string;
  unix: number;
}

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getTimeStream(): Observable<MessageEvent> {
    return interval(1000).pipe(
      map(() => {
        const now = new Date();
        const payload: TimePayload = {
          timestamp: now.toISOString(),
          timeString: now.toLocaleTimeString('id-ID'),
          unix: now.getTime(),
        };
        return {
          data: payload,
        } as MessageEvent;
      }),
    );
  }
}

