import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { RootStackParamList } from "../../../types/navigatorType";

const PracticeScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Level Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chọn cấp độ</Text>
          <View style={styles.grid}>
            {[
              { level: "N5", subtitle: "Cơ bản", progress: 0.6, locked: false },
              { level: "N4", subtitle: "Sơ cấp", progress: 0.3, locked: false },
              { level: "N3", subtitle: "Trung cấp", progress: 0, locked: true },
            ].map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.levelCard}
                disabled={item.locked}
              >
                <View style={styles.levelHeader}>
                  <Text style={styles.levelText}>{item.level}</Text>
                  <View
                    style={[
                      styles.levelIcon,
                      item.locked
                        ? { backgroundColor: "#f0f0f0" }
                        : { backgroundColor: "#ffe0e6" },
                    ]}
                  >
                    <Icon
                      name={item.locked ? "lock-closed" : "trophy"}
                      size={20}
                      color={item.locked ? "#666" : "#FFC1CC"}
                    />
                  </View>
                </View>
                <Text style={styles.subText}>{item.subtitle}</Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${item.progress * 100}%`,
                        backgroundColor: item.locked ? "#ccc" : "#FFC1CC",
                      },
                    ]}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Learning Paths */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lộ trình học tập</Text>
          {[
            {
              title: "Từ vựng cơ bản N5",
              subtitle: "20 bài học - 500 từ vựng",
              progress: 0.6,
              image:
                "https://readdy.ai/api/search-image?query=Japanese%20vocabulary%20learning%2C%20colorful%20flashcards%2C%20basic%20words%2C%20learning%20materials%2C%20educational%20content%2C%20clean%20design&width=80&height=80&seq=2001&orientation=squarish",
            },
            {
              title: "Ngữ pháp N5",
              subtitle: "15 bài học - Mẫu câu cơ bản",
              progress: 0.4,
              image:
                "https://readdy.ai/api/search-image?query=Japanese%20grammar%20study%2C%20textbook%20pages%2C%20sentence%20structures%2C%20learning%20materials%2C%20educational%20content%2C%20clean%20design&width=80&height=80&seq=2002&orientation=squarish",
            },
            {
              title: "Kanji N5",
              subtitle: "10 bài học - 100 chữ Kanji",
              progress: 0.25,
              image:
                "https://readdy.ai/api/search-image?query=Japanese%20kanji%20practice%2C%20traditional%20characters%2C%20writing%20practice%2C%20learning%20materials%2C%20educational%20content%2C%20clean%20design&width=80&height=80&seq=2003&orientation=squarish",
            },
          ].map((item, index) => (
            <View key={index} style={styles.pathCard}>
              <Image source={{ uri: item.image }} style={styles.pathImage} />
              <View style={styles.pathContent}>
                <Text style={styles.pathTitle}>{item.title}</Text>
                <Text style={styles.subText}>{item.subtitle}</Text>
                <View style={styles.pathFooter}>
                  <Text style={styles.progressText}>
                    {Math.round(item.progress * 100)}% hoàn thành
                  </Text>
                  <TouchableOpacity
                    style={styles.continueButton}
                    onPress={() =>
                      navigation.navigate("Main", { screen: "Thống kê" })
                    }
                  >
                    <Text style={styles.continueText}>Tiếp tục</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Practice Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Luyện tập theo chủ đề</Text>
          <View style={styles.grid}>
            {[
              { title: "Gia đình", subtitle: "50 từ vựng", icon: "home" },
              { title: "Ẩm thực", subtitle: "60 từ vựng", icon: "restaurant" },
              { title: "Du lịch", subtitle: "40 từ vựng", icon: "train" },
              { title: "Mua sắm", subtitle: "45 từ vựng", icon: "bag" },
            ].map((item, index) => (
              <TouchableOpacity key={index} style={styles.categoryCard}>
                <View style={styles.categoryIcon}>
                  <Icon name={item.icon} size={20} color="#FFC1CC" />
                </View>
                <Text style={styles.categoryTitle}>{item.title}</Text>
                <Text style={styles.subText}>{item.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Study Tips */}
        <View style={styles.section}>
          <View style={styles.tipsCard}>
            <View style={styles.tipsHeader}>
              <Text style={styles.sectionTitle}>Mẹo học tập</Text>
              <Text style={styles.viewDetail}>Xem thêm</Text>
            </View>
            {[
              "Học 20 phút mỗi ngày hiệu quả hơn 2 giờ mỗi tuần",
              "Ôn tập từ vựng vào buổi tối trước khi ngủ",
            ].map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <View style={styles.tipIcon}>
                  <Icon
                    name={index === 0 ? "bulb" : "time"}
                    size={20}
                    color="#FFC1CC"
                  />
                </View>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
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
  sectionTitle: { fontSize: 16, fontWeight: "500", marginBottom: 10 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  levelCard: {
    width: "30%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    elevation: 2,
    marginBottom: 10,
  },
  levelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  levelText: { fontSize: 18, fontWeight: "500" },
  levelIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  progressBar: {
    height: 6,
    backgroundColor: "#f0f0f0",
    borderRadius: 3,
    marginTop: 5,
  },
  progressFill: { height: "100%", borderRadius: 3 },
  subText: { fontSize: 12, color: "#666", marginTop: 5 },
  pathCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    elevation: 2,
    marginBottom: 10,
  },
  pathImage: { width: 64, height: 64, borderRadius: 8 },
  pathContent: { flex: 1, marginLeft: 10 },
  pathTitle: { fontSize: 14, fontWeight: "500" },
  pathFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  progressText: { fontSize: 12, color: "#FFC1CC", fontWeight: "500" },
  continueButton: {
    backgroundColor: "#FFC1CC",
    borderRadius: 20,
    paddingVertical: 2,
    paddingHorizontal: 10,
  },
  continueText: { color: "#fff", fontSize: 12 },
  categoryCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    elevation: 2,
    marginBottom: 10,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ffe0e6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  categoryTitle: { fontSize: 14, fontWeight: "500" },
  tipsCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    elevation: 2,
  },
  tipsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  viewDetail: { color: "#FFC1CC", fontSize: 12 },
  tipItem: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  tipIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#ffe0e6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  tipText: { fontSize: 14 },
});

export default PracticeScreen;
