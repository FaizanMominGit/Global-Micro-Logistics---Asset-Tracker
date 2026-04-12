import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  telemetryInterval: number;
  polarBoundary: number;
  lastAlertedAssets: Record<string, number>;
  setTelemetryInterval: (interval: number) => void;
  setPolarBoundary: (boundary: number) => void;
  setLastAlertedAsset: (id: string, timestamp: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      telemetryInterval: 2500, // Default 2.5s
      polarBoundary: 65,       // Default Lat 65
      lastAlertedAssets: {},   // Anti-spam registry
      setTelemetryInterval: (interval) => set({ telemetryInterval: interval }),
      setPolarBoundary: (boundary) => set({ polarBoundary: boundary }),
      setLastAlertedAsset: (id, timestamp) => set((state) => ({ 
        lastAlertedAssets: { ...state.lastAlertedAssets, [id]: timestamp } 
      })),
    }),
    {
      name: 'omnitrack-settings',
    }
  )
);
