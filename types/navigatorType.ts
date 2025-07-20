import { NavigatorScreenParams } from "@react-navigation/native";
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
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
  QuickPractice: { type: PracticeType };
  LearningPathScreen: undefined;
};
