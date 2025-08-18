import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  SafeAreaView,
  ScrollView,
} from "react-native";

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

export enum QuestionType {
  MULTIPLE_CHOICE_VOCAB_IMAGE = "MULTIPLE_CHOICE_VOCAB_IMAGE",
  MULTIPLE_CHOICE_TEXT_ONLY = "MULTIPLE_CHOICE_TEXT_ONLY",
  AUDIO_CHOICE = "AUDIO_CHOICE",
  WORD_ORDER = "WORD_ORDER",
  PRONUNCIATION = "PRONUNCIATION",
  WRITING = "WRITING",
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

interface WordOrderProps {
  question: Question;
  onCheckAnswer: () => void;
  onNextQuestion: () => void;
  onSelectedWords: (words: string[]) => void;
  hearts?: number | null;
}

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const WordOrder: React.FC<WordOrderProps> = ({
  question,
  onNextQuestion,
  onSelectedWords,
  onCheckAnswer,
}) => {
  const textBlock: string[] = question.choices[0]?.textBlock
    ? JSON.parse(question.choices[0].textBlock)
    : [];

  const [availableWords, setAvailableWords] = useState<string[]>(textBlock);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  const selectWord = (word: string) => {
    LayoutAnimation.easeInEaseOut();
    const newAvailable = availableWords.filter((w) => w !== word);
    const newSelected = [...selectedWords, word];

    setAvailableWords(newAvailable);
    setSelectedWords(newSelected);
    onSelectedWords(newSelected);
  };

  const removeWord = (word: string) => {
    LayoutAnimation.easeInEaseOut();
    const newSelected = selectedWords.filter((w) => w !== word);
    const newAvailable = [...availableWords, word];

    setSelectedWords(newSelected);
    setAvailableWords(newAvailable);
    onSelectedWords(newSelected);
  };

  const handleSubmit = () => {
    onCheckAnswer();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Prompt */}
      <Text style={styles.prompt}>
        {question.promptTextTemplate + "\n"}
        <Text style={styles.promptHighlight}>
          {question.choices[0]?.meaning}
        </Text>
      </Text>

      {/* Word lists trong ScrollView để cuộn khi dài */}
      <ScrollView contentContainerStyle={styles.wordLists}>
        <View style={styles.selectedContainer}>
          {selectedWords.length === 0 ? (
            <Text style={styles.placeholder}>Chạm vào từ để sắp xếp câu</Text>
          ) : (
            selectedWords.map((word, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.selectedWord}
                onPress={() => removeWord(word)}
              >
                <Text style={styles.selectedWordText}>{word}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Available words */}
        <View style={styles.availableContainer}>
          {availableWords.map((word, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.availableWord}
              onPress={() => selectWord(word)}
            >
              <Text style={styles.availableWordText}>{word}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Nút Kiểm tra luôn ở dưới */}
      <TouchableOpacity
        style={[
          styles.submitButton,
          selectedWords.length === 0 && styles.submitButtonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={selectedWords.length === 0}
      >
        <Text style={styles.submitText}>KIỂM TRA</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "space-between",
  },
  prompt: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 100,
    textAlign: "center",
    color: "#333",
  },
  promptHighlight: {
    color: "#1EBE5B",
  },
  wordLists: {
    flexGrow: 1,
    justifyContent: "flex-start",
  },
  selectedContainer: {
    minHeight: 90,
    borderWidth: 1,
    borderColor: "#9ca396",
    borderRadius: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 8,
    marginBottom: 20,
    backgroundColor: "#fafff4",
    alignItems: "center",
  },
  availableContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  selectedWord: {
    backgroundColor: "#51b405ff",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    margin: 4,
  },
  selectedWordText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  availableWord: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    margin: 4,
  },
  availableWordText: { fontSize: 16, fontWeight: "500", color: "#333" },
  placeholder: { fontSize: 14, color: "#aaa" },
  submitButton: {
    backgroundColor: "#1EBE5B",
    paddingVertical: 16,
    borderRadius: 50,
    marginBottom: 30,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
  },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default WordOrder;
