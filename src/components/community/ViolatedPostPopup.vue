<template>
  <div class="modal-content custom-popup-content">
    <div class="modal-header custom-popup-header">
      <h5 class="modal-title custom-popup-title">
        <i class="bi bi-exclamation-circle-fill me-2"></i> Chi tiết Bài viết Vi phạm
      </h5>
      <button type="button" class="btn-close custom-close-button" @click="$emit('close')" aria-label="Close"></button>
    </div>

    <div class="modal-body custom-popup-body">
      <div class="mb-3">
        <label class="form-label custom-label">ID Bài viết:</label>
        <p class="form-control-plaintext custom-text">{{ localPost.id }}</p>
      </div>
      <div class="mb-3">
        <label class="form-label custom-label">Tiêu đề:</label>
        <p class="form-control-plaintext custom-text">{{ localPost.title }}</p>
      </div>
      <div class="mb-3">
        <label class="form-label custom-label">Tác giả:</label>
        <p class="form-control-plaintext custom-text">{{ localPost.author }} <span v-if="localPost.authorId">(ID: {{ localPost.authorId }})</span></p>
      </div>
      <div class="mb-3">
        <label class="form-label custom-label">Ngày báo cáo:</label>
        <p class="form-control-plaintext custom-text">{{ localPost.reportDate }}</p>
      </div>
      <div class="mb-3">
        <label class="form-label custom-label">Lý do vi phạm:</label>
        <p class="form-control-plaintext custom-text">{{ localPost.reason }}</p>
      </div>
      <div class="mb-3">
        <label class="form-label custom-label">Nội dung vi phạm:</label>
        <div class="card custom-text-card">
          <div class="card-body">
            {{ localPost.content }}
          </div>
        </div>
      </div>
      <div class="mb-3">
        <label class="form-label custom-label">Trạng thái:</label>
        <span :class="['badge', getStatusBadgeClass(localPost.status)]">{{ getStatusText(localPost.status) }}</span>
      </div>
    </div>

    <div class="modal-footer custom-popup-footer">
      <button type="button" class="btn btn-secondary custom-cancel-button" @click="$emit('close')">Đóng</button>
      <button v-if="localPost.status === 'pending_review'" type="button" class="btn btn-success me-2" @click="$emit('resolve', localPost.id)">
        <i class="bi bi-check-circle me-2"></i> Giải quyết
      </button>
      <button v-if="localPost.status === 'pending_review'" type="button" class="btn btn-warning text-dark me-2" @click="$emit('reject', localPost.id)">
        <i class="bi bi-x-circle me-2"></i> Bác bỏ
      </button>
      <button type="button" class="btn btn-delete" @click="$emit('delete', localPost.id)">
        <i class="bi bi-trash me-2"></i> Xóa bài viết
      </button>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  props: ['post'],
  emits: ['close', 'resolve', 'reject', 'delete'],
  setup(props) {
    const localPost = ref(props.post ? { ...props.post } : {});

    watch(
      () => props.post,
      (newVal) => {
        localPost.value = newVal ? { ...newVal } : {};
      },
      { immediate: true, deep: true }
    );

    const getStatusBadgeClass = (status) => {
      switch (status) {
        case 'pending_review': return 'bg-warning text-dark';
        case 'rejected': return 'bg-danger';
        case 'resolved': return 'bg-success';
        default: return 'bg-secondary';
      }
    };

    const getStatusText = (status) => {
      switch (status) {
        case 'pending_review': return 'Chờ duyệt';
        case 'rejected': return 'Bị bác bỏ';
        case 'resolved': return 'Đã giải quyết';
        default: return 'Không xác định';
      }
    };

    return {
      localPost,
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
  color: #dc3545; /* Màu đỏ cho icon cảnh báo */
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

.custom-text-card {
  background-color: #f0f4f7;
  border: 1px solid #e9ecef;
  border-radius: 0.75rem;
  padding: 1rem;
  font-size: 0.95rem;
  color: #495057;
  white-space: pre-wrap; /* Preserve whitespace and allow wrapping */
  word-wrap: break-word; /* Break long words */
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

/* Button styles (reused from ViolatedPostsTable, no custom-save-button for this popup) */
.btn-success, .btn-warning, .btn-delete, .custom-cancel-button {
  padding: 0.65rem 1.25rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
}
.btn-success i, .btn-warning i, .btn-delete i {
    margin-right: 0.5rem;
}

.btn-success { background-color: #28a745; border-color: #28a745; color: #fff; }
.btn-success:hover { background-color: #218838; border-color: #1e7e34; }

.btn-warning { background-color: #ffc107; border-color: #ffc107; color: #212529; }
.btn-warning:hover { background-color: #e0a800; border-color: #d39e00; }

.btn-delete { background-color: #dc3545; border-color: #dc3545; color: #fff; }
.btn-delete:hover { background-color: #c82333; border-color: #bd2130; }

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
  .custom-text-card { padding: 0.8rem; font-size: 0.85rem; }

  .btn-success, .btn-warning, .btn-delete, .custom-cancel-button {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
}
</style>