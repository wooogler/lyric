import { create } from "zustand";
import { Message } from "@/types";

export interface PlayerState {
  isPlaying: boolean;
  isCompleted: boolean;
  highlightIndex: number;
  isChatOpen: boolean;
  sentences: string[];
  messages: Message[];

  // actions
  setIsPlaying: (playing: boolean) => void;
  setIsCompleted: (completed: boolean) => void;
  setHighlightIndex: (index: number | ((prev: number) => number)) => void;
  setIsChatOpen: (open: boolean) => void;
  setSentences: (sentences: string[]) => void;
  reset: () => void;
  toggleChat: () => void;
  togglePlayPause: () => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  isPlaying: false,
  isCompleted: false,
  highlightIndex: -1,
  isChatOpen: false,
  sentences: [],
  messages: [],

  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setIsCompleted: (completed) => set({ isCompleted: completed }),
  setHighlightIndex: (index) =>
    set((state) => ({
      highlightIndex:
        typeof index === "function" ? index(state.highlightIndex) : index,
    })),
  setIsChatOpen: (open) => set({ isChatOpen: open }),
  setSentences: (sentences) => set({ sentences }),

  reset: () =>
    set({
      highlightIndex: -1,
      isPlaying: false,
      isCompleted: false,
    }),

  toggleChat: () =>
    set((state) => {
      if (!state.isChatOpen) {
        if (
          state.highlightIndex >= 0 &&
          state.sentences[state.highlightIndex]
        ) {
          return {
            isChatOpen: true,
            messages: [
              {
                id: Date.now(),
                text: `> ${state.sentences[state.highlightIndex]}`,
                isUser: false,
              },
              {
                id: Date.now() + 1,
                text: 'Would you like me to explain "people" in this sentence?',
                isUser: false,
              },
            ],
          };
        }
        return { isChatOpen: true };
      } else {
        return {
          isChatOpen: false,
          messages: [],
        };
      }
    }),

  togglePlayPause: () =>
    set((state) => {
      if (state.isCompleted) {
        return {
          highlightIndex: -1,
          isCompleted: false,
          isPlaying: true,
        };
      }
      return { isPlaying: !state.isPlaying };
    }),

  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  clearMessages: () => set({ messages: [] }),
}));
