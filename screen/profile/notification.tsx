import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import PushNotification from "react-native-push-notification";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  Reminder: undefined;
};

const STORAGE_KEY = "@reminder_time";

const ReminderScreen = () => {
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [savedTime, setSavedTime] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Trạng thái loading
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const loadSavedTime = async () => {
      try {
        const savedTimeStr = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedTimeStr) {
          const loadedDate = new Date(savedTimeStr);
          setSelectedTime(loadedDate);
          setSavedTime(loadedDate);
        }
      } catch (error) {
        console.error("Failed to load saved time:", error);
      } finally {
        setIsLoading(false); // Đã tải xong, chuyển trạng thái loading
      }
    };

    PushNotification.createChannel(
      {
        channelId: "reminder-channel",
        channelName: "SakuraHino nhắc nhở học tập",
        channelDescription: "Thông báo nhắc học",
        importance: 4,
        vibrate: true,
      },
      (created: boolean) => console.log("Channel created:", created)
    );

    loadSavedTime();
  }, []);

  const saveSelectedTime = async (date: Date) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, date.toISOString());
      setSavedTime(date);
    } catch (error) {
      console.error("Failed to save time:", error);
    }
  };

  const showPicker = () => setPickerVisible(true);
  const hidePicker = () => setPickerVisible(false);

  const handleConfirm = (date: Date) => {
    setSelectedTime(date);
    saveSelectedTime(date);
    hidePicker();
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours < 10 ? "0" + hours : hours}:${
      minutes < 10 ? "0" + minutes : minutes
    }`;
  };

  const scheduleNotification = () => {
    const now = new Date();
    const fireDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      selectedTime.getHours(),
      selectedTime.getMinutes(),
      0
    );

    if (fireDate <= now) {
      fireDate.setDate(fireDate.getDate() + 1);
    }

    PushNotification.cancelAllLocalNotifications();

    PushNotification.localNotificationSchedule({
      channelId: "reminder-channel",
      title: "SakuraHino nhắc nhở học tập",
      message: "Đến giờ học rồi! Hãy mở app và học thôi 🚀",
      date: fireDate,
      repeatType: "day",
    });

    // Thông báo Alert hiển thị đúng thời gian đã lên lịch
    Alert.alert(
      "Đã lên lịch",
      `Thông báo sẽ diễn ra lúc ${formatTime(fireDate)} mỗi ngày`
    );
  };

  // Nếu đang loading, hiển thị màn hình loading
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  // Khi đã tải xong, hiển thị giao diện chính
  return (
    <View style={styles.container}>
      {/* Nút trở về */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Trở về</Text>
      </TouchableOpacity>

      <Text style={styles.headerTitle}>Cài đặt nhắc nhở</Text>

      {/* Hiển thị thời gian đã đặt (nếu có) */}
      {savedTime && (
        <View style={styles.savedTimeCard}>
          <Text style={styles.cardTitle}>Thời gian đã đặt</Text>
          <Text style={styles.cardTime}>{formatTime(savedTime)}</Text>
        </View>
      )}

      {/* Phần chọn thời gian */}
      <View style={styles.mainContent}>
        <Text style={styles.title}>Thời gian thông báo hàng ngày?</Text>

        <TouchableOpacity style={styles.timeButton} onPress={showPicker}>
          <Text style={styles.timeText}>{formatTime(selectedTime)}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.scheduleButton}
          onPress={scheduleNotification}
        >
          <Text style={styles.scheduleButtonText}>Lên lịch nhắc nhở</Text>
        </TouchableOpacity>
      </View>

      <DateTimePickerModal
        isVisible={isPickerVisible}
        mode="time"
        date={selectedTime}
        onConfirm={handleConfirm}
        onCancel={hidePicker}
        is24Hour={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDFDFD",
    alignItems: "center",
    padding: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FDFDFD",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#5C6A7A",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: "#5C6A7A",
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#383E4C",
    marginTop: 50,
  },
  savedTimeCard: {
    backgroundColor: "#F2F3F5",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    alignItems: "center",
    marginTop: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 14,
    color: "#888888",
    fontWeight: "500",
    marginBottom: 5,
  },
  cardTime: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#383E4C",
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: -80,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#383E4C",
    marginBottom: 20,
    textAlign: "center",
  },
  timeButton: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 40,
  },
  timeText: {
    fontSize: 56,
    fontWeight: "bold",
    color: "#4A90E2",
  },
  scheduleButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 18,
    paddingHorizontal: 50,
    borderRadius: 12,
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  scheduleButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ReminderScreen;
