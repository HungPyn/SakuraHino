import baseApi from "@/api/baseApi";
import axios from "axios";

const levelService = {
  getLevels: async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        baseApi.main + "/api/learning/admin/meta/level",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách cấp độ:", error);
      throw error;
    }
  },
  getStatus: async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        baseApi.main + "/api/learning/admin/meta/status",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách trạng thái:", error);
      throw error;
    }
  },
};

export default levelService;
