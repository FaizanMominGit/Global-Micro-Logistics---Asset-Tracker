"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { LiveAsset } from '@/hooks/useLiveAssets';

interface FleetDistributionChartProps {
  assets: LiveAsset[];
}

export function FleetDistributionChart({ assets }: FleetDistributionChartProps) {
  // Aggregate data by status
  const statusData = [
    { name: 'Active', value: assets.filter(a => a.status === 'active').length, color: '#10b981' }, // green-500
    { name: 'Delayed', value: assets.filter(a => a.status === 'delayed').length, color: '#f59e0b' }, // amber-500
    { name: 'Offline', value: assets.filter(a => a.status === 'offline').length, color: '#64748b' }, // slate-500
  ].filter(d => d.value > 0);

  // Aggregate data by type
  const typeData = [
    { name: 'Ship', value: assets.filter(a => a.type === 'ship').length, color: '#3b82f6' }, // blue-500
    { name: 'Truck', value: assets.filter(a => a.type === 'truck').length, color: '#8b5cf6' }, // violet-500
    { name: 'Plane', value: assets.filter(a => a.type === 'plane').length, color: '#0ea5e9' }, // sky-500
  ].filter(d => d.value > 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Status Overview</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
             <div className="flex items-center justify-center h-full text-slate-500">No data available</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Asset Types</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          {typeData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500">No data available</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
