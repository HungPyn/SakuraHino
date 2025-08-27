import React, { useEffect } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import RootNavigator from "./navigator/RootNavigator";
import Toast from "react-native-toast-message";
import PushNotification from "react-native-push-notification";

export default function App() {
  useEffect(() => {
    // Tạo channel cho notification (Android)
    PushNotification.createChannel(
      {
        channelId: "reminder-channel",
        channelName: "Nhắc nhở học tập Sakura Hino",
        channelDescription: "Đến giờ học rồi!!!",
        importance: 4,
        vibrate: true,
      },
      (created: boolean) => console.log("Channel created:", created)
    );

    // Configure notification
    PushNotification.configure({
      // Dùng any thay vì ReceivedNotification
      onNotification: function (notification: any) {
        console.log("NOTIFICATION:", notification);
      },
      requestPermissions: false,
    });
  }, []);

  return (
    <NavigationContainer theme={DefaultTheme}>
      <RootNavigator />
      <Toast />
    </NavigationContainer>
  );
}
