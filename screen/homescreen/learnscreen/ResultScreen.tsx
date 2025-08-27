import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/FontAwesome";
import type { RootStackParamList } from "../../../types/navigatorType";

type ResultScreenRouteProp = NativeStackScreenProps<
  RootStackParamList,
  "Result"
>["route"];
type ResultScreenNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "Result"
>["navigation"];

const ResultScreen = () => {
  const navigation = useNavigation<ResultScreenNavigationProp>();
  const route = useRoute<ResultScreenRouteProp>();

  // Thêm 'isTest' vào destructuring từ route.params
  const { isTest, corect, totalQuestion, score, commitTime } = route.params;

  // Tách phút và giây từ chuỗi thời gian
  const [minutes, seconds] = commitTime.split(":").map(Number);
  const totalSeconds = minutes * 60 + seconds;

  // State và Animated.Value cho hiệu ứng tăng điểm XP
  const [animatedScore, setAnimatedScore] = useState(0);
  const scoreValue = useRef(new Animated.Value(0)).current;

  // State và Animated.Value cho hiệu ứng tăng số câu đúng
  const [animatedCorrect, setAnimatedCorrect] = useState(0);
  const correctValue = useRef(new Animated.Value(0)).current;

  // State và Animated.Value cho hiệu ứng tăng thời gian
  const [animatedTime, setAnimatedTime] = useState("00:00");
  const timeValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animation cho điểm số XP
    Animated.timing(scoreValue, {
      toValue: score,
      duration: 1000,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();

    // Animation cho số câu đúng
    Animated.timing(correctValue, {
      toValue: corect,
      duration: 1000,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();

    // Animation cho thời gian
    Animated.timing(timeValue, {
      toValue: totalSeconds,
      duration: 1000,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  }, [score, corect, totalSeconds, scoreValue, correctValue, timeValue]);

  // Cập nhật giá trị hiển thị khi animated values thay đổi
  useEffect(() => {
    scoreValue.addListener(({ value }) => {
      setAnimatedScore(Math.floor(value));
    });

    correctValue.addListener(({ value }) => {
      setAnimatedCorrect(Math.floor(value));
    });

    timeValue.addListener(({ value }) => {
      const animatedMinutes = Math.floor(value / 60);
      const animatedSeconds = Math.floor(value % 60);
      const formattedTime = `${String(animatedMinutes).padStart(
        2,
        "0"
      )}:${String(animatedSeconds).padStart(2, "0")}`;
      setAnimatedTime(formattedTime);
    });

    return () => {
      scoreValue.removeAllListeners();
      correctValue.removeAllListeners();
      timeValue.removeAllListeners();
    };
  }, [scoreValue, correctValue, timeValue]);

  const handleGoToLearningPath = () => {
    if (isTest) {
      navigation.navigate("LearningPathScreen", { isTest: true });
    } else {
      navigation.navigate("LearningPathScreen", { isTest: false });
    }
  };

  // --- LOGIC MỚI: Dựa vào isTest để hiển thị kết quả
  let mainColor, headerText, iconName;
  if (isTest) {
    mainColor = "#58CC02"; // Luôn là màu xanh lá
    headerText = "Hoàn thành!";
    iconName = "smile-o";
  } else {
    const isFailed = score < 70;
    mainColor = isFailed ? "#FF6347" : "#58CC02";
    headerText = isFailed ? "Cố gắng hơn nữa!" : "Hoàn hảo!";
    iconName = isFailed ? "frown-o" : "smile-o";
  }

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {/* Biểu tượng và tiêu đề */}
        <View style={styles.topSection}>
          <Icon
            name={iconName}
            size={100}
            color={mainColor}
            style={styles.characterIcon}
          />
          <Text style={[styles.header, { color: mainColor }]}>
            {headerText}
          </Text>
        </View>

        {/* Thông tin kết quả */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Icon name="check-circle" size={24} color={mainColor} />
            <View style={styles.statCircle}>
              <Text style={styles.statText}>
                <Animated.Text style={{ color: mainColor }}>
                  {animatedCorrect}
                </Animated.Text>
                /{totalQuestion}
              </Text>
            </View>
            <Text style={styles.statLabel}>Đúng</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="bolt" size={24} color={mainColor} />
            <View style={styles.statCircle}>
              <Text style={[styles.statValue, { color: mainColor }]}>
                {animatedScore}
              </Text>
            </View>
            <Text style={styles.statLabel}>XP</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="clock-o" size={24} color={mainColor} />
            <View style={styles.statCircle}>
              <Text style={[styles.statValue, { color: mainColor }]}>
                {animatedTime}
              </Text>
            </View>
            <Text style={styles.statLabel}>Thời gian</Text>
          </View>
        </View>
      </View>

      {/* Nút Tiếp tục */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={[styles.continueButton, { backgroundColor: mainColor }]}
          onPress={handleGoToLearningPath}
        >
          <Text style={styles.continueButtonText}>TIẾP TỤC</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "space-between",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  topSection: {
    alignItems: "center",
    marginBottom: 80,
  },
  characterIcon: {
    marginBottom: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 40,
  },
  statItem: {
    alignItems: "center",
  },
  statCircle: {
    width: 90, // Tùy chỉnh kích thước
    height: 40, // Tùy chỉnh kích thước
    backgroundColor: "#e0e0e0",
    borderRadius: 20, // Làm cho góc bo tròn
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  statText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statValue: {
    fontWeight: "bold",
    fontSize: 18,
  },
  statLabel: {
    fontSize: 16,
    color: "#888",
    marginTop: 5,
  },
  bottomSection: {
    width: "100%",
    alignItems: "center",
  },
  continueButton: {
    width: "90%",
    marginBottom: 30,
    paddingVertical: 18,
    borderRadius: 50,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});

export default ResultScreen;
