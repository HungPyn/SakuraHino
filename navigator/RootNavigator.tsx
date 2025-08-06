// File: navigator/RootNavigator.tsx

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigatorType";

import LoginScreen from "../screen/authenScreen/LoginScreen";
import RegisterScreen from "../screen/authenScreen/RegisterScreen";
import WelcomeScreen from "../screen/authenScreen/WellcomeScreen";
import MainTabNavigator from "./MainTabNavigator";
import LearningPathScreen from "../screen/homescreen/learnscreen/LearningPathScreen";
import QuickPracticeScreen from "../screen/homescreen/practicescreen/QuickPracticeScreen";
// import LessonScreen2 from "../screen/homescreen/learnscreen/LessonScreen2";
import ResultScreen from "../screen/homescreen/learnscreen/ResultScreen";
import Leaderboard from "../screen/homescreen/leaderboard/Leaderboard";
import ShopScreen from "../screen/homescreen/shop/ShopScreen";
import SettingsAccount from "../screen/profile/SettingsAccount";
import ProfileScreen from "../screen/profile/ProfileScreen";
import Lesson from "../screen/homescreen/learnscreen/LearnScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Shop"
        component={ShopScreen} // Đảm bảo bạn đã tạo ShopScreen
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SettingsAccount"
        component={SettingsAccount} // Đảm bảo bạn đã tạo ShopScreen
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen} // Đảm bảo bạn đã tạo ShopScreen
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Leaderboard"
        component={Leaderboard}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Main"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LearningPathScreen"
        component={LearningPathScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="QuickPractice"
        component={QuickPracticeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Lesson"
        component={Lesson}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Result"
        component={ResultScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
