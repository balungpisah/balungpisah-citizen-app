'use client';

import { useRef, useCallback, useEffect, useState } from 'react';

interface UseAutoScrollOptions {
  /** Threshold in pixels from bottom to consider "at bottom" */
  threshold?: number;
  /** Whether streaming is active */
  isStreaming?: boolean;
}

interface UseAutoScrollReturn {
  /** Ref to attach to scroll container */
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  /** Ref to attach to bottom anchor element */
  bottomRef: React.RefObject<HTMLDivElement | null>;
  /** Whether user is currently at bottom */
  isAtBottom: boolean;
  /** Scroll to bottom */
  scrollToBottom: (behavior?: ScrollBehavior) => void;
  /** Handle user scroll - call this in onScroll */
  handleScroll: () => void;
}

/**
 * Hook for managing auto-scroll behavior in chat interfaces.
 *
 * Use cases:
 * 1. Auto-scroll saat streaming (jika user di bottom)
 * 2. Stop auto-scroll saat user scroll ke atas
 * 3. Resume auto-scroll saat user scroll ke bawah
 * 4. Instant scroll saat kirim pesan baru
 * 5. Floating button untuk scroll ke bottom
 */
export function useAutoScroll({
  threshold = 150,
  isStreaming = false,
}: UseAutoScrollOptions = {}): UseAutoScrollReturn {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const userScrolledUpRef = useRef(false);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Check if scroll is at bottom
  const checkIsAtBottom = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return true;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    return distanceFromBottom <= threshold;
  }, [threshold]);

  // Scroll to bottom
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'instant') => {
    bottomRef.current?.scrollIntoView({ behavior, block: 'end' });
    userScrolledUpRef.current = false;
    setIsAtBottom(true);
  }, []);

  // Handle scroll event
  const handleScroll = useCallback(() => {
    const atBottom = checkIsAtBottom();
    setIsAtBottom(atBottom);

    // Track if user scrolled up
    if (!atBottom) {
      userScrolledUpRef.current = true;
    } else {
      userScrolledUpRef.current = false;
    }
  }, [checkIsAtBottom]);

  // Auto-scroll during streaming (only if user hasn't scrolled up)
  useEffect(() => {
    if (!isStreaming) return;

    // If user scrolled up, don't auto-scroll
    if (userScrolledUpRef.current) return;

    // Auto-scroll to follow streaming content
    const scrollInterval = setInterval(() => {
      if (!userScrolledUpRef.current && isStreaming) {
        bottomRef.current?.scrollIntoView({ behavior: 'instant', block: 'end' });
      }
    }, 100);

    return () => clearInterval(scrollInterval);
  }, [isStreaming]);

  return {
    scrollContainerRef,
    bottomRef,
    isAtBottom,
    scrollToBottom,
    handleScroll,
  };
}
