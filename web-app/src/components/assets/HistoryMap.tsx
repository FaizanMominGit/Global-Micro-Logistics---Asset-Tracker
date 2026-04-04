"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { divIcon } from "leaflet";
import { renderToString } from "react-dom/server";
import { Navigation } from "lucide-react";

interface HistoryMapProps {
  position: [number, number];
  history: { lat: number; lng: number }[];
}

export default function HistoryMap({ position, history }: HistoryMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return (
    <div className="h-48 w-full bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse flex items-center justify-center">
      <span className="text-slate-400 text-xs font-mono">Initializing Telemetry Map...</span>
    </div>
  );

  const trail = history.map(h => [h.lat, h.lng] as [number, number]);
  // Add current position to the start of the trail
  const fullTrail = [position, ...trail];

  const currentPosIcon = divIcon({
    html: renderToString(
      <div className="h-4 w-4 bg-primary-600 rounded-full border-2 border-white shadow-md animate-pulse" />
    ),
    className: "bg-transparent",
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

  return (
    <div className="h-48 w-full rounded-xl overflow-hidden border border-border shadow-inner relative z-0">
      <MapContainer 
        center={position} 
        zoom={13} 
        scrollWheelZoom={false} 
        zoomControl={false}
        attributionControl={false}
        className="h-full w-full z-0"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <Polyline 
          positions={fullTrail} 
          pathOptions={{ 
            color: '#2563eb', 
            weight: 3, 
            dashArray: '5, 10',
            opacity: 0.6 
          }} 
        />
        <Marker position={position} icon={currentPosIcon} />
      </MapContainer>
      <div className="absolute top-2 right-2 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-slate-500 uppercase tracking-tighter border border-border">
        Live Telemetry
      </div>
    </div>
  );
}
