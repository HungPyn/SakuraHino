import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView, // Thêm ScrollView cho nội dung có thể cuộn
  Platform, // Để xử lý các sự khác biệt nhỏ giữa iOS/Android nếu cần
} from "react-native";
import { useNavigation, StackActions } from "@react-navigation/native";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday"; // Cần plugin weekday cho dayjs().day()
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

// Import các SVGs của bạn (đảm bảo chúng là các component React Native SVG)
import {
  BronzeLeagueSvg,
  FirstPlaceSvg,
  LeaderboardBannerSvg,
  LeaderboardExplanationSvg,
  LockedLeaderboardSvg,
  LockedLeagueSvg,
  SecondPlaceSvg,
  ThirdPlaceSvg,
} from "../../../components/Svgs"; // Điều chỉnh đường dẫn phù hợp

import { useBoundStore } from "../../../hooks/useBoundStore"; // Điều chỉnh đường dẫn phù hợp
import { BottomBar } from "../../../components/custombar/BottomBar"; // Điều chỉnh đường dẫn phù hợp
import { useLeaderboardUsers } from "./useLeaderboardUsers"; // Điều chỉnh đường dẫn phù hợp
import type { RootStackParamList } from "../../../types/navigatorType"; // Điều chỉnh đường dẫn phù hợp

dayjs.extend(weekday); // Kích hoạt plugin weekday

type LeaderboardScreenNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "Leaderboard"
>["navigation"];

const LeaderboardExplanationSection = () => {
  return (
    <View style={leaderboardStyles.explanationContainer}>
      <View style={leaderboardStyles.explanationTextContent}>
        <Text style={leaderboardStyles.explanationHeading}>
          What are leaderboards?
        </Text>
        <Text style={leaderboardStyles.explanationBoldText}>
          Do lessons. Earn XP. Compete.
        </Text>
        <Text style={leaderboardStyles.explanationNormalText}>
          Earn XP through lessons, then compete with players in a weekly
          leaderboard
        </Text>
      </View>

      <View style={leaderboardStyles.explanationSpacer}></View>

      {/* Đảm bảo LeaderboardExplanationSvg là một component SVG của React Native */}
      <LeaderboardExplanationSvg />
    </View>
  );
};

type TimeLeftUnit = "days" | "hours" | "minutes";

const timeUntilStartOfWeek = (units: TimeLeftUnit): number => {
  const startOfWeekDay = 0; // Sunday
  const startOfWeekHour = 20; // 8 PM
  const now = dayjs();

  let nextSunday = now.startOf("day").weekday(startOfWeekDay);

  // Nếu hôm nay là Chủ Nhật và chưa đến 8 PM, thì đó là Chủ Nhật này
  // Ngược lại, nếu đã qua 8 PM hoặc không phải Chủ Nhật, thì tính Chủ Nhật tuần sau
  if (now.weekday() === startOfWeekDay && now.hour() < startOfWeekHour) {
    // Không cần làm gì, nextSunday đã là Chủ Nhật hiện tại
  } else {
    // Nếu đã qua Chủ Nhật hiện tại hoặc chưa đến Chủ Nhật, tìm Chủ Nhật tiếp theo
    if (now.weekday() === startOfWeekDay && now.hour() >= startOfWeekHour) {
      nextSunday = nextSunday.add(1, 'week');
    } else if (now.weekday() > startOfWeekDay) {
        nextSunday = nextSunday.add(1, 'week');
    }
  }

  // Đặt giờ cho nextSunday
  nextSunday = nextSunday.hour(startOfWeekHour).minute(0).second(0).millisecond(0);

  return nextSunday.diff(now, units);
};


const timeLeft = (): `${number} ${TimeLeftUnit}` => {
  const days = timeUntilStartOfWeek("days");
  if (days > 0) {
    return `${days} days`;
  }
  const hours = timeUntilStartOfWeek("hours");
  if (hours > 0) {
    return `${hours} hours`;
  }
  const minutes = timeUntilStartOfWeek("minutes");
  // Đảm bảo không trả về 0 minutes nếu thực sự chưa đến lúc
  if (minutes > 0) {
    return `${minutes} minutes`;
  }
  return `0 minutes`; // Hoặc một thông báo khác khi thời gian đã đến
};


const defaultPicture = "https://placekitten.com/100/100";

const LeaderboardProfile = ({
  place,
  name,
  xp,
  isCurrentUser,
}: {
  place: number;
  name: string;
  xp: number;
  isCurrentUser: boolean;
}) => {
  return (
    <View
      style={[
        leaderboardStyles.profileContainer,
        isCurrentUser ? leaderboardStyles.currentUserProfile : {},
      ]}
    >
      <View style={leaderboardStyles.profileRankAndImage}>
        {place === 1 ? (
          <FirstPlaceSvg width={40} height={40} />
        ) : place === 2 ? (
          <SecondPlaceSvg width={40} height={40} />
        ) : place === 3 ? (
          <ThirdPlaceSvg width={40} height={40} />
        ) : (
          <View style={leaderboardStyles.profileRankNumberContainer}>
            <Text style={leaderboardStyles.profileRankNumberText}>{place}</Text>
          </View>
        )}
        <Image
          style={leaderboardStyles.profileImage}
          source={{ uri: defaultPicture }}
        />
      </View>
      <View style={leaderboardStyles.profileNameContainer}>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={leaderboardStyles.profileNameText}
        >
          {name}
        </Text>
      </View>
      <Text style={leaderboardStyles.profileXpText}>{`${xp} XP`}</Text>
    </View>
  );
};

const Leaderboard = () => {
  const navigation = useNavigation<LeaderboardScreenNavigationProp>();
  const loggedIn = useBoundStore((x) => x.loggedIn);
  const lessonsCompleted = useBoundStore((x) => x.lessonsCompleted);

  useEffect(() => {
    if (!loggedIn) {
      // Thay đổi router.push thành navigation.dispatch(StackActions.replace)
      navigation.dispatch(StackActions.replace("Login")); // Giả sử 'Login' là tên màn hình đăng nhập của bạn
    }
  }, [loggedIn, navigation]);

  const lessonsToUnlockLeaderboard = 10;
  const lessonsRemainingToUnlockLeaderboard =
    lessonsToUnlockLeaderboard - lessonsCompleted;
  const leaderboardIsUnlocked = lessonsCompleted >= lessonsToUnlockLeaderboard;

  const leaderboardLeague = "Bronze League"; // Giá trị này có thể động hơn trong thực tế

  const leaderboardUsers = useLeaderboardUsers(); // Hook này cần tương thích với RN

  return (
    <View style={leaderboardStyles.mainContainer}>
     
      <ScrollView
        contentContainerStyle={leaderboardStyles.scrollViewContentContainer}
      >
        <View style={leaderboardStyles.contentWrapper}>
          {!leaderboardIsUnlocked && (
            <>
              {/* Đảm bảo LeaderboardBannerSvg là component SVG của React Native */}
              <LeaderboardBannerSvg width={300} height={150} />
              <Text style={leaderboardStyles.unlockTitle}>
                Unlock Leaderboards!
              </Text>
              <Text style={leaderboardStyles.unlockDescription}>
                Complete {lessonsRemainingToUnlockLeaderboard} more lesson
                {lessonsRemainingToUnlockLeaderboard === 1 ? "" : "s"} to start
                competing
              </Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("LessonScreen", { practice: true })
                } // Giả sử 'LessonScreen' là tên màn hình bài học của bạn
                style={leaderboardStyles.startButton}
              >
                <Text style={leaderboardStyles.startButtonText}>
                  Start a lesson
                </Text>
              </TouchableOpacity>
              <View style={leaderboardStyles.spacerHeight5}></View>
              {/* Đảm bảo LockedLeaderboardSvg là component SVG của React Native */}
              <LockedLeaderboardSvg width={200} height={200} />
            </>
          )}
          {leaderboardIsUnlocked && (
            <>
              <View style={leaderboardStyles.stickyHeader}>
                <View style={leaderboardStyles.leagueIconsContainer}>
                  <BronzeLeagueSvg width={80} height={80} />
                  <LockedLeagueSvg width={60} height={60} />
                  <LockedLeagueSvg width={60} height={60} />
                  <LockedLeagueSvg width={60} height={60} />
                  <LockedLeagueSvg width={60} height={60} />
                </View>
                <Text style={leaderboardStyles.leagueTitle}>
                  {leaderboardLeague}
                </Text>
                <View style={leaderboardStyles.leaderboardInfo}>
                  <Text style={leaderboardStyles.leaderboardInfoText}>
                    Top 20 advance to the next league
                  </Text>
                  <Text style={leaderboardStyles.leaderboardTimeLeft}>
                    {timeLeft()}
                  </Text>
                </View>
                <View style={leaderboardStyles.divider}></View>
              </View>
              <View style={leaderboardStyles.leaderboardList}>
                {leaderboardUsers.map((user, i) => {
                  return (
                    <LeaderboardProfile
                      key={user.name}
                      place={i + 1}
                      name={user.name}
                      xp={user.xp}
                      isCurrentUser={user.isCurrentUser}
                    />
                  );
                })}
              </View>
            </>
          )}
        </View>
        {/* LeaderboardExplanationSection chỉ hiển thị trên màn hình lớn (web), nên thường sẽ bị ẩn trên RN */}
        {/* Để giả lập "hidden xl:flex", chúng ta có thể dùng Platform hoặc ẩn nó hoàn toàn nếu không cần thiết trên mobile */}
        {/* {!leaderboardIsUnlocked && <LeaderboardExplanationSection />} */}
      </ScrollView>
      <BottomBar selectedTab="Leaderboards" />
    </View>
  );
};

const leaderboardStyles = StyleSheet.create({
  mainContainer: {
    flex: 1, // Đảm bảo component chiếm toàn bộ không gian
    backgroundColor: "#FFFFFF",
  },
  scrollViewContentContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 14,
    paddingBottom: 28, // Để tạo khoảng trống cho BottomBar
  },
  contentWrapper: {
    width: "100%", // Chiếm toàn bộ chiều rộng có sẵn
    maxWidth: 600, // max-w-xl tương đương với khoảng 56rem ~ 896px trên web, cần điều chỉnh cho mobile
    alignItems: "center",
    paddingHorizontal: 20, // px-5
    gap: 20, // gap-5,
  },
  // --- Unlock Leaderboard Styles ---
  unlockTitle: {
    textAlign: "center",
    fontSize: 24, // text-2xl
    fontWeight: "bold",
    color: "#4B5563", // gray-700
  },
  unlockDescription: {
    textAlign: "center",
    fontSize: 18, // text-lg
    color: "#6B7280", // gray-500
  },
  startButton: {
    width: "auto",
    borderRadius: 16, // rounded-2xl
    borderWidth: 2,
    borderBottomWidth: 4, // border-b-4
    borderColor: "#E5E7EB", // gray-200
    paddingHorizontal: 64, // px-16
    paddingVertical: 8, // py-2
    alignItems: "center",
    justifyContent: "center",
    // Các thuộc tính hover không áp dụng trực tiếp trong RN, cần dùng Pressable hoặc TouchableOpacity với state
  },
  startButtonText: {
    textAlign: "center",
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#60A5FA", // blue-400
  },
  spacerHeight5: {
    height: 20, // h-5
  },

  // --- Leaderboard Unlocked Styles ---
  stickyHeader: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingTop: 14, // -mt-14 + pt-14
    paddingBottom: 20, // pb-5
    // position: "absolute", // sticky không có trong RN, cần dùng thư viện hoặc tạo hiệu ứng thủ công
    // top: 0,
    // zIndex: 1,
    // Để làm sticky header trong React Native cần dùng `FlatList` với `ListHeaderComponent` hoặc `SectionList`
    // Hoặc xử lý thủ công với `Animated.event` trên `ScrollView`
  },
  leagueIconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20, // gap-5
    marginBottom: 10,
  },
  leagueTitle: {
    fontSize: 24, // text-2xl
    fontWeight: "bold",
    color: "#4B5563", // Có thể thay đổi màu nếu cần
    marginBottom: 10,
  },
  leaderboardInfo: {
    width: "100%",
    alignItems: "center",
    gap: 4, // gap-1
  },
  leaderboardInfoText: {
    fontSize: 18, // text-lg
    color: "#6B7280", // gray-500
  },
  leaderboardTimeLeft: {
    fontWeight: "bold",
    color: "#FBBF24", // yellow-400
  },
  divider: {
    width: "100%",
    height: 2, // border-b-2
    backgroundColor: "#E5E7EB", // gray-200
    marginTop: 10, // Khoảng cách sau divider
  },
  leaderboardList: {
    width: "100%",
    marginTop: 20, // Khoảng cách từ divider đến list
  },

  // --- Leaderboard Profile Styles ---
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20, // gap-5
    borderRadius: 16, // rounded-2xl
    paddingHorizontal: 20, // px-5
    paddingVertical: 8, // py-2
    marginHorizontal: 0, // md:mx-0
    // hover:bg-gray-100 không có trong RN, cần dùng TouchableOpacity với state
  },
  currentUserProfile: {
    backgroundColor: "#E5E7EB", // gray-200
  },
  profileRankAndImage: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16, // gap-4
  },
  profileRankNumberContainer: {
    height: 40, // h-10
    width: 40, // w-10
    alignItems: "center",
    justifyContent: "center",
  },
  profileRankNumberText: {
    fontWeight: "bold",
    color: "#16A34A", // green-700
  },
  profileImage: {
    height: 48, // h-12
    width: 48, // w-12
    borderRadius: 24, // rounded-full (một nửa chiều rộng/chiều cao)
  },
  profileNameContainer: {
    flexGrow: 1, // grow
    overflow: "hidden",
  },
  profileNameText: {
    fontWeight: "bold",
  },
  profileXpText: {
    shrink: 0, // shrink-0
    color: "#6B7280", // gray-500
  },

  // --- Leaderboard Explanation Section Styles (for larger screens/conditional rendering) ---
  explanationContainer: {
    // Hidden on small screens, shown on xl screens.
    // In React Native, you would typically hide this by not rendering it at all
    // or using responsive hooks/libraries for different screen sizes.
    // For now, I'll keep it defined but note it would be conditionally rendered.
    // Equivalent to: hidden h-fit w-96 shrink-0 gap-5 rounded-2xl border-2 border-gray-200 p-6 xl:flex
    width: 384, // w-96 (96 * 4 = 384px)
    maxHeight: "fit-content", // h-fit
    flexShrink: 0, // shrink-0
    gap: 20, // gap-5
    borderRadius: 16, // rounded-2xl
    borderWidth: 2,
    borderColor: "#E5E7EB", // gray-200
    padding: 24, // p-6
    flexDirection: "column", // flex (default for View is column)
    // Only show on larger screens by not rendering on mobile
    display: Platform.OS === "web" ? "flex" : "none", // Example: hide on non-web platforms
  },
  explanationTextContent: {
    flexDirection: "column",
    gap: 20, // gap-5
  },
  explanationHeading: {
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#9CA3AF", // gray-400
  },
  explanationBoldText: {
    fontWeight: "bold",
    color: "#4B5563", // gray-700
  },
  explanationNormalText: {
    color: "#9CA3AF", // gray-400
  },
  explanationSpacer: {
    width: 40, // w-10
    flexShrink: 0,
  },
});

export default Leaderboard;