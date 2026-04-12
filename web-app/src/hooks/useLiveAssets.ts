"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useSettingsStore } from "@/store/useSettingsStore";

export type AssetType = "ship" | "truck" | "plane";

export interface LiveAsset {
  id: string;
  name: string;
  type: AssetType;
  position: [number, number]; // mapped from DB lat/lng
  status: "active" | "delayed" | "offline";
  speed: number;
}

export function useLiveAssets() {
  const telemetryInterval = useSettingsStore(state => state.telemetryInterval);

  const { data, refetch } = useQuery<LiveAsset[]>({
    queryKey: ["live-assets"],
    queryFn: async () => {
      const res = await fetch("/api/assets");
      if (!res.ok) throw new Error("Failed to sync");
      const json = await res.json();
      
      // Map the relational rows back into positional tuples for React Leaflet mapping
      return json.map((a: any) => ({
        ...a,
        position: [a.lat, a.lng]
      }));
    },
    refetchInterval: telemetryInterval, // Sync frontend automatically based on settings
  });

  useEffect(() => {
    // Run background synchronization polling simulating active telemetry feeds globally Server-side
    const interval = setInterval(async () => {
      try {
        await fetch("/api/assets/sync", { method: "POST" });
      } catch (e) {
        console.error(e);
      }
    }, telemetryInterval);

    return () => clearInterval(interval);
  }, [telemetryInterval]);

  return { assets: data || [] };
}
