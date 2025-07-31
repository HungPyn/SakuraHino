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
import LessonScreen2 from "../screen/homescreen/learnscreen/LessonScreen2";
// SỬA DÒNG NÀY: Thêm tên file ResultScreen vào cuối đường dẫn
import ResultScreen from "../screen/homescreen/learnscreen/ResultScreen"; // <-- Đảm bảo đây là đường dẫn chính xác đến file ResultScreen của bạn (ResultScreen.tsx)

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
        name="LessonScreen2"
        component={LessonScreen2}
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
