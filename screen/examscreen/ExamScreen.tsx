import React, { useEffect, useState } from "react";
import {
  Linking,
  Button,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomBar } from "../../components/custombar/BottomBar";
import { Tab } from "../../components/custombar/useBottomBarItems";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseTopicApi } from "../../services/baseAPI";
import axios from "axios";

interface Exam {
  id: number;
  examName: string;
  status: string;
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
const handleOpenLink = async (exam: Exam) => {
  const token = await AsyncStorage.getItem("token");
  const baseUrl = "http://10.0.2.2:3000";

  if (!token) {
    Alert.alert("Lỗi", "Không tìm thấy token.");
    return;
  }

  // Tạo URL với query params
  const url = `${baseUrl}?userToken=${encodeURIComponent(token)}&examId=${exam.id}`;

  console.log("Link mở:", url);

  try {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(
        "Lỗi",
        `Không thể mở đường link này: ${url}. Vui lòng kiểm tra lại.`
      );
    }
  } catch (error: any) {
    Alert.alert("Lỗi", `Đã xảy ra lỗi: ${error.message}`);
  }
};
const ExamItem = ({ exam }: { exam: Exam }) => (
  <View style={examStyles.itemContainer}>
    <View style={examStyles.header}>
      {/* Nhóm tiêu đề và trạng thái vào một View */}
      <View>
        <Text style={examStyles.title}>{exam.examName}</Text>
        <Text style={examStyles.stats}>Trạng thái: {exam.status}</Text>
      </View>

      {/* Nút "Xem kết quả" ở bên phải */}
      <TouchableOpacity style={examStyles.resultButton}>
        <Text style={examStyles.resultButtonText}>Xem kết quả</Text>
      </TouchableOpacity>
    </View>
    <TouchableOpacity
      style={examStyles.button}
      onPress={() => handleOpenLink(exam)}
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

  const [examList, setExamList] = useState<Exam[]>([]);
  const getExam = async () => {
    const token = await AsyncStorage.getItem("token");
    console.log("Token retrieved from AsyncStorage:", token);
    if (!token) {
      console.error("Token not found in AsyncStorage");
      return [];
    }
    try {
      const response = await axios.get(`${baseTopicApi}/api/jlpt/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log("exam trả về:", JSON.stringify(response.data, null, 2));

      setExamList(response.data.data || []);
    } catch (error) {
      console.error("Lỗi khi gọi api lấy alphabets:", error);
    }
  };
  useEffect(() => {
    getExam();
  }, []);

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
    flexDirection: "row", // Sắp xếp các mục con theo hàng ngang
    justifyContent: "space-between", // Đẩy các mục con về hai phía
    alignItems: "center", // Căn giữa các mục con theo chiều dọc
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textColorPrimary,
  },
  stats: {
    fontSize: 14,
    color: COLORS.textColorSecondary,
  },
  resultButton: {
    backgroundColor: COLORS.badgeColor,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  resultButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 12,
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
