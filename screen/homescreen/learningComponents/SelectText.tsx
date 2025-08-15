import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Animated,
} from "react-native";
import { Audio } from "expo-av";

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

interface SelectTextProps {
  question: Question;
  onCheckAnswer: () => void;
  onNextQuestion: () => void;
  onSelectAnswer: (answer: Choice | null) => void;
  hearts: number | null;
}

const SelectText: React.FC<SelectTextProps> = ({
  question,
  onCheckAnswer,
  onSelectAnswer,
  onNextQuestion,
}) => {
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const scaleAnim = useState(new Animated.Value(1))[0];
  const soundRef = useRef<Audio.Sound | null>(null);

  const handleSelect = async (choice: Choice) => {
    // Scale animation
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

    // Phát âm thanh nếu có
    if (choice.audioUrlForeign) {
      try {
        // Nếu đang có âm thanh, dừng và unload
        if (soundRef.current) {
          await soundRef.current.stopAsync();
          await soundRef.current.unloadAsync();
        }

        const { sound } = await Audio.Sound.createAsync(
          { uri: choice.audioUrlForeign },
          { shouldPlay: true }
        );

        soundRef.current = sound;

        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            sound.unloadAsync();
            soundRef.current = null;
          }
        });
      } catch (error) {
        console.log("Lỗi phát âm thanh:", error);
      }
    }
  };

  const renderItem = ({ item }: { item: Choice }) => {
    const isSelected = selectedChoice?.id === item.id;
    return (
      <TouchableOpacity activeOpacity={0.9} onPress={() => handleSelect(item)}>
        <Animated.View
          style={[
            styles.choiceContainer,
            isSelected && styles.selectedChoice,
            { transform: [{ scale: isSelected ? scaleAnim : 1 }] },
          ]}
        >
          <Text
            style={[
              styles.choiceText,
              isSelected && { fontWeight: "700", color: "#00796B" },
            ]}
          >
            {item.textForeign}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>
        {question.promptTextTemplate}{" "}
        <Text style={styles.highlightText}>{question.targetWordNative}</Text>
      </Text>

      <FlatList
        data={question.choices}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.flatlist}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <TouchableOpacity
        style={[styles.checkButton, !selectedChoice && styles.disabledButton]}
        onPress={onCheckAnswer}
        disabled={!selectedChoice}
      >
        <Text style={styles.buttonText}>Kiểm tra</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.skipButton} onPress={onNextQuestion}>
        <Text style={styles.buttonText}>Bỏ qua</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
  },
  questionText: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 50,
    textAlign: "center",
    color: "#333",
  },
  highlightText: {
    color: "#1EBE5B",
  },
  flatlist: {
    width: "100%",
  },
  choiceContainer: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#B2DFDB",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  selectedChoice: {
    borderColor: "#00796B",
    backgroundColor: "#B2DFDB",
  },
  choiceText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  checkButton: {
    width: "100%",
    backgroundColor: "#1EBE5B",
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
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
    width: "100%",
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

export default SelectText;
