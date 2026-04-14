import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { AssetStatus } from "../lib/types";

interface StatusBadgeProps {
  status: AssetStatus;
}

const STATUS_CONFIG: Record<AssetStatus, { label: string; bg: string; text: string }> = {
  active: { label: "ACTIVE", bg: "#064e3b", text: "#34d399" },
  idle: { label: "IDLE", bg: "#78350f", text: "#fbbf24" },
  alert: { label: "ALERT", bg: "#7f1d1d", text: "#f87171" },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.idle;
  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <View style={[styles.dot, { backgroundColor: config.text }]} />
      <Text style={[styles.text, { color: config.text }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
});
