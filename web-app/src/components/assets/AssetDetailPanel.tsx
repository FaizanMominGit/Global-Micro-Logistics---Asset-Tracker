"use client";

import { useAssetDetails } from "@/hooks/useAssetDetails";
import { LiveAsset } from "@/hooks/useLiveAssets";
import { Badge } from "@/components/ui/Badge";
import HistoryMap from "./HistoryMap";
import { 
  Truck, 
  Ship, 
  Plane, 
  Activity, 
  Clock, 
  AlertCircle,
  MapPin,
  History,
  ShieldCheck,
  Zap,
  Settings2
} from "lucide-react";
import { useState, useEffect } from "react";

interface AssetDetailPanelProps {
  asset: LiveAsset;
}

export function AssetDetailPanel({ asset }: AssetDetailPanelProps) {
  const { assetHistory, updateAsset, isUpdating } = useAssetDetails(asset.id);
  const [localSpeed, setLocalSpeed] = useState(asset.speed.toString());

  // Sync local speed state when asset prop changes
  useEffect(() => {
    setLocalSpeed(asset.speed.toString());
  }, [asset.speed]);

  const handleSpeedOverride = () => {
    const speed = parseFloat(localSpeed);
    if (!isNaN(speed)) {
      updateAsset({ speed });
    }
  };

  const handleStatusChange = (status: string) => {
    updateAsset({ status });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Mini-Map Header */}
      <HistoryMap 
        position={asset.position} 
        history={assetHistory?.history || []} 
      />

      {/* Header Info */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-border">
        <div className={`p-3 rounded-full ${
          asset.status === "active" ? "bg-green-100 text-green-700" : 
          asset.status === "delayed" ? "bg-amber-100 text-amber-700" : 
          "bg-slate-100 text-slate-700"
        }`}>
          {asset.type === "truck" && <Truck className="h-6 w-6" />}
          {asset.type === "ship" && <Ship className="h-6 w-6" />}
          {asset.type === "plane" && <Plane className="h-6 w-6" />}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">{asset.name}</h3>
            <Badge variant={asset.status === "active" ? "success" : asset.status === "delayed" ? "warning" : "secondary"}>
              {asset.status}
            </Badge>
          </div>
          <p className="text-sm text-slate-500 font-mono mt-1">{asset.id}</p>
        </div>
      </div>

      {/* Command Center (Live Controls) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
          <Settings2 className="h-4 w-4" />
          <span>Command Center</span>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Override Speed (mph)</label>
            <div className="flex gap-2">
              <input 
                type="number" 
                value={localSpeed}
                onChange={(e) => setLocalSpeed(e.target.value)}
                className="flex-1 bg-slate-50 dark:bg-slate-800 border-none rounded-md px-3 py-2 text-sm focus:ring-1 ring-primary-500"
              />
              <button 
                onClick={handleSpeedOverride}
                disabled={isUpdating}
                className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white px-4 py-2 rounded-md text-xs font-bold transition-all"
              >
                {isUpdating ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
          <div className="space-y-2">
             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Force Mission Status</label>
             <div className="flex gap-2">
                {["active", "delayed", "offline"].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    className={`flex-1 py-2 rounded-md text-[10px] font-bold uppercase tracking-tighter border transition-all ${
                      asset.status === s 
                      ? "bg-slate-800 border-slate-800 text-white" 
                      : "bg-transparent border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {s}
                  </button>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* Real-time Telemetry Stats */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard 
          icon={Activity} 
          label="Speed Telemetry" 
          value={`${asset.speed} mph`} 
          color="text-primary-600"
        />
        <StatCard 
          icon={ShieldCheck} 
          label="Signal Integrity" 
          value="Standard" 
          color="text-green-600"
        />
      </div>

      {/* Location Breadcrumbs */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
          <History className="h-4 w-4" />
          <span>Last 5 GPS Pings</span>
        </div>
        <div className="space-y-2">
          {assetHistory?.history?.slice(0, 5).map((log: any, idx: number) => (
             <LogEntry 
               key={log.id} 
               time={new Date(log.timestamp).toLocaleTimeString()} 
               event={`Lat: ${log.lat.toFixed(4)}, Lng: ${log.lng.toFixed(4)}`} 
               status={idx === 0 ? "success" : "info"} 
             />
          ))}
          {!assetHistory?.history?.length && (
            <div className="text-center py-4 text-xs text-slate-400 border border-dashed border-border rounded-xl">
               Awaiting telemetry broadcast...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <div className="p-4 rounded-xl border border-border bg-white dark:bg-slate-900 shadow-sm">
      <Icon className={`h-4 w-4 ${color} mb-2`} />
      <p className="text-xs text-slate-500 font-medium">{label}</p>
      <p className="text-lg font-bold mt-1 tracking-tight">{value}</p>
    </div>
  );
}

function LogEntry({ time, event, status }: any) {
  return (
    <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
      <div className="flex items-center gap-3">
        <span className="text-slate-400 font-mono">{time}</span>
        <span className="font-medium text-slate-700 dark:text-slate-200">{event}</span>
      </div>
      <div className={`h-1.5 w-1.5 rounded-full ${status === 'success' ? 'bg-green-500' : 'bg-blue-500'}`} />
    </div>
  );
}
