"use client";

import { useState, useEffect } from "react";
import { useLiveAssets, LiveAsset } from "@/hooks/useLiveAssets";
import { AssetTable } from "@/components/assets/AssetTable";
import { AssetFilters } from "@/components/assets/AssetFilters";
import { Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";
import { AssetDetailPanel } from "@/components/assets/AssetDetailPanel";
import { ProvisionAssetModal } from "@/components/assets/ProvisionAssetModal";

export default function AssetsPage() {
  const { assets } = useLiveAssets();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedAsset, setSelectedAsset] = useState<LiveAsset | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = 
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || asset.status === statusFilter;
    const matchesType = typeFilter === "all" || asset.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleRowClick = (asset: LiveAsset) => {
    setSelectedAsset(asset);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-3">
            <Package className="h-8 w-8 text-primary-600" />
            Global Fleet Management
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Real-time control center for {assets.length} synchronized assets.
          </p>
        </div>
        <Button 
          onClick={() => setIsProvisionModalOpen(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white shadow-lg"
        >
          <Plus className="mr-2 h-4 w-4" />
          Provision New Asset
        </Button>
      </div>

      <AssetFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
      />

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-border p-6 overflow-hidden">
        <AssetTable 
          assets={filteredAssets} 
          onRowClick={handleRowClick}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 font-medium px-2 uppercase tracking-widest">
         <span>Last System Sync: {mounted ? new Date().toLocaleTimeString() : "--:--:--"}</span>
         <span>Encryption: AES-256 Validated</span>
      </div>

      {/* Asset Detail Drawer */}
      {selectedAsset && (
        <Sheet 
          isOpen={isDrawerOpen} 
          onClose={() => setIsDrawerOpen(false)}
          title="Telemetry Drill-down"
          description={`Real-time data for ${selectedAsset.name}`}
        >
          <AssetDetailPanel 
            asset={selectedAsset} 
            onClose={() => setIsDrawerOpen(false)} 
          />
        </Sheet>
      )}

      {/* Provisioning Sheet */}
      <ProvisionAssetModal 
        isOpen={isProvisionModalOpen}
        onClose={() => setIsProvisionModalOpen(false)}
      />
    </div>
  );
}
