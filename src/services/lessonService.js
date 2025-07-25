// src/services/lessonService.js

import topicService from './topicService';

// Dữ liệu giả lập cho các bài học
// Đã thêm mock data với topic_id liên kết và các trường con rỗng
let lessons = [
  {
    id: 1, name: 'Chào hỏi cơ bản', level: 'N5', topic_id: 1, // Giao tiếp cơ bản
    description: 'Học các câu chào hỏi thông dụng hàng ngày và cách giới thiệu bản thân.', imageUrl: 'https://via.placeholder.com/150/007bff/FFFFFF?text=Lesson+1',
    status: 'published', createdAt: '2025-07-20T08:00:00Z', updatedAt: '2025-07-20T08:00:00Z',
    hasVocabulary: true, hasGrammar: false, hasListening: true, hasExercises: true,
    vocabulary: [
      { japanese: 'おはようございます', pronunciation: 'Ohayou gozaimasu', vietnamese: 'Chào buổi sáng', type: 'Chào hỏi', example: '先生、おはようございます。', audioUrl: 'https://cdn.jsdelivr.net/gh/tuyenvn/audio/ohayougozaimasu.mp3' },
      { japanese: 'こんにちは', pronunciation: 'Konnichiwa', vietnamese: 'Chào buổi trưa/chiều', type: 'Chào hỏi', example: '皆さん、こんにちは。', audioUrl: 'https://cdn.jsdelivr.net/gh/tuyenvn/audio/konnichiwa.mp3' },
      { japanese: 'こんばんは', pronunciation: 'Konbanwa', vietnamese: 'Chào buổi tối', type: 'Chào hỏi', example: 'こんばんは。お元気ですか。', audioUrl: 'https://cdn.jsdelivr.net/gh/tuyenvn/audio/konbanwa.mp3' }
    ],
    grammar: [],
    listening: {
      title: 'Hội thoại ngắn: Giới thiệu bản thân',
      audioUrl: 'https://cdn.jsdelivr.net/gh/tuyenvn/audio/dialog_self_intro.mp3',
      script: 'A: はじめまして。田中です。\nB: 山田です。どうぞよろしくお願いします。\nA: こちらこそ。',
      questions: [
        { questionText: 'Ai là người giới thiệu bản thân trước?', type: 'multiple_choice', options: ['Tanaka', 'Yamada'], correctAnswer: 'Tanaka' },
        { questionText: 'Họ của người thứ hai là gì?', type: 'fill_in_blank', correctAnswer: 'Yamada' }
      ]
    },
    exercises: [
      {
        type: 'multiple_choice', question: 'Chọn câu chào buổi sáng đúng:',
        options: ['こんにちは', 'おはようございます', 'こんばんは'], correctAnswer: 'おはようございます', explanation: 'おはようございます dùng để chào buổi sáng.'
      },
      {
        type: 'fill_in_blank', question: 'Điền từ còn thiếu: 「___ 元気ですか？」',
        correctAnswer: 'お', hintWords: 'お, は, で', explanation: 'Câu hỏi "Bạn khỏe không?" là "お元気ですか?"'
      }
    ]
  },
  {
    id: 2, name: 'Động từ thể ます (Masu form)', level: 'N5', topic_id: 2, // Ngữ pháp N5
    description: 'Tìm hiểu cách chia động từ sang thể ます và ứng dụng trong câu khẳng định/phủ định.', imageUrl: 'https://via.placeholder.com/150/28a745/FFFFFF?text=Lesson+2',
    status: 'draft', createdAt: '2025-07-18T10:30:00Z', updatedAt: '2025-07-22T14:45:00Z',
    hasVocabulary: false, hasGrammar: true, hasListening: false, hasExercises: true,
    vocabulary: [],
    grammar: [
      { structure: 'V-ます', explanation: 'Là thể lịch sự của động từ. Dùng trong câu khẳng định hiện tại/tương lai.', example: '食べます (tabemasu) - ăn; 飲みます (nomimasu) - uống' },
      { structure: 'V-ません', explanation: 'Thể phủ định của động từ lịch sự.', example: '食べません (tabemasen) - không ăn; 飲みません (nomimasen) - không uống' }
    ],
    listening: { title: '', audioUrl: '', script: '', questions: [] },
    exercises: [
      { type: 'rearrange_sentence', question: 'Sắp xếp câu: "Tôi ăn cơm." (ごはん, 私は, 食べます, を)', words: 'ごはん, 私は, 食べます, を', correctOrder: '1,0,3,2', explanation: 'Cấu trúc câu: S + O + V.' },
      { type: 'matching', question: 'Nối động từ với thể Masu của nó.', pairs: [{ a: '行く (iku)', b: '行きます (ikimasu)' }, { a: '食べる (taberu)', b: '食べます (tabemasu)' }] }
    ]
  },
  {
    id: 3, name: 'Danh từ và số đếm', level: 'N5', topic_id: 2, // Ngữ pháp N5
    description: 'Học cách sử dụng danh từ và các cách đếm số trong tiếng Nhật, giới thiệu trợ từ "と".', imageUrl: 'https://via.placeholder.com/150/dc3545/FFFFFF?text=Lesson+3',
    status: 'published', createdAt: '2025-07-15T09:00:00Z', updatedAt: '2025-07-23T11:00:00Z',
    hasVocabulary: true, hasGrammar: true, hasListening: false, hasExercises: true,
    vocabulary: [
      { japanese: '学生', pronunciation: 'gakusei', vietnamese: 'học sinh', type: 'Danh từ', example: '私は学生です。', audioUrl: '' },
      { japanese: '先生', pronunciation: 'sensei', vietnamese: 'giáo viên', type: 'Danh từ', example: '彼は先生です。', audioUrl: '' },
      { japanese: '一人', pronunciation: 'hitori', vietnamese: 'một người', type: 'Số đếm', example: '一人います。', audioUrl: '' }
    ],
    grammar: [
      { structure: 'N1 と N2', explanation: 'Liệt kê danh từ "N1 và N2".', example: '私と友達 (tôi và bạn bè)' }
    ],
    listening: { title: '', audioUrl: '', script: '', questions: [] },
    exercises: []
  },
  {
    id: 4, name: 'Từ vựng gia đình', level: 'N4', topic_id: 3, // Từ vựng N4
    description: 'Học các từ vựng về thành viên gia đình và cách xưng hô.', imageUrl: 'https://via.placeholder.com/150/ffc107/FFFFFF?text=Lesson+4',
    status: 'published', createdAt: '2025-07-10T13:00:00Z', updatedAt: '2025-07-21T10:00:00Z',
    hasVocabulary: true, hasGrammar: false, hasListening: false, hasExercises: true,
    vocabulary: [
      { japanese: '父', pronunciation: 'chichi', vietnamese: 'bố (của mình)', type: 'Danh từ', example: '私の父は医者です。', audioUrl: '' },
      { japanese: '母', pronunciation: 'haha', vietnamese: 'mẹ (của mình)', type: 'Danh từ', example: '私の母は主婦です。', audioUrl: '' },
      { japanese: 'お兄さん', pronunciation: 'oniisan', vietnamese: 'anh trai (của người khác)', type: 'Danh từ', example: '彼のお兄さんは優しいです。', audioUrl: '' }
    ],
    grammar: [], listening: { title: '', audioUrl: '', script: '', questions: [] }, exercises: []
  },
  {
    id: 5, name: 'Động từ thể て (Te form)', level: 'N4', topic_id: 2, // Ngữ pháp N5
    description: 'Nắm vững cách chia và ứng dụng của thể て trong các cấu trúc ngữ pháp cơ bản.', imageUrl: 'https://via.placeholder.com/150/17a2b8/FFFFFF?text=Lesson+5',
    status: 'published', createdAt: '2025-07-05T09:30:00Z', updatedAt: '2025-07-20T16:00:00Z',
    hasVocabulary: false, hasGrammar: true, hasListening: false, hasExercises: true,
    vocabulary: [],
    grammar: [
      { structure: 'V-て います', explanation: 'Diễn tả hành động đang diễn ra hoặc trạng thái.', example: '食べています (đang ăn); 住んでいます (đang sống)' },
      { structure: 'V-て ください', explanation: 'Yêu cầu, đề nghị lịch sự.', example: '座ってください (Hãy ngồi xuống.)' }
    ],
    listening: { title: '', audioUrl: '', script: '', questions: [] }, exercises: []
  },
  {
    id: 6, name: 'Kanji cơ bản (Số và hướng)', level: 'N3', topic_id: 4, // Kanji N3 nâng cao
    description: 'Giới thiệu các Kanji cơ bản liên quan đến số và hướng, cách đọc và ví dụ.', imageUrl: 'https://via.placeholder.com/150/6c757d/FFFFFF?text=Lesson+6',
    status: 'draft', createdAt: '2025-06-25T11:00:00Z', updatedAt: '2025-07-19T09:00:00Z',
    hasVocabulary: false, hasGrammar: false, hasListening: false, hasExercises: true,
    vocabulary: [], grammar: [], listening: { title: '', audioUrl: '', script: '', questions: [] }, exercises: []
  },
  {
    id: 7, name: 'Luyện nghe tin tức', level: 'N2', topic_id: 5, // Luyện nghe N2
    description: 'Luyện kỹ năng nghe qua các đoạn tin tức ngắn, tập trung vào từ khóa và ý chính.', imageUrl: 'https://via.placeholder.com/150/fd7e14/FFFFFF?text=Lesson+7',
    status: 'published', createdAt: '2025-06-15T15:00:00Z', updatedAt: '2025-07-18T10:00:00Z',
    hasVocabulary: false, hasGrammar: false, hasListening: true, hasExercises: true,
    vocabulary: [], grammar: [], listening: { title: 'Tin tức kinh tế buổi sáng', audioUrl: 'https://cdn.jsdelivr.net/gh/tuyenvn/audio/news_dialog.mp3', script: '今日のニュースです。経済は回復傾向にあります。', questions: [{ questionText: 'Tin tức nói về chủ đề gì?', type: 'multiple_choice', options: ['Thời tiết', 'Kinh tế', 'Thể thao'], correctAnswer: 'Kinh tế' }] }, exercises: []
  },
  // 10 bài học cho chủ đề "Nhà cửa" (topic_id: 6)
  { id: 8, name: 'Các phòng trong nhà', level: 'N5', topic_id: 6, description: 'Từ vựng về các loại phòng trong nhà và công dụng của chúng.', imageUrl: 'https://via.placeholder.com/150/FF6347/FFFFFF?text=House+1', status: 'published', createdAt: '2025-07-01T08:00:00Z', updatedAt: '2025-07-01T08:00:00Z', hasVocabulary: true, hasGrammar: false, hasListening: false, hasExercises: true, vocabulary:[{japanese:'部屋', pronunciation:'heya', vietnamese:'phòng'}], grammar:[], listening:{}, exercises:[] },
  { id: 9, name: 'Nội thất cơ bản', level: 'N5', topic_id: 6, description: 'Từ vựng về bàn, ghế, giường và các vật dụng nội thất thiết yếu.', imageUrl: 'https://via.placeholder.com/150/4682B4/FFFFFF?text=House+2', status: 'published', createdAt: '2025-07-02T09:00:00Z', updatedAt: '2025-07-02T09:00:00Z', hasVocabulary: true, hasGrammar: false, hasListening: false, hasExercises: true, vocabulary:[{japanese:'椅子', pronunciation:'isu', vietnamese:'ghế'}], grammar:[], listening:{}, exercises:[] },
  { id: 10, name: 'Đồ dùng nhà bếp', level: 'N5', topic_id: 6, description: 'Từ vựng các dụng cụ bếp núc thông thường.', imageUrl: 'https://via.placeholder.com/150/DAA520/FFFFFF?text=House+3', status: 'published', createdAt: '2025-07-03T10:00:00Z', updatedAt: '2025-07-03T10:00:00Z', hasVocabulary: true, hasGrammar: false, hasListening: false, hasExercises: true, vocabulary:[{japanese:'お皿', pronunciation:'osara', vietnamese:'cái đĩa'}], grammar:[], listening:{}, exercises:[] },
  { id: 11, name: 'Hoạt động hàng ngày ở nhà', level: 'N5', topic_id: 6, description: 'Các động từ chỉ hoạt động sinh hoạt hàng ngày trong gia đình.', imageUrl: 'https://via.placeholder.com/150/9370DB/FFFFFF?text=House+4', status: 'published', createdAt: '2025-07-04T11:00:00Z', updatedAt: '2025-07-04T11:00:00Z', hasVocabulary: true, hasGrammar: true, hasListening: false, hasExercises: true, vocabulary:[{japanese:'掃除します', pronunciation:'soujishimasu', vietnamese:'dọn dẹp'}], grammar:[{structure:'V-ます', explanation:'Diễn tả hành động thường xuyên'}], listening:{}, exercises:[] },
  { id: 12, name: 'Mô tả nhà cửa', level: 'N4', topic_id: 6, description: 'Sử dụng tính từ để mô tả không gian và cảm nhận về ngôi nhà.', imageUrl: 'https://via.placeholder.com/150/FFD700/FFFFFF?text=House+5', status: 'published', createdAt: '2025-07-05T12:00:00Z', updatedAt: '2025-07-05T12:00:00Z', hasVocabulary: true, hasGrammar: true, hasListening: false, hasExercises: true, vocabulary:[{japanese:'広い', pronunciation:'hiroi', vietnamese:'rộng'}], grammar:[{structure:'い-Adj + です', explanation:'Mô tả tính từ i-adj'}], listening:{}, exercises:[] },
  { id: 13, name: 'Các thiết bị điện tử', level: 'N4', topic_id: 6, description: 'Tên các thiết bị điện tử gia dụng và cách sử dụng cơ bản.', imageUrl: 'https://via.placeholder.com/150/ADFF2F/FFFFFF?text=House+6', status: 'published', createdAt: '2025-07-06T13:00:00Z', updatedAt: '2025-07-06T13:00:00Z', hasVocabulary: true, hasGrammar: false, hasListening: false, hasExercises: true, vocabulary:[{japanese:'テレビ', pronunciation:'terebi', vietnamese:'TV'}], grammar:[], listening:{}, exercises:[] },
  { id: 14, name: 'Sửa chữa và bảo trì', level: 'N3', topic_id: 6, description: 'Từ vựng và cụm từ liên quan đến việc sửa chữa và bảo trì nhà cửa.', imageUrl: 'https://via.placeholder.com/150/FF4500/FFFFFF?text=House+7', status: 'draft', createdAt: '2025-07-07T14:00:00Z', updatedAt: '2025-07-07T14:00:00Z', hasVocabulary: true, hasGrammar: false, hasListening: false, hasExercises: true, vocabulary:[{japanese:'修理します', pronunciation:'shuurishimasu', vietnamese:'sửa chữa'}], grammar:[], listening:{}, exercises:[] },
  { id: 15, name: 'Thuê nhà và chuyển nhà', level: 'N3', topic_id: 6, description: 'Các cụm từ cần thiết khi tìm kiếm, thuê và chuyển nhà ở Nhật Bản.', imageUrl: 'https://via.placeholder.com/150/8A2BE2/FFFFFF?text=House+8', status: 'published', createdAt: '2025-07-08T15:00:00Z', updatedAt: '2025-07-08T15:00:00Z', hasVocabulary: true, hasGrammar: true, hasListening: true, hasExercises: true, vocabulary:[{japanese:'引っ越し', pronunciation:'hikkoshi', vietnamese:'chuyển nhà'}], grammar:[{structure:'N に 引っ越します', explanation:'Chuyển đến N'}], listening:{title:'Hội thoại: Thuê nhà', audioUrl:'https://cdn.jsdelivr.net/gh/tuyenvn/audio/rent_house.mp3', script:'すみません、アパートを探しています。', questions:[]}, exercises:[] },
  { id: 16, name: 'Khu vực xung quanh nhà', level: 'N2', topic_id: 6, description: 'Từ vựng về vườn, ban công, sân thượng và các khu vực lân cận nhà.', imageUrl: 'https://via.placeholder.com/150/20B2AA/FFFFFF?text=House+9', status: 'published', createdAt: '2025-07-09T16:00:00Z', updatedAt: '2025-07-09T16:00:00Z', hasVocabulary: true, hasGrammar: false, hasListening: false, hasExercises: true, vocabulary:[{japanese:'庭', pronunciation:'niwa', vietnamese:'vườn'}], grammar:[], listening:{}, exercises:[] },
  { id: 17, name: 'Các phong tục trong nhà', level: 'N2', topic_id: 6, description: 'Nói về các thói quen và phong tục truyền thống trong gia đình Nhật Bản.', imageUrl: 'https://via.placeholder.com/150/6A5ACD/FFFFFF?text=House+10', status: 'draft', createdAt: '2025-07-10T17:00:00Z', updatedAt: '2025-07-10T17:00:00Z', hasVocabulary: true, hasGrammar: true, hasListening: true, hasExercises: true, vocabulary:[{japanese:'畳', pronunciation:'tatami', vietnamese:'chiếu tatami'}], grammar:[{structure:'〜ては いけません', explanation:'Không được phép làm gì'}], listening:{title:'Thảo luận về phong tục', audioUrl:'https://cdn.jsdelivr.net/gh/tuyenvn/audio/customs_dialog.mp3', script:'日本では、家に入る時、靴を脱ぎます。', questions:[]}, exercises:[] },
];

// Hàm giả lập để tìm ID lớn nhất cho việc tạo ID mới
function getNextLessonId() {
  return lessons.length > 0 ? Math.max(...lessons.map(l => l.id)) + 1 : 1;
}

const lessonService = {
  /**
   * Hàm nội bộ để "join" thông tin topicName và topicImage vào bài học
   * từ topicService, giúp hiển thị dễ dàng hơn.
   * @param {Array} lessonList - Danh sách bài học cần xử lý.
   * @returns {Promise<Array>} Danh sách bài học với thông tin chủ đề.
   */
  _getLessonsWithTopicInfo: async (lessonList) => {
    const allTopics = await topicService.getAllTopics();
    return lessonList.map(lesson => {
      const topic = allTopics.find(t => t.id === lesson.topic_id);
      return {
        ...lesson,
        topicName: topic ? topic.name : 'Chủ đề không xác định',
        topicImage: topic ? topic.url_image : ''
      };
    });
  },

  /**
   * Hàm nội bộ để lấy trực tiếp mảng mock lessons, dùng cho việc tính toán số lượng
   * bài học theo chủ đề mà không cần fetch toàn bộ dữ liệu kèm topic info.
   * @returns {Array} Mảng lessons gốc.
   */
  _getMockLessons: () => lessons,

  /**
   * Lấy tất cả bài học.
   * @returns {Promise<Array>} Danh sách tất cả bài học.
   */
  getAllLessons: async () => {
    return new Promise(async (resolve) => {
      setTimeout(async () => {
        const lessonsWithTopic = await lessonService._getLessonsWithTopicInfo(lessons);
        resolve([...lessonsWithTopic]); // Trả về bản sao
      }, 500); // Giả lập độ trễ API
    });
  },

  /**
   * Lấy một bài học theo ID.
   * @param {number} id - ID của bài học.
   * @returns {Promise<Object|null>} Bài học hoặc null nếu không tìm thấy.
   */
  getLessonById: async (id) => {
    return new Promise(async (resolve) => {
      setTimeout(async () => {
        const lesson = lessons.find(l => l.id === id);
        if (lesson) {
          const lessonsWithTopic = await lessonService._getLessonsWithTopicInfo([lesson]);
          resolve({ ...lessonsWithTopic[0] }); // Trả về bản sao
        } else {
          resolve(null);
        }
      }, 500);
    });
  },

  /**
   * Lấy danh sách bài học thuộc một chủ đề cụ thể.
   * @param {number} topicId - ID của chủ đề.
   * @returns {Promise<Array>} Danh sách bài học thuộc chủ đề đó.
   */
  getLessonsByTopicId: async (topicId) => {
    return new Promise(async (resolve) => {
      setTimeout(async () => {
        const lessonsInTopic = lessons.filter(l => l.topic_id === topicId);
        const lessonsWithTopic = await lessonService._getLessonsWithTopicInfo(lessonsInTopic);
        resolve([...lessonsWithTopic]); // Trả về bản sao
      }, 500);
    });
  },

  /**
   * Tạo một bài học mới.
   * Các cờ hasVocabulary, hasGrammar, v.v. sẽ được tự động tính toán.
   * @param {Object} newLesson - Dữ liệu bài học mới.
   * @returns {Promise<Object>} Bài học đã được tạo.
   */
  createLesson: async (newLesson) => {
    return new Promise(async (resolve) => {
      setTimeout(async () => {
        const id = getNextLessonId();
        const createdAt = new Date().toISOString();
        const createdLesson = {
          ...newLesson,
          id,
          createdAt,
          updatedAt: createdAt,
          // Tự động tính toán các cờ has... dựa trên dữ liệu đầu vào
          hasVocabulary: newLesson.vocabulary && newLesson.vocabulary.length > 0,
          hasGrammar: newLesson.grammar && newLesson.grammar.length > 0,
          hasListening: newLesson.listening && !!newLesson.listening.title && !!newLesson.listening.script, // Chỉ cần có tiêu đề và script
          hasExercises: newLesson.exercises && newLesson.exercises.length > 0,
        };
        lessons.push(createdLesson);
        const lessonsWithTopic = await lessonService._getLessonsWithTopicInfo([createdLesson]);
        resolve({ ...lessonsWithTopic[0] }); // Trả về bản sao của bài học đã tạo kèm thông tin chủ đề
      }, 500);
    });
  },

  /**
   * Cập nhật một bài học hiện có.
   * Các cờ hasVocabulary, hasGrammar, v.v. sẽ được tự động tính toán lại.
   * @param {number} id - ID của bài học cần cập nhật.
   * @param {Object} updatedLesson - Dữ liệu cập nhật cho bài học.
   * @returns {Promise<Object|null>} Bài học đã cập nhật hoặc null nếu không tìm thấy.
   */
  updateLesson: async (id, updatedLesson) => {
    return new Promise(async (resolve) => {
      setTimeout(async () => {
        const index = lessons.findIndex(l => l.id === id);
        if (index !== -1) {
          // Bảo toàn original createdAt, cập nhật updatedAt
          lessons[index] = {
            ...lessons[index],
            ...updatedLesson,
            updatedAt: new Date().toISOString(),
            // Cập nhật lại các cờ has... khi cập nhật
            hasVocabulary: updatedLesson.vocabulary && updatedLesson.vocabulary.length > 0,
            hasGrammar: updatedLesson.grammar && updatedLesson.grammar.length > 0,
            hasListening: updatedLesson.listening && !!updatedLesson.listening.title && !!updatedLesson.listening.script,
            hasExercises: updatedLesson.exercises && updatedLesson.exercises.length > 0,
          };
          const lessonsWithTopic = await lessonService._getLessonsWithTopicInfo([lessons[index]]);
          resolve({ ...lessonsWithTopic[0] }); // Trả về bản sao của bài học đã cập nhật kèm thông tin chủ đề
        } else {
          resolve(null);
        }
      }, 500);
    });
  },

  /**
   * Xóa một bài học.
   * @param {number} id - ID của bài học cần xóa.
   * @returns {Promise<boolean>} True nếu xóa thành công, false nếu không tìm thấy.
   */
  deleteLesson: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const initialLength = lessons.length;
        lessons = lessons.filter(l => l.id !== id);
        resolve(lessons.length < initialLength); // true nếu xóa thành công
      }, 500);
    });
  },
};

export default lessonService;