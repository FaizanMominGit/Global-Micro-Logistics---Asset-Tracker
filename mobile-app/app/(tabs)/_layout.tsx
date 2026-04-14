import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerTintColor: "#f9fafb",
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "#6366f1",
        tabBarInactiveTintColor: "#4b5563",
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <TabIcon emoji="📊" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Live Map",
          tabBarIcon: ({ color }) => (
            <TabIcon emoji="🗺️" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="assets"
        options={{
          title: "Assets",
          tabBarIcon: ({ color }) => (
            <TabIcon emoji="📦" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

function TabIcon({ emoji, color }: { emoji: string; color: string }) {
  const { Text } = require("react-native");
  return (
    <Text style={{ fontSize: 22, opacity: color === "#6366f1" ? 1 : 0.55 }}>
      {emoji}
    </Text>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#0f172a",
    borderBottomWidth: 1,
    borderBottomColor: "#1f2937",
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTitle: {
    fontWeight: "700",
    fontSize: 18,
    color: "#f9fafb",
  },
  tabBar: {
    backgroundColor: "#0f172a",
    borderTopWidth: 1,
    borderTopColor: "#1f2937",
    height: 64,
    paddingBottom: 8,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
});
