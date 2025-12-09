import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import TodoScreen from "../project-screens/TodoScreen";
import WeatherScreen from "../project-screens/WeatherScreen";
import MovieScreen from "../project-screens/MovieScreen";

const Tab = createBottomTabNavigator();

export default function BottomTab() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "#4b7bec",
        tabBarInactiveTintColor: "#888",

        tabBarIcon: ({ color, focused }) => {
          let iconName;

          if (route.name === "Todo App") {
            iconName = focused ? "list-circle" : "list-circle-outline";
          } else if (route.name === "Weather App") {
            iconName = focused ? "cloud" : "cloud-outline";
          } else if (route.name === "Movie App") {
            iconName = focused ? "film" : "film-outline";
          }

          return <Ionicons name={iconName} size={26} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Todo App" component={TodoScreen} />
      <Tab.Screen name="Weather App" component={WeatherScreen} />
      <Tab.Screen name="Movie App" component={MovieScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#fff",
    height: 70,
    paddingBottom: 8,
    paddingTop: 6,
    elevation: 10,
    borderTopWidth: 0,
  },
});
