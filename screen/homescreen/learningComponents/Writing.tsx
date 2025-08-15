import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

// 1. Định nghĩa các kiểu dữ liệu
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

// 2. Định nghĩa Props cho component Writing
//    Bạn có thể thêm các props khác tùy theo nhu cầu
interface WritingProps {
  question: Question;
  onCheckAnswer: () => void;
  onNextQuestion: () => void;
  hearts: number | null;
}

// 3. Cập nhật component để nhận props và sử dụng chúng
const Writing: React.FC<WritingProps> = ({ question, onNextQuestion }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Màn hình: Luyện Viết</Text>
      {/* Bây giờ bạn có thể hiển thị dữ liệu từ prop `question` */}
      <Text style={styles.questionText}>{question.promptTextTemplate}</Text>
      <TouchableOpacity onPress={onNextQuestion}>
        <Text>Bỏ qua</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e6f7ff",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  questionText: {
    marginTop: 20,
    fontSize: 18,
    fontStyle: "italic",
  },
});

export default Writing;
