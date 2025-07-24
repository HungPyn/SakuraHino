<template>
  <div class="lesson-admin-container">
    <div class="main-content flex-grow-1 p-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="bi bi-book learning-path-title"> Chủ đề Bài học</h1>
        <button class="btn btn-success" @click="openCreateLessonModal">
          <i class="bi bi-plus-circle me-2"></i>Thêm bài học
        </button>
      </div>

      <LessonFilter
        v-model:searchText="searchQuery"
        v-model:filterLevel="filterLevel"
        :availableLevels="availableLevels"
        @reset-filters="resetFilters"
      />

      <LessonTable
        :lessons="paginatedLessons"
        @edit="onEdit"
        @delete="onDelete"
      />

      <Pagination
        v-if="totalPages > 1"
        v-model:currentPage="currentPage"
        :totalPages="totalPages"
        @page-changed="goToPage"
      />
      
    </div>

    <LessonFormModal ref="lessonFormModal" @lesson-saved="handleLessonSaved" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import LessonFilter from '../lesson/LessonFilter.vue';
import LessonTable from '../lesson/LessonTable.vue';
import LessonFormModal from '../lesson/LessonFormModal.vue';
import Pagination from '../share/Pagination.vue'; // Đảm bảo đường dẫn đúng
import lessonService from '../../services/lessonService';

// State
const allLessons = ref([]);
const searchQuery = ref('');
const filterLevel = ref('');
// Đã thêm filterStatus trở lại như cũ nếu có, nếu không thì bỏ
// const filterStatus = ref('');
const availableLevels = ref(['N5', 'N4', 'N3', 'N2', 'N1']);

const currentPage = ref(1);
const itemsPerPage = ref(10);

// Modal ref
const lessonFormModal = ref(null);

// --- Computed ---
const filteredLessons = computed(() => {
  let result = [...allLessons.value];

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(lesson =>
      lesson.name.toLowerCase().includes(query) ||
      lesson.topic.toLowerCase().includes(query)
    );
  }

  // Chú ý: bạn đang lọc theo `lesson.topic === filterLevel.value`
  // Trong khi `filterLevel` thường dùng cho `lesson.level`.
  // Hãy kiểm tra lại logic này. Tôi sẽ để nguyên như bạn đang dùng.
  if (filterLevel.value) {
    result = result.filter(lesson => lesson.topic === filterLevel.value);
  }

  // Bạn đã bỏ phần sắp xếp trong file này, tôi sẽ thêm lại để đảm bảo tính năng đầy đủ
  // Nếu bạn không cần sắp xếp ở đây, có thể bỏ qua phần này
  // Nếu bạn muốn sắp xếp, LessonTable cũng cần prop `sortByField` và `sortDirection`
  // và emit sự kiện `@sort`
  /*
  result.sort((a, b) => {
    // Logic sắp xếp bạn đã có trước đó
    let valA = a[sortByField.value]; // Cần định nghĩa sortByField
    let valB = b[sortByField.value]; // Cần định nghĩa sortDirection

    if (sortByField.value === 'updatedAt' || sortByField.value === 'createdAt') {
      valA = new Date(valA);
      valB = new Date(valB);
    }
    if (typeof valA === 'string' && typeof valB === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
    }

    if (valA < valB) return sortDirection.value === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection.value === 'asc' ? 1 : -1;
    return 0;
  });
  */

  return result;
});

const paginatedLessons = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredLessons.value.slice(start, start + itemsPerPage.value);
});

const totalPages = computed(() => {
  return Math.ceil(filteredLessons.value.length / itemsPerPage.value);
});

// --- Methods ---
async function fetchLessons() {
  try {
    allLessons.value = await lessonService.getAllLessons();
  } catch (e) {
    console.error("Failed to fetch lessons:", e);
  }
}

function resetFilters() {
  searchQuery.value = '';
  filterLevel.value = '';
}

// Phương thức này giờ sẽ được gọi khi Pagination component emit 'page-changed' hoặc 'update:currentPage'
function goToPage(page) {
  currentPage.value = page; // Đã là v-model nên có thể không cần hàm này nếu chỉ dùng v-model
}


function openCreateLessonModal() {
  lessonFormModal.value.openModal();
}

async function onEdit(id) {
  const lesson = await lessonService.getLessonById(id);
  if (lesson) {
    lessonFormModal.value.openModal(lesson);
  }
}

async function onDelete(id) {
  if (confirm('Bạn có chắc chắn muốn xóa bài học này không?')) {
    await lessonService.deleteLesson(id);
    await fetchLessons();
    alert('Đã xóa thành công!');
  }
}

async function handleLessonSaved() {
  await fetchLessons();
}

// --- Init ---
onMounted(() => {
  fetchLessons();
});

watch([searchQuery, filterLevel], () => {
  currentPage.value = 1;
});
</script>

<style scoped>
.lesson-admin-container {
  min-height: 100vh;
  background-color: #f8fafd; /* Màu đã điều chỉnh lại cho phù hợp với tông trắng */
}

.main-content {
  background-color: #ffffff;
  margin-left: 0; /* Đã được sửa để bỏ sidebar */
  border-left: none; /* Đã được sửa để bỏ sidebar */
  width: 100%; /* Đảm bảo chiếm toàn bộ chiều rộng có sẵn */
}

.table thead th {
  background-color: #e9f0f8; /* Màu header bảng */
  color: #333;
  font-weight: 600;
  border-bottom: 2px solid #dee2e6;
}

/* Custom style cho tiêu đề có icon */
.learning-path-title {
  font-size: 2.5rem; /* Tăng kích thước font */
  color: #007bff; /* Màu sắc phù hợp */
  margin-bottom: 0;
  display: flex;
  align-items: center;
  gap: 10px; /* Khoảng cách giữa icon và text */
}

/* Các styles khác đã có hoặc thêm vào nếu cần */
.card {
  border: none;
  border-radius: 0.75rem;
}

.table-hover tbody tr:hover {
  background-color: #f1f7fc;
}

.badge {
  font-size: 0.8em;
  padding: 0.4em 0.7em;
  border-radius: 0.5rem;
}

/* Pagination styles are now handled by Pagination.vue if it needs custom ones */
</style>