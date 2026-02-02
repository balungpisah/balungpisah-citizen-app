import { create } from 'zustand';
import type { IMessage } from '../types';

/**
 * Chat status lifecycle:
 * - idle: No active chat, ready to start new conversation
 * - active: Chat is ongoing (has messages)
 * - error: Chat encountered an error loading history
 */
export type ChatStatus = 'idle' | 'active' | 'error';

interface ChatState {
  // Thread state
  threadId: string | null;
  status: ChatStatus;

  // Messages state (persisted messages only, not streaming)
  messages: IMessage[];

  // Input state
  inputValue: string;

  // History loading states
  isLoadingHistory: boolean;
  historyError: string | null;
}

interface ChatActions {
  // Thread actions
  setThreadId: (threadId: string | null) => void;
  setStatus: (status: ChatStatus) => void;

  // Messages actions
  addMessage: (message: IMessage) => void;
  setMessages: (messages: IMessage[]) => void;
  updateMessageIfNotExists: (message: IMessage) => void;

  // Input actions
  setInputValue: (value: string) => void;

  // History loading actions
  loadHistoryStart: () => void;
  loadHistorySuccess: (messages: IMessage[]) => void;
  loadHistoryError: (error: string) => void;

  // Composite actions
  startNewChat: () => void;

  // Reset
  reset: () => void;
}

const initialState: ChatState = {
  threadId: null,
  status: 'idle',
  messages: [],
  inputValue: '',
  isLoadingHistory: false,
  historyError: null,
};

export const useChatStore = create<ChatState & ChatActions>((set) => ({
  ...initialState,

  // Thread actions
  setThreadId: (threadId) => set({ threadId }),
  setStatus: (status) => set({ status }),

  // Messages actions
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
      status: 'active',
    })),

  setMessages: (messages) => set({ messages }),

  updateMessageIfNotExists: (message) =>
    set((state) => {
      const exists = state.messages.some((m) => m.id === message.id);
      if (exists) return state;
      return { messages: [...state.messages, message] };
    }),

  // Input actions
  setInputValue: (inputValue) => set({ inputValue }),

  // History loading actions
  loadHistoryStart: () =>
    set({
      isLoadingHistory: true,
      historyError: null,
    }),

  loadHistorySuccess: (messages) =>
    set({
      isLoadingHistory: false,
      historyError: null,
      messages,
      status: messages.length > 0 ? 'active' : 'idle',
    }),

  loadHistoryError: (error) =>
    set({
      isLoadingHistory: false,
      historyError: error,
      status: 'error',
    }),

  // Composite actions
  startNewChat: () => set(initialState),

  // Reset
  reset: () => set(initialState),
}));

/**
 * Selector hooks for common use cases
 */
export const useChatMessages = () => useChatStore((state) => state.messages);
export const useChatThreadId = () => useChatStore((state) => state.threadId);
export const useChatStatus = () => useChatStore((state) => state.status);
export const useChatInput = () =>
  useChatStore((state) => ({
    value: state.inputValue,
    setValue: state.setInputValue,
  }));
