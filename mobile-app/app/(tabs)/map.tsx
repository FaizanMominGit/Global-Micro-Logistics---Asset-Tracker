import React, { useRef, useEffect } from "react";
import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
import MapView, { Marker, Callout, PROVIDER_DEFAULT } from "react-native-maps";
import { useAssets } from "../../src/hooks/useAssets";
import type { Asset } from "../../src/lib/types";

const TYPE_ICON: Record<string, string> = {
  Ship: "🚢",
  Truck: "🚛",
  Plane: "✈️",
};

const STATUS_COLOR: Record<string, string> = {
  active: "#34d399",
  idle: "#fbbf24",
  alert: "#f87171",
};

export default function MapScreen() {
  const { data: assets, isLoading } = useAssets();
  const mapRef = useRef<MapView>(null);

  // Fit all markers on first load
  useEffect(() => {
    if (assets && assets.length > 0 && mapRef.current) {
      const coordinates = assets.map((a) => ({ latitude: a.lat, longitude: a.lng }));
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 60, right: 40, bottom: 60, left: 40 },
        animated: true,
      });
    }
  }, [assets?.length]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        customMapStyle={darkMapStyle}
        initialRegion={{
          latitude: 20,
          longitude: 0,
          latitudeDelta: 100,
          longitudeDelta: 100,
        }}
        showsUserLocation={false}
        showsCompass
        showsScale
      >
        {(assets ?? []).map((asset) => (
          <AssetMarker key={asset.id} asset={asset} />
        ))}
      </MapView>

      {/* Overlay: Loading */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator color="#6366f1" size="large" />
          <Text style={styles.loadingText}>Acquiring asset positions…</Text>
        </View>
      )}

      {/* Overlay: Asset Count Badge */}
      {assets && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            🌐 {assets.length} assets live
          </Text>
        </View>
      )}
    </View>
  );
}

function AssetMarker({ asset }: { asset: Asset }) {
  return (
    <Marker
      coordinate={{ latitude: asset.lat, longitude: asset.lng }}
      title={asset.name}
      description={`${asset.type} · ${asset.speed} km/h`}
      pinColor={STATUS_COLOR[asset.status] ?? "#6366f1"}
    >
      <View style={styles.markerContainer}>
        <Text style={styles.markerIcon}>{TYPE_ICON[asset.type] ?? "📦"}</Text>
        <View
          style={[
            styles.markerDot,
            { backgroundColor: STATUS_COLOR[asset.status] ?? "#6366f1" },
          ]}
        />
      </View>
      <Callout tooltip>
        <View style={styles.callout}>
          <Text style={styles.calloutTitle}>{asset.name}</Text>
          <Text style={styles.calloutMeta}>
            {asset.type} · {asset.speed} km/h
          </Text>
          <Text style={styles.calloutCoords}>
            {asset.lat.toFixed(4)}°, {asset.lng.toFixed(4)}°
          </Text>
        </View>
      </Callout>
    </Marker>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0f1e" },
  map: { flex: 1 },
  markerContainer: { alignItems: "center" },
  markerIcon: { fontSize: 26 },
  markerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 2,
    borderWidth: 1.5,
    borderColor: "#0a0f1e",
  },
  callout: {
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: 12,
    minWidth: 160,
    borderWidth: 1,
    borderColor: "#374151",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  calloutTitle: { fontSize: 15, fontWeight: "700", color: "#f9fafb", marginBottom: 4 },
  calloutMeta: { fontSize: 13, color: "#6366f1", fontWeight: "600" },
  calloutCoords: { fontSize: 11, color: "#6b7280", marginTop: 4 },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10,15,30,0.85)",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: { color: "#6b7280", fontSize: 14 },
  badge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(15,23,42,0.92)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#374151",
  },
  badgeText: { color: "#f9fafb", fontSize: 13, fontWeight: "600" },
});

// Google Maps dark style (used on Android; iOS ignores this with Apple Maps)
const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#0f172a" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#6b7280" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0f172a" }] },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2937" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#1f2937" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#111827" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0c1a2e" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#111827" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#111827" }],
  },
];
