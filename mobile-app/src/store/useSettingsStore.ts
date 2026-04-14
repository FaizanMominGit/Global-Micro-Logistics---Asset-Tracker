import { create } from "zustand";

interface SettingsState {
  pollingIntervalMs: number;
  setPollingIntervalMs: (ms: number) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  pollingIntervalMs: 3000,
  setPollingIntervalMs: (ms) => set({ pollingIntervalMs: ms }),
}));
