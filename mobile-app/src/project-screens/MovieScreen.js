import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/* ================= CONSTANTS ================= */
const OMDB_KEY = "521d81bc";
const DUMMY_IMAGE = require("../../assets/cinema.jpg");

/* ================= MAIN COMPONENT ================= */
export default function MovieScreen() {
  /* ---------- STATES ---------- */
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------- LOAD POPULAR MOVIES ---------- */
  useEffect(() => {
    loadPopularMovies();
  }, []);

  const loadPopularMovies = async () => {
    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${OMDB_KEY}&s=avengers`
      );
      const data = await res.json();
      if (data.Search) setPopularMovies(data.Search);
    } catch {
      setError("Network error");
    }
  };

  /* ---------- SEARCH MOVIES ---------- */
  const searchMovies = async (text) => {
    if (!text.trim()) {
      setMovies([]);
      setError("");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${OMDB_KEY}&s=${encodeURIComponent(
          text
        )}`
      );
      const data = await res.json();

      if (data.Response === "False") {
        setError(data.Error);
        setMovies([]);
      } else {
        setMovies(data.Search || []);
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- MOVIE CARD ---------- */
  const MovieCard = ({ item }) => {
    const [imgError, setImgError] = useState(false);

    return (
      <View style={styles.movieCard}>
        <Image
          source={
            !imgError && item.Poster && item.Poster !== "N/A"
              ? { uri: item.Poster }
              : DUMMY_IMAGE
          }
          onError={() => setImgError(true)}
          style={styles.poster}
        />

        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={2}>
            {item.Title}
          </Text>
          <Text style={styles.meta}>Year: {item.Year}</Text>
          <Text style={styles.meta}>Type: {item.Type}</Text>
        </View>
      </View>
    );
  };

  /* ================= UI ================= */
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* Tap anywhere → keyboard hide */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.container}>
            <Text style={styles.heading}>🎬 Movie Explorer</Text>

            {/* ---------- SEARCH BAR ---------- */}
            <View style={styles.searchRow}>
              <TextInput
                style={styles.input}
                value={query}
                onChangeText={setQuery}
                placeholder="Search movies..."
                returnKeyType="search"
                onSubmitEditing={() => {
                  Keyboard.dismiss();
                  searchMovies(query);
                }}
              />

              <TouchableOpacity
                style={styles.searchBtn}
                onPress={() => {
                  Keyboard.dismiss();
                  searchMovies(query);
                }}
              >
                <Text style={styles.searchBtnText}>Search</Text>
              </TouchableOpacity>
            </View>

            {loading && <Text style={styles.center}>Loading...</Text>}
            {error !== "" && <Text style={styles.error}>{error}</Text>}

            {/* ---------- POPULAR MOVIES ---------- */}
            {query.trim() === "" && (
              <>
                <Text style={styles.sectionTitle}>🔥 Popular Movies</Text>
                <FlatList
                  data={popularMovies}
                  keyExtractor={(item, index) =>
                    item.imdbID + "_" + index   // ✅ FIXED KEY
                  }
                  renderItem={({ item }) => <MovieCard item={item} />}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                />
              </>
            )}

            {/* ---------- SEARCH RESULTS ---------- */}
            {query.trim() !== "" && (
              <FlatList
                data={movies}
                keyExtractor={(item, index) =>
                  item.imdbID + "_" + index   // ✅ FIXED KEY
                }
                renderItem={({ item }) => <MovieCard item={item} />}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              />
            )}
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

/* ================= OLD STYLES ================= */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#eef2ff",
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

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#3b3b98",
    marginBottom: 10,
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

  center: {
    textAlign: "center",
    marginVertical: 10,
    fontSize: 16,
  },

  error: {
    textAlign: "center",
    color: "red",
    marginVertical: 8,
  },

  movieCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginVertical: 8,
    elevation: 4,
  },

  poster: {
    width: 100,
    height: 150,
    borderRadius: 12,
    marginRight: 14,
  },

  info: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2d3436",
    marginBottom: 6,
  },

  meta: {
    fontSize: 14,
    color: "#636e72",
  },
});
