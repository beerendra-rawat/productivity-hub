import { useEffect, useMemo, useState } from "react";
import { apiFetch, debounce, groupBy } from "../utils/helpers.js";
import "../styles/MoviePage.css";

/* ✅ Local default image */
import cinemaPoster from "../assets/cinema.jpg";

export default function MoviePage() {
  const [query, setQuery] = useState("");
  const [rawMovies, setRawMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiKey = import.meta.env.VITE_OMDB_API_KEY;

  /* ---------- Load Popular Movies (default) ---------- */
  useEffect(() => {
    loadPopularMovies();
  }, []);

  const loadPopularMovies = async () => {
    setLoading(true);
    const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=avengers`;

    const res = await apiFetch(url);
    setLoading(false);

    if (!res.error && res.data?.Search) {
      setPopularMovies(res.data.Search);
    }
  };

  /* ---------- Search Movies ---------- */
  const searchMovies = async (text) => {
    if (!text.trim()) {
      setRawMovies([]);
      setError("");
      return;
    }

    setLoading(true);
    setError("");

    const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(
      text
    )}`;

    const res = await apiFetch(url);
    setLoading(false);

    if (res.error) {
      setError(res.error);
      setRawMovies([]);
    } else if (res.data.Response === "False") {
      setError(res.data.Error || "No movies found");
      setRawMovies([]);
    } else {
      setRawMovies(res.data.Search || []);
    }
  };

  const debouncedSearch = useMemo(
    () => debounce(searchMovies, 500),
    []
  );

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  const grouped = groupBy(rawMovies, "Year");

  return (
    <div className="movie-page">
      <h2 className="movie-title">Movie Explorer</h2>

      {/* 🔍 Search Bar + Button (flex only) */}
      <div className="movie-search-box">
        <input
          className="movie-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies..."
        />

        <button
          className="movie-btn"
          onClick={() => searchMovies(query)}
        >
          Search
        </button>
      </div>

      {loading && <p className="movie-info">Loading...</p>}
      {error && <p className="movie-error">{error}</p>}

      {/* ⭐ Default Popular Movies */}
      {!query && popularMovies.length > 0 && (
        <>
          <h3 className="movie-year">Popular Movies</h3>

          <div className="movie-grid">
            {popularMovies.map((movie) => (
              <div key={movie.imdbID} className="movie-card">
                <img
                  src={
                    movie.Poster !== "N/A"
                      ? movie.Poster
                      : cinemaPoster
                  }
                  alt={movie.Title}
                  className="movie-image"
                />
                <h4 className="movie-name">{movie.Title}</h4>
                <p className="movie-type">{movie.Year}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 🔎 Search Results */}
      {Object.entries(grouped).map(([year, movies]) => (
        <div key={year} className="movie-group">
          <h3 className="movie-year">Year: {year}</h3>

          <div className="movie-grid">
            {movies.map((movie) => (
              <div key={movie.imdbID} className="movie-card">
                <img
                  src={
                    movie.Poster !== "N/A"
                      ? movie.Poster
                      : cinemaPoster
                  }
                  alt={movie.Title}
                  className="movie-image"
                />
                <h4 className="movie-name">{movie.Title}</h4>
                <p className="movie-type">{movie.Type}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
