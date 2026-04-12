"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useSettingsStore } from "@/store/useSettingsStore";
import { toast } from "sonner";

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
  const { 
    telemetryInterval, 
    polarBoundary, 
    lastAlertedAssets, 
    setLastAlertedAsset 
  } = useSettingsStore();

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

  // Global Notification Engine
  useEffect(() => {
    if (!data) return;

    const now = Date.now();
    const COOLDOWN_MS = 60000; // 1 minute cooldown per specific alert per asset

    data.forEach(asset => {
      const lastAlerted = lastAlertedAssets[asset.id] || 0;
      if (now - lastAlerted < COOLDOWN_MS) return; // Prevent spam

      // Condition 1: Geofence Breach
      if (Math.abs(asset.position[0]) >= polarBoundary) {
        toast.error(`Geofence Breach: ${asset.name}`, {
          description: `Asset entered hazardous polar restricted zone (Lat: ${asset.position[0].toFixed(2)}).`,
        });
        setLastAlertedAsset(asset.id, now);
      } 
      // Condition 2: Critical Delay / Offline
      else if (asset.status === "offline") {
        toast.warning(`Connection Lost: ${asset.name}`, {
          description: `Asset telemetry feed has dropped.`,
        });
        setLastAlertedAsset(asset.id, now);
      }
      else if (asset.status === "delayed") {
        toast.warning(`Logistical Delay: ${asset.name}`, {
           description: `Asset speed has dropped below optimal levels.`,
        });
        setLastAlertedAsset(asset.id, now);
      }
    });
  }, [data, polarBoundary, lastAlertedAssets, setLastAlertedAsset]);

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
