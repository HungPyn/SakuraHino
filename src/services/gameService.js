export const gameQuestions = [
  {
    id: 1,
    questionType: "text_based",
    questionText: "Loại quả nào có màu đỏ và hay xuất hiện vào mùa hè?",
    imageUrl: "",
    answer: "いちご",
    answerRomaji: "ichigo",
    level: "N5",
    topic: "Trái cây",
    updatedAt: "2024-06-20",
  },
  {
    id: 2,
    questionType: "text_based",
    questionText: "Con vật nào kêu 'meo meo'?",
    imageUrl: "",
    answer: "ねこ",
    answerRomaji: "neko",
    level: "N5",
    topic: "Động vật",
    updatedAt: "2024-06-18",
  },
  {
    id: 3,
    questionType: "text_based",
    questionText: "乗り物は何ですか？ (Phương tiện giao thông là gì?)",
    imageUrl: "",
    answer: "くるま",
    answerRomaji: "kuruma",
    level: "N4",
    topic: "Giao thông",
    updatedAt: "2024-06-22",
  },
  {
    id: 4,
    questionType: "text_based",
    questionText: "Con vật nào sủa 'gâu gâu'?",
    imageUrl: "",
    answer: "いぬ",
    answerRomaji: "inu",
    level: "N5",
    topic: "Động vật",
    updatedAt: "2024-06-21",
  },
  {
    id: 5,
    questionType: "text_based",
    questionText: "Quả màu vàng, vị chua, thường dùng làm nước giải khát?",
    imageUrl: "",
    answer: "レモン",
    answerRomaji: "remon",
    level: "N5",
    topic: "Trái cây",
    updatedAt: "2024-06-19",
  },
  {
    id: 6,
    questionType: "text_based",
    questionText: "Con vật nào có vòi dài?",
    imageUrl: "",
    answer: "ぞう",
    answerRomaji: "zou",
    level: "N4",
    topic: "Động vật",
    updatedAt: "2024-06-17",
  },
  {
    id: 7,
    questionType: "text_based",
    questionText: "Màu của bầu trời là gì?",
    imageUrl: "",
    answer: "あお",
    answerRomaji: "ao",
    level: "N5",
    topic: "Màu sắc",
    updatedAt: "2024-06-15",
  },
  {
    id: 8,
    questionType: "text_based",
    questionText: "Thủ đô của Nhật Bản là gì?",
    imageUrl: "",
    answer: "とうきょう",
    answerRomaji: "toukyou",
    level: "N3",
    topic: "Địa lý",
    updatedAt: "2024-06-14",
  },
  {
    id: 9,
    questionType: "text_based",
    questionText: "Cái gì dùng để viết?",
    imageUrl: "",
    answer: "ペン",
    answerRomaji: "pen",
    level: "N5",
    topic: "Đồ dùng học tập",
    updatedAt: "2024-06-13",
  },
  {
    id: 10,
    questionType: "text_based",
    questionText: "Mùa nào có tuyết rơi?",
    imageUrl: "",
    answer: "ふゆ",
    answerRomaji: "fuyu",
    level: "N4",
    topic: "Thời tiết",
    updatedAt: "2024-06-12",
  },
  {
    id: 11,
    questionType: "image_based",
    questionText: "",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/6/6e/Golde33443.jpg",
    answer: "きんぎょ",
    answerRomaji: "kingyo",
    level: "N5",
    topic: "Động vật",
    updatedAt: "2024-06-11",
  },
  {
    id: 12,
    questionType: "image_based",
    questionText: "",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Cat03.jpg",
    answer: "ねこ",
    answerRomaji: "neko",
    level: "N5",
    topic: "Động vật",
    updatedAt: "2024-06-10",
  },
  {
    id: 13,
    questionType: "image_based",
    questionText: "",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Apple.jpg",
    answer: "りんご",
    answerRomaji: "ringo",
    level: "N5",
    topic: "Trái cây",
    updatedAt: "2024-06-09",
  },
  {
    id: 14,
    questionType: "image_based",
    questionText: "",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Car.png",
    answer: "くるま",
    answerRomaji: "kuruma",
    level: "N4",
    topic: "Giao thông",
    updatedAt: "2024-06-08",
  },
  {
    id: 15,
    questionType: "image_based",
    questionText: "",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Pencil.png",
    answer: "えんぴつ",
    answerRomaji: "enpitsu",
    level: "N5",
    topic: "Đồ dùng học tập",
    updatedAt: "2024-06-07",
  },
];

export function getAllQuestions() {
  return [...gameQuestions];
}

// Thêm mới câu hỏi
export function addGameQuestion(question) {
  const newId = gameQuestions.length
    ? Math.max(...gameQuestions.map((q) => q.id)) + 1
    : 1;
  const newQuestion = { ...question, id: newId };
  gameQuestions.push(newQuestion);
  return newQuestion;
}

// Sửa câu hỏi
export function updateGameQuestion(question) {
  const idx = gameQuestions.findIndex((q) => q.id === question.id);
  if (idx !== -1) {
    gameQuestions[idx] = { ...question };
    return true;
  }
  return false;
}

// Xoá câu hỏi
export function deleteGameQuestion(id) {
  const idx = gameQuestions.findIndex((q) => q.id === id);
  if (idx !== -1) {
    gameQuestions.splice(idx, 1);
    return true;
  }
  return false;
}

// Export default để hỗ trợ import mặc định
export default {
  gameQuestions,
  getAllQuestions,
  addGameQuestion,
  updateGameQuestion,
  deleteGameQuestion,
};
