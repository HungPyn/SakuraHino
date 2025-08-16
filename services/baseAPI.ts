import { Platform } from "react-native";
// Địa chỉ IP của máy tính bạn (đã lấy được từ ipconfig)
const LOCAL_IP = "192.168.100.94";
const AUTH_PORT = "8080";
const USER_PORT = "8080";
const TOPIC_PORT = "8080";
function getBaseApi(port: string) {
  if (Platform.OS === "android") {
    return `http://10.0.2.2:${port}`;
  } else if (Platform.OS === "ios") {
    return `http://localhost:${port}`;
  } else {
    return `http://${LOCAL_IP}:${port}`;
  }
}

export const baseAuthApi = getBaseApi(AUTH_PORT);
export const baseTopicApi = getBaseApi(TOPIC_PORT);
export const baseUserApi = getBaseApi(USER_PORT);
//dung chung
export const baseApi = getBaseApi(TOPIC_PORT);
