import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { BottomBar } from "../../components/custombar/BottomBar";
import {
  BronzeLeagueSvg,
  EditPencilSvg,
  EmptyFireSvg,
  EmptyMedalSvg,
  FireSvg,
  LightningProgressSvg,
  ProfileFriendsSvg,
  ProfileTimeJoinedSvg,
  SettingsGearSvg,
} from "../../components/Svgs";
import { useBoundStore } from "../../hooks/useBoundStore";
import moment from "moment";
import profileService from "../../services/profileService";
import leaderboardService from "../../services/leaderboardService";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigatorType";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface User {
  name: string;
  email: string;
  username: string;
  avatarUrl: string;
  longStreak: number;
  expScore: number;
}
type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Profile"
>;

// Khai báo lại các constants và component phụ từ LeaderboardScreen
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

// Component chính của màn hình profile
const ProfileTopBar = ({ user }: { user: User | null }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const navigation = useNavigation();
  return (
    <View style={styles.topBar}>
      <TouchableOpacity>
        <Text style={styles.srOnly}>Settings sdsds</Text>
      </TouchableOpacity>
      <Text style={styles.topBarTitle}>Profile</Text>
      <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
        <SettingsGearSvg />
        <Text style={styles.srOnly}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

const ProfileTopSection = ({ user }: { user: User | null }) => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  const loggedIn = useBoundStore((x) => x.loggedIn);
  const rawDate = useBoundStore((x) => x.joinedAt).toDate();
  const joinedAt = moment(rawDate).format("MMMM YYYY");

  type NavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "Profile"
  >;

  useEffect(() => {
    if (!loggedIn) {
      navigation.navigate("Welcome");
    }
  }, [loggedIn, navigation]);

  const handleLogout = () => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc chắn muốn đăng xuất không?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Đăng xuất",
          style: "destructive",
          onPress: async () => {
            try {
              await profileService.logout();
              await AsyncStorage.setItem("hasOpenedApp", "true");
              await AsyncStorage.setItem("isLoggedIn", "false");

              navigation.replace("Welcome");
            } catch (error) {
              console.error("Lỗi khi đăng xuất:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.topSection}>
      <View style={styles.avatar}>
        {user?.avatarUrl && (
          <Image source={{ uri: user.avatarUrl }} style={styles.avatarImage} />
        )}
      </View>
      <View style={styles.topSectionContent}>
        <View style={styles.topSectionHeader}>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.username}>{user?.username}</Text>
        </View>
        <View style={styles.infoRow}>
          <ProfileTimeJoinedSvg />
          <Text style={styles.infoText}>{`Ngày tham gia: ${joinedAt}`}</Text>
        </View>
        <View style={styles.infoRow}>
          <ProfileFriendsSvg />
          <Text style={styles.infoText}>{"Email: " + user?.email}</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate("SettingsAccount", { user })}
        style={styles.editButton}
      >
        <EditPencilSvg />
        <Text style={styles.editButtonText}>Chỉnh sửa</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.editButtonText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
};

const ProfileStatsSection = ({ user }: { user: User | null }) => {
  const streak = useBoundStore((x) => x.streak);
  const totalXp = 125;
  const league = "Bronze";
  const top3Finishes = 0;

  return (
    <View style={styles.statsSection}>
      <Text style={styles.sectionTitle}>Thống kê</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          {user?.longStreak === 0 ? <EmptyFireSvg /> : <FireSvg />}
          <View style={styles.statContent}>
            <Text
              style={[
                styles.statNumber,
                user?.longStreak === 0 && styles.statNumberInactive,
              ]}
            >
              {user?.longStreak || 0}
            </Text>
            <Text style={styles.statLabel}>Day streak</Text>
          </View>
        </View>
        <View style={styles.statItem}>
          <LightningProgressSvg size={35} />
          <View style={styles.statContent}>
            <Text style={styles.statNumber}>{user?.expScore || 0}</Text>
            <Text style={styles.statLabel}>Total XP</Text>
          </View>
        </View>
        <View style={styles.statItem}>
          <BronzeLeagueSvg width={25} height={35} />
          <View style={styles.statContent}>
            <Text style={styles.statNumber}>{league}</Text>
            <Text style={styles.statLabel}>Current league</Text>
          </View>
        </View>
        <View style={styles.statItem}>
          {top3Finishes === 0 ? <EmptyMedalSvg /> : <EmptyMedalSvg />}
          <View style={styles.statContent}>
            <Text
              style={[
                styles.statNumber,
                top3Finishes === 0 && styles.statNumberInactive,
              ]}
            >
              {top3Finishes}
            </Text>
            <Text style={styles.statLabel}>Top 3 finishes</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const ProfileScreen = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Thêm trạng thái này
  const [streakUsersData, setStreakUsersData] = useState<User[]>([]);
  const [expUsersData, setExpUsersData] = useState<User[]>([]);

  const getUser = async () => {
    try {
      const data = await profileService.getUser();
      setUser(data);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
    } finally {
      setIsLoading(false); // Kết thúc tải, dù thành công hay thất bại
    }
  };

  const getTopStreakUsers = async () => {
    try {
      const data = await leaderboardService.getTopStreakUsers();
      setStreakUsersData(data);
    } catch (error) {
      console.error("Lỗi khi lấy top streak người dùng:", error);
    }
  };

  const getTopExpUsers = async () => {
    try {
      const data = await leaderboardService.getTopExpUsers();
      setExpUsersData(data);
    } catch (error) {
      console.error("Lỗi khi lấy top exp người dùng:", error);
    }
  };

  useEffect(() => {
    getUser();
    getTopStreakUsers();
    getTopExpUsers();
  }, []); // Đưa các câu lệnh kiểm tra loading lên trên cùng

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#9e9eaaff" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Không thể tải dữ liệu người dùng.</Text>
      </View>
    );
  }
  const sortedStreakUsers = streakUsersData.sort(
    (a, b) => b.longStreak - a.longStreak
  );
  const sortedExpUsers = expUsersData.sort((a, b) => b.expScore - a.expScore);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ProfileTopBar user={user} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <ProfileTopSection user={user} />
        <ProfileStatsSection user={user} />

        <View style={styles.leaderboardSection}>
          <Text style={styles.sectionTitle}>Bảng xếp hạng</Text>
          <View style={styles.sectionsWrapper}>
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
                style={styles.leaderboardScroll}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
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
                style={styles.leaderboardScroll}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
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
          </View>
        </View>
      </ScrollView>
      <BottomBar selectedTab="Profile" />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeArea: {
    marginTop: 14,
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    paddingHorizontal: 20,
    marginTop: 64,
  },
  contentContainer: {
    paddingBottom: 90,
    gap: 20,
  },
  srOnly: {
    position: "absolute",
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: "hidden",
  },
  topBar: {
    marginTop: 10,
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 2,
    borderColor: "#e5e7eb",
    backgroundColor: "white",
    paddingHorizontal: 20,
    zIndex: 10,
  },
  topBarTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#9ca3af",
  },
  topSection: {
    flexDirection: "column",
    borderBottomWidth: 2,
    borderColor: "#e5e7eb",
    paddingBottom: 32,
    gap: 12,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatar: {
    marginTop: 10,
    height: 80,
    width: 80,
    borderRadius: 9999,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#9ca3af",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  avatarText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#9ca3af",
  },
  topSectionContent: {
    flexGrow: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 12,
  },
  topSectionHeader: {
    flexDirection: "column",
    gap: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
  },
  username: {
    fontSize: 14,
    color: "#9ca3af",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  infoText: {
    color: "#6b7280",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    borderRadius: 16,
    borderBottomWidth: 4,
    borderColor: "#edececff",
    backgroundColor: "#6ec0d0ff",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    borderRadius: 16,
    borderBottomWidth: 4,
    borderColor: "#edececff",
    backgroundColor: "#eb5e5eff",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  editButtonText: {
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "white",
  },
  statsSection: {
    paddingVertical: 12,
  },
  sectionTitle: {
    marginBottom: 20,
    fontSize: 24,
    fontWeight: "bold",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statItem: {
    width: "48%",
    flexDirection: "row",
    gap: 8,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    padding: 8,
    alignItems: "center",
  },
  statContent: {
    flexDirection: "column",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
  },
  statNumberInactive: {
    color: "#9ca3af",
  },
  statLabel: {
    fontSize: 14,
    color: "#9ca3af",
  },
  leaderboardSection: {
    paddingVertical: 12,
  },
  sectionsWrapper: {
    gap: 20,
  },
  sectionContainer: {
    backgroundColor: "rgba(195, 243, 145, 1)",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: 280, // Bắt buộc để ScrollView bên trong hoạt động
  },
  sectionContainerXP: {
    backgroundColor: "rgba(210, 234, 157, 1)",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: 280, // Bắt buộc để ScrollView bên trong hoạt động
  },
  leaderboardScroll: {
    flex: 1, // Đảm bảo ScrollView chiếm hết không gian còn lại
  },
  sectionTitleContainer: {
    flexDirection: "row",
    marginLeft: 15,
    marginTop: 5,
    alignItems: "center",
  },
  sectionTitleText: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
    color: COLORS.textColorPrimary,
  },
  leaderboardHeader: {
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
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

export default ProfileScreen;
