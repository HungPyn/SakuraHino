// src/services/reminderService.js

// Dữ liệu giả lập
let reminders = [
  {
    id: 1,
    title: "Nhắc học Từ vựng N5 buổi sáng",
    message:
      "Chào {username}, đừng quên học 10 từ vựng N5 hôm nay nhé! Cố lên!",
    scheduleType: "daily", // 'daily' hoặc 'one_time'
    dailyTime: "08:00", // Thời gian cho lịch hàng ngày
    oneTimeDateTime: null, // Ngày giờ cho lịch một lần (dạng ISO String)
    targetAudience: "level",
    targetDetails: ["N5"],
    inactiveDays: 7, // Giá trị mặc định
    status: "active",
  },
  {
    id: 2,
    title: "Thông báo sự kiện Giáng Sinh",
    message:
      "Mừng Giáng Sinh! SakuraHino có sự kiện đặc biệt, hãy khám phá ngay!",
    scheduleType: "one_time",
    dailyTime: null,
    oneTimeDateTime: "2024-12-25T09:00:00.000Z",
    targetAudience: "all",
    targetDetails: [],
    inactiveDays: 7,
    status: "active",
  },
  {
    id: 3,
    title: "Nhắc nhở người dùng cũ",
    message:
      "Lâu rồi không gặp {username}, quay lại học cùng SakuraHino nhé, có nhiều bài học mới lắm!",
    scheduleType: "daily",
    dailyTime: "20:00",
    oneTimeDateTime: null,
    targetAudience: "inactive_users",
    targetDetails: [],
    inactiveDays: 14, // Ví dụ: Gửi cho người dùng không hoạt động sau 14 ngày
    status: "active",
  },
  {
    id: 4,
    title: "Nhắc nhở chung buổi tối",
    message:
      "Một ngày sắp hết, bạn đã hoàn thành mục tiêu học tập hôm nay chưa?",
    scheduleType: "daily",
    dailyTime: "21:00",
    oneTimeDateTime: null,
    targetAudience: "all",
    targetDetails: [],
    inactiveDays: 7,
    status: "inactive",
  },
];

const generateUniqueId = () => Date.now();

// Hàm giả lập độ trễ mạng
const simulateDelay = (ms = 200) => new Promise((res) => setTimeout(res, ms));

export default {
  async getReminders() {
    await simulateDelay();
    return JSON.parse(JSON.stringify(reminders)); // Trả về một bản sao sâu để đảm bảo an toàn
  },

  async addReminder(newReminder) {
    await simulateDelay();
    // Đảm bảo object mới có đầy đủ các trường cần thiết với giá trị mặc định
    const reminderToAdd = {
      id: generateUniqueId(),
      title: newReminder.title || "Lịch nhắc nhở không tên",
      message: newReminder.message || "",
      scheduleType: newReminder.scheduleType || "daily",
      dailyTime: newReminder.dailyTime || "08:00",
      oneTimeDateTime: newReminder.oneTimeDateTime || null,
      targetAudience: newReminder.targetAudience || "all",
      targetDetails: newReminder.targetDetails || [],
      inactiveDays: newReminder.inactiveDays || 7,
      status: newReminder.status || "active",
    };
    reminders.push(reminderToAdd);
    return reminderToAdd;
  },

  async updateReminder(updatedReminder) {
    await simulateDelay();
    const index = reminders.findIndex((r) => r.id === updatedReminder.id);
    if (index !== -1) {
      // Merge dữ liệu cũ với dữ liệu mới để đảm bảo không mất trường nào
      reminders[index] = { ...reminders[index], ...updatedReminder };
      return reminders[index];
    }
    throw new Error("Không tìm thấy lịch nhắc nhở.");
  },

  async deleteReminder(id) {
    await simulateDelay();
    const initialLength = reminders.length;
    reminders = reminders.filter((r) => r.id !== id);
    if (reminders.length === initialLength) {
      throw new Error("Không tìm thấy lịch nhắc nhở để xóa.");
    }
    return true;
  },
};
