import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { eventsIn, type StreamEvent } from './eventStream';

function streamOf(chunks: string[]): ReadableStream<Uint8Array<ArrayBuffer>> {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      chunks.forEach((chunk) => controller.enqueue(encoder.encode(chunk)));
      controller.close();
    },
  });
}

async function eventsOf(chunks: string[]): Promise<StreamEvent[]> {
  const events: StreamEvent[] = [];
  for await (const event of eventsIn(streamOf(chunks))) {
    events.push(event);
  }
  return events;
}

/** What PollStream writes: named events, JSON data, heartbeats in between. */
const written = 'event:update\ndata:{"totalBallots":3}\n\n:heartbeat\n\nevent:deleted\ndata:{}\n\n';

describe('reading server-sent events', () => {
  it('reads named events and their data, and skips heartbeats', async () => {
    expect(await eventsOf([written])).toEqual([
      { type: 'update', data: '{"totalBallots":3}' },
      { type: 'deleted', data: '{}' },
    ]);
  });

  it('reads the same events however the stream is cut', async () => {
    await fc.assert(fc.asyncProperty(fc.array(fc.nat(written.length), { maxLength: 12 }), async (cuts) => {
      const ends = [...new Set(cuts)].sort((a, b) => a - b);
      const chunks = [0, ...ends].map((start, i) => written.slice(start, ends[i] ?? written.length));
      expect(await eventsOf(chunks)).toEqual(await eventsOf([written]));
    }));
  });

  it('joins data lines, takes away one space after the colon, and reads \\r\\n line ends', async () => {
    expect(await eventsOf(['data: first\r\ndata:  second\r\n\r\n'])).toEqual([{ type: 'message', data: 'first\n second' }]);
  });

  it('dispatches no event without data, and forgets its name', async () => {
    expect(await eventsOf(['event:update\n\ndata:x\n\n'])).toEqual([{ type: 'message', data: 'x' }]);
  });

  it('drops an event the stream ended in the middle of', async () => {
    expect(await eventsOf(['event:update\ndata:x\n'])).toEqual([]);
  });

  it('ignores ids, retries and fields it does not know', async () => {
    expect(await eventsOf(['id:7\nretry:1000\nfoo:bar\ndata:x\n\n'])).toEqual([{ type: 'message', data: 'x' }]);
  });
});
