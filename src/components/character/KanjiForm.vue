<template>
  <div class="modal-header">
    <h2 class="modal-title">{{ data ? "Chỉnh sửa" : "Thêm mới" }} Kanji</h2>
    <button @click="$emit('cancel')" class="close-btn">&times;</button>
  </div>
  <form @submit.prevent="handleSubmit">
    <div class="form-group">
      <label for="kanji-char">Ký tự Kanji:</label>
      <input
        type="text"
        id="kanji-char"
        v-model="form.japaneseCharacter"
        required
        class="form-control"
      />
    </div>
    <div class="form-group">
      <label for="kanji-meaning">Ý nghĩa:</label>
      <input
        type="text"
        id="kanji-meaning"
        v-model="form.meaning"
        required
        class="form-control"
      />
    </div>
    <div class="form-group">
      <label for="kanji-status">Trạng thái:</label>
      <select
        id="kanji-status"
        v-model="form.status"
        required
        class="form-control"
      >
        <option value="PUBLISHED">Hoạt động</option>
        <option value="PENDING">Chờ duyệt</option>
        <option value="DELETED">Xóa</option>
      </select>
    </div>
    <div class="form-actions">
      <button type="submit" class="btn-primary">Lưu</button>
      <button
        type="button"
        @click="$emit('cancel')"
        class="btn-outline-secondary"
      >
        Hủy
      </button>
    </div>
  </form>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      form: {
        id: null,
        japaneseCharacter: "",
        meaning: "",
        status: "PUBLISHED",
        audioURL: "",
      },
    };
  },
  watch: {
    data: {
      handler(newVal) {
        if (newVal) {
          this.form = { ...newVal };
        } else {
          this.form = {
            id: null,
            japaneseCharacter: "",
            meaning: "",
            status: "PUBLISHED",
            audioURL: "",
          };
        }
      },
      immediate: true,
    },
  },
  methods: {
    handleSubmit() {
      this.$emit("save", this.form);
    },
  },
};
</script>

<style scoped>
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e6ed;
  padding-bottom: 15px;
  margin-bottom: 20px;
}
.modal-title {
  font-size: 2rem;
  color: #2c3e50;
  font-weight: 700;
  margin: 0;
}
.close-btn {
  background: none;
  border: none;
  font-size: 2.5rem;
  cursor: pointer;
  color: #bdc3c7;
  transition: color 0.2s ease;
}
.close-btn:hover {
  color: #e74c3c;
}
.form-group {
  margin-bottom: 20px;
}
.form-group label {
  display: block;
  font-weight: 600;
  color: #34495e;
  margin-bottom: 8px;
  font-size: 1.1rem;
}
.form-control {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}
.form-control:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
}
.btn-primary {
  background-color: #2ecc71;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}
.btn-primary:hover {
  background-color: #27ae60;
  transform: translateY(-2px);
}
.btn-outline-secondary {
  background: none;
  color: #7f8c8d;
  border: 1px solid #bdc3c7;
  padding: 12px 25px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.btn-outline-secondary:hover {
  color: #555;
  border-color: #7f8c8d;
  background-color: #f0f4f8;
}
</style>
