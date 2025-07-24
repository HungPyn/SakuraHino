// src/services/lessonService.js

// Dữ liệu giả lập cho các bài học
// Trong thực tế, dữ liệu này sẽ được lấy từ một API backend
let mockLessons = [
  {
    id: 'l1',
    name: 'Bài 1: Giới thiệu bản thân',
    level: 'N5',
    topic: 'Chào hỏi cơ bản',
    description: 'Học cách tự giới thiệu bản thân và người khác.',
    imageUrl: 'https://via.placeholder.com/150/007bff/FFFFFF?text=Lesson+1',
    status: 'published',
    createdAt: new Date('2025-07-20T10:00:00Z'),
    updatedAt: new Date('2025-07-22T14:30:00Z'),
    vocabulary: [
      { japanese: '私', pronunciation: 'わたし', vietnamese: 'tôi', type: 'đại từ', example: '私は学生です。', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
      { japanese: 'あなた', pronunciation: 'あなた', vietnamese: 'bạn (ngôi thứ 2)', type: 'đại từ', example: 'あなたは先生ですか。', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
      { japanese: '名前', pronunciation: 'なまえ', vietnamese: 'tên', type: 'danh từ', example: 'お名前は何ですか。', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
    ],
    grammar: [
      { structure: 'Noun + は + Noun + です', explanation: 'Là cấu trúc cơ bản để giới thiệu hoặc xác nhận sự vật, sự việc.', example: '私は田中です。 (Tôi là Tanaka.)' },
      { structure: 'Noun + も', explanation: 'Cũng là, tương tự.', example: '私も学生です。 (Tôi cũng là học sinh.)' },
    ],
    listening: {
      title: 'Đoạn hội thoại giới thiệu',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
      script: 'A: こんにちは、田中です。\nB: こんにちは、山田です。',
      questions: [
        { questionText: 'Ai là Tanaka?', type: 'multiple_choice', options: ['A', 'B'], correctAnswer: 'A' },
        { questionText: 'Người B nói gì?', type: 'fill_in_blank', correctAnswer: 'こんにちは、山田です。' },
      ]
    },
    exercises: [
      {
        type: 'multiple_choice',
        question: 'Chọn từ đúng cho "tôi":',
        options: ['あなた', '私', '名前'],
        correctAnswer: '私',
        explanation: '私 (わたし) có nghĩa là "tôi".'
      },
      {
        type: 'fill_in_blank',
        question: 'Điền vào chỗ trống: 私は____です。 (tôi là học sinh)',
        correctAnswer: '学生',
        hintWords: '学生, 先生, 医者',
        explanation: 'Từ "học sinh" trong tiếng Nhật là 学生 (gakusei).'
      },
      {
        type: 'matching',
        question: 'Nối từ tiếng Nhật với nghĩa tiếng Việt:',
        pairs: [
          { a: '私', b: 'tôi' },
          { a: '名前', b: 'tên' }
        ],
        explanation: '私 là tôi, 名前 là tên.'
      },
      {
        type: 'rearrange_sentence',
        question: 'Sắp xếp các từ để tạo thành câu đúng: は, です, 先生, 田中',
        words: 'は, です, 先生, 田中',
        correctOrder: '3, 0, 2, 1', // 田中(3) は(0) 先生(2) です(1)
        explanation: 'Cấu trúc câu đúng là "Tanaka-san wa sensei desu".'
      }
    ]
  },
  {
    id: 'l2',
    name: 'Bài 2: Gia đình',
    level: 'N5',
    topic: 'Quan hệ gia đình',
    description: 'Tìm hiểu về các thành viên trong gia đình.',
    imageUrl: 'https://via.placeholder.com/150/ffc107/000000?text=Lesson+2',
    status: 'draft',
    createdAt: new Date('2025-07-19T09:00:00Z'),
    updatedAt: new Date('2025-07-21T11:00:00Z'),
    vocabulary: [
      { japanese: '父', pronunciation: 'ちち', vietnamese: 'bố (của mình)', type: 'danh từ', example: '私の父は医者です。', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
      { japanese: '母', pronunciation: 'はは', vietnamese: 'mẹ (của mình)', type: 'danh từ', example: '私の母は主婦です。', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
    ],
    grammar: [
      { structure: 'Noun + の + Noun', explanation: 'Dùng để chỉ sự sở hữu hoặc mối quan hệ.', example: '私の家族 (gia đình của tôi)' },
    ],
    listening: {
      title: 'Giới thiệu các thành viên',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
      script: 'これは私の家族です。父と母がいます。',
      questions: [
        { questionText: 'Trong đoạn hội thoại có những ai?', type: 'multiple_choice', options: ['Bố, mẹ', 'Anh, em', 'Bạn bè'], correctAnswer: 'Bố, mẹ' }
      ]
    },
    exercises: [
      {
        type: 'fill_in_blank',
        question: 'Điền vào chỗ trống: 私の____は医者です。 (bố của tôi là bác sĩ)',
        correctAnswer: '父',
        explanation: '父 có nghĩa là bố.'
      }
    ]
  },
   {
    id: 'l3',
    name: 'Bài 3: Mua sắm',
    level: 'N4',
    topic: 'Hoạt động hàng ngày',
    description: 'Học cách hỏi giá và mua sắm tại cửa hàng.',
    imageUrl: 'https://via.placeholder.com/150/28a745/FFFFFF?text=Lesson+3',
    status: 'published',
    createdAt: new Date('2025-07-18T10:00:00Z'),
    updatedAt: new Date('2025-07-20T14:30:00Z'),
    vocabulary: [
      { japanese: 'いくら', pronunciation: 'いくら', vietnamese: 'bao nhiêu tiền', type: 'phó từ', example: 'これはいくらですか。', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
      { japanese: '買います', pronunciation: 'かいます', vietnamese: 'mua', type: 'động từ', example: 'パンを買います。', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
    ],
    grammar: [
      { structure: 'Noun + を + Verb (transitive)', explanation: 'Chỉ đối tượng của hành động.', example: '水を飲みます。 (Uống nước.)' },
    ],
    listening: {
      title: 'Hội thoại ở cửa hàng',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
      script: '客: これをください。\n店員: はい、ありがとうございます。',
      questions: [
        { questionText: 'Khách hàng muốn gì?', type: 'fill_in_blank', correctAnswer: 'これ' },
      ]
    },
    exercises: [
      {
        type: 'multiple_choice',
        question: 'Từ "mua" là gì trong tiếng Nhật?',
        options: ['食べます', '買います', '飲みます'],
        correctAnswer: '買います',
        explanation: '買います (kaimasu) có nghĩa là "mua".'
      }
    ]
  },  {
    id: 'l3',
    name: 'Bài 3: Mua sắm',
    level: 'N4',
    topic: 'Hoạt động hàng ngày',
    description: 'Học cách hỏi giá và mua sắm tại cửa hàng.',
    imageUrl: 'https://via.placeholder.com/150/28a745/FFFFFF?text=Lesson+3',
    status: 'published',
    createdAt: new Date('2025-07-18T10:00:00Z'),
    updatedAt: new Date('2025-07-20T14:30:00Z'),
    vocabulary: [
      { japanese: 'いくら', pronunciation: 'いくら', vietnamese: 'bao nhiêu tiền', type: 'phó từ', example: 'これはいくらですか。', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
      { japanese: '買います', pronunciation: 'かいます', vietnamese: 'mua', type: 'động từ', example: 'パンを買います。', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
    ],
    grammar: [
      { structure: 'Noun + を + Verb (transitive)', explanation: 'Chỉ đối tượng của hành động.', example: '水を飲みます。 (Uống nước.)' },
    ],
    listening: {
      title: 'Hội thoại ở cửa hàng',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
      script: '客: これをください。\n店員: はい、ありがとうございます。',
      questions: [
        { questionText: 'Khách hàng muốn gì?', type: 'fill_in_blank', correctAnswer: 'これ' },
      ]
    },
    exercises: [
      {
        type: 'multiple_choice',
        question: 'Từ "mua" là gì trong tiếng Nhật?',
        options: ['食べます', '買います', '飲みます'],
        correctAnswer: '買います',
        explanation: '買います (kaimasu) có nghĩa là "mua".'
      }
    ]
  }
,
  {
    id: 'l3',
    name: 'Bài 3: Mua sắm',
    level: 'N4',
    topic: 'Hoạt động hàng ngày',
    description: 'Học cách hỏi giá và mua sắm tại cửa hàng.',
    imageUrl: 'https://via.placeholder.com/150/28a745/FFFFFF?text=Lesson+3',
    status: 'published',
    createdAt: new Date('2025-07-18T10:00:00Z'),
    updatedAt: new Date('2025-07-20T14:30:00Z'),
    vocabulary: [
      { japanese: 'いくら', pronunciation: 'いくら', vietnamese: 'bao nhiêu tiền', type: 'phó từ', example: 'これはいくらですか。', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
      { japanese: '買います', pronunciation: 'かいます', vietnamese: 'mua', type: 'động từ', example: 'パンを買います。', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
    ],
    grammar: [
      { structure: 'Noun + を + Verb (transitive)', explanation: 'Chỉ đối tượng của hành động.', example: '水を飲みます。 (Uống nước.)' },
    ],
    listening: {
      title: 'Hội thoại ở cửa hàng',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
      script: '客: これをください。\n店員: はい、ありがとうございます。',
      questions: [
        { questionText: 'Khách hàng muốn gì?', type: 'fill_in_blank', correctAnswer: 'これ' },
      ]
    },
    exercises: [
      {
        type: 'multiple_choice',
        question: 'Từ "mua" là gì trong tiếng Nhật?',
        options: ['食べます', '買います', '飲みます'],
        correctAnswer: '買います',
        explanation: '買います (kaimasu) có nghĩa là "mua".'
      }
    ]
  },
    {
    id: 'l3',
    name: 'Bài 3: Mua sắm',
    level: 'N4',
    topic: 'Hoạt động hàng ngày',
    description: 'Học cách hỏi giá và mua sắm tại cửa hàng.',
    imageUrl: 'https://via.placeholder.com/150/28a745/FFFFFF?text=Lesson+3',
    status: 'published',
    createdAt: new Date('2025-07-18T10:00:00Z'),
    updatedAt: new Date('2025-07-20T14:30:00Z'),
    vocabulary: [
      { japanese: 'いくら', pronunciation: 'いくら', vietnamese: 'bao nhiêu tiền', type: 'phó từ', example: 'これはいくらですか。', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
      { japanese: '買います', pronunciation: 'かいます', vietnamese: 'mua', type: 'động từ', example: 'パンを買います。', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
    ],
    grammar: [
      { structure: 'Noun + を + Verb (transitive)', explanation: 'Chỉ đối tượng của hành động.', example: '水を飲みます。 (Uống nước.)' },
    ],
    listening: {
      title: 'Hội thoại ở cửa hàng',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
      script: '客: これをください。\n店員: はい、ありがとうございます。',
      questions: [
        { questionText: 'Khách hàng muốn gì?', type: 'fill_in_blank', correctAnswer: 'これ' },
      ]
    },
    exercises: [
      {
        type: 'multiple_choice',
        question: 'Từ "mua" là gì trong tiếng Nhật?',
        options: ['食べます', '買います', '飲みます'],
        correctAnswer: '買います',
        explanation: '買います (kaimasu) có nghĩa là "mua".'
      }
    ]
  },
    {
    id: 'l3',
    name: 'Bài 3: Mua sắm',
    level: 'N4',
    topic: 'Hoạt động hàng ngày',
    description: 'Học cách hỏi giá và mua sắm tại cửa hàng.',
    imageUrl: 'https://via.placeholder.com/150/28a745/FFFFFF?text=Lesson+3',
    status: 'published',
    createdAt: new Date('2025-07-18T10:00:00Z'),
    updatedAt: new Date('2025-07-20T14:30:00Z'),
    vocabulary: [
      { japanese: 'いくら', pronunciation: 'いくら', vietnamese: 'bao nhiêu tiền', type: 'phó từ', example: 'これはいくらですか。', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
      { japanese: '買います', pronunciation: 'かいます', vietnamese: 'mua', type: 'động từ', example: 'パンを買います。', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
    ],
    grammar: [
      { structure: 'Noun + を + Verb (transitive)', explanation: 'Chỉ đối tượng của hành động.', example: '水を飲みます。 (Uống nước.)' },
    ],
    listening: {
      title: 'Hội thoại ở cửa hàng',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
      script: '客: これをください。\n店員: はい、ありがとうございます。',
      questions: [
        { questionText: 'Khách hàng muốn gì?', type: 'fill_in_blank', correctAnswer: 'これ' },
      ]
    },
    exercises: [
      {
        type: 'multiple_choice',
        question: 'Từ "mua" là gì trong tiếng Nhật?',
        options: ['食べます', '買います', '飲みます'],
        correctAnswer: '買います',
        explanation: '買います (kaimasu) có nghĩa là "mua".'
      }
    ]
  },
    {
    id: 'l3',
    name: 'Bài 3: Mua sắm',
    level: 'N4',
    topic: 'Hoạt động hàng ngày',
    description: 'Học cách hỏi giá và mua sắm tại cửa hàng.',
    imageUrl: 'https://via.placeholder.com/150/28a745/FFFFFF?text=Lesson+3',
    status: 'published',
    createdAt: new Date('2025-07-18T10:00:00Z'),
    updatedAt: new Date('2025-07-20T14:30:00Z'),
    vocabulary: [
      { japanese: 'いくら', pronunciation: 'いくら', vietnamese: 'bao nhiêu tiền', type: 'phó từ', example: 'これはいくらですか。', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
      { japanese: '買います', pronunciation: 'かいます', vietnamese: 'mua', type: 'động từ', example: 'パンを買います。', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
    ],
    grammar: [
      { structure: 'Noun + を + Verb (transitive)', explanation: 'Chỉ đối tượng của hành động.', example: '水を飲みます。 (Uống nước.)' },
    ],
    listening: {
      title: 'Hội thoại ở cửa hàng',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
      script: '客: これをください。\n店員: はい、ありがとうございます。',
      questions: [
        { questionText: 'Khách hàng muốn gì?', type: 'fill_in_blank', correctAnswer: 'これ' },
      ]
    },
    exercises: [
      {
        type: 'multiple_choice',
        question: 'Từ "mua" là gì trong tiếng Nhật?',
        options: ['食べます', '買います', '飲みます'],
        correctAnswer: '買います',
        explanation: '買います (kaimasu) có nghĩa là "mua".'
      }
    ]
  },  {
    id: 'l3',
    name: 'Bài 3: Mua sắm',
    level: 'N4',
    topic: 'Hoạt động hàng ngày',
    description: 'Học cách hỏi giá và mua sắm tại cửa hàng.',
    imageUrl: 'https://via.placeholder.com/150/28a745/FFFFFF?text=Lesson+3',
    status: 'published',
    createdAt: new Date('2025-07-18T10:00:00Z'),
    updatedAt: new Date('2025-07-20T14:30:00Z'),
    vocabulary: [
      { japanese: 'いくら', pronunciation: 'いくら', vietnamese: 'bao nhiêu tiền', type: 'phó từ', example: 'これはいくらですか。', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
      { japanese: '買います', pronunciation: 'かいます', vietnamese: 'mua', type: 'động từ', example: 'パンを買います。', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
    ],
    grammar: [
      { structure: 'Noun + を + Verb (transitive)', explanation: 'Chỉ đối tượng của hành động.', example: '水を飲みます。 (Uống nước.)' },
    ],
    listening: {
      title: 'Hội thoại ở cửa hàng',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
      script: '客: これをください。\n店員: はい、ありがとうございます。',
      questions: [
        { questionText: 'Khách hàng muốn gì?', type: 'fill_in_blank', correctAnswer: 'これ' },
      ]
    },
    exercises: [
      {
        type: 'multiple_choice',
        question: 'Từ "mua" là gì trong tiếng Nhật?',
        options: ['食べます', '買います', '飲みます'],
        correctAnswer: '買います',
        explanation: '買います (kaimasu) có nghĩa là "mua".'
      }
    ]
  }
  
];


// --- Helper function để mô phỏng độ trễ của API ---
const simulateApiDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- API functions ---

/**
 * Lấy tất cả các bài học.
 * @returns {Promise<Array>} Danh sách các bài học.
 */
async function getAllLessons() {
  await simulateApiDelay(300); // Simulate network delay
  // Khi lấy toàn bộ danh sách, chúng ta có thể tạo các trường tiện ích
  // để hiển thị trên bảng, ví dụ: đếm số lượng thành phần con.
  return mockLessons.map(lesson => ({
    ...lesson,
    hasVocabulary: lesson.vocabulary && lesson.vocabulary.length > 0,
    hasGrammar: lesson.grammar && lesson.grammar.length > 0,
    hasListening: lesson.listening && lesson.listening.audioUrl, // Kiểm tra có audio
    hasExercises: lesson.exercises && lesson.exercises.length > 0,
    // Để cho mục đích sắp xếp, chúng ta sẽ trả về ngày thật
    // updatedAt: lesson.updatedAt // Đã có trong spread ...lesson
  }));
}

/**
 * Lấy một bài học theo ID.
 * @param {string} id ID của bài học.
 * @returns {Promise<Object|null>} Bài học tìm thấy hoặc null nếu không tìm thấy.
 */
async function getLessonById(id) {
  await simulateApiDelay(200);
  return mockLessons.find(lesson => lesson.id === id);
}

/**
 * Tạo một bài học mới.
 * @param {Object} newLessonData Dữ liệu của bài học mới.
 * @returns {Promise<Object>} Bài học đã được tạo với ID mới.
 */
async function createLesson(newLessonData) {
  await simulateApiDelay(400);
  const newId = 'l' + (mockLessons.length + 1); // Tạo ID đơn giản
  const now = new Date();
  const lessonToSave = {
    ...newLessonData,
    id: newId,
    createdAt: now,
    updatedAt: now,
    // Đảm bảo các mảng và đối tượng con luôn tồn tại
    vocabulary: newLessonData.vocabulary || [],
    grammar: newLessonData.grammar || [],
    listening: newLessonData.listening || { title: '', audioUrl: '', script: '', questions: [] },
    exercises: newLessonData.exercises || []
  };
  mockLessons.push(lessonToSave);
  return lessonToSave;
}

/**
 * Cập nhật một bài học hiện có.
 * @param {string} id ID của bài học cần cập nhật.
 * @param {Object} updatedLessonData Dữ liệu cập nhật.
 * @returns {Promise<Object|null>} Bài học đã được cập nhật hoặc null nếu không tìm thấy.
 */
async function updateLesson(id, updatedLessonData) {
  await simulateApiDelay(400);
  const index = mockLessons.findIndex(lesson => lesson.id === id);
  if (index !== -1) {
    const now = new Date();
    const updatedLesson = {
      ...mockLessons[index], // Giữ lại các trường không được cập nhật (vd: createdAt)
      ...updatedLessonData,
      updatedAt: now // Cập nhật thời gian cuối cùng sửa đổi
    };
    mockLessons[index] = updatedLesson;
    return updatedLesson;
  }
  return null;
}

/**
 * Xóa một bài học theo ID.
 * @param {string} id ID của bài học cần xóa.
 * @returns {Promise<boolean>} True nếu xóa thành công, false nếu không tìm thấy.
 */
async function deleteLesson(id) {
  await simulateApiDelay(200);
  const initialLength = mockLessons.length;
  mockLessons = mockLessons.filter(lesson => lesson.id !== id);
  return mockLessons.length < initialLength; // True if an item was removed
}

// Xuất các hàm API
export default {
  getAllLessons,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson
};