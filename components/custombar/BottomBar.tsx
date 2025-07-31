import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useBottomBarItems, Tab } from "./useBottomBarItems"; 
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
type RootStackParamList = {
  LearningPath: undefined; 
  Shop: undefined;
  Profile: undefined;
  Leaderboards: undefined;
  Lesson: { "fast-forward"?: number; practice?: boolean; "sign-up"?: boolean }; 
  Guidebook: { code: string; unitNumber: number };
};
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

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
    if (href === "/learn") {
      navigation.navigate("LearningPath");
    } else if (href === "/shop") {
      navigation.navigate("Shop");
    } else if (href.startsWith("/profile")) {
      navigation.navigate("Profile");
    } else if (href.startsWith("/learn?sign-up")) {
      navigation.navigate("Lesson", { "sign-up": true }); 
    } else if (href === "/leaderboard") {
      navigation.navigate("Leaderboards");
    }
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

});
