import AsyncStorage from "@react-native-async-storage/async-storage";
import baseApi from "./baseAPI";
import axios from "axios";

const getTopics = async () => {
  // const token = await AsyncStorage.getItem("token");
  const token =
    "eyJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3NTUyMjgyMDcsImV4cCI6MTc1NTMxNDYwNywidXNlcklkIjoiNmU3NjkwNGMtZDI3NS00MWExLWEyNzUtZDUwMDM1ZGZhNTBkIiwicm9sZSI6IlVTRVIifQ.wnOm3ZRcGSESJXsQMr_m8khgMV6r6lGvq6vOrf8dXN40E2I7S7JEJgraPcwT12txXxRI8NZdy6-wsr91TkI22Q";
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
