import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface KpiCardProps {
  label: string;
  value: string | number;
  unit?: string;
  color?: string;
  icon: string;
}

export function KpiCard({ label, value, unit, color = "#6366f1", icon }: KpiCardProps) {
  return (
    <View style={[styles.card, { borderTopColor: color }]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.value, { color }]}>
        {value}
        {unit ? <Text style={styles.unit}> {unit}</Text> : null}
      </Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 6,
    borderTopWidth: 3,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  icon: {
    fontSize: 26,
    marginBottom: 8,
  },
  value: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  unit: {
    fontSize: 14,
    fontWeight: "400",
    color: "#9ca3af",
  },
  label: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    textAlign: "center",
  },
});
