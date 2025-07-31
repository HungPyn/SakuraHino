import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Linking,
  Platform,
} from "react-native";
import {
  useNavigation,
  useRoute,
  StackActions,
} from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useBoundStore } from "../../hooks/useBoundStore";
import {
  CloseSvg,
  FacebookLogoSvg,
  GoogleLogoSvg,
} from "../../components/Svgs";
import type { RootStackParamList } from "../../types/navigatorType";

// Cập nhật kiểu LoginScreenState để thêm trạng thái "FORGOT_PASSWORD"
export type LoginScreenState = "HIDDEN" | "LOGIN" | "SIGNUP" | "FORGOT_PASSWORD";

type LoginScreenRouteProp = NativeStackScreenProps<
  RootStackParamList,
  "Login"
>["route"];
type LoginScreenNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "Login"
>["navigation"];

export const useLoginScreen = () => {
  const route = useRoute<LoginScreenRouteProp>();
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const loggedIn = useBoundStore((x) => x.loggedIn);

  const queryState: LoginScreenState = (() => {
    if (loggedIn) return "HIDDEN";
    if (route.params?.login) return "LOGIN";
    if (route.params?.["sign-up"]) return "SIGNUP";
    return "HIDDEN";
  })();

  const [loginScreenState, setLoginScreenState] = useState(queryState);

  useEffect(() => {
    setLoginScreenState(queryState);
  }, [queryState]);

  useEffect(() => {
    if (loginScreenState !== "HIDDEN" && loggedIn) {
      setLoginScreenState("HIDDEN");
    }
  }, [loginScreenState, loggedIn, setLoginScreenState, navigation]);

  return { loginScreenState, setLoginScreenState };
};

// --- Component LoginScreen ---
export const LoginScreen = () => {
  const { loginScreenState, setLoginScreenState } = useLoginScreen();

  const navigation = useNavigation<LoginScreenNavigationProp>();
  const loggedIn = useBoundStore((x) => x.loggedIn);
  const logIn = useBoundStore((x) => x.logIn);
  const setUsername = useBoundStore((x) => x.setUsername);
  const setName = useBoundStore((x) => x.setName);

  const [ageTooltipShown, setAgeTooltipShown] = useState(false);

  const [age, setAge] = useState("");
  const [name, setNameInput] = useState("");
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  // Thêm state mới cho email khi quên mật khẩu
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");

  const logInAndSetUserProperties = () => {
    const finalName = name.trim() || Math.random().toString().slice(2);
    const username = finalName.replace(/ +/g, "-");
    setUsername(username);
    setName(finalName);
    logIn();
    navigation.dispatch(StackActions.replace("LearningPathScreen"));
  };

  // Hàm xử lý khi gửi yêu cầu quên mật khẩu
  const handleForgotPasswordSubmit = () => {
    // Đây là nơi bạn sẽ gọi API hoặc thực hiện logic gửi email đặt lại mật khẩu
    console.log("Gửi yêu cầu đặt lại mật khẩu cho email:", forgotPasswordEmail);
    // Sau khi xử lý, bạn có thể thông báo thành công và chuyển về màn hình đăng nhập
    alert("Yêu cầu đặt lại mật khẩu đã được gửi!");
    setLoginScreenState("LOGIN"); // Chuyển về màn hình đăng nhập
    setForgotPasswordEmail(""); // Xóa email đã nhập
  };

  // Hàm để chuyển trạng thái về màn hình đăng nhập
  const navigateToLogin = () => {
    setLoginScreenState("LOGIN");
    // Xóa các trường nhập liệu cũ khi chuyển giữa các form
    setEmailOrUsername("");
    setPassword("");
    setAge("");
    setNameInput("");
    setForgotPasswordEmail("");
  };

  // Hàm để chuyển trạng thái về màn hình đăng ký
  const navigateToSignup = () => {
    setLoginScreenState("SIGNUP");
    // Xóa các trường nhập liệu cũ khi chuyển giữa các form
    setEmailOrUsername("");
    setPassword("");
    setAge("");
    setNameInput("");
    setForgotPasswordEmail("");
  };

  return (
    <Modal
      visible={loginScreenState !== "HIDDEN"}
      transparent={true}
      animationType="slide"
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
            {/* Ẩn nút chuyển đổi nếu đang ở màn hình quên mật khẩu */}
            {loginScreenState !== "FORGOT_PASSWORD" && (
              <TouchableOpacity
                style={styles.toggleAuthButton}
                onPress={() =>
                  setLoginScreenState((x) =>
                    x === "LOGIN" ? "SIGNUP" : "LOGIN"
                  )
                }
              >
                <Text style={styles.toggleAuthButtonText}>
                  {loginScreenState === "LOGIN" ? "Sign up" : "Login"}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.contentArea}>
            <View style={styles.formContainer}>
              <Text style={styles.title}>
                {loginScreenState === "LOGIN"
                  ? "Log in"
                  : loginScreenState === "SIGNUP"
                  ? "Create your profile"
                  : "Forgot password?" // Tiêu đề cho màn hình quên mật khẩu
                }
              </Text>

              {/* Logic hiển thị form dựa trên loginScreenState */}
              {loginScreenState === "LOGIN" && (
                <>
                  <View style={styles.inputGroup}>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Email or username (optional)"
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
                      {/* Thay đổi action của nút "Forgot?" */}
                      <TouchableOpacity
                        style={styles.forgotPasswordButton}
                        onPress={() => setLoginScreenState("FORGOT_PASSWORD")} // Chuyển sang trạng thái quên mật khẩu
                      >
                        <Text style={styles.forgotPasswordText}>Forgot?</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={logInAndSetUserProperties}
                  >
                    <Text style={styles.primaryButtonText}>Log in</Text>
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
                </>
              )}

              {loginScreenState === "SIGNUP" && (
                <>
                  <View style={styles.inputGroup}>
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
                              <Text style={styles.linkText}>
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
                    <TextInput
                      style={styles.textInput}
                      placeholder="Email (optional)"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={emailOrUsername}
                      onChangeText={setEmailOrUsername}
                    />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Password (optional)"
                      secureTextEntry={true}
                      value={password}
                      onChangeText={setPassword}
                    />
                  </View>

                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={logInAndSetUserProperties}
                  >
                    <Text style={styles.primaryButtonText}>
                      Create account
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
                </>
              )}

              {loginScreenState === "FORGOT_PASSWORD" && (
                <>
                  <Text style={styles.infoText}>
                    Enter the email associated with your account to reset your password.
                  </Text>
                  <View style={styles.inputGroup}>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Email"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={forgotPasswordEmail}
                      onChangeText={setForgotPasswordEmail}
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleForgotPasswordSubmit}
                  >
                    <Text style={styles.primaryButtonText}>Reset Password</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.secondaryButton} // Thêm style mới cho nút quay lại
                    onPress={navigateToLogin}
                  >
                    <Text style={styles.secondaryButtonText}>Back to Login</Text>
                  </TouchableOpacity>
                </>
              )}

              {/* Footer text: Terms and Privacy (Hiển thị cho cả Login và Signup) */}
              {(loginScreenState === "LOGIN" || loginScreenState === "SIGNUP") && (
                <>
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
                </>
              )}

              {/* Nút chuyển đổi đăng nhập/đăng ký ở cuối màn hình (Ẩn khi ở Forgot Password) */}
              {loginScreenState !== "FORGOT_PASSWORD" && (
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
              )}
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
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  hiddenOverlay: {
    display: "none",
  },
  container: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
    maxHeight: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  closeButton: {
    padding: 5,
    color: "#9CA3AF",
  },
  srOnly: {
    position: "absolute",
    width: 1,
    height: 1,
    overflow: "hidden",
  },
  toggleAuthButton: {
    borderRadius: 16,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  toggleAuthButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#60A5FA",
  },
  contentArea: {
    flexGrow: 1,
    justifyContent: "center",
  },
  formContainer: {
    width: "100%",
    flexDirection: "column",
    gap: 20,
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "#4B5563",
    marginBottom: 10,
  },
  inputGroup: {
    flexDirection: "column",
    gap: 8,
    color: "#000000",
  },
  inputWrapper: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
  },
  textInput: {
    flexGrow: 1,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#333",
  },
  tooltipIconContainer: {
    position: "absolute",
    right: 10,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 10,
    zIndex: 1,
  },
  tooltipIcon: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  tooltipIconText: {
    color: "#9CA3AF",
    fontWeight: "bold",
  },
  ageTooltip: {
    position: "absolute",
    right: -50,
    top: "100%",
    zIndex: 10,
    width: 288,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    padding: 16,
    textAlign: "center",
  },
  ageTooltipText: {
    fontSize: 10,
    lineHeight: 18,
    color: "#4B5563",
    textAlign: "center",
  },
  forgotPasswordButton: {
    position: "absolute",
    right: 10,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 10,
  },
  forgotPasswordText: {
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#9CA3AF",
  },
  primaryButton: {
    borderRadius: 16,
    borderBottomWidth: 4,
    borderColor: "#3B82F6",
    backgroundColor: "#60A5FA",
    paddingVertical: 12,
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
    gap: 8,
  },
  dividerLine: {
    height: 2,
    flexGrow: 1,
    backgroundColor: "#D1D5DB",
  },
  dividerText: {
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#9CA3AF",
  },
  socialButtonsContainer: {
    flexDirection: "row",
    gap: 20,
    justifyContent: "space-between",
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 16,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: "#E5E7EB",
    paddingVertical: 12,
  },
  socialIcon: {},
  socialButtonText: {
    fontWeight: "bold",
    color: "#1E3A8A",
  },
  termsText: {
    textAlign: "center",
    fontSize: 10,
    lineHeight: 18,
    color: "#9CA3AF",
    marginBottom: 5,
  },
  linkText: {
    color: "#1D4ED8",
  },
  linkTextBold: {
    fontWeight: "bold",
  },
  mobileToggleAuthText: {
    textAlign: "center",
  },
  mobileToggleAuthQuestion: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4B5563",
  },
  mobileToggleAuthButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#60A5FA",
  },
  // Style mới cho màn hình quên mật khẩu
  infoText: {
    textAlign: "center",
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 15,
  },
  secondaryButton: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#60A5FA", // Màu xanh dương nhạt hơn
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10, // Khoảng cách với nút primary
  },
  secondaryButtonText: {
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#60A5FA",
    fontSize: 16,
  },
});

export default LoginScreen;