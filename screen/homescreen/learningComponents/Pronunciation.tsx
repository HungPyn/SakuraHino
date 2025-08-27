import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
  Alert,
} from "react-native";
import { Audio } from "expo-av";
import Icon from "react-native-vector-icons/FontAwesome";
import * as FileSystem from "expo-file-system";
import { QuestionType } from "./Writing";

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
  targetLanguageCode: string;
  audioUrl?: string | null;
  choices?: Choice[];
}

interface PronunciationProps {
  question: Question;
  onNextQuestion: () => void;
  onSelectedWords: (words: string[]) => void;
  onCheckAnswer: () => void;
}

const API_KEY = "ehehehehehe";

const requestMicrophonePermission = async () => {
  if (Platform.OS === "android") {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: "Quyền Microphone",
        message: "Ứng dụng cần quyền microphone để ghi âm",
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userTranscript, setUserTranscript] = useState("");
  const [voiceError, setVoiceError] = useState("");
  const micAnimation = useRef(new Animated.Value(1)).current;
  const recordingRef = useRef<Audio.Recording | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  const startRecording = async () => {
    if (isRecording || isProcessing) return;

    const permission = await requestMicrophonePermission();
    if (!permission) return;

    setIsProcessing(true);
    setVoiceError("");
    setUserTranscript("");

    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        staysActiveInBackground: true,
      });

      const recording = new Audio.Recording();
      recordingRef.current = recording;

      const recordingOptions = {
        android: {
          extension: ".m4a",
          outputFormat: 2, // MPEG_4
          audioEncoder: 3, // AAC
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          extension: ".m4a",
          audioQuality: 0, // HIGH
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {},
      };

      await recording.prepareToRecordAsync(recordingOptions);
      await recording.startAsync();
      setIsRecording(true);
    } catch (err) {
      console.error("Start recording error:", err);
      setVoiceError("Không thể bắt đầu ghi âm");
    } finally {
      setIsProcessing(false);
    }
  };

  const stopRecording = async () => {
    if (!recordingRef.current) return;

    setIsProcessing(true);
    try {
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      console.log("Recorded file:", uri);

      setIsRecording(false);

      if (!uri) {
        setVoiceError("Không có file ghi âm");
        return;
      }

      const base64Audio = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Gửi lên Google STT
      const requestBody = JSON.stringify({
        config: {
          encoding: "OGG_OPUS", // Đổi từ "LINEAR16" sang "OGG_OPUS"
          sampleRateHertz: 48000, // Thường OGG_OPUS có sampleRate 48000
          languageCode: question.targetLanguageCode,
          model: "default",
        },
        audio: { content: base64Audio },
      });
      const response = await fetch(
        `https://speech.googleapis.com/v1/speech:recognize?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: requestBody,
        }
      );

      const data = await response.json();
      console.log("Google STT Response:", JSON.stringify(data, null, 2));

      if (data.results?.length) {
        const transcript = data.results[0].alternatives[0].transcript;
        setUserTranscript(transcript);
        onSelectedWords([transcript]);
        onCheckAnswer();
      } else {
        setVoiceError("Không thể nhận dạng giọng nói");
      }
    } catch (err) {
      console.error("Stop recording error:", err);
      setVoiceError("Có lỗi khi dừng ghi âm hoặc gửi audio");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePlayAudio = async () => {
    if (!question.audioUrl) return;
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      const { sound } = await Audio.Sound.createAsync(
        { uri: question.audioUrl },
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
    } catch (e) {
      console.error("Audio playback error:", e);
      setIsPlaying(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.prompt}>
        {question.promptTextTemplate}
        <Text style={styles.highlight}>
          {"\n" +
            question.targetWordNative +
            "  " +
            question.choices?.[0]?.textRomaji +
            "\n" +
            question.choices?.[0]?.meaning}
        </Text>
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
          onPress={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator
              size="small"
              color="#63c93eff"
              style={{ marginRight: 12 }}
            />
          ) : (
            <Icon
              name="microphone"
              size={24}
              color="#63c93eff"
              style={{ marginRight: 12 }}
            />
          )}
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
    bottom: 50,
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
