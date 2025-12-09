import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiFetch } from "../utils/helpers";

const API_KEY = "d62ae84d24454e5f83245510251410";

export default function WeatherScreen() {
  const [city, setCity] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!city.trim()) return;

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

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <Text style={styles.heading}>🌦 Weather Updates</Text>

        <View style={styles.searchRow}>
          <TextInput
            style={styles.input}
            placeholder="Enter city"
            value={city}
            onChangeText={setCity}
          />

          <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
            <Text style={styles.searchBtnText}>Search</Text>
          </TouchableOpacity>
        </View>

        {loading && <Text style={styles.loading}>Loading...</Text>}
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {result && (
          <View style={styles.card}>
            <Text style={styles.cityName}>
              {result.location.name}, {result.location.region}
            </Text>
            <Text style={styles.country}>
              {result.location.country} • {result.location.localtime}
            </Text>

            <View style={styles.tempRow}>
              <Image
                source={{ uri: "https:" + result.current.condition.icon }}
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
              <Text style={styles.infoLabel}>Feels Like:</Text>
              <Text style={styles.infoValue}>
                {result.current.feelslike_c}°C
              </Text>
            </View>

            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Wind:</Text>
              <Text style={styles.infoValue}>
                {result.current.wind_kph} kph ({result.current.wind_dir})
              </Text>
            </View>

            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Humidity:</Text>
              <Text style={styles.infoValue}>{result.current.humidity}%</Text>
            </View>

            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Visibility:</Text>
              <Text style={styles.infoValue}>{result.current.vis_km} km</Text>
            </View>

            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>UV Index:</Text>
              <Text style={styles.infoValue}>{result.current.uv}</Text>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#eef2ff", // same as container background
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
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
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
