"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useLiveAssets, LiveAsset } from "@/hooks/useLiveAssets";
import "leaflet/dist/leaflet.css";
import { divIcon } from "leaflet";
import { renderToString } from "react-dom/server";
import { Truck, Ship, Plane } from "lucide-react";
import { useTheme } from "next-themes";

function getAssetIcon(type: LiveAsset["type"], status: LiveAsset["status"]) {
  let IconComponent = Ship;
  if (type === "truck") IconComponent = Truck;
  if (type === "plane") IconComponent = Plane;

  let colorClass = "text-primary-600 bg-primary-100";
  if (status === "delayed") colorClass = "text-amber-600 bg-amber-100";
  if (status === "offline") colorClass = "text-slate-500 bg-slate-100";

  const html = renderToString(
    <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white shadow-md outline-none ${colorClass}`}>
      <IconComponent className="h-4 w-4" />
    </div>
  );

  return divIcon({
    html,
    className: "bg-transparent outline-none border-none",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

function MapController({ targetPosition }: { targetPosition: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (targetPosition) {
      map.flyTo(targetPosition, 6, {
        animate: true,
        duration: 1.5,
      });
    }
  }, [targetPosition, map]);

  return null;
}

export default function InteractiveLiveMap({ selectedPosition }: { selectedPosition: [number, number] | null }) {
  const { assets } = useLiveAssets();
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-full w-full animate-pulse bg-slate-200 dark:bg-slate-800 rounded-lg"></div>;

  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const tileUrl = isDark 
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

  return (
    <div className="h-full w-full relative z-0">
      <MapContainer 
        center={[30, 0]} 
        zoom={3} 
        scrollWheelZoom={true} 
        className="h-full w-full outline-none z-0 bg-slate-50 dark:bg-slate-900"
      >
        <MapController targetPosition={selectedPosition} />
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url={tileUrl}
        />
        {assets.map((asset) => (
          <Marker 
            key={asset.id} 
            position={asset.position} 
            icon={getAssetIcon(asset.type, asset.status)}
          >
            <Popup className="rounded-lg shadow-lg">
              <div className="p-1">
                <h3 className="font-bold text-slate-800">{asset.name}</h3>
                <p className="text-xs text-slate-500 mt-1 tracking-wider uppercase font-semibold">{asset.type} • {asset.status}</p>
                <div className="mt-2 border-t pt-2 w-full">
                   <p className="text-sm font-medium text-slate-700">Speed: {asset.speed} mph</p>
                   <p className="text-xs text-slate-500 mt-0.5">[{asset.position[0].toFixed(2)}, {asset.position[1].toFixed(2)}]</p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
