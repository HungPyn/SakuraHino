import { NavigationProp, useNavigation } from "@react-navigation/native";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { RootStackParamList } from "../../../types/navigatorType";

const PracticeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Practice Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chọn chế độ luyện tập</Text>
          <View style={styles.grid}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("LearningPathScreen")}
            >
              <View style={styles.iconContainer}>
                <Icon name="ri-timer-line" size={24} color="#FFC1CC" />
              </View>
              <Text style={styles.cardTime}>5 phút</Text>
              <Text style={styles.cardTitle}>Luyện tập nhanh</Text>
              <Text style={styles.cardDetail}>10 câu hỏi ngẫu nhiên</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card}>
              <View style={styles.iconContainer}>
                <Icon name="ri-book-open-line" size={24} color="#FFC1CC" />
              </View>
              <Text style={styles.cardTime}>15 phút</Text>
              <Text style={styles.cardTitle}>Ôn tập bài học</Text>
              <Text style={styles.cardDetail}>Từ vựng và ngữ pháp</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card}>
              <View style={styles.iconContainer}>
                <Icon name="ri-sword-line" size={24} color="#FFC1CC" />
              </View>
              <Text style={styles.cardTime}>20 phút</Text>
              <Text style={styles.cardTitle}>Thử thách</Text>
              <Text style={styles.cardDetail}>Kiểm tra toàn diện</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card}>
              <View style={styles.iconContainer}>
                <Icon name="ri-gamepad-line" size={24} color="#FFC1CC" />
              </View>
              <Text style={styles.cardTime}>∞</Text>
              <Text style={styles.cardTitle}>Mini game</Text>
              <Text style={styles.cardDetail}>Học qua trò chơi</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Daily Challenge */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Thử thách hàng ngày</Text>
            <View style={styles.challengeProgress}>
              <Icon name="ri-fire-fill" size={16} color="#FFC107" />
              <Text style={styles.progressText}>3/5</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.challengeCard}>
            <Image
              source={{
                uri: "https://readdy.ai/api/search-image?query=Japanese%20learning%20challenge%2C%20daily%20quiz%2C%20educational%20game%20interface%2C%20clean%20modern%20design%2C%20achievement%20concept&width=80&height=80&seq=3001&orientation=squarish",
              }}
              style={styles.challengeImage}
            />
            <View style={styles.challengeInfo}>
              <Text style={styles.challengeTitle}>Thử thách từ vựng</Text>
              <Text style={styles.challengeDetail}>Hoàn thành 20 câu hỏi</Text>
              <TouchableOpacity style={styles.startButton}>
                <Text style={styles.buttonText}>Bắt đầu</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>

        {/* Practice History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lịch sử luyện tập</Text>
          <View style={styles.historyContainer}>
            <View style={styles.historyItem}>
              <View style={styles.iconContainer}>
                <Icon name="ri-file-list-3-line" size={24} color="#FFC1CC" />
              </View>
              <View style={styles.historyText}>
                <Text style={styles.historyTitle}>Từ vựng N5 - Bài 3</Text>
                <Text style={styles.historyDetail}>15/20 câu đúng</Text>
              </View>
              <Text style={styles.historyTime}>Hôm nay, 05:30 PM</Text>
            </View>
            <View style={styles.historyItem}>
              <View style={styles.iconContainer}>
                <Icon name="ri-book-open-line" size={24} color="#FFC1CC" />
              </View>
              <View style={styles.historyText}>
                <Text style={styles.historyTitle}>Ngữ pháp N5 - Bài 2</Text>
                <Text style={styles.historyDetail}>8/10 câu đúng</Text>
              </View>
              <Text style={styles.historyTime}>04/07/2025, 03:15 PM</Text>
            </View>
            <View style={styles.historyItem}>
              <View style={styles.iconContainer}>
                <Icon name="ri-sword-line" size={24} color="#FFC1CC" />
              </View>
              <View style={styles.historyText}>
                <Text style={styles.historyTitle}>Thử thách hàng ngày</Text>
                <Text style={styles.historyDetail}>18/20 câu đúng</Text>
              </View>
              <Text style={styles.historyTime}>03/07/2025, 10:45 AM</Text>
            </View>
          </View>
        </View>

        {/* Practice Tips */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mẹo luyện tập</Text>
            <Text style={styles.viewMore}>Xem thêm</Text>
          </View>
          <View style={styles.tipsContainer}>
            <View style={styles.tipItem}>
              <View style={styles.iconContainer}>
                <Icon name="ri-lightbulb-line" size={24} color="#FFC1CC" />
              </View>
              <Text style={styles.tipText}>
                Luyện tập đều đặn mỗi ngày để đạt hiệu quả tốt nhất
              </Text>
            </View>
            <View style={styles.tipItem}>
              <View style={styles.iconContainer}>
                <Icon name="ri-timer-line" size={24} color="#FFC1CC" />
              </View>
              <Text style={styles.tipText}>
                Nên chia nhỏ thời gian luyện tập thành nhiều phiên
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 10 },
  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF5BA",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  cardTime: {
    fontSize: 12,
    color: "#FFC1CC",
    fontWeight: "500",
    marginBottom: 4,
  },
  cardTitle: { fontSize: 14, fontWeight: "500", color: "#333" },
  cardDetail: { fontSize: 12, color: "#666", marginTop: 4 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  challengeProgress: { flexDirection: "row", alignItems: "center" },
  progressText: { fontSize: 12, color: "#666", marginLeft: 4 },
  challengeCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    elevation: 2,
  },
  challengeImage: { width: 64, height: 64, borderRadius: 8, marginRight: 12 },
  challengeInfo: { flex: 1 },
  challengeTitle: { fontSize: 14, fontWeight: "500", color: "#333" },
  challengeDetail: { fontSize: 12, color: "#666", marginTop: 4 },
  startButton: {
    backgroundColor: "#FFC1CC",
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  buttonText: { color: "#fff", fontSize: 12, fontWeight: "500" },
  historyContainer: { gap: 10 },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    elevation: 2,
  },
  historyText: { flex: 1, marginLeft: 10 },
  historyTitle: { fontSize: 14, fontWeight: "500", color: "#333" },
  historyDetail: { fontSize: 12, color: "#666", marginTop: 2 },
  historyTime: { fontSize: 12, color: "#666" },
  tipsContainer: { gap: 10 },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    elevation: 2,
  },
  tipText: { fontSize: 14, color: "#333", marginLeft: 10 },
  viewMore: { fontSize: 12, color: "#FFC1CC", fontWeight: "500" },
});

export default PracticeScreen;
