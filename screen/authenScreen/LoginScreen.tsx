import React, { useEffect, useState } from "react";
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

// Import thư viện Google Sign-In mới
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";

// Cập nhật kiểu LoginScreenState để thêm trạng thái "FORGOT_PASSWORD"
export type LoginScreenState =
  | "HIDDEN"
  | "LOGIN"
  | "SIGNUP"
  | "FORGOT_PASSWORD";

type LoginScreenRouteProp = NativeStackScreenProps<
  RootStackParamList,
  "Login"
>["route"];
type LoginScreenNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "Login"
>["navigation"];

GoogleSignin.configure({
  webClientId:
    "103578990825-t1jcgd55oplasdnd6jvb7plp054o8hdn.apps.googleusercontent.com",
});

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
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");

  // Hàm xử lý khi gửi token đến backend
  const sendGoogleTokenToBackend = async (idToken: string) => {
    try {
      // Thay thế URL này bằng API endpoint của backend của bạn
      const backendResponse = await fetch(
        "https://your-backend-api.com/auth/google",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idToken }), // Gửi idToken trong body
        }
      );

      const data = await backendResponse.json();

      if (backendResponse.ok) {
        console.log("Backend response:", data);
        logInAndSetUserProperties();
      } else {
        console.error("Backend authentication failed:", data.error);
        alert(`Authentication failed: ${data.error}`);
      }
    } catch (error) {
      console.error("Error sending token to backend:", error);
      alert("Something went wrong with authentication.");
    }
  };

  // Hàm xử lý đăng nhập Google
  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log("Google user info:", userInfo);

      // Gửi idToken đến backend để xác thực
      if (userInfo.idToken) {
        sendGoogleTokenToBackend(userInfo.idToken);
      } else {
        console.error("No idToken received.");
        alert("Google login failed. Please try again.");
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("User cancelled the login flow");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("Operation (e.g. sign in) is already in progress");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log("Play services not available or outdated");
      } else {
        console.error("Google Sign-In error:", error);
        alert("Google login failed. Please try again.");
      }
    }
  };

  const logInAndSetUserProperties = () => {
    const finalName = name.trim() || Math.random().toString().slice(2);
    const username = finalName.replace(/ +/g, "-");
    setUsername(username);
    setName(finalName);
    logIn();
    navigation.dispatch(StackActions.replace("LearningPathScreen"));
  };

  const handleForgotPasswordSubmit = () => {
    console.log("Gửi yêu cầu đặt lại mật khẩu cho email:", forgotPasswordEmail);
    alert("Yêu cầu đặt lại mật khẩu đã được gửi!");
    setLoginScreenState("LOGIN");
    setForgotPasswordEmail("");
  };

  const navigateToLogin = () => {
    setLoginScreenState("LOGIN");
    setEmailOrUsername("");
    setPassword("");
    setAge("");
    setNameInput("");
    setForgotPasswordEmail("");
  };

  const navigateToSignup = () => {
    setLoginScreenState("SIGNUP");
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
                  : "Forgot password?"}
              </Text>

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
                      <TouchableOpacity
                        style={styles.forgotPasswordButton}
                        onPress={() => setLoginScreenState("FORGOT_PASSWORD")}
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
                      onPress={handleGoogleSignIn}
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
                    <Text style={styles.primaryButtonText}>Create account</Text>
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
                      onPress={handleGoogleSignIn}
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
                    Enter the email associated with your account to reset your
                    password.
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
                    style={styles.secondaryButton}
                    onPress={navigateToLogin}
                  >
                    <Text style={styles.secondaryButtonText}>
                      Back to Login
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              {(loginScreenState === "LOGIN" ||
                loginScreenState === "SIGNUP") && (
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
                    This site is protected by reCAPTCHA Enterprise and the
                    Google{" "}
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
  infoText: {
    textAlign: "center",
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 15,
  },
  secondaryButton: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#60A5FA",
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
  },
  secondaryButtonText: {
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#60A5FA",
    fontSize: 16,
  },
});

export default LoginScreen;
