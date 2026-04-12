"use client";

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { LiveAsset } from '@/hooks/useLiveAssets';
import { useSettingsStore } from '@/store/useSettingsStore';
import { AlertCircle, Navigation, ShieldAlert, ShieldCheck } from 'lucide-react';

interface GeofenceAlertsPanelProps {
  assets: LiveAsset[];
}

export function GeofenceAlertsPanel({ assets }: GeofenceAlertsPanelProps) {
  const polarBoundary = useSettingsStore(state => state.polarBoundary);

  const alerts = useMemo(() => {
      // Determine alerts based on bound settings and status thresholds
      const generated = assets.map(asset => {
        const lat = asset.position[0];
        const lng = asset.position[1];
        
        // Simulate High-Risk Zones dynamically based on user settings
        const inDangerZone = (lat > polarBoundary || lat < -polarBoundary); // Polar Regions warning
      const isSlowShip = asset.type === 'ship' && asset.speed < 10 && asset.status === 'active'; // Ships crawling = pirate risk/ice?
      const isDelayed = asset.status === 'delayed';

      if (inDangerZone) {
        return { asset, severity: 'high', type: 'geofence', message: `Entering extreme latitude zone [${lat.toFixed(2)}, ${lng.toFixed(2)}]` };
      }
      if (isDelayed) {
        return { asset, severity: 'medium', type: 'status', message: `Asset delayed in transit. Last speed: ${asset.speed} mph` };
      }
      if (isSlowShip) {
        return { asset, severity: 'low', type: 'efficiency', message: 'Vessel speed critically low in active waters.' };
      }
      return null;
    }).filter(Boolean);

    // Sort by severity (high -> medium -> low)
    const severityRank: Record<string, number> = { high: 3, medium: 2, low: 1 };
    return generated.sort((a, b) => severityRank[b!.severity] - severityRank[a!.severity]);
  }, [assets, polarBoundary]);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShieldAlert className="mr-2 h-5 w-5 text-red-500" />
          Critical Alerts & Geofencing
        </CardTitle>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Live spatial safety and operational warnings</p>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto max-h-[600px] pr-2">
        {alerts.length > 0 ? (
          <div className="space-y-4">
            {alerts.map((alert, i) => (
              <div 
                key={`${alert!.asset.id}-${i}`}
                className={`p-4 rounded-lg flex gap-4 items-start border-l-4 
                  ${alert!.severity === 'high' ? 'bg-red-50/50 border-red-500 dark:bg-red-950/20' : 
                    alert!.severity === 'medium' ? 'bg-amber-50/50 border-amber-500 dark:bg-amber-950/20' : 
                    'bg-slate-50 border-slate-400 dark:bg-slate-800'}`}
              >
                <div className="mt-1">
                  {alert!.severity === 'high' ? <AlertCircle className="text-red-500 h-5 w-5" /> :
                   alert!.severity === 'medium' ? <AlertCircle className="text-amber-500 h-5 w-5" /> :
                   <Navigation className="text-slate-500 h-5 w-5" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm flex items-center justify-between">
                    {alert!.asset.name}
                    <span className="text-xs uppercase tracking-wider text-slate-500">{alert!.asset.type}</span>
                  </h4>
                  <p className="text-sm mt-1 text-slate-600 dark:text-slate-300">
                    {alert!.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-3 py-12">
            <ShieldCheck className="h-12 w-12 text-green-500 opacity-50" />
            <p>All assets within safe operational bounds.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
