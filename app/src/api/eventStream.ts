/**
 * Server-sent events, read from a fetch answer's body. `EventSource` would do
 * it for us, but it cannot send a header, and the Android app proves who it is
 * with one (`Authorization: Bearer`): a token in the address would land in
 * logs along the way.
 */

/** One event: its name ("message" when the server gave none) and its data, lines joined. */
export interface StreamEvent {
  type: string;
  data: string;
}

/**
 * The events in a stream, as the HTML standard reads them: `field: value`
 * lines, `:` comments (the server's heartbeats), and a blank line that ends
 * each event; an event without data is none. Lines end with `\n` or `\r\n`, as
 * the server writes them; a lone `\r` is not taken for one. `id` and `retry`
 * are ignored: a new connection starts from the poll's current state anyway.
 */
export async function* eventsIn(body: ReadableStream<BufferSource>): AsyncGenerator<StreamEvent> {
  const reader = body.pipeThrough(new TextDecoderStream()).getReader();
  let pending = '';
  let event = emptyEvent();
  try {
    // A loop: chunks end anywhere, mid-line included, so each one's last line waits for the next.
    for (let chunk = await reader.read(); !chunk.done; chunk = await reader.read()) {
      const lines = (pending + chunk.value).split('\n');
      pending = lines.pop()!;
      for (const line of lines.map((each) => each.replace(/\r$/, ''))) {
        if (line === '' && event.data.length > 0) {
          yield { type: event.type || 'message', data: event.data.join('\n') };
        }
        event = line === '' ? emptyEvent() : withField(event, line);
      }
    }
  } finally {
    reader.releaseLock();
  }
}

interface PartialEvent {
  type: string;
  data: string[];
}

function emptyEvent(): PartialEvent {
  return { type: '', data: [] };
}

function withField(event: PartialEvent, line: string): PartialEvent {
  const colon = line.indexOf(':');
  const field = colon < 0 ? line : line.slice(0, colon);
  const value = colon < 0 ? '' : line.slice(colon + 1).replace(/^ /, '');
  if (field === 'event') {
    return { ...event, type: value };
  }
  if (field === 'data') {
    return { ...event, data: [...event.data, value] };
  }
  return event; // a comment (no field name), id, retry, or a field nobody knows
}
