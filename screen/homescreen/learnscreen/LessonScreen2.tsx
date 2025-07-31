// File: src/screens/LessonScreen.js (hoặc đặt tên phù hợp với cấu trúc dự án của bạn)

import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useBoundStore } from "../../../hooks/useBoundStore"; // Đảm bảo đường dẫn này đúng
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../types/navigatorType"; // Đảm bảo đường dẫn này đúng
// --- Định nghĩa kiểu cho props của màn hình này ---
type LessonScreenRouteProp = NativeStackScreenProps<
  RootStackParamList,
  "LessonScreen2"
>["route"];
type LessonScreenNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "LessonScreen2"
>["navigation"];

// --- Dữ liệu câu hỏi giả định ---
// Trong ứng dụng thực tế, bạn sẽ tải dữ liệu này dựa trên 'unitNumber' hoặc 'fastForwardUnitNumber'
const LESSON_QUESTIONS = [
  { id: "q1", question: "Hello", correctAnswer: "Xin chào" },
];

// --- Component LessonScreen ---
const LessonScreen = () => {
  const navigation = useNavigation<LessonScreenNavigationProp>();
  const route = useRoute<LessonScreenRouteProp>();

  // Lấy các tham số từ route
  const {
    unitNumber,
    practice,
    "fast-forward": fastForwardUnitNumber,
  } = route.params;

  // Lấy các action từ Zustand store
  const increaseLessonsCompleted = useBoundStore(
    (state) => state.increaseLessonsCompleted
  );
  const increaseLingots = useBoundStore((state) => state.increaseLingots);

  // --- State quản lý bài học ---
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState(""); // Để lưu câu trả lời của người dùng
  const [isAnswerChecked, setIsAnswerChecked] = useState(false); // Đã kiểm tra đáp án chưa

  // Lấy bộ câu hỏi cho bài học này
  // Trong thực tế, bạn sẽ có logic để chọn LESSON_QUESTIONS phù hợp với unitNumber
  const currentLessonQuestions = LESSON_QUESTIONS; // Giả định lấy hết 5 câu cho 1 lesson

  const currentQuestion = currentLessonQuestions[currentQuestionIndex];

  // --- Xử lý khi nhấn nút "Check Answer" ---
  const handleCheckAnswer = () => {
    // Đây là nơi bạn sẽ so sánh userAnswer với currentQuestion.correctAnswer
    if (
      userAnswer.trim().toLowerCase() ===
      currentQuestion.correctAnswer.toLowerCase()
    ) {
      Alert.alert("Đúng rồi!", "Chính xác! Ấn Next để tiếp tục.");
      setIsAnswerChecked(true); // Đánh dấu đã kiểm tra
    } else {
      Alert.alert("Chưa đúng", "Hãy thử lại nhé.");
      // Có thể không cho chuyển nếu sai, hoặc cho phép chuyển nhưng tính là sai
    }
  };

  // --- Xử lý khi nhấn nút "Next Question" hoặc "Finish Lesson" ---
  const handleNextOrFinish = () => {
    if (!isAnswerChecked) {
      Alert.alert(
        "Chưa kiểm tra",
        "Bạn phải kiểm tra đáp án trước khi đi tiếp."
      );
      return;
    }

    if (currentQuestionIndex < currentLessonQuestions.length - 1) {
      // Nếu còn câu hỏi, chuyển sang câu tiếp theo
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setUserAnswer(""); // Reset câu trả lời
      setIsAnswerChecked(false); // Reset trạng thái kiểm tra
    } else {
      // --- LOGIC QUAN TRỌNG: KHI HOÀN THÀNH BÀI HỌC ---
      console.log(
        `Bài học Unit ${unitNumber || fastForwardUnitNumber} đã hoàn thành!`
      );

      // 1. CẬP NHẬT SỐ BÀI HỌC ĐÃ HOÀN THÀNH trong store
      // Điều này sẽ kích hoạt LearningPathScreen cập nhật trạng thái các tile
      increaseLessonsCompleted(1);

      // 2. Tăng Lingots (hoặc điểm kinh nghiệm khác)
      // Điều chỉnh giá trị tùy thuộc vào bài học (ví dụ: practice ít XP hơn)
      increaseLingots(practice ? 5 : 10);

      // 3. Điều hướng đến màn hình kết quả hoặc quay về màn hình chính
      navigation.replace("Result", {
        type: "perfect", // Bạn có thể tùy chỉnh loại kết quả
        xp: practice ? 5 : 10,
        commitTime: new Date().toLocaleTimeString("vi-VN"),
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {practice ? "Luyện Tập" : "Bài Học"}{" "}
        {unitNumber || fastForwardUnitNumber}
      </Text>
      <Text style={styles.questionText}>
        Câu hỏi {currentQuestionIndex + 1}/{currentLessonQuestions.length}:
        {"\n"}
        {currentQuestion?.question}
      </Text>

      {/* Input để người dùng nhập câu trả lời */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputText}>
          Trả lời: (Bạn có thể thêm TextInput ở đây)
        </Text>
        {/* Placeholder cho TextInput */}
        <Button
          title="Nhập 'Xin chào' cho demo"
          onPress={() => setUserAnswer("Xin chào")}
        />
      </View>

      <View style={styles.buttonContainer}>
        {!isAnswerChecked ? (
          <Button title="Check Answer" onPress={handleCheckAnswer} />
        ) : (
          <Button
            title={
              currentQuestionIndex < currentLessonQuestions.length - 1
                ? "Next Question"
                : "Finish Lesson"
            }
            onPress={handleNextOrFinish}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  questionText: {
    fontSize: 22,
    textAlign: "center",
    marginBottom: 30,
    color: "#555",
  },
  inputContainer: {
    marginBottom: 30,
    alignItems: "center",
  },
  inputText: {
    fontSize: 18,
    marginBottom: 10,
    color: "#666",
  },
  buttonContainer: {
    width: "80%",
  },
});

export default LessonScreen;
