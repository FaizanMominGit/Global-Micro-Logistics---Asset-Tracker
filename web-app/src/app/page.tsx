"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { Package, Activity, AlertTriangle, Truck } from "lucide-react";
import dynamic from 'next/dynamic';

const LiveMap = dynamic(() => import('@/components/map/LiveMap'), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-full min-h-[300px] rounded-lg" />
});

import { useLiveAssets } from "@/hooks/useLiveAssets";

export default function DashboardPage() {
  const { assets } = useLiveAssets();

  // Dynamic calculations from real-time database state
  const activeCount = assets.filter(a => a.status === "active").length;
  const delayedCount = assets.filter(a => a.status === "delayed").length;
  const offlineCount = assets.filter(a => a.status === "offline").length;
  const totalFleet = assets.length;
  
  // Calculate average speed as a proxy for transit efficiency
  const avgSpeed = totalFleet > 0 
    ? Math.round(assets.reduce((acc, a) => acc + a.speed, 0) / totalFleet)
    : 0;

  // Last 5 recently updated assets
  const recentAssets = [...assets].sort((a, b) => b.speed - a.speed).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard Overview</h2>
          <p className="text-slate-500 dark:text-slate-400">
            Real-time tracking and metrics for global assets.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Active Shipments" icon={Package} value={activeCount.toString()} description={`${activeCount} carriers currently in transit`} />
        <MetricCard title="Avg Fleet Speed" icon={Activity} value={`${avgSpeed} mph`} description="Collective movement efficiency" />
        <MetricCard title="Alerts & Delays" icon={AlertTriangle} value={delayedCount.toString()} description={`${delayedCount} critical delays detected`} alert={delayedCount > 0} />
        <MetricCard title="Total Fleet" icon={Truck} value={totalFleet.toString()} description={`${offlineCount} currently offline`} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-full lg:col-span-4">
          <CardHeader>
            <CardTitle>Global Asset Map</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px] p-6 pt-0 relative z-0">
            <LiveMap />
          </CardContent>
        </Card>

        <Card className="col-span-full lg:col-span-3">
          <CardHeader>
            <CardTitle>High-Speed Telemetry</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assets.length === 0 ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-[80%]" />
                      <Skeleton className="h-4 w-[60%]" />
                    </div>
                  </div>
                ))
              ) : (
                recentAssets.map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${asset.status === "active" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                        <Activity className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-none">{asset.name}</p>
                        <p className="text-xs text-slate-500 mt-1 uppercase tracking-tighter">{asset.type} • {asset.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{asset.speed} mph</p>
                      <p className={`text-[10px] ${asset.status === "active" ? "text-green-600" : "text-amber-600"}`}>In Sync</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({ title, icon: Icon, value, description, alert }: any) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${alert ? "text-red-500" : "text-slate-500"}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}
