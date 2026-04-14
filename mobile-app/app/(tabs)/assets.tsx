import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useAssets } from "../../src/hooks/useAssets";
import { StatusBadge } from "../../src/components/StatusBadge";
import { AssetDetailSheet } from "../../src/components/AssetDetailSheet";
import type { Asset } from "../../src/lib/types";

const TYPE_ICON: Record<string, string> = {
  Ship: "🚢",
  Truck: "🚛",
  Plane: "✈️",
};

type FilterType = "all" | "Ship" | "Truck" | "Plane";
const FILTER_TABS: { key: FilterType; label: string; icon: string }[] = [
  { key: "all", label: "All", icon: "📦" },
  { key: "Ship", label: "Ships", icon: "🚢" },
  { key: "Truck", label: "Trucks", icon: "🚛" },
  { key: "Plane", label: "Planes", icon: "✈️" },
];

export default function AssetsScreen() {
  const { data: assets, isLoading, refetch, isRefetching } = useAssets();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const filtered = useMemo(() => {
    let list = assets ?? [];
    if (filter !== "all") list = list.filter((a) => a.type === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.type.toLowerCase().includes(q) ||
          a.status.toLowerCase().includes(q)
      );
    }
    return list;
  }, [assets, filter, search]);

  function renderAsset({ item }: { item: Asset }) {
    return (
      <TouchableOpacity
        style={styles.assetCard}
        onPress={() => setSelectedAsset(item)}
        activeOpacity={0.8}
      >
        <View style={styles.cardLeft}>
          <Text style={styles.assetIcon}>{TYPE_ICON[item.type] ?? "📦"}</Text>
        </View>
        <View style={styles.cardMid}>
          <Text style={styles.assetName}>{item.name}</Text>
          <Text style={styles.assetMeta}>
            {item.type} · {item.lat.toFixed(2)}°, {item.lng.toFixed(2)}°
          </Text>
          <Text style={styles.assetSpeed}>⚡ {item.speed} km/h</Text>
        </View>
        <StatusBadge status={item.status} />
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search by name, type, or status…"
          placeholderTextColor="#4b5563"
          clearButtonMode="while-editing"
        />
      </View>

      {/* Filter tabs */}
      <View style={styles.filterRow}>
        {FILTER_TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.filterTab, filter === tab.key && styles.filterTabActive]}
            onPress={() => setFilter(tab.key)}
          >
            <Text style={styles.filterTabIcon}>{tab.icon}</Text>
            <Text
              style={[
                styles.filterTabLabel,
                filter === tab.key && styles.filterTabLabelActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Results count */}
      <Text style={styles.resultCount}>
        {filtered.length} asset{filtered.length !== 1 ? "s" : ""} found
      </Text>

      {/* List */}
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#6366f1" size="large" />
          <Text style={styles.loadingText}>Loading assets…</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderAsset}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor="#6366f1"
              colors={["#6366f1"]}
            />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyText}>No assets match your filter.</Text>
            </View>
          }
        />
      )}

      {/* Detail Sheet */}
      {selectedAsset && (
        <AssetDetailSheet
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0f1e" },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111827",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#1f2937",
    gap: 8,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, color: "#f9fafb", fontSize: 15 },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 12,
  },
  filterTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  filterTabActive: {
    backgroundColor: "#312e81",
    borderColor: "#6366f1",
  },
  filterTabIcon: { fontSize: 14 },
  filterTabLabel: { fontSize: 12, color: "#6b7280", fontWeight: "600" },
  filterTabLabelActive: { color: "#a5b4fc" },
  resultCount: { color: "#4b5563", fontSize: 12, paddingHorizontal: 18, marginBottom: 8 },
  listContent: { paddingHorizontal: 16, paddingBottom: 40 },
  assetCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111827",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#1f2937",
    gap: 12,
  },
  cardLeft: {
    width: 44,
    height: 44,
    backgroundColor: "#0a0f1e",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  assetIcon: { fontSize: 24 },
  cardMid: { flex: 1 },
  assetName: { fontSize: 15, fontWeight: "700", color: "#f9fafb" },
  assetMeta: { fontSize: 12, color: "#6b7280", marginTop: 2 },
  assetSpeed: { fontSize: 12, color: "#6366f1", marginTop: 3, fontWeight: "600" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 60 },
  loadingText: { color: "#6b7280", marginTop: 12 },
  emptyIcon: { fontSize: 48, marginBottom: 8 },
  emptyText: { color: "#6b7280", fontSize: 15 },
});
