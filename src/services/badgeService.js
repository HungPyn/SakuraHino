let badges = [
  {
    id: 1,
    name: 'Người học chăm chỉ',
    description: 'Hoàn thành 10 bài học liên tiếp',
    icon: 'bi-fire',
    color: '#dc3545'
  },
  {
    id: 2,
    name: 'Chuyên gia Kanji',
    description: 'Đạt điểm tuyệt đối phần Kanji N3',
    icon: 'bi-kanban',
    color: '#ffc107'
  },
  {
    id: 3,
    name: 'Tân học viên',
    description: 'Tạo tài khoản lần đầu',
    icon: 'bi-person-plus-fill',
    color: '#0d6efd'
  }
];

export default {
  getAll() {
    return Promise.resolve([...badges]);
  },
  add(badge) {
    badge.id = Date.now();
    badges.push(badge);
    return Promise.resolve();
  },
  update(updated) {
    badges = badges.map(b => (b.id === updated.id ? updated : b));
    return Promise.resolve();
  },
  remove(id) {
    badges = badges.filter(b => b.id !== id);
    return Promise.resolve();
  }
};
