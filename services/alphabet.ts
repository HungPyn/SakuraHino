import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { baseTopicApi } from "./baseAPI";

export interface Vocabulary {
  id: string;
  word: string;
  furigana: string;
  romaji: string;
  meaning: string;
  audioUrl: string;
}
export interface Kana {
  id: string;
  hira: string;
  kata: string;
  romaji: string;
  audioUrl: string;
}
//cho luyện chữ
interface Word {
  id: number;
  japaneseCharacter: string;
  alphabetsStatus: string;
  audioUrl: string;
  characterType: string;
  meaning: string;
}

interface AllWord {
  listNewCharacter: Word[];
  listOldCharacter: Word[];
}
//lấy chữ cái
const getAllWord = async () => {
  const token = await AsyncStorage.getItem("token");
  console.log("Token retrieved from AsyncStorage:", token);
  if (!token) {
    console.error("Token not found in AsyncStorage");
    return [];
  }
  try {
    const response = await axios.get(`${baseTopicApi}/api/alphabets/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log(
    //   "Response from alphabets:",
    //   JSON.stringify(response.data, null, 2)
    // );

    return response.data.data || [];
  } catch (error) {
    console.error("Lỗi khi gọi api lấy alphabets:", error);
    return [];
  }
};

const resultNewWord = async (id: string) => {
  const token = await AsyncStorage.getItem("token");
  console.log("Token retrieved from AsyncStorage:", token);

  if (!token) {
    console.error("Token not found in AsyncStorage");
    return [];
  }
  try {
    const response = await axios.post(
      `${baseTopicApi}/api/alphabets/user/new`,
      id,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.data === "Success") {
      return true;
    }
  } catch (error) {
    console.error("Lỗi khi thêm result:", error);
    return false;
  }
};
const resultOldWord = async (id: string) => {
  const token = await AsyncStorage.getItem("token");
  console.log("Token retrieved from AsyncStorage:", token);

  if (!token) {
    console.error("Token not found in AsyncStorage");
    return [];
  }
  try {
    const response = await axios.post(
      `${baseTopicApi}/api/alphabets/user/old`,
      id,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.data === "Success") {
      return true;
    }
  } catch (error) {
    console.error("Lỗi khi thêm result old:", error);
    return false;
  }
};

export const kana: Kana[] = [
  // HIRAGANA VÀ KATAKANA HÀNG A, I, U, E, O
  {
    id: "haka-1",
    hira: "あ",
    kata: "ア",
    romaji: "a",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=あ&tl=ja&client=tw-ob",
  },
  {
    id: "haka-2",
    hira: "い",
    kata: "イ",
    romaji: "i",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=い&tl=ja&client=tw-ob",
  },
  {
    id: "haka-3",
    hira: "う",
    kata: "ウ",
    romaji: "u",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=う&tl=ja&client=tw-ob",
  },
  {
    id: "haka-4",
    hira: "え",
    kata: "エ",
    romaji: "e",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=え&tl=ja&client=tw-ob",
  },
  {
    id: "haka-5",
    hira: "お",
    kata: "オ",
    romaji: "o",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=お&tl=ja&client=tw-ob",
  },
  // HIRAGANA VÀ KATAKANA HÀNG K
  {
    id: "haka-6",
    hira: "か",
    kata: "カ",
    romaji: "ka",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=か&tl=ja&client=tw-ob",
  },
  {
    id: "haka-7",
    hira: "き",
    kata: "キ",
    romaji: "ki",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=き&tl=ja&client=tw-ob",
  },
  {
    id: "haka-8",
    hira: "く",
    kata: "ク",
    romaji: "ku",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=く&tl=ja&client=tw-ob",
  },
  {
    id: "haka-9",
    hira: "け",
    kata: "ケ",
    romaji: "ke",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=け&tl=ja&client=tw-ob",
  },
  {
    id: "haka-10",
    hira: "こ",
    kata: "コ",
    romaji: "ko",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=こ&tl=ja&client=tw-ob",
  },
  // HIRAGANA VÀ KATAKANA HÀNG S
  {
    id: "haka-11",
    hira: "さ",
    kata: "サ",
    romaji: "sa",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=さ&tl=ja&client=tw-ob",
  },
  {
    id: "haka-12",
    hira: "し",
    kata: "シ",
    romaji: "shi",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=し&tl=ja&client=tw-ob",
  },
  {
    id: "haka-13",
    hira: "す",
    kata: "ス",
    romaji: "su",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=す&tl=ja&client=tw-ob",
  },
  {
    id: "haka-14",
    hira: "せ",
    kata: "セ",
    romaji: "se",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=せ&tl=ja&client=tw-ob",
  },
  {
    id: "haka-15",
    hira: "そ",
    kata: "ソ",
    romaji: "so",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=そ&tl=ja&client=tw-ob",
  },
  // HIRAGANA VÀ KATAKANA HÀNG T
  {
    id: "haka-16",
    hira: "た",
    kata: "タ",
    romaji: "ta",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=た&tl=ja&client=tw-ob",
  },
  {
    id: "haka-17",
    hira: "ち",
    kata: "チ",
    romaji: "chi",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=ち&tl=ja&client=tw-ob",
  },
  {
    id: "haka-18",
    hira: "つ",
    kata: "ツ",
    romaji: "tsu",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=つ&tl=ja&client=tw-ob",
  },
  {
    id: "haka-19",
    hira: "て",
    kata: "テ",
    romaji: "te",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=て&tl=ja&client=tw-ob",
  },
  {
    id: "haka-20",
    hira: "と",
    kata: "ト",
    romaji: "to",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=と&tl=ja&client=tw-ob",
  },
  // HIRAGANA VÀ KATAKANA HÀNG N
  {
    id: "haka-21",
    hira: "な",
    kata: "ナ",
    romaji: "na",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=な&tl=ja&client=tw-ob",
  },
  {
    id: "haka-22",
    hira: "に",
    kata: "ニ",
    romaji: "ni",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=に&tl=ja&client=tw-ob",
  },
  {
    id: "haka-23",
    hira: "ぬ",
    kata: "ヌ",
    romaji: "nu",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=ぬ&tl=ja&client=tw-ob",
  },
  {
    id: "haka-24",
    hira: "ね",
    kata: "ネ",
    romaji: "ne",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=ね&tl=ja&client=tw-ob",
  },
  {
    id: "haka-25",
    hira: "の",
    kata: "ノ",
    romaji: "no",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=の&tl=ja&client=tw-ob",
  },
  // HIRAGANA VÀ KATAKANA HÀNG H
  {
    id: "haka-26",
    hira: "は",
    kata: "ハ",
    romaji: "ha",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=は&tl=ja&client=tw-ob",
  },
  {
    id: "haka-27",
    hira: "ひ",
    kata: "ヒ",
    romaji: "hi",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=ひ&tl=ja&client=tw-ob",
  },
  {
    id: "haka-28",
    hira: "ふ",
    kata: "フ",
    romaji: "fu",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=ふ&tl=ja&client=tw-ob",
  },
  {
    id: "haka-29",
    hira: "へ",
    kata: "ヘ",
    romaji: "he",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=へ&tl=ja&client=tw-ob",
  },
  {
    id: "haka-30",
    hira: "ほ",
    kata: "ホ",
    romaji: "ho",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=ほ&tl=ja&client=tw-ob",
  },
  // HIRAGANA VÀ KATAKANA HÀNG M
  {
    id: "haka-31",
    hira: "ま",
    kata: "マ",
    romaji: "ma",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=ま&tl=ja&client=tw-ob",
  },
  {
    id: "haka-32",
    hira: "み",
    kata: "ミ",
    romaji: "mi",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=み&tl=ja&client=tw-ob",
  },
  {
    id: "haka-33",
    hira: "む",
    kata: "ム",
    romaji: "mu",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=む&tl=ja&client=tw-ob",
  },
  {
    id: "haka-34",
    hira: "め",
    kata: "メ",
    romaji: "me",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=め&tl=ja&client=tw-ob",
  },
  {
    id: "haka-35",
    hira: "も",
    kata: "モ",
    romaji: "mo",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=も&tl=ja&client=tw-ob",
  },
  // HIRAGANA VÀ KATAKANA HÀNG Y
  {
    id: "haka-36",
    hira: "や",
    kata: "ヤ",
    romaji: "ya",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=や&tl=ja&client=tw-ob",
  },
  {
    id: "haka-37",
    hira: "ゆ",
    kata: "ユ",
    romaji: "yu",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=ゆ&tl=ja&client=tw-ob",
  },
  {
    id: "haka-38",
    hira: "よ",
    kata: "ヨ",
    romaji: "yo",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=よ&tl=ja&client=tw-ob",
  },
  // HIRAGANA VÀ KATAKANA HÀNG R
  {
    id: "haka-39",
    hira: "ら",
    kata: "ラ",
    romaji: "ra",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=ら&tl=ja&client=tw-ob",
  },
  {
    id: "haka-40",
    hira: "り",
    kata: "リ",
    romaji: "ri",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=り&tl=ja&client=tw-ob",
  },
  {
    id: "haka-41",
    hira: "る",
    kata: "ル",
    romaji: "ru",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=る&tl=ja&client=tw-ob",
  },
  {
    id: "haka-42",
    hira: "れ",
    kata: "レ",
    romaji: "re",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=れ&tl=ja&client=tw-ob",
  },
  {
    id: "haka-43",
    hira: "ろ",
    kata: "ロ",
    romaji: "ro",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=ろ&tl=ja&client=tw-ob",
  },
  // HIRAGANA VÀ KATAKANA HÀNG W
  {
    id: "haka-44",
    hira: "わ",
    kata: "ワ",
    romaji: "wa",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=わ&tl=ja&client=tw-ob",
  },
  {
    id: "haka-45",
    hira: "を",
    kata: "ヲ",
    romaji: "o",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=を&tl=ja&client=tw-ob",
  },
  {
    id: "haka-46",
    hira: "ん",
    kata: "ン",
    romaji: "n",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=ん&tl=ja&client=tw-ob",
  },
];

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const Kanji: Vocabulary[] = [
  // Từ vựng Kanji N5
  {
    id: "kv1",
    word: "私",
    furigana: "わたし",
    romaji: "watashi",
    meaning: "Tôi",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=私&tl=ja&client=tw-ob",
  },
  {
    id: "kv2",
    word: "学校",
    furigana: "がっこう",
    romaji: "gakkou",
    meaning: "Trường học",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=学校&tl=ja&client=tw-ob",
  },
  {
    id: "kv3",
    word: "学生",
    furigana: "がくせい",
    romaji: "gakusei",
    meaning: "Học sinh",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=学生&tl=ja&client=tw-ob",
  },
  {
    id: "kv4",
    word: "先生",
    furigana: "せんせい",
    romaji: "sensei",
    meaning: "Giáo viên",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=先生&tl=ja&client=tw-ob",
  },
  {
    id: "kv5",
    word: "本",
    furigana: "ほん",
    romaji: "hon",
    meaning: "Sách",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=本&tl=ja&client=tw-ob",
  },
  {
    id: "kv6",
    word: "お金",
    furigana: "おかね",
    romaji: "okane",
    meaning: "Tiền",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=お金&tl=ja&client=tw-ob",
  },
  {
    id: "kv7",
    word: "水",
    furigana: "みず",
    romaji: "mizu",
    meaning: "Nước",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=水&tl=ja&client=tw-ob",
  },
  {
    id: "kv8",
    word: "ご飯",
    furigana: "ごはん",
    romaji: "gohan",
    meaning: "Cơm",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=ご飯&tl=ja&client=tw-ob",
  },
  {
    id: "kv9",
    word: "車",
    furigana: "くるま",
    romaji: "kuruma",
    meaning: "Xe hơi",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=車&tl=ja&client=tw-ob",
  },
  {
    id: "kv10",
    word: "駅",
    furigana: "えき",
    romaji: "eki",
    meaning: "Nhà ga",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=駅&tl=ja&client=tw-ob",
  },
  {
    id: "kv11",
    word: "電話",
    furigana: "でんわ",
    romaji: "denwa",
    meaning: "Điện thoại",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=電話&tl=ja&client=tw-ob",
  },
  {
    id: "kv12",
    word: "病院",
    furigana: "びょういん",
    romaji: "byouin",
    meaning: "Bệnh viện",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=病院&tl=ja&client=tw-ob",
  },
  {
    id: "kv13",
    word: "会社",
    furigana: "かいしゃ",
    romaji: "kaisha",
    meaning: "Công ty",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=会社&tl=ja&client=tw-ob",
  },
  {
    id: "kv14",
    word: "友達",
    furigana: "ともだち",
    romaji: "tomodachi",
    meaning: "Bạn bè",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=友達&tl=ja&client=tw-ob",
  },
  {
    id: "kv15",
    word: "日本",
    furigana: "にほん",
    romaji: "nihon",
    meaning: "Nhật Bản",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=日本&tl=ja&client=tw-ob",
  },
  {
    id: "kv16",
    word: "今日",
    furigana: "きょう",
    romaji: "kyou",
    meaning: "Hôm nay",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=今日&tl=ja&client=tw-ob",
  },
  {
    id: "kv17",
    word: "明日",
    furigana: "あした",
    romaji: "ashita",
    meaning: "Ngày mai",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=明日&tl=ja&client=tw-ob",
  },
  {
    id: "kv18",
    word: "時間",
    furigana: "じかん",
    romaji: "jikan",
    meaning: "Thời gian",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=時間&tl=ja&client=tw-ob",
  },
  {
    id: "kv19",
    word: "名前",
    furigana: "なまえ",
    romaji: "namae",
    meaning: "Tên",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=名前&tl=ja&client=tw-ob",
  },
  {
    id: "kv20",
    word: "家",
    furigana: "いえ",
    romaji: "ie",
    meaning: "Nhà",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=家&tl=ja&client=tw-ob",
  },
  {
    id: "kv21",
    word: "人",
    furigana: "ひと",
    romaji: "hito",
    meaning: "Người",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=人&tl=ja&client=tw-ob",
  },
  {
    id: "kv22",
    word: "山",
    furigana: "やま",
    romaji: "yama",
    meaning: "Núi",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=山&tl=ja&client=tw-ob",
  },
  {
    id: "kv23",
    word: "川",
    furigana: "かわ",
    romaji: "kawa",
    meaning: "Sông",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=川&tl=ja&client=tw-ob",
  },
  {
    id: "kv24",
    word: "上",
    furigana: "うえ",
    romaji: "ue",
    meaning: "Trên",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=上&tl=ja&client=tw-ob",
  },
  {
    id: "kv25",
    word: "下",
    furigana: "した",
    romaji: "shita",
    meaning: "Dưới",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=下&tl=ja&client=tw-ob",
  },

  // Từ vựng Kanji N4
  {
    id: "kv26",
    word: "勉強",
    furigana: "べんきょう",
    romaji: "benkyou",
    meaning: "Học tập",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=勉強&tl=ja&client=tw-ob",
  },
  {
    id: "kv27",
    word: "仕事",
    furigana: "しごと",
    romaji: "shigoto",
    meaning: "Công việc",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=仕事&tl=ja&client=tw-ob",
  },
  {
    id: "kv28",
    word: "約束",
    furigana: "やくそく",
    romaji: "yakusoku",
    meaning: "Lời hứa",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=約束&tl=ja&client=tw-ob",
  },
  {
    id: "kv29",
    word: "旅行",
    furigana: "りょこう",
    romaji: "ryokou",
    meaning: "Du lịch",
    audioUrl:
      "https://translate.com/translate_tts?ie=UTF-8&q=旅行&tl=ja&client=tw-ob",
  },
  {
    id: "kv30",
    word: "料理",
    furigana: "りょうり",
    romaji: "ryouri",
    meaning: "Nấu ăn, món ăn",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=料理&tl=ja&client=tw-ob",
  },
  {
    id: "kv31",
    word: "音楽",
    furigana: "おんがく",
    romaji: "ongaku",
    meaning: "Âm nhạc",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=音楽&tl=ja&client=tw-ob",
  },
  {
    id: "kv32",
    word: "映画",
    furigana: "えいが",
    romaji: "eiga",
    meaning: "Phim",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=映画&tl=ja&client=tw-ob",
  },
  {
    id: "kv33",
    word: "写真",
    furigana: "しゃしん",
    romaji: "shashin",
    meaning: "Hình ảnh",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=写真&tl=ja&client=tw-ob",
  },
  {
    id: "kv34",
    word: "運動",
    furigana: "うんどう",
    romaji: "undou",
    meaning: "Vận động",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=運動&tl=ja&client=tw-ob",
  },
  {
    id: "kv35",
    word: "家族",
    furigana: "かぞく",
    romaji: "kazoku",
    meaning: "Gia đình",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=家族&tl=ja&client=tw-ob",
  },
  {
    id: "kv36",
    word: "趣味",
    furigana: "しゅみ",
    romaji: "shumi",
    meaning: "Sở thích",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=趣味&tl=ja&client=tw-ob",
  },
  {
    id: "kv37",
    word: "新聞",
    furigana: "しんぶん",
    romaji: "shinbun",
    meaning: "Báo",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=新聞&tl=ja&client=tw-ob",
  },
  {
    id: "kv38",
    word: "天気",
    furigana: "てんき",
    romaji: "tenki",
    meaning: "Thời tiết",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=天気&tl=ja&client=tw-ob",
  },
  {
    id: "kv39",
    word: "買い物",
    furigana: "かいもの",
    romaji: "kaimono",
    meaning: "Mua sắm",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=買い物&tl=ja&client=tw-ob",
  },
  {
    id: "kv40",
    word: "部屋",
    furigana: "へや",
    romaji: "heya",
    meaning: "Phòng",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=部屋&tl=ja&client=tw-ob",
  },
  {
    id: "kv41",
    word: "先生",
    furigana: "せんせい",
    romaji: "sensei",
    meaning: "Giáo viên",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=先生&tl=ja&client=tw-ob",
  },
  {
    id: "kv42",
    word: "郵便局",
    furigana: "ゆうびんきょく",
    romaji: "yuubinkyoku",
    meaning: "Bưu điện",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=郵便局&tl=ja&client=tw-ob",
  },
  {
    id: "kv43",
    word: "空港",
    furigana: "くうこう",
    romaji: "kuukou",
    meaning: "Sân bay",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=空港&tl=ja&client=tw-ob",
  },
  {
    id: "kv44",
    word: "外国",
    furigana: "がいこく",
    romaji: "gaikoku",
    meaning: "Nước ngoài",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=外国&tl=ja&client=tw-ob",
  },
  {
    id: "kv45",
    word: "手紙",
    furigana: "てがみ",
    romaji: "tegami",
    meaning: "Thư",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=手紙&tl=ja&client=tw-ob",
  },

  // Từ vựng Kanji N3-N2
  {
    id: "kv46",
    word: "知識",
    furigana: "ちしき",
    romaji: "chishiki",
    meaning: "Tri thức",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=知識&tl=ja&client=tw-ob",
  },
  {
    id: "kv47",
    word: "技術",
    furigana: "ぎじゅつ",
    romaji: "gijutsu",
    meaning: "Kỹ thuật",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=技術&tl=ja&client=tw-ob",
  },
  {
    id: "kv48",
    word: "教育",
    furigana: "きょういく",
    romaji: "kyouiku",
    meaning: "Giáo dục",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=教育&tl=ja&client=tw-ob",
  },
  {
    id: "kv49",
    word: "経済",
    furigana: "けいざい",
    romaji: "keizai",
    meaning: "Kinh tế",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=経済&tl=ja&client=tw-ob",
  },
  {
    id: "kv50",
    word: "政治",
    furigana: "せいじ",
    romaji: "seiji",
    meaning: "Chính trị",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=政治&tl=ja&client=tw-ob",
  },
  {
    id: "kv51",
    word: "社会",
    furigana: "しゃかい",
    romaji: "shakai",
    meaning: "Xã hội",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=社会&tl=ja&client=tw-ob",
  },
  {
    id: "kv52",
    word: "情報",
    furigana: "じょうほう",
    romaji: "jouhou",
    meaning: "Thông tin",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=情報&tl=ja&client=tw-ob",
  },
  {
    id: "kv53",
    word: "開発",
    furigana: "かいはつ",
    romaji: "kaihatsu",
    meaning: "Phát triển",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=開発&tl=ja&client=tw-ob",
  },
  {
    id: "kv54",
    word: "利用",
    furigana: "りよう",
    romaji: "riyou",
    meaning: "Sử dụng",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=利用&tl=ja&client=tw-ob",
  },
  {
    id: "kv55",
    word: "関係",
    furigana: "かんけい",
    romaji: "kankei",
    meaning: "Quan hệ",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=関係&tl=ja&client=tw-ob",
  },
  {
    id: "kv56",
    word: "目的",
    furigana: "もくてき",
    romaji: "mokuteki",
    meaning: "Mục đích",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=目的&tl=ja&client=tw-ob",
  },
  {
    id: "kv57",
    word: "状態",
    furigana: "じょうたい",
    romaji: "joutai",
    meaning: "Trạng thái",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=状態&tl=ja&client=tw-ob",
  },
  {
    id: "kv58",
    word: "変化",
    furigana: "へんか",
    romaji: "henka",
    meaning: "Thay đổi",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=変化&tl=ja&client=tw-ob",
  },
  {
    id: "kv59",
    word: "必要",
    furigana: "ひつよう",
    romaji: "hitsuyou",
    meaning: "Cần thiết",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=必要&tl=ja&client=tw-ob",
  },
  {
    id: "kv60",
    word: "理由",
    furigana: "りゆう",
    romaji: "riyuu",
    meaning: "Lý do",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=理由&tl=ja&client=tw-ob",
  },
  {
    id: "kv61",
    word: "確認",
    furigana: "かくにん",
    romaji: "kakunin",
    meaning: "Xác nhận",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=確認&tl=ja&client=tw-ob",
  },
  {
    id: "kv62",
    word: "解決",
    furigana: "かいけつ",
    romaji: "kaiketsu",
    meaning: "Giải quyết",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=解決&tl=ja&client=tw-ob",
  },
  {
    id: "kv63",
    word: "成功",
    furigana: "せいこう",
    romaji: "seikou",
    meaning: "Thành công",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=成功&tl=ja&client=tw-ob",
  },
  {
    id: "kv64",
    word: "失敗",
    furigana: "しっぱい",
    romaji: "shippai",
    meaning: "Thất bại",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=失敗&tl=ja&client=tw-ob",
  },
  {
    id: "kv65",
    word: "説明",
    furigana: "せつめい",
    romaji: "setsumei",
    meaning: "Giải thích",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=説明&tl=ja&client=tw-ob",
  },
  {
    id: "kv66",
    word: "能力",
    furigana: "のうりょく",
    romaji: "nouryoku",
    meaning: "Năng lực",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=能力&tl=ja&client=tw-ob",
  },
  {
    id: "kv67",
    word: "可能性",
    furigana: "かのうせい",
    romaji: "kanousei",
    meaning: "Khả năng",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=可能性&tl=ja&client=tw-ob",
  },
  {
    id: "kv68",
    word: "経験",
    furigana: "けいけん",
    romaji: "keiken",
    meaning: "Kinh nghiệm",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=経験&tl=ja&client=tw-ob",
  },
  {
    id: "kv69",
    word: "計画",
    furigana: "けいかく",
    romaji: "keikaku",
    meaning: "Kế hoạch",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=計画&tl=ja&client=tw-ob",
  },
  {
    id: "kv70",
    word: "興味",
    furigana: "きょうみ",
    romaji: "kyoumi",
    meaning: "Sở thích",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=興味&tl=ja&client=tw-ob",
  },

  // Từ vựng Kanji N1-N2
  {
    id: "kv71",
    word: "状況",
    furigana: "じょうきょう",
    romaji: "joukyou",
    meaning: "Tình trạng",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=状況&tl=ja&client=tw-ob",
  },
  {
    id: "kv72",
    word: "情報",
    furigana: "じょうほう",
    romaji: "jouhou",
    meaning: "Thông tin",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=情報&tl=ja&client=tw-ob",
  },
  {
    id: "kv73",
    word: "原因",
    furigana: "げんいん",
    romaji: "gen'in",
    meaning: "Nguyên nhân",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=原因&tl=ja&client=tw-ob",
  },
  {
    id: "kv74",
    word: "結果",
    furigana: "けっか",
    romaji: "kekka",
    meaning: "Kết quả",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=結果&tl=ja&client=tw-ob",
  },
  {
    id: "kv75",
    word: "決定",
    furigana: "けってい",
    romaji: "kettei",
    meaning: "Quyết định",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=決定&tl=ja&client=tw-ob",
  },
  {
    id: "kv76",
    word: "準備",
    furigana: "じゅんび",
    romaji: "junbi",
    meaning: "Chuẩn bị",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=準備&tl=ja&client=tw-ob",
  },
  {
    id: "kv77",
    word: "実現",
    furigana: "じつげん",
    romaji: "jitsugen",
    meaning: "Thực hiện",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=実現&tl=ja&client=tw-ob",
  },
  {
    id: "kv78",
    word: "感謝",
    furigana: "かんしゃ",
    romaji: "kansha",
    meaning: "Biết ơn",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=感謝&tl=ja&client=tw-ob",
  },
  {
    id: "kv79",
    word: "想像",
    furigana: "そうぞう",
    romaji: "souzou",
    meaning: "Tưởng tượng",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=想像&tl=ja&client=tw-ob",
  },
  {
    id: "kv80",
    word: "影響",
    furigana: "えいきょう",
    romaji: "eikyou",
    meaning: "Ảnh hưởng",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=影響&tl=ja&client=tw-ob",
  },
  {
    id: "kv81",
    word: "問題",
    furigana: "もんだい",
    romaji: "mondai",
    meaning: "Vấn đề",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=問題&tl=ja&client=tw-ob",
  },
  {
    id: "kv82",
    word: "意見",
    furigana: "いけん",
    romaji: "iken",
    meaning: "Ý kiến",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=意見&tl=ja&client=tw-ob",
  },
  {
    id: "kv83",
    word: "生活",
    furigana: "せいかつ",
    romaji: "seikatsu",
    meaning: "Cuộc sống",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=生活&tl=ja&client=tw-ob",
  },
  {
    id: "kv84",
    word: "自然",
    furigana: "しぜん",
    romaji: "shizen",
    meaning: "Thiên nhiên",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=自然&tl=ja&client=tw-ob",
  },
  {
    id: "kv85",
    word: "健康",
    furigana: "けんこう",
    romaji: "kenkou",
    meaning: "Sức khỏe",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=健康&tl=ja&client=tw-ob",
  },
  {
    id: "kv86",
    word: "環境",
    furigana: "かんきょう",
    romaji: "kankyou",
    meaning: "Môi trường",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=環境&tl=ja&client=tw-ob",
  },
  {
    id: "kv87",
    word: "責任",
    furigana: "せきにん",
    romaji: "sekinin",
    meaning: "Trách nhiệm",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=責任&tl=ja&client=tw-ob",
  },
  {
    id: "kv88",
    word: "理解",
    furigana: "りかい",
    romaji: "rikai",
    meaning: "Hiểu, lý giải",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=理解&tl=ja&client=tw-ob",
  },
  {
    id: "kv89",
    word: "表現",
    furigana: "ひょうげん",
    romaji: "hyougen",
    meaning: "Biểu hiện",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=表現&tl=ja&client=tw-ob",
  },
  {
    id: "kv90",
    word: "能力",
    furigana: "のうりょく",
    romaji: "nouryoku",
    meaning: "Năng lực",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=能力&tl=ja&client=tw-ob",
  },
  {
    id: "kv91",
    word: "教育",
    furigana: "きょういく",
    romaji: "kyouiku",
    meaning: "Giáo dục",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=教育&tl=ja&client=tw-ob",
  },
  {
    id: "kv92",
    word: "専門",
    furigana: "せんもん",
    romaji: "senmon",
    meaning: "Chuyên môn",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=専門&tl=ja&client=tw-ob",
  },
  {
    id: "kv93",
    word: "研究",
    furigana: "けんきゅう",
    romaji: "kenkyuu",
    meaning: "Nghiên cứu",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=研究&tl=ja&client=tw-ob",
  },
  {
    id: "kv94",
    word: "目的",
    furigana: "もくてき",
    romaji: "mokuteki",
    meaning: "Mục đích",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=目的&tl=ja&client=tw-ob",
  },
  {
    id: "kv95",
    word: "努力",
    furigana: "どりょく",
    romaji: "doryoku",
    meaning: "Nỗ lực",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=努力&tl=ja&client=tw-ob",
  },
  {
    id: "kv96",
    word: "自由",
    furigana: "じゆう",
    romaji: "jiyuu",
    meaning: "Tự do",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=自由&tl=ja&client=tw-ob",
  },
  {
    id: "kv97",
    word: "発展",
    furigana: "はってん",
    romaji: "hatten",
    meaning: "Phát triển",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=発展&tl=ja&client=tw-ob",
  },
  {
    id: "kv98",
    word: "将来",
    furigana: "しょうらい",
    romaji: "shourai",
    meaning: "Tương lai",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=将来&tl=ja&client=tw-ob",
  },
  {
    id: "kv99",
    word: "経験",
    furigana: "けいけん",
    romaji: "keiken",
    meaning: "Kinh nghiệm",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=経験&tl=ja&client=tw-ob",
  },
  {
    id: "kv100",
    word: "計画",
    furigana: "けいかく",
    romaji: "keikaku",
    meaning: "Kế hoạch",
    audioUrl:
      "https://translate.google.com/translate_tts?ie=UTF-8&q=計画&tl=ja&client=tw-ob",
  },
];
export default {
  kana,
  Kanji,
  getAllWord,
  resultNewWord,
  resultOldWord,
};
