import { useState } from "react";
import { apiFetch } from "../utils/helpers.js";
import "../styles/WeatherPage.css";

export default function WeatherPage() {
  const [city, setCity] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

  const handleSearch = async () => {
    if (!city.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(city)}&aqi=no`;

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
      <h2 className="weather-title">Weather Search</h2>

      <div className="weather-search-box">
        <input
          className="weather-input"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <button className="weather-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      {loading && <p className="weather-info">Loading...</p>}
      {error && <p className="weather-error">{error}</p>}

      {result && (
        <div className="weather-card">
          <h3 className="weather-location">
            {result.location.name}, {result.location.region}
          </h3>

          <p><strong>Country:</strong> {result.location.country}</p>
          <p><strong>Local Time:</strong> {result.location.localtime}</p>

          <div className="weather-main">
            <img
              className="weather-icon"
              src={`https:${result.current.condition.icon}`}
              alt="Weather Icon"
            />
            <div>
              <p className="weather-temp">{result.current.temp_c}°C</p>
              <p className="weather-condition">{result.current.condition.text}</p>
            </div>
          </div>

          <div className="weather-details">
            <p><strong>Feels Like:</strong> {result.current.feelslike_c}°C</p>
            <p>
              <strong>Wind:</strong> {result.current.wind_kph} kph (
              {result.current.wind_dir})
            </p>
            <p><strong>Humidity:</strong> {result.current.humidity}%</p>
            <p><strong>Visibility:</strong> {result.current.vis_km} km</p>
            <p><strong>UV Index:</strong> {result.current.uv}</p>
          </div>
        </div>
      )}
    </div>
  );
}
