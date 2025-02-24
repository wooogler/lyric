import { create } from "zustand";

interface PlayerState {
  isPlaying: boolean;
  isCompleted: boolean;
  highlightIndex: number;
  isChatOpen: boolean;
  sentences: string[];

  // actions
  setIsPlaying: (playing: boolean) => void;
  setIsCompleted: (completed: boolean) => void;
  setHighlightIndex: (index: number) => void;
  setIsChatOpen: (open: boolean) => void;
  setSentences: (sentences: string[]) => void;
  reset: () => void;
  toggleChat: () => void;
  togglePlayPause: () => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  isPlaying: false,
  isCompleted: false,
  highlightIndex: -1,
  isChatOpen: false,
  sentences: [],

  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setIsCompleted: (completed) => set({ isCompleted: completed }),
  setHighlightIndex: (index) => set({ highlightIndex: index }),
  setIsChatOpen: (open) => set({ isChatOpen: open }),
  setSentences: (sentences) => set({ sentences }),

  reset: () =>
    set({
      highlightIndex: -1,
      isPlaying: false,
      isCompleted: false,
    }),

  toggleChat: () =>
    set((state) => ({
      isChatOpen: !state.isChatOpen,
    })),

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
}));
