"use client";

import { Input } from "@/components/ui/Input";
import { Search, Filter } from "lucide-react";

interface AssetFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  typeFilter: string;
  setTypeFilter: (type: string) => void;
}

export function AssetFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
}: AssetFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-border shadow-sm">
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search by name or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-slate-50 dark:bg-slate-800 border-none focus-visible:ring-1"
        />
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-500 whitespace-nowrap">
          <Filter className="h-4 w-4" />
          <span>Filter by:</span>
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="delayed">Delayed</option>
          <option value="offline">Offline</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="all">All Types</option>
          <option value="ship">Ship</option>
          <option value="truck">Truck</option>
          <option value="plane">Plane</option>
        </select>
      </div>
    </div>
  );
}
