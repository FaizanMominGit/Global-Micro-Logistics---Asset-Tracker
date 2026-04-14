import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { Asset } from "../lib/types";
import { useSettingsStore } from "../store/useSettingsStore";

export function useAssets() {
  const pollingIntervalMs = useSettingsStore((s) => s.pollingIntervalMs);

  return useQuery<Asset[]>({
    queryKey: ["assets"],
    queryFn: () => api.get<Asset[]>("/api/assets"),
    refetchInterval: pollingIntervalMs,
    staleTime: 0,
  });
}

export function useDashboardMetrics(assets: Asset[] | undefined) {
  if (!assets) return { activeCount: 0, avgSpeed: 0, alertCount: 0 };

  const activeCount = assets.filter((a) => a.status === "active").length;
  const alertCount = assets.filter((a) => a.status === "alert").length;
  const avgSpeed =
    assets.length > 0
      ? Math.round(assets.reduce((sum, a) => sum + a.speed, 0) / assets.length)
      : 0;

  return { activeCount, avgSpeed, alertCount };
}
