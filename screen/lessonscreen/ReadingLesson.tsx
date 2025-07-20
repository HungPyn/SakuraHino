import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Alert } from "react-native";
const ReadingLesson: React.FC = () => {
  const route = useRoute();
  const { type } = route.params as { type: string };
  const navigation = useNavigation();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [isChecked, setIsChecked] = useState(false);

  const answers = [
    { id: 1, text: "Chào buổi sáng", isCorrect: true },
    { id: 2, text: "Tạm biệt", isCorrect: false },
    { id: 3, text: "Chúc ngủ ngon", isCorrect: false },
    { id: 4, text: "Chào buổi tối", isCorrect: false },
  ];

  const handleAnswerSelect = (answerText: string) => {
    if (!isChecked) {
      setSelectedAnswer(answerText);
    }
  };
  const handleBackPress = () => {
    Alert.alert(
      "Xác nhận thoát",
      "Bạn có chắc chắn muốn thoát không?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Thoát",
          onPress: () => navigation.goBack(),
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };
  const handleCheck = () => {
    if (selectedAnswer && !isChecked) {
      const isCorrect = answers.find(
        (a) => a.text === selectedAnswer
      )?.isCorrect;
      if (isCorrect) {
        setCorrectCount(correctCount + 1);
      }
      setIsChecked(true);

      setTimeout(() => {
        setSelectedAnswer(null);
        setIsChecked(false);
        // TODO: Load next question here if you have multiple
      }, 2000);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress}>
            <Icon name="arrow-back" size={24} color="#666" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Luyện tập nhanh</Text>
        </View>

        {/* Question Section */}
        <View style={styles.questionCard}>
          <View style={styles.questionHeader}>
            <View>
              <Text style={styles.questionNumber}>Câu hỏi 1/10</Text>
              <Text style={styles.questionSubtext}>
                Chọn nghĩa đúng của từ sau
              </Text>
            </View>
            <View style={styles.timer}>
              <Icon name="timer-outline" size={20} color="#666" />
              <Text style={styles.timerText}>4:30</Text>
            </View>
          </View>
          <Text style={styles.questionText}>おはよう</Text>

          <View style={styles.answerContainer}>
            {answers.map((answer) => (
              <TouchableOpacity
                key={answer.id}
                style={[
                  styles.answerButton,
                  selectedAnswer === answer.text &&
                    !isChecked &&
                    styles.selectedAnswer,
                  isChecked && answer.isCorrect && styles.correctAnswer,
                  isChecked &&
                    selectedAnswer === answer.text &&
                    !answer.isCorrect &&
                    styles.wrongAnswer,
                ]}
                onPress={() => handleAnswerSelect(answer.text)}
                disabled={isChecked}
              >
                <Text style={styles.answerText}>{answer.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressInfo}>
          <View style={styles.correctCount}>
            <Icon
              name="checkmark-outline"
              size={20}
              color="#FFC1CC"
              style={styles.icon}
            />
            <Text style={styles.correctCountText}>{correctCount} câu đúng</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.checkButton,
              (isChecked || !selectedAnswer) && { opacity: 0.5 },
            ]}
            onPress={handleCheck}
            disabled={isChecked || !selectedAnswer}
          >
            <Text style={styles.checkButtonText}>Kiểm tra</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(correctCount / 10) * 100}%` },
            ]}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 10 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
    marginLeft: 10,
  },
  questionCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginTop: 15,
    elevation: 2,
  },
  questionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  questionNumber: { fontSize: 16, fontWeight: "500", color: "#333" },
  questionSubtext: { fontSize: 12, color: "#666", marginTop: 5 },
  timer: { flexDirection: "row", alignItems: "center" },
  timerText: { fontSize: 16, fontWeight: "500", color: "#333", marginLeft: 5 },
  questionText: {
    fontSize: 24,
    fontWeight: "500",
    color: "#FFC1CC",
    textAlign: "center",
    paddingVertical: 20,
  },
  answerContainer: { marginTop: 15 },
  answerButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  selectedAnswer: {
    borderColor: "#FFC1CC",
    backgroundColor: "#FFF5BA",
  },
  correctAnswer: {
    backgroundColor: "#E6FFE6",
    borderColor: "#34C759",
  },
  wrongAnswer: {
    backgroundColor: "#FFE6E6",
    borderColor: "#FF3B30",
  },
  answerText: { fontSize: 14, color: "#333" },
  progressBarContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    alignItems: "center",
  },
  correctCount: { flexDirection: "row", alignItems: "center" },
  icon: { marginRight: 5 },
  correctCountText: { fontSize: 14, fontWeight: "500", color: "#333" },
  checkButton: {
    backgroundColor: "#FFC1CC",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  checkButtonText: { color: "#fff", fontSize: 14, fontWeight: "500" },
  progressBar: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FFC1CC",
    borderRadius: 4,
  },
});

export default ReadingLesson;
