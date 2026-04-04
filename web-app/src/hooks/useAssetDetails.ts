"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LiveAsset } from "@/hooks/useLiveAssets";

export function useAssetDetails(assetId: string | null) {
  const queryClient = useQueryClient();

  const { data: assetHistory, isLoading } = useQuery({
    queryKey: ["asset-history", assetId],
    queryFn: async () => {
      if (!assetId) return null;
      const res = await fetch(`/api/assets/${assetId}`);
      if (!res.ok) throw new Error("Failed to fetch history");
      return res.json();
    },
    enabled: !!assetId,
    refetchInterval: 5000,
  });

  const updateAsset = useMutation({
    mutationFn: async (updates: { speed?: number; status?: string }) => {
      if (!assetId) return;
      const res = await fetch(`/api/assets/${assetId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Update failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.invalidateQueries({ queryKey: ["asset-history", assetId] });
    },
  });

  return { 
    assetHistory, 
    isLoading, 
    updateAsset: updateAsset.mutate,
    isUpdating: updateAsset.isPending 
  };
}
