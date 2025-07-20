import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { Audio } from "expo-av";

const questions = [
  {
    id: 1,
    audio: "https://freesound.org/data/previews/59/59631_12345-lq.mp3",
    answers: [
      { id: 1, text: "Chào buổi sáng", isCorrect: true },
      { id: 2, text: "Tạm biệt", isCorrect: false },
      { id: 3, text: "Chúc ngủ ngon", isCorrect: false },
      { id: 4, text: "Chào buổi tối", isCorrect: false },
    ],
  },
  {
    id: 2,
    audio: "https://freesound.org/data/previews/41/41846_102265-lq.mp3",
    answers: [
      { id: 1, text: "Xin lỗi", isCorrect: false },
      { id: 2, text: "Cảm ơn", isCorrect: true },
      { id: 3, text: "Không sao", isCorrect: false },
      { id: 4, text: "Vâng", isCorrect: false },
    ],
  },
];

const ListeningLesson: React.FC = () => {
  const navigation = useNavigation();
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const question = questions[currentQ];

  const playSound = async () => {
    if (sound) {
      await sound.unloadAsync();
    }
    const { sound: newSound } = await Audio.Sound.createAsync({
      uri: question.audio,
    });
    setSound(newSound);
    await newSound.playAsync();
  };

  const handleCheck = () => {
    if (selectedAnswer && !isChecked) {
      const isCorrect = question.answers.find(
        (a) => a.text === selectedAnswer
      )?.isCorrect;

      if (isCorrect) {
        setCorrectCount((prev) => prev + 1);
      }

      setIsChecked(true);

      setTimeout(() => {
        if (currentQ + 1 < questions.length) {
          setCurrentQ((prev) => prev + 1);
          setSelectedAnswer(null);
          setIsChecked(false);
        } else {
          Alert.alert(
            "Hoàn tất",
            `Bạn đã hoàn thành bài nghe!\nĐúng: ${
              correctCount + (isCorrect ? 1 : 0)
            } câu`,
            [
              {
                text: "Thoát",
                onPress: () => navigation.goBack(),
                style: "cancel",
              },
              {
                text: "Làm lại",
                onPress: () => {
                  setCurrentQ(0);
                  setSelectedAnswer(null);
                  setCorrectCount(0);
                  setIsChecked(false);
                },
              },
            ]
          );
        }
      }, 2000);
    }
  };

  const handleAnswerSelect = (text: string) => {
    if (!isChecked) setSelectedAnswer(text);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#666" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Luyện nghe</Text>
        </View>

        {/* Câu hỏi hiện tại */}
        <View style={styles.questionCard}>
          <Text style={styles.questionNumber}>
            Câu hỏi {currentQ + 1}/{questions.length}
          </Text>
          <Text style={styles.questionSubtext}>Nghe âm thanh và chọn đúng</Text>

          <TouchableOpacity style={styles.audioButton} onPress={playSound}>
            <Icon name="play-circle" size={48} color="#FFC1CC" />
            <Text style={styles.playText}>Nghe lại</Text>
          </TouchableOpacity>

          <View style={styles.answerContainer}>
            {question.answers.map((answer) => (
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

      {/* Footer */}
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
              (!selectedAnswer || isChecked) && { opacity: 0.5 },
            ]}
            onPress={handleCheck}
            disabled={!selectedAnswer || isChecked}
          >
            <Text style={styles.checkButtonText}>Kiểm tra</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${
                  ((currentQ + (isChecked ? 1 : 0)) / questions.length) * 100
                }%`,
              },
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

  // Header
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

  // Question Card
  questionCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginTop: 15,
    elevation: 2,
  },
  questionNumber: { fontSize: 16, fontWeight: "500", color: "#333" },
  questionSubtext: { fontSize: 12, color: "#666", marginTop: 5 },

  // Audio
  audioButton: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  playText: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
  },

  // Answer
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
    backgroundColor: "#FFF5F5",
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

  // Footer / Progress
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
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FFC1CC",
    borderRadius: 4,
  },
});

export default ListeningLesson;
