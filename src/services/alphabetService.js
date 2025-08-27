// src/services/alphabetService.js

// Dữ liệu đầy đủ cho Hiragana
const hiragana = [
  { id: 1, char: 'あ', romanji: 'a' },
  { id: 2, char: 'い', romanji: 'i' },
  { id: 3, char: 'う', romanji: 'u' },
  { id: 4, char: 'え', romanji: 'e' },
  { id: 5, char: 'お', romanji: 'o' },
  { id: 6, char: 'か', romanji: 'ka' },
  { id: 7, char: 'き', romanji: 'ki' },
  { id: 8, char: 'く', romanji: 'ku' },
  { id: 9, char: 'け', romanji: 'ke' },
  { id: 10, char: 'こ', romanji: 'ko' },
  { id: 11, char: 'さ', romanji: 'sa' },
  { id: 12, char: 'し', romanji: 'shi' },
  { id: 13, char: 'す', romanji: 'su' },
  { id: 14, char: 'せ', romanji: 'se' },
  { id: 15, char: 'そ', romanji: 'so' },
  { id: 16, char: 'た', romanji: 'ta' },
  { id: 17, char: 'ち', romanji: 'chi' },
  { id: 18, char: 'つ', romanji: 'tsu' },
  { id: 19, char: 'て', romanji: 'te' },
  { id: 20, char: 'と', romanji: 'to' },
  { id: 21, char: 'な', romanji: 'na' },
  { id: 22, char: 'に', romanji: 'ni' },
  { id: 23, char: 'ぬ', romanji: 'nu' },
  { id: 24, char: 'ね', romanji: 'ne' },
  { id: 25, char: 'の', romanji: 'no' },
  { id: 26, char: 'は', romanji: 'ha' },
  { id: 27, char: 'ひ', romanji: 'hi' },
  { id: 28, char: 'ふ', romanji: 'fu' },
  { id: 29, char: 'へ', romanji: 'he' },
  { id: 30, char: 'ほ', romanji: 'ho' },
  { id: 31, char: 'ま', romanji: 'ma' },
  { id: 32, char: 'み', romanji: 'mi' },
  { id: 33, char: 'む', romanji: 'mu' },
  { id: 34, char: 'め', romanji: 'me' },
  { id: 35, char: 'も', romanji: 'mo' },
  { id: 36, char: 'や', romanji: 'ya' },
  { id: 37, char: 'ゆ', romanji: 'yu' },
  { id: 38, char: 'よ', romanji: 'yo' },
  { id: 39, char: 'ら', romanji: 'ra' },
  { id: 40, char: 'り', romanji: 'ri' },
  { id: 41, char: 'る', romanji: 'ru' },
  { id: 42, char: 'れ', romanji: 're' },
  { id: 43, char: 'ろ', romanji: 'ro' },
  { id: 44, char: 'わ', romanji: 'wa' },
  { id: 45, char: 'を', romanji: 'wo' },
  { id: 46, char: 'ん', romanji: 'n' }
];

// Dữ liệu đầy đủ cho Katakana
const katakana = [
  { id: 101, char: 'ア', romanji: 'a' },
  { id: 102, char: 'イ', romanji: 'i' },
  { id: 103, char: 'ウ', romanji: 'u' },
  { id: 104, char: 'エ', romanji: 'e' },
  { id: 105, char: 'オ', romanji: 'o' },
  { id: 106, char: 'カ', romanji: 'ka' },
  { id: 107, char: 'キ', romanji: 'ki' },
  { id: 108, char: 'ク', romanji: 'ku' },
  { id: 109, char: 'ケ', romanji: 'ke' },
  { id: 110, char: 'コ', romanji: 'ko' },
  { id: 111, char: 'サ', romanji: 'sa' },
  { id: 112, char: 'シ', romanji: 'shi' },
  { id: 113, char: 'ス', romanji: 'su' },
  { id: 114, char: 'セ', romanji: 'se' },
  { id: 115, char: 'ソ', romanji: 'so' },
  { id: 116, char: 'タ', romanji: 'ta' },
  { id: 117, char: 'チ', romanji: 'chi' },
  { id: 118, char: 'ツ', romanji: 'tsu' },
  { id: 119, char: 'テ', romanji: 'te' },
  { id: 120, char: 'ト', romanji: 'to' },
  { id: 121, char: 'ナ', romanji: 'na' },
  { id: 122, char: 'ニ', romanji: 'ni' },
  { id: 123, char: 'ヌ', romanji: 'nu' },
  { id: 124, char: 'ネ', romanji: 'ne' },
  { id: 125, char: 'ノ', romanji: 'no' },
  { id: 126, char: 'ハ', romanji: 'ha' },
  { id: 127, char: 'ヒ', romanji: 'hi' },
  { id: 128, char: 'フ', romanji: 'fu' },
  { id: 129, char: 'ヘ', romanji: 'he' },
  { id: 130, char: 'ホ', romanji: 'ho' },
  { id: 131, char: 'マ', romanji: 'ma' },
  { id: 132, char: 'ミ', romanji: 'mi' },
  { id: 133, char: 'ム', romanji: 'mu' },
  { id: 134, char: 'メ', romanji: 'me' },
  { id: 135, char: 'モ', romanji: 'mo' },
  { id: 136, char: 'ヤ', romanji: 'ya' },
  { id: 137, char: 'ユ', romanji: 'yu' },
  { id: 138, char: 'ヨ', romanji: 'yo' },
  { id: 139, char: 'ラ', romanji: 'ra' },
  { id: 140, char: 'リ', romanji: 'ri' },
  { id: 141, char: 'ル', romanji: 'ru' },
  { id: 142, char: 'レ', romanji: 're' },
  { id: 143, char: 'ロ', romanji: 'ro' },
  { id: 144, char: 'ワ', romanji: 'wa' },
  { id: 145, char: 'ヲ', romanji: 'wo' },
  { id: 146, char: 'ン', romanji: 'n' }
];

// Dữ liệu Kanji
let kanji = [
  { id: 201, japaneseCharacter: '日', meaning: 'Mặt trời, Ngày', status: 'Active', audioURL: 'url/audio/nichi.mp3' },
  { id: 202, japaneseCharacter: '一', meaning: 'Một', status: 'Active', audioURL: 'url/audio/ichi.mp3' },
  { id: 203, japaneseCharacter: '人', meaning: 'Người', status: 'Draft', audioURL: 'url/audio/hito.mp3' },
  { id: 204, japaneseCharacter: '本', meaning: 'Sách, Gốc', status: 'Active', audioURL: 'url/audio/hon.mp3' },
  { id: 205, japaneseCharacter: '大', meaning: 'Lớn', status: 'Active', audioURL: 'url/audio/oo.mp3' },
  { id: 206, japaneseCharacter: '学', meaning: 'Học', status: 'Inactive', audioURL: 'url/audio/gaku.mp3' },
  { id: 207, japaneseCharacter: '水', meaning: 'Nước', status: 'Active', audioURL: 'url/audio/mizu.mp3' },
  { id: 208, japaneseCharacter: '金', meaning: 'Vàng, Tiền', status: 'Active', audioURL: 'url/audio/kin.mp3' },
  { id: 209, japaneseCharacter: '名', meaning: 'Tên', status: 'Draft', audioURL: 'url/audio/na.mp3' },
  { id: 210, japaneseCharacter: '何', meaning: 'Cái gì', status: 'Active', audioURL: 'url/audio/nani.mp3' },
];

// Hàm lấy dữ liệu
export const getHiragana = () => [...hiragana];
export const getKatakana = () => [...katakana];
export const getAllKanji = () => [...kanji];

// Hàm CRUD cho Kanji
export const addKanji = (newKanji) => {
  const newId = kanji.length > 0 ? Math.max(...kanji.map(k => k.id)) + 1 : 1;
  const kanjiToAdd = { ...newKanji, id: newId };
  kanji.push(kanjiToAdd);
};

export const updateKanji = (id, updatedKanji) => {
  const index = kanji.findIndex(k => k.id === id);
  if (index !== -1) {
    kanji[index] = { ...kanji[index], ...updatedKanji };
  }
};

export const deleteKanji = (id) => {
  kanji = kanji.filter(k => k.id !== id);
};