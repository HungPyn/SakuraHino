import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { BottomBar } from "../../../components/custombar/BottomBar"; // Đã sửa đường dẫn

// Các SVG của bạn đã được chuyển sang dạng component cho React Native
import {
  StreakFreezeSvg,
  EmptyGemSvg,
  DoubleOrNothingSvg,
  DuoPlushieSvg,
} from "../../../components/Svgs";

const streakFreezes = 0; // Giá trị có thể lấy từ state hoặc store

const ShopScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={shopStyles.safeArea}>
      <ScrollView
        contentContainerStyle={shopStyles.scrollViewContent}
        style={shopStyles.scrollView}
      >
        <View style={shopStyles.container}>
          {/* Power-ups Section */}
          <View style={shopStyles.section}>
            <Text style={shopStyles.sectionTitle}>Power-ups</Text>

            {/* Streak Freeze Item */}
            <View style={shopStyles.itemContainer}>
              <StreakFreezeSvg style={shopStyles.itemIcon} />
              <View style={shopStyles.itemContent}>
                <Text style={shopStyles.itemTitle}>Streak Freeze</Text>
                <Text style={shopStyles.itemDescription}>
                  Streak Freeze allows your streak to remain in place for one
                  full day of inactivity.
                </Text>
                <View style={shopStyles.badge}>
                  <Text style={shopStyles.badgeText}>
                    {streakFreezes} / 2 equipped
                  </Text>
                </View>
                <TouchableOpacity
                  style={[shopStyles.button, shopStyles.disabledButton]}
                  disabled
                >
                  <Text style={shopStyles.buttonText}>Get one for:</Text>
                  <EmptyGemSvg width={18} height={20} />
                  <Text style={shopStyles.buttonText}>10</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Double or Nothing Item */}
            <View style={shopStyles.itemContainer}>
              <DoubleOrNothingSvg style={shopStyles.itemIcon} />
              <View style={shopStyles.itemContent}>
                <Text style={shopStyles.itemTitle}>Double or Nothing</Text>
                <Text style={shopStyles.itemDescription}>
                  Attempt to double your five lingot wager by maintaining a
                  seven day streak.
                </Text>
                <TouchableOpacity
                  style={[shopStyles.button, shopStyles.disabledButton]}
                  disabled
                >
                  <Text style={shopStyles.buttonText}>Get for:</Text>
                  <EmptyGemSvg width={18} height={20} />
                  <Text style={shopStyles.buttonText}>5</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Merch Section */}
          <View style={shopStyles.section}>
            <Text style={shopStyles.sectionTitle}>Merch</Text>

            {/* Duo Plushie Item */}
            <View style={shopStyles.itemContainer}>
              <DuoPlushieSvg style={shopStyles.merchIcon} />
              <View style={shopStyles.itemContent}>
                <Text style={shopStyles.itemTitle}> Plushie</Text>
                <Text style={shopStyles.itemDescription}>
                  Celebrate Duolingo's 10 year anniversary with a new exclusive
                  Duo plushie!
                </Text>
                <TouchableOpacity style={shopStyles.buyButton}>
                  <Text style={shopStyles.buyButtonText}>$29.99</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <BottomBar selectedTab="Shop" />
    </SafeAreaView>
  );
};

const shopStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 80, // Để nội dung không bị che bởi BottomBar
    paddingHorizontal: 16, // padding ngang
  },
  container: {
    flex: 1,
    paddingTop: 10,
  },
  section: {
    paddingVertical: 28,
  },
  sectionTitle: {
    marginBottom: 20,
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
  },
  itemContainer: {
    flexDirection: "row",
    borderTopWidth: 2,
    borderTopColor: "#D1D5DB",
    paddingVertical: 20,
    gap: 12,
  },
  itemIcon: {
    width: 124,
    height: 124,
    flexShrink: 0,
  },
  merchIcon: {
    width: 124,
    height: 124,
    flexShrink: 0,
    padding: 16,
  },
  itemContent: {
    flex: 1,
    flexDirection: "column",
    gap: 12,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  itemDescription: {
    fontSize: 14,
    color: "#6B7280",
  },
  badge: {
    width: "auto",
    borderRadius: 9999, // rounded-full
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#9CA3AF",
  },
  button: {
    flexDirection: "row",
    width: "auto",
    alignItems: "center",
    gap: 4,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: "flex-start",
  },
  disabledButton: {
    backgroundColor: "#F3F4F6",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#9CA3AF",
  },
  buyButton: {
    flexDirection: "row",
    width: "auto",
    alignItems: "center",
    gap: 4,
    borderRadius: 16,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignSelf: "flex-start",
  },
  buyButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#EF4444",
  },
});

export default ShopScreen;
