import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiFetch, debounce, groupBy } from "../utils/helpers";

const OMDB_KEY = "521d81bc";

export default function MovieScreen() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const searchMovies = async (text) => {
    if (!text.trim()) {
      setMovies([]);
      setError("");
      return;
    }

    setLoading(true);
    setError("");

    const url = `https://www.omdbapi.com/?apikey=${OMDB_KEY}&s=${encodeURIComponent(
      text
    )}`;

    const res = await apiFetch(url);
    setLoading(res.loading);

    if (res.error) {
      setError(res.error);
      setMovies([]);
    } else if (res.data?.Response === "False") {
      setError(res.data.Error || "No movies found");
      setMovies([]);
    } else {
      setMovies(res.data.Search || []);
    }
  };

  const debouncedSearch = useMemo(() => debounce(searchMovies, 500), []);

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  const grouped = groupBy(movies, "Year");
  const flatGrouped = Object.entries(grouped).flatMap(([year, arr]) =>
    arr.map((movie) => ({ ...movie, _year: year }))
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{
          uri:
            item.Poster !== "N/A"
              ? item.Poster
              : "https://via.placeholder.com/100x150?text=No+Image",
        }}
        style={styles.poster}
      />

      <View style={styles.infoWrapper}>
        <Text style={styles.movieTitle} numberOfLines={2}>
          {item.Title}
        </Text>
        <Text style={styles.metaText}>Year: {item._year}</Text>
        <Text style={styles.metaText}>Type: {item.Type}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <Text style={styles.heading}>🎬 Movie Explorer</Text>

        <View style={styles.searchRow}>
          <TextInput
            style={styles.input}
            value={query}
            onChangeText={setQuery}
            placeholder="Search movies..."
            placeholderTextColor="#777"
          />

          <TouchableOpacity
            style={styles.searchBtn}
            onPress={() => searchMovies(query)}
          >
            <Text style={styles.searchBtnText}>Search</Text>
          </TouchableOpacity>
        </View>

        {loading && <Text style={styles.loading}>Loading...</Text>}
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {!loading && !error && movies.length === 0 && (
          <Text style={styles.emptyText}>Start typing to find movies 🎥</Text>
        )}

        <FlatList
          data={flatGrouped}
          keyExtractor={(item, index) => item.imdbID + "-" + index}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#eef2ff", // same as screen background
  },

  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#eef2ff",
  },

  heading: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    color: "#3b3b98",
    marginBottom: 16,
  },

  searchRow: {
    flexDirection: "row",
    marginBottom: 14,
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#c5c9ff",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginRight: 10,
    fontSize: 16,
  },

  searchBtn: {
    backgroundColor: "#4b7bec",
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
    marginVertical: 10,
    fontSize: 16,
  },

  error: {
    textAlign: "center",
    color: "red",
    fontSize: 16,
    marginVertical: 8,
  },

  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 20,
  },

  card: {
    flexDirection: "row",
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#fff",
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },

  poster: {
    width: 100,
    height: 150,
    borderRadius: 12,
    marginRight: 14,
  },

  infoWrapper: {
    flex: 1,
    justifyContent: "space-between",
  },

  movieTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2d3436",
    marginBottom: 6,
  },

  metaText: {
    fontSize: 14,
    color: "#636e72",
  },
});
