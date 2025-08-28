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
      `${BASE_URL}/api/users/admin/${userId}`,
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
const timKiem = async (page, size, tuKhoa, status) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/users/admin/filters`, {
      params: {
        page,
        size,
        tuKhoa,
        status,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi tìm kiếm người dùng:", error.message);
    throw error;
  }
};

// --- MỚI: Lấy tổng user kèm % tăng hôm qua ---
const getTotalUsersWithPercent = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/users/admin/statistics/total-with-percent`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // response.data = { totalUsers: ..., percentChange: ... }
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy tổng user với phần trăm tăng:", error.message);
    toast.error("Không lấy được thống kê user hôm nay");
    throw error;
  }
};

const getTotalUsersWithPercentThisMonth = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/users/admin/statistics/this-month`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // response.data = { totalUsers: ..., percentChange: ... }
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy tổng user với phần trăm tăng:", error.message);
    toast.error("Không lấy được thống kê user hôm nay");
    throw error;
  }
};
const getTotalUsersRegistrations = async (rangeDays = 7) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/users/admin/statistics/registrations?range=${rangeDays}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Backend trả về { status, error, data: [...] }
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data; // [{ period, count }, ...]
    } else {
      throw new Error("Dữ liệu trả về không hợp lệ");
    }
  } catch (error) {
    console.error("Lỗi khi lấy thống kê user:", error);
    toast.error("Không lấy được thống kê người dùng");
    throw error;
  }
};

// API 1: Top 5 người dùng có streak dài nhất
export const getLongStreaks = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/users/admin/statistics/stats/long-streaks`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data?.data || []; // trả về luôn mảng người dùng
  } catch (error) {
    console.error("Lỗi khi lấy danh sách streak dài:", error.message);
    throw error;
  }
};

// API 2: Top 5 người dùng có điểm EXP cao nhất
export const getExpScoreStats = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/users/admin/statistics/stats/exp-score`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Full response.data:", response); // log toàn bộ response
    console.log("Mảng người dùng:", response.data.data);

    return response.data.data || []; // trả về mảng người dùng
  } catch (error) {
    console.error("Lỗi khi lấy danh sách EXP:", error);
    throw error;
  }
};
const getLichSuOnTap = async () => {
  try {
    const response = await axios.get(BASE_URL + "/api/learning/admin/statics", {
      headers: {
        // THÊM KHỐI HEADERS NÀY
        Authorization: `Bearer ${token}`, // Định dạng Bearer Token
      },
    });
    const data = response.data?.data || {};
    console.log("Data lich su la", data, null, 2);

    return data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách lịch su:", error.message);
    throw error;
  }
};
export default {
  getLichSuOnTap,
  getUsers,
  deleteUser,
  updateUser,
  timKiem,
  getTotalUsersWithPercent,
  getTotalUsersWithPercentThisMonth,
  getTotalUsersRegistrations,
  getExpScoreStats,
  getLongStreaks,
};
