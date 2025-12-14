import { useEffect, useState } from "react";
import { apiFetch } from "../utils/helpers.js";
import "../styles/WeatherPage.css";

export default function WeatherPage() {
  const [city, setCity] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

  /* 🔹 Load weather using current location */
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        loadWeatherByCoords(latitude, longitude);
      },
      () => {
        setError("Location permission denied");
      }
    );
  }, []);

  const loadWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    setError("");

    const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${lat},${lon}&aqi=no`;
    const res = await apiFetch(url);

    setLoading(false);

    if (res.error) {
      setError(res.error);
      return;
    }

    setResult(res.data);
  };

  /* 🔹 Search by city name */
  const handleSearch = async () => {
    if (!city.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(
      city
    )}&aqi=no`;

    const res = await apiFetch(url);
    setLoading(false);

    if (res.error) {
      setError(res.error);
      return;
    }

    setResult(res.data);
  };

  return (
    <div className="weather-page">
      <h2 className="weather-title">Weather</h2>

      <div className="weather-search-box">
        <input
          className="weather-input"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button className="weather-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      {loading && <p className="weather-info">Loading...</p>}
      {error && <p className="weather-error">{error}</p>}

      {result && (
        <div className="weather-card">
          <h3>
            {result.location.name}, {result.location.region}
          </h3>

          <p><strong>Country:</strong> {result.location.country}</p>
          <p><strong>Local Time:</strong> {result.location.localtime}</p>

          <div className="weather-main">
            <img
              src={`https:${result.current.condition.icon}`}
              alt="Weather"
            />
            <div>
              <p className="weather-temp">{result.current.temp_c}°C</p>
              <p>{result.current.condition.text}</p>
            </div>
          </div>

          <p><strong>Feels Like:</strong> {result.current.feelslike_c}°C</p>
          <p><strong>Wind:</strong> {result.current.wind_kph} kph</p>
          <p><strong>Humidity:</strong> {result.current.humidity}%</p>
          <p><strong>Visibility:</strong> {result.current.vis_km} km</p>
          <p><strong>UV:</strong> {result.current.uv}</p>
        </div>
      )}
    </div>
  );
}
