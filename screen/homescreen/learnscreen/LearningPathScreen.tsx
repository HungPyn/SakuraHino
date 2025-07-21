import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  Modal,
} from "react-native";
import {
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
  PracticeExerciseSvg,
} from "../../../components/Svgs";
import { useNavigation } from "@react-navigation/native";
import { useBoundStore } from "../../../hooks/useBoundStore";
import type { Tile, TileType, Unit } from "../../../units/units";
import { units } from "../../../units/units";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomBar } from "../../../components/custombar/BottomBar";
import { Tab } from "../../../components/custombar/useBottomBarItems";
import TopBar from "../../../components/TopBar";
import { SafeAreaView } from "react-native-safe-area-context";
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

// --- Navigation ---
type RootStackParamList = {
  Lesson: { practice?: boolean; "fast-forward"?: number; "sign-up"?: boolean };
  Guidebook: { code: string; unitNumber: number };
  LearningPath: undefined;
  Shop: undefined;
  Profile: undefined;
  Leaderboards: undefined;
};
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// --- Helper Functions ---
type TileStatus = "LOCKED" | "ACTIVE" | "COMPLETE";

const tileStatus = (tile: Tile, lessonsCompleted: number): TileStatus => {
  const lessonsPerTile = 4;
  const tilesCompleted = Math.floor(lessonsCompleted / lessonsPerTile);
  const allTiles = units.flatMap((unit) => unit.tiles);
  const tileIndex = allTiles.findIndex((t) => t === tile);

  if (tileIndex < 0) return "LOCKED";
  if (tileIndex < tilesCompleted) return "COMPLETE";
  if (tileIndex > tilesCompleted) return "LOCKED";
  return "ACTIVE";
};

const getTileLeftOffset = (index: number, unitNumber: number): number => {
  const tileLeftOffsets = [0, -45, -70, -45, 0, 45, 70, 45];
  const offsets =
    unitNumber % 2 === 1
      ? tileLeftOffsets
      : [...tileLeftOffsets.slice(4), ...tileLeftOffsets.slice(0, 4)];
  return offsets[index % offsets.length] ?? 0;
};
// Ánh xạ tới component cần sử dụng
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

// --- Components ---
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

  if (!IconComponent) {
    console.warn(
      `Icon component for "${iconName}" not found. Falling back to PlaceholderSvg.`
    );
    return (
      <View
        style={{
          width: 40,
          height: 40,
          backgroundColor: iconColor,
          borderRadius: 8,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: COLORS.white, fontSize: 10 }}>{iconName}</Text>
      </View>
    );
  }
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
  unit,
  onStart,
  onPractice,
}: {
  isVisible: boolean;
  closeTooltip: () => void;
  status: TileStatus;
  description: string;
  unit: Unit;
  onStart: () => void;
  onPractice: () => void;
}) => {
  if (!isVisible) return null;

  const activeBackgroundColor = unit.backgroundColor.replace("bg-", "#");
  const activeTextColor = unit.textColor.replace("text-", "#");

  const statusConfig = {
    ACTIVE: {
      bg: activeBackgroundColor,
      text: COLORS.textLight,
      buttonText: activeTextColor,
    },
    LOCKED: {
      bg: COLORS.gray100,
      text: COLORS.gray400,
      buttonText: COLORS.gray400,
    },
    COMPLETE: {
      bg: COLORS.yellow400,
      text: COLORS.yellow600,
      buttonText: COLORS.yellow400,
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
          {status === "ACTIVE" ? (
            <TouchableOpacity
              style={[
                styles.tileTooltipButton,
                { backgroundColor: COLORS.white },
              ]}
              onPress={onStart}
            >
              <Text
                style={[
                  styles.tileTooltipButtonText,
                  { color: config.buttonText },
                ]}
              >
                Start +10 XP
              </Text>
            </TouchableOpacity>
          ) : status === "LOCKED" ? (
            <View
              style={[
                styles.tileTooltipButton,
                { backgroundColor: COLORS.gray200 },
              ]}
            >
              <Text
                style={[
                  styles.tileTooltipButtonText,
                  { color: config.buttonText },
                ]}
              >
                Locked
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[
                styles.tileTooltipButton,
                { backgroundColor: COLORS.white },
              ]}
              onPress={onPractice}
            >
              <Text
                style={[
                  styles.tileTooltipButtonText,
                  { color: config.buttonText },
                ]}
              >
                Practice +5 XP
              </Text>
            </TouchableOpacity>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const UnitHeader = ({
  unit,
  languageCode,
}: {
  unit: Unit;
  languageCode: string;
}) => {
  const navigation = useNavigation<NavigationProp>();
  return (
    <View
      style={[
        styles.unitHeader,
        { backgroundColor: unit.backgroundColor.replace("bg-", "#") },
      ]}
    >
      <View>
        <Text style={styles.unitHeaderTitle}>Unit {unit.unitNumber}</Text>
        <Text style={styles.unitHeaderDescription}>{unit.description}</Text>
      </View>
      <TouchableOpacity
        style={[
          styles.guidebookButton,
          { borderColor: unit.borderColor.replace("border-", "#") },
        ]}
        onPress={() =>
          navigation.navigate("Guidebook", {
            code: languageCode,
            unitNumber: unit.unitNumber,
          })
        }
      >
        <Text style={styles.guidebookText}>Guidebook</Text>
      </TouchableOpacity>
    </View>
  );
};

const UnitSection = ({ unit }: { unit: Unit }) => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedTileIndex, setSelectedTileIndex] = useState<null | number>(
    null
  );
  const lessonsCompleted = useBoundStore((state) => state.lessonsCompleted);
  const increaseLessonsCompleted = useBoundStore(
    (state) => state.increaseLessonsCompleted
  );
  const increaseLingots = useBoundStore((state) => state.increaseLingots);
  const language = useBoundStore((state) => state.language);
  type TileStatus = "LOCKED" | "UNLOCKED" | "COMPLETED"; // Khai báo trùng lặp, nên bỏ
  const handleTilePress = (tile: any, index: number, status: any) => {
    if (tile.type === "fast-forward" && status === "LOCKED") {
      navigation.navigate("Lesson", { "fast-forward": unit.unitNumber });
    } else if (status !== "LOCKED") {
      setSelectedTileIndex(index);
    }
  };

  const selectedTile =
    selectedTileIndex !== null ? unit.tiles[selectedTileIndex] : null;
  const selectedTileStatus = selectedTile
    ? tileStatus(selectedTile, lessonsCompleted)
    : "LOCKED";

  return (
    <View style={styles.unitSection}>
      <UnitHeader unit={unit} languageCode={language.code} />
      <View style={styles.tilesContainer}>
        {unit.tiles.map((tile, i: number) => {
          const status = tileStatus(tile, lessonsCompleted);
          const colors =
            status === "ACTIVE"
              ? {
                  bg: unit.backgroundColor.replace("bg-", "#"),
                  border: unit.borderColor.replace("border-", "#"),
                }
              : status === "COMPLETE"
              ? { bg: COLORS.green500, border: COLORS.green500 }
              : { bg: COLORS.gray200, border: COLORS.gray400 };

          return (
            <View
              key={i}
              style={[
                styles.tileWrapper,
                {
                  transform: [
                    { translateX: getTileLeftOffset(i, unit.unitNumber) },
                  ],
                },
              ]}
            >
              {status === "ACTIVE" && (
                <HoverLabel
                  text="Start"
                  textColor={unit.textColor.replace("text-", "#")}
                />
              )}
              <TouchableOpacity
                style={[
                  styles.tileButton,
                  { backgroundColor: colors.bg, borderColor: colors.border },
                ]}
                onPress={() => handleTilePress(tile, i, status)}
                activeOpacity={0.8}
              >
                <TileIcon tileType={tile.type} status={status} />
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
      {selectedTile && (
        <TileTooltip
          isVisible={selectedTileIndex !== null}
          closeTooltip={() => setSelectedTileIndex(null)}
          status={selectedTileStatus}
          description={
            (selectedTile as { description?: string }).description ||
            `Unit ${unit.unitNumber} Review`
          }
          unit={unit}
          onStart={() => {
            setSelectedTileIndex(null);
            navigation.navigate("Lesson", {});
          }}
          onPractice={() => {
            setSelectedTileIndex(null);
            navigation.navigate("Lesson", { practice: true });
          }}
        />
      )}
    </View>
  );
};

const LearningPathScreen = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollY, setScrollY] = useState(0);
  const [selectedTab, setSelectedTab] = useState<Tab>("Learn");

  const getTopBarColor = (y: number): string => {
    if (y < 680)
      return units[0]?.backgroundColor.replace("bg-", "#") ?? COLORS.green500;
    if (y < 1830)
      return units[1]?.backgroundColor.replace("bg-", "#") ?? COLORS.blue500;
    return units[2]?.backgroundColor.replace("bg-", "#") ?? COLORS.yellow500;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TopBar
          backgroundColor={getTopBarColor(scrollY)}
          borderColor={
            scrollY < 680
              ? units[0]?.borderColor.replace("border-", "#") ?? "#46a302"
              : scrollY < 1830
              ? units[1]?.borderColor.replace("border-", "#") ?? "#3673c2"
              : units[2]?.borderColor.replace("border-", "#") ?? "#ca8a04"
          }
        />
      </View>

      <ScrollView
        ref={scrollViewRef}
        onScroll={(event) => setScrollY(event.nativeEvent.contentOffset.y)}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollViewContent}
        style={styles.mainScroll}
      >
        {units.map((unit) => (
          <UnitSection unit={unit} key={unit.unitNumber} />
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.practiceButton} onPress={() => {}}>
        <PracticeExerciseSvg />
      </TouchableOpacity>

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
      <BottomBar selectedTab={selectedTab} />
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
  unitHeaderTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.textLight,
  },
  unitHeaderDescription: { fontSize: 16, color: COLORS.textLight },
  guidebookButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderBottomWidth: 4,
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
  practiceButton: {
    position: "absolute",
    bottom: 100,
    left: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.gray200,
    elevation: 5,
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
});

export default LearningPathScreen;
