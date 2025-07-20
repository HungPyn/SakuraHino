import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons'; 

const StatsScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Weekly Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tiến độ tuần này</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <View>
                <Text style={styles.progressHours}>4.5</Text>
                <Text style={styles.subText}>giờ</Text>
              </View>
              <View style={styles.progressChange}>
                <Text style={styles.changeText}>+12%</Text>
                <Text style={styles.subText}>so với tuần trước</Text>
              </View>
            </View>
            <View style={styles.weekGrid}>
              {[
                { height: 60, day: 'T2', opacity: 0.3 },
                { height: 96, day: 'T3', opacity: 0.5 },
                { height: 72, day: 'T4', opacity: 0.4 },
                { height: 120, day: 'T5', opacity: 0.8 },
                { height: 84, day: 'T6', opacity: 0.6 },
                { height: 48, day: 'T7', opacity: 0.2 },
                { height: 108, day: 'CN', opacity: 1 },
              ].map((item, index) => (
                <View key={index} style={styles.dayItem}>
                  <View style={[styles.dayBar, { height: item.height, opacity: item.opacity }]} />
                  <Text style={styles.subText}>{item.day}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Learning Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thành tích học tập</Text>
          <View style={styles.statsGrid}>
            {[
              { icon: 'time', value: '32', label: 'Ngày học liên tiếp' },
              { icon: 'flower', value: '2,450', label: 'Điểm Sakura' },
              { icon: 'book', value: '486', label: 'Từ vựng đã học' },
              { icon: 'trophy', value: '15', label: 'Thành tích đạt được' },
            ].map((item, index) => (
              <View key={index} style={styles.statCard}>
                <View style={styles.statIcon}>
                  <Icon name={item.icon} size={24} color="#FFC1CC" />
                </View>
                <Text style={styles.statValue}>{item.value}</Text>
                <Text style={styles.subText}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Skill Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tiến độ kỹ năng</Text>
          {[
            { icon: 'list', label: 'Từ vựng', progress: 0.75, details: 'Đã học: 486/648 từ', level: 'N5' },
            { icon: 'book', label: 'Ngữ pháp', progress: 0.50, details: 'Đã học: 25/50 bài', level: 'N5' },
            { icon: 'brush', label: 'Kanji', progress: 0.30, details: 'Đã học: 30/100 chữ', level: 'N5' },
          ].map((item, index) => (
            <View key={index} style={styles.skillCard}>
              <View style={styles.skillHeader}>
                <View style={styles.skillIconContainer}>
                  <Icon name={item.icon} size={24} color="#FFC1CC" />
                </View>
                <Text style={styles.skillLabel}>{item.label}</Text>
                <Text style={styles.skillProgress}>{Math.round(item.progress * 100)}%</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${item.progress * 100}%` }]} />
              </View>
              <View style={styles.skillFooter}>
                <Text style={styles.subText}>{item.details}</Text>
                <Text style={styles.levelText}>{item.level}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Recent Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thành tích gần đây</Text>
          {[
            { icon: 'trophy', title: 'Chiến binh kiên trì', subtitle: 'Học liên tục 30 ngày' },
            { icon: 'medal', title: 'Bậc thầy từ vựng', subtitle: 'Học thuộc 400 từ vựng N5' },
            { icon: 'star', title: 'Nhà thư pháp', subtitle: 'Hoàn thành 20 bài Kanji' },
          ].map((item, index) => (
            <View key={index} style={styles.achievementCard}>
              <View style={styles.achievementIcon}>
                <Icon name={item.icon} size={32} color="#FFC1CC" />
              </View>
              <View style={styles.achievementContent}>
                <Text style={styles.achievementTitle}>{item.title}</Text>
                <Text style={styles.subText}>{item.subtitle}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 10 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '500', marginBottom: 10 },
  progressCard: { backgroundColor: '#fff', borderRadius: 8, padding: 10, elevation: 2 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  progressHours: { fontSize: 24, fontWeight: '500' },
  subText: { fontSize: 12, color: '#666' },
  progressChange: { alignItems: 'flex-end' },
  changeText: { color: '#10B981', fontSize: 12, fontWeight: '500' },
  weekGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  dayItem: { alignItems: 'center', width: '14%' },
  dayBar: { width: '100%', backgroundColor: '#FFC1CC', borderRadius: 4 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: { width: '48%', backgroundColor: '#fff', borderRadius: 8, padding: 10, elevation: 2, marginBottom: 10, alignItems: 'center' },
  statIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ffe0e6', justifyContent: 'center', alignItems: 'center', marginBottom: 5 },
  statValue: { fontSize: 20, fontWeight: '500' },
  skillCard: { backgroundColor: '#fff', borderRadius: 8, padding: 10, elevation: 2, marginBottom: 10 },
  skillHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  skillIconContainer: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#ffe0e6', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  skillLabel: { flex: 1, fontSize: 14, fontWeight: '500' },
  skillProgress: { fontSize: 14, fontWeight: '500' },
  progressBar: { height: 8, backgroundColor: '#f0f0f0', borderRadius: 4, marginBottom: 5 },
  progressFill: { height: '100%', backgroundColor: '#FFC1CC', borderRadius: 4 },
  skillFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  levelText: { color: '#FFC1CC', fontSize: 12 },
  achievementCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 8, padding: 10, elevation: 2, marginBottom: 10 },
  achievementIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#ffe0e6', justifyContent: 'center', alignItems: 'center' },
  achievementContent: { flex: 1, marginLeft: 10 },
  achievementTitle: { fontSize: 14, fontWeight: '500' },
});

export default StatsScreen;