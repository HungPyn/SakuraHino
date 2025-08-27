// src/services/userService.js
import baseApi from "@/api/baseApi";
import axios from "axios";
import { el } from "date-fns/locale";

import { useToast } from "vue-toastification";

const BASE_URL = baseApi.main; // ← Thay URL thật

const toast = useToast(); // Giả sử bạn đang sử dụng Vue Toastification hoặc một thư viện tương tự

const getQuestions = async ({ lessonId, page, size }) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      BASE_URL + "/api/learning/admin/questions",
      {
        params: { lessonId, page, size },
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = response.data?.data || {}; // unwrap "data"

    return {
      list: data.items || [],
      totalPages: data.totalPages || 0,
      totalItems: data.totalItems || 0,
    };
  } catch (error) {
    console.error("Lỗi khi lấy danh sách câu hỏi:", error.message);
    throw error;
  }
};

const deleteQuestion = async (questionId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.patch(
      `${BASE_URL}/api/learning/admin/questions/${questionId}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa câu hỏi:", error.message);
    throw error;
  }
};

const createQuestion = async (question, listImage = []) => {
  //   console.log(
  //     "Đang tạo câu hỏi với dữ liệu:",
  //     JSON.stringify(question, null, 2)
  //   );
  listImage.forEach((item, index) => {
    const file = item.file; // lấy đúng File object
    if (file) {
      console.log(`File ${index}:`, file.name, file.size, file.type);
    } else {
      console.log(`File ${index}: null`);
    }
  });
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append(
    "data",
    new Blob([JSON.stringify(question)], { type: "application/json" }),
    "data.json"
  );

  listImage.forEach((item) => {
    if (item.file) {
      formData.append("files", item.file); // append đúng File object
    }
  });

  try {
    const response = await axios.post(
      `${BASE_URL}/api/learning/admin/questions`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Câu trả về từ api:", response.data);
    if (response.data.status === 200) {
      toast.success("Tạo câu hỏi thành công!");
    } else {
      toast.error(response.data.data.errors[0].message);
      return false;
    }

    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo câu hỏi:", error.message);
    toast.error("Tạo câu hỏi thất bại. Vui lòng thử lại.");
    throw error;
  }
};

const updateQuestion = async (questionId, question, listImage = []) => {
  //   console.log(
  //     "Đang tạo câu hỏi với dữ liệu:",
  //     JSON.stringify(question, null, 2)
  //   );
  listImage.forEach((item, index) => {
    const file = item.file; // lấy đúng File object
    if (file) {
      console.log(`File ${index}:`, file.name, file.size, file.type);
    } else {
      console.log(`File ${index}: null`);
    }
  });
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append(
    "data",
    new Blob([JSON.stringify(question)], { type: "application/json" }),
    "data.json"
  );

  listImage.forEach((item) => {
    if (item.file) {
      formData.append("files", item.file); // append đúng File object
    }
  });

  try {
    const response = await axios.put(
      `${BASE_URL}/api/learning/admin/questions/${questionId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Câu trả về từ api:", response.data);
    if (response.data.status === 200) {
      toast.success("Cập nhật câu hỏi thành công!");
    } else {
      toast.error(response.data.data.error[0].message);
      return false;
    }

    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật câu hỏi:", error.message);
    toast.error("Cập nhật câu hỏi thất bại. Vui lòng thử lại.");
    throw error;
  }
};

const importExcel = async (fileExcel) => {
  const token = localStorage.getItem("token");
  if (!fileExcel) {
    toast.error("Chưa chọn file Excel!");
    return;
  }
  const formData = new FormData();
  formData.append("file", fileExcel); // key "file" phải trùng với @RequestParam("file")

  try {
    const response = await axios.post(
      `${BASE_URL}/api/learning/admin/questions/excel`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("Kết quả trả về từ API:", response.data);

    if (response.data.status !== 200 && response.data.error) {
      // in ra đúng lỗi từ server
      toast.error(response.data.error);
    } else {
      toast.success("Thêm thành công");
    }

    return response.data;
  } catch (error) {
    console.error("Lỗi khi upload Excel:", error);
    toast.error("Upload thất bại. Vui lòng thử lại.");
    throw error;
  }
};

export default {
  getQuestions,
  deleteQuestion,
  createQuestion,
  updateQuestion,
  importExcel,
};
