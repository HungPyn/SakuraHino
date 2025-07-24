<template>
  <nav aria-label="Page navigation">
    <ul class="pagination justify-content-center">
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <a class="page-link" href="#" @click.prevent="goToPage(currentPage - 1)">Trước</a>
      </li>
      <li class="page-item" v-for="page in pages" :key="page" :class="{ active: currentPage === page }">
        <a class="page-link" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
      </li>
      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <a class="page-link" href="#" @click.prevent="goToPage(currentPage + 1)">Sau</a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  // Để giới hạn số nút trang hiển thị, có thể thêm prop này
  // Ví dụ: hiển thị 5 nút trang (2 trước, current, 2 sau)
  maxVisibleButtons: {
    type: Number,
    default: 5
  }
});

const emit = defineEmits(['update:currentPage', 'page-changed']);

// Hàm này sẽ phát ra sự kiện khi trang thay đổi
const goToPage = (page) => {
  if (page >= 1 && page <= props.totalPages) {
    emit('update:currentPage', page); // Cập nhật v-model
    emit('page-changed', page); // Sự kiện bổ sung nếu cần
  }
};

// Computed property để tính toán các nút trang sẽ hiển thị
const pages = computed(() => {
  const range = [];
  let start = Math.max(1, props.currentPage - Math.floor(props.maxVisibleButtons / 2));
  let end = Math.min(props.totalPages, start + props.maxVisibleButtons - 1);

  if (end - start + 1 < props.maxVisibleButtons) {
    start = Math.max(1, end - props.maxVisibleButtons + 1);
  }

  for (let i = start; i <= end; i++) {
    range.push(i);
  }
  return range;
});

</script>

<style scoped>
.pagination .page-link {
  cursor: pointer;
}
</style>