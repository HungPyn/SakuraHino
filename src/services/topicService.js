// src/services/topicService.js

// Dữ liệu giả lập cho các chủ đề
// Đã thêm 'description', 'status' và đổi 'create_at' thành 'createdAt', thêm 'updatedAt'
let topics = [
  {
    id: 1,
    name: "Giao tiếp cơ bản",
    urlImage: "https://cdn-icons-png.flaticon.com/512/2936/2936746.png", // Icon ví dụ
    createAt: "2025-01-10T10:00:00Z",
    updateAt: "2025-01-10T10:00:00Z",
    position: 1,
    maxLesson: 6,
    level: "cấp độ 5",
    status: "PUBLISHED", // 'active' hoặc 'inactive'
  },
  {
    id: 2,
    name: "Ngữ pháp N5",
    urlImage: "https://cdn-icons-png.flaticon.com/512/3067/3067406.png",
    createAt: "2025-02-15T11:30:00Z",
    updateAt: "2025-02-15T11:30:00Z",
    position: 2, // Bổ sung
    maxLesson: 8, // Bổ sung (ví dụ)
    level: "N5", // Bổ sung (ví dụ)
    status: "PUBLISHED",
  },
  {
    id: 3,
    name: "Từ vựng N4",
    urlImage: "https://cdn-icons-png.flaticon.com/512/2996/2996078.png",
    createAt: "2025-03-20T09:00:00Z",
    updateAt: "2025-03-20T09:00:00Z",
    position: 3, // Bổ sung
    maxLesson: 10, // Bổ sung (ví dụ)
    level: "N4", // Bổ sung (ví dụ)
    status: "PENDING",
  },
  {
    id: 4,
    name: "Kanji N3 nâng cao",
    urlImage: "https://cdn-icons-png.flaticon.com/512/820/820358.png",
    createAt: "2025-04-05T14:15:00Z",
    updateAt: "2025-04-05T14:15:00Z",
    position: 4, // Bổ sung
    maxLesson: 7, // Bổ sung (ví dụ)
    level: "N3", // Bổ sung (ví dụ)
    status: "PENDING",
  },
  {
    id: 5,
    name: "Luyện nghe N2",
    urlImage: "https://cdn-icons-png.flaticon.com/512/2927/2927515.png",
    createAt: "2025-05-01T16:00:00Z",
    updateAt: "2025-05-01T16:00:00Z",
    position: 5, // Bổ sung
    maxLesson: 9, // Bổ sung (ví dụ)
    level: "N2", // Bổ sung (ví dụ)
    status: "PENDING",
  },
  {
    id: 6,
    name: "Chủ đề Nhà cửa",
    urlImage: "https://cdn-icons-png.flaticon.com/512/5537/5537237.png",
    createAt: "2025-06-01T12:00:00Z",
    updateAt: "2025-06-01T12:00:00Z",
    position: 6, // Bổ sung
    maxLesson: 5, // Bổ sung (ví dụ)
    level: "cơ bản", // Bổ sung (ví dụ)
    status: "PUBLISHED",
  },
];

// Hàm giả lập để tìm ID lớn nhất cho việc tạo ID mới
function getNextTopicId() {
  return topics.length > 0 ? Math.max(...topics.map((t) => t.id)) + 1 : 1;
}

const topicService = {
  /**
   * Lấy tất cả các chủ đề.
   * @returns {Promise<Array>} Danh sách các chủ đề.
   */
  getAllTopics: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...topics]); // Trả về bản sao để tránh thay đổi trực tiếp
      }, 300); // Giả lập độ trễ API
    });
  },

  /**
   * Lấy một chủ đề theo ID.
   * @param {number} id - ID của chủ đề.
   * @returns {Promise<Object|null>} Chủ đề hoặc null nếu không tìm thấy.
   */
  getTopicById: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const topic = topics.find((t) => t.id === id);
        resolve(topic ? { ...topic } : null); // Trả về bản sao
      }, 300);
    });
  },

  /**
   * Tạo một chủ đề mới.
   * @param {Object} newTopicData - Dữ liệu chủ đề mới (name, description, url_image, status).
   * @returns {Promise<Object>} Chủ đề đã được tạo với ID và ngày tạo/cập nhật.
   */
  createTopic: async (newTopicData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const id = getNextTopicId();
        const now = new Date().toISOString();
        const createdTopic = {
          ...newTopicData,
          id,
          createdAt: now,
          updatedAt: now,
          status: newTopicData.status || "active", // Mặc định là 'active'
        };
        topics.push(createdTopic);
        resolve({ ...createdTopic }); // Trả về bản sao
      }, 300);
    });
  },

  /**
   * Cập nhật một chủ đề hiện có.
   * @param {number} id - ID của chủ đề cần cập nhật.
   * @param {Object} updatedTopicData - Dữ liệu cập nhật cho chủ đề.
   * @returns {Promise<Object|null>} Chủ đề đã cập nhật hoặc null nếu không tìm thấy.
   */
  updateTopic: async (id, updatedTopicData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = topics.findIndex((t) => t.id === id);
        if (index !== -1) {
          topics[index] = {
            ...topics[index],
            ...updatedTopicData,
            updatedAt: new Date().toISOString(), // Cập nhật thời gian
          };
          resolve({ ...topics[index] }); // Trả về bản sao
        } else {
          resolve(null);
        }
      }, 300);
    });
  },

  /**
   * Xóa một chủ đề.
   * @param {number} id - ID của chủ đề cần xóa.
   * @returns {Promise<boolean>} True nếu xóa thành công, false nếu không tìm thấy.
   */
  deleteTopic: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const initialLength = topics.length;
        topics = topics.filter((t) => t.id !== id);
        resolve(topics.length < initialLength); // true nếu xóa thành công
      }, 300);
    });
  },

  /**
   * Tìm kiếm chủ đề theo tên hoặc mô tả.
   * @param {string} query - Chuỗi tìm kiếm.
   * @returns {Promise<Array>} Danh sách các chủ đề phù hợp.
   */
  searchTopics: async (query) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const lowerCaseQuery = query.toLowerCase();
        const filteredTopics = topics.filter(
          (topic) =>
            topic.name.toLowerCase().includes(lowerCaseQuery) ||
            (topic.description &&
              topic.description.toLowerCase().includes(lowerCaseQuery))
        );
        resolve([...filteredTopics]);
      }, 300);
    });
  },

  /**
   * Validate dữ liệu chủ đề từ file import.
   * @param {Object} topicData - Dữ liệu một chủ đề từ file Excel/CSV.
   * @returns {Object} { isValid: boolean, errors: string[] }
   */
  validateTopicData: (topicData) => {
    const errors = [];
    const validStatuses = ["active", "inactive"];

    // 1. Kiểm tra trường 'name' (Bắt buộc)
    if (
      !topicData.name ||
      typeof topicData.name !== "string" ||
      topicData.name.trim() === ""
    ) {
      errors.push("Tên chủ đề không được để trống.");
    }

    // 2. Kiểm tra trường 'description' (Không bắt buộc, nhưng nếu có phải là chuỗi)
    if (topicData.description && typeof topicData.description !== "string") {
      errors.push("Mô tả chủ đề phải là chuỗi.");
    }

    // 3. Kiểm tra trường 'url_image' (Nếu có, phải là URL hợp lệ)
    if (
      topicData.url_image &&
      typeof topicData.url_image === "string" &&
      topicData.url_image.trim() !== ""
    ) {
      try {
        new URL(topicData.url_image); // Kiểm tra định dạng URL cơ bản
      } catch (_) {
        errors.push(`URL hình ảnh "${topicData.url_image}" không hợp lệ.`);
      }
    }

    // 4. Kiểm tra trường 'status' (Bắt buộc và giá trị hợp lệ)
    // Chuyển đổi về chuỗi và lowercase để đảm bảo so khớp đúng
    const statusValue = String(topicData.status).toLowerCase();
    if (!topicData.status || !validStatuses.includes(statusValue)) {
      errors.push(
        `Trạng thái "${topicData.status}" không hợp lệ. Phải là 'active' hoặc 'inactive'.`
      );
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
    };
  },

  /**
   * Hàm import dữ liệu chủ đề từ một mảng các đối tượng (ví dụ: từ CSV/Excel đã parse).
   * Sẽ tạo mới hoặc cập nhật chủ đề nếu tìm thấy theo `id` (nếu `id` được cung cấp).
   * @param {Array<Object>} topicsToImport - Mảng các đối tượng chủ đề cần import.
   * @returns {Promise<Object>} Kết quả import { success: number, failed: number, errors: Array }
   */
  importTopics: async (topicsToImport) => {
    return new Promise(async (resolve) => {
      const importResults = {
        success: 0,
        failed: 0,
        errors: [],
      };

      for (let i = 0; i < topicsToImport.length; i++) {
        const data = topicsToImport[i];
        // Clean data: remove extra spaces from keys and values
        const cleanedData = Object.fromEntries(
          Object.entries(data).map(([key, value]) => [
            key.trim(),
            typeof value === "string" ? value.trim() : value,
          ])
        );

        const validationResult = topicService.validateTopicData(cleanedData);

        if (validationResult.isValid) {
          try {
            const existingTopic = cleanedData.id
              ? topics.find((t) => t.id === parseInt(cleanedData.id))
              : null;

            const topicDataToSave = {
              name: cleanedData.name,
              description: cleanedData.description || "",
              url_image: cleanedData.url_image || "",
              status: String(cleanedData.status).toLowerCase(), // Đảm bảo lưu đúng định dạng
            };

            if (existingTopic) {
              // Cập nhật chủ đề hiện có
              await topicService.updateTopic(existingTopic.id, topicDataToSave);
            } else {
              // Tạo chủ đề mới
              await topicService.createTopic(topicDataToSave);
            }
            importResults.success++;
          } catch (error) {
            console.error("Lỗi khi xử lý chủ đề:", error);
            importResults.failed++;
            importResults.errors.push({
              lineNumber: i + 2, // Dòng 1 là header, nên dữ liệu bắt đầu từ dòng 2
              data: data,
              message: `Lỗi hệ thống khi thêm/cập nhật chủ đề: ${error.message}`,
            });
          }
        } else {
          importResults.failed++;
          importResults.errors.push({
            lineNumber: i + 2, // Dòng 1 là header, nên dữ liệu bắt đầu từ dòng 2
            data: data,
            message: `Dữ liệu không hợp lệ: ${validationResult.errors.join(
              "; "
            )}`,
          });
        }
      }
      resolve(importResults);
    });
  },
};

export default topicService;
