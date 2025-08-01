import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { BottomBar } from "../../components/custombar/BottomBar";
import { useBoundStore } from "../../hooks/useBoundStore";

const SettingsAccount = () => {
  const navigation = useNavigation();

  const name = useBoundStore((x) => x.name);
  const setName = useBoundStore((x) => x.setName);
  const [localName, setLocalName] = useState(name);

  const username = useBoundStore((x) => x.username);
  const setUsername = useBoundStore((x) => x.setUsername);
  const [localUsername, setLocalUsername] = useState(username);

  const accountOptions = [
    { title: "Name", value: localName, setValue: setLocalName },
    { title: "Username", value: localUsername, setValue: setLocalUsername },
  ];

  const hasChanges = name !== localName || username !== localUsername;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Account</Text>
          <TouchableOpacity
            style={[styles.saveButton, !hasChanges && styles.disabledButton]}
            onPress={() => {
              setName(localName);
              setUsername(localUsername);
              navigation.goBack();
            }}
            disabled={!hasChanges}
          >
            <Text
              style={[
                styles.saveButtonText,
                !hasChanges && styles.disabledButtonText,
              ]}
            >
              Save changes
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.formContainer}>
            {accountOptions.map(({ title, value, setValue }) => (
              <View key={title} style={styles.inputRow}>
                <Text style={styles.inputTitle}>{title}</Text>
                <TextInput
                  style={styles.input}
                  value={value}
                  onChangeText={setValue}
                />
              </View>
            ))}
          </View>
          {/* Component này cần được chuyển đổi sang React Native nếu cần */}
          {/* <SettingsRightNav selectedTab="Account" /> */}
        </View>
      </ScrollView>
      {/* Giữ lại BottomBar và LeftBar nếu chúng đã được chuyển đổi */}
      <BottomBar selectedTab={null} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  scrollViewContent: {
    paddingBottom: 90, // để tránh BottomBar
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4b5563",
  },
  saveButton: {
    borderRadius: 16,
    borderBottomWidth: 4,
    borderColor: "#16a34a",
    backgroundColor: "#22c55e",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  saveButtonText: {
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#fff",
  },
  disabledButton: {
    backgroundColor: "#e5e7eb",
    borderColor: "#d1d5db",
  },
  disabledButtonText: {
    color: "#9ca3af",
  },
  content: {
    flex: 1,
    flexDirection: "column",
    gap: 32,
  },
  formContainer: {
    flexDirection: "column",
    gap: 20,
  },
  inputRow: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: 8,
  },
  inputTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  input: {
    flexGrow: 1,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});

export default SettingsAccount;
