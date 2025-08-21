import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import Svg, { G, Path } from "react-native-svg";
import {
  EmptyMedalSvg,
  FireSvg,
  GemSvg,
  LightningProgressSvg,
  MoreOptionsSvg,
} from "./Svgs";
import { SafeAreaView } from "react-native-safe-area-context";

type SvgComponentProps = SvgProps & {
  style?: StyleProp<ViewStyle>;
};
type CustomSvgProps = SvgProps & {
  style?: StyleProp<ViewStyle>;
};
const EmptyFireTopBarSvg = ({ style, ...props }: SvgComponentProps) => {
  return (
    <Svg
      width={25}
      height={30}
      viewBox="0 0 25 30"
      fill="none"
      style={style}
      {...props}
    >
      <G opacity={0.2}>
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M13.9697 2.91035C13.2187 1.96348 11.7813 1.96348 11.0303 2.91035L7.26148 7.66176L4.83362 6.36218C4.61346 6.24433 4.1221 6.09629 3.88966 6.05712C2.72329 5.86056 2.04098 6.78497 2.04447 8.03807L2.06814 16.5554C2.02313 16.9355 2 17.322 2 17.7137C2 23.2979 6.70101 27.8248 12.5 27.8248C18.299 27.8248 23 23.2979 23 17.7137C23 15.3518 22.1591 13.1791 20.7498 11.4581L13.9697 2.91035ZM11.7198 13.1888C12.0889 12.6861 12.8399 12.6861 13.209 13.1888L15.7324 16.6249C16.5171 17.4048 17 18.4679 17 19.6396C17 22.0329 14.9853 23.973 12.5 23.973C10.0147 23.973 8 22.0329 8 19.6396C8 18.6017 8.37893 17.649 9.01085 16.9029C9.0252 16.8668 9.04457 16.8315 9.06935 16.7978L11.7198 13.1888Z"
          fill="black"
        />
      </G>
    </Svg>
  );
};

const EmptyGemTopBarSvg = ({ style, ...props }: SvgComponentProps) => {
  return (
    <Svg
      width={24}
      height={30}
      viewBox="0 0 24 30"
      fill="none"
      style={style}
      {...props}
    >
      <G opacity={0.2}>
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3.63705 7.31556C2.62104 7.92872 2 9.02888 2 10.2156V19.8818C2 21.0685 2.62104 22.1687 3.63705 22.7819L10.1117 26.6893C11.1881 27.3389 12.5356 27.3389 13.612 26.6894L20.087 22.7818C21.1031 22.1687 21.7241 21.0685 21.7241 19.8818V10.2156C21.7241 9.0289 21.1031 7.92872 20.087 7.31557L13.612 3.40806C12.5356 2.7585 11.1881 2.75851 10.1117 3.40809L3.63705 7.31556ZM11.8902 6.37281C11.8902 5.52831 10.9645 5.01055 10.2449 5.45256L4.91163 8.72852C4.24944 9.13527 4.22068 10.0873 4.85711 10.5332L7.24315 12.2053C7.59354 12.4508 8.05585 12.4663 8.42194 12.2449L11.3692 10.462C11.6926 10.2664 11.8902 9.91591 11.8902 9.53794V6.37281Z"
          fill="black"
        />
      </G>
    </Svg>
  );
};

// --- Định nghĩa kiểu dữ liệu cho props
interface TopBarProps {
  backgroundColor?: string;
  borderColor?: string;
  score: number;
  streak: number;
}

const TopBar = ({
  backgroundColor = "#58cc02",
  borderColor = "#46a302",
  score,
  streak,
}: TopBarProps) => {
  return (
    <View
      style={[
        styles.header,
        { backgroundColor, borderBottomColor: borderColor },
      ]}
    >
      <TouchableOpacity accessibilityLabel="See languages"></TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        accessibilityLabel="Toggle streak menu"
      >
        {streak > 0 ? (
          <FireSvg style={styles.icon} />
        ) : (
          <EmptyFireTopBarSvg style={styles.icon} />
        )}
        <Text
          style={[
            styles.text,
            streak > 0 ? styles.textWhite : styles.textBlack,
          ]}
        >
          {streak}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        accessibilityLabel="Toggle lingot menu"
      >
        {/* THAY THẾ GEM BẰNG LIGHTNING */}
        {score > 0 ? (
          <LightningProgressSvg size={30} />
        ) : (
          <LightningProgressSvg size={30} />
        )}
        <Text
          style={[styles.text, score > 0 ? styles.textWhite : styles.textBlack]}
        >
          {score}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity accessibilityLabel="Toggle more menu">
        {/* <MoreOptionsSvg style={styles.icon} /> */}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    width: Dimensions.get("window").width,
    height: 58,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    borderBottomWidth: 2,
    zIndex: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  icon: {
    width: 25,
    height: 30,
  },
  text: {
    fontWeight: "bold",
    fontSize: 16,
  },
  textWhite: {
    color: "#fff",
  },
  textBlack: {
    color: "#000",
    opacity: 0.2,
  },
});

export default TopBar;
