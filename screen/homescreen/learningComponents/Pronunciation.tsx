import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Animated,
} from "react-native";
import { Audio } from "expo-av";
import Icon from "react-native-vector-icons/FontAwesome";
import Voice from "@react-native-voice/voice";

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

interface PronunciationProps {
  question: Question;
  onCheckAnswer: () => void;
  onNextQuestion: () => void;
  onSelectedWords: (words: string[]) => void;
  hearts?: number | null;
}

const Pronunciation: React.FC<PronunciationProps> = ({
  question,
  onNextQuestion,
  onSelectedWords,
  onCheckAnswer,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [userTranscript, setUserTranscript] = useState<string>("");
  const soundRef = useRef<Audio.Sound | null>(null);
  const micAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Voice handlers
    Voice.onSpeechStart = () => {
      setIsRecording(true);
      setUserTranscript("");
      Animated.loop(
        Animated.sequence([
          Animated.timing(micAnimation, {
            toValue: 1.3,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(micAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    Voice.onSpeechEnd = () => {
      setIsRecording(false);
      Animated.timing(micAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    };

    Voice.onSpeechResults = (e) => {
      if (e.value && e.value.length > 0) {
        setUserTranscript(e.value[0]);
        onSelectedWords([e.value[0]]);
      }
    };

    Voice.onSpeechError = () => {
      Alert.alert("Lỗi", "Không thể nhận dạng giọng nói. Thử lại nhé!");
      setIsRecording(false);
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startRecording = async () => {
    const { granted } = await Audio.requestPermissionsAsync();
    if (!granted) return Alert.alert("Cần quyền truy cập microphone!");

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      await Voice.start(question.targetLanguageCode);
    } catch {
      Alert.alert("Không thể bắt đầu ghi âm!");
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
      if (userTranscript) onCheckAnswer();
    } catch {
      Alert.alert("Không thể dừng ghi âm!");
    }
  };

  const handlePlayAudio = async () => {
    if (!question.audioUrlQuestions) return;
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
      }
      const { sound } = await Audio.Sound.createAsync(
        { uri: question.audioUrlQuestions },
        { shouldPlay: true }
      );
      soundRef.current = sound;
      setIsPlaying(true);
      sound.setOnPlaybackStatusUpdate((status) => {
        if (
          "isLoaded" in status &&
          status.isLoaded &&
          status.positionMillis >= status.durationMillis!
        ) {
          setIsPlaying(false);
          sound.unloadAsync();
          soundRef.current = null;
        }
      });
    } catch {
      setIsPlaying(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.prompt}>
        {question.promptTextTemplate}{" "}
        <Text style={styles.highlight}>{question.targetWordNative}</Text>
      </Text>

      <TouchableOpacity
        style={[styles.speakerButton, isPlaying && { opacity: 0.6 }]}
        onPress={handlePlayAudio}
        disabled={isPlaying}
      >
        <Icon name="volume-up" size={50} color="#fff" />
      </TouchableOpacity>

      <Animated.View style={{ transform: [{ scale: micAnimation }] }}>
        <TouchableOpacity
          style={[
            styles.micButton,
            isRecording && { backgroundColor: "#ff5b5b" },
          ]}
          onPress={isRecording ? stopRecording : startRecording}
        >
          <Icon name="microphone" size={60} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      {userTranscript ? (
        <Text style={styles.transcript}>{userTranscript}</Text>
      ) : (
        <Text style={styles.transcriptPlaceholder}>Nói vào micro...</Text>
      )}

      <TouchableOpacity style={styles.skipButton} onPress={onNextQuestion}>
        <Text style={styles.skipText}>Bỏ qua</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f5f7",
    alignItems: "center",
    paddingTop: 60,
  },
  prompt: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 40,
    color: "#333",
  },
  highlight: { color: "#1ebf5b" },
  speakerButton: {
    backgroundColor: "#4f9cff",
    padding: 25,
    borderRadius: 100,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  micButton: {
    backgroundColor: "#1EBE5B",
    padding: 25,
    borderRadius: 100,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  transcript: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    color: "#333",
    textAlign: "center",
  },
  transcriptPlaceholder: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#888",
    marginTop: 20,
    textAlign: "center",
  },
  skipButton: {
    marginTop: 50,
    paddingHorizontal: 40,
    paddingVertical: 14,
    backgroundColor: "#ff7043",
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  skipText: { color: "#fff", fontWeight: "700", fontSize: 18 },
});

export default Pronunciation;
