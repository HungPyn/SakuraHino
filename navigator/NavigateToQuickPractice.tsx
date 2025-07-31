import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigatorType";
import { PracticeType } from "../types/navigatorType";
export const useQuickPracticeNavigation = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const navigateToQuickPractice = (type: PracticeType) => {
    navigation.navigate("QuickPractice", { type });
  };

  return { navigateToQuickPractice };
};
