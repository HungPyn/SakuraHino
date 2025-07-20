import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import LessonRenderer from "../../lessonscreen/LessonRenderer";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../../types/navigatorType";
type QuickPracticeRouteProp = RouteProp<RootStackParamList, "QuickPractice">;
const QuickPracticeScreen = () => {
  const route = useRoute<QuickPracticeRouteProp>();
  const { type } = route.params;
  const [progress, setProgress] = useState(0);
  const navigation = useNavigation();
  const handleCheck = () => {
    if (progress < 100) {
      setProgress(progress + 10);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.lessonBody}>
        <LessonRenderer type={type} />
      </View>
    </SafeAreaView>
  );
};

export default QuickPracticeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  lessonBody: {
    flex: 1,
    padding: 16,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#fff",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#F0F0F0",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FFC1CC",
  },
  progressText: {
    textAlign: "right",
    fontSize: 12,
    fontWeight: "500",
    color: "#666",
    marginBottom: 10,
  },
  checkButton: {
    backgroundColor: "#FFC1CC",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  checkButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
