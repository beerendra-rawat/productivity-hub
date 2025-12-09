import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import SplashScreen from "./src/splash/SplashScreen";
import BottomTabs from "./src/navigation/BottomTab";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="MainApp" component={BottomTabs} />

        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
