import React, { useCallback, useMemo, useRef } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import type { Asset } from "../lib/types";
import { StatusBadge } from "./StatusBadge";

interface AssetDetailSheetProps {
  asset: Asset | null;
  onClose: () => void;
}

const TYPE_ICON: Record<string, string> = {
  Ship: "🚢",
  Truck: "🚛",
  Plane: "✈️",
};

export function AssetDetailSheet({ asset, onClose }: AssetDetailSheetProps) {
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["55%", "85%"], []);

  const handleSheetChange = useCallback(
    (index: number) => {
      if (index === -1) onClose();
    },
    [onClose]
  );

  if (!asset) return null;

  return (
    <BottomSheet
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChange}
      enablePanDownToClose
      backgroundStyle={styles.sheetBg}
      handleIndicatorStyle={styles.indicator}
    >
      <BottomSheetView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.typeIcon}>{TYPE_ICON[asset.type] ?? "📦"}</Text>
          <View style={styles.headerText}>
            <Text style={styles.assetName}>{asset.name}</Text>
            <Text style={styles.assetType}>{asset.type}</Text>
          </View>
          <StatusBadge status={asset.status} />
        </View>

        <View style={styles.divider} />

        {/* Telemetry Grid */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Live Telemetry</Text>

          <View style={styles.grid}>
            <TelemetryCell label="Latitude" value={asset.lat.toFixed(5)} />
            <TelemetryCell label="Longitude" value={asset.lng.toFixed(5)} />
            <TelemetryCell label="Speed" value={`${asset.speed} km/h`} />
            <TelemetryCell label="Asset ID" value={asset.id.slice(0, 8) + "…"} />
          </View>

          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>Timestamps</Text>
          <View style={styles.timestampRow}>
            <Text style={styles.tsLabel}>Provisioned</Text>
            <Text style={styles.tsValue}>
              {new Date(asset.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.timestampRow}>
            <Text style={styles.tsLabel}>Last Update</Text>
            <Text style={styles.tsValue}>
              {new Date(asset.updatedAt).toLocaleTimeString()}
            </Text>
          </View>
        </ScrollView>
      </BottomSheetView>
    </BottomSheet>
  );
}

function TelemetryCell({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.cell}>
      <Text style={styles.cellValue}>{value}</Text>
      <Text style={styles.cellLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sheetBg: { backgroundColor: "#0f172a" },
  indicator: { backgroundColor: "#374151" },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 8 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
  },
  typeIcon: { fontSize: 36 },
  headerText: { flex: 1 },
  assetName: { fontSize: 20, fontWeight: "700", color: "#f9fafb" },
  assetType: { fontSize: 14, color: "#6b7280", marginTop: 2 },
  divider: { height: 1, backgroundColor: "#1f2937", marginVertical: 16 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6366f1",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  cell: {
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: 14,
    width: "47%",
  },
  cellValue: { fontSize: 16, fontWeight: "700", color: "#e5e7eb" },
  cellLabel: { fontSize: 11, color: "#6b7280", marginTop: 4, fontWeight: "500" },
  timestampRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#1f2937",
  },
  tsLabel: { fontSize: 14, color: "#6b7280" },
  tsValue: { fontSize: 14, color: "#e5e7eb", fontWeight: "600" },
});
