// src/services/userService.js
import baseApi from "@/api/baseApi";
import axios from "axios";
import { useToast } from "vue-toastification";

const BASE_URL = baseApi.main; // ← Thay URL thật
const token = localStorage.getItem("token");
const toast = useToast(); // Giả sử bạn đang sử dụng Vue Toastification hoặc một thư viện tương tự

const getUsers = async ({ page, size }) => {
  try {
    const response = await axios.get(BASE_URL + "/api/users/admin", {
      params: {
        page,
        size,
      },
      headers: {
        // THÊM KHỐI HEADERS NÀY
        Authorization: `Bearer ${token}`, // Định dạng Bearer Token
      },
    });
    const data = response.data?.data || {};

    return {
      users: data.items || [],
      totalPages: data.totalPages || 0,
      hasNext: data.hasNext || false,
    };
  } catch (error) {
    console.error("Lỗi khi lấy danh sách người dùng:", error.message);
    throw error;
  }
};
//delte usse4r5
const deleteUser = async (userId) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/api/users/admin/${userId}`,
      null, // <--- ĐỐI SỐ THỨ HAI LÀ `null` (vì không gửi data body)
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa người dùng:", error.message);
    throw error;
  }
};
//update
const updateUser = async (userId, RequestUserDTO) => {
  try {
    const response = await axios.put(
      `${BASE_URL}api/users/admin/${userId}`,
      RequestUserDTO,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật người dùng:", error.message);
    throw error;
  }
};

export default {
  getUsers,
  deleteUser,
  updateUser,
};
