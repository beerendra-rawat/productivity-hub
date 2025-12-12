import { useEffect, useMemo, useState } from "react";
import { apiFetch, debounce, groupBy } from "../utils/helpers.js";
import "../styles/MoviePage.css";

export default function MoviePage() {
  const [query, setQuery] = useState("");
  const [rawMovies, setRawMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchMovies = async (text) => {
    if (!text.trim()) {
      setRawMovies([]);
      setError("");
      return;
    }        

    setLoading(true);
    setError("");
    const apiKey = import.meta.env.VITE_OMDB_API_KEY;
    const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(
      text
    )}`;

    const res = await apiFetch(url);
    setLoading(res.loading);

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

  const debouncedSearch = useMemo(() => debounce(searchMovies, 500), []);

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  const grouped = groupBy(rawMovies, "Year");

  return (
    <div className="movie-page">
      <h2 className="movie-title">Movie Explorer</h2>

      <input
        className="movie-search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search movies..."
      />

      {loading && <p className="movie-info">Loading...</p>}
      {error && <p className="movie-error">{error}</p>}

      {Object.keys(grouped).length === 0 && !loading && !error && (
        <p className="movie-info">Type to search movies.</p>
      )}

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
                      : "https://via.placeholder.com/150x200?text=No+Image"
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
