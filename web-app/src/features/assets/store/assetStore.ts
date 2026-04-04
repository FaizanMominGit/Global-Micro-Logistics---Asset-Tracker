import { create } from "zustand";

interface AssetStore {
  selectedAssetId: string | null;
  selectAsset: (id: string) => void;
  clearSelection: () => void;
}

export const useAssetStore = create<AssetStore>((set) => ({
  selectedAssetId: null,
  selectAsset: (id) => set({ selectedAssetId: id }),
  clearSelection: () => set({ selectedAssetId: null }),
}));
