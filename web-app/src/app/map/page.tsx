"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { AssetFlyoutList } from "@/components/map/AssetFlyoutList";

// React Leaflet components must be imported dynamically to bypass Next.js Server-Side-Rendering
const InteractiveLiveMap = dynamic(
  () => import("@/components/map/InteractiveLiveMap"),
  { ssr: false, loading: () => <div className="h-full w-full animate-pulse bg-slate-200 dark:bg-slate-800" /> }
);

export default function MapPage() {
  const [focusedLocation, setFocusedLocation] = useState<[number, number] | null>(null);

  return (
    <div className="flex h-[calc(100vh-4rem)] -m-4 sm:-m-6 lg:-m-8">
      {/* Sidebar List Panel */}
      <div className="w-80 border-r border-border bg-card flex flex-col hidden md:flex z-10 shadow-xl relative shadow-slate-200/50 dark:shadow-none">
        <div className="p-4 border-b border-border bg-slate-50 dark:bg-slate-900/50">
          <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">Live Global Fleet</h2>
          <p className="text-xs text-slate-500">Select an asset to locate it globally.</p>
        </div>
        <div className="flex-1 overflow-hidden">
           <AssetFlyoutList onSelectAsset={(pos) => setFocusedLocation(pos)} />
        </div>
      </div>

      {/* Main Fullscreen Interactive Map */}
      <div className="flex-1 relative z-0">
         <InteractiveLiveMap selectedPosition={focusedLocation} />
      </div>
    </div>
  );
}
