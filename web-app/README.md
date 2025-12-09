-----------------------------------------------------------------------------------------------------
📘 Productivity & Info Hub – Web Application (React)
-----------------------------------------------------------------------------------------------------

📌 Project Overview
The Productivity & Info Hub (Web Version) is a React-based application containing three modules:
Todo Management – Add, edit, delete, complete, and group todos
Weather Search – Fetch real-time weather using OpenWeather API
Movie Explorer – Search movies using OMDB API with debounce optimization

The project demonstrates React fundamentals, state management using useState + useContext, API integration, and clean UI/UX.

-----------------------------------------------------------------------------------------------------

⚙️ Setup Instructions
1. Clone the Project
git clone <your-repo-url>
cd web

2. Install Dependencies
npm install

3. Create Environment File
Create .env in the root:
VITE_WEATHER_API_KEY=your_openweather_key
VITE_OMDB_API_KEY=your_omdb_key

4. Run the App
npm run dev

-----------------------------------------------------------------------------------------------------
🏗️ Architecture Decisions
A utilities folder (src/utils/) stores custom reusable JavaScript logic such as:
myMap, myFilter, myReduce
debounce, throttle
groupBy
apiFetch

The goal was to keep the core logic modular, clean, and easy to reuse.
React Router is used for navigation, and Context API handles shared state (todos and theme).
This structure keeps the app scalable and easy to maintain. 
Trainee Evaluation Task – Full …

-----------------------------------------------------------------------------------------------------

🧩 Challenges Faced
Creating custom versions of map, filter, reduce without built-ins.
Designing debounce for movie search without performance issues.
Handling different loading/error states from external APIs.
Managing localStorage for persisting todos.
Grouping todos and movies using a custom groupBy function.

-----------------------------------------------------------------------------------------------------

🚀 Future Improvements
Improve UI styling with animations.
Add charts for weather analytics.
Add user authentication to sync todos across devices.
Convert utilities into a shared library to reduce code duplication.

-----------------------------------------------------------------------------------------------------