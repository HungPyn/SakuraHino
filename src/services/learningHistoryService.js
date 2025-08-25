// src/services/learningHistoryService.js

let histories = [
  { id: 1, user: 'Nguyen Van A', topic: 'Ngữ pháp', progress: 85, date: '2023-10-26' },
  { id: 2, user: 'Tran Thi B', topic: 'Từ vựng', progress: 100, date: '2023-10-25' },
  { id: 3, user: 'Le Van C', topic: 'Nghe', progress: 40, date: '2023-10-24' },
  { id: 4, user: 'Pham D', topic: 'Kanji', progress: 20, date: '2023-10-23' },
  { id: 5, user: 'Hoang Thi E', topic: 'Ngữ pháp', progress: 100, date: '2023-10-22' },
  { id: 6, user: 'Nguyen Van A', topic: 'Từ vựng', progress: 95, date: '2023-10-21' },
];

export const getAllHistories = () => {
  return [...histories];
};

export const addHistory = (newHistory) => {
  const newId = histories.length > 0 ? Math.max(...histories.map(h => h.id)) + 1 : 1;
  const historyToAdd = { ...newHistory, id: newId, date: new Date().toISOString().slice(0, 10) };
  histories.push(historyToAdd);
};

export const updateHistory = (id, updatedHistory) => {
  const index = histories.findIndex(h => h.id === id);
  if (index !== -1) {
    histories[index] = { ...histories[index], ...updatedHistory };
  }
};

export const deleteHistory = (id) => {
  histories = histories.filter(h => h.id !== id);
};