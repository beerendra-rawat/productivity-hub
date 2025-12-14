import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { apiFetch } from "../utils/helpers";

/* ---------------- API KEY ---------------- */
const API_KEY = "d62ae84d24454e5f83245510251410";

/* =================================================
   WEATHER SCREEN
================================================= */
export default function WeatherScreen() {
  const [city, setCity] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------- LOAD CURRENT LOCATION WEATHER ---------- */
  useEffect(() => {
    loadCurrentLocationWeather();
  }, []);

  const loadCurrentLocationWeather = async () => {
    try {
      setLoading(true);

      /* 1️⃣ Ask location permission */
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setError("Location permission denied");
        setLoading(false);
        return;
      }

      /* 2️⃣ Get current position */
      const location =
        await Location.getCurrentPositionAsync({});

      const { latitude, longitude } = location.coords;

      /* 3️⃣ Fetch weather using lat & lon */
      const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${latitude},${longitude}&aqi=no`;

      const res = await apiFetch(url);

      if (res.error) {
        setError(res.error);
      } else {
        setResult(res.data);
      }
    } catch (err) {
      setError("Failed to get location");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- SEARCH BY CITY ---------- */
  const handleSearch = async () => {
    if (!city.trim()) return;

    Keyboard.dismiss();

    setLoading(true);
    setError("");
    setResult(null);

    const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(
      city
    )}&aqi=no`;

    const res = await apiFetch(url);
    setLoading(res.loading);

    if (res.error) {
      setError(res.error);
      return;
    }

    setResult(res.data);
  };

  /* ================= UI ================= */
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.container}>
            <Text style={styles.heading}>🌦 Weather Updates</Text>

            {/* ---------- SEARCH ---------- */}
            <View style={styles.searchRow}>
              <TextInput
                style={styles.input}
                placeholder="Enter city"
                value={city}
                onChangeText={setCity}
                returnKeyType="search"
                onSubmitEditing={handleSearch}
              />

              <TouchableOpacity
                style={styles.searchBtn}
                onPress={handleSearch}
              >
                <Text style={styles.searchBtnText}>Search</Text>
              </TouchableOpacity>
            </View>

            {loading && <Text style={styles.loading}>Loading...</Text>}
            {error ? <Text style={styles.error}>{error}</Text> : null}

            {/* ---------- WEATHER RESULT ---------- */}
            {result && (
              <View style={styles.card}>
                <Text style={styles.cityName}>
                  {result.location.name},{" "}
                  {result.location.region}
                </Text>

                <Text style={styles.country}>
                  {result.location.country} •{" "}
                  {result.location.localtime}
                </Text>

                <View style={styles.tempRow}>
                  <Image
                    source={{
                      uri:
                        "https:" +
                        result.current.condition.icon,
                    }}
                    style={styles.weatherIcon}
                  />

                  <View>
                    <Text style={styles.tempValue}>
                      {result.current.temp_c}°C
                    </Text>
                    <Text style={styles.conditionText}>
                      {result.current.condition.text}
                    </Text>
                  </View>
                </View>

                <View style={styles.infoBlock}>
                  <Text style={styles.infoLabel}>
                    Feels Like:
                  </Text>
                  <Text style={styles.infoValue}>
                    {result.current.feelslike_c}°C
                  </Text>
                </View>

                <View style={styles.infoBlock}>
                  <Text style={styles.infoLabel}>Wind:</Text>
                  <Text style={styles.infoValue}>
                    {result.current.wind_kph} kph (
                    {result.current.wind_dir})
                  </Text>
                </View>

                <View style={styles.infoBlock}>
                  <Text style={styles.infoLabel}>
                    Humidity:
                  </Text>
                  <Text style={styles.infoValue}>
                    {result.current.humidity}%
                  </Text>
                </View>

                <View style={styles.infoBlock}>
                  <Text style={styles.infoLabel}>
                    Visibility:
                  </Text>
                  <Text style={styles.infoValue}>
                    {result.current.vis_km} km
                  </Text>
                </View>

                <View style={styles.infoBlock}>
                  <Text style={styles.infoLabel}>
                    UV Index:
                  </Text>
                  <Text style={styles.infoValue}>
                    {result.current.uv}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#eef2ff",
  },

  container: {
    flex: 1,
    padding: 18,
    backgroundColor: "#eef2ff",
  },

  heading: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
    color: "#1a73e8",
  },

  searchRow: {
    flexDirection: "row",
    marginBottom: 16,
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#bcd2ff",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
  },

  searchBtn: {
    backgroundColor: "#1a73e8",
    paddingHorizontal: 18,
    justifyContent: "center",
    borderRadius: 10,
  },

  searchBtnText: {
    color: "#fff",
    fontWeight: "600",
  },

  loading: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 16,
  },

  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
    fontSize: 16,
  },

  card: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    elevation: 4,
  },

  cityName: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },

  country: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },

  tempRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  weatherIcon: {
    width: 80,
    height: 80,
    marginRight: 12,
  },

  tempValue: {
    fontSize: 32,
    fontWeight: "700",
  },

  conditionText: {
    fontSize: 16,
    color: "#555",
  },

  infoBlock: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingVertical: 8,
  },

  infoLabel: {
    fontWeight: "600",
    color: "#444",
  },

  infoValue: {
    fontWeight: "500",
    color: "#222",
  },
});

