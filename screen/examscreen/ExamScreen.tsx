import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomBar } from "../../components/custombar/BottomBar";
import { Tab } from "../../components/custombar/useBottomBarItems";

interface Exam {
  id: number;
  name: string;
  time: string;
  level: string;
  plays: number;
}

const COLORS = {
  background: "#f0f2f5",
  cardBackground: "#FFFFFF",
  textColorPrimary: "#333333",
  textColorSecondary: "#666666",
  badgeColor: "#3b82f6",
  buttonColor: "#ff7043",
  white: "#FFFFFF",
};

const ExamItem = ({ exam }: { exam: Exam }) => (
  <View style={examStyles.itemContainer}>
    <View style={examStyles.header}>
      <Text style={examStyles.title}>{exam.name}</Text>
      <View style={examStyles.badge}>
        <Text style={examStyles.badgeText}>{exam.level}</Text>
      </View>
    </View>
    {exam.plays && (
      <Text style={examStyles.stats}>+ {exam.plays} lượt làm bài</Text>
    )}
    <Text style={examStyles.stats}>Thời gian: {exam.time}</Text>
    <TouchableOpacity
      style={examStyles.button}
      onPress={() => console.log(`Bắt đầu thi ${exam.level}`)}
    >
      <Text style={examStyles.buttonText}>▶️ Vào thi ngay</Text>
    </TouchableOpacity>
  </View>
);

const ExamTopBar = () => (
  <View style={styles.topBar}>
    <Text style={styles.topBarTitle}>Đề kiểm tra</Text>
  </View>
);

const ExamScreen = () => {
  const [selectedTab, setSelectedTab] = React.useState<Tab>("Exam");

  const examList: Exam[] = [
    {
      id: 1,
      name: "2019年7月 日本語能力試験 N5",
      time: "105 phút",
      level: "N5",
      plays: 8725,
    },
    {
      id: 2,
      name: "2019年7月 日本語能力試験 N4",
      time: "120 phút",
      level: "N4",
      plays: 6543,
    },
    {
      id: 3,
      name: "2019年7月 日本語能力試験 N3",
      time: "140 phút",
      level: "N3",
      plays: 5210,
    },
    {
      id: 4,
      name: "2019年7月 日本語能力試験 N2",
      time: "144 phút",
      level: "N2",
      plays: 4717,
    },
    {
      id: 5,
      name: "2019年7月 日本語能力試験 N1",
      time: "170 phút",
      level: "N1",
      plays: 2222,
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ExamTopBar />
      <ScrollView
        contentContainerStyle={{
          paddingTop: 64,
          paddingHorizontal: 16,
          paddingBottom: 90,
        }}
      >
        <Text style={styles.headerTitle}>
          Cập nhật lịch thi và chính thức đề thi các năm
        </Text>
        {examList.map((exam) => (
          <ExamItem key={exam.id} exam={exam} />
        ))}
      </ScrollView>
      <BottomBar selectedTab={selectedTab} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topBar: {
    marginTop: 10,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: "white",
    borderBottomWidth: 2,
    borderColor: "#e5e7eb",
    justifyContent: "center",
    paddingHorizontal: 20,
    zIndex: 10,
  },
  topBarTitle: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#9ca3af",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textColorPrimary,
    textAlign: "center",
    marginBottom: 24,
    marginTop: 10,
  },
});

const examStyles = StyleSheet.create({
  itemContainer: {
    width: "100%",
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textColorPrimary,
  },
  badge: {
    backgroundColor: COLORS.badgeColor,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 12,
  },
  stats: {
    fontSize: 14,
    color: COLORS.textColorSecondary,
    marginBottom: 4,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.buttonColor,
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 15,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ExamScreen;
