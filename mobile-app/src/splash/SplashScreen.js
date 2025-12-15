import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("window");
const splashImage = require("../../assets/splash1.png");

export default function SplashScreen({ navigation }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade animation
    Animated.timing(opacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Auto navigate after 10 seconds
    const timer = setTimeout(() => {
      navigation.replace("MainApp");
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={splashImage}
        style={[styles.image, { opacity }]}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.replace("MainApp")}
      >
        <Text style={styles.text}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width,
    height,
  },
  button: {
    position: "absolute",
    bottom: 80,
    alignSelf: "center",
    backgroundColor: "#4b7bec",
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 30,
  },
  text: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
