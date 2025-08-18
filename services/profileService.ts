import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseTopicApi } from "./baseAPI";
import axios from "axios";

const getUser = async () => {
  const token = await AsyncStorage.getItem("token");
  console.log("Token retrieved from AsyncStorage:", token);
  if (!token) {
    console.error("Token not found in AsyncStorage");
    return [];
  }
  try {
    const response = await axios.get(`${baseTopicApi}/api/users/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("dữ liệu người dùng getUser:", response.data);

    return response.data.data || [];
  } catch (error) {
    console.error("Lỗi khi gọi api lấy user:", error);
    return [];
  }
};
const editUser = async (
  name: string,
  email: string,
  avatarUri: string | null
) => {
  const token = await AsyncStorage.getItem("token");
  if (!token) {
    console.error("Token not found in AsyncStorage");
    return [];
  }

  try {
    const formData = new FormData();

    // SỬA ĐỔI: Gửi chuỗi JSON trực tiếp
    const dto = { name, email };
    formData.append("dto", JSON.stringify(dto));
    // Dữ liệu file ảnh
    if (avatarUri) {
      const filename = avatarUri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename || "");
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      formData.append("file", {
        uri: avatarUri,
        name: filename,
        type: type,
      } as any);
    }

    console.log("FormData là:::", formData);
    // Gửi request PUT với FormData
    const response = await axios.put(
      `${baseTopicApi}/api/users/user`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          // axios sẽ tự động đặt đúng Content-Type cho FormData
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Cập nhật người dùng thành công:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi sửa user:", error);
    throw error;
  }
};
const logout = async () => {
  try {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("isLoggedIn");
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("userId");
  } catch (error) {
    console.error("Error logging out:", error);
  }
};
export default {
  getUser,
  logout,
  editUser,
};
