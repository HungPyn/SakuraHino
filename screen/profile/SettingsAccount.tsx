import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator, // Import ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import profileService from "../../services/profileService";

export interface User {
  name: string;
  email: string;
  username: string;
  avatarUrl: string;
  longStreak: number;
  expScore: number;
}

// Component LoadingOverlay bao phủ toàn màn hình
const LoadingOverlay = () => (
  <View style={overlayStyles.overlay}>
    <ActivityIndicator size="large" color="#fff" />
  </View>
);

const SettingsAccount = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const user = route.params.user as User;

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatar, setAvatar] = useState(user?.avatarUrl || "");
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setAvatar(result.assets[0].uri);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Lỗi", "Không thể chọn ảnh");
    }
  };

  const saveChanges = async () => {
    Alert.alert(
      "Xác nhận lưu",
      "Bạn có chắc chắn muốn lưu các thay đổi này không?",
      [
        {
          text: "Hủy",
          onPress: () => console.log("Hủy bỏ lưu"),
          style: "cancel",
        },
        {
          text: "Lưu",
          onPress: async () => {
            setIsLoading(true);
            try {
              await profileService.editUser(name, email, avatar);
              console.log("Đã lưu thay đổi thành công!");
              navigation.navigate("Profile");
            } catch (error) {
              console.error("Lỗi khi lưu thay đổi:", error);
              Alert.alert("Lỗi", "Không thể lưu thay đổi. Vui lòng thử lại.");
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.closeButton}
          >
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>Tài khoản</Text>
          <View style={{ width: 40 }} />
        </View>

        <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
          {avatar ? (
            <View>
              <Image source={{ uri: avatar }} style={styles.avatar} />
              <View style={styles.editOverlay}>
                <Text style={styles.editText}>Chỉnh sửa</Text>
              </View>
            </View>
          ) : (
            <View style={styles.placeholderAvatar}>
              <Text style={styles.placeholderText}>Thêm ảnh</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.form}>
          <Text style={styles.label}>Tên</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Nhập tên của bạn"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Nhập email của bạn"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={saveChanges}
          disabled={isLoading}
        >
          <Text style={styles.saveButtonText}>Lưu</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Hiển thị LoadingOverlay khi isLoading là true */}
      {isLoading && <LoadingOverlay />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 10,
  },
  editOverlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    paddingVertical: 20,
  },
  editText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6b7280",
  },
  avatarContainer: {
    alignSelf: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  placeholderAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#9ca3af",
    fontWeight: "bold",
  },
  form: {
    gap: 16,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 12,
  },
  saveButton: {
    backgroundColor: "#22c55e",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

const overlayStyles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
});

export default SettingsAccount;
