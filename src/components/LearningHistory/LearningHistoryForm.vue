<template>
  <form @submit.prevent="handleSubmit">
    <div class="form-group">
      <label for="user-name">Tên người dùng:</label>
      <input type="text" id="user-name" v-model="form.user" required class="form-control" />
    </div>

    <div class="form-group">
      <label for="topic">Topic:</label>
      <select id="topic" v-model="form.topic" required class="form-control">
        <option value="">Chọn một topic</option>
        <option v-for="t in topics" :key="t" :value="t">{{ t }}</option>
      </select>
    </div>

    <div class="form-group">
      <label for="progress">Tiến độ (%):</label>
      <input type="number" id="progress" v-model.number="form.progress" min="0" max="100" required class="form-control" />
    </div>

    <div class="form-actions">
      <button type="submit" class="btn-primary">Lưu</button>
      <button type="button" @click="$emit('cancel')" class="btn-outline-secondary">Hủy</button>
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
    topics: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      form: {
        id: null,
        user: '',
        topic: '',
        progress: 0,
        date: '',
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
            user: '',
            topic: '',
            progress: 0,
            date: '',
          };
        }
      },
      immediate: true,
    },
  },
  methods: {
    handleSubmit() {
      this.$emit('save', this.form);
    },
  },
};
</script>

<style scoped>
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #34495e;
  margin-bottom: 8px;
}

.form-control {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #e0e6ed;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.btn-primary {
  background-color: #2ecc71;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s ease;
}
.btn-primary:hover {
  background-color: #27ae60;
}

.btn-outline-secondary {
  background: none;
  color: #7f8c8d;
  border: 1px solid #bdc3c7;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}
.btn-outline-secondary:hover {
  background-color: #f5f7fa;
}
</style>