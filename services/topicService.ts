import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseTopicApi } from "./baseAPI";
import axios from "axios";

const getTopics = async () => {
  const token = await AsyncStorage.getItem("token");
  console.log("Token retrieved from AsyncStorage:", token);
  if (!token) {
    console.error("Token not found in AsyncStorage");
    return [];
  }
  try {
    const response = await axios.get(
      `${baseTopicApi}/api/learning/user/topics`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Response from getTopics:", response.data);

    return response.data.data || [];
  } catch (error) {
    console.error("Lỗi khi gọi api lấy topics:", error);
    return [];
  }
};
export default {
  getTopics,
};
