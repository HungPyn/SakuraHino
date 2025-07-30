// src/services/lessonService.js

import topicService from "./topicService";

// Dữ liệu giả lập cho các bài học
// Đã thêm mock data với topic_id liên kết và các trường con rỗng
let lessons = [
  {
    id: 1,
    topicId: 1,
    status: "PUBLISHED",
    position: 1,
    maxQuestion: 10,
    createAt: "2025-07-20T08:00:00Z",
    updateAt: "2025-07-20T08:00:00Z",
  },
  {
    id: 2,
    topicId: 2,
    status: "PENDING",
    position: 2,
    maxQuestion: 10,
    createAt: "2025-07-18T10:30:00Z",
    updateAt: "2025-07-22T14:45:00Z",
  },
  {
    id: 3,
    topicId: 2,
    status: "PUBLISHED",
    position: 3,
    maxQuestion: 10,
    createAt: "2025-07-15T09:00:00Z",
    updateAt: "2025-07-23T11:00:00Z",
  },
  {
    id: 4,
    topicId: 3,
    status: "PUBLISHED",
    position: 4,
    maxQuestion: 10,
    createAt: "2025-07-10T13:00:00Z",
    updateAt: "2025-07-21T10:00:00Z",
  },
  {
    id: 5,
    topicId: 2,
    status: "PUBLISHED",
    position: 5,
    maxQuestion: 10,
    createAt: "2025-07-05T09:30:00Z",
    updateAt: "2025-07-20T16:00:00Z",
  },
  {
    id: 6,
    topicId: 4,
    status: "PENDING",
    position: 6,
    maxQuestion: 10,
    createAt: "2025-06-25T11:00:00Z",
    updateAt: "2025-07-19T09:00:00Z",
  },
  {
    id: 7,
    topicId: 5,
    status: "PUBLISHED",
    position: 7,
    maxQuestion: 10,
    createAt: "2025-06-15T15:00:00Z",
    updateAt: "2025-07-18T10:00:00Z",
  },
  {
    id: 8,
    topicId: 6,
    status: "PUBLISHED",
    position: 8,
    maxQuestion: 10,
    createAt: "2025-07-01T08:00:00Z",
    updateAt: "2025-07-01T08:00:00Z",
  },
  {
    id: 9,
    topicId: 6,
    status: "PUBLISHED",
    position: 9,
    maxQuestion: 10,
    createAt: "2025-07-02T09:00:00Z",
    updateAt: "2025-07-02T09:00:00Z",
  },
  {
    id: 10,
    topicId: 6,
    status: "PUBLISHED",
    position: 10,
    maxQuestion: 10,
    createAt: "2025-07-03T10:00:00Z",
    updateAt: "2025-07-03T10:00:00Z",
  },
  {
    id: 11,
    topicId: 6,
    status: "PUBLISHED",
    position: 11,
    maxQuestion: 10,
    createAt: "2025-07-04T11:00:00Z",
    updateAt: "2025-07-04T11:00:00Z",
  },
  {
    id: 12,
    topicId: 6,
    status: "PUBLISHED",
    position: 12,
    maxQuestion: 10,
    createAt: "2025-07-05T12:00:00Z",
    updateAt: "2025-07-05T12:00:00Z",
  },
  {
    id: 13,
    topicId: 6,
    status: "PUBLISHED",
    position: 13,
    maxQuestion: 10,
    createAt: "2025-07-06T13:00:00Z",
    updateAt: "2025-07-06T13:00:00Z",
  },
  {
    id: 14,
    topicId: 6,
    status: "PENDING",
    position: 14,
    maxQuestion: 10,
    createAt: "2025-07-07T14:00:00Z",
    updateAt: "2025-07-07T14:00:00Z",
  },
  {
    id: 15,
    topicId: 6,
    status: "PUBLISHED",
    position: 15,
    maxQuestion: 10,
    createAt: "2025-07-08T15:00:00Z",
    updateAt: "2025-07-08T15:00:00Z",
  },
  {
    id: 16,
    topicId: 6,
    status: "PUBLISHED",
    position: 16,
    maxQuestion: 10,
    createAt: "2025-07-09T16:00:00Z",
    updateAt: "2025-07-09T16:00:00Z",
  },
  {
    id: 17,
    topicId: 6,
    status: "PENDING",
    position: 17,
    maxQuestion: 10,
    createAt: "2025-07-10T17:00:00Z",
    updateAt: "2025-07-10T17:00:00Z",
  },
];

// Hàm giả lập để tìm ID lớn nhất cho việc tạo ID mới
function getNextLessonId() {
  return lessons.length > 0 ? Math.max(...lessons.map((l) => l.id)) + 1 : 1;
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
    return lessonList.map((lesson) => {
      const topic = allTopics.find((t) => t.id === lesson.topic_id);
      return {
        ...lesson,
        topicName: topic ? topic.name : "Chủ đề không xác định",
        topicImage: topic ? topic.url_image : "",
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
        const lessonsWithTopic = await lessonService._getLessonsWithTopicInfo(
          lessons
        );
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
        const lesson = lessons.find((l) => l.id === id);
        if (lesson) {
          const lessonsWithTopic = await lessonService._getLessonsWithTopicInfo(
            [lesson]
          );
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
        const lessonsInTopic = lessons.filter((l) => l.topic_id === topicId);
        const lessonsWithTopic = await lessonService._getLessonsWithTopicInfo(
          lessonsInTopic
        );
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
          hasVocabulary:
            newLesson.vocabulary && newLesson.vocabulary.length > 0,
          hasGrammar: newLesson.grammar && newLesson.grammar.length > 0,
          hasListening:
            newLesson.listening &&
            !!newLesson.listening.title &&
            !!newLesson.listening.script, // Chỉ cần có tiêu đề và script
          hasExercises: newLesson.exercises && newLesson.exercises.length > 0,
        };
        lessons.push(createdLesson);
        const lessonsWithTopic = await lessonService._getLessonsWithTopicInfo([
          createdLesson,
        ]);
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
        const index = lessons.findIndex((l) => l.id === id);
        if (index !== -1) {
          // Bảo toàn original createdAt, cập nhật updatedAt
          lessons[index] = {
            ...lessons[index],
            ...updatedLesson,
            updatedAt: new Date().toISOString(),
            // Cập nhật lại các cờ has... khi cập nhật
            hasVocabulary:
              updatedLesson.vocabulary && updatedLesson.vocabulary.length > 0,
            hasGrammar:
              updatedLesson.grammar && updatedLesson.grammar.length > 0,
            hasListening:
              updatedLesson.listening &&
              !!updatedLesson.listening.title &&
              !!updatedLesson.listening.script,
            hasExercises:
              updatedLesson.exercises && updatedLesson.exercises.length > 0,
          };
          const lessonsWithTopic = await lessonService._getLessonsWithTopicInfo(
            [lessons[index]]
          );
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
        lessons = lessons.filter((l) => l.id !== id);
        resolve(lessons.length < initialLength); // true nếu xóa thành công
      }, 500);
    });
  },
};

export default lessonService;
