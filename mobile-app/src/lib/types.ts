export type AssetType = "Ship" | "Truck" | "Plane";
export type AssetStatus = "active" | "idle" | "alert";

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  status: AssetStatus;
  lat: number;
  lng: number;
  speed: number;
  createdAt: string;
  updatedAt: string;
}

export interface LocationHistoryEntry {
  id: string;
  assetId: string;
  lat: number;
  lng: number;
  speed: number;
  timestamp: string;
}
