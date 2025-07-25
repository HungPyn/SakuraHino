// src/services/subscriptionService.js

// Dữ liệu gói đăng ký giả lập
let subscriptionPlans = [
  {
    id: 1,
    name: 'Gói Cơ Bản (Tháng)',
    description: 'Truy cập không giới hạn vào tất cả bài học N5.',
    price: 150000,
    duration: 'monthly', // monthly, quarterly, yearly
    features: ['Bài học N5', 'Quiz cơ bản'],
    status: 'active', // active, inactive
    createdAt: '2025-07-01T10:00:00Z',
  },
  {
    id: 2,
    name: 'Gói Tiêu Chuẩn (Quý)',
    description: 'Truy cập vào tất cả bài học N5, N4 và 2 buổi mentorship/quý.',
    price: 400000,
    duration: 'quarterly',
    features: ['Bài học N5, N4', 'Quiz nâng cao', '2 buổi mentorship'],
    status: 'active',
    createdAt: '2025-06-15T12:30:00Z',
  },
  {
    id: 3,
    name: 'Gói Cao Cấp (Năm)',
    description: 'Truy cập toàn bộ nền tảng, hỗ trợ 24/7 và khóa học chuyên sâu.',
    price: 1500000,
    duration: 'yearly',
    features: ['Tất cả bài học', 'Hỗ trợ 24/7', 'Khóa học chuyên sâu', 'Thi thử JLPT'],
    status: 'active',
    createdAt: '2025-05-20T08:00:00Z',
  },
  {
    id: 4,
    name: 'Gói Dùng Thử (1 tuần)',
    description: 'Truy cập giới hạn các bài học đầu tiên.',
    price: 0,
    duration: 'weekly', // Thêm ví dụ tuần
    features: ['Bài học giới hạn'],
    status: 'inactive', // Gói không hoạt động
    createdAt: '2025-07-20T14:00:00Z',
  },
  {
    id: 5,
    name: 'Gói VIP (Năm)',
    description: 'Tất cả các tính năng của gói Cao cấp kèm theo các buổi học 1 kèm 1.',
    price: 2500000,
    duration: 'yearly',
    features: ['Tất cả tính năng Cao cấp', 'Học 1 kèm 1'],
    status: 'active',
    createdAt: '2025-07-22T09:00:00Z',
  },
   {
    id: 6,
    name: 'Gói Khuyến Mãi (Tháng)',
    description: 'Gói cơ bản với giá ưu đãi đặc biệt trong thời gian có hạn.',
    price: 120000,
    duration: 'monthly',
    features: ['Bài học N5', 'Quiz cơ bản', 'Giá ưu đãi'],
    status: 'inactive', // Gói không hoạt động (đã hết khuyến mãi)
    createdAt: '2025-07-10T11:00:00Z',
  },
];

// Hàm hỗ trợ để tạo ID duy nhất cho gói mới
function getNextId() {
    return subscriptionPlans.length > 0 ? Math.max(...subscriptionPlans.map(p => p.id)) + 1 : 1;
}

export function getSubscriptionPlans() {
    // Trả về một bản sao để tránh thay đổi trực tiếp mảng gốc bên ngoài service
    return [...subscriptionPlans];
}

export function addSubscriptionPlan(plan) {
    const newPlan = {
        id: getNextId(),
        createdAt: new Date().toISOString(),
        // Gán giá trị mặc định nếu không được cung cấp từ form
        status: plan.status || 'inactive',
        duration: plan.duration || 'monthly',
        features: plan.features || [],
        ...plan, // Ghi đè các thuộc tính nếu chúng đã tồn tại trong 'plan'
    };
    subscriptionPlans.push(newPlan);
    return newPlan; // Trả về đối tượng mới đã thêm ID và createdAt
}

export function updateSubscriptionPlan(updatedPlan) {
    const index = subscriptionPlans.findIndex(p => p.id === updatedPlan.id);
    if (index !== -1) {
        subscriptionPlans[index] = { ...subscriptionPlans[index], ...updatedPlan };
        return subscriptionPlans[index]; // Trả về gói đã được cập nhật
    }
    return null; // Không tìm thấy gói để cập nhật
}

export function deleteSubscriptionPlan(planId) {
    const initialLength = subscriptionPlans.length;
    subscriptionPlans = subscriptionPlans.filter(p => p.id !== planId);
    return subscriptionPlans.length < initialLength; // Trả về true nếu có gói được xóa
}