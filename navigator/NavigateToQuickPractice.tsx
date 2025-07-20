import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigatorType";
import { PracticeType } from "../types/navigatorType";
// Hàm hook để gọi tới QuickPractice
export const useQuickPracticeNavigation = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const navigateToQuickPractice = (type: PracticeType) => {
    navigation.navigate("QuickPractice", { type });
  };

  return { navigateToQuickPractice };
};
