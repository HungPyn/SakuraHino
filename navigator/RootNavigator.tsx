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
import LearnWriting from "../screen/homescreen/learnWriting/LearnWriting";
import Alphabet from "../screen/homescreen/learnWriting/Alphabet";
import WritingPractice from "../screen/homescreen/learningComponents/WritingPractice";
import ShopScreen from "../screen/homescreen/shop/ShopScreen";
import SettingsAccount from "../screen/profile/SettingsAccount";
import Notification from "../screen/profile/notification";
import ProfileScreen from "../screen/profile/ProfileScreen";
import Lesson from "../screen/homescreen/learnscreen/LearnScreen";
import LessonTestScreen from "../screen/homescreen/learnscreen/LearnTestScreen";
import ExamScreen from "../screen/examscreen/ExamScreen";

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
        name="Notification"
        component={Notification} // Đảm bảo bạn đã tạo ShopScreen
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
        name="LearnWriting"
        component={LearnWriting}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Alphabet"
        component={Alphabet}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="WritingPractice"
        component={WritingPractice}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Exam"
        component={ExamScreen}
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
        name="LessonTest"
        component={LessonTestScreen}
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
