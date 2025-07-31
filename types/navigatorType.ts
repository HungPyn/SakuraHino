// src/types/navigatorType.ts

import { NavigatorScreenParams } from "@react-navigation/native";

export type PracticeType = "listening" | "speaking" | "reading" | "writing";

export type MainTabParamList = {
  "Trang chủ": undefined;
  "Học tập": undefined;
  "Luyện tập": undefined;
  "Thống kê": undefined;
  "Hồ sơ": undefined;
};

// Gộp tất cả màn hình vào một RootStackParamList duy nhất
export type RootStackParamList = {
  Welcome: undefined;
  Login: { login?: boolean; "sign-up"?: boolean } | undefined;
  Register: undefined;
  Home: undefined;
  Main: NavigatorScreenParams<MainTabParamList>; // Màn hình Main chứa Tab Navigator
  QuickPractice: { type: PracticeType };
  LearningPathScreen: undefined; // Màn hình tổng quan đường học tập

  // Các màn hình từ RootStackParamList2 cũ, giờ chuyển vào đây
  LessonScreen2: {
    unitNumber?: number;
    "fast-forward"?: number;
    practice?: boolean;
  };
  Guidebook: { code: string; unitNumber: number };
  // LearningPath đã có LearningPathScreen, nên cần cân nhắc tên cho rõ ràng nếu chúng là 2 màn hình khác nhau
  // Nếu LearningPath ở đây là màn hình chính của đường học tập, nên thống nhất tên với LearningPathScreen
  // Ví dụ, nếu LearningPathScreen là màn hình chính của "Học tập", thì có thể bỏ LearningPath hoặc đổi tên
  // Tạm thời giữ nguyên để bạn quyết định
  LearningPath: undefined; // Cân nhắc tên: Có thể trùng với LearningPathScreen
  Shop: undefined;
  Profile: undefined;
  Leaderboards: undefined;
  Result: { type: string; xp: number; commitTime: string };
};

// Khai báo toàn cục để React Navigation có thể tự động suy luận kiểu
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
