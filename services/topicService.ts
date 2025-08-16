import AsyncStorage from "@react-native-async-storage/async-storage";
import baseApi from "./baseAPI";
import axios from "axios";

const getTopics = async () => {
  // const token = await AsyncStorage.getItem("token");
  const token =
    "eyJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3NTUzMTQ4MTcsImV4cCI6MTc1NTQwMTIxNywidXNlcklkIjoiNmU3NjkwNGMtZDI3NS00MWExLWEyNzUtZDUwMDM1ZGZhNTBkIiwicm9sZSI6IlVTRVIifQ.qinJZlhL5wBkgjPXItRX6uO3reXdOKSuPs930uRhAi14zqZB-RnXjpytgQN9ObWiS-AQ6HRucQDbZkWwuy_NfA";
  try {
    const response = await axios.get(`${baseApi}/api/learning/user/topics`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data || [];
  } catch (error) {
    console.error("Lỗi khi gọi api lấy topics:", error);
    return [];
  }
};
export default {
  getTopics,
};
