import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Alert,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Audio } from "expo-av";
import Icon from "react-native-vector-icons/FontAwesome";
import Voice, {
  SpeechResultsEvent,
  SpeechErrorEvent,
  SpeechStartEvent,
  SpeechEndEvent,
} from "@react-native-voice/voice";

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
  promptTextTemplate: string;
  targetWordNative: string;
  targetLanguageCode: string; // "ja-JP", "en-US", ...
  audioUrlQuestions: string | null;
}

interface PronunciationProps {
  question: Question;
  onNextQuestion: () => void;
  onSelectedWords: (words: string[]) => void;
  onCheckAnswer: () => void;
}

const requestMicrophonePermission = async () => {
  if (Platform.OS === "android") {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: "Quyền Microphone",
        message: "Ứng dụng cần quyền microphone để nhận dạng giọng nói",
        buttonNeutral: "Hỏi sau",
        buttonNegative: "Hủy",
        buttonPositive: "Đồng ý",
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
};

const Pronunciation: React.FC<PronunciationProps> = ({
  question,
  onNextQuestion,
  onSelectedWords,
  onCheckAnswer,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userTranscript, setUserTranscript] = useState<string>("");
  const [voiceError, setVoiceError] = useState<string>("");
  const micAnimation = useRef(new Animated.Value(1)).current;
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isVoiceAvailable, setIsVoiceAvailable] = useState(false);

  const requestVoice = useCallback(async () => {
    try {
      if (Platform.OS === "ios") {
        const available = await Voice.isAvailable();
        setIsVoiceAvailable(!!available);
        if (!available) console.warn("Voice service not available");
      } else {
        // Android coi như luôn khả dụng
        setIsVoiceAvailable(true);
      }
    } catch (e) {
      console.error("Voice availability error:", e);
      setIsVoiceAvailable(false);
    }
  }, []);

  useEffect(() => {
    requestVoice();
  }, [requestVoice]);

  useEffect(() => {
    const onSpeechStart = (e: SpeechStartEvent) => {
      setIsRecording(true);
      setUserTranscript("");
      setVoiceError("");
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

    const onSpeechEnd = (e: SpeechEndEvent) => {
      setIsRecording(false);
      Animated.timing(micAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    };

    const onSpeechResults = (e: SpeechResultsEvent) => {
      if (e.value && e.value.length > 0) {
        const text = e.value[0];
        setUserTranscript(text);
        onSelectedWords([text]);
        onCheckAnswer();
      }
    };

    const onSpeechError = (e: SpeechErrorEvent) => {
      console.log("Speech error:", e);
      setVoiceError("Không nhận diện được giọng nói. Vui lòng thử lại.");
      setIsRecording(false);
      Alert.alert("Lỗi", "Không thể nhận dạng giọng nói!");
    };

    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, [onSelectedWords, onCheckAnswer, micAnimation]);

  const startRecording = async () => {
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) return;

    setUserTranscript("");
    setVoiceError("");

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      if (Platform.OS === "android") {
        // Android: try catch vì có thể không có SpeechRecognizer
        try {
          await Voice.start(question.targetLanguageCode);
        } catch (err) {
          console.warn("Voice start failed on Android:", err);
          Alert.alert(
            "Lỗi",
            "Thiết bị Android này không hỗ trợ nhận dạng giọng nói."
          );
        }
      } else {
        await Voice.start(question.targetLanguageCode);
      }
    } catch (e: any) {
      console.error("Voice start error:", e);
      setVoiceError(e.message || "Lỗi ghi âm");
      Alert.alert("Lỗi", "Không thể bắt đầu ghi âm!");
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
      setIsRecording(false);
    } catch (e) {
      console.error("Voice stop error:", e);
      Alert.alert("Lỗi", "Không thể dừng ghi âm!");
    }
  };

  const handlePlayAudio = async () => {
    if (!question.audioUrlQuestions) return;
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      const { sound } = await Audio.Sound.createAsync(
        { uri: question.audioUrlQuestions },
        { shouldPlay: true }
      );
      soundRef.current = sound;
      setIsPlaying(true);
      sound.setOnPlaybackStatusUpdate((status) => {
        if ("isLoaded" in status && status.isLoaded && status.didJustFinish) {
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
        style={[styles.speakerButton, isPlaying && { opacity: 0.7 }]}
        onPress={handlePlayAudio}
        disabled={isPlaying}
      >
        <Icon name="volume-up" size={50} color="#63c93eff" />
      </TouchableOpacity>

      <Animated.View style={{ transform: [{ scale: micAnimation }] }}>
        <TouchableOpacity
          style={[
            styles.micButton,
            isRecording && { backgroundColor: "#ff7675" },
          ]}
          onPress={startRecording}
        >
          <Icon
            name="microphone"
            size={24}
            color="#63c93eff"
            style={{ marginRight: 12 }}
          />
          <Text style={styles.micText}>
            {isRecording ? "Đang nói..." : "Nhấn để nói"}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.transcriptContainer}>
        {userTranscript ? (
          <Text style={styles.transcript}>{userTranscript}</Text>
        ) : (
          <Text style={styles.transcriptPlaceholder}>
            {voiceError || "Nói vào micro..."}
          </Text>
        )}
      </View>

      <TouchableOpacity style={styles.skipButton} onPress={onNextQuestion}>
        <Text style={styles.skipText}>Bỏ qua</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

// Styles giữ nguyên
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 60,
  },
  prompt: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 40,
    color: "#333",
    paddingHorizontal: 20,
  },
  highlight: { color: "#1ebf5b" },
  speakerButton: {
    backgroundColor: "#f5f6f5ff",
    padding: 25,
    borderRadius: 120,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  micButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f6f6ff",
    paddingVertical: 25,
    paddingHorizontal: 90,
    borderRadius: 20,
    marginTop: 70,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  micText: { color: "#63c93eff", fontSize: 18, fontWeight: "600" },
  transcriptContainer: {
    minHeight: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  transcript: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  transcriptPlaceholder: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#999",
    textAlign: "center",
  },
  skipButton: {
    position: "absolute",
    bottom: 40,
    backgroundColor: "#ff9f43",
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  skipText: { color: "#fff", fontWeight: "700", fontSize: 18 },
});

export default Pronunciation;
