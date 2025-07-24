<template>
  <div class="modal-content custom-popup-content">
    <div class="modal-header custom-popup-header">
      <h5 class="modal-title custom-popup-title">
        <i class="bi bi-person-exclamation me-2"></i> Chi tiết Người dùng Nghi ngờ
      </h5>
      <button type="button" class="btn-close custom-close-button" @click="$emit('close')" aria-label="Close"></button>
    </div>

    <div class="modal-body custom-popup-body">
      <div class="mb-3">
        <label class="form-label custom-label">ID Người dùng:</label>
        <p class="form-control-plaintext custom-text">{{ localUser.id }}</p>
      </div>
      <div class="mb-3">
        <label class="form-label custom-label">Tên thành viên:</label>
        <p class="form-control-plaintext custom-text">{{ localUser.name }}</p>
      </div>
      <div class="mb-3">
        <label class="form-label custom-label">Email:</label>
        <p class="form-control-plaintext custom-text">{{ localUser.email }}</p>
      </div>
      <div class="mb-3">
        <label class="form-label custom-label">IP đăng ký:</label>
        <p class="form-control-plaintext custom-text">{{ localUser.registeredIp }}</p>
      </div>
      <div class="mb-3">
        <label class="form-label custom-label">Ngày phát hiện:</label>
        <p class="form-control-plaintext custom-text">{{ localUser.detectionDate }}</p>
      </div>
      <div class="mb-3">
        <label class="form-label custom-label">Lý do nghi ngờ:</label>
        <p class="form-control-plaintext custom-text">{{ localUser.detectionReason }}</p>
      </div>
      <div class="mb-3">
        <label class="form-label custom-label">Hoạt động gần nhất:</label>
        <p class="form-control-plaintext custom-text">{{ localUser.lastLogin }}</p>
      </div>
      <div class="mb-3" v-if="localUser.relatedPosts && localUser.relatedPosts.length > 0">
        <label class="form-label custom-label">Bài viết liên quan:</label>
        <p class="form-control-plaintext custom-text">
          <span v-for="(postId, index) in localUser.relatedPosts" :key="postId">
            Bài viết #{{ postId }}<span v-if="index < localUser.relatedPosts.length - 1">, </span>
          </span>
        </p>
      </div>
      <div class="mb-3">
        <label class="form-label custom-label">Trạng thái:</label>
        <span :class="['badge', getStatusBadgeClass(localUser.status)]">{{ getStatusText(localUser.status) }}</span>
      </div>
    </div>

    <div class="modal-footer custom-popup-footer">
      <button type="button" class="btn btn-secondary custom-cancel-button" @click="$emit('close')">Đóng</button>
      <button v-if="localUser.status === 'investigating'" type="button" class="btn btn-success me-2" @click="$emit('clear', localUser.id)">
        <i class="bi bi-person-check me-2"></i> Xóa nghi ngờ
      </button>
      <button v-if="localUser.status === 'investigating'" type="button" class="btn btn-danger me-2" @click="$emit('ban', localUser.id)">
        <i class="bi bi-person-x me-2"></i> Cấm thành viên
      </button>
      <button v-if="localUser.status !== 'investigating'" type="button" class="btn btn-info" @click="$emit('reset', localUser.id)">
        <i class="bi bi-arrow-counterclockwise me-2"></i> Đặt lại trạng thái
      </button>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  props: ['user'],
  emits: ['close', 'clear', 'ban', 'reset'],
  setup(props) {
    const localUser = ref(props.user ? { ...props.user } : {});

    watch(
      () => props.user,
      (newVal) => {
        localUser.value = newVal ? { ...newVal } : {};
      },
      { immediate: true, deep: true }
    );

    const getStatusBadgeClass = (status) => {
      switch (status) {
        case 'investigating': return 'bg-warning text-dark';
        case 'banned': return 'bg-danger';
        case 'cleared': return 'bg-success';
        default: return 'bg-secondary';
      }
    };

    const getStatusText = (status) => {
      switch (status) {
        case 'investigating': return 'Đang điều tra';
        case 'banned': return 'Đã bị cấm';
        case 'cleared': return 'Đã xác minh';
        default: return 'Không xác định';
      }
    };

    return {
      localUser,
      getStatusBadgeClass,
      getStatusText,
    };
  },
};
</script>

<style scoped>
/* Reusing common popup styles */
.custom-popup-content {
  border-radius: 1rem;
  border: none;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  background-color: #ffffff;
}

.custom-popup-header {
  border-bottom: 1px solid #e9ecef;
  padding: 1.5rem 2rem;
  background-color: #f8fafd;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  display: flex;
  align-items: center;
}

.custom-popup-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0;
  display: flex;
  align-items: center;
}

.custom-popup-title i {
  font-size: 1.75rem;
  color: #ffc107; /* Màu vàng cho icon cảnh báo người dùng */
}

.custom-close-button {
  font-size: 1.5rem;
  padding: 0.5rem;
  margin: -0.5rem -0.5rem -0.5rem auto;
  color: #6c757d;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.custom-close-button:hover {
  opacity: 1;
  color: #343a40;
}

.custom-popup-body {
  padding: 2rem;
}

.custom-label {
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
  display: block;
}

.custom-text {
  padding: 0.5rem 0;
  font-size: 1rem;
  color: #343a40;
}

.badge { /* Reusing badge styles from table */
  padding: 0.4em 0.7em;
  border-radius: 0.35rem;
  font-size: 0.9em; /* slightly larger in popup */
  font-weight: 700;
  color: #fff;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  display: inline-block;
}

.badge.bg-warning { background-color: #ffc107 !important; }
.badge.bg-danger { background-color: #dc3545 !important; }
.badge.bg-success { background-color: #28a745 !important; }
.badge.bg-secondary { background-color: #6c757d !important; }
.badge.text-dark { color: #343a40 !important; }


.custom-popup-footer {
  border-top: 1px solid #e9ecef;
  padding: 1.25rem 2rem;
  background-color: #f8fafd;
  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

/* Button styles (reused from SuspiciousUsersTable) */
.btn-info, .btn-success, .btn-danger, .custom-cancel-button {
  padding: 0.65rem 1.25rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
}
.btn-info i, .btn-success i, .btn-danger i {
    margin-right: 0.5rem;
}

.btn-info { background-color: #17a2b8; border-color: #17a2b8; color: #fff; }
.btn-info:hover { background-color: #138496; border-color: #117a8b; }

.btn-success { background-color: #28a745; border-color: #28a745; color: #fff; }
.btn-success:hover { background-color: #218838; border-color: #1e7e34; }

.btn-danger { background-color: #dc3545; border-color: #dc3545; color: #fff; }
.btn-danger:hover { background-color: #c82333; border-color: #bd2130; }

.custom-cancel-button {
  background-color: #6c757d;
  border-color: #6c757d;
  color: #fff;
}
.custom-cancel-button:hover {
  background-color: #5a6268;
  border-color: #545b62;
}


@media (max-width: 768px) {
  .custom-popup-header,
  .custom-popup-body,
  .custom-popup-footer {
    padding: 1rem 1.25rem;
  }

  .custom-popup-title { font-size: 1.25rem; }
  .custom-popup-title i { font-size: 1.5rem; }
  .custom-close-button { font-size: 1.25rem; }
  .custom-label { font-size: 0.9rem; }
  .custom-text { font-size: 0.9rem; }

  .btn-info, .btn-success, .btn-danger, .custom-cancel-button {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
}
</style>