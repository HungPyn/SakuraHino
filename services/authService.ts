export const registerWithUsernamePassword = async (
  username: string,
  password: string,
  name?: string,
  email?: string
) => {
  try {
    const response = await axios.post(
      `${baseAuthApi}/api/auth/registerAndLogin`,
      {
        name,
        email,
        username,
        password,
      }
    );
    if (response.data.data && response.data.data.token) {
      console.log("[REGISTER] Token nhận được:", response.data.data.token);
      await AsyncStorage.setItem("token", response.data.data.token);
      return { success: true, token: response.data.data.token };
    } else {
      return { success: false, error: "No token returned" };
    }
  } catch (error: any) {
    return {
      success: false,
      error: error?.response?.data?.message || error.message,
    };
  }
};
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseAuthApi } from "./baseAPI";
import axios from "axios";

export const loginWithUsernamePassword = async (
  username: string,
  password: string
) => {
  try {
    const response = await axios.post(`${baseAuthApi}/api/auth/login`, {
      username,
      password,
    });

    if (response.data.data && response.data.data.token) {
      await AsyncStorage.setItem("token", response.data.data.token);
      console.log("[LOGIN] Token nhận được:", response.data.data.token);
      return { success: true, token: response.data.data.token };
    } else {
      return { success: false, error: "No token returned" };
    }
  } catch (error: any) {
    return {
      success: false,
      error: error?.response?.data?.message || error.message,
    };
  }
};
