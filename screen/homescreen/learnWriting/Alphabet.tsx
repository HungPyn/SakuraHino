// AlphabetScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Audio } from "expo-av";
import { kana } from "../../../services/alphabet";
import { PracticeExerciseSvg } from "../../../components/Svgs";

// --- Constants ---
const COLORS = {
  white: "#FFFFFF",
  gray100: "#f3f4f6",
  gray200: "#e5e7eb",
  gray400: "#9ca3af",
  gray500: "#6b7280",
  yellow400: "#facc15",
  yellow500: "#eab308",
  yellow600: "#ca8a04",
  yellow200: "#fef08a",
  green500: "#22c55e",
  blue500: "#3b82f6",
  textLight: "#FFFFFF",
  textDark: "#000000",
};

const { width } = Dimensions.get("window");
const CARD_MARGIN = 8;
const NUM_COLUMNS = 5;
const CARD_SIZE = (width - CARD_MARGIN * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

// Định nghĩa kiểu dữ liệu Kana
export interface Kana {
  id: string;
  hira: string;
  kata: string;
  romaji: string;
  audioUrl: string;
}

// Component Card cho Bảng chữ cái
const AlphabetCard = ({ kanaItem }: { kanaItem: Kana }) => {
  const navigation = useNavigation();
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const playSound = async () => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: kanaItem.audioUrl },
        { shouldPlay: true }
      );
      setSound(newSound);
      await newSound.playAsync();
    } catch (error) {
      console.error("Lỗi khi phát âm thanh:", error);
    }
  };

  const goToWriteScreen = () => {
    navigation.navigate("WritingPractice", {
      isLearning: false,
      isKanji: false,
      id: 0,
      word: kanaItem.hira,
      romaji: kanaItem.romaji,
      audioUrl: kanaItem.audioUrl,
      furigana: "",
      meaning: "",
    });
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <TouchableOpacity
      onPress={playSound}
      onLongPress={goToWriteScreen}
      delayLongPress={1500}
      style={styles.alphabetCard}
      activeOpacity={0.7}
    >
      <View style={styles.kanaWrapper}>
        <Text style={styles.hiraText}>{kanaItem.hira}</Text>
        <Text style={styles.kataText}>{kanaItem.kata}</Text>
      </View>
      <Text style={styles.romajiText}>{kanaItem.romaji}</Text>
    </TouchableOpacity>
  );
};

// Component màn hình Bảng chữ cái
const AlphabetScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Trở về</Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>Hãy chọn một chữ cái để luyện viết.</Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentAlphabet}
      >
        <View style={styles.gridContainer}>
          {kana.map((kanaItem) => (
            <AlphabetCard key={kanaItem.id} kanaItem={kanaItem} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: COLORS.gray200,
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.gray500,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#34495E",
    marginLeft: 10,
    flex: 1,
  },
  subtitle: {
    fontSize: 16,
    color: "#7F8C8D",
    marginBottom: 20,
  },
  scrollContentAlphabet: {
    paddingBottom: 30,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: -CARD_MARGIN / 2,
  },
  alphabetCard: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
    marginBottom: CARD_MARGIN,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  kanaWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  hiraText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#34495E",
    marginRight: 2,
  },
  kataText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#34495E",
  },
  romajiText: {
    fontSize: 12,
    color: "#95A5A6",
    marginTop: 0,
  },
});

export default AlphabetScreen;
