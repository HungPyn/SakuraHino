<template>
  <transition name="fade">
    <div v-if="isVisible" :class="['notification-toast', typeClass]">
      <div class="toast-content">
        <i :class="['bi', iconClass, 'me-2']"></i>
        <span>{{ message }}</span>
      </div>
      <button v-if="dismissible" @click="hide" class="btn-close-toast">
        <i class="bi bi-x-lg"></i>
      </button>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: 'success', // 'success', 'error', 'info', 'warning'
    },
    duration: {
      type: Number,
      default: 3000, // Thời gian hiển thị (ms). 0 = không tự đóng
    },
    dismissible: {
      type: Boolean,
      default: true, // Có thể đóng bằng tay không
    },
  },
  data() {
    return {
      isVisible: false,
      timeoutId: null,
    };
  },
  computed: {
    typeClass() {
      return `toast-${this.type}`;
    },
    iconClass() {
      switch (this.type) {
        case 'success':
          return 'bi-check-circle-fill';
        case 'error':
          return 'bi-x-circle-fill';
        case 'info':
          return 'bi-info-circle-fill';
        case 'warning':
          return 'bi-exclamation-triangle-fill';
        default:
          return 'bi-info-circle-fill';
      }
    },
  },
  methods: {
    show() {
      this.isVisible = true;
      if (this.duration > 0) {
        if (this.timeoutId) {
          clearTimeout(this.timeoutId);
        }
        this.timeoutId = setTimeout(() => {
          this.hide();
        }, this.duration);
      }
    },
    hide() {
      this.isVisible = false;
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }
    },
  },
  watch: {
    // Watch message prop to re-show toast if message changes while already visible
    message() {
      if (this.isVisible) {
        this.show();
      }
    }
  }
};
</script>

<style scoped>
.notification-toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  min-width: 250px;
  max-width: 350px;
  padding: 15px 20px;
  border-radius: 8px;
  color: #fff;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1100; /* Cao hơn modal backdrop */
}

.toast-content {
  display: flex;
  align-items: center;
  flex-grow: 1;
}

.toast-content i {
  font-size: 1.3rem;
  margin-right: 10px;
}

.btn-close-toast {
  background: none;
  border: none;
  color: inherit; /* Kế thừa màu chữ từ toast */
  font-size: 1rem;
  cursor: pointer;
  margin-left: 15px;
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

.btn-close-toast:hover {
  opacity: 1;
}

/* Specific toast types */
.toast-success {
  background-color: #28a745; /* Bootstrap success green */
}
.toast-error {
  background-color: #dc3545; /* Bootstrap danger red */
}
.toast-info {
  background-color: #17a2b8; /* Bootstrap info blue */
}
.toast-warning {
  background-color: #ffc107; /* Bootstrap warning yellow */
  color: #343a40; /* Đổi màu chữ cho warning để dễ đọc */
}

/* Transition styles */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>