import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useAssets, useDashboardMetrics } from "../../src/hooks/useAssets";
import { KpiCard } from "../../src/components/KpiCard";
import type { AssetStatus } from "../../src/lib/types";

const STATUS_BREAKDOWN: { status: AssetStatus; label: string; emoji: string; color: string }[] = [
  { status: "active", label: "Active", emoji: "🟢", color: "#34d399" },
  { status: "idle", label: "Idle", emoji: "🟡", color: "#fbbf24" },
  { status: "alert", label: "Alert", emoji: "🔴", color: "#f87171" },
];

export default function DashboardScreen() {
  const { data: assets, isLoading, refetch, isRefetching } = useAssets();
  const { activeCount, avgSpeed, alertCount } = useDashboardMetrics(assets);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          tintColor="#6366f1"
          colors={["#6366f1"]}
        />
      }
    >
      {/* Header */}
      <View style={styles.heroRow}>
        <View>
          <Text style={styles.heroTitle}>Fleet Overview</Text>
          <Text style={styles.heroSub}>
            {assets?.length ?? 0} assets tracked globally
          </Text>
        </View>
        {isLoading && <ActivityIndicator color="#6366f1" />}
      </View>

      {/* KPI Row */}
      <View style={styles.kpiRow}>
        <KpiCard
          label="Active Shipments"
          value={activeCount}
          icon="✈️"
          color="#34d399"
        />
        <KpiCard
          label="Avg Speed"
          value={avgSpeed}
          unit="km/h"
          icon="⚡"
          color="#6366f1"
        />
        <KpiCard
          label="Alerts"
          value={alertCount}
          icon="🚨"
          color="#f87171"
        />
      </View>

      {/* Fleet Status Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fleet Status Breakdown</Text>
        {STATUS_BREAKDOWN.map(({ status, label, emoji, color }) => {
          const count = assets?.filter((a) => a.status === status).length ?? 0;
          const total = assets?.length ?? 1;
          const percent = Math.round((count / total) * 100);
          return (
            <View key={status} style={styles.breakdownRow}>
              <Text style={styles.breakdownEmoji}>{emoji}</Text>
              <View style={styles.breakdownInfo}>
                <View style={styles.breakdownTopRow}>
                  <Text style={styles.breakdownLabel}>{label}</Text>
                  <Text style={[styles.breakdownCount, { color }]}>{count}</Text>
                </View>
                <View style={styles.progressBg}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${percent}%`, backgroundColor: color },
                    ]}
                  />
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {/* Recent Assets */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Assets</Text>
        {(assets ?? []).slice(0, 5).map((asset) => (
          <View key={asset.id} style={styles.assetRow}>
            <Text style={styles.assetRowIcon}>
              {asset.type === "Ship" ? "🚢" : asset.type === "Plane" ? "✈️" : "🚛"}
            </Text>
            <View style={styles.assetRowInfo}>
              <Text style={styles.assetRowName}>{asset.name}</Text>
              <Text style={styles.assetRowMeta}>
                {asset.lat.toFixed(2)}°, {asset.lng.toFixed(2)}° · {asset.speed} km/h
              </Text>
            </View>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor:
                    asset.status === "active"
                      ? "#34d399"
                      : asset.status === "alert"
                      ? "#f87171"
                      : "#fbbf24",
                },
              ]}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0f1e" },
  content: { padding: 20, paddingBottom: 40 },
  heroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  heroTitle: { fontSize: 26, fontWeight: "800", color: "#f9fafb", letterSpacing: -0.5 },
  heroSub: { fontSize: 13, color: "#6b7280", marginTop: 2 },
  kpiRow: { flexDirection: "row", marginHorizontal: -6, marginBottom: 28 },
  section: {
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6366f1",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 16,
  },
  breakdownRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 12,
  },
  breakdownEmoji: { fontSize: 20 },
  breakdownInfo: { flex: 1 },
  breakdownTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  breakdownLabel: { fontSize: 14, color: "#d1d5db", fontWeight: "600" },
  breakdownCount: { fontSize: 14, fontWeight: "800" },
  progressBg: {
    height: 6,
    backgroundColor: "#1f2937",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: { height: 6, borderRadius: 3 },
  assetRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#1f2937",
    gap: 12,
  },
  assetRowIcon: { fontSize: 22 },
  assetRowInfo: { flex: 1 },
  assetRowName: { fontSize: 15, color: "#f9fafb", fontWeight: "600" },
  assetRowMeta: { fontSize: 12, color: "#6b7280", marginTop: 2 },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
});
