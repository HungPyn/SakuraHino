<template>
  <v-container fluid class="main-content-dashboard pa-8">
    <!-- Header Section -->
    <v-row class="mb-6 align-center">
      <v-col cols="12" md="8">
        <h1 class="text-h4 font-weight-bold text-dark-emphasis mb-2 d-flex align-center">
          <v-icon size="36" class="mr-3">fa-solid fa-clipboard-question</v-icon>
          🖊️ <span class="ml-1">Quản lý bài tập & luyện tập</span>
        </h1>
        <p class="text-subtitle-1 text-medium-emphasis">
          <v-icon size="18" class="mr-2">fa-solid fa-sliders</v-icon>
        
        </p>
      </v-col>
      <v-col cols="12" md="4" class="text-md-end text-start">
        <v-btn
          color="primary"
          class="add-new-btn"
          size="large"
          rounded
          elevation="2"
          @click="openDialog"
          prepend-icon="fa-solid fa-plus-circle"
        >
          <v-icon class="mr-2">fa-solid fa-plus</v-icon>➕ Thêm bài tập mới
        </v-btn>
      </v-col>
    </v-row>

    <!-- Summary Cards Section -->
    <v-row class="mb-8">
      <v-col cols="12" sm="6" md="3">
        <v-card class="summary-card" elevation="2" rounded="lg" color="blue-lighten-5">
          <v-card-text class="d-flex align-center justify-space-between">
            <div>
              <div class="text-subtitle-2 text-medium-emphasis">
                <v-icon size="18" class="mr-2">fa-solid fa-list-check</v-icon>✍️ Tổng bài tập
              </div>
              <div class="text-h5 font-weight-bold text-dark-emphasis">{{ totalExercises }}</div>
            </div>
            <v-icon size="48" color="blue-grey-lighten-2">fa-solid fa-dumbbell</v-icon>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="summary-card" elevation="2" rounded="lg" color="green-lighten-5">
          <v-card-text class="d-flex align-center justify-space-between">
            <div>
              <div class="text-subtitle-2 text-medium-emphasis">
                <v-icon size="18" class="mr-2">fa-solid fa-tags</v-icon>🧩 Tổng chủ đề
              </div>
              <div class="text-h5 font-weight-bold text-dark-emphasis">{{ totalTopics }}</div>
            </div>
            <v-icon size="48" color="green-lighten-2">fa-solid fa-folder-tree</v-icon>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="summary-card" elevation="2" rounded="lg" color="purple-lighten-5">
          <v-card-text class="d-flex align-center justify-space-between">
            <div>
              <div class="text-subtitle-2 text-medium-emphasis">
                <v-icon size="18" class="mr-2">fa-solid fa-clipboard-check</v-icon>📤 Đã xuất bản
              </div>
              <div class="text-h5 font-weight-bold text-dark-emphasis">{{ publishedExercises }}</div>
            </div>
            <v-icon size="48" color="purple-lighten-2">fa-solid fa-share-nodes</v-icon>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="summary-card" elevation="2" rounded="lg" color="orange-lighten-5">
          <v-card-text class="d-flex align-center justify-space-between">
            <div>
              <div class="text-subtitle-2 text-medium-emphasis">
                <v-icon size="18" class="mr-2">fa-solid fa-clock-rotate-left</v-icon>⏳ Bản nháp
              </div>
              <div class="text-h5 font-weight-bold text-dark-emphasis">{{ draftExercises }}</div>
            </div>
            <v-icon size="48" color="orange-lighten-2">fa-solid fa-hourglass-half</v-icon>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Main Content Section: Search, Filters & List -->
    <v-card class="main-content-card" elevation="2" rounded="lg">
      <v-toolbar flat class="px-4 py-2">
        <v-text-field
          v-model="searchQuery"
          density="comfortable"
          label="🔍 Tìm kiếm bài tập..."
          prepend-inner-icon="fa-solid fa-magnifying-glass"
          single-line
          hide-details
          flat
          variant="solo"
          rounded="lg"
          class="search-input"
        ></v-text-field>

        <v-spacer></v-spacer>

        <!-- Topic Filter (Chủ đề) -->
        <v-select
          v-model="selectedTopic"
          :items="topicFilters"
          label="Tất cả chủ đề"
          variant="solo-filled"
          density="comfortable"
          flat
          hide-details
          rounded="lg"
          class="filter-select mr-4"
        ></v-select>

        <!-- Exercise Type Filter -->
        <v-select
          v-model="selectedExerciseType"
          :items="exerciseTypeFilters"
          item-value="value"
          item-title="text"
          label="Tất cả loại bài tập"
          variant="solo-filled"
          density="comfortable"
          flat
          hide-details
          rounded="lg"
          class="filter-select mr-4"
        ></v-select>

        <!-- Level Filter -->
        <v-select
          v-model="selectedLevel"
          :items="levelFilters"
          label="Tất cả cấp độ"
          variant="solo-filled"
          density="comfortable"
          flat
          hide-details
          rounded="lg"
          class="filter-select"
        ></v-select>
      </v-toolbar>

      <v-divider></v-divider>

      <v-card-text class="pa-0 pt-4">
        <div v-if="paginatedExercises.length > 0">
          <v-card
            v-for="exercise in paginatedExercises"
            :key="exercise.id"
            class="exercise-item-card mb-4 mx-4"
            elevation="1"
            rounded="lg"
          >
            <v-card-text>
              <div class="d-flex justify-space-between align-start mb-2">
                <div class="d-flex flex-column">
                  <div class="d-flex align-center text-subtitle-1 font-weight-bold">
                    <span class="text-h6 mr-2">{{ getExerciseEmoji(exercise.type) }}</span>
                    {{ exercise.title }}
                    <v-chip :color="getLevelColor(exercise.level)" size="small" class="ml-3 font-weight-medium">{{ exercise.level }}</v-chip>
                    <v-chip :color="getTypeColor(exercise.type)" size="small" class="ml-2 font-weight-medium" variant="outlined">{{ getExerciseTypeName(exercise.type) }}</v-chip>
                  </div>
                  <span class="text-body-2 text-medium-emphasis mt-1">
                    Chủ đề: <span class="font-weight-medium">{{ exercise.topic }}</span>
                  </span>
                </div>
                <div class="d-flex align-center ga-1">
                  <!-- CRUD Buttons with Emojis directly -->
                  <v-btn icon size="small" color="blue-grey-darken-1" variant="text" @click="viewExercise(exercise)">
                    <span class="text-h6">🙇‍♀️</span> <!-- View Emoji -->
                    <v-tooltip activator="parent" location="top">Xem chi tiết</v-tooltip>
                  </v-btn>
                  <v-btn icon size="small" color="info" variant="text" @click="editExercise(exercise)">
                    <span class="text-h6">🛠️</span> <!-- Edit Emoji -->
                    <v-tooltip activator="parent" location="top">Chỉnh sửa</v-tooltip>
                  </v-btn>
                  <v-btn icon size="small" color="error" variant="text" @click="confirmDelete(exercise.id, exercise.title)">
                    <span class="text-h6">🗑️</span> <!-- Delete Emoji -->
                    <v-tooltip activator="parent" location="top">Xóa</v-tooltip>
                  </v-btn>
                </div>
              </div>
              <!-- Display exercise-specific content preview -->
              <div class="exercise-preview mt-3 text-medium-emphasis text-body-2">
                <template v-if="exercise.type === 'matching'">
                  <p class="font-weight-medium">Nối nghĩa:</p>
                  <ul>
                    <li v-for="(pair, idx) in exercise.pairs.slice(0, 2)" :key="idx">
                      {{ pair.left }} - {{ pair.right }}
                    </li>
                    <li v-if="exercise.pairs.length > 2">...</li>
                  </ul>
                </template>
                <template v-else-if="exercise.type === 'fill_in_the_blanks'">
                  <p class="font-weight-medium">Điền từ:</p>
                  <p v-html="highlightBlanks(exercise.sentence)"></p>
                </template>
                <template v-else-if="exercise.type === 'multiple_choice'">
                  <p class="font-weight-medium">Chọn từ:</p>
                  <p>{{ exercise.question }}</p>
                  <ul>
                    <li v-for="(option, idx) in exercise.options.slice(0, 2)" :key="idx">
                      {{ option }}
                    </li>
                     <li v-if="exercise.options.length > 2">...</li>
                  </ul>
                </template>
                <template v-else-if="exercise.type === 'notes'">
                  <p class="font-weight-medium">Nội dung lưu ý:</p>
                  <p>{{ truncateContent(exercise.content) }}</p>
                </template>
              </div>

              <div class="text-caption text-medium-emphasis mt-2 d-flex justify-space-between">
                <span>Tạo bởi: {{ exercise.author }}</span>
                <span>Ngày tạo: {{ exercise.date }}</span>
              </div>
            </v-card-text>
          </v-card>
        </div>
        <v-alert v-else type="info" class="ma-4">
          Không tìm thấy bài tập nào khớp với tiêu chí tìm kiếm.
        </v-alert>

        <!-- Pagination -->
        <div class="text-center mt-4 mb-4">
          <v-pagination
            v-model="currentPage"
            :length="pageCount"
            :total-visible="7"
            rounded="circle"
          ></v-pagination>
        </div>
      </v-card-text>
    </v-card>

    <!-- Exercise Form Dialog (Popup for Add/Edit) -->
    <ExerciseFormDialog
      v-model:show="dialog"
      :editedExercise="editedExercise"
      :availableTopics="topicFilters.filter(t => t !== 'Tất cả chủ đề')"
      @save="saveExercise"
    />

    <!-- Exercise View Dialog (Popup for Viewing Details) -->
    <ExerciseViewDialog
      v-model:show="viewDialog"
      :exerciseDetails="currentViewedExercise"
    />

    <!-- Custom Confirmation Dialog for Delete -->
    <ConfirmDialog
      v-model:show="confirmDeleteDialog"
      :title="confirmDialogTitle"
      :message="confirmDialogMessage"
      @confirm="handleDeleteConfirmed"
      @cancel="confirmDeleteDialog = false"
    />
  </v-container>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import ExerciseFormDialog from '../exercise/ExerciseFormDialog.vue'
import ExerciseViewDialog from '../exercise/ExerciseViewDialog.vue'
import ConfirmDialog from '../exercise/ConfirmDialog.vue' 
import exerciseService from '../../services/exerciseService'

const dialog = ref(false) // For Add/Edit form
const viewDialog = ref(false) // For View details
const confirmDeleteDialog = ref(false) // For Delete confirmation
const editedExercise = ref(null)
const currentViewedExercise = ref(null) // To pass data to view dialog
const exerciseToDeleteId = ref(null) // To store ID of exercise to be deleted
const confirmDialogTitle = ref('')
const confirmDialogMessage = ref('')

const searchQuery = ref('')
const selectedTopic = ref('Tất cả chủ đề')
const selectedExerciseType = ref('Tất cả loại bài tập')
const selectedLevel = ref('Tất cả cấp độ')

// Pagination state
const currentPage = ref(1)
const itemsPerPage = 5 // Số lượng bài tập trên mỗi trang

// Raw data from service
const allExercises = ref([])

// Fetch data on component mount
onMounted(async () => {
  allExercises.value = await exerciseService.getAllExercises();
});

const topicFilters = computed(() => {
  const topics = new Set(['Tất cả chủ đề']);
  allExercises.value.forEach(ex => topics.add(ex.topic));
  return Array.from(topics);
});

const exerciseTypeFilters = [
  { text: 'Tất cả loại bài tập', value: 'Tất cả loại bài tập' },
  { text: 'Nối nghĩa', value: 'matching' },
  { text: 'Điền từ', value: 'fill_in_the_blanks' },
  { text: 'Chọn từ', value: 'multiple_choice' },
  { text: 'Lưu ý/Mẹo', value: 'notes' },
];

const levelFilters = [
  'Tất cả cấp độ',
  'N5', 'N4', 'N3', 'N2', 'N1', 'All'
];

// Summary counts
const totalExercises = computed(() => allExercises.value.length);
const totalTopics = computed(() => topicFilters.value.length - 1); // Subtract 'Tất cả chủ đề'
const publishedExercises = computed(() => allExercises.value.filter(ex => ex.status === 'Published').length);
const draftExercises = computed(() => allExercises.value.filter(ex => ex.status === 'Draft').length);


const filteredExercises = computed(() => {
  let filtered = allExercises.value;

  if (searchQuery.value) {
    const searchLower = searchQuery.value.toLowerCase();
    filtered = filtered.filter(ex =>
      ex.title.toLowerCase().includes(searchLower) ||
      ex.topic.toLowerCase().includes(searchLower) ||
      ex.author.toLowerCase().includes(searchLower) ||
      (ex.sentence && ex.sentence.toLowerCase().includes(searchLower)) ||
      (ex.question && ex.question.toLowerCase().includes(searchLower)) ||
      (ex.content && ex.content.toLowerCase().includes(searchLower)) ||
      (ex.pairs && ex.pairs.some(pair => pair.left.toLowerCase().includes(searchLower) || pair.right.toLowerCase().includes(searchLower))) ||
      (ex.options && ex.options.some(option => option.toLowerCase().includes(searchLower)))
    );
  }

  if (selectedTopic.value !== 'Tất cả chủ đề') {
    filtered = filtered.filter(ex => ex.topic === selectedTopic.value);
  }

  if (selectedExerciseType.value !== 'Tất cả loại bài tập') {
    filtered = filtered.filter(ex => ex.type === selectedExerciseType.value);
  }

  if (selectedLevel.value !== 'Tất cả cấp độ') {
    filtered = filtered.filter(ex => ex.level === selectedLevel.value);
  }

  return filtered;
});

// Pagination computed properties
const pageCount = computed(() => {
  return Math.ceil(filteredExercises.value.length / itemsPerPage);
});

const paginatedExercises = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredExercises.value.slice(start, end);
});

// Watchers to reset page when filters change
watch([searchQuery, selectedTopic, selectedExerciseType, selectedLevel], () => {
  currentPage.value = 1;
});


function getExerciseEmoji(type) {
  switch (type) {
    case 'matching': return '🔗'; // Nối nghĩa
    case 'fill_in_the_blanks': return '🖊️'; // Điền từ
    case 'multiple_choice': return '✅'; // Chọn từ
    case 'notes': return '📝'; // Lưu ý
    default: return '❓';
  }
}

function getExerciseTypeName(type) {
  switch (type) {
    case 'matching': return 'Nối nghĩa';
    case 'fill_in_the_blanks': return 'Điền từ';
    case 'multiple_choice': return 'Chọn từ';
    case 'notes': return 'Lưu ý';
    default: return 'Không xác định';
  }
}

function getLevelColor(level) {
  switch (level) {
    case 'N5': return 'green-lighten-1';
    case 'N4': return 'light-blue-lighten-1';
    case 'N3': return 'teal-lighten-1';
    case 'N2': return 'orange-lighten-1';
    case 'N1': return 'red-lighten-1';
    case 'All': return 'blue-grey-lighten-1'; // Color for 'All' level
    default: return 'grey';
  }
}

function getTypeColor(type) {
  switch (type) {
    case 'matching': return 'blue-grey-lighten-3';
    case 'fill_in_the_blanks': return 'light-green-lighten-3';
    case 'multiple_choice': return 'purple-lighten-3';
    case 'notes': return 'brown-lighten-3';
    default: return 'grey-lighten-1';
  }
}

// Function to highlight blanks in fill-in-the-blanks exercise preview
function highlightBlanks(sentence) {
  return sentence.replace(/___/g, '<span class="blank-highlight">___</span>');
}

// Function to truncate long content for notes preview
function truncateContent(content, maxLength = 100) {
  if (!content) return '';
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength) + '...';
}

// Dialog functions
function openDialog() {
  editedExercise.value = null;
  dialog.value = true;
}

function editExercise(exercise) {
  editedExercise.value = JSON.parse(JSON.stringify(exercise));
  dialog.value = true;
}

async function saveExercise(exercise) {
  try {
    if (exercise.id) {
      await exerciseService.updateExercise(exercise);
    } else {
      await exerciseService.addExercise(exercise);
    }
    allExercises.value = await exerciseService.getAllExercises();
    dialog.value = false;
  } catch (error) {
    console.error('Lỗi khi lưu bài tập:', error);
    alert('Có lỗi xảy ra khi lưu bài tập: ' + error.message);
  }
}

// New functions for custom delete confirmation
function confirmDelete(id, title) {
  exerciseToDeleteId.value = id;
  confirmDialogTitle.value = 'Xác nhận xóa bài tập';
  confirmDialogMessage.value = `Bạn có chắc chắn muốn xóa bài tập "${title}" này không? Hành động này không thể hoàn tác.`;
  confirmDeleteDialog.value = true;
}

async function handleDeleteConfirmed() {
  if (exerciseToDeleteId.value) {
    try {
      await exerciseService.deleteExercise(exerciseToDeleteId.value);
      allExercises.value = await exerciseService.getAllExercises();
      // Optionally show a success message
    } catch (error) {
      console.error('Lỗi khi xóa bài tập:', error);
      alert('Có lỗi xảy ra khi xóa bài tập: ' + error.message);
    } finally {
      confirmDeleteDialog.value = false;
      exerciseToDeleteId.value = null;
    }
  }
}

function viewExercise(exercise) {
  currentViewedExercise.value = exercise;
  viewDialog.value = true;
}
</script>

<style scoped>
:root {
  --app-bg-color: #f5f7fa;
  --card-bg-color: #ffffff;
  --primary-color: #1a73e8;
  --accent-color: #4CAF50;
  --text-dark-emphasis: #333333;
  --text-medium-emphasis: #606060;
  --border-color: #e0e0e0;
  --shadow-light: rgba(0, 0, 0, 0.08);
}

.app-background {
  background-color: var(--app-bg-color);
  min-height: 100vh;
}

.text-dark-emphasis {
  color: var(--text-dark-emphasis) !important;
}

.text-primary {
  color: var(--primary-color) !important;
}

.text-medium-emphasis {
  color: var(--text-medium-emphasis) !important;
}

.add-new-btn {
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
  background-color: var(--accent-color) !important;
  color: white !important;
  padding: 0 25px;
}

.add-new-btn .v-icon {
  font-size: 20px !important;
}

/* Page title emoji styling */
.page-title-icon {
  font-size: 36px; /* Match v-icon size */
  line-height: 1; /* Align vertically */
}

/* Summary Cards Styling */
.summary-card {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-color);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.summary-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12) !important;
}

.summary-card .text-h5 {
  margin-top: 8px;
}

/* Main Content Card Styling */
.main-content-card {
  border-radius: 16px !important;
  overflow: hidden;
  box-shadow: 0 4px 15px var(--shadow-light);
}

/* Toolbar (Search & Filters) Styling */
.main-content-card .v-toolbar {
  background-color: #ffffff !important;
  border-bottom: 1px solid var(--border-color);
  padding: 10px 24px;
  flex-wrap: wrap;
  gap: 10px;
}

.search-input {
  max-width: 350px;
  background-color: #f0f2f5 !important;
  border-radius: 8px !important;
  box-shadow: none !important;
}

.search-input :deep(.v-field__overlay) {
  border-radius: 8px !important;
}

/* Styling cho các v-select (Bộ lọc) */
.filter-select {
  max-width: 220px; /* Điều chỉnh chiều rộng cho các bộ lọc */
  background-color: #f0f2f5 !important;
  border-radius: 8px !important;
  box-shadow: none !important;
}

.filter-select :deep(.v-field__field),
.search-input :deep(.v-field__field) {
  padding-left: 14px !important;
  padding-right: 14px !important;
}

.filter-select :deep(.v-label.v-field-label) {
  top: 50% !important;
  transform: translateY(-50%) !important;
  left: 14px !important;
  font-size: 0.9rem !important;
}

.filter-select :deep(.v-label.v-field-label--floating) {
    transform: translateY(-100%) scale(0.75) !important;
    transform-origin: 0% 0%;
    top: 8px !important;
    left: 14px !important;
    font-size: 0.75rem !important;
}

/* Exercise Item Card Styling */
.exercise-item-card {
  border: 1px solid #e0e0e0;
  transition: box-shadow 0.1s ease-in-out;
}

.exercise-item-card:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08) !important;
}

.exercise-preview ul {
  list-style: disc inside;
  padding-left: 20px;
  margin-top: 5px;
}
.exercise-preview ul li {
  margin-bottom: 2px;
}

.blank-highlight {
  font-weight: bold;
  color: var(--primary-color);
  text-decoration: underline;
}


/* Responsive Adjustments */
@media (max-width: 1200px) {
  .filter-select {
    max-width: 180px;
  }
}

@media (max-width: 960px) { /* md breakpoint */
  .add-new-btn {
    width: 100%;
    margin-top: 15px;
  }
  .summary-card {
    height: auto;
    padding: 15px;
  }
  .main-content-card .v-toolbar {
    flex-direction: column;
    align-items: stretch;
  }
  .search-input, .filter-select {
    max-width: 100%;
  }
  .main-content-card .v-toolbar .v-btn {
    width: 100%;
    margin-left: 0 !important;
    margin-top: 10px;
  }
}

@media (max-width: 600px) { /* sm breakpoint */
  .app-background {
    padding: 16px !important;
  }
  h1.text-h4 {
    font-size: 28px !important;
  }
  .text-subtitle-1 {
    font-size: 14px !important;
  }
  .add-new-btn {
    font-size: 14px;
    height: 48px !important;
  }
  .summary-card .text-h5 {
    font-size: 20px !important;
  }
}
.main-content-dashboard{
    background-color: #F0F2F5; /* Màu nền xám nhạt */
  min-height: calc(100vh - 64px); /* Trừ chiều cao header */
  font-family: 'Roboto', sans-serif;
}
</style>
