import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Animated,
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

interface SelectImageProps {
  question: Question;
  onCheckAnswer: () => void;
  onNextQuestion: () => void;
  onSelectAnswer: (answer: Choice | null) => void;
  hearts: number | null;
}

const SelectImage: React.FC<SelectImageProps> = ({
  question,
  onCheckAnswer,
  onSelectAnswer,
  onNextQuestion,
}) => {
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [scaleAnim] = useState(new Animated.Value(1));

  const handleSelect = (choice: Choice) => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setSelectedChoice(choice);
    onSelectAnswer(choice);
  };

  const renderItem = ({ item }: { item: Choice }) => (
    <TouchableOpacity activeOpacity={0.8} onPress={() => handleSelect(item)}>
      <Animated.View
        style={[
          styles.choiceContainer,
          selectedChoice?.id === item.id && styles.selectedChoice,
          {
            transform: [
              { scale: selectedChoice?.id === item.id ? scaleAnim : 1 },
            ],
          },
        ]}
      >
        <Image
          source={{ uri: item.imageUrl! }}
          style={styles.image}
          resizeMode="cover"
        />
      </Animated.View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>
        {question.promptTextTemplate + "\n"}
        <Text style={styles.highlightText}>{question.targetWordNative}</Text>
      </Text>

      <FlatList
        data={question.choices}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.flatListContainer}
      />

      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          style={[styles.checkButton, !selectedChoice && styles.disabledButton]}
          onPress={onCheckAnswer}
          disabled={!selectedChoice}
        >
          <Text style={styles.buttonText}>Kiểm tra</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50, // Thêm khoảng đệm trên
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF", // Nền trắng
  },
  questionText: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 30,
    textAlign: "center",
    color: "#333",
  },
  highlightText: {
    color: "#1EBE5B",
  },
  flatListContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  choiceContainer: {
    width: 150,
    height: 150,
    margin: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#B2DFDB",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    overflow: "hidden",
  },
  selectedChoice: {
    borderColor: "#00796B",
    backgroundColor: "#B2DFDB",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  buttonWrapper: {
    width: "100%",
    marginTop: 20,
  },
  checkButton: {
    backgroundColor: "#1EBE5B",
    paddingVertical: 16,
    borderRadius: 50,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: "#B0B0B0",
  },
  skipButton: {
    backgroundColor: "#FF7043",
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
});

export default SelectImage;
