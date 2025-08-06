import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons"; // Thay thế Remixicon bằng Ionicons

const ProfileScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Profile Header */}
        <View style={styles.section}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>MA</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Minh Anh</Text>
              <Text style={styles.subText}>@minhanh</Text>
              <View style={styles.profileStats}>
                <View style={styles.statItem}>
                  <Icon name="flame" size={16} color="#F59E0B" />
                  <Text style={styles.subText}>32 ngày</Text>
                </View>
                <View style={styles.statItem}>
                  <Icon name="trophy" size={16} color="#FFC1CC" />
                  <Text style={styles.subText}>Cấp độ N5</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Learning Stats */}
        <View style={styles.section}>
          <View style={styles.statsGrid}>
            {[
              { value: "486", label: "Từ vựng" },
              { value: "25", label: "Ngữ pháp" },
              { value: "30", label: "Kanji" },
            ].map((item, index) => (
              <View key={index} style={styles.statCard}>
                <Text style={styles.statValue}>{item.value}</Text>
                <Text style={styles.subText}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thành tích</Text>
          <View style={styles.achievementCard}>
            <View style={styles.achievementHeader}>
              <View style={styles.achievementIconContainer}>
                <Icon name="medal" size={24} color="#FFC1CC" />
              </View>
              <Text style={styles.achievementLabel}>Huy hiệu</Text>
              <Text style={styles.achievementProgress}>15/50</Text>
            </View>
            <View style={styles.achievementGrid}>
              {[
                { icon: "flame", label: "Streak" },
                { icon: "book", label: "N5" },
                { icon: "book", label: "N4", disabled: true },
                { icon: "book", label: "N3", disabled: true },
              ].map((item, index) => (
                <View key={index} style={styles.achievementItem}>
                  <View
                    style={[
                      styles.achievementIcon,
                      item.disabled && styles.disabledIcon,
                    ]}
                  >
                    <Icon
                      name={item.icon}
                      size={24}
                      color={item.disabled ? "#666" : "#FFC1CC"}
                    />
                  </View>
                  <Text style={styles.subText}>{item.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cài đặt</Text>
          {[
            { icon: "person", label: "Thông tin cá nhân" },
            { icon: "notifications", label: "Thông báo" },
            { icon: "globe", label: "Ngôn ngữ ứng dụng" },
            { icon: "help-circle", label: "Trợ giúp & Hỗ trợ" },
            { icon: "log-out", label: "Đăng xuất" },
          ].map((item, index) => (
            <TouchableOpacity key={index} style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Icon name={item.icon} size={24} color="#FFC1CC" />
              </View>
              <Text style={styles.settingLabel}>{item.label}</Text>
              <Icon name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          ))}
        </View>

        {/* App Version */}
        <View style={styles.version}>
          <Text style={styles.subText}>Phiên bản 1.0.0</Text>
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
  profileHeader: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    elevation: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFC1CC",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { fontSize: 32, fontWeight: "500", color: "#fff" },
  profileInfo: { flex: 1, marginLeft: 10 },
  profileName: { fontSize: 18, fontWeight: "500" },
  subText: { fontSize: 12, color: "#666", marginTop: 2 },
  profileStats: { flexDirection: "row", marginTop: 5 },
  statItem: { flexDirection: "row", alignItems: "center", marginRight: 10 },
  statsGrid: { flexDirection: "row", justifyContent: "space-between" },
  statCard: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    elevation: 2,
    width: "30%",
  },
  statValue: { fontSize: 20, fontWeight: "500" },
  achievementCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    elevation: 2,
  },
  achievementHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  achievementIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#ffe0e6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  achievementLabel: { flex: 1, fontSize: 14, fontWeight: "500" },
  achievementProgress: { fontSize: 14, fontWeight: "500", color: "#FFC1CC" },
  achievementGrid: { flexDirection: "row", justifyContent: "space-between" },
  achievementItem: { alignItems: "center" },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#ffe0e6",
    justifyContent: "center",
    alignItems: "center",
  },
  disabledIcon: { backgroundColor: "#f0f0f0" },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    marginBottom: 5,
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#ffe0e6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  settingLabel: { flex: 1, fontSize: 14, fontWeight: "500" },
  version: { alignItems: "center", marginBottom: 20 },
});

export default ProfileScreen;
