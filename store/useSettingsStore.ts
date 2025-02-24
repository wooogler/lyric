import { create } from "zustand";

interface SettingsState {
  selectedLLM: string;
  apiKey: string;
  selectedPersona: string;
  customPrompt: string;
  isSettingsOpen: boolean;

  // actions
  setSelectedLLM: (llm: string) => void;
  setApiKey: (key: string) => void;
  setSelectedPersona: (persona: string) => void;
  setCustomPrompt: (prompt: string) => void;
  setIsSettingsOpen: (open: boolean) => void;
  saveSettings: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  selectedLLM: "gpt-4o",
  apiKey: "",
  selectedPersona: "academic",
  customPrompt: "",
  isSettingsOpen: false,

  setSelectedLLM: (llm) => set({ selectedLLM: llm }),
  setApiKey: (key) => set({ apiKey: key }),
  setSelectedPersona: (persona) => set({ selectedPersona: persona }),
  setCustomPrompt: (prompt) => set({ customPrompt: prompt }),
  setIsSettingsOpen: (open) => set({ isSettingsOpen: open }),

  saveSettings: () => {
    // TODO: Implement settings save logic
    set({ isSettingsOpen: false });
  },
}));
