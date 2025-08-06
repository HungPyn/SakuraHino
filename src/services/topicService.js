import baseApi from "@/api/baseApi";
import axios from "axios";
import { de } from "date-fns/locale";
let topics = []; // thêm dòng này nếu bạn chỉ dùng mock local

const topicService = {
  getAllTopics: async (page = 0, size = 10) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        baseApi.main + "/api/learning/admin/topics",
        {
          params: { page, size },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data; // Trả về { items, totalPages, ... }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách chủ đề:", error);
      throw error;
    }
  },
  getTopic: async (topicId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        baseApi.main + "/api/learning/admin/topics/" + topicId,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy  chủ đề:", error);
      throw error;
    }
  },
  deleteTopic: async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        baseApi.main + "/api/learning/admin/topics/" + id,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response; // Trả về { items, totalPages, ... }
    } catch (error) {
      console.error("Lỗi khi xóa chủ đề:", error);
      throw error;
    }
  },

  createTopic: async (dto, file) => {
    console.log("Toppic truoc khi them:", JSON.stringify(dto, null, 2));
    const formData = new FormData();
    formData.append(
      "dto",
      new Blob([JSON.stringify(dto)], { type: "application/json" }),
      "dto.json" // Tên file tùy chọn
    );
    if (file) {
      formData.append("file", file);
    }
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        baseApi.main + "/api/learning/admin/topics",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi thêm chủ đề:", error);
      throw error;
    }
  },

  updateTopic: async (id, dto, file) => {
    delete dto.level; // Xóa id nếu có, vì API sẽ tự sinh id mới
    console.log("Toppic truoc khi sua:", JSON.stringify(dto, null, 2));
    const formData = new FormData();
    formData.append(
      "dto",
      new Blob([JSON.stringify(dto)], { type: "application/json" }),
      "dto.json" // Tên file tùy chọn
    );
    if (file) {
      formData.append("file", file);
    }
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        baseApi.main + "/api/learning/admin/topics/" + id,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi thêm chủ đề:", error);
      throw error;
    }
  },

  searchTopics: async (
    page = 0,
    size = 10,
    tuKhoa,
    levelId,
    startDate,
    endDate,
    status
  ) => {
    const processedStartDate = startDate ? startDate + "T00:00:00Z" : null;
    const processedEndDate = endDate ? endDate + "T23:59:59Z" : null;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        baseApi.main + "/api/learning/admin/topics/filters",
        {
          params: {
            page,
            size,
            tuKhoa,
            levelId,
            startDate: processedStartDate,
            endDate: processedEndDate,
            status,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Lỗi khi tìm kiếm chủ đề:", error);
      throw error;
    }
  },
};

export default topicService;
