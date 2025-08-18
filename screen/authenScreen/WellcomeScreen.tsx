import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  Dimensions,
  Platform,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigatorType";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

type Props = NativeStackScreenProps<RootStackParamList, "Welcome">;

export default function WelcomeScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      await AsyncStorage.removeItem("hasOpenedApp");
      await AsyncStorage.removeItem("isLoggedIn");
      const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
      const hasOpened = await AsyncStorage.getItem("hasOpenedApp");

      if (isLoggedIn === "true") {
        console.log("mở đang nhập");
        navigation.replace("Login");
      } else if (hasOpened === "true") {
        navigation.navigate("Login", { login: true });
      } else {
        await AsyncStorage.setItem("hasOpenedApp", "true");
        setTimeout(() => {
          navigation.navigate("Login", { login: true });
        }, 3000);
      }

      setLoading(false);
    };

    checkUserStatus();
  }, []);

  useEffect(() => {
    const checkUserStatus = async () => {
      await AsyncStorage.removeItem("hasOpenedApp");
      await AsyncStorage.removeItem("isLoggedIn");
      const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
      const hasOpened = await AsyncStorage.getItem("hasOpenedApp");

      if (isLoggedIn === "true") {
        console.log("mở đang nhập");
        navigation.replace("Login");
      } else if (hasOpened === "true") {
        navigation.navigate("Login", { login: true });
      } else {
        await AsyncStorage.setItem("hasOpenedApp", "true");
        setTimeout(() => {
          navigation.navigate("Login", { login: true });
        }, 3000);
      }

      setLoading(false);
    };

    checkUserStatus();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>SakuraNihongo</Text>
      <Text style={styles.subtitle}>
        Ứng dụng học tiếng Nhật dễ dàng & hiệu quả
      </Text>

      {loading && (
        <ActivityIndicator
          size="large"
          color="#ff69b4"
          style={{ marginTop: 30 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff0f5",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: width * 0.55,
    height: width * 0.55,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ff69b4",
    fontFamily: Platform.select({
      ios: "AvenirNext-DemiBold",
      android: "sans-serif-medium",
    }),
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 22,
    maxWidth: 320,
  },
});
