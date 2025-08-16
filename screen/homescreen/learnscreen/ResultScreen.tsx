import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/FontAwesome"; // Import Icon từ FontAwesome
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

  const { corect, totalQuestion, score, commitTime } = route.params;

  const handleGoToLearningPath = () => {
    navigation.replace("LearningPathScreen");
  };

  const isFailed = score < 70;
  const mainColor = isFailed ? "#FF6347" : "#58CC02";
  const headerText = isFailed ? "Cố gắng hơn nữa!" : "Hoàn hảo!";
  const iconName = isFailed ? "frown-o" : "smile-o";

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
            <Text style={styles.statText}>
              <Text style={{ color: mainColor }}>{corect}</Text>/{totalQuestion}
            </Text>
            <Text style={styles.statLabel}>Đã trả lời đúng</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="bolt" size={24} color={mainColor} />
            <Text style={[styles.statValue, { color: mainColor }]}>
              {Math.floor(score)}
            </Text>
            <Text style={styles.statLabel}>XP</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="clock-o" size={24} color={mainColor} />
            <Text style={[styles.statValue, { color: mainColor }]}>
              {commitTime}
            </Text>
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
    marginBottom: 40,
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
  },
  statItem: {
    alignItems: "center",
  },
  statText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#555",
    marginTop: 5,
  },
  statValue: {
    fontWeight: "bold",
    fontSize: 24,
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
    paddingVertical: 18,
    borderRadius: 12,
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
