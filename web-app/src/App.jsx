import { Routes, Route, Link } from "react-router-dom";
import TodoPage from "./pages/TodoPage.jsx";
import WeatherPage from "./pages/WeatherPage.jsx";
import MoviePage from "./pages/MoviePage.jsx";
import ThemeToggle from "./component/ThemeToggle.jsx";
import "./styles/App.css";

export default function App() {
  return (
    <div className="app">
      <nav className="navbar">
    
        <h1 className="navbar-title">Productivity & Info Hub</h1>

        <div className="navbar-right">
          <div className="navbar-links">
            <Link className="nav-link" to="/">Todos</Link>
            <Link className="nav-link" to="/weather">Weather</Link>
            <Link className="nav-link" to="/movies">Movies</Link>
          </div>

          <ThemeToggle />
        </div>
      </nav>

      <div className="content">
        <Routes>
          <Route path="/" element={<TodoPage />} />
          <Route path="/weather" element={<WeatherPage />} />
          <Route path="/movies" element={<MoviePage />} />
        </Routes>
      </div>
    </div>
  );
}
