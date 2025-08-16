import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";

export enum QuestionType {
  MULTIPLE_CHOICE_VOCAB_IMAGE = "MULTIPLE_CHOICE_VOCAB_IMAGE",
  MULTIPLE_CHOICE_TEXT_ONLY = "MULTIPLE_CHOICE_TEXT_ONLY",
  AUDIO_CHOICE = "AUDIO_CHOICE",
  WORD_ORDER = "WORD_ORDER",
  PRONUNCIATION = "PRONUNCIATION",
  WRITING = "WRITING",
}

export interface Choice {
  id: number;
  lessonQuestionId: number | null;
  textForeign: string;
  textRomaji: string | null;
  imageUrl: string | null;
  audioUrlForeign: string | null;
  isCorrect: boolean;
  textBlock: string | null;
  meaning: string | null;
}

export interface Question {
  id: number;
  lessonId: number;
  questionType: QuestionType;
  promptTextTemplate: string;
  targetWordNative: string;
  targetLanguageCode: string;
  optionsLanguageCode: string;
  audioUrlQuestions: string | null;
  choices: Choice[];
}

interface WritingProps {
  question: Question;
  onCheckAnswer: () => void;
  onNextQuestion: () => void;
  onSelectedWords: (words: string[]) => void; // giống WordOrder
  hearts?: number | null;
}

const Writing: React.FC<WritingProps> = ({
  question,
  onCheckAnswer,
  onNextQuestion,
  onSelectedWords,
}) => {
  const [userInput, setUserInput] = useState("");

  // Gửi chữ người dùng giống WordOrder khi bấm Hoàn tất
  const handleSubmit = () => {
    const trimmed = userInput.trim();
    if (!trimmed) {
      Alert.alert("Thông báo", "Vui lòng nhập câu trả lời!");
      return;
    }

    // gửi chữ đã trim lên cha
    onSelectedWords([trimmed]);
    console.log("Đã gửi chữ:", trimmed);

    // delay 1 giây trước khi gọi kiểm tra

    onCheckAnswer();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1, width: "100%", alignItems: "center" }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.prompt}>{question.promptTextTemplate}</Text>
        <Text style={styles.bigTargetWord}>{question.targetWordNative}</Text>

        <TextInput
          style={styles.textInput}
          value={userInput}
          onChangeText={(text) => {
            setUserInput(text); // cập nhật state local
            onSelectedWords([text.trim()]); // cập nhật luôn state cha
          }}
          multiline
          placeholder="Nhập câu trả lời..."
        />

        {userInput ? (
          <Text style={styles.preview}>Bạn đã nhập: {userInput}</Text>
        ) : null}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Kiểm tra</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f7fa",
    alignItems: "center",
    paddingTop: 60,
  },
  bigTargetWord: {
    fontSize: 60,
    fontWeight: "800",
    color: "#1EBE5B",
    textAlign: "center",
    marginBottom: 20,
    letterSpacing: 2,
  },
  prompt: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  highlight: { color: "#1ebf5b" },
  textInput: {
    width: "85%",
    minHeight: 200,
    borderWidth: 1,
    borderColor: "#1EBE5B",
    borderRadius: 15,
    padding: 15,
    fontSize: 18,
    backgroundColor: "#fff",
    textAlignVertical: "top",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  preview: {
    marginTop: 15,
    fontSize: 16,
    fontStyle: "italic",
    color: "#555",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 40,
    justifyContent: "space-around",
    width: "85%",
  },
  skipButton: {
    flex: 1,
    backgroundColor: "#ff7043",
    paddingVertical: 15,
    borderRadius: 25,
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  submitButton: {
    flex: 1,
    backgroundColor: "#1EBE5B",
    paddingVertical: 15,
    borderRadius: 25,
    marginLeft: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
    textAlign: "center",
  },
});

export default Writing;
