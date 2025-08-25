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

  // Chỉ dùng một useEffect duy nhất
  useEffect(() => {
    const checkUserStatus = async () => {
      // 1. Lấy trạng thái từ AsyncStorage
      const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
      const hasOpened = await AsyncStorage.getItem("hasOpenedApp");

      console.log("isLoggedIn:", isLoggedIn, ", hasOpened:", hasOpened);

      // 2. Kiểm tra các trường hợp
      if (isLoggedIn === "true") {
        // Nếu đã đăng nhập, chuyển thẳng đến màn hình chính
        // navigation.replace("MainTabs"); // Ví dụ: màn hình chính
        navigation.replace("Login"); // Vì bạn đang dùng Login làm màn hình đầu tiên
      } else if (hasOpened === "true") {
        // Đã mở ứng dụng trước đó, chuyển ngay đến màn hình đăng nhập
        navigation.navigate("Login", { login: true });
      } else {
        // Lần đầu mở ứng dụng, đợi 1.5 giây rồi chuyển
        await AsyncStorage.setItem("hasOpenedApp", "true");
        setTimeout(() => {
          navigation.navigate("Login", { login: true });
        }, 1500);
      }

      setLoading(false);
    };

    checkUserStatus();
  }, []); // [] đảm bảo effect chỉ chạy một lần khi component được mount

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
