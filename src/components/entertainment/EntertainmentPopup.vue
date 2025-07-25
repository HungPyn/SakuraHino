<template>
  <div class="modal fade show d-block" tabindex="-1" @click.self="close">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title">{{ isEditMode ? 'Chỉnh sửa Nội dung Giải trí' : 'Thêm Nội dung Giải trí Mới' }}</h5>
          <button type="button" class="btn-close btn-close-white" @click="close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="save">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="title" class="form-label">Tiêu đề <span class="text-danger">*</span></label>
                <input type="text" class="form-control" id="title" v-model="internalStory.title" required />
              </div>
              <div class="col-md-6 mb-3">
                <label for="genre" class="form-label">Thể loại <span class="text-danger">*</span></label>
                <select class="form-select" id="genre" v-model="internalStory.genre" required>
                  <option value="story">Truyện ngắn</option>
                  <option value="comic">Truyện tranh</option>
                  <option value="game">Trò chơi</option>
                  <option value="quiz">Câu đố</option>
                  <option value="other">Khác</option>
                </select>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="status" class="form-label">Trạng thái <span class="text-danger">*</span></label>
                <select class="form-select" id="status" v-model="internalStory.status" required>
                  <option value="published">Đã xuất bản</option>
                  <option value="draft">Bản nháp</option>
                  <option value="archived">Lưu trữ</option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label for="chapter" class="form-label">Chương (nếu có)</label>
                <input type="number" class="form-control" id="chapter" v-model.number="internalStory.chapter" min="1" />
                <small class="form-text text-muted">Để trống nếu không áp dụng.</small>
              </div>
            </div>

            <div class="mb-3">
              <label for="topic" class="form-label">Tên chủ đề (nếu có)</label>
              <input type="text" class="form-control" id="topic" v-model="internalStory.topic" />
              <small class="form-text text-muted">Ví dụ: Văn hóa Nhật Bản, Ngữ pháp N5.</small>
            </div>

            <div class="mb-3">
              <label for="description" class="form-label">Mô tả</label>
              <textarea class="form-control" id="description" rows="3" v-model="internalStory.description"></textarea>
            </div>

            <div class="mb-3">
              <label for="imageUrl" class="form-label">URL Ảnh bìa</label>
              <input type="url" class="form-control" id="imageUrl" v-model="internalStory.imageUrl" />
            </div>

            <div class="mb-3">
              <label for="content" class="form-label">Nội dung</label>
              <textarea class="form-control" id="content" rows="6" v-model="internalStory.content"></textarea>
            </div>

            <div class="modal-footer justify-content-end">
              <button type="button" class="btn btn-secondary" @click="close">Hủy</button>
              <button type="submit" class="btn btn-primary">
                <i class="bi bi-save me-2"></i> Lưu
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    story: {
      type: Object,
      default: null,
    },
  },
  emits: ['close', 'save'],
  data() {
    return {
      internalStory: {
        id: null,
        title: '',
        description: '',
        genre: 'story', // Giá trị mặc định
        status: 'draft', // Giá trị mặc định
        chapter: null, // Mặc định là null
        topic: '',     // Mặc định là chuỗi rỗng
        imageUrl: '',
        content: '',
      },
    };
  },
  computed: {
    isEditMode() {
      return this.internalStory && this.internalStory.id !== null;
    },
  },
  watch: {
    story: {
      handler(newVal) {
        if (newVal) {
          // Khi chỉnh sửa, sao chép dữ liệu từ prop sang internalStory
          this.internalStory = { ...newVal };
        } else {
          // Khi thêm mới, reset về giá trị mặc định
          this.internalStory = {
            id: null,
            title: '',
            description: '',
            genre: 'story',
            status: 'draft',
            chapter: null, // Đảm bảo giá trị mặc định khi thêm mới
            topic: '',     // Đảm bảo giá trị mặc định khi thêm mới
            imageUrl: '',
            content: '',
          };
        }
      },
      immediate: true, // Chạy handler ngay lập tức khi component được tạo
    },
  },
  methods: {
    close() {
      this.$emit('close');
    },
    save() {
      // Đảm bảo chapter là null nếu input rỗng
      if (this.internalStory.chapter === '') {
        this.internalStory.chapter = null;
      }
      this.$emit('save', this.internalStory);
    },
  },
};
</script>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.5); /* Overlay background */
}

.modal-content {
  border-radius: 0.75rem;
  overflow: hidden; /* For header border-radius */
}

.modal-header {
  border-bottom: none;
  border-top-left-radius: 0.75rem;
  border-top-right-radius: 0.75rem;
  padding: 1.5rem;
}

.modal-title {
  font-weight: 600;
  font-size: 1.5rem;
}

.modal-body {
  padding: 2rem;
}

.form-label {
  font-weight: 500;
  color: #34495e;
}

.form-control,
.form-select {
  border-radius: 0.5rem;
  border-color: #e0e0e0;
  padding: 0.75rem 1rem;
}

.form-control:focus,
.form-select:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.modal-footer {
  border-top: none;
  padding: 1.5rem 2rem;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
  transition: all 0.2s ease-in-out;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
  transform: translateY(-1px);
}

.btn-secondary {
  background-color: #6c757d;
  border-color: #6c757d;
  transition: all 0.2s ease-in-out;
}

.btn-secondary:hover {
  background-color: #5a6268;
  border-color: #545b62;
  transform: translateY(-1px);
}
</style>