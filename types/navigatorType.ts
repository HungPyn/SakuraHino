// src/types/navigatorType.ts

import { NavigatorScreenParams, RouteProp } from "@react-navigation/native";

export type PracticeType = "listening" | "speaking" | "reading" | "writing";

export type MainTabParamList = {
  "Trang chủ": undefined;
  "Học tập": undefined;
  "Luyện tập": undefined;
  "Thống kê": undefined;
  "Hồ sơ": undefined;
};

export type RootStackParamList = {
  Welcome: undefined;
  Login: { login?: boolean; "sign-up"?: boolean } | undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Home: undefined;
  Leaderboard: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
  // LessonScreen: { practice: boolean } | undefined;
  Shop: undefined;
  QuickPractice: { type: PracticeType };
  LearningPathScreen: undefined;
  SettingsAccount: undefined;
  ProfileScreen: undefined;
  Lesson: { lessonCode: string };
  Guidebook: { code: string; unitNumber: number };
  LearningPath: undefined;
  Profile: undefined;
  Result: { type: string; xp: number; commitTime: string };
};
export type LessonScreenRouteProp = RouteProp<RootStackParamList, "Lesson">;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
