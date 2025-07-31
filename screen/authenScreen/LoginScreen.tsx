// File: src/screen/authenScreen/LoginScreen.tsx

import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Linking, // Để mở liên kết bên ngoài
  Platform, // Để xử lý platform-specific styles nếu cần
} from "react-native";
import {
  useNavigation,
  useRoute,
  StackActions,
} from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useBoundStore } from "../../hooks/useBoundStore"; // Đảm bảo đường dẫn đúng
import {
  CloseSvg,
  FacebookLogoSvg,
  GoogleLogoSvg,
} from "../../components/Svgs"; // Đảm bảo đường dẫn đúng
import type { RootStackParamList } from "../../types/navigatorType"; // Đảm bảo đường dẫn đúng

// --- Định nghĩa kiểu cho LoginScreenState (giữ nguyên) ---
export type LoginScreenState = "HIDDEN" | "LOGIN" | "SIGNUP";

// --- Định nghĩa kiểu cho Navigation và Route Props ---
type LoginScreenRouteProp = NativeStackScreenProps<
  RootStackParamList,
  "Login"
>["route"];
type LoginScreenNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "Login"
>["navigation"];

// --- Hook useLoginScreen (đã điều chỉnh cho React Native) ---
// Hook này sẽ lấy trạng thái ban đầu từ route params thay vì router.query
export const useLoginScreen = () => {
  const route = useRoute<LoginScreenRouteProp>();
  const navigation = useNavigation<LoginScreenNavigationProp>(); // Dùng để điều hướng nếu cần

  const loggedIn = useBoundStore((x) => x.loggedIn);

  // Lấy trạng thái từ route.params
  const queryState: LoginScreenState = (() => {
    if (loggedIn) return "HIDDEN";
    if (route.params?.login) return "LOGIN"; // Kiểm tra params.login
    if (route.params?.["sign-up"]) return "SIGNUP"; // Kiểm tra params.sign-up
    return "HIDDEN";
  })();

  const [loginScreenState, setLoginScreenState] = useState(queryState);

  // Cập nhật trạng thái khi route params thay đổi
  useEffect(() => {
    setLoginScreenState(queryState);
  }, [queryState]);

  // Điều hướng nếu đã đăng nhập và màn hình không ẩn
  useEffect(() => {
    if (loginScreenState !== "HIDDEN" && loggedIn) {
      setLoginScreenState("HIDDEN");
      // Có thể navigate hoặc replace tới màn hình chính sau khi đăng nhập
      // navigation.replace("LearningPathScreen"); // Ví dụ
    }
  }, [loginScreenState, loggedIn, setLoginScreenState, navigation]);

  return { loginScreenState, setLoginScreenState };
};

// --- Component LoginScreen ---
export const LoginScreen = () => {
  // Sử dụng hook useLoginScreen để quản lý trạng thái hiển thị
  const { loginScreenState, setLoginScreenState } = useLoginScreen();

  const navigation = useNavigation<LoginScreenNavigationProp>(); // Để điều hướng
  const loggedIn = useBoundStore((x) => x.loggedIn);
  const logIn = useBoundStore((x) => x.logIn);
  const setUsername = useBoundStore((x) => x.setUsername);
  const setName = useBoundStore((x) => x.setName);

  const [ageTooltipShown, setAgeTooltipShown] = useState(false);

  // Sử dụng useState cho giá trị TextInput thay vì useRef với HTMLInputElement
  const [age, setAge] = useState("");
  const [name, setNameInput] = useState("");
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");

  // useEffect để xử lý việc tự động ẩn màn hình nếu đã đăng nhập (đã có trong useLoginScreen)
  // useEffect(() => {
  //   if (loginScreenState !== "HIDDEN" && loggedIn) {
  //     setLoginScreenState("HIDDEN");
  //   }
  // }, [loginScreenState, loggedIn, setLoginScreenState]);

  const logInAndSetUserProperties = () => {
    const finalName = name.trim() || Math.random().toString().slice(2);
    const username = finalName.replace(/ +/g, "-");
    setUsername(username);
    setName(finalName);
    logIn();
    // Điều hướng sau khi đăng nhập thành công
    // navigation.replace("LearningPathScreen"); // Hoặc màn hình chính của bạn
    navigation.dispatch(StackActions.replace("LearningPathScreen")); // Sử dụng StackActions.replace để rõ ràng hơn
  };

  return (
    <Modal
      visible={loginScreenState !== "HIDDEN"}
      transparent={true}
      animationType="slide" // Hoặc "fade"
      onRequestClose={() => setLoginScreenState("HIDDEN")}
    >
      <View
        style={[
          styles.overlay,
          loginScreenState === "HIDDEN" && styles.hiddenOverlay,
        ]}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setLoginScreenState("HIDDEN")}
            >
              <CloseSvg
                width={24}
                height={24}
                fill={styles.closeButton.color}
              />
              <Text style={styles.srOnly}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.toggleAuthButton}
              onPress={() =>
                setLoginScreenState((x) => (x === "LOGIN" ? "SIGNUP" : "LOGIN"))
              }
            >
              <Text style={styles.toggleAuthButtonText}>
                {loginScreenState === "LOGIN" ? "Sign up" : "Login"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.contentArea}>
            <View style={styles.formContainer}>
              <Text style={styles.title}>
                {loginScreenState === "LOGIN"
                  ? "Log in"
                  : "Create your profile"}
              </Text>
              <View style={styles.inputGroup}>
                {loginScreenState === "SIGNUP" && (
                  <>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        style={styles.textInput}
                        placeholder="Age (optional)"
                        keyboardType="numeric"
                        value={age}
                        onChangeText={setAge}
                      />
                      <TouchableOpacity
                        style={styles.tooltipIconContainer}
                        onPress={() => setAgeTooltipShown((x) => !x)}
                        // onMouseEnter/onMouseLeave không có trong RN, dùng onPress
                      >
                        <View style={styles.tooltipIcon}>
                          <Text style={styles.tooltipIconText}>?</Text>
                        </View>
                        {ageTooltipShown && (
                          <View style={styles.ageTooltip}>
                            <Text style={styles.ageTooltipText}>
                              Providing your age ensures you get the right
                              Duolingo experience. For more details, please
                              visit our{" "}
                              <Text
                                style={styles.linkText}
                                onPress={() =>
                                  Linking.openURL(
                                    "https://www.duolingo.com/privacy"
                                  )
                                }
                              >
                                Privacy Policy
                              </Text>
                            </Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    </View>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Name (optional)"
                      value={name}
                      onChangeText={setNameInput}
                    />
                  </>
                )}
                <TextInput
                  style={styles.textInput}
                  placeholder={
                    loginScreenState === "LOGIN"
                      ? "Email or username (optional)"
                      : "Email (optional)"
                  }
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={emailOrUsername}
                  onChangeText={setEmailOrUsername}
                />
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Password (optional)"
                    secureTextEntry={true}
                    value={password}
                    onChangeText={setPassword}
                  />
                  {loginScreenState === "LOGIN" && (
                    <TouchableOpacity
                      style={styles.forgotPasswordButton}
                      onPress={() =>
                        Linking.openURL(
                          "https://www.duolingo.com/forgot-password"
                        )
                      }
                    >
                      <Text style={styles.forgotPasswordText}>Forgot?</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={logInAndSetUserProperties}
              >
                <Text style={styles.primaryButtonText}>
                  {loginScreenState === "LOGIN" ? "Log in" : "Create account"}
                </Text>
              </TouchableOpacity>

              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine}></View>
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine}></View>
              </View>

              <View style={styles.socialButtonsContainer}>
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={logInAndSetUserProperties}
                >
                  <FacebookLogoSvg
                    width={20}
                    height={20}
                    style={styles.socialIcon}
                  />
                  <Text style={styles.socialButtonText}>Facebook</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={logInAndSetUserProperties}
                >
                  <GoogleLogoSvg
                    width={20}
                    height={20}
                    style={styles.socialIcon}
                  />
                  <Text style={styles.socialButtonText}>Google</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.termsText}>
                By signing in to Duolingo, you agree to our{" "}
                <Text
                  style={styles.linkTextBold}
                  onPress={() =>
                    Linking.openURL(
                      "https://www.duolingo.com/terms?wantsPlainInfo=1"
                    )
                  }
                >
                  Terms
                </Text>{" "}
                and{" "}
                <Text
                  style={styles.linkTextBold}
                  onPress={() =>
                    Linking.openURL(
                      "https://www.duolingo.com/privacy?wantsPlainInfo=1"
                    )
                  }
                >
                  Privacy Policy
                </Text>
                .
              </Text>
              <Text style={styles.termsText}>
                This site is protected by reCAPTCHA Enterprise and the Google{" "}
                <Text
                  style={styles.linkTextBold}
                  onPress={() =>
                    Linking.openURL("https://policies.google.com/privacy")
                  }
                >
                  Privacy Policy
                </Text>{" "}
                and{" "}
                <Text
                  style={styles.linkTextBold}
                  onPress={() =>
                    Linking.openURL("https://policies.google.com/terms")
                  }
                >
                  Terms of Service
                </Text>{" "}
                apply.
              </Text>

              <Text style={styles.mobileToggleAuthText}>
                <Text style={styles.mobileToggleAuthQuestion}>
                  {loginScreenState === "LOGIN"
                    ? "Don't have an account?"
                    : "Have an account?"}
                </Text>{" "}
                <TouchableOpacity
                  onPress={() =>
                    setLoginScreenState((x) =>
                      x === "LOGIN" ? "SIGNUP" : "LOGIN"
                    )
                  }
                >
                  <Text style={styles.mobileToggleAuthButtonText}>
                    {loginScreenState === "LOGIN" ? "sign up" : "log in"}
                  </Text>
                </TouchableOpacity>
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // Nền mờ khi modal hiện
    justifyContent: "center",
    alignItems: "center",
  },
  hiddenOverlay: {
    display: "none", // Ẩn hoàn toàn khi loginScreenState là HIDDEN
  },
  container: {
    width: "90%", // Chiếm 90% chiều rộng màn hình
    maxWidth: 400, // Giới hạn chiều rộng tối đa cho màn hình lớn
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
    maxHeight: "90%", // Giới hạn chiều cao cho màn hình nhỏ
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  closeButton: {
    padding: 5,
    color: "#9CA3AF", // gray-400
  },
  srOnly: {
    position: "absolute", // sr-only
    width: 1,
    height: 1,
    overflow: "hidden",
    // ... thêm các thuộc tính khác để ẩn khỏi màn hình nhưng vẫn có cho screen readers
  },
  toggleAuthButton: {
    borderRadius: 16, // rounded-2xl
    borderWidth: 2,
    borderBottomWidth: 4, // border-b-4
    borderColor: "#E5E7EB", // gray-200
    paddingHorizontal: 16, // px-4
    paddingVertical: 12, // py-3
    // hidden sm:block -> chỉ hiển thị trên màn hình lớn, cần Responsive hook hoặc Platform.OS
    // Hiện tại, tôi sẽ không ẩn nó cho mobile để demo
  },
  toggleAuthButtonText: {
    fontSize: 14, // text-sm
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#60A5FA", // blue-400 (hover:brightness-90 không có trong RN)
  },
  contentArea: {
    flexGrow: 1,
    justifyContent: "center",
  },
  formContainer: {
    width: "100%",
    flexDirection: "column",
    gap: 20, // gap-5
  },
  title: {
    textAlign: "center",
    fontSize: 24, // text-2xl
    fontWeight: "bold",
    color: "#4B5563", // gray-800
    marginBottom: 10,
  },
  inputGroup: {
    flexDirection: "column",
    gap: 8, // gap-2
    color: "#000000",
  },
  inputWrapper: {
    position: "relative",
    flexDirection: "row", // Để input và icon nằm cạnh nhau
    alignItems: "center",
  },
  textInput: {
    flexGrow: 1,
    borderRadius: 16, // rounded-2xl
    borderWidth: 2,
    borderColor: "#E5E7EB", // gray-200
    backgroundColor: "#F9FAFB", // gray-50
    paddingHorizontal: 16, // px-4
    paddingVertical: 12, // py-3
    color: "#333",
  },
  tooltipIconContainer: {
    position: "absolute",
    right: 10,
    height: "100%", // Để căn giữa theo chiều dọc
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 10, // pr-4
    zIndex: 1, // Để tooltip hiện lên trên
  },
  tooltipIcon: {
    height: 24, // h-6
    width: 24, // w-6
    borderRadius: 12, // rounded-full
    borderWidth: 2,
    borderColor: "#E5E7EB", // gray-200
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF", // bg-white
  },
  tooltipIconText: {
    color: "#9CA3AF", // text-gray-400
    fontWeight: "bold",
  },
  ageTooltip: {
    position: "absolute",
    // -right-5 -> cần điều chỉnh vị trí cho RN
    right: -50, // Điều chỉnh cho phù hợp
    top: "100%", // top-full
    zIndex: 10,
    width: 288, // w-72
    borderRadius: 16, // rounded-2xl
    borderWidth: 2,
    borderColor: "#E5E7EB", // gray-200
    backgroundColor: "#FFFFFF",
    padding: 16, // p-4
    textAlign: "center",
  },
  ageTooltipText: {
    fontSize: 10, // text-xs
    lineHeight: 18, // leading-5
    color: "#4B5563", // gray-800
    textAlign: "center",
  },
  forgotPasswordButton: {
    position: "absolute",
    right: 10,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 10, // pr-5
  },
  forgotPasswordText: {
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#9CA3AF", // gray-400
  },
  primaryButton: {
    borderRadius: 16, // rounded-2xl
    borderBottomWidth: 4, // border-b-4
    borderColor: "#3B82F6", // blue-500
    backgroundColor: "#60A5FA", // blue-400
    paddingVertical: 12, // py-3
    alignItems: "center",
  },
  primaryButtonText: {
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#FFFFFF",
    fontSize: 16,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8, // gap-2
  },
  dividerLine: {
    height: 2, // h-[2px]
    flexGrow: 1,
    backgroundColor: "#D1D5DB", // gray-300
  },
  dividerText: {
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#9CA3AF", // gray-400
  },
  socialButtonsContainer: {
    flexDirection: "row",
    gap: 20, // gap-5
    justifyContent: "space-between",
  },
  socialButton: {
    flex: 1, // w-full
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8, // gap-2
    borderRadius: 16, // rounded-2xl
    borderWidth: 2,
    borderBottomWidth: 4, // border-b-4
    borderColor: "#E5E7EB", // gray-200
    paddingVertical: 12, // py-3
  },
  socialIcon: {
    // h-5 w-5 được đặt trong Svg component props
  },
  socialButtonText: {
    fontWeight: "bold",
    color: "#1E3A8A", // blue-900 (Facebook) / #2563EB (Google)
  },
  termsText: {
    textAlign: "center",
    fontSize: 10, // text-xs
    lineHeight: 18, // leading-5
    color: "#9CA3AF", // gray-400
    marginBottom: 5,
  },
  linkText: {
    color: "#1D4ED8", // blue-700
  },
  linkTextBold: {
    fontWeight: "bold",
  },
  mobileToggleAuthText: {
    // block sm:hidden -> chỉ hiển thị trên mobile
    // Hiện tại, tôi sẽ không ẩn nó cho mobile để demo
    textAlign: "center",
    // ...
  },
  mobileToggleAuthQuestion: {
    fontSize: 14, // text-sm
    fontWeight: "bold",
    color: "#4B5563", // gray-700
  },
  mobileToggleAuthButtonText: {
    fontSize: 14, // text-sm
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#60A5FA", // blue-400
  },
});

export default LoginScreen;
