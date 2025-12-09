-------------------------------------------------------------------------------------------------------
📘 Productivity & Info Hub – Mobile App (React Native, Expo)
-------------------------------------------------------------------------------------------------------

📌 Project Overview
The mobile version of the Productivity & Info Hub is built using React Native + Expo and includes:
Todo Module – Stored using AsyncStorage
Weather Search Module – Fetch real-time data using OpenWeather API
Movie Search Module – Uses OMDB API + debounce search
Navigation – Implemented using React Navigation (stack/bottom tabs)
The project demonstrates mobile UI development, API handling, reusable logic, and smooth navigation.
Requirements follow the trainee evaluation task.

-------------------------------------------------------------------------------------------------------

⚙️ Setup Instructions
1. Clone the Project
git clone <your-repo-url>

cd mobile
2. Install Dependencies
npm install

3. Create Environment File
Create .env in the root:
WEATHER_API_KEY=your_openweather_key
OMDB_API_KEY=your_omdb_key

4. Run the App
npx expo start

You can open the app in:
Expo Go app (Android/iOS)
Android Emulator
iOS Simulator

-------------------------------------------------------------------------------------------------------
🏗️ Architecture Decisions
A utils/ folder was created to store custom JavaScript functions like:
myMap, myFilter, myReduce
debounce, throttle
groupBy
apiFetch
This allowed clean code separation and avoided repeated logic across screens.
Screens are organized cleanly under src/screens/ and navigation uses React Navigation for a smooth mobile flow.
AsyncStorage was chosen to replicate localStorage behavior from web. 
Trainee Evaluation Task – Full …

-------------------------------------------------------------------------------------------------------
🧩 Challenges Faced
Rewriting utility functions for the mobile environment.
Implementing debounce smoothly with mobile keyboard input.
Managing AsyncStorage for persisting todos.
Creating a responsive layout for different screen sizes.
Ensuring navigation works properly between Home → Todo/Weather/Movies.

-------------------------------------------------------------------------------------------------------
🚀 Future Improvements
Add better animations and smoother UI transitions.
Implement dark/light theme toggle.
Sync todos across devices using cloud storage.
Offline caching for weather and movie results.
Shared NPM package for utilities (to reuse between web and mobile).

-------------------------------------------------------------------------------------------------------