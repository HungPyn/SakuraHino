import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigatorType";
import LoginScreen from "../screen/authenScreen/LoginScreen";
import RegisterScreen from "../screen/authenScreen/RegisterScreen";
import WelcomeScreen from "../screen/authenScreen/WellcomeScreen";
import MainTabNavigator from "./MainTabNavigator";
import LearningPathScreen from "../screen/homescreen/learnscreen/LearningPathScreen";
import QuickPracticeScreen from "../screen/homescreen/practicescreen/QuickPracticeScreen";
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
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
    </Stack.Navigator>
  );
}
