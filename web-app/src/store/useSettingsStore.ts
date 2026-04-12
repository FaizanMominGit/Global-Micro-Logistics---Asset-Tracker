import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  telemetryInterval: number;
  polarBoundary: number;
  setTelemetryInterval: (interval: number) => void;
  setPolarBoundary: (boundary: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      telemetryInterval: 2500, // Default 2.5s
      polarBoundary: 65,       // Default Lat 65
      setTelemetryInterval: (interval) => set({ telemetryInterval: interval }),
      setPolarBoundary: (boundary) => set({ polarBoundary: boundary }),
    }),
    {
      name: 'omnitrack-settings',
    }
  )
);
