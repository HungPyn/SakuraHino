// src/services/subscriptionService.js

import { ref } from 'vue';

const subscriptionPlans = ref([
  {
    id: 1,
    name: 'Gói Standard',
    description: 'Gói cơ bản với các tính năng tiêu chuẩn.',
    price: 99000,
    duration: '1 tháng', // Ví dụ: '1 tháng', '3 tháng', '1 năm'
    features: [
      'Truy cập nội dung cơ bản',
      'Không quảng cáo',
      'Hỗ trợ tiêu chuẩn'
    ],
    status: 'active', // active, inactive
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2023-01-15T10:00:00Z',
  },
  {
    id: 2,
    name: 'Gói Premium',
    description: 'Gói cao cấp với nhiều tính năng nâng cao và ưu đãi đặc biệt.',
    price: 199000,
    duration: '1 tháng',
    features: [
      'Truy cập tất cả nội dung',
      'Xem offline',
      'Chất lượng HD/4K',
      'Hỗ trợ ưu tiên'
    ],
    status: 'active',
    createdAt: '2023-02-01T11:30:00Z',
    updatedAt: '2023-02-01T11:30:00Z',
  },
  {
    id: 3,
    name: 'Gói VIP',
    description: 'Gói đặc biệt dành cho khách hàng thân thiết, ưu tiên cao nhất.',
    price: 499000,
    duration: '6 tháng',
    features: [
      'Tất cả tính năng Premium',
      'Sự kiện độc quyền',
      'Quà tặng hàng tháng',
      'Hỗ trợ 24/7'
    ],
    status: 'inactive',
    createdAt: '2023-03-10T09:00:00Z',
    updatedAt: '2023-03-10T09:00:00Z',
  },
]);

export const getSubscriptionPlans = () => {
  return subscriptionPlans.value;
};

export const addSubscriptionPlan = (newPlan) => {
  const newId = subscriptionPlans.value.length > 0 ? Math.max(...subscriptionPlans.value.map(p => p.id)) + 1 : 1;
  const planWithId = {
    id: newId,
    ...newPlan,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  subscriptionPlans.value.push(planWithId);
  return planWithId;
};

export const updateSubscriptionPlan = (updatedPlan) => {
  const index = subscriptionPlans.value.findIndex(p => p.id === updatedPlan.id);
  if (index !== -1) {
    subscriptionPlans.value[index] = {
      ...updatedPlan,
      updatedAt: new Date().toISOString(),
    };
    return subscriptionPlans.value[index];
  }
  return null;
};

export const deleteSubscriptionPlan = (planId) => {
  const initialLength = subscriptionPlans.value.length;
  subscriptionPlans.value = subscriptionPlans.value.filter(p => p.id !== planId);
  return subscriptionPlans.value.length < initialLength;
};