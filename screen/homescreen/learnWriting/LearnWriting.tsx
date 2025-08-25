import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  Image,
  Modal,
  Dimensions,
} from "react-native";
import {
  GuidebookSvg,
  ActiveBookSvg,
  LockedBookSvg,
  CheckmarkSvg,
  LockedDumbbellSvg,
  FastForwardSvg,
  GoldenBookSvg,
  GoldenDumbbellSvg,
  GoldenTreasureSvg,
  GoldenTrophySvg,
  LockSvg,
  StarSvg,
  LockedTreasureSvg,
  LockedTrophySvg,
  UpArrowSvg,
  ActiveTreasureSvg,
  ActiveTrophySvg,
  ActiveDumbbellSvg,
} from "../../../components/Svgs";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomBar } from "../../../components/custombar/BottomBar";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "../../../types/navigatorType";
import topicService from "../../../services/topicService";
import alphabet from "../../../services/alphabet";

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

interface Word {
  id: number;
  japaneseCharacter: string;
  alphabetsStatus: string;
  audioUrl: string;
  characterType: string;
  meaning: string;
}

interface Lesson {
  lessonCode: string;
  lessonName: string;
  topicCode: string;
  position: number;
  status: "LOCKED" | "UNLOCKED" | "PASSED";
}

export type ProgressStatus = "LOCKED" | "UNLOCKED" | "PASSED";

interface Topic {
  topicCode: string;
  topicName: string;
  position: number;
  progressStatus: "LOCKED" | "UNLOCKED" | "PASSED";
  urlImage: string;
  listLesson: Lesson[];
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
}

type TileType =
  | "star"
  | "book"
  | "dumbbell"
  | "treasure"
  | "trophy"
  | "fast-forward";
type TileStatus = "LOCKED" | "ACTIVE" | "COMPLETE";

const COLOR_PALETTES = [
  { backgroundColor: "#58CC02", borderColor: "#46A302", textColor: "#FFFFFF" },
  { backgroundColor: "#1CB0F6", borderColor: "#1899D6", textColor: "#FFFFFF" },
  { backgroundColor: "#FFC800", borderColor: "#FFB800", textColor: "#FFFFFF" },
  { backgroundColor: "#FF4B4B", borderColor: "#E54242", textColor: "#FFFFFF" },
  { backgroundColor: "#7D53B2", borderColor: "#6C4A9E", textColor: "#FFFFFF" },
  { backgroundColor: "#FF8C42", borderColor: "#E67A35", textColor: "#FFFFFF" },
  { backgroundColor: "#00BFA6", borderColor: "#00A38E", textColor: "#FFFFFF" },
  { backgroundColor: "#FF6F91", borderColor: "#E85D7D", textColor: "#FFFFFF" },
  { backgroundColor: "#4C5B5C", borderColor: "#3C4A4B", textColor: "#FFFFFF" },
  { backgroundColor: "#2D87BB", borderColor: "#246E99", textColor: "#FFFFFF" },
  { backgroundColor: "#9CCC65", borderColor: "#7CB342", textColor: "#FFFFFF" },
  { backgroundColor: "#F06292", borderColor: "#E91E63", textColor: "#FFFFFF" },
];

const TOPIC_HEIGHT = 400;

// --- Các Component khác (được giữ nguyên) ---
const getTileLeftOffset = (index: number, unitNumber: number): number => {
  const tileLeftOffsets = [0, -45, -70, -45, 0, 45, 70, 45];
  const offsets =
    unitNumber % 2 === 1
      ? tileLeftOffsets
      : [...tileLeftOffsets.slice(4), ...tileLeftOffsets.slice(0, 4)];
  return offsets[index % offsets.length] ?? 0;
};

const SvgTileIconComponentMap: { [key: string]: React.ComponentType<any> } = {
  Checkmark: CheckmarkSvg,
  Star: StarSvg,
  Lock: LockSvg,
  GoldenBook: GoldenBookSvg,
  ActiveBook: ActiveBookSvg,
  LockedBook: LockedBookSvg,
  GoldenDumbbell: GoldenDumbbellSvg,
  ActiveDumbbell: ActiveDumbbellSvg,
  LockedDumbbell: LockedDumbbellSvg,
  GoldenTreasure: GoldenTreasureSvg,
  ActiveTreasure: ActiveTreasureSvg,
  LockedTreasure: LockedTreasureSvg,
  GoldenTrophy: GoldenTrophySvg,
  ActiveTrophy: ActiveTrophySvg,
  LockedTrophy: LockedTrophySvg,
  FastForward: FastForwardSvg,
};

const TileIcon = ({
  tileType,
  status,
}: {
  tileType: TileType;
  status: TileStatus;
}) => {
  const iconMap = {
    star: { COMPLETE: "Checkmark", ACTIVE: "Star", LOCKED: "Lock" },
    book: {
      COMPLETE: "GoldenBook",
      ACTIVE: "ActiveBook",
      LOCKED: "LockedBook",
    },
    dumbbell: {
      COMPLETE: "GoldenDumbbell",
      ACTIVE: "ActiveDumbbell",
      LOCKED: "LockedDumbbell",
    },
    treasure: {
      COMPLETE: "GoldenTreasure",
      ACTIVE: "ActiveTreasure",
      LOCKED: "LockedTreasure",
    },
    trophy: {
      COMPLETE: "GoldenTrophy",
      ACTIVE: "ActiveTrophy",
      LOCKED: "LockedTrophy",
    },
    "fast-forward": {
      COMPLETE: "Checkmark",
      ACTIVE: "Star",
      LOCKED: "FastForward",
    },
  };
  const iconName = iconMap[tileType]?.[status] || "default";
  const IconComponent = SvgTileIconComponentMap[iconName];
  const iconColor =
    status === "COMPLETE"
      ? COLORS.yellow500
      : status === "ACTIVE"
      ? COLORS.green500
      : COLORS.gray400;
  if (!IconComponent) return null;
  return <IconComponent width={80} height={80} fill={iconColor} />;
};

const HoverLabel = ({
  text,
  textColor,
}: {
  text: string;
  textColor: string;
}) => {
  const bounceValue = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const bounce = () => {
      Animated.sequence([
        Animated.timing(bounceValue, {
          toValue: 1.1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(bounceValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(1000),
      ]).start(bounce);
    };
    bounce();
  }, [bounceValue]);
  return (
    <Animated.View
      style={[styles.hoverLabel, { transform: [{ scale: bounceValue }] }]}
    >
      <View style={styles.hoverLabelInner}>
        <Text style={[styles.hoverLabelText, { color: textColor }]}>
          {text}
        </Text>
      </View>
    </Animated.View>
  );
};

const TileTooltip = ({
  isVisible,
  closeTooltip,
  status,
  description,
  backgroundColor,
  textColor,
  onStart,
}: {
  isVisible: boolean;
  closeTooltip: () => void;
  status: TileStatus;
  description: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  onStart: () => void;
  onPractice: () => void;
}) => {
  if (!isVisible) return null;
  const statusConfig = {
    ACTIVE: {
      bg: backgroundColor,
      text: COLORS.textLight,
      buttonText: "Bắt đầu +10 XP",
    },
    LOCKED: {
      bg: COLORS.gray100,
      text: COLORS.gray400,
      buttonText: "Khóa",
    },
    COMPLETE: {
      bg: COLORS.yellow400,
      text: COLORS.yellow600,
      buttonText: "Luyện tập +5 XP",
    },
  };
  const config = statusConfig[status];
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={closeTooltip}
    >
      <Pressable style={styles.modalBackdrop} onPress={closeTooltip}>
        <Pressable style={[styles.tileTooltip, { backgroundColor: config.bg }]}>
          <Text style={[styles.tileTooltipText, { color: config.text }]}>
            {description}
          </Text>
          <TouchableOpacity
            style={[
              styles.tileTooltipButton,
              {
                backgroundColor:
                  status === "ACTIVE" || status === "COMPLETE"
                    ? COLORS.white
                    : COLORS.gray200,
                borderColor:
                  status === "ACTIVE" || status === "COMPLETE"
                    ? COLORS.gray200
                    : "transparent",
              },
            ]}
            onPress={
              status === "ACTIVE" || status === "COMPLETE" ? onStart : undefined
            }
            disabled={status === "LOCKED"}
          >
            <Text
              style={[
                styles.tileTooltipButtonText,
                {
                  color:
                    status === "ACTIVE" || status === "COMPLETE"
                      ? config.bg
                      : config.buttonText,
                },
              ]}
            >
              {config.buttonText}
            </Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

// Đổi tên component UnitSection thành WordSection và nhận wordsData làm props
const WordSection = ({
  wordsData,
  selectedTab,
}: {
  wordsData: Word[];
  selectedTab: "learnNew" | "learnOld" | "PracticeAlphabet";
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedWordIndex, setSelectedWordIndex] = useState<null | number>(
    null
  );

  const getTileStatus = (status: ProgressStatus): TileStatus => {
    switch (status) {
      case "UNLOCKED":
        return "ACTIVE";
      case "PASSED":
        return "COMPLETE";
      case "LOCKED":
      default:
        return "LOCKED";
    }
  };

  const handleWordPress = (
    word: Word,
    index: number,
    status: ProgressStatus
  ) => {
    setSelectedWordIndex(index);
  };

  const selectedWord =
    selectedWordIndex !== null ? wordsData[selectedWordIndex] : null;

  return (
    <View style={styles.unitSection}>
      <View style={styles.tilesContainer}>
        {wordsData.map((word, i: number) => {
          // Luôn đặt trạng thái là "UNLOCKED" để mở khóa tất cả
          const status = "UNLOCKED" as ProgressStatus;
          const tileStatus = getTileStatus(status);
          let colors;

          if (selectedTab === "learnOld") {
            // Logic mới: gán màu cố định cho chữ cũ (tab "Viết lại")
            colors = {
              bg: "#4aa92aff", // Màu xám nhạt
              border: "#A9A9A9", // Màu viền xám đậm hơn
            };
          } else {
            // Logic cũ: giữ nguyên màu ngẫu nhiên cho chữ mới (tab "Chữ mới")
            colors =
              status === "UNLOCKED"
                ? {
                    bg: COLOR_PALETTES[i % COLOR_PALETTES.length]
                      .backgroundColor,
                    border:
                      COLOR_PALETTES[i % COLOR_PALETTES.length].borderColor,
                  }
                : status === "PASSED"
                ? { bg: COLORS.green500, border: COLORS.green500 }
                : { bg: COLORS.gray200, border: COLORS.gray400 };
          }
          return (
            <View
              key={i}
              style={[
                styles.tileWrapper,
                {
                  transform: [{ translateX: getTileLeftOffset(i, 0) }],
                },
              ]}
            >
              {status === "UNLOCKED" && (
                <HoverLabel text="Start" textColor={colors.border} />
              )}
              <TouchableOpacity
                style={[
                  styles.tileButton,
                  { backgroundColor: colors.bg, borderColor: colors.border },
                ]}
                onPress={() => handleWordPress(word, i, status)}
                activeOpacity={0.8}
              >
                <Text style={styles.tileText}>{word.japaneseCharacter}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
      {selectedWord && (
        <TileTooltip
          isVisible={selectedWordIndex !== null}
          closeTooltip={() => setSelectedWordIndex(null)}
          status={getTileStatus("UNLOCKED")}
          description={
            selectedWord.japaneseCharacter + " (" + selectedWord.meaning + ")"
          }
          backgroundColor={
            COLOR_PALETTES[(selectedWordIndex ?? 0) % COLOR_PALETTES.length]
              .backgroundColor
          }
          borderColor={
            COLOR_PALETTES[(selectedWordIndex ?? 0) % COLOR_PALETTES.length]
              .borderColor
          }
          textColor={
            COLOR_PALETTES[(selectedWordIndex ?? 0) % COLOR_PALETTES.length]
              .textColor
          }
          onStart={() => {
            navigation.navigate("WritingPractice", {
              isLearning: true,
              isNewWord: selectedTab === "learnNew",
              isKanji: false,
              id: selectedWord.id,
              word: selectedWord.japaneseCharacter,
              romaji: selectedWord.meaning,
              audioUrl: selectedWord.audioUrl,
              furigana: "",
              meaning: "",
            });
            setSelectedWordIndex(null);
          }}
          onPractice={() => {}}
        />
      )}
    </View>
  );
};

// --- Component chính ---
const LearningPathScreen = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollY, setScrollY] = useState(0);
  const [selectedTab, setSelectedTab] = useState<
    "learnNew" | "learnOld" | "PracticeAlphabet"
  >("learnNew");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [newWords, setNewWords] = useState<Word[]>([]);
  const [oldWords, setOldWords] = useState<Word[]>([]);
  const [displayWords, setDisplayWords] = useState<Word[]>([]);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const fetchTopics = async () => {
    try {
      const data: Topic[] = await topicService.getTopics();
      if (data) {
        const coloredTopics = data.map((topic, index) => {
          const colorIndex = index % COLOR_PALETTES.length;
          const fixedColor = COLOR_PALETTES[colorIndex];
          return {
            ...topic,
            ...fixedColor,
          };
        });
        setTopics(coloredTopics);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách topics:", error);
    }
  };

  useEffect(() => {
    (async () => {
      const response = await alphabet.getAllWord();
      if (response) {
        setNewWords(response.listNewCharacter);
        setOldWords(response.listOldCharacter);
        // Hiển thị danh sách "Chữ mới" mặc định ban đầu
        setDisplayWords(response.listNewCharacter);
      }
    })();
  }, []);
  useEffect(() => {
    if (selectedTab === "learnNew") {
      setDisplayWords(newWords);
    } else if (selectedTab === "learnOld") {
      setDisplayWords(oldWords);
    }
  }, [selectedTab, newWords, oldWords]);

  const getTopBarColors = (y: number): { bg: string; border: string } => {
    const currentTopicIndex = Math.floor(y / TOPIC_HEIGHT);
    const currentTopic = topics[currentTopicIndex] || topics[0];
    const backgroundColor = currentTopic?.backgroundColor || "#58CC02";
    const borderColor = currentTopic?.borderColor || "#46A302";
    return { bg: backgroundColor, border: borderColor };
  };

  const topBarColors = getTopBarColors(scrollY);

  // Hàm render giao diện học đường
  const renderLearningPathView = () => (
    <ScrollView
      ref={scrollViewRef}
      onScroll={(event) => setScrollY(event.nativeEvent.contentOffset.y)}
      scrollEventThrottle={16}
      contentContainerStyle={styles.scrollViewContent}
      style={styles.mainScroll}
    >
      {displayWords.length > 0 ? (
        <>
          {/* Thêm phần text có điều kiện ở đây */}
          {selectedTab === "learnNew" && (
            <Text style={styles.practiceText}>Chữ mới hôm nay!</Text>
          )}
          <WordSection wordsData={displayWords} selectedTab={selectedTab} />
        </>
      ) : (
        <View style={styles.emptyWordsContainer}>
          <Text style={styles.emptyWordsText}>
            Chưa có chữ nào để luyện tập. Hãy học chữ mới trước nhé!
          </Text>
        </View>
      )}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "learnNew" && styles.tabButtonActive,
          ]}
          onPress={() => setSelectedTab("learnNew")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "learnNew" && styles.tabTextActive,
            ]}
          >
            Chữ mới
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "learnOld" && styles.tabButtonActive,
          ]}
          onPress={() => setSelectedTab("learnOld")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "learnOld" && styles.tabTextActive,
            ]}
          >
            Viết lại
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "PracticeAlphabet" && styles.tabButtonActive,
          ]}
          onPress={() => navigation.navigate("Alphabet")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "PracticeAlphabet" && styles.tabTextActive,
            ]}
          >
            Chữ cái
          </Text>
        </TouchableOpacity>
      </View>
      {renderLearningPathView()}
      {scrollY > 200 && (
        <TouchableOpacity
          style={styles.upArrowButton}
          onPress={() =>
            scrollViewRef.current?.scrollTo({ y: 0, animated: true })
          }
        >
          <UpArrowSvg />
        </TouchableOpacity>
      )}
      <BottomBar selectedTab="LearnWriting" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainScroll: {},
  container: { flex: 1, backgroundColor: COLORS.white, paddingBottom: 40 },
  topBar: {
    height: 50,
    paddingTop: 40,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  topBarTitle: { color: COLORS.white, fontSize: 20, fontWeight: "bold" },
  scrollViewContent: { alignItems: "center", padding: 16, paddingTop: 20 },
  unitSection: { width: "100%", alignItems: "center", marginBottom: 32 },
  unitHeader: {
    width: "100%",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  practiceText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#5eca5eff",
    textAlign: "center",
    marginBottom: 0,
  },
  emptyWordsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyWordsText: {
    fontSize: 18,
    textAlign: "center",
    color: COLORS.gray500,
    fontWeight: "bold",
  },
  unitHeaderTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.textLight,
  },
  unitHeaderDescription: { fontSize: 16, color: COLORS.textLight },
  guidebookButton: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderBottomWidth: 4,
  },
  guidebookImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    resizeMode: "cover",
  },
  guidebookText: { color: COLORS.textLight, fontWeight: "bold", marginLeft: 8 },
  tilesContainer: { marginTop: 40, width: "100%", alignItems: "center" },
  tileWrapper: { height: 100, alignItems: "center", justifyContent: "center" },
  tileButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderBottomWidth: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  tileTooltip: {
    width: "80%",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    gap: 16,
  },
  tileTooltipText: { fontSize: 20, fontWeight: "bold", textAlign: "center" },
  tileTooltipButton: {
    width: "100%",
    padding: 16,
    borderRadius: 12,
    borderBottomWidth: 4,
    borderColor: COLORS.gray200,
    alignItems: "center",
  },
  tileTooltipButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  hoverLabel: { position: "absolute", top: -10, zIndex: 1 },
  hoverLabelInner: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.gray200,
  },
  hoverLabelText: {
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  upArrowButton: {
    position: "absolute",
    bottom: 100,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.gray200,
    elevation: 5,
  },
  tileText: {
    fontSize: 28, // Kích thước chữ tùy chỉnh
    fontWeight: "bold",
    color: "#FFFFFF", // Màu chữ
    textAlign: "center",
  },
  // Style cho thanh tab
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    marginTop: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 6,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 10,
  },
  tabButtonActive: {
    backgroundColor: "#2ECC71",
  },
  tabText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#171a1aff",
  },
  tabTextActive: {
    color: "#FFFFFF",
  },
});

export default LearningPathScreen;
