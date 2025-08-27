import React, { useEffect, useState } from "react";
import {
  loginWithUsernamePassword,
  registerWithUsernamePassword,
} from "../../services/authService";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
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
import { GoogleLogoSvg } from "../../components/Svgs";
import type { RootStackParamList } from "../../types/navigatorType";

import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import axios from "axios";
import { baseAuthApi } from "../../services/baseAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { changePassword, getCode } from "../../services/authService";
import Toast from "react-native-toast-message";

// Cập nhật kiểu LoginScreenState để loại bỏ trạng thái "HIDDEN"
export type LoginScreenState =
  | "LOGIN"
  | "SIGNUP"
  | "FORGOT_PASSWORD"
  | "CHANGE_PASSWORD";

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
  const loggedIn = useBoundStore((x) => x.loggedIn);

  // Logic hiển thị ban đầu
  const queryState: LoginScreenState = (() => {
    // Nếu người dùng đã đăng nhập, đẩy họ về màn hình chính
    if (loggedIn) {
      // Vì đây là logic để chuyển hướng, chúng ta không cần state 'HIDDEN' nữa
      // Logic này sẽ được xử lý ở navigation chính
    }
    if (route.params?.login) return "LOGIN";
    if (route.params?.["sign-up"]) return "SIGNUP";
    return "LOGIN";
  })();

  const [loginScreenState, setLoginScreenState] =
    useState<LoginScreenState>(queryState);

  // useEffect để cập nhật trạng thái khi params thay đổi
  useEffect(() => {
    if (route.params?.login) {
      setLoginScreenState("LOGIN");
    }
    if (route.params?.["sign-up"]) {
      setLoginScreenState("SIGNUP");
    }
  }, [route.params]);

  return { loginScreenState, setLoginScreenState };
};

export const LoginScreen = () => {
  const { loginScreenState, setLoginScreenState } = useLoginScreen();
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const loggedIn = useBoundStore((x) => x.loggedIn);
  const logIn = useBoundStore((x) => x.logIn);
  const setUsername1 = useBoundStore((x) => x.setUsername);
  const setName = useBoundStore((x) => x.setName);

  const [email, setEmail] = useState("");
  const [name, setNameInput] = useState("");
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  // Hàm xử lý khi gửi token đến backend
  const sendGoogleTokenToBackend = async (idToken: string) => {
    try {
      const backendResponse = await axios.post(
        `${baseAuthApi}/api/auth/google`,
        {
          idToken,
        }
      );

      const data = backendResponse.data;

      if (backendResponse.status === 200) {
        console.log("Backend response:", data);
        setUsername1(name.trim() || Math.random().toString().slice(2));
        setName(name.trim() || Math.random().toString().slice(2));
        logIn();
        AsyncStorage.setItem("token", data.appToken);
        console.log("User logged in successfully with Google");
        navigation.dispatch(StackActions.replace("LearningPathScreen"));
      } else {
        console.error("Backend authentication failed:", data.error);
        alert(`Authentication failed: ${data.error}`);
      }
    } catch (error: any) {
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

      if (userInfo.data && userInfo.data.idToken) {
        sendGoogleTokenToBackend(userInfo.data.idToken);
        console.log("id gửi cho backend là:", userInfo.data.idToken);
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

  // Đăng nhập qua API
  const handleLogin = async () => {
    if (!emailOrUsername || !password) {
      alert("Vui lòng nhập đầy đủ thông tin đăng nhập.");
      return;
    }
    const res = await loginWithUsernamePassword(emailOrUsername, password);
    if (res.success) {
      setUsername1(emailOrUsername);
      setName(name.trim() || emailOrUsername);
      logIn();
      navigation.dispatch(StackActions.replace("LearningPathScreen"));
    } else {
      alert(res.error || "Đăng nhập thất bại.");
    }
  };

  // Đăng ký qua API
  const handleRegister = async () => {
    if (!emailOrUsername || !password) {
      alert("Vui lòng nhập đầy đủ thông tin đăng ký.");
      return;
    }
    const res = await registerWithUsernamePassword(
      emailOrUsername,
      password,
      name,
      email
    );
    if (res.success) {
      setUsername1(emailOrUsername);
      setName(name.trim() || emailOrUsername);
      logIn();
      navigation.dispatch(StackActions.replace("LearningPathScreen"));
    } else {
      alert(res.error || "Đăng ký thất bại.");
    }
  };

  // Hàm xử lý khi người dùng nhập username và nhấn "Lấy mã"
  const handleForgotPasswordSubmit = async () => {
    if (!forgotPasswordEmail) {
      alert("Vui lòng nhập tên đăng nhập.");
      return;
    }
    const response = await getCode(forgotPasswordEmail);
    if (response) {
      Toast.show({
        type: "success",
        text1: "Đã gửi mã!",
        position: "top",
        visibilityTime: 1000,
      });
      setLoginScreenState("CHANGE_PASSWORD");
    }
  };

  // Hàm xử lý khi người dùng đổi mật khẩu thành công
  const handleChangePassword = async () => {
    if (!verificationCode || !newPassword || !confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Vui lòng nhập đầy đủ thông tin.",
        position: "top",
        visibilityTime: 1000,
      });
      return;
    }
    if (newPassword.length < 8) {
      Toast.show({
        type: "error",
        text1: "Mật khẩu phải có ít nhất 8 ký tự.",
        position: "top",
        visibilityTime: 1000,
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Mật khẩu mới và mật khẩu xác nhận không khớp.",
        position: "top",
        visibilityTime: 1000,
      });
      return;
    }

    const response = await changePassword(
      forgotPasswordEmail,
      newPassword,
      confirmPassword,
      verificationCode
    );
    if (response.error === "OK" && response.data != null) {
      Toast.show({
        type: "success",
        text1: "Đổi mật khẩu thành công!",
        position: "top",
        visibilityTime: 1000,
      });

      setLoginScreenState("LOGIN");
      setForgotPasswordEmail("");
      setNewPassword("");
      setConfirmPassword("");
      setVerificationCode("");
    } else {
      Toast.show({
        type: "error",
        text1: response.error || "Đổi mật khẩu thất bại.",
        position: "top",
        visibilityTime: 1000,
      });
    }
  };

  const navigateToLogin = () => {
    setLoginScreenState("LOGIN");
    setEmailOrUsername("");
    setPassword("");
    setEmail("");
    setNameInput("");
    setForgotPasswordEmail("");
    setNewPassword("");
    setConfirmPassword("");
    setVerificationCode("");
  };

  const navigateToSignup = () => {
    setLoginScreenState("SIGNUP");
    setEmailOrUsername("");
    setPassword("");
    setEmail("");
    setNameInput("");
    setForgotPasswordEmail("");
    setNewPassword("");
    setConfirmPassword("");
    setVerificationCode("");
  };

  // Thay thế Modal bằng View và áp dụng style FullScreen
  return (
    <View style={styles.fullScreenContainer}>
      <View style={styles.contentArea}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>
            {loginScreenState === "LOGIN"
              ? "Log in"
              : loginScreenState === "SIGNUP"
                ? "Create your profile"
                : loginScreenState === "FORGOT_PASSWORD"
                  ? "Quên mật khẩu?"
                  : "Đổi mật khẩu"}
          </Text>

          {loginScreenState === "LOGIN" && (
            <>
              <View style={styles.inputGroup}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Username"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={emailOrUsername}
                  onChangeText={setEmailOrUsername}
                />
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Password"
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
                onPress={handleLogin}
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
                    placeholder="Username (required)"
                    value={emailOrUsername}
                    onChangeText={setEmailOrUsername}
                  />
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="Name (required)"
                  value={name}
                  onChangeText={setNameInput}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Email (required)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Password (required)"
                  secureTextEntry={true}
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleRegister}
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
                Nhập username để lấy mã xác nhận về email
              </Text>
              <View style={styles.inputGroup}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Username"
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
                <Text style={styles.primaryButtonText}>Lấy mã</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={navigateToLogin}
              >
                <Text style={styles.secondaryButtonText}>Trở về đăng nhập</Text>
              </TouchableOpacity>
            </>
          )}

          {loginScreenState === "CHANGE_PASSWORD" && (
            <>
              <Text style={styles.infoText}>
                Vui lòng nhập mã xác nhận và mật khẩu mới để tiếp tục.
              </Text>
              <View style={styles.inputGroup}>
                <TextInput
                  style={[styles.textInput, styles.disabledInput]}
                  placeholder="Username"
                  value={forgotPasswordEmail}
                  editable={false}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Mã xác nhận (Code)"
                  keyboardType="numeric"
                  value={verificationCode}
                  onChangeText={setVerificationCode}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Mật khẩu mới"
                  secureTextEntry={true}
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Xác nhận mật khẩu mới"
                  secureTextEntry={true}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleChangePassword}
              >
                <Text style={styles.primaryButtonText}>Đổi mật khẩu</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={navigateToLogin}
              >
                <Text style={styles.secondaryButtonText}>Trở về đăng nhập</Text>
              </TouchableOpacity>
            </>
          )}

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

          {loginScreenState !== "FORGOT_PASSWORD" &&
            loginScreenState !== "CHANGE_PASSWORD" && (
              <View style={styles.mobileToggleAuthText}>
                <Text style={styles.mobileToggleAuthQuestion}>
                  {loginScreenState === "LOGIN"
                    ? "Don't have an account? "
                    : "Have an account? "}
                </Text>
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
              </View>
            )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Thêm style mới để chiếm toàn màn hình
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  // Chỉnh sửa style container cũ để phù hợp với màn hình mới
  container: {
    width: "100%", // Chiếm toàn bộ chiều rộng có thể
    maxWidth: 400, // Vẫn giữ giới hạn chiều rộng
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
  contentArea: {
    flexGrow: 1,
    justifyContent: "center",
    width: "100%", // Đảm bảo nội dung chiếm toàn bộ chiều rộng
  },
  formContainer: {
    width: "100%",
    flexDirection: "column",
    gap: 20,
    color: "#000000",
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
  linkTextBold: {
    fontWeight: "bold",
  },
  mobileToggleAuthText: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
  disabledInput: {
    backgroundColor: "#E5E7EB",
    color: "#9CA3AF",
  },
});

export default LoginScreen;
