import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
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
  GoogleLogoSvg,
  LightningProgressSvg,
  LockSvg,
  ProfileFriendsSvg,
  ProfileTimeJoinedSvg,
  SettingsGearSvg,
} from "../../components/Svgs";
import { useBoundStore } from "../../hooks/useBoundStore";
import moment from "moment";
import profileService from "../../services/profileService";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigatorType";

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
const ProfileTopBar = ({ user }: { user: User | null }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.topBar}>
      <TouchableOpacity>
        <Text style={styles.srOnly}>Settings</Text>
      </TouchableOpacity>
      <Text style={styles.topBarTitle}>Profile</Text>
      <TouchableOpacity>
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
      navigation.navigate("Welcome"); // Thay thế router.push("/")
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
              navigation.replace("Welcome"); // quay về màn Welcome
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

const ProfileFriendsSection = ({ user }: { user: User | null }) => {
  const [state, setState] = useState<"FOLLOWING" | "FOLLOWERS">("FOLLOWING");

  return (
    <View style={styles.friendsSection}>
      <Text style={styles.sectionTitle}>Bạn bè</Text>
      <View style={styles.friendsContainer}>
        <View style={styles.friendsButtons}>
          <TouchableOpacity
            style={[
              styles.friendsButton,
              state === "FOLLOWING" && styles.friendsButtonActive,
            ]}
            onPress={() => setState("FOLLOWING")}
          >
            <Text
              style={[
                styles.friendsButtonText,
                state === "FOLLOWING" && styles.friendsButtonTextActive,
              ]}
            >
              Following
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.friendsButton,
              state === "FOLLOWERS" && styles.friendsButtonActive,
            ]}
            onPress={() => setState("FOLLOWERS")}
          >
            <Text
              style={[
                styles.friendsButtonText,
                state === "FOLLOWERS" && styles.friendsButtonTextActive,
              ]}
            >
              Followers
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.emptyFriendsContainer}>
          <Text style={styles.emptyFriendsText}>
            {state === "FOLLOWING"
              ? "Not following anyone yet"
              : "No followers yet"}
          </Text>
        </View>
      </View>
    </View>
  );
};
const ProfileScreen = () => {
  const [user, setUser] = useState<User | null>(null);

  const getUser = async () => {
    try {
      const data = await profileService.getUser();
      setUser(data);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ProfileTopBar user={user} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <ProfileTopSection user={user} />
        <ProfileStatsSection user={user} />
        <ProfileFriendsSection user={user} />
      </ScrollView>
      <BottomBar selectedTab="Profile" />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeArea: {
    marginTop: 14, // Để tránh bị che bởi TopBar
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    paddingHorizontal: 20,
    marginTop: 64, // Để tránh bị che bởi TopBar
  },
  contentContainer: {
    paddingBottom: 90, // Để tránh bị che bởi BottomBar
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

  // ProfileTopBar
  topBar: {
    marginTop: 10, // Để tránh bị che bởi TopBar
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

  // ProfileTopSection
  topSection: {
    flexDirection: "column", // avatar lên đầu thay vì column-reverse
    borderBottomWidth: 2,
    borderColor: "#e5e7eb",
    paddingBottom: 32,
    gap: 12,
  },
  avatarImage: {
    width: 100, // Đặt chiều rộng và chiều cao tùy ý
    height: 100,
    borderRadius: 50, // Tạo hình tròn
  },
  avatar: {
    marginTop: 10, // Đẩy avatar lên trên
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
    borderColor: "#edececff", // màu đỏ cho nút logout
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
    borderColor: "#edececff", // màu đỏ cho nút logout
    backgroundColor: "#eb5e5eff",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  editButtonText: {
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "white",
  },

  // ProfileStatsSection
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
    width: "48%", // 2 cột
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

  // ProfileFriendsSection
  friendsSection: {
    paddingVertical: 12,
  },
  friendsContainer: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
  friendsButtons: {
    flexDirection: "row",
  },
  friendsButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 2,
    paddingVertical: 12,
    borderColor: "#e5e7eb",
  },
  friendsButtonActive: {
    borderColor: "#3b82f6",
  },
  friendsButtonText: {
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#9ca3af",
  },
  friendsButtonTextActive: {
    color: "#3b82f6",
  },
  emptyFriendsContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    textAlign: "center",
  },
  emptyFriendsText: {
    color: "#6b7280",
  },
});
export default ProfileScreen;
