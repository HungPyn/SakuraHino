import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const WritingLesson: React.FC = () => {
  const navigation = useNavigation();
  const [userInput, setUserInput] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const correctAnswer = "おはよう";

  const handleCheck = () => {
    if (isChecked) return;
    setIsChecked(true);
    if (userInput.trim() === correctAnswer) {
      setCorrectCount(correctCount + 1);
    }
  };

  const handleBackPress = () => {
    Alert.alert("Xác nhận thoát", "Bạn có chắc chắn muốn thoát không?", [
      { text: "Hủy", style: "cancel" },
      { text: "Thoát", onPress: () => navigation.goBack(), style: "destructive" },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress}>
            <Icon name="arrow-back" size={24} color="#666" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Viết từ vựng</Text>
        </View>

        {/* Main Writing Section */}
        <View style={styles.lessonCard}>
          <Text style={styles.instructionText}>Hãy viết lại từ sau bằng tiếng Nhật</Text>
          <Text style={styles.wordToWrite}>Chào buổi sáng</Text>

          {/* Viết vào ô */}
          <TextInput
            style={[
              styles.inputBox,
              isChecked &&
                (userInput.trim() === correctAnswer
                  ? styles.correctInput
                  : styles.wrongInput),
            ]}
            placeholder="Nhập từ tiếng Nhật..."
            value={userInput}
            onChangeText={setUserInput}
            editable={!isChecked}
          />

          {isChecked && (
            <Text
              style={[
                styles.feedbackText,
                userInput.trim() === correctAnswer
                  ? styles.correctFeedback
                  : styles.wrongFeedback,
              ]}
            >
              {userInput.trim() === correctAnswer
                ? "Chính xác!"
                : `Sai rồi! Đáp án đúng là "${correctAnswer}"`}
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.correctCountText}>{correctCount} câu đúng</Text>
        <TouchableOpacity
          style={[styles.checkButton, isChecked && { opacity: 0.6 }]}
          onPress={handleCheck}
          disabled={isChecked}
        >
          <Text style={styles.checkButtonText}>Kiểm tra</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: { fontSize: 18, fontWeight: "500", color: "#333", marginLeft: 10 },
  lessonCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    elevation: 2,
  },
  instructionText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  wordToWrite: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFC1CC",
    marginBottom: 20,
    textAlign: "center",
  },
  inputBox: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 12,
    fontSize: 18,
    backgroundColor: "#FAFAFA",
  },
  correctInput: {
    borderColor: "#34C759",
    backgroundColor: "#E6FFE6",
  },
  wrongInput: {
    borderColor: "#FF3B30",
    backgroundColor: "#FFE6E6",
  },
  feedbackText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "500",
  },
  correctFeedback: {
    color: "#34C759",
  },
  wrongFeedback: {
    color: "#FF3B30",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#fff",
  },
  correctCountText: { fontSize: 14, fontWeight: "500", color: "#333" },
  checkButton: {
    backgroundColor: "#FFC1CC",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  checkButtonText: { color: "#fff", fontWeight: "500", fontSize: 14 },
});

export default WritingLesson;
