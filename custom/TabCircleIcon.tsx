// components/TabCircleIcon.tsx
import React from "react";
import { View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

interface Props {
  focused: boolean;
}

const TabCircleIcon: React.FC<Props> = ({ focused }) => {
  return (
    <View
      style={{
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#FFC1CC",
        justifyContent: "center",
        alignItems: "center",
        marginTop: -40,
        elevation: 4,
      }}
    >
      <Icon name={focused ? "play" : "play-outline"} size={28} color="#fff" />
    </View>
  );
};

export default TabCircleIcon;
