import React, { useEffect, useRef, useState } from "react";
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
import Toast from "react-native-toast-message";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Audio } from "expo-av";

import Icon from "react-native-vector-icons/Ionicons";
import alphabet from "../../../services/alphabet";

interface RouteParams {
  isLearning: boolean;
  isNewWord: boolean;
  isKanji: boolean;
  id: string;
  word: string;
  furigana: string;
  romaji: string;
  meaning: string;
  audioUrl: string;
}

const PlaySoundButton = ({ audioUrl }: { audioUrl: string }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const playSound = async () => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true }
      );
      setSound(newSound);
      await newSound.playAsync();
    } catch (error) {
      console.error("Lỗi khi phát âm thanh:", error);
      Alert.alert("Lỗi", "Không thể phát âm thanh.");
    }
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <TouchableOpacity onPress={playSound} style={styles.soundIcon}>
      <Icon name="volume-high-outline" size={30} color="#2980B9" />
    </TouchableOpacity>
  );
};

const WritingPractice = () => {
  const route = useRoute();
  const navigation = useNavigation(); // Thêm hook useNavigation
  const {
    isLearning,
    id,
    isNewWord,
    isKanji,
    word,
    furigana,
    romaji,
    meaning,
    audioUrl,
  } = route.params as RouteParams;

  const [recognizedText, setRecognizedText] = useState("");
  const signatureRef = useRef<any>(null);

  const handleOK = async (signature: string) => {
    try {
      const result = await GoogleVisionAPI.recognizeHandwriting(signature);
      const cleanResult = result.trim();
      setRecognizedText(cleanResult);

      console.log("Chữ viết là nhận lại được là:", cleanResult);
      if (cleanResult === "") {
        Toast.show({
          type: "error",
          text1: "Không nhận diện được chữ viết!",
          position: "bottom",
          visibilityTime: 1000,
        });
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không nhận diện được chữ viết tay.");
    }
  };

  const playCorrectSound = async (filePath: any) => {
    try {
      const { sound } = await Audio.Sound.createAsync(filePath);
      await sound.playAsync();

      // Giải phóng bộ nhớ khi phát xong
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.log("Lỗi phát âm thanh:", error);
    }
  };

  // -------------------------------------------------------------
  useEffect(() => {
    if (recognizedText) {
      console.log("Đã đọc chữ viết tay là:", recognizedText);
      if (recognizedText === word) {
        Toast.show({
          type: "success",
          text1: "Chính xác!",
          position: "top",
          visibilityTime: 1000,
        });
        setRecognizedText(""); // Xóa chữ đã nhận diện sau khi kiểm tra
        playCorrectSound(require("../sound/soundCorect.mp3"));
        signatureRef.current?.clearSignature(); // Xóa chữ viết tay
        if (isLearning) {
          (async () => {
            if (isNewWord) {
              const response = await alphabet.resultNewWord(id);

              if (response) {
                navigation.navigate("LearnWriting");
              }
            } else {
              const response = await alphabet.resultOldWord(id);
              if (response) {
                navigation.navigate("LearnWriting");
              }
            }
          })();
        }
      } else {
        Toast.show({
          type: "error",
          text1: "Chưa đúng!",
          position: "top",
          visibilityTime: 1000,
        });
      }
    }
  }, [recognizedText]); // useEffect sẽ chạy mỗi khi recognizedText thay đổi
  // -------------------------------------------------------------
  const handleCheck = () => {
    if (signatureRef.current) {
      signatureRef.current.readSignature();
    } else {
      Alert.alert("Thông báo", "Bạn chưa viết gì cả!");
    }
  };

  const handleClear = () => {
    signatureRef.current?.clearSignature();
    setRecognizedText("");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Nút trở về */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Icon name="arrow-back-outline" size={24} color="#333" />
      </TouchableOpacity>

      <View style={styles.wordInfoContainer}>
        <Text style={styles.bigTargetWord}>{word}</Text>
        {isKanji && (
          <View style={styles.furiganaContainer}>
            <Text style={styles.furiganaText}>furigana: {furigana}</Text>
            <View style={styles.romajiRow}>
              <Text style={styles.romajiText}>romaji: {romaji}</Text>
              <PlaySoundButton audioUrl={audioUrl} />
            </View>
            <Text style={styles.meaningText}>Ý nghĩa: {meaning}</Text>
          </View>
        )}
        {!isKanji && (
          <View style={styles.romajiRow}>
            <Text style={styles.romajiText}>romaji: {romaji}</Text>
            <PlaySoundButton audioUrl={audioUrl} />
          </View>
        )}
      </View>
      <View style={styles.signatureBox}>
        <SignatureCanvas
          ref={signatureRef}
          onOK={handleOK}
          descriptionText=""
          minWidth={2}
          maxWidth={4}
          webStyle={`
                .m-signature-pad--footer {display: none;}
                .m-signature-pad--body { height: 400px; }
                body { background: #f0f0f0; }
            `}
          backgroundColor="#f0f0f0"
          penColor="#000000"
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.skipButton} onPress={handleClear}>
          <Text style={styles.buttonText}>Xóa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={handleCheck}>
          <Text style={styles.buttonText}>Kiểm tra</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 40,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  prompt: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 15,
    color: "#333",
  },
  wordInfoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  bigTargetWord: {
    fontSize: 60,
    fontWeight: "800",
    color: "#26dd3fff",
    textAlign: "center",
    letterSpacing: 2,
  },
  furiganaContainer: {
    marginTop: 5,
    alignItems: "center",
  },
  furiganaText: {
    fontSize: 16,
    color: "#777",
  },
  romajiRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  romajiText: {
    fontSize: 16,
    color: "#555",
  },
  soundIcon: {
    marginLeft: 5,
    padding: 5,
  },
  iconText: {
    fontSize: 16,
    color: "#2980B9",
  },
  meaningText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 5,
  },
  signatureBox: {
    width: "90%",
    height: 400,
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 20,
    overflow: "hidden",
  },
  buttonContainer: {
    flexDirection: "row",
    marginBottom: 60,
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

export default WritingPractice;
