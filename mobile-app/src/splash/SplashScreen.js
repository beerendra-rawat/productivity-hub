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
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const startFade = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    startFade();

    const timer = setTimeout(() => {
      navigation.replace("MainApp");
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={splashImage}
        style={[styles.image, { opacity: fadeAnim }]}
        resizeMode="cover"
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.replace("MainApp")}
        >
          <Text style={styles.btnText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: width,
    height: height,
  },

  buttonContainer: {
    position: "absolute",
    bottom: 80,
    width: "100%",
    alignItems: "center",
  },

  btn: {
    backgroundColor: "#4b7bec",
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 30,
    elevation: 6,
  },

  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
