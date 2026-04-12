"use client";

import { useLiveAssets } from "@/hooks/useLiveAssets";
import { FleetDistributionChart } from "@/components/analytics/FleetDistributionChart";
import { EfficiencyTrendsChart } from "@/components/analytics/EfficiencyTrendsChart";
import { GeofenceAlertsPanel } from "@/components/analytics/GeofenceAlertsPanel";
import { Skeleton } from "@/components/ui/Skeleton";

export default function AnalyticsPage() {
  const { assets } = useLiveAssets();

  if (!assets) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="col-span-2 h-[400px]" />
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Fleet Analytics</h2>
          <p className="text-slate-500 dark:text-slate-400">
            Advanced operational metrics and geospatial intelligence.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {/* Left Column: Charts */}
        <div className="lg:col-span-2 space-y-6">
          <EfficiencyTrendsChart assets={assets} />
          <FleetDistributionChart assets={assets} />
        </div>

        {/* Right Column: Alerts Panel */}
        <div className="lg:col-span-1 h-full">
          <GeofenceAlertsPanel assets={assets} />
        </div>
      </div>
    </div>
  );
}
