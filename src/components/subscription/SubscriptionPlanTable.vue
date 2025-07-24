<template>
  <div class="table-responsive">
    <table class="table custom-table">
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Tên gói</th>
          <th scope="col">Giá</th>
          <th scope="col">Thời hạn</th>
          <th scope="col">Tính năng chính</th>
          <th scope="col">Trạng thái</th>
          <th scope="col">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="plans.length === 0">
          <td colspan="7" class="text-center text-muted py-4">Không có gói đăng ký nào được tìm thấy.</td>
        </tr>
        <tr v-for="plan in plans" :key="plan.id">
          <td>{{ plan.id }}</td>
          <td class="plan-name">{{ plan.name }}</td>
          <td>{{ formatCurrency(plan.price) }}</td>
          <td>{{ plan.duration }}</td>
          <td class="plan-features">
            <ul class="list-unstyled mb-0">
              <li v-for="(feature, index) in plan.features.slice(0, 2)" :key="index">
                <i class="bi bi-check-circle-fill text-success me-1"></i> {{ feature }}
              </li>
              <li v-if="plan.features.length > 2">...</li>
            </ul>
          </td>
          <td>
            <span :class="['badge', plan.status === 'active' ? 'bg-success' : 'bg-secondary']">
              {{ plan.status === 'active' ? 'Hoạt động' : 'Không hoạt động' }}
            </span>
          </td>
          <td>
            <div class="d-flex justify-content-center">
              <button class="btn btn-sm btn-outline-primary me-2" @click="$emit('edit', plan)">
                <i class="bi bi-pencil-square"></i> Sửa
              </button>
              <button class="btn btn-sm btn-outline-danger" @click="$emit('delete', plan.id)">
                <i class="bi bi-trash"></i> Xóa
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    plans: {
      type: Array,
      required: true,
    },
  },
  emits: ['edit', 'delete'],
  setup() {
    const formatCurrency = (value) => {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    return {
      formatCurrency,
    };
  },
};
</script>

<style scoped>
.custom-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 0.8rem;
}

.custom-table th {
  background-color: #e9ecef;
  color: #495057;
  font-weight: 600;
  padding: 1rem 1.25rem;
  border-bottom: none;
  text-align: left;
}

.custom-table th:first-child {
  border-top-left-radius: 0.75rem;
  border-bottom-left-radius: 0.75rem;
}

.custom-table th:last-child {
  border-top-right-radius: 0.75rem;
  border-bottom-right-radius: 0.75rem;
}

.custom-table tbody tr {
  background-color: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease-in-out;
}

.custom-table tbody tr:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.custom-table td {
  padding: 1.25rem;
  vertical-align: middle;
  border-top: none; /* Remove default table borders */
}

.custom-table td:first-child {
  border-top-left-radius: 0.75rem;
  border-bottom-left-radius: 0.75rem;
}

.custom-table td:last-child {
  border-top-right-radius: 0.75rem;
  border-bottom-right-radius: 0.75rem;
}

.plan-name {
  font-weight: 600;
  color: #333;
}

.plan-features ul {
  padding-left: 0;
}

.plan-features li {
  font-size: 0.9rem;
  color: #555;
  white-space: nowrap; /* Keep features on one line */
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px; /* Limit width */
}

.badge {
  padding: 0.5em 0.8em;
  font-size: 0.85em;
  font-weight: 600;
  border-radius: 0.5rem;
}

.bg-success {
  background-color: #28a745 !important;
  color: #fff;
}

.bg-secondary {
  background-color: #6c757d !important;
  color: #fff;
}

.btn-sm {
  padding: 0.4rem 0.8rem;
  font-size: 0.875rem;
  border-radius: 0.5rem;
}

.btn-outline-primary {
  color: #007bff;
  border-color: #007bff;
}
.btn-outline-primary:hover {
  background-color: #007bff;
  color: #fff;
}

.btn-outline-danger {
  color: #dc3545;
  border-color: #dc3545;
}
.btn-outline-danger:hover {
  background-color: #dc3545;
  color: #fff;
}
</style>