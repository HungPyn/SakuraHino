// src/services/exerciseService.js

// Dữ liệu bài tập mẫu (hardcoded data)
let exercises = [
  // Nối nghĩa (Matching)
  {
    id: 1,
    title: 'Nối từ vựng N5 cơ bản',
    topic: 'Từ vựng N5',
    level: 'N5',
    type: 'matching',
    status: 'Published',
    author: 'Admin',
    date: '2024-06-20',
    pairs: [
      { left: '食べる (taberu)', right: 'Ăn' },
      { left: '飲む (nomu)', right: 'Uống' },
      { left: '見る (miru)', right: 'Nhìn' },
      { left: '聞く (kiku)', right: 'Nghe' },
      { left: '話す (hanasu)', right: 'Nói' }
    ],
  },
  {
    id: 2,
    title: 'Ghép câu giao tiếp cơ bản',
    topic: 'Giao tiếp hàng ngày',
    level: 'N4',
    type: 'matching',
    status: 'Draft',
    author: 'Admin',
    date: '2024-06-18',
    pairs: [
      { left: 'おはようございます', right: 'Chào buổi sáng' },
      { left: 'おやすみなさい', right: 'Chúc ngủ ngon' },
      { left: 'ありがとうございます', right: 'Cảm ơn rất nhiều' }
    ],
  },
  // Điền từ (Fill-in-the-blanks)
  {
    id: 3,
    title: 'Hoàn thành câu với trợ từ',
    topic: 'Ngữ pháp N5',
    level: 'N5',
    type: 'fill_in_the_blanks',
    status: 'Published',
    author: 'Admin',
    date: '2024-06-22',
    sentence: '私は___です。 (Tôi là học sinh.)',
    correctAnswer: '学生',
    hint: 'Chỉ người/nghề nghiệp',
  },
  {
    id: 4,
    title: 'Điền từ còn thiếu vào câu',
    topic: 'Ngữ pháp N4',
    level: 'N4',
    type: 'fill_in_the_blanks',
    status: 'Published',
    author: 'Admin',
    date: '2024-06-21',
    sentence: '公園___行きます。 (Tôi đi đến công viên.)',
    correctAnswer: 'へ',
    hint: 'Trợ từ chỉ hướng',
  },
  // Chọn từ (Multiple Choice)
  {
    id: 5,
    title: 'Chọn dạng động từ đúng',
    topic: 'Ngữ pháp N3',
    level: 'N3',
    type: 'multiple_choice',
    status: 'Published',
    author: 'Admin',
    date: '2024-06-19',
    question: '彼女は毎日日本語を___。',
    options: ['勉強します', '勉強した', '勉強しない', '勉強している'],
    correctAnswer: '勉強します',
    explanation: 'Hành động lặp lại hàng ngày cần dùng thì hiện tại/tương lai.',
  },
  {
    id: 6,
    title: 'Từ vựng phù hợp với câu',
    topic: 'Từ vựng N5',
    level: 'N5',
    type: 'multiple_choice',
    status: 'Draft',
    author: 'Admin',
    date: '2024-06-17',
    question: '水を___ください。',
    options: ['飲みます', '飲んで', '飲みますか', '飲みたがる'],
    correctAnswer: '飲んで',
    explanation: 'Dạng て + ください dùng để yêu cầu, nhờ vả.',
  },
  // Lưu ý (Notes/Tips)
  {
    id: 7,
    title: 'Mẹo học Kanji hiệu quả',
    topic: 'Mẹo học tập',
    level: 'All', // Có thể là "All" hoặc một cấp độ cụ thể nếu lưu ý cho cấp độ đó
    type: 'notes',
    status: 'Published',
    author: 'Admin',
    date: '2024-06-25',
    content: 'Để học Kanji hiệu quả, hãy cố gắng học theo bộ thủ (radicals) và tạo các câu chuyện hoặc hình ảnh liên tưởng. Lặp lại thường xuyên và viết nhiều lần để ghi nhớ sâu hơn.',
  },
  {
    id: 8,
    title: 'Lưu ý khi giao tiếp với người Nhật',
    topic: 'Văn hóa',
    level: 'N4',
    type: 'notes',
    status: 'Draft',
    author: 'Admin',
    date: '2024-06-24',
    content: 'Luôn cúi chào khi gặp gỡ, nói lời cảm ơn và xin lỗi đúng lúc. Tránh nói to nơi công cộng và luôn tôn trọng không gian cá nhân của người khác.',
  },
];

// Hàm tạo ID duy nhất
const generateUniqueId = () => {
  return Date.now() + Math.floor(Math.random() * 1000);
};

// Hàm lấy tất cả bài tập
const getAllExercises = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(exercises);
    }, 100); // Simulate network delay
  });
};

// Hàm thêm bài tập mới
const addExercise = (newExercise) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const exerciseToAdd = { ...newExercise, id: generateUniqueId() };
      exercises.push(exerciseToAdd);
      resolve(exerciseToAdd);
    }, 100);
  });
};

// Hàm cập nhật bài tập
const updateExercise = (updatedExercise) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = exercises.findIndex(ex => ex.id === updatedExercise.id);
      if (index !== -1) {
        exercises[index] = { ...exercises[index], ...updatedExercise }; // Merge existing with updated data
        resolve(exercises[index]);
      } else {
        reject(new Error('Bài tập không tìm thấy.'));
      }
    }, 100);
  });
};

// Hàm xóa bài tập
const deleteExercise = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const initialLength = exercises.length;
      exercises = exercises.filter(ex => ex.id !== id);
      if (exercises.length < initialLength) {
        resolve(true); // Deletion successful
      } else {
        reject(new Error('Bài tập không tìm thấy để xóa.'));
      }
    }, 100);
  });
};

export default {
  getAllExercises,
  addExercise,
  updateExercise,
  deleteExercise,
};
