import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleProp,
  ImageStyle,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";

const HomeScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Nav Bar */}
      <View style={styles.navBar}>
        <Text style={styles.logo}>logo</Text>
        <View style={styles.navRight}>
          <View style={styles.streakContainer}>
            <Icon name="flame" size={18} color="#F97316" />
            <Text style={styles.streakText}>5</Text>
          </View>
          <TouchableOpacity style={styles.profileIcon}>
            <Icon name="person-outline" size={18} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <View style={styles.welcomeHeader}>
            <Text style={styles.welcomeText}>Xin chào, Minh Anh!</Text>
            <View style={styles.sakuraPoints}>
              <Icon name="flower" size={16} color="#FFC1CC" />
              <Text style={styles.pointsText}>250</Text>
            </View>
          </View>
          <Text style={styles.japaneseText}>こんにちは！</Text>
          <Text style={styles.sloganText}>
            Học tiếng Nhật, nở rộ như hoa anh đào!
          </Text>
          <View style={styles.progressContainer}>
            <Text style={styles.progressLabel}>Tiến độ hôm nay</Text>
            <Text style={styles.progressValue}>65%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: "65%" }]} />
          </View>
        </View>

        {/* Quick Menu */}
        <View style={styles.quickMenu}>
          <TouchableOpacity style={styles.quickItem}>
            <View style={styles.quickIcon}>
              <Image
                source={{
                  uri: "https://readdy.ai/api/search-image?query=icon%2C%20Japanese%20vocabulary%20flashcard%2C%20minimalist%20design%2C%20pink%20and%20white%20color%20scheme%2C%20cherry%20blossom%20theme%2C%20cute%20and%20simple%2C%20isolated%20on%20white%20background%2C%20centered%20composition&width=64&height=64&seq=vocab1&orientation=squarish",
                }}
                style={styles.quickImage as StyleProp<ImageStyle>}
              />
            </View>
            <Text style={styles.quickLabel}>Từ vựng</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickItem}>
            <View style={styles.quickIcon}>
              <Image
                source={{
                  uri: "https://readdy.ai/api/search-image?query=icon%2C%20Japanese%20grammar%20book%2C%20minimalist%20design%2C%20pink%20and%20white%20color%20scheme%2C%20cherry%20blossom%20theme%2C%20cute%20and%20simple%2C%20isolated%20on%20white%20background%2C%20centered%20composition&width=64&height=64&seq=grammar1&orientation=squarish",
                }}
                style={styles.quickImage as StyleProp<ImageStyle>}
              />
            </View>
            <Text style={styles.quickLabel}>Ngữ pháp</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickItem}>
            <View style={styles.quickIcon}>
              <Image
                source={{
                  uri: "https://readdy.ai/api/search-image?query=icon%2C%20Japanese%20kanji%20character%2C%20minimalist%20design%2C%20pink%20and%20white%20color%20scheme%2C%20cherry%20blossom%20theme%2C%20cute%20and%20simple%2C%20isolated%20on%20white%20background%2C%20centered%20composition&width=64&height=64&seq=kanji1&orientation=squarish",
                }}
                style={styles.quickImage as StyleProp<ImageStyle>}
              />
            </View>
            <Text style={styles.quickLabel}>Kanji</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickItem}>
            <View style={styles.quickIcon}>
              <Image
                source={{
                  uri: "https://readdy.ai/api/search-image?query=icon%2C%20Japanese%20culture%20icon%2C%20minimalist%20design%2C%20pink%20and%20white%20color%20scheme%2C%20cherry%20blossom%20theme%2C%20cute%20and%20simple%2C%20isolated%20on%20white%20background%2C%20centered%20composition&width=64&height=64&seq=culture1&orientation=squarish",
                }}
                style={styles.quickImage as StyleProp<ImageStyle>}
              />
            </View>
            <Text style={styles.quickLabel}>Văn hóa</Text>
          </TouchableOpacity>
        </View>

        {/* Learning Path */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Lộ trình học</Text>
            <Text style={styles.viewAll}>Xem tất cả</Text>
          </View>
          <View style={styles.pathContainer}>
            <View style={styles.pathLine} />
            <View style={styles.lessonItem}>
              <View style={styles.lessonCircle}>
                <Icon name="checkmark-outline" size={18} color="#fff" />
              </View>
              <View style={styles.lessonContent}>
                <View style={styles.lessonHeader}>
                  <Text style={styles.lessonTitle}>Bảng chữ cái Hiragana</Text>
                  <Text style={styles.lessonStatus}>Hoàn thành</Text>
                </View>
                <Text style={styles.lessonDetail}>
                  Học 46 ký tự Hiragana cơ bản
                </Text>
              </View>
            </View>
            <View style={styles.lessonItem}>
              <View style={styles.lessonCircle}>
                <Icon name="checkmark-outline" size={18} color="#fff" />
              </View>
              <View style={styles.lessonContent}>
                <View style={styles.lessonHeader}>
                  <Text style={styles.lessonTitle}>Bảng chữ cái Katakana</Text>
                  <Text style={styles.lessonStatus}>Hoàn thành</Text>
                </View>
                <Text style={styles.lessonDetail}>
                  Học 46 ký tự Katakana cơ bản
                </Text>
              </View>
            </View>
            <View style={styles.lessonItem}>
              <View style={styles.lessonCircleActive}>
                <Icon name="book-outline" size={18} color="#fff" />
                <View style={styles.lessonBadge}>
                  <Text style={styles.badgeText}>3</Text>
                </View>
              </View>
              <View style={styles.lessonContent}>
                <View style={styles.lessonHeader}>
                  <Text style={styles.lessonTitle}>Chào hỏi cơ bản</Text>
                  <Text style={styles.lessonStatusActive}>Đang học</Text>
                </View>
                <Text style={styles.lessonDetail}>
                  Học cách chào hỏi và giới thiệu bản thân
                </Text>
                <View style={styles.progressBarSmall}>
                  <View style={[styles.progressFill, { width: "65%" }]} />
                </View>
              </View>
            </View>
            <View style={styles.lessonItem}>
              <View style={styles.lessonCircleLocked}>
                <Icon name="lock-closed-outline" size={18} color="#9CA3AF" />
              </View>
              <View style={styles.lessonContent}>
                <View style={styles.lessonHeader}>
                  <Text style={styles.lessonTitle}>Số đếm và đơn vị</Text>
                  <Text style={styles.lessonStatusLocked}>Chưa mở khóa</Text>
                </View>
                <Text style={styles.lessonDetail}>
                  Học cách đếm và sử dụng đơn vị đo lường
                </Text>
              </View>
            </View>
          </View>
        </View>
        {/* Community Posts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Cộng đồng</Text>
            <Text style={styles.viewAll}>Xem tất cả</Text>
          </View>
          <View style={styles.postCard}>
            <View style={styles.postHeader}>
              <Image
                source={{
                  uri: "https://readdy.ai/api/search-image?query=profile%20picture%20of%20a%20young%20Asian%20woman%2C%20simple%20portrait%2C%20minimalist%20style%2C%20soft%20lighting%2C%20neutral%20background&width=40&height=40&seq=profile1&orientation=squarish",
                }}
                style={styles.userImage as StyleProp<ImageStyle>}
              />
              <View>
                <Text style={styles.postAuthor}>Nguyễn Thị Hương</Text>
                <Text style={styles.postTime}>2 giờ trước</Text>
              </View>
            </View>
            <Text style={styles.postText}>
              Mình vừa hoàn thành bài thi thử JLPT N4 với 85 điểm! Cảm ơn
              Sakuraihongo đã giúp mình ôn tập hiệu quả 🌸
            </Text>
            <Image
              source={{
                uri: "https://readdy.ai/api/search-image?query=JLPT%20N4%20test%20results%20paper%20with%20high%20score%2C%20Japanese%20language%20exam%2C%20certificate%20with%20cherry%20blossom%20decoration%2C%20on%20desk%20with%20study%20materials&width=375&height=200&seq=jlpt1&orientation=landscape",
              }}
              style={styles.postImage as StyleProp<ImageStyle>}
            />
            <View style={styles.postActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Icon name="heart-outline" size={16} color="#6B7280" />
                <Text style={styles.actionText}>24</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Icon name="chatbubble-outline" size={16} color="#6B7280" />
                <Text style={styles.actionText}>8</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Icon name="share-social-outline" size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.postCard}>
            <View style={styles.postHeader}>
              <Image
                source={{
                  uri: "https://readdy.ai/api/search-image?query=profile%20picture%20of%20a%20young%20Asian%20man%2C%20simple%20portrait%2C%20minimalist%20style%2C%20soft%20lighting%2C%20neutral%20background&width=40&height=40&seq=profile2&orientation=squarish",
                }}
                style={styles.userImage as StyleProp<ImageStyle>}
              />
              <View>
                <Text style={styles.postAuthor}>Trần Văn Đức</Text>
                <Text style={styles.postTime}>5 giờ trước</Text>
              </View>
            </View>
            <Text style={styles.postText}>
              Ai có tài liệu ôn tập kanji N3 không? Mình đang chuẩn bị cho kỳ
              thi tháng sau 📚
            </Text>
            <View style={styles.postActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Icon name="heart-outline" size={16} color="#6B7280" />
                <Text style={styles.actionText}>12</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Icon name="chatbubble-outline" size={16} color="#6B7280" />
                <Text style={styles.actionText}>15</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Icon name="share-social-outline" size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const screenHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  navBar: {
    paddingTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    elevation: 4,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
  },
  logo: { fontSize: 20, color: "#FFC1CC", fontFamily: "Pacifico" },
  navRight: { flexDirection: "row", alignItems: "center", gap: 12 },
  streakContainer: { flexDirection: "row", alignItems: "center", gap: 4 },
  streakText: { fontSize: 14, fontWeight: "500" },
  profileIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  content: { paddingTop: 60, flexGrow: 1 },
  welcomeSection: { padding: 16, paddingTop: 20 },
  welcomeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  welcomeText: { fontSize: 16, fontWeight: "600" },
  sakuraPoints: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5BA10",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  pointsText: { fontSize: 14, fontWeight: "500", marginLeft: 4 },
  japaneseText: {
    fontSize: 18,
    fontWeight: "500",
    fontFamily: "NotoSansJP",
    marginBottom: 8,
  },
  sloganText: { fontSize: 14, color: "#4B5563", marginBottom: 16 },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  progressLabel: { fontSize: 14, fontWeight: "500" },
  progressValue: { fontSize: 14, color: "#6B7280" },
  progressBar: { height: 12, backgroundColor: "#E5E7EB", borderRadius: 999 },
  progressFill: {
    height: "100%",
    backgroundColor: "#FFD6DE",
    borderRadius: 999,
  },
  quickMenu: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  quickItem: { alignItems: "center" },
  quickIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#FFC1CC10",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  quickImage: {
    width: 32,
    height: 32,
  } as ImageStyle,
  quickLabel: { fontSize: 12, textAlign: "center" },
  section: { paddingHorizontal: 16, marginBottom: 16 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: "600" },
  viewAll: { fontSize: 14, color: "#FFC1CC", fontWeight: "500" },
  pathContainer: {
    position: "relative",
    paddingTop: 12,
    paddingBottom: 12,
  },
  pathLine: {
    position: "absolute",
    left: 24,
    top: 32,
    width: 1,
    zIndex: -1,
    bottom: 0,
    height: screenHeight - 64,
    backgroundColor: "#E5E7EB",
  },
  lessonItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
    zIndex: 10, // giữ nguyên hoặc tăng
    position: "relative",
  },
  lessonCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFC1CC",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  lessonCircleActive: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFC1CCB3",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: "relative",
  },
  lessonBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#FFC1CC",
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: { fontSize: 10, fontWeight: "500" },
  lessonCircleLocked: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  lessonContent: {
    marginLeft: 16,
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    elevation: 2,
  },
  lessonHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  lessonTitle: { fontSize: 14, fontWeight: "500" },
  lessonStatus: {
    fontSize: 12,
    backgroundColor: "#ECFDF5",
    color: "#10B981",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  lessonStatusActive: {
    fontSize: 12,
    backgroundColor: "#FFF5BA20",
    color: "#FFC1CC",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  lessonStatusLocked: {
    fontSize: 12,
    backgroundColor: "#E5E7EB",
    color: "#6B7280",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  lessonDetail: { fontSize: 12, color: "#6B7280" },
  progressBarSmall: {
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 999,
    marginTop: 8,
  },
  challengeCard: {
    backgroundColor: "#FFF5BA33",
    borderRadius: 16,
    padding: 16,
    flexDirection: "column",
  },
  challengeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  challengeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  challengeTitle: { fontSize: 14, fontWeight: "500" },
  challengeDetail: { fontSize: 12, color: "#6B7280" },
  challengeTasks: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  taskItem: { flex: 1, marginHorizontal: 4 },
  taskIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#ECFDF5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  taskContent: { alignItems: "center" },
  taskLabel: { fontSize: 12, fontWeight: "500" },
  taskProgress: {
    height: 4,
    backgroundColor: "#ECFDF5",
    borderRadius: 999,
    marginTop: 4,
  },
  taskFill: { height: "100%", backgroundColor: "#10B981", borderRadius: 999 },
  challengeButton: {
    alignSelf: "flex-end",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  postCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 12,
    elevation: 2,
  },
  postHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  userImage: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  postAuthor: { fontSize: 14, fontWeight: "500" },
  postTime: { fontSize: 12, color: "#6B7280" },
  postText: { fontSize: 14, color: "#4B5563", marginBottom: 8 },
  postImage: { width: "100%", height: 100, borderRadius: 8, marginBottom: 8 },
  postActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionButton: { flexDirection: "row", alignItems: "center", gap: 4 },
  actionText: { fontSize: 12, color: "#6B7280" },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabItem: { alignItems: "center" },
  tabCenter: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFC1CC",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabText: { fontSize: 12, fontWeight: "500", marginTop: 4 },
  tabTextInactive: { fontSize: 12, color: "#9CA3AF", marginTop: 4 },
});

export default HomeScreen;
