import baseApi from "@/api/baseApi";
import axios from "axios";

const login = async (username, password) => {
  try {
    const response = await axios.post(`${baseApi.auth}/login`, {
      username: username,
      password: password,
    });

    const resData = response.data;

    // Kiểm tra nếu status không phải 200 hoặc không có dữ liệu
    if (resData.status !== 200 || resData.data == null) {
      throw new Error(resData.error || "Đăng nhập thất bại");
    }

    // Thành công, trả về data (chứa username, token...)
    return resData.data;
  } catch (error) {
    console.error("Lỗi đăng nhập:", error.message);
    throw error; // Gửi lỗi về nơi gọi hàm để xử lý
  }
};

const logOut = () => {
  // Xoá token và userId khỏi localStorage
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("username");
  localStorage.removeItem("password");
  localStorage.setItem("isLogin", "false");
};

export default {
  login,
  logOut,
};
