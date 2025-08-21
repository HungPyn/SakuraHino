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
export interface User {
  name: string;
  email: string;
  username: string;
  avatarUrl: string;
  longStreak: number;
  expScore: number;
}

export type RootStackParamList = {
  Welcome: undefined;
  Login: { login?: boolean; "sign-up"?: boolean } | undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Home: undefined;
  Alphabet: undefined;
  LearnWriting: undefined;
  WritingPractice: {
    isLearning: boolean;
    isKanji: boolean;
    id: number;
    word: string;
    furigana: string;
    romaji: string;
    meaning: string;
    audioUrl: string;
  };
  Main: NavigatorScreenParams<MainTabParamList>;
  // LessonScreen: { practice: boolean } | undefined;
  Shop: undefined;
  QuickPractice: { type: PracticeType };
  LearningPathScreen: undefined;
  SettingsAccount: { user: User | null };
  ProfileScreen: undefined;
  Lesson: { lessonCode: string; topicCode: string; practice: boolean };
  LessonTest: undefined;
  Guidebook: { code: string; unitNumber: number };
  LearningPath: undefined;
  Profile: undefined;
  Exam: undefined;
  Result: {
    isTest: boolean;
    corect: number;
    totalQuestion: number;
    score: number;
    commitTime: string;
  };
};
export type LessonScreenRouteProp = RouteProp<RootStackParamList, "Lesson">;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
