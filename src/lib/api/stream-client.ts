import { DEFAULT_PROVIDER } from './providers';

export interface SSEClientOptions {
  /** Data provider to use (defaults to 'core') */
  provider?: string;
  /** Request body for POST requests */
  body?: unknown;
  /** Abort signal for cancellation */
  signal?: AbortSignal;
  /** Callback for each SSE event */
  onEvent: (eventType: string, data: string) => void;
  /** Callback when connection opens */
  onOpen?: () => void;
  /** Callback when an error occurs */
  onError?: (error: Error) => void;
  /** Callback when stream ends */
  onDone?: () => void;
}

/**
 * Build the SSE proxy URL
 */
function buildStreamUrl(
  path: string,
  params?: Record<string, string>,
  provider: string = DEFAULT_PROVIDER
): string {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const url = new URL(`/api/proxy-stream/${provider}/${cleanPath}`, window.location.origin);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, value);
      }
    });
  }

  return url.toString();
}

/**
 * Parse SSE text into events
 * Handles the SSE format: event: <type>\ndata: <data>\n\n
 */
function parseSSEText(text: string): Array<{ event: string; data: string }> {
  const events: Array<{ event: string; data: string }> = [];
  const lines = text.split('\n');

  let currentEvent = 'message';
  let currentData = '';

  for (const line of lines) {
    if (line.startsWith('event:')) {
      currentEvent = line.slice(6).trim();
    } else if (line.startsWith('data:')) {
      currentData = line.slice(5).trim();
    } else if (line === '' && currentData) {
      events.push({ event: currentEvent, data: currentData });
      currentEvent = 'message';
      currentData = '';
    }
  }

  return events;
}

/**
 * Create an SSE connection using fetch with streaming
 *
 * This approach uses fetch + ReadableStream instead of EventSource
 * to support POST requests with request body.
 */
export async function createSSEConnection(
  path: string,
  options: SSEClientOptions
): Promise<() => void> {
  const { provider = DEFAULT_PROVIDER, body, signal, onEvent, onOpen, onError, onDone } = options;

  const url = buildStreamUrl(path, undefined, provider);
  const abortController = new AbortController();

  // Combine signals if provided
  const combinedSignal = signal
    ? AbortSignal.any([signal, abortController.signal])
    : abortController.signal;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: combinedSignal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Stream request failed with status ${response.status}`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorMessage;
      } catch {
        // Use default error message
      }
      throw new Error(errorMessage);
    }

    onOpen?.();

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Response body is not readable');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    const processStream = async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            // Process any remaining buffer
            if (buffer.trim()) {
              const events = parseSSEText(buffer);
              for (const { event, data } of events) {
                onEvent(event, data);
              }
            }
            onDone?.();
            break;
          }

          buffer += decoder.decode(value, { stream: true });

          // Process complete events from buffer
          // Events are separated by double newlines
          const eventEnd = buffer.lastIndexOf('\n\n');
          if (eventEnd !== -1) {
            const completeEvents = buffer.slice(0, eventEnd + 2);
            buffer = buffer.slice(eventEnd + 2);

            const events = parseSSEText(completeEvents);
            for (const { event, data } of events) {
              onEvent(event, data);
            }
          }
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          // Connection was cancelled, this is expected
          return;
        }
        onError?.(error instanceof Error ? error : new Error(String(error)));
      }
    };

    processStream();

    // Return cleanup function
    return () => {
      abortController.abort();
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      // Connection was cancelled
      return () => {};
    }
    onError?.(error instanceof Error ? error : new Error(String(error)));
    return () => {};
  }
}
