"use client";

import { useLiveAssets } from "@/hooks/useLiveAssets";
import { Truck, Ship, Plane, Navigation } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface AssetFlyoutListProps {
  onSelectAsset: (position: [number, number]) => void;
}

export function AssetFlyoutList({ onSelectAsset }: AssetFlyoutListProps) {
  const { assets } = useLiveAssets();

  if (assets.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <p className="text-sm text-slate-500 animate-pulse">Scanning global signals...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-4 h-full overflow-y-auto">
      {assets.map((asset) => {
        let IconComponent = Ship;
        if (asset.type === "truck") IconComponent = Truck;
        if (asset.type === "plane") IconComponent = Plane;

        // Determine status indicator color
        let statusColor = "bg-primary-500";
        if (asset.status === "delayed") statusColor = "bg-amber-500";
        if (asset.status === "offline") statusColor = "bg-slate-400";

        return (
          <button 
            key={asset.id}
            onClick={() => onSelectAsset(asset.position)}
            className="w-full text-left transition-transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Card className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-l-4" style={{ borderLeftColor: statusColor === 'bg-primary-500' ? '#3b82f6' : statusColor === 'bg-amber-500' ? '#f59e0b' : '#94a3b8' }}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{asset.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1 mt-0.5">
                      <span className={`inline-block w-1.5 h-1.5 rounded-full ${statusColor}`} />
                      {asset.status}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                   <p className="text-xs font-mono text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-1.5 rounded">
                     {asset.speed} mph
                   </p>
                   <Navigation className="h-3.5 w-3.5 text-slate-400 mt-2 hover:text-primary-500" />
                </div>
              </div>
            </Card>
          </button>
        );
      })}
    </div>
  );
}
