// src/services/badgeService.js

let badges = [
    {
        id: 1,
        name: 'Người học chăm chỉ',
        description: 'Hoàn thành 10 bài học liên tiếp.',
        icon: 'bi-fire',
        color: '#dc3545',
        type: 'streak', // Thêm trường 'type'
        status: 'active', // Thêm trường 'status'
        createdAt: '2025-07-20T10:00:00Z' // Thêm trường 'createdAt' (ví dụ 5 ngày trước)
    },
    {
        id: 2,
        name: 'Chuyên gia Kanji',
        description: 'Đạt điểm tuyệt đối phần Kanji N3.',
        icon: 'bi-kanban',
        color: '#ffc107',
        type: 'achievement', // Thêm trường 'type'
        status: 'active', // Thêm trường 'status'
        createdAt: '2025-06-10T14:30:00Z' // (Ví dụ hơn 30 ngày trước)
    },
    {
        id: 3,
        name: 'Tân học viên',
        description: 'Tạo tài khoản lần đầu.',
        icon: 'bi-person-plus-fill',
        color: '#0d6efd',
        type: 'milestone', // Thêm trường 'type' (có thể là 'milestone' hoặc 'onboarding')
        status: 'active', // Thêm trường 'status'
        createdAt: '2025-07-24T08:00:00Z' // (Ví dụ hôm qua)
    },
    {
        id: 4,
        name: 'Bỏ bê học tập',
        description: 'Không hoạt động trong 30 ngày.',
        icon: 'bi-pause-circle-fill',
        color: '#6c757d',
        type: 'warning', // Ví dụ một loại huy hiệu cảnh báo
        status: 'inactive', // Huy hiệu không hoạt động
        createdAt: '2025-05-01T09:00:00Z' // (Ví dụ hơn 90 ngày trước)
    },
    {
        id: 5,
        name: 'Người hoàn thành N5',
        description: 'Hoàn thành lộ trình học N5.',
        icon: 'bi-award',
        color: '#28a745',
        type: 'level', // Huy hiệu cấp độ
        status: 'active',
        createdAt: '2025-07-05T11:00:00Z' // (Ví dụ trong 30 ngày qua)
    }
];

// Hàm hỗ trợ để tạo ID và ngày tạo mới tự động
function getNextId() {
    return badges.length > 0 ? Math.max(...badges.map(b => b.id)) + 1 : 1;
}

export default {
    getAll() {
        return Promise.resolve([...badges]);
    },
    add(badge) {
        // Gán ID và ngày tạo mới cho huy hiệu mới
        badge.id = getNextId();
        badge.createdAt = new Date().toISOString(); // Thêm ngày tạo hiện tại
        badges.push(badge);
        return Promise.resolve();
    },
    update(updated) {
        // Đảm bảo không ghi đè createdAt nếu không được cung cấp trong updated
        badges = badges.map(b => (b.id === updated.id ? { ...b, ...updated } : b));
        return Promise.resolve();
    },
    remove(id) {
        badges = badges.filter(b => b.id !== id);
        return Promise.resolve();
    }
};