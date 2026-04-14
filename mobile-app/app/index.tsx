import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { API_BASE_URL, setSessionToken } from "../src/lib/api";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Error", "Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      // 1. Call the mobile-specific login endpoint
      const res = await fetch(
        `${API_BASE_URL}/api/mobile/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          redirect: "manual",
        }
      );

      // next-auth returns a session cookie on success (status 200/302)
      const setCookie = res.headers.get("set-cookie") ?? "";
      console.log("[Auth] Set-Cookie header:", setCookie);

      // Handle various session token cookie names (NextAuth v4, v5, and secure variants)
      const tokenMatch = setCookie.match(/(?:next-auth\.session-token|__Secure-next-auth\.session-token|authjs\.session-token)=([^;]+)/);
      const token = tokenMatch?.[1];

      if (token) {
        console.log("[Auth] Token found, logging in...");
        await setSessionToken(token);
        router.replace("/(tabs)/dashboard");
      } else if (res.status === 302 || res.redirected) {
        const location = res.headers.get("location") ?? "";
        console.log("[Auth] Redirected to:", location);
        
        if (!location.includes("error")) {
          // If we got a 302 success but no cookie in the same response, 
          // we might need to check if we can proceed. 
          // In some cases, NextAuth v5 might have already set it.
          router.replace("/(tabs)/dashboard");
        } else {
          Alert.alert("Login Failed", "Invalid email or password.");
        }
      } else {
        console.warn("[Auth] Login failed with status:", res.status);
        Alert.alert("Login Failed", "Invalid email or password.");
      }
    } catch (err) {
      Alert.alert(
        "Connection Error",
        "Cannot reach the OmniTrack server. Make sure the web-app is running and API_BASE_URL is correct."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Logo / Branding */}
      <View style={styles.brand}>
        <Text style={styles.brandIcon}>🌐</Text>
        <Text style={styles.brandName}>OmniTrack</Text>
        <Text style={styles.brandTagline}>Global Micro-Logistics & Asset Tracker</Text>
      </View>

      {/* Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Sign In</Text>
        <Text style={styles.cardSubtitle}>Access your logistics dashboard</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>EMAIL</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="admin@omnitrack.io"
            placeholderTextColor="#4b5563"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>PASSWORD</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor="#4b5563"
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign In →</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>
        Server: {API_BASE_URL}
      </Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0f1e",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  brand: { alignItems: "center", marginBottom: 40 },
  brandIcon: { fontSize: 52, marginBottom: 12 },
  brandName: {
    fontSize: 36,
    fontWeight: "900",
    color: "#f9fafb",
    letterSpacing: -1,
  },
  brandTagline: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 4,
    textAlign: "center",
  },
  card: {
    width: "100%",
    backgroundColor: "#111827",
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
    borderColor: "#1f2937",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#f9fafb",
    marginBottom: 4,
  },
  cardSubtitle: { fontSize: 14, color: "#6b7280", marginBottom: 28 },
  inputGroup: { marginBottom: 20 },
  inputLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6366f1",
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#0a0f1e",
    borderWidth: 1,
    borderColor: "#374151",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#f9fafb",
    fontSize: 15,
  },
  button: {
    backgroundColor: "#6366f1",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  footer: {
    marginTop: 32,
    fontSize: 11,
    color: "#374151",
    textAlign: "center",
  },
});
