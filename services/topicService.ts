import AsyncStorage from "@react-native-async-storage/async-storage";
import baseApi from "./baseAPI";
import axios from "axios";

const getTopics = async () => {
  // const token = await AsyncStorage.getItem("token");
  const token =
    "eyJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3NTUxMDEyMTAsImV4cCI6MTc1NTE4NzYxMCwidXNlcklkIjoiNmU3NjkwNGMtZDI3NS00MWExLWEyNzUtZDUwMDM1ZGZhNTBkIiwicm9sZSI6IlVTRVIifQ.ylu2oL8nDK6avZDnwrvgulfqK0zc_NN-HeLwLo6RcP-h9SfJghOoVMhGWJ2cFyybAsgMwJrN9L_DhlRO_RlI6A";
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
