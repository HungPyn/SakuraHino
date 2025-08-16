import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseApi } from "./baseAPI";
import axios from "axios";

export interface Result {
  lessonCode: string; // mã bài học
  score: number; // điểm
  totalQuestion: number; // tổng số câu hỏi
  correctCount: number; // số câu đúng
  wrongCount: number; // số câu sai
  durationSeconds: number; // thời gian làm bài (tính bằng giây)
}

const getQuestion = async (lessonCode: string) => {
  // const token = await AsyncStorage.getItem("token");
  const token = await AsyncStorage.getItem("token");
  console.log("Token retrieved from AsyncStorage:", token);
  if (!token) {
    console.error("Token not found in AsyncStorage");
    return [];
  }
  try {
    const response = await axios.get(
      `${baseApi}/api/learning/user/questions/lesson/${lessonCode}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data || [];
  } catch (error) {
    console.error("Lỗi khi gọi api lấy question:", error);
    return [];
  }
};
const createResult = async (result: Result) => {
  // const token = await AsyncStorage.getItem("token");
  const token = await AsyncStorage.getItem("token");
  console.log("Token retrieved from AsyncStorage:", token);
  if (!token) {
    console.error("Token not found in AsyncStorage");
    return [];
  }
  try {
    const response = await axios.post(
      `${baseApi}/api/learning/user/results/lesson`,
      result,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data || [];
  } catch (error) {
    console.error("Lỗi khi gọi thêm kết quả lesson:", error);
    return [];
  }
};
export default {
  getQuestion,
  createResult,
};
