// src/components/BottomBar.tsx (tạo file mới này)
import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useBottomBarItems, Tab } from "./useBottomBarItems"; // Đảm bảo đường dẫn đúng
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Cần định nghĩa lại RootStackParamList nếu nó chưa được định nghĩa toàn cục
// hoặc đảm bảo nó được import ở đây.
// Tôi sẽ định nghĩa lại tạm thời ở đây cho ví dụ:
type RootStackParamList = {
  LearningPath: undefined; // Màn hình chính
  Shop: undefined;
  Profile: undefined;
  Leaderboards: undefined;
  Lesson: { "fast-forward"?: number; practice?: boolean; "sign-up"?: boolean }; // Bổ sung tham số sign-up cho Profile
  Guidebook: { code: string; unitNumber: number };
};
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// --- Constants --- (Có thể đã được định nghĩa ở LearningPathScreen, cần nhất quán)
const COLORS = {
  white: "#FFFFFF",
  gray100: "#f3f4f6",
  gray200: "#e5e7eb",
  gray400: "#9ca3af",
  gray500: "#6b7280",
  yellow400: "#facc15",
  yellow500: "#eab308",
  yellow600: "#ca8a04",
  yellow200: "#fef08a",
  green500: "#22c55e",
  blue500: "#3b82f6",
  textLight: "#FFFFFF",
  textDark: "#000000",
};

export const BottomBar = ({ selectedTab }: { selectedTab: Tab | null }) => {
  const bottomBarItems = useBottomBarItems();
  const navigation = useNavigation<NavigationProp>();

  const handlePress = (href: string) => {
    // Điều chỉnh logic điều hướng tùy thuộc vào cấu trúc router của bạn
    // Ví dụ: /learn -> LearningPath, /shop -> Shop, /profile -> Profile, /leaderboard -> Leaderboards
    if (href === "/learn") {
      navigation.navigate("LearningPath");
    } else if (href === "/shop") {
      navigation.navigate("Shop");
    } else if (href.startsWith("/profile")) {
      navigation.navigate("Profile");
    } else if (href.startsWith("/learn?sign-up")) {
      navigation.navigate("Lesson", { "sign-up": true }); // Giả định màn hình Lesson xử lý logic đăng ký
    } else if (href === "/leaderboard") {
      navigation.navigate("Leaderboards");
    }
    // Thêm các điều kiện khác nếu có nhiều đường dẫn khác
  };

  return (
    <View style={styles.container}>
      {bottomBarItems.map((item) => {
        const isSelected = item.name === selectedTab;
        return (
          <TouchableOpacity
            key={item.href}
            style={styles.itemWrapper}
            onPress={() => handlePress(item.href)}
          >
            <View
              style={[
                isSelected
                  ? styles.selectedItemContainer
                  : styles.itemContainer,
              ]}
            >
              {item.icon}
              {/* sr-only không có trong React Native.
                  Nếu bạn muốn một text ẩn cho trình đọc màn hình, bạn có thể dùng accessibilityLabel.
                  Hoặc hiển thị text thật nếu muốn. */}
              {/* <Text style={styles.itemText}>{item.name}</Text> */}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute", // Vị trí cố định ở cuối màn hình
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 2,
    borderColor: "#e5e5e5",
    backgroundColor: COLORS.white,
    flexDirection: "row", // Để các item nằm ngang
    height: 88,
    // md:hidden không có tác dụng trong React Native, Responsive cần được xử lý bằng kích thước màn hình
  },
  itemWrapper: {
    flex: 1, // Chia đều không gian cho mỗi item
    alignItems: "center",
    justifyContent: "center",
  },
  itemContainer: {
    paddingHorizontal: 8, // px-2
    paddingVertical: 4, // py-1
    borderRadius: 12, // rounded-xl
    // Không có border và background mặc định khi không được chọn
  },
  selectedItemContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#84d8ff", // border-[#84d8ff]
    backgroundColor: "#ddf4ff", // bg-[#ddf4ff]
  },
  // Nếu bạn muốn hiển thị tên tab dưới icon:
  // itemText: {
  //   fontSize: 12,
  //   color: COLORS.gray500, // Chọn màu phù hợp
  //   marginTop: 4,
  // },
});
