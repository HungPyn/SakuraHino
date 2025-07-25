<template>
  <div class="lesson-admin-container">
    <div class="main-content flex-grow-1 p-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="bi bi-book learning-path-title"> Quản lý Bài học</h1>
        <div>
          <button class="btn btn-outline-primary me-2" @click="toggleViewMode">
            <i :class="[isTopicView ? 'bi bi-table' : 'bi bi-folder-fill']"></i>
            {{ isTopicView ? 'Xem tất cả Bài học' : 'Duyệt theo Chủ đề' }}
          </button>

          <button class="btn btn-info me-2" @click="exportLessonsToExcel">
            <i class="bi bi-file-earmark-spreadsheet me-2"></i>Xuất Excel
          </button>
          <input type="file" ref="importExcelInput" style="display: none;" @change="importLessonsFromExcel" accept=".xlsx, .xls, .csv">
          <button class="btn btn-secondary me-2" @click="triggerImportExcel">
            <i class="bi bi-upload me-2"></i>Nhập Excel
          </button>

          <button class="btn btn-success" @click="openCreateLessonModal">
            <i class="bi bi-plus-circle me-2"></i>Thêm Bài học Mới
          </button>
        </div>
      </div>

      <div v-if="isTopicView" class="row mb-4">
        <div class="col-md-3">
          <div class="card p-3 text-center shadow-sm h-100 d-flex flex-column justify-content-center align-items-center" style="background-color: #e6f7ff; border-color: #91d5ff;">
            <i class="bi bi-folder-fill text-primary display-5 mb-2"></i>
            <h3 class="mb-0 text-primary">{{ topicStats.totalTopics }}</h3>
            <p class="text-muted mb-0">Tổng số Chủ đề</p>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card p-3 text-center shadow-sm h-100 d-flex flex-column justify-content-center align-items-center" style="background-color: #e6ffe6; border-color: #95de64;">
            <i class="bi bi-folder-check text-success display-5 mb-2"></i>
            <h3 class="mb-0 text-success">{{ topicStats.activeTopics }}</h3>
            <p class="text-muted mb-0">Chủ đề đang hoạt động</p>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card p-3 text-center shadow-sm h-100 d-flex flex-column justify-content-center align-items-center" style="background-color: #fffbe6; border-color: #ffe58f;">
            <i class="bi bi-journal-check text-warning display-5 mb-2"></i>
            <h3 class="mb-0 text-warning">{{ topicStats.totalLessonsInTopics }}</h3>
            <p class="text-muted mb-0">Tổng Bài học trong Chủ đề</p>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card p-3 text-center shadow-sm h-100 d-flex flex-column justify-content-center align-items-center" style="background-color: #f0e6ff; border-color: #d3adf7;">
            <i class="bi bi-bar-chart-fill text-info display-5 mb-2"></i>
            <h3 class="mb-0 text-info">{{ topicStats.mostLessonsTopicName || 'N/A' }}</h3>
            <p class="text-muted mb-0">Chủ đề nhiều bài học nhất</p>
          </div>
        </div>
      </div>


      <template v-if="!isTopicView">
        <LessonFilter
          v-model:searchText="searchQuery"
          v-model:filterLevel="filterLevel"
          v-model:filterTopicId="filterTopicId"
          :availableLevels="availableLevels"
          :availableTopics="availableTopics"
          @reset-filters="resetFilters"
        />

        <LessonTable
          :lessons="paginatedLessons"
          :sort-by-field="sortByField"
          :sort-direction="sortDirection"
          @sort="sortBy"
          @edit="onEdit"
          @delete="onDelete"
        />

        <Pagination
          v-if="totalPages > 1"
          v-model:currentPage="currentPage"
          :totalPages="totalPages"
        />
      </template>
      <template v-else>
        <TopicLessonAccordion
          ref="topicAccordion"
          @edit-lesson="onEdit"
          @delete-lesson="onDelete"
          @edit-topic="onEditTopic"
          @delete-topic="handleTopicDeleted"
          @refresh-data="handleRefreshAllData"
        />
        <div class="mt-4">
          <button class="btn btn-primary" @click="openCreateTopicModal">
            <i class="bi bi-folder-plus me-2"></i>Thêm Chủ đề Mới
          </button>
        </div>
      </template>
    </div>

    <LessonFormModal ref="lessonFormModal" @lesson-saved="handleLessonSaved" :availableTopics="availableTopics" />
    <TopicFormModal ref="topicFormModal" @topic-saved="handleTopicSaved" />
    
    <NotificationToast ref="notificationToast" />

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, reactive } from 'vue';
import LessonFilter from '../lesson/LessonFilter.vue';
import LessonTable from '../lesson/LessonTable.vue';
import LessonFormModal from '../lesson/LessonFormModal.vue';
import Pagination from '../share/Pagination.vue';
import NotificationToast from '../share/NotificationToast.vue';
import TopicLessonAccordion from '../lesson/TopicLessonAccordion.vue';
import TopicFormModal from '../lesson/TopicFormModal.vue';

import lessonService from '../../services/lessonService';
import topicService from '../../services/topicService';

// Import thư viện Excel
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';

// --- View Mode State ---
const isTopicView = ref(false);

// --- Lesson Management States (for !isTopicView) ---
const allLessons = ref([]);
const searchQuery = ref('');
const filterLevel = ref('');
const filterTopicId = ref('');

// Pagination & Sorting
const currentPage = ref(1);
const itemsPerPage = ref(10);
const sortByField = ref('updatedAt');
const sortDirection = ref('desc');

// Available data for filters/forms
const availableLevels = ref(['N5', 'N4', 'N3', 'N2', 'N1']);
const availableTopics = ref([]);

// Modals refs
const lessonFormModal = ref(null);
const topicFormModal = ref(null);
const topicAccordion = ref(null);
const importExcelInput = ref(null);

// Ref cho NotificationToast
const notificationToast = ref(null);

// --- Topic Statistics State ---
const topicStats = reactive({
  totalTopics: 0,
  activeTopics: 0,
  totalLessonsInTopics: 0,
  mostLessonsTopicName: ''
});


// --- Computed Properties for Lesson View ---
const filteredAndSortedLessons = computed(() => {
  let result = [...allLessons.value];

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(lesson =>
      lesson.name.toLowerCase().includes(query) ||
      lesson.description.toLowerCase().includes(query) ||
      (lesson.topicName && lesson.topicName.toLowerCase().includes(query))
    );
  }

  if (filterLevel.value) {
    result = result.filter(lesson => lesson.level === filterLevel.value);
  }

  if (filterTopicId.value) {
    result = result.filter(lesson => lesson.topic_id === parseInt(filterTopicId.value));
  }

  result.sort((a, b) => {
    let valA = a[sortByField.value];
    let valB = b[sortByField.value];

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

  return result;
});

const paginatedLessons = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredAndSortedLessons.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredAndSortedLessons.value.length / itemsPerPage.value);
});


// --- Methods ---

// General fetchers
async function fetchLessons() {
  try {
    allLessons.value = await lessonService.getAllLessons();
  } catch (e) {
    console.error("Failed to fetch lessons:", e);
    notificationToast.value.showToast('Lỗi khi tải bài học!', 'error');
  }
}

async function fetchTopics() {
  try {
    availableTopics.value = await topicService.getAllTopics();
  } catch (e) {
    console.error("Failed to fetch topics:", e);
    notificationToast.value.showToast('Lỗi khi tải chủ đề!', 'error');
  }
}

// Function to fetch topic statistics
async function fetchTopicStats() {
  try {
    const topics = await topicService.getAllTopics();
    const lessons = await lessonService.getAllLessons();

    topicStats.totalTopics = topics.length;
    topicStats.activeTopics = topics.filter(t => t.status === 'active').length;

    let totalLessonsCount = 0;
    let topicLessonCounts = new Map();

    topics.forEach(topic => {
      const lessonsInTopic = lessons.filter(lesson => lesson.topic_id === topic.id);
      totalLessonsCount += lessonsInTopic.length;
      topicLessonCounts.set(topic.name, lessonsInTopic.length);
    });
    topicStats.totalLessonsInTopics = totalLessonsCount;

    let maxLessons = -1;
    let mostLessonsTopic = '';
    for (const [name, count] of topicLessonCounts) {
      if (count > maxLessons) {
        maxLessons = count;
        mostLessonsTopic = name;
      }
    }
    topicStats.mostLessonsTopicName = mostLessonsTopic;

  } catch (error) {
    console.error("Error fetching topic statistics:", error);
    notificationToast.value.showToast('Lỗi khi tải thống kê chủ đề!', 'error');
  }
}


// Filter & Sort methods
function resetFilters() {
  searchQuery.value = '';
  filterLevel.value = '';
  filterTopicId.value = '';
}

function sortBy(field) {
  if (sortByField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortByField.value = field;
    sortDirection.value = 'asc';
  }
}

// Modal opening methods (No confirmation needed, as these only open the form)
function openCreateLessonModal() {
  lessonFormModal.value.openModal();
}

async function onEdit(lessonId) {
  try {
    const lessonToEdit = await lessonService.getLessonById(lessonId);
    if (lessonToEdit) {
      lessonFormModal.value.openModal(lessonToEdit);
    } else {
      notificationToast.value.showToast('Không tìm thấy bài học để chỉnh sửa.', 'error');
    }
  } catch (error) {
    console.error("Error fetching lesson for edit:", error);
    notificationToast.value.showToast('Lỗi khi tải chi tiết bài học.', 'error');
  }
}

// --- Action with Confirmation ---
async function onDelete(lessonId) {
  if (confirm('Bạn có chắc chắn muốn xóa bài học này không? Hành động này không thể hoàn tác.')) {
    try {
      await lessonService.deleteLesson(lessonId);
      await fetchLessons();
      await fetchTopicStats(); // Refresh stats after lesson deletion
      notificationToast.value.showToast('Bài học đã được xóa thành công!', 'success');
    } catch (error) {
      console.error("Error deleting lesson:", error);
      notificationToast.value.showToast('Có lỗi xảy ra khi xóa bài học.', 'error');
    }
  } else {
    notificationToast.value.showToast('Đã hủy xóa bài học.', 'info');
  }
}

function openCreateTopicModal() {
  topicFormModal.value.openModal();
}

async function onEditTopic(topicId) {
  try {
    const topicToEdit = await topicService.getTopicById(topicId);
    if (topicToEdit) {
      topicFormModal.value.openModal(topicToEdit);
    } else {
      notificationToast.value.showToast('Không tìm thấy chủ đề để chỉnh sửa.', 'error');
    }
  } catch (error) {
    console.error("Error fetching topic for edit:", error);
    notificationToast.value.showToast('Lỗi khi tải chi tiết chủ đề.', 'error');
  }
}

// Event handlers from modals/components
async function handleLessonSaved(isNew) { // Pass a flag to indicate if it's a new lesson or update
  // Confirmation for saving (create/update)
  const actionText = isNew ? 'thêm bài học mới' : 'cập nhật bài học';
  if (confirm(`Bạn có muốn ${actionText} không?`)) {
    try {
      // Logic để lưu bài học đã được xử lý trong LessonFormModal,
      // ở đây chỉ cần refetch và thông báo
      await fetchLessons();
      await fetchTopics();
      await fetchTopicStats(); // Refresh stats after lesson save
      if (isTopicView.value && topicAccordion.value) {
        topicAccordion.value.fetchTopics();
      }
      notificationToast.value.showToast(`Bài học đã được ${isNew ? 'thêm' : 'cập nhật'} thành công!`, 'success');
    } catch (error) {
      console.error(`Error saving lesson:`, error);
      notificationToast.value.showToast(`Có lỗi xảy ra khi ${actionText}.`, 'error');
    }
  } else {
    notificationToast.value.showToast(`Đã hủy ${actionText}.`, 'info');
  }
}

async function handleTopicSaved(isNew) { // Pass a flag to indicate if it's a new topic or update
  const actionText = isNew ? 'thêm chủ đề mới' : 'cập nhật chủ đề';
  if (confirm(`Bạn có muốn ${actionText} không?`)) {
    try {
      // Logic để lưu chủ đề đã được xử lý trong TopicFormModal,
      // ở đây chỉ cần refetch và thông báo
      await fetchTopics();
      await fetchLessons();
      await fetchTopicStats(); // Refresh stats after topic save
      if (isTopicView.value && topicAccordion.value) {
        topicAccordion.value.fetchTopics();
      }
      notificationToast.value.showToast(`Chủ đề đã được ${isNew ? 'thêm' : 'cập nhật'} thành công!`, 'success');
    } catch (error) {
      console.error(`Error saving topic:`, error);
      notificationToast.value.showToast(`Có lỗi xảy ra khi ${actionText}.`, 'error');
    }
  } else {
    notificationToast.value.showToast(`Đã hủy ${actionText}.`, 'info');
  }
}


async function handleTopicDeleted(topicId) { // Nhận topicId từ TopicLessonAccordion
   if (confirm('Bạn có chắc chắn muốn xóa chủ đề này không? Tất cả bài học liên quan sẽ bị mất liên kết.')) {
    try {
        await topicService.deleteTopic(topicId); // Gọi service xóa topic
        await fetchTopics();
        await fetchLessons(); // Cần fetch lại bài học để cập nhật thông tin chủ đề
        await fetchTopicStats(); // Refresh stats after topic deletion
        if (isTopicView.value && topicAccordion.value) {
          topicAccordion.value.fetchTopics(); // Cập nhật lại accordion
        }
        notificationToast.value.showToast('Chủ đề đã được xóa thành công!', 'success');
    } catch (error) {
        console.error("Error deleting topic:", error);
        notificationToast.value.showToast('Có lỗi xảy ra khi xóa chủ đề.', 'error');
    }
   } else {
    notificationToast.value.showToast('Đã hủy xóa chủ đề.', 'info');
   }
}

async function handleRefreshAllData() {
    await fetchLessons();
    await fetchTopics();
    await fetchTopicStats(); // Refresh stats on any data refresh
    // notificationToast.value.showToast('Dữ liệu đã được cập nhật!', 'info'); // Tùy chọn, có thể quá nhiều thông báo
}

// Toggle view mode
function toggleViewMode() {
  isTopicView.value = !isTopicView.value;
  if (!isTopicView.value) {
    resetFilters();
    currentPage.value = 1;
  } else {
    // Đảm bảo fetch lại topics và lessons khi chuyển sang chế độ topic view
    // để TopicLessonAccordion có dữ liệu mới nhất
    fetchTopics();
    fetchLessons();
    fetchTopicStats(); // Fetch stats when switching to topic view
  }
}

// --- Excel Export/Import Functions ---

// Helper function to convert data to Excel format
function convertLessonsToExcelData(lessonsData) {
  const headers = [
    'ID', 'Tên Bài học', 'Cấp độ', 'ID Chủ đề', 'Tên Chủ đề',
    'Mô tả', 'URL Hình ảnh', 'Trạng thái',
    'Có Từ vựng', 'Có Ngữ pháp', 'Có Nghe', 'Có Bài tập',
    'Thời gian tạo', 'Thời gian cập nhật',
    'Từ vựng (JSON)', 'Ngữ pháp (JSON)', 'Nghe hiểu (JSON)', 'Bài tập (JSON)'
  ];

  const data = lessonsData.map(lesson => [
    lesson.id,
    lesson.name,
    lesson.level,
    lesson.topic_id,
    lesson.topicName, // Đảm bảo topicName có sẵn từ lessonService._getLessonsWithTopicInfo
    lesson.description,
    lesson.imageUrl,
    // Chuyển đổi trạng thái từ 'published'/'draft' sang 'Đã XB'/'Bản nháp' cho dễ đọc trong Excel
    lesson.status === 'published' ? 'Đã XB' : (lesson.status === 'draft' ? 'Bản nháp' : lesson.status), // Ensure correct mapping
    lesson.hasVocabulary ? 'TRUE' : 'FALSE', // Sử dụng TRUE/FALSE để dễ import lại
    lesson.hasGrammar ? 'TRUE' : 'FALSE',
    lesson.hasListening ? 'TRUE' : 'FALSE',
    lesson.hasExercises ? 'TRUE' : 'FALSE',
    lesson.createdAt || '', // Để trống nếu không có
    lesson.updatedAt || '', // Để trống nếu không có
    JSON.stringify(lesson.vocabulary || []), // Đảm bảo luôn là mảng rỗng nếu null/undefined
    JSON.stringify(lesson.grammar || []),
    JSON.stringify(lesson.listening || {}),
    JSON.stringify(lesson.exercises || [])
  ]);

  return [headers, ...data];
}

async function exportLessonsToExcel() {
  if (!confirm('Bạn có muốn xuất tất cả bài học ra file Excel không?')) {
    notificationToast.value.showToast('Đã hủy xuất file Excel.', 'info');
    return;
  }
  try {
    const lessonsToExport = await lessonService.getAllLessons();
    if (lessonsToExport.length === 0) {
      notificationToast.value.showToast('Không có bài học nào để xuất!', 'info');
      return;
    }

    const ws_data = convertLessonsToExcelData(lessonsToExport);
    const ws = XLSX.utils.aoa_to_sheet(ws_data);

    const colWidths = ws_data[0].map((_, i) => {
        const maxLength = ws_data.reduce((max, row) => Math.max(max, String(row[i]).length), 0);
        return { wch: Math.min(maxLength + 2, 60) }; // Giới hạn chiều rộng cột tối đa 60
    });
    ws['!cols'] = colWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Lessons');

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'DanhSachBaiHoc.xlsx');
    notificationToast.value.showToast('Xuất file Excel thành công!', 'success');
  } catch (error) {
    console.error('Lỗi khi xuất file Excel:', error);
    notificationToast.value.showToast('Có lỗi xảy ra khi xuất file Excel.', 'error');
  }
}

function triggerImportExcel() {
  importExcelInput.value.click();
}

async function importLessonsFromExcel(event) {
  const file = event.target.files[0];
  if (!file) {
    return;
  }

  if (!confirm(`Bạn có muốn nhập dữ liệu từ file "${file.name}" không?`)) {
    notificationToast.value.showToast('Đã hủy nhập file Excel/CSV.', 'info');
    event.target.value = null; // Clear the file input
    return;
  }

  // Check file type. For CSV, use PapaParse. For XLSX, use XLSX.
  const isCsv = file.name.toLowerCase().endsWith('.csv');

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      let importedRawData = [];

      if (isCsv) {
        // Use PapaParse for CSV
        importedRawData = await new Promise((resolve, reject) => {
          Papa.parse(file, {
            header: true, // Auto-detect headers
            skipEmptyLines: true,
            encoding: 'UTF-8',
            complete: (results) => {
              if (results.errors.length > 0) {
                console.error('PapaParse errors:', results.errors);
                // Don't reject fully if there are parse errors but data exists
                // Just log them and let validation handle row-level issues
              }
              resolve(results.data);
            },
            error: (err) => {
              reject(err);
            }
          });
        });
      } else {
        // Use XLSX for Excel files (.xlsx, .xls)
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        importedRawData = XLSX.utils.sheet_to_json(worksheet, { defval: null }); // defval null for empty cells
      }

      if (importedRawData.length === 0) {
        notificationToast.value.showToast('File không chứa dữ liệu bài học hợp lệ.', 'warning');
        return;
      }

      const lessonsToProcess = [];
      const topicNamesMap = new Map(); // Use Map for better performance and consistency
      const currentTopics = await topicService.getAllTopics();
      currentTopics.forEach(topic => {
        topicNamesMap.set(topic.name.toLowerCase(), topic.id);
      });

      for (let i = 0; i < importedRawData.length; i++) {
        const rowData = importedRawData[i];
        const lesson = {};
        let rowErrors = []; // Track errors for this specific row

        // Map and transform data based on expected headers in LessonService.validateLessonData
        // Ensure keys match exactly what lessonService expects (camelCase)
        lesson.id = rowData['ID'] ? parseInt(rowData['ID']) : null;
        if (lesson.id === null && rowData['ID'] !== null && String(rowData['ID']).trim() !== '') { // If ID was provided but not a valid number
          rowErrors.push('ID không hợp lệ.');
        } else if (isNaN(lesson.id)) { // Handle cases where parseInt results in NaN
          lesson.id = null;
        }

        lesson.name = rowData['Tên Bài học'] || null;
        lesson.level = rowData['Cấp độ'] || null;

        // Try to get topic_id by ID first, then by name if ID is missing/invalid
        let topicIdFromRow = rowData['ID Chủ đề'] ? parseInt(rowData['ID Chủ đề']) : null;
        if (topicIdFromRow !== null && isNaN(topicIdFromRow)) {
            rowErrors.push('ID Chủ đề không hợp lệ.');
            topicIdFromRow = null; // Reset to null if invalid number
        }

        lesson.topic_id = topicIdFromRow; // Default to topicId from row

        const topicNameFromRow = rowData['Tên Chủ đề'];
        if ((!lesson.topic_id || isNaN(lesson.topic_id)) && topicNameFromRow) {
            const foundTopicIdByName = topicNamesMap.get(String(topicNameFromRow).toLowerCase());
            if (foundTopicIdByName) {
                lesson.topic_id = foundTopicIdByName;
            } else {
                rowErrors.push(`Chủ đề '${topicNameFromRow}' không tồn tại. Vui lòng tạo chủ đề này trước.`);
            }
        }
        
        lesson.description = rowData['Mô tả'] || '';
        lesson.imageUrl = rowData['URL Hình ảnh'] || '';

        // Convert status from 'Đã XB'/'Bản nháp' back to 'published'/'draft'
        const statusRaw = rowData['Trạng thái'];
        if (statusRaw) {
          lesson.status = statusRaw.toLowerCase() === 'đã xb' ? 'published' : (statusRaw.toLowerCase() === 'bản nháp' ? 'draft' : statusRaw.toLowerCase());
        } else {
          lesson.status = null; // Let validation handle missing status
        }
        
        // Convert boolean-like strings to actual booleans
        lesson.hasVocabulary = String(rowData['Có Từ vựng']).toUpperCase() === 'TRUE';
        lesson.hasGrammar = String(rowData['Có Ngữ pháp']).toUpperCase() === 'TRUE';
        lesson.hasListening = String(rowData['Có Nghe']).toUpperCase() === 'TRUE';
        lesson.hasExercises = String(rowData['Có Bài tập']).toUpperCase() === 'TRUE';

        // Parse JSON fields
        const jsonFields = {
          vocabulary: 'Từ vựng (JSON)',
          grammar: 'Ngữ pháp (JSON)',
          listening: 'Nghe hiểu (JSON)',
          exercises: 'Bài tập (JSON)'
        };

        for (const [key, header] of Object.entries(jsonFields)) {
          try {
            lesson[key] = rowData[header] ? JSON.parse(rowData[header]) : (key === 'listening' ? {} : []);
          } catch (e) {
            console.error(`Lỗi parse JSON cho trường '${header}' ở hàng ${i + 2}:`, rowData[header], e);
            rowErrors.push(`Lỗi định dạng JSON cho '${header}'.`);
            lesson[key] = (key === 'listening' ? {} : []); // Set default to avoid breaking
          }
        }

        // Add timestamps (optional for import, but good to handle if provided)
        lesson.createdAt = rowData['Thời gian tạo'] || new Date().toISOString();
        lesson.updatedAt = rowData['Thời gian cập nhật'] || new Date().toISOString();


        // Combine initial row errors with potential validation errors from lessonService
        const validationResult = lessonService.validateLessonData(lesson, currentTopics);
        if (!validationResult.isValid || rowErrors.length > 0) {
            // Collect all errors for this row
            const combinedErrors = [...rowErrors, ...validationResult.errors];
            notificationToast.value.showToast(`Dòng ${i + 2}: ${combinedErrors.join('; ')}`, 'error', 5000 + combinedErrors.length * 500);
            console.warn(`Lỗi nhập liệu hàng ${i + 2}:`, lesson, combinedErrors);
            continue; // Skip this lesson if invalid
        }
        
        lessonsToProcess.push(lesson);
      }

      // Now, use the lessonService.importLessons with the prepared data
      const importResult = await lessonService.importLessons(lessonsToProcess);

      if (importResult.success > 0) {
        notificationToast.value.showToast(`Đã nhập thành công ${importResult.success} bài học!`, 'success');
      }
      if (importResult.failed > 0) {
        let errorMessages = importResult.errors.map(err => {
            // Find original row index for error reporting
            const originalIndex = importedRawData.findIndex(row => 
                JSON.stringify(Object.values(row).map(v => v === null ? '' : String(v))) === 
                JSON.stringify(Object.values(err.data).map(v => v === null ? '' : String(v)))
            );
            return `Dòng ${originalIndex !== -1 ? originalIndex + 2 : 'không xác định'}: ${err.message}`;
        }).join('\n');
        notificationToast.value.showToast(`Có ${importResult.failed} bài học bị lỗi. Chi tiết trong console và thông báo lỗi.`, 'warning', 10000);
        console.error('Chi tiết lỗi nhập liệu:', importResult.errors);
      }
      if (importResult.success === 0 && importResult.failed === 0) {
        notificationToast.value.showToast('Không có bài học nào được nhập hoặc cập nhật.', 'info');
      }

      // Refresh data after import
      await fetchLessons();
      await fetchTopics();
      await fetchTopicStats(); // Refresh stats after import
      if (isTopicView.value && topicAccordion.value) {
        topicAccordion.value.fetchTopics();
      }

    } catch (error) {
      console.error('Lỗi khi đọc hoặc xử lý file Excel/CSV:', error);
      notificationToast.value.showToast(`Có lỗi xảy ra khi nhập file: ${error.message}. Vui lòng kiểm tra định dạng file và console.`, 'error');
    } finally {
      // Clear the file input after processing
      event.target.value = null;
    }
  };

  if (isCsv) {
    reader.readAsText(file); // Read as text for PapaParse
  } else {
    reader.readAsArrayBuffer(file); // Read as ArrayBuffer for XLSX
  }
}


// --- Init ---
onMounted(() => {
  fetchLessons();
  fetchTopics();
  fetchTopicStats(); // Fetch stats on initial mount
});

// Watchers for lesson view filters/sorting
watch([searchQuery, filterLevel, filterTopicId, sortByField, sortDirection], () => {
  if (!isTopicView.value) {
    currentPage.value = 1;
  }
});
</script>

<style scoped>
/* Styles remain unchanged */
.lesson-admin-container {
  min-height: 100vh;
  background-color: #f8fafd;
}

.main-content {
  background-color: #ffffff;
  margin-left: 0;
  border-left: none;
  width: 100%;
}

.learning-path-title {
  font-size: 2.5rem;
  color: #007bff;
  margin-bottom: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.card {
  border: none;
  border-radius: 0.75rem;
  box-shadow: 0 4px 8px rgba(0,0,0,0.05); /* Add subtle shadow */
}

.table thead th {
  background-color: #e9f0f8;
  color: #333;
  font-weight: 600;
  border-bottom: 2px solid #dee2e6;
}

.table-hover tbody tr:hover {
  background-color: #f1f7fc;
}

.badge {
  font-size: 0.8em;
  padding: 0.4em 0.7em;
  border-radius: 0.5rem;
}
</style>