"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useLiveAssets, LiveAsset } from "@/hooks/useLiveAssets";
import "leaflet/dist/leaflet.css";
import { divIcon } from "leaflet";
import { renderToString } from "react-dom/server";
import { Truck, Ship, Plane } from "lucide-react";

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

export default function LiveMap() {
  const { assets } = useLiveAssets();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-full w-full animate-pulse bg-slate-200 dark:bg-slate-800 rounded-lg"></div>;

  return (
    <div className="h-full w-full relative z-0">
      <MapContainer 
        center={[30, 0]} 
        zoom={2} 
        scrollWheelZoom={true} 
        className="h-full w-full rounded-lg outline-none z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
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
