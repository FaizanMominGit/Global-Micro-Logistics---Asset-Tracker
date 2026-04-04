"use client";

import { LiveAsset } from "@/hooks/useLiveAssets";
import { Badge } from "@/components/ui/Badge";
import { 
  Truck, 
  Ship, 
  Plane, 
  Activity, 
  Clock, 
  AlertCircle,
  MapPin,
  Navigation,
  History,
  ShieldCheck
} from "lucide-react";

interface AssetDetailPanelProps {
  asset: LiveAsset;
}

export function AssetDetailPanel({ asset }: AssetDetailPanelProps) {
  return (
    <div className="space-y-8">
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
            <Badge 
              variant={asset.status === "active" ? "success" : asset.status === "delayed" ? "warning" : "secondary"}
              className="capitalize"
            >
              {asset.status}
            </Badge>
          </div>
          <p className="text-sm text-slate-500 font-mono mt-1">{asset.id}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard 
          icon={Activity} 
          label="Current Speed" 
          value={`${asset.speed} mph`} 
          color="text-primary-600"
        />
        <StatCard 
          icon={ShieldCheck} 
          label="Signal Strength" 
          value="Strong" 
          color="text-green-600"
        />
      </div>

      {/* Location */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
          <MapPin className="h-4 w-4" />
          <span>Real-time Coordinates</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-sm shadow-inner">
          <div className="flex justify-between">
            <span className="text-slate-500">Latitude</span>
            <span>{asset.position[0].toFixed(6)}°</span>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-slate-500">Longitude</span>
            <span>{asset.position[1].toFixed(6)}°</span>
          </div>
        </div>
      </div>

      {/* Telemetry Log (Mocked) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
          <History className="h-4 w-4" />
          <span>Recent Telemetry Logs</span>
        </div>
        <div className="space-y-3">
          <LogEntry time="14:02:45" event="GPS Refreshed" status="success" />
          <LogEntry time="13:58:12" event="Course Adjusted" status="info" />
          <LogEntry time="13:45:00" event="En-route Update" status="success" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 flex gap-3">
        <button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-md">
          Ping Asset
        </button>
        <button className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold py-2 px-4 rounded-lg transition-colors">
          View History
        </button>
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
