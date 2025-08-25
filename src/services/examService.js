// src/services/examService.js

// Bảng Topics (Chủ đề)
const topics = [
  { id: 1, name: 'Ngữ pháp', description: 'Kiến thức về ngữ pháp tiếng Nhật' },
  { id: 2, name: 'Từ vựng', description: 'Từ vựng theo các cấp độ' },
  { id: 3, name: 'Nghe hiểu', description: 'Các bài nghe và hội thoại' },
  { id: 4, name: 'Kanji', description: 'Hệ thống Hán tự' },
  { id: 5, name: 'Đọc hiểu', description: 'Các bài đọc và câu hỏi' }
];

// Bảng Users (Người dùng)
const users = [
  { id: 101, username: 'nguyenvanA', fullName: 'Nguyễn Văn A', email: 'vana@example.com' },
  { id: 102, username: 'tranb', fullName: 'Trần Thị B', email: 'thib@example.com' },
  { id: 103, username: 'lethic', fullName: 'Lê Văn C', email: 'vanc@example.com' },
  { id: 104, username: 'phamminhd', fullName: 'Phạm Minh D', email: 'minhd@example.com' }
];

// Bảng Exams (Kỳ thi)
let exams = [
  { id: 1, name: 'JLPT N5 tháng 12/2023', topicId: 1, date: '2023-12-03', duration: 105, status: 'Sắp diễn ra', questionCount: 50 },
  { id: 2, name: 'Thi thử Ngữ pháp N4', topicId: 1, date: '2023-11-15', duration: 30, status: 'Đang mở', questionCount: 20 },
  { id: 3, name: 'Kiểm tra Từ vựng bài 10', topicId: 2, date: '2023-11-05', duration: 15, status: 'Đã đóng', questionCount: 15 },
  { id: 4, name: 'Đánh giá Kỹ năng Nghe', topicId: 3, date: '2023-11-20', duration: 40, status: 'Sắp diễn ra', questionCount: 30 },
  { id: 5, name: 'Kiểm tra Kanji tuần 1', topicId: 4, date: '2023-11-01', duration: 20, status: 'Đã đóng', questionCount: 25 },
  { id: 6, name: 'Thi thử Đọc hiểu N3', topicId: 5, date: '2023-11-10', duration: 50, status: 'Đã đóng', questionCount: 40 }
];

// Bảng ExamResults (Kết quả thi)
let examResults = [
  { id: 1001, examId: 3, userId: 101, score: 95, completionDate: '2023-11-06' },
  { id: 1002, examId: 3, userId: 102, score: 88, completionDate: '2023-11-07' },
  { id: 1003, examId: 5, userId: 101, score: 70, completionDate: '2023-11-02' },
  { id: 1004, examId: 5, userId: 103, score: 85, completionDate: '2023-11-03' },
  { id: 1005, examId: 6, userId: 101, score: 92, completionDate: '2023-11-11' },
  { id: 1006, examId: 6, userId: 102, score: 78, completionDate: '2023-11-11' },
  { id: 1007, examId: 6, userId: 104, score: 80, completionDate: '2023-11-12' },
  { id: 1008, examId: 2, userId: 101, score: 75, completionDate: '2023-11-16' },
  { id: 1009, examId: 2, userId: 103, score: 90, completionDate: '2023-11-16' },
  { id: 1010, examId: 2, userId: 104, score: 82, completionDate: '2023-11-17' },
];

export const getAllTopics = () => [...topics];
export const getAllUsers = () => [...users];
export const getAllExams = () => [...exams];
export const getAllExamResults = () => [...examResults];

export const addExam = (newExam) => {
  const newId = exams.length > 0 ? Math.max(...exams.map(e => e.id)) + 1 : 1;
  const examToAdd = { ...newExam, id: newId };
  exams.push(examToAdd);
};

export const updateExam = (id, updatedExam) => {
  const index = exams.findIndex(e => e.id === id);
  if (index !== -1) {
    exams[index] = { ...exams[index], ...updatedExam };
  }
};

export const deleteExam = (id) => {
  exams = exams.filter(e => e.id !== id);
  // Xóa kết quả thi liên quan
  examResults = examResults.filter(r => r.examId !== id);
};

export const addExamResult = (newResult) => {
  const newId = examResults.length > 0 ? Math.max(...examResults.map(r => r.id)) + 1 : 1;
  const resultToAdd = { ...newResult, id: newId };
  examResults.push(resultToAdd);
};

export const deleteExamResult = (id) => {
    examResults = examResults.filter(r => r.id !== id);
};