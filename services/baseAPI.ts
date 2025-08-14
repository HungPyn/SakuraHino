import { Platform } from "react-native";
// Địa chỉ IP của máy tính bạn (đã lấy được từ ipconfig)
const LOCAL_IP = "192.168.100.94";
const PORT = "8080";

let baseApi = "";

if (Platform.OS === "android") {
  // Trình giả lập Android
  baseApi = `http://10.0.2.2:${PORT}`;
} else if (Platform.OS === "ios") {
  // Trình giả lập iOS
  baseApi = `http://localhost:${PORT}`;
} else {
  // Các trường hợp khác (web, điện thoại thật)
  baseApi = `http://${LOCAL_IP}:${PORT}`;
}

export default baseApi;
