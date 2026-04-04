"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import { LiveAsset, AssetType } from "@/hooks/useLiveAssets";
import { Badge } from "@/components/ui/Badge";
import { Truck, Ship, Plane, Activity, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const columns: ColumnDef<LiveAsset>[] = [
  {
    accessorKey: "id",
    header: "Asset ID",
    cell: ({ row }) => <span className="font-mono font-medium truncate max-w-[100px] block">{row.getValue("id")}</span>,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <span className="font-semibold">{row.getValue("name")}</span>,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as AssetType;
      return (
        <div className="flex items-center gap-2">
          {type === "truck" && <Truck className="h-4 w-4 text-blue-500" />}
          {type === "ship" && <Ship className="h-4 w-4 text-cyan-500" />}
          {type === "plane" && <Plane className="h-4 w-4 text-purple-500" />}
          <span className="capitalize">{type}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as "active" | "delayed" | "offline";
      return (
        <Badge 
          variant={status === "active" ? "success" : status === "delayed" ? "warning" : "secondary"}
          className="capitalize gap-1.5 px-3"
        >
          {status === "active" && <Activity className="h-3 w-3" />}
          {status === "delayed" && <Clock className="h-3 w-3" />}
          {status === "offline" && <AlertCircle className="h-3 w-3" />}
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "speed",
    header: "Avg Speed",
    cell: ({ row }) => <span className="font-mono">{row.getValue("speed")} mph</span>,
  },
  {
    id: "coordinates",
    header: "Position",
    cell: ({ row }) => {
      const asset = row.original;
      return (
        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          {asset.position[0].toFixed(4)}, {asset.position[1].toFixed(4)}
        </span>
      );
    },
  },
];

interface AssetTableProps {
  assets: LiveAsset[];
  onRowClick?: (asset: LiveAsset) => void;
}

export function AssetTable({ assets, onRowClick }: AssetTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data: assets,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div>
      <div className="rounded-md border border-border bg-card">
        <div className="w-full overflow-auto text-slate-800 dark:text-slate-100">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b [&_tr]:border-border bg-slate-50 dark:bg-slate-900/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-border transition-colors hover:bg-slate-100/50 dark:hover:bg-slate-800/50">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="h-12 px-4 text-left align-middle font-medium text-slate-500 dark:text-slate-400"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => onRowClick && onRowClick(row.original)}
                    className={cn(
                      "border-b border-border transition-colors hover:bg-primary-50/50 dark:hover:bg-primary-950/20 group",
                      onRowClick && "cursor-pointer"
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-4 align-middle">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="h-24 text-center">
                    No matching assets found in the current fleet sync.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="border-slate-200 dark:border-slate-800"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="border-slate-200 dark:border-slate-800"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
