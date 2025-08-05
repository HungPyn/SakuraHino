// src/services/lessonService.js

import baseApi from "@/api/baseApi";
import axios from "axios";

const baseUrl = baseApi.main;
const lessonService = {
  getLessons: async (topicId, page = 0, size = 10) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${baseUrl}/api/learning/admin/lessons`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            topicId,
            page,
            size,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách lesson:", error);
      throw error;
    }
  },
};

export default lessonService;
