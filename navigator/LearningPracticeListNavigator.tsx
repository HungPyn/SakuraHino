import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList, PracticeType } from "../types/navigatorType";

export const useLearningPracticeListNavigator = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const LearningPracticeListNavigator = () => {
    navigation.navigate("LearningPathScreen");
  };

  return { LearningPracticeListNavigator };
};

export const useQuickPractice = (type: PracticeType) => {
  const naviation = useNavigation<NavigationProp<RootStackParamList>>();
  const QuickPractice = () => {
    naviation.navigate("QuickPractice", { type });
  };
  return { QuickPractice };
};
