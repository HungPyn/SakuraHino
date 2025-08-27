// src/services/lessonService.js

import baseApi from "@/api/baseApi";
import axios from "axios";
import { useToast } from "vue-toastification";

const toast = useToast();

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

  deleteLesson: async (lessonId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.patch(
        `${baseUrl}/api/learning/admin/lessons/${lessonId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Lỗi khi xóa lesson:", error);
      throw error;
    }
  },

  addLesson: async (newLesson) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${baseUrl}/api/learning/admin/lessons`,
        newLesson,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Lỗi khi thêm lesson:", error);
      throw error;
    }
  },
  updateLesson: async (id, newLesson) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `${baseUrl}/api/learning/admin/lessons/${id}`,
        newLesson,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Lỗi khi thêm lesson:", response.error);
      throw error;
    }
  },
  searchLessons: async (
    page = 0,
    size = 10,
    tuKhoa,
    topicId,
    startDate,
    endDate,
    status
  ) => {
    const processedStartDate = startDate ? startDate + "T00:00:00Z" : null;
    const processedEndDate = endDate ? endDate + "T23:59:59Z" : null;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        baseUrl + "/api/learning/admin/lessons/filters",
        {
          params: {
            topicId,
            page,
            size,
            tuKhoa,
            startDate: processedStartDate,
            endDate: processedEndDate,
            status,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tìm kiếm bài học:", error);
      throw error;
    }
  },

  // Thêm vào trong object lessonService
  getTotalLessonStatics: async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${baseUrl}/api/learning/admin/statics/total-lesson`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy thống kê tổng số bài học:", error);
      throw error;
    }
  },

  // API public không cần token
  getTotalLessonStaticsByPublic: async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/learning/admin/statics/lesson-public`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi gọi API getTotalLessonStaticsByPublic:", error);
      throw error;
    }
  },
};

export default lessonService;
