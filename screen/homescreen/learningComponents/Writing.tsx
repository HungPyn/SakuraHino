import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import SignatureCanvas from "react-native-signature-canvas";
import { GoogleVisionAPI } from "./GoogleVisionAPI";

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
  targetWordNative: string; // ví dụ: "あ"
  targetLanguageCode: string;
  optionsLanguageCode: string;
  audioUrlQuestions: string | null;
  choices: Choice[];
}

interface WritingProps {
  question: Question;
  onCheckAnswer: () => void;
  onNextQuestion: () => void;
  onSelectedWords: (words: string[]) => void;
  hearts?: number | null;
}
const correctAnswer = "あ";
const Writing: React.FC<WritingProps> = ({
  question,
  onCheckAnswer,
  onNextQuestion,
  onSelectedWords,
}) => {
  const [recognizedText, setRecognizedText] = useState("");
  const signatureRef = useRef<SignatureCanvas | null>(null);

  const handleOK = async (signature: string) => {
    try {
      const result = await GoogleVisionAPI.recognizeHandwriting(signature);
      const cleanResult = result.trim();
      setRecognizedText(cleanResult);
      onSelectedWords([cleanResult]);
      onCheckAnswer();
    } catch (error) {
      Alert.alert("Lỗi", "Không nhận diện được chữ viết tay.");
    }
  };

  const handleClear = () => {
    signatureRef.current?.clearSignature();
    setRecognizedText("");
  };

  const handleCheck = () => {
    if (signatureRef.current) {
      signatureRef.current.readSignature();
    } else {
      Alert.alert("Thông báo", "Bạn chưa viết gì cả!");
    }
  };

  const handleNext = () => {
    handleClear();
    Alert.alert("Bạn đã hoàn thành!", "Chuyển sang câu tiếp theo.");
    onNextQuestion();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.prompt}>{question.promptTextTemplate}</Text>
      <Text style={styles.bigTargetWord}>{question.targetWordNative}</Text>

      <SignatureCanvas
        ref={signatureRef}
        onOK={handleOK}
        descriptionText=""
        minWidth={2}
        maxWidth={4}
        webStyle={`
          .m-signature-pad--footer {display: none;}
          body { background: #f0f0f0; }
        `}
        backgroundColor="#f0f0f0"
        penColor="#000000"
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.skipButton} onPress={handleClear}>
          <Text style={styles.buttonText}>Xóa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={handleCheck}>
          <Text style={styles.buttonText}>Kiểm tra</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={handleNext}>
          <Text style={styles.buttonText}>Tiếp theo</Text>
        </TouchableOpacity>
      </View>

      {recognizedText ? (
        <Text style={styles.resultText}>
          Kết quả nhận diện: {recognizedText}{" "}
          {recognizedText === question.targetWordNative ? "✅" : "❌"}
        </Text>
      ) : (
        <Text style={styles.resultText}>Kết quả: Chưa có câu trả lời ❌</Text>
      )}
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
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-around",
    width: "85%",
  },
  skipButton: {
    flex: 1,
    backgroundColor: "#ff7043",
    paddingVertical: 15,
    borderRadius: 25,
    marginRight: 10,
    alignItems: "center",
  },
  submitButton: {
    flex: 1,
    backgroundColor: "#1EBE5B",
    paddingVertical: 15,
    borderRadius: 25,
    marginLeft: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
    textAlign: "center",
  },
  resultText: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    color: "#333",
  },
});

export default Writing;
