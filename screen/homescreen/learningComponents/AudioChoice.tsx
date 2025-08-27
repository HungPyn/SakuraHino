import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Animated,
} from "react-native";
import { Audio } from "expo-av";
import Icon from "react-native-vector-icons/FontAwesome";
import { QUnitType } from "dayjs";
import { Sound } from "expo-av/build/Audio";

export interface Choice {
  id: number;
  lessonQuestionId: number | null;
  textForeign: string;
  textRomaji?: string | null;
  imageUrl?: string | null;
  audioUrlForeign?: string | null;
  isCorrect: boolean;
  meaning?: string | null;
}

export interface Question {
  id: number;
  lessonId: number;
  questionType: QuestionType;
  status: "PUBLISHED" | "PENDING" | "DELETED";
  promptTextTemplate: string;
  targetWordNative: string;
  targetLanguageCode: string; // "vi", "ja-JP", "en-US", ...
  audioUrl?: string | null;
  choices?: Choice[];
}
export enum QuestionType {
  MULTIPLE_CHOICE_VOCAB_IMAGE = "MULTIPLE_CHOICE_VOCAB_IMAGE",
  MULTIPLE_CHOICE_TEXT_ONLY = "MULTIPLE_CHOICE_TEXT_ONLY",
  AUDIO_CHOICE = "AUDIO_CHOICE",
  WORD_ORDER = "WORD_ORDER",
  PRONUNCIATION = "PRONUNCIATION",
  WRITING = "WRITING",
}

interface AudioChoiceProps {
  question: Question;
  onCheckAnswer: () => void;
  onNextQuestion: () => void;
  onSelectAnswer: (answer: Choice | null) => void;
  hearts: number | null;
}

const AudioChoice: React.FC<AudioChoiceProps> = ({
  question,
  onCheckAnswer,
  onSelectAnswer,
  onNextQuestion,
}) => {
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const scaleAnim = useState(new Animated.Value(1))[0];

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
  }; // khai báo
  const soundRef = useRef<Sound | null>(null);
  const preloadRef = useRef(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!question.audioUrl) return;
      preloadRef.current = true;
      try {
        const { sound } = await Audio.Sound.createAsync(
          { uri: question.audioUrl },
          { shouldPlay: false } // preload nhưng chưa play
        );
        if (!mounted) {
          await sound.unloadAsync();
          return;
        }
        soundRef.current = sound;
      } catch (e) {
        console.warn("Preload error:", e);
      } finally {
        preloadRef.current = false;
      }
    })();

    return () => {
      mounted = false;
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }
    };
  }, [question.audioUrl]);

  const handlePlayAudio = async () => {
    if (!question.audioUrl) return;
    const s = soundRef.current;
    if (!s) {
      // chưa preload xong -> fallback: load & play
      try {
        const { sound } = await Audio.Sound.createAsync(
          { uri: question.audioUrl },
          { shouldPlay: true }
        );
        // unload ngay sau finish
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status?.isLoaded && status.didJustFinish) {
            sound.unloadAsync().catch(() => {});
          }
        });
        return;
      } catch (e) {
        console.warn(e);
        return;
      }
    }

    try {
      const status = await s.getStatusAsync();
      if (!status.isLoaded) {
        // load nếu chưa loaded
        await s.loadAsync({ uri: question.audioUrl }, { shouldPlay: true });
        return;
      }
      if (typeof s.replayAsync === "function") {
        await s.replayAsync();
      } else {
        await s.setPositionAsync(0);
        await s.playAsync();
      }
    } catch (e) {
      console.warn("Play error:", e);
    }
  };
  const renderItem = ({ item }: { item: Choice }) => {
    const isSelected = selectedChoice?.id === item.id;
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={() => handleSelect(item)}>
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
            {item.textForeign +
              "  " +
              item.textRomaji +
              " (" +
              item.meaning +
              ")"}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>{question.promptTextTemplate}</Text>

      <TouchableOpacity onPress={handlePlayAudio} style={styles.speakerButton}>
        <Icon name="volume-up" size={80} color="#333" />
      </TouchableOpacity>

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
    backgroundColor: "#fff",
  },
  questionText: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  speakerButton: {
    padding: 20,
    borderRadius: 100,
    backgroundColor: "#54f05cff",
    marginBottom: 30,
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
    elevation: 3,
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

export default AudioChoice;
