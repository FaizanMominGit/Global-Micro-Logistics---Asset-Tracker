"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useSettingsStore } from "@/store/useSettingsStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Settings, Moon, Sun, Monitor, Activity, ShieldAlert } from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { telemetryInterval, polarBoundary, setTelemetryInterval, setPolarBoundary } = useSettingsStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Prevent hydration mismatch for next-themes
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">System Settings</h2>
          <p className="text-slate-500 dark:text-slate-400">
            Configure global telemetry rules and UI preferences.
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              Appearance
            </CardTitle>
            <p className="text-sm text-slate-500">Customize the UI theme.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-4">
              <button
                onClick={() => setTheme("light")}
                className={`flex items-center px-4 py-2 rounded-md border ${theme === 'light' ? 'border-primary-600 bg-primary-50 dark:bg-primary-950/20 text-primary-600' : 'border-slate-200 dark:border-slate-800'}`}
              >
                <Sun className="mr-2 h-4 w-4" />
                Light
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`flex items-center px-4 py-2 rounded-md border ${theme === 'dark' ? 'border-primary-600 bg-primary-50 dark:bg-primary-950/20 text-primary-600' : 'border-slate-200 dark:border-slate-800'}`}
              >
                <Moon className="mr-2 h-4 w-4" />
                Dark
              </button>
              <button
                onClick={() => setTheme("system")}
                className={`flex items-center px-4 py-2 rounded-md border ${theme === 'system' ? 'border-primary-600 bg-primary-50 dark:bg-primary-950/20 text-primary-600' : 'border-slate-200 dark:border-slate-800'}`}
              >
                <Monitor className="mr-2 h-4 w-4" />
                System
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Telemetry Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5" />
              Telemetry Engine
            </CardTitle>
            <p className="text-sm text-slate-500">Adjust the backend synchronization polling interval.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Sync Interval: {telemetryInterval}ms</label>
                <span className="text-sm text-slate-500">{telemetryInterval / 1000} seconds</span>
              </div>
              <input 
                type="range" 
                min="500" 
                max="10000" 
                step="500"
                value={telemetryInterval}
                onChange={(e) => setTelemetryInterval(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>Fast (High Load)</span>
                <span>Slow (Low Load)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Geofencing Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShieldAlert className="mr-2 h-5 w-5" />
              Geofence Thresholds
            </CardTitle>
            <p className="text-sm text-slate-500">Define the latitude boundaries for Polar Hazard warnings.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Polar Hazard Map Boundary</label>
                <span className="text-sm text-slate-500">±{polarBoundary}° Latitude</span>
              </div>
              <input 
                type="range" 
                min="40" 
                max="85" 
                step="1"
                value={polarBoundary}
                onChange={(e) => setPolarBoundary(parseInt(e.target.value))}
                className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer dark:bg-red-950"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>Wider Danger Zone (40°)</span>
                <span>Strict Polar Zone (85°)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
