// src/services/reviewService.js

let reviews = [
  { id: 1, title: 'Động từ trong tiếng Nhật', topic: 'Ngữ pháp', level: 'N5', status: 'Chưa bắt đầu', dueDate: '2023-11-01' },
  { id: 2, title: 'Hán tự cơ bản (一, 二, 三)', topic: 'Kanji', level: 'N5', status: 'Đang ôn tập', dueDate: '2023-10-28' },
  { id: 3, title: 'Từ vựng chủ đề gia đình', topic: 'Từ vựng', level: 'N4', status: 'Hoàn thành', dueDate: '2023-10-25' },
  { id: 4, title: 'Nghe hội thoại hàng ngày', topic: 'Nghe', level: 'N3', status: 'Đang ôn tập', dueDate: '2023-11-10' },
  { id: 5, title: 'Cách sử dụng thể て', topic: 'Ngữ pháp', level: 'N4', status: 'Hoàn thành', dueDate: '2023-10-22' },
];

export const getAllReviews = () => {
  return [...reviews];
};

export const addReview = (newReview) => {
  const newId = reviews.length > 0 ? Math.max(...reviews.map(r => r.id)) + 1 : 1;
  const reviewToAdd = { ...newReview, id: newId };
  reviews.push(reviewToAdd);
};

export const updateReview = (id, updatedReview) => {
  const index = reviews.findIndex(r => r.id === id);
  if (index !== -1) {
    reviews[index] = { ...reviews[index], ...updatedReview };
  }
};

export const deleteReview = (id) => {
  reviews = reviews.filter(r => r.id !== id);
};