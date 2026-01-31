/**
 * SSE Parser Utility
 *
 * Parse SSE (Server-Sent Events) stream dari Citizen Report Agent.
 */

export interface ParsedSSEEvent {
  event: string;
  data: unknown;
}

/**
 * Parse a single SSE message
 */
export function parseSSEMessage(raw: string): ParsedSSEEvent | null {
  const lines = raw.split('\n').filter((line) => line.trim());

  let event = '';
  let data = '';

  for (const line of lines) {
    if (line.startsWith('event:')) {
      event = line.substring(6).trim();
    } else if (line.startsWith('data:')) {
      data = line.substring(5).trim();
    }
  }

  if (!event || !data) {
    return null;
  }

  // Handle ping events
  if (event === 'ping' || data === 'ok') {
    return { event, data };
  }

  try {
    const parsedData = JSON.parse(data);
    return { event, data: parsedData };
  } catch {
    console.warn(`[SSE] Non-JSON data for event "${event}":`, data);
    return { event, data };
  }
}

/**
 * Create an SSE event stream reader (async generator)
 */
export async function* readSSEStream(
  response: Response
): AsyncGenerator<ParsedSSEEvent, void, unknown> {
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  if (!reader) {
    throw new Error('Response body is null');
  }

  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const messages = buffer.split('\n\n');

      // Keep the last incomplete message in buffer
      buffer = messages.pop() || '';

      for (const message of messages) {
        if (message.trim()) {
          const parsed = parseSSEMessage(message);
          if (parsed) {
            yield parsed;
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
