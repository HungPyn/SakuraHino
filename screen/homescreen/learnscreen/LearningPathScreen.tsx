import React, { use, useCallback, useEffect, useRef, useState } from "react";

import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  Image,
  Alert,
  Platform,
  Modal,
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
  PracticeExerciseSvg,
} from "../../../components/Svgs";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useBoundStore } from "../../../hooks/useBoundStore";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { BottomBar } from "../../../components/custombar/BottomBar";
import { Tab } from "../../../components/custombar/useBottomBarItems";
import TopBar from "../../../components/TopBar";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "../../../types/navigatorType";
import topicService from "../../../services/topicService";
import profileService from "../../../services/profileService";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import PushNotification from "react-native-push-notification";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

interface Lesson {
  lessonCode: string;
  lessonName: string;
  topicCode: string;
  position: number;
  status: "LOCKED" | "UNLOCKED" | "PASSED";
}

export type ProgressStatus = "LOCKED" | "UNLOCKED" | "PASSED";

// Định nghĩa giao diện `Topic`
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
export interface User {
  name: string;
  email: string;
  username: string;
  avatarUrl: string;
  longStreak: number;
  expScore: number;
  isNewUser: boolean;
}

// Định nghĩa kiểu dữ liệu cho icon
type TileType =
  | "star"
  | "book"
  | "dumbbell"
  | "treasure"
  | "trophy"
  | "fast-forward";

// Định nghĩa các bảng màu
const COLOR_PALETTES = [
  { backgroundColor: "#58CC02", borderColor: "#46A302", textColor: "#FFFFFF" },
  { backgroundColor: "#1CB0F6", borderColor: "#1899D6", textColor: "#FFFFFF" },
  { backgroundColor: "#FFC800", borderColor: "#FFB800", textColor: "#FFFFFF" },
  { backgroundColor: "#FF4B4B", borderColor: "#E54242", textColor: "#FFFFFF" },
  { backgroundColor: "#7D53B2", borderColor: "#6C4A9E", textColor: "#FFFFFF" },
  { backgroundColor: "#FF8C42", borderColor: "#E67A35", textColor: "#FFFFFF" }, // cam sáng
  { backgroundColor: "#00BFA6", borderColor: "#00A38E", textColor: "#FFFFFF" }, // ngọc lam
  { backgroundColor: "#FF6F91", borderColor: "#E85D7D", textColor: "#FFFFFF" }, // hồng
  { backgroundColor: "#4C5B5C", borderColor: "#3C4A4B", textColor: "#FFFFFF" }, // xám đậm
  { backgroundColor: "#2D87BB", borderColor: "#246E99", textColor: "#FFFFFF" }, // xanh navy

  { backgroundColor: "#9CCC65", borderColor: "#7CB342", textColor: "#FFFFFF" }, // xanh lá nhạt
  { backgroundColor: "#F06292", borderColor: "#E91E63", textColor: "#FFFFFF" }, // hồng đậm
];
type LearningPathScreenRouteProp = NativeStackScreenProps<
  RootStackParamList,
  "LearningPathScreen"
>["route"];

const STORAGE_KEY = "@reminder_time";

// Định nghĩa chiều cao của một chủ đề ở đây để toàn bộ component có thể truy cập
const TOPIC_HEIGHT = 400;

// --- Navigation ---
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// --- Helper Functions ---
type TileStatus = "LOCKED" | "ACTIVE" | "COMPLETE";

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
    return null;
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
  backgroundColor,
  textColor,
  onStart,
  onPractice,
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
          {/* Sửa logic hiển thị nút bấm */}
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

const UnitSection = ({ topic }: { topic: Topic }) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedLessonIndex, setSelectedLessonIndex] = useState<null | number>(
    null
  );
  const language = useBoundStore((state) => state.language);

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

  const handleLessonPress = (
    lesson: Lesson,
    index: number,
    status: ProgressStatus
  ) => {
    // Luôn hiển thị pop-up khi bấm vào bất kỳ bài học nào.
    setSelectedLessonIndex(index);
  };
  const getStatusText = (status: "LOCKED" | "UNLOCKED" | "PASSED"): string => {
    switch (status) {
      case "LOCKED":
        return "Chưa mở khóa";
      case "UNLOCKED":
        return "Mở";
      case "PASSED":
        return "Đã hoàn thành";
      default:
        return "";
    }
  };

  const selectedLesson =
    selectedLessonIndex !== null ? topic.listLesson[selectedLessonIndex] : null;

  return (
    <View style={styles.unitSection}>
      <View
        style={[
          styles.unitHeader,
          {
            backgroundColor: topic.backgroundColor || "#58cc02",
          },
        ]}
      >
        <View>
          <Text style={styles.unitHeaderTitle}>{topic.topicName}</Text>
          <Text style={styles.unitHeaderDescription}>
            {getStatusText(topic.progressStatus)}
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.guidebookButton,
            {
              borderColor: topic.borderColor || "#46a302",
              backgroundColor: topic.backgroundColor || "#58cc02", // Thêm màu nền cho nút
              width: 48,
              height: 48,
              borderRadius: 24,
            },
          ]}
        >
          {topic.urlImage ? (
            // Nếu có urlImage, hiển thị hình ảnh
            <Image
              source={{ uri: topic.urlImage }}
              style={styles.guidebookImage}
            />
          ) : (
            // Nếu không có, hiển thị Svg mặc định
            <GuidebookSvg width={24} height={24} fill={"#FFFFFF"} />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.tilesContainer}>
        {topic.listLesson &&
          topic.listLesson.map((lesson, i: number) => {
            const status = lesson.status;
            const tileStatusForIcon = getTileStatus(status);
            const tileTypeForIcon: TileType = i % 2 === 0 ? "book" : "star";
            const colors =
              status === "UNLOCKED"
                ? {
                    bg: topic.backgroundColor || "#58cc02",
                    border: topic.borderColor || "#46a302",
                  }
                : status === "PASSED"
                  ? { bg: COLORS.green500, border: COLORS.green500 }
                  : { bg: COLORS.gray200, border: COLORS.gray400 };
            return (
              <View
                key={i}
                style={[
                  styles.tileWrapper,
                  {
                    transform: [
                      { translateX: getTileLeftOffset(i, topic.position) },
                    ],
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
                  onPress={() => handleLessonPress(lesson, i, status)}
                  activeOpacity={0.8}
                >
                  <TileIcon
                    tileType={tileTypeForIcon}
                    status={tileStatusForIcon}
                  />
                </TouchableOpacity>
              </View>
            );
          })}
      </View>

      {selectedLesson && (
        <TileTooltip
          isVisible={selectedLessonIndex !== null}
          closeTooltip={() => setSelectedLessonIndex(null)}
          status={getTileStatus(selectedLesson.status)}
          description={selectedLesson.lessonName}
          backgroundColor={topic.backgroundColor || "#58cc02"}
          borderColor={topic.borderColor || "#46a302"}
          textColor={topic.textColor || "#FFFFFF"}
          onStart={() => {
            if (selectedLesson.lessonName.toLowerCase() === "ôn tập") {
              navigation.navigate("Lesson", {
                lessonCode: "",
                topicCode: selectedLesson.topicCode,
                practice: true,
              });
            } else {
              navigation.navigate("Lesson", {
                lessonCode: selectedLesson.lessonCode,
                topicCode: selectedLesson.topicCode,
                practice: false,
              });
            }
            setSelectedLessonIndex(null);
          }}
          onPractice={() => {}}
        />
      )}
    </View>
  );
};

// Component chính
const LearningPathScreen = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollY, setScrollY] = useState(0);
  const [selectedTab, setSelectedTab] = useState<Tab>("Learn");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const navigation = useNavigation();
  const route = useRoute<LearningPathScreenRouteProp>();
  const isTest = route.params?.isTest;

  const [isTestPopupVisible, setTestPopupVisible] = useState(false);

  // THÊM MỚI: State và hàm cho popup lịch hẹn
  const [isReminderPickerVisible, setReminderPickerVisible] = useState(false);
  const [selectedReminderTime, setSelectedReminderTime] = useState(new Date());

  // THÊM MỚI: Hàm để hiện/ẩn DateTimePicker
  const showReminderPicker = () => setReminderPickerVisible(true);
  const hideReminderPicker = () => setReminderPickerVisible(false);

  // THÊM MỚI: Hàm xử lý khi chọn thời gian
  const handleReminderTimeConfirm = (date: Date) => {
    setSelectedReminderTime(date);
    hideReminderPicker();
  };

  // THÊM MỚI: Hàm để lên lịch thông báo
  const scheduleNotification = async () => {
    const now = new Date();
    const fireDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      selectedReminderTime.getHours(),
      selectedReminderTime.getMinutes(),
      0
    );

    if (fireDate <= now) {
      fireDate.setDate(fireDate.getDate() + 1);
    }
    await AsyncStorage.setItem(STORAGE_KEY, fireDate.toISOString());

    PushNotification.localNotificationSchedule({
      channelId: "reminder-channel",
      title: "SakuraHino nhắc nhở học tập",
      message: "Đến giờ học rồi! Hãy mở app và học thôi 🚀",
      date: fireDate,
      repeatType: "day",
    });

    Alert.alert(
      "Đã lên lịch",
      `Thông báo sẽ diễn ra lúc ${formatTime(selectedReminderTime)} mỗi ngày`
    );
    setTestPopupVisible(false); // Đóng popup hoàn thành bài kiểm tra
  };

  // THÊM MỚI: Hàm định dạng thời gian
  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours < 10 ? "0" + hours : hours}:${
      minutes < 10 ? "0" + minutes : minutes
    }`;
  };
  useEffect(() => {
    // THÊM MỚI: Tạo kênh thông báo cho Android
    PushNotification.createChannel(
      {
        channelId: "reminder-channel",
        channelName: "SakuraHino nhắc nhở học tập",
        channelDescription: "Thông báo nhắc học",
        importance: 4,
        vibrate: true,
      },
      (created: boolean) => console.log("Channel created:", created)
    );

    // THÊM MỚI: Cấu hình PushNotification
    PushNotification.configure({
      onNotification: function (notification: any) {
        console.log("NOTIFICATION:", notification);
      },
      requestPermissions: Platform.OS === "ios",
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      // Kiểm tra nếu có tham số isTest và giá trị là true
      if (isTest) {
        setTestPopupVisible(true);
        // Sau khi hiển thị popup, reset tham số để tránh việc popup hiện lại
        navigation.setParams({ isTest: undefined });
      }
    }, [isTest, navigation])
  );

  const getUser = async () => {
    try {
      const data = await profileService.getUser();
      setUser(data);
      // console.log("Thông tin người dùng:", JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
    }
  };
  useEffect(() => {
    // Đặt thời gian chờ 2000ms (2 giây) trước khi gọi hàm getUser()
    const timer = setTimeout(() => {
      getUser();
    }, 2000);

    // Đây là cleanup function. Nó sẽ chạy khi component unmount
    // hoặc khi dependencies thay đổi, giúp tránh lỗi memory leak.
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // console.log("User trươc skhi kiểm tra:", JSON.stringify(user, null, 2));
    if (user?.isNewUser) {
      Alert.alert(
        "Chào mừng bạn đến với ứng dụng!",
        "Hãy làm bài kiểm tra để bắt đầu."
      );
      navigation.navigate("LessonTest");
    }
  }, [getUser]);

  const fetchTopics = async () => {
    try {
      const data: Topic[] = await topicService.getTopics();
      if (data) {
        const coloredTopics = data.map((topic, index) => {
          const colorIndex = index % COLOR_PALETTES.length;
          const fixedColor = COLOR_PALETTES[colorIndex];
          // console.log("topic lấy ra là:", JSON.stringify(topic, null, 2));
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
  useFocusEffect(
    useCallback(() => {
      fetchTopics();
    }, [])
  );

  const getTopBarColors = (y: number): { bg: string; border: string } => {
    const currentTopicIndex = Math.floor(y / TOPIC_HEIGHT);
    const currentTopic = topics[currentTopicIndex] || topics[0];
    const backgroundColor = currentTopic?.backgroundColor || "#58CC02";
    const borderColor = currentTopic?.borderColor || "#46A302";
    return { bg: backgroundColor, border: borderColor };
  };

  const topBarColors = getTopBarColors(scrollY);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TopBar
          backgroundColor={topBarColors.bg}
          borderColor={topBarColors.border}
          score={user?.expScore || 0}
          streak={user?.longStreak || 0}
        />
      </View>

      <ScrollView
        ref={scrollViewRef}
        onScroll={(event) => setScrollY(event.nativeEvent.contentOffset.y)}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollViewContent}
        style={styles.mainScroll}
      >
        {topics.map((topic) => (
          <UnitSection key={topic.topicCode} topic={topic} />
        ))}
      </ScrollView>
      {/* <TouchableOpacity style={styles.practiceButton} onPress={() => {}}>
        <PracticeExerciseSvg />
      </TouchableOpacity> */}

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
      {/* THÊM MỚI: Component popup lịch hẹn */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isTestPopupVisible}
        onRequestClose={() => setTestPopupVisible(false)}
      >
        <View style={styles.popupContainer}>
          <View style={styles.popupContent}>
            <Text style={styles.popupTitle}>Giờ thông báo học hàng ngày</Text>
            <TouchableOpacity
              style={styles.clockButton}
              onPress={showReminderPicker}
            >
              <Text style={styles.clockText}>
                {formatTime(selectedReminderTime)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.scheduleButton}
              onPress={scheduleNotification}
            >
              <Text style={styles.scheduleButtonText}>Đặt nhắc nhở</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setTestPopupVisible(false)}
            >
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* THÊM MỚI: Component chọn thời gian */}
      <DateTimePickerModal
        isVisible={isReminderPickerVisible}
        mode="time"
        onConfirm={handleReminderTimeConfirm}
        onCancel={hideReminderPicker}
        is24Hour={true}
      />

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
  popupContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  popupContent: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 20,
    width: "85%",
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  popupTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  clockButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#9a9792ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  clockText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
  scheduleButton: {
    backgroundColor: "#34db61ff",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  scheduleButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 20,
  },
  closeButtonText: {
    color: "#6b7280",
    fontSize: 16,
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
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderBottomWidth: 4,
  },
  guidebookImage: {
    width: 48, // Chiều rộng của hình ảnh bằng với nút bấm
    height: 48, // Chiều cao của hình ảnh bằng với nút bấm
    borderRadius: 24, // Bo tròn bằng một nửa kích thước để có hình tròn hoàn hảo
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
