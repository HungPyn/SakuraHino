import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { BottomBar } from "../../../components/custombar/BottomBar";
import React, { useEffect, useState } from "react";
import {
  BronzeLeagueSvg,
  FireSvg,
  LightningProgressSvg,
} from "../../../components/Svgs";
import { useNavigation } from "@react-navigation/native";
import leaderboardService from "../../../services/leaderboardService";

// Khai báo interface User
export interface User {
  name: string;
  email: string;
  username: string;
  avatarUrl: string;
  longStreak: number;
  expScore: number;
}

const COLORS = {
  background: "#f0f2f5",
  cardBackground: "#FFFFFF",
  textColorPrimary: "#333333",
  textColorSecondary: "#666666",
  yellow: "#eab308",
  orange: "#f97316",
  green: "#22c55e",
  blue: "#3b82f6",
};

// Dữ liệu người dùng mẫu cho bảng xếp hạng Streak

// Component mới cho mỗi mục trong bảng xếp hạng
const LeaderboardItem = ({
  user,
  rank,
  score,
  label,
  scoreColor,
}: {
  user: User;
  rank: number;
  score: number;
  label: string;
  scoreColor: string;
}) => {
  const defaultAvatar = "https://placekitten.com/100/100";
  return (
    <View style={styles.leaderboardItem}>
      <Text style={styles.rankText}>{rank}</Text>
      <Image
        style={styles.leaderboardAvatar}
        source={{ uri: user.avatarUrl || defaultAvatar }}
      />
      <View style={styles.userInfo}>
        <Text style={styles.userName} numberOfLines={1}>
          {user.name}
        </Text>
        <Text style={styles.userUsername} numberOfLines={1}>
          @{user.username}
        </Text>
      </View>
      <View style={styles.scoreContainer}>
        <Text style={[styles.scoreText, { color: scoreColor }]}>{score}</Text>
        <Text style={styles.scoreLabel}>{label}</Text>
      </View>
    </View>
  );
};

// Component chính của màn hình Leaderboard
const LeaderboardScreen = () => {
  const navigation = useNavigation();
  const [streakUsersData, setStreakUsersData] = useState<User[]>([]);
  const [expUsersData, setExpUsersData] = useState<User[]>([]);

  //lay top streak
  const getTopStreakUsers = async () => {
    try {
      const data = await leaderboardService.getTopStreakUsers();
      setStreakUsersData(data);
    } catch (error) {
      console.error("Lỗi khi lấy top streak người dùng:", error);
    }
  };

  //lay top exp
  const getTopExpUsers = async () => {
    try {
      const data = await leaderboardService.getTopExpUsers();
      setExpUsersData(data);
    } catch (error) {
      console.error("Lỗi khi lấy top exp người dùng:", error);
    }
  };

  useEffect(() => {
    getTopStreakUsers();
    getTopExpUsers();
  }, []);

  // Sắp xếp dữ liệu ngay trong component
  const sortedStreakUsers = streakUsersData.sort(
    (a, b) => b.longStreak - a.longStreak
  );
  const sortedExpUsers = expUsersData.sort((a, b) => b.expScore - a.expScore);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Bảng xếp hạng</Text>

        {/* Bảng xếp hạng Top Streaks */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionTitleContainer}>
            <FireSvg />
            <Text style={styles.sectionTitleText}>Top Streaks</Text>
          </View>
          <View style={styles.leaderboardHeader}>
            <Text style={styles.rankHeader}>Rank</Text>
            <Text style={styles.nameHeader}>Tên người dùng</Text>
            <Text style={styles.scoreHeader}>Streak</Text>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {sortedStreakUsers.map((user, index) => (
              <LeaderboardItem
                key={`streak-${index}`}
                user={user}
                rank={index + 1}
                score={user.longStreak}
                label="ngày"
                scoreColor={COLORS.orange}
              />
            ))}
          </ScrollView>
        </View>

        {/* Bảng xếp hạng Top XP */}
        <View style={styles.sectionContainerXP}>
          <View style={styles.sectionTitleContainer}>
            <LightningProgressSvg size={34} />
            <Text style={styles.sectionTitleText}>Top XP</Text>
          </View>
          <View style={styles.leaderboardHeader}>
            <Text style={styles.rankHeader}>Rank</Text>
            <Text style={styles.nameHeader}>Tên người dùng</Text>
            <Text style={styles.scoreHeader}>XP</Text>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {sortedExpUsers.map((user, index) => (
              <LeaderboardItem
                key={`exp-${index}`}
                user={user}
                rank={index + 1}
                score={user.expScore}
                label="XP"
                scoreColor={COLORS.yellow}
              />
            ))}
          </ScrollView>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("LearningPathScreen")}
        >
          <Text style={styles.seeMoreText}>Luyện tập ngay</Text>
        </TouchableOpacity>
      </View>

      <BottomBar selectedTab="Leaderboard" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  seeMoreText: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#58ce14ff",
    textAlign: "center",
    marginTop: 10,
    textDecorationLine: "underline",
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1, // Cho phép View này chiếm toàn bộ không gian còn lại
    paddingVertical: 20,
    paddingHorizontal: 18,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    paddingTop: 10,
    marginBottom: 10,
    marginTop: 20,
    color: COLORS.textColorPrimary,
  },
  sectionContainer: {
    marginTop: 25,
    marginBottom: 5,
    backgroundColor: "rgba(195, 243, 145, 1)",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: 280, // Chiều cao cố định cho mỗi bảng để ScrollView bên trong hoạt động
  },
  sectionContainerXP: {
    marginTop: 20,
    marginBottom: 5,
    backgroundColor: "rgba(210, 234, 157, 1)",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: 280, // Chiều cao cố định cho mỗi bảng để ScrollView bên trong hoạt động
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    margin: 15,
    color: COLORS.textColorPrimary,
  },
  leaderboardHeader: {
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    marginLeft: 15,
    marginBottom: 0,
    marginTop: 5,
  },
  sectionTitleText: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
    color: COLORS.textColorPrimary,
  },
  rankHeader: {
    width: 50,
    fontWeight: "bold",
    color: COLORS.textColorSecondary,
  },
  nameHeader: {
    flex: 1,
    fontWeight: "bold",
    color: COLORS.textColorSecondary,
  },
  scoreHeader: {
    width: 80,
    fontWeight: "bold",
    color: COLORS.textColorSecondary,
    textAlign: "right",
  },
  scrollContent: {
    paddingBottom: 10,
  },
  leaderboardItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  rankText: {
    marginLeft: 10,
    width: 50,
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.textColorPrimary,
  },
  leaderboardAvatar: {
    width: 30,
    height: 30,
    borderRadius: 20,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.textColorPrimary,
  },
  userUsername: {
    fontSize: 12,
    color: COLORS.textColorSecondary,
  },
  scoreContainer: {
    marginRight: 10,
    flexDirection: "row",
    alignItems: "center",
    width: 80,
    justifyContent: "flex-end",
  },
  scoreText: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 4,
  },
  scoreLabel: {
    fontSize: 12,
    color: COLORS.textColorSecondary,
  },
});

export default LeaderboardScreen;
