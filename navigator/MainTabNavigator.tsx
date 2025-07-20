import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screen/homescreen/HomeScreen";
import PracticeScreen from "../screen/homescreen/practicescreen/PracticeScreen";
import StudyScreen from "../screen/homescreen/learnscreen/LearnScreen";
import StatsScreen from "../screen/homescreen/statsscreen/StatsScreen";
import ProfileScreen from "../screen/homescreen/profilescreen/ProfileScreen";
import Icon from "react-native-vector-icons/Ionicons";
import TabCircleIcon from "../custom/TabCircleIcon";
const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { height: 60 },
        tabBarActiveTintColor: "#FFC1CC",
        tabBarInactiveTintColor: "#666",
        tabBarLabelStyle: { fontSize: 12 },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = "";

          switch (route.name) {
            case "Trang chủ":
              iconName = focused ? "home" : "home-outline";
              break;
            case "Học tập":
              iconName = focused ? "book" : "book-outline";
              break;
            case "Thống kê":
              iconName = focused ? "bar-chart" : "bar-chart-outline";
              break;
            case "Hồ sơ":
              iconName = focused ? "person" : "person-outline";
              break;
          }

          return <Icon name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Trang chủ" component={HomeScreen} />
      <Tab.Screen name="Học tập" component={PracticeScreen} />
      <Tab.Screen
        name="Luyện tập"
        component={StudyScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabCircleIcon focused={focused} />,
          tabBarLabel: "Luyện tập",
        }}
      />
      <Tab.Screen name="Thống kê" component={StatsScreen} />
      <Tab.Screen name="Hồ sơ" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
