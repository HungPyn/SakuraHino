import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { baseTopicApi } from "./baseAPI";

const getTopStreakUsers = async () => {
  const token = await AsyncStorage.getItem("token");
  console.log("Token retrieved from AsyncStorage:", token);
  if (!token) {
    console.error("Token not found in AsyncStorage");
    return [];
  }
  try {
    const response = await axios.get(`${baseTopicApi}/api/users/user/streaks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log("dữ liệu người dùng getTopStreakUsers:", response.data);

    return response.data.data || [];
  } catch (error) {
    console.error("Lỗi khi gọi api lấy user:", error);
    return [];
  }
};
const getTopExpUsers = async () => {
  const token = await AsyncStorage.getItem("token");
  console.log("Token retrieved from AsyncStorage:", token);
  if (!token) {
    console.error("Token not found in AsyncStorage");
    return [];
  }
  try {
    const response = await axios.get(`${baseTopicApi}/api/users/user/streaks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log("dữ liệu người dùng getTopStreakUsers:", response.data);

    return response.data.data || [];
  } catch (error) {
    console.error("Lỗi khi gọi api lấy user:", error);
    return [];
  }
};
export default {
  getTopStreakUsers,
  getTopExpUsers,
};
