// src/services/alphabetService.js

import baseApi from "@/api/baseApi";
import axios from "axios";

// Dữ liệu đầy đủ cho Hiragana
const hiragana = [
  { id: 1, char: "あ", romanji: "a" },
  { id: 2, char: "い", romanji: "i" },
  { id: 3, char: "う", romanji: "u" },
  { id: 4, char: "え", romanji: "e" },
  { id: 5, char: "お", romanji: "o" },
  { id: 6, char: "か", romanji: "ka" },
  { id: 7, char: "き", romanji: "ki" },
  { id: 8, char: "く", romanji: "ku" },
  { id: 9, char: "け", romanji: "ke" },
  { id: 10, char: "こ", romanji: "ko" },
  { id: 11, char: "さ", romanji: "sa" },
  { id: 12, char: "し", romanji: "shi" },
  { id: 13, char: "す", romanji: "su" },
  { id: 14, char: "せ", romanji: "se" },
  { id: 15, char: "そ", romanji: "so" },
  { id: 16, char: "た", romanji: "ta" },
  { id: 17, char: "ち", romanji: "chi" },
  { id: 18, char: "つ", romanji: "tsu" },
  { id: 19, char: "て", romanji: "te" },
  { id: 20, char: "と", romanji: "to" },
  { id: 21, char: "な", romanji: "na" },
  { id: 22, char: "に", romanji: "ni" },
  { id: 23, char: "ぬ", romanji: "nu" },
  { id: 24, char: "ね", romanji: "ne" },
  { id: 25, char: "の", romanji: "no" },
  { id: 26, char: "は", romanji: "ha" },
  { id: 27, char: "ひ", romanji: "hi" },
  { id: 28, char: "ふ", romanji: "fu" },
  { id: 29, char: "へ", romanji: "he" },
  { id: 30, char: "ほ", romanji: "ho" },
  { id: 31, char: "ま", romanji: "ma" },
  { id: 32, char: "み", romanji: "mi" },
  { id: 33, char: "む", romanji: "mu" },
  { id: 34, char: "め", romanji: "me" },
  { id: 35, char: "も", romanji: "mo" },
  { id: 36, char: "や", romanji: "ya" },
  { id: 37, char: "ゆ", romanji: "yu" },
  { id: 38, char: "よ", romanji: "yo" },
  { id: 39, char: "ら", romanji: "ra" },
  { id: 40, char: "り", romanji: "ri" },
  { id: 41, char: "る", romanji: "ru" },
  { id: 42, char: "れ", romanji: "re" },
  { id: 43, char: "ろ", romanji: "ro" },
  { id: 44, char: "わ", romanji: "wa" },
  { id: 45, char: "を", romanji: "wo" },
  { id: 46, char: "ん", romanji: "n" },
];

// Dữ liệu đầy đủ cho Katakana
const katakana = [
  { id: 101, char: "ア", romanji: "a" },
  { id: 102, char: "イ", romanji: "i" },
  { id: 103, char: "ウ", romanji: "u" },
  { id: 104, char: "エ", romanji: "e" },
  { id: 105, char: "オ", romanji: "o" },
  { id: 106, char: "カ", romanji: "ka" },
  { id: 107, char: "キ", romanji: "ki" },
  { id: 108, char: "ク", romanji: "ku" },
  { id: 109, char: "ケ", romanji: "ke" },
  { id: 110, char: "コ", romanji: "ko" },
  { id: 111, char: "サ", romanji: "sa" },
  { id: 112, char: "シ", romanji: "shi" },
  { id: 113, char: "ス", romanji: "su" },
  { id: 114, char: "セ", romanji: "se" },
  { id: 115, char: "ソ", romanji: "so" },
  { id: 116, char: "タ", romanji: "ta" },
  { id: 117, char: "チ", romanji: "chi" },
  { id: 118, char: "ツ", romanji: "tsu" },
  { id: 119, char: "テ", romanji: "te" },
  { id: 120, char: "ト", romanji: "to" },
  { id: 121, char: "ナ", romanji: "na" },
  { id: 122, char: "ニ", romanji: "ni" },
  { id: 123, char: "ヌ", romanji: "nu" },
  { id: 124, char: "ネ", romanji: "ne" },
  { id: 125, char: "ノ", romanji: "no" },
  { id: 126, char: "ハ", romanji: "ha" },
  { id: 127, char: "ヒ", romanji: "hi" },
  { id: 128, char: "フ", romanji: "fu" },
  { id: 129, char: "ヘ", romanji: "he" },
  { id: 130, char: "ホ", romanji: "ho" },
  { id: 131, char: "マ", romanji: "ma" },
  { id: 132, char: "ミ", romanji: "mi" },
  { id: 133, char: "ム", romanji: "mu" },
  { id: 134, char: "メ", romanji: "me" },
  { id: 135, char: "モ", romanji: "mo" },
  { id: 136, char: "ヤ", romanji: "ya" },
  { id: 137, char: "ユ", romanji: "yu" },
  { id: 138, char: "ヨ", romanji: "yo" },
  { id: 139, char: "ラ", romanji: "ra" },
  { id: 140, char: "リ", romanji: "ri" },
  { id: 141, char: "ル", romanji: "ru" },
  { id: 142, char: "レ", romanji: "re" },
  { id: 143, char: "ロ", romanji: "ro" },
  { id: 144, char: "ワ", romanji: "wa" },
  { id: 145, char: "ヲ", romanji: "wo" },
  { id: 146, char: "ン", romanji: "n" },
];

// Hàm lấy dữ liệu
export const getHiragana = () => [...hiragana];
export const getKatakana = () => [...katakana];

const BASE_URL = baseApi.main; // ← Thay URL thật

export const getAllKanji = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      BASE_URL + "/api/alphabets/admin/character/KANJI",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = response.data?.data || []; // unwrap "data"
    // console.log("data kanji là:", JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách chữ kanji:", error.message);
    throw error;
  }
};

// Hàm CRUD cho Kanji
export const addKanji = async (newKanji) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      BASE_URL + "/api/alphabets/admin/add",
      newKanji, // body gửi lên
      {
        headers: { Authorization: `Bearer ${token}` }, // config riêng
      }
    );

    const data = response.data?.data || []; // unwrap "data"
    return data;
  } catch (error) {
    console.error("Lỗi khi thêm:", error.message);
    throw error;
  }
};

export const updateKanji = async (updatedKanji) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      BASE_URL + "/api/alphabets/admin/update",
      updatedKanji, // body gửi lên
      {
        headers: { Authorization: `Bearer ${token}` }, // config headers riêng
      }
    );

    const data = response.data?.data || []; // unwrap "data"
    return data;
  } catch (error) {
    console.error("Lỗi khi cập nhật:", error.message);
    throw error;
  }
};

export const deleteKanji = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      `${BASE_URL}/api/alphabets/admin/delete`,
      id, // POST body là id
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data?.data || null;
  } catch (error) {
    console.error("Lỗi khi xóa Kanji:", error.message);
    throw error;
  }
};
