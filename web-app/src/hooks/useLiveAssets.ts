"use client";

import { useState, useEffect } from "react";

export type AssetType = "ship" | "truck" | "plane";

export interface LiveAsset {
  id: string;
  name: string;
  type: AssetType;
  position: [number, number]; // [lat, lng]
  status: "active" | "delayed" | "offline";
  speed: number;
}

const initialAssets: LiveAsset[] = [
  { id: "SH-102", name: "Ever Given II", type: "ship", position: [25.2048, 55.2708], status: "active", speed: 22 },
  { id: "TR-505", name: "Euro Hauler", type: "truck", position: [48.8566, 2.3522], status: "active", speed: 65 },
  { id: "PL-707", name: "Global Air Freight", type: "plane", position: [40.7128, -74.0060], status: "active", speed: 450 },
  { id: "SH-404", name: "Pacific Carrier", type: "ship", position: [35.6762, 139.6503], status: "delayed", speed: 12 },
  { id: "TR-808", name: "Desert Runner", type: "truck", position: [-33.8688, 151.2093], status: "active", speed: 70 },
  { id: "TR-909", name: "Nordic Hauler", type: "truck", position: [59.3293, 18.0686], status: "offline", speed: 0 },
];

export function useLiveAssets() {
  const [assets, setAssets] = useState<LiveAsset[]>(initialAssets);

  useEffect(() => {
    // Simulate real-time GPS telemetry WebSocket stream updating every 2 seconds
    const interval = setInterval(() => {
      setAssets((currentAssets) =>
        currentAssets.map((asset) => {
          if (asset.status === "offline") return asset;
          
          // Add a small randomized drift to lat/lng to simulate continuous movement
          const latJitter = (Math.random() - 0.5) * 0.5;
          const lngJitter = (Math.random() - 0.5) * 0.5;
          
          return {
            ...asset,
            position: [
              asset.position[0] + latJitter,
              asset.position[1] + lngJitter,
            ],
          };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return { assets };
}
