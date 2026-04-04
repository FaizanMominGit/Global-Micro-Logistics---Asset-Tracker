"use client";

import { useState } from "react";
import { Sheet } from "@/components/ui/Sheet";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Truck, Ship, Plane, Plus, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface ProvisionAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ASSET_TYPES = [
  { id: "truck", label: "Ground Transport", icon: Truck },
  { id: "ship", label: "Maritime Vessel", icon: Ship },
  { id: "plane", label: "Air Cargo", icon: Plane },
];

export function ProvisionAssetModal({ isOpen, onClose }: ProvisionAssetModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<string>("truck");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, type }),
      });

      if (!res.ok) throw new Error("Provisioning failed");
      
      // Invalidate query to refresh the list
      await queryClient.invalidateQueries({ queryKey: ["live-assets"] });
      
      onClose();
      setName("");
      setType("truck");
    } catch (error) {
      console.error(error);
      alert("Failed to provision asset. Please check system logs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      title="Provision Global Asset"
      description="Register a new high-value asset into the OmniTrack ecosystem."
    >
      <form onSubmit={handleSubmit} className="space-y-8 py-4">
        <div className="space-y-4">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Asset Identification</label>
          <Input 
            placeholder="e.g. Pacific Voyager-X1" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border-none focus-visible:ring-1"
            required
          />
        </div>

        <div className="space-y-4">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Operational Category</label>
          <div className="grid grid-cols-1 gap-3">
            {ASSET_TYPES.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id)}
                  className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                    type === t.id 
                    ? "bg-slate-800 border-slate-800 text-white shadow-md scale-[1.02]" 
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <div className={`p-2 rounded-lg ${type === t.id ? "bg-slate-700" : "bg-slate-100 dark:bg-slate-800"}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-sm tracking-tight">{t.label}</p>
                    <p className="text-[10px] opacity-70 uppercase font-mono">{t.id}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-8 space-y-3">
          <Button 
            type="submit" 
            disabled={isSubmitting || !name.trim()}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white h-12 rounded-xl text-sm font-bold shadow-lg"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Initialize Provisioning
              </>
            )}
          </Button>
          <p className="text-center text-[10px] text-slate-500 font-medium">
            System initialization may take 2-3 seconds for global GPS synchronization.
          </p>
        </div>
      </form>
    </Sheet>
  );
}
