<template>
  <v-container fluid class="pa-8 listening-management-background">
    <!-- Header Section -->
    <v-row align="center" class="mb-6">
      <v-col cols="12" md="8">
        <h1 class="text-h4 font-weight-bold page-title">
          <span class="page-title-icon mr-3">🎧</span> Quản Lý Bài Luyện Nghe
        </h1>
        <p class="text-subtitle-1 text-grey-darken-1 pl-10">
          Quản lý toàn bộ các bài luyện nghe, thêm, sửa, xóa và phân loại.
        </p>
      </v-col>
      <v-col cols="12" md="4" class="d-flex justify-end">
        <v-btn color="blue-darken-2" class="rounded-lg pa-4 add-button" size="large" @click="openAddDialog">
          <span class="btn-icon mr-2">➕</span> Thêm bài nghe mới
        </v-btn>
      </v-col>
    </v-row>

    <!-- Summary Cards Section -->
    <v-row class="mb-8">
      <v-col cols="12" sm="6" md="3">
        <v-card class="summary-card" elevation="3" rounded="xl" color="blue-lighten-5">
          <v-card-text class="d-flex align-center justify-space-between">
            <div>
              <div class="text-subtitle-2 text-medium-emphasis">🎵 Tổng bài nghe</div>
              <div class="text-h5 font-weight-bold text-dark-emphasis">{{ totalAudios }}</div>
            </div>
            <v-icon size="48" color="blue-grey-lighten-2">mdi-music-note-eighth</v-icon>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="summary-card" elevation="3" rounded="xl" color="green-lighten-5">
          <v-card-text class="d-flex align-center justify-space-between">
            <div>
              <div class="text-subtitle-2 text-medium-emphasis">⏱️ Tổng thời lượng</div>
              <div class="text-h5 font-weight-bold text-dark-emphasis">{{ totalDuration }}</div>
            </div>
            <v-icon size="48" color="green-lighten-2">mdi-timer-sand</v-icon>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="summary-card" elevation="3" rounded="xl" color="purple-lighten-5">
          <v-card-text class="d-flex align-center justify-space-between">
            <div>
              <div class="text-subtitle-2 text-medium-emphasis">📚 Tổng cấp độ</div>
              <div class="text-h5 font-weight-bold text-dark-emphasis">{{ totalLevels }}</div>
            </div>
            <v-icon size="48" color="purple-lighten-2">mdi-bookmark-multiple</v-icon>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="summary-card" elevation="3" rounded="xl" color="orange-lighten-5">
          <v-card-text class="d-flex align-center justify-space-between">
            <div>
              <div class="text-subtitle-2 text-medium-emphasis">🏷️ Tổng chủ đề</div>
              <div class="text-h5 font-weight-bold text-dark-emphasis">{{ totalTopics }}</div>
            </div>
            <v-icon size="48" color="orange-lighten-2">mdi-tag-multiple</v-icon>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filters and Search Section -->
    <v-card class="main-content-card pa-4 mb-6 rounded-xl elevation-3">
      <v-row align="center">
        <v-col cols="12" md="4">
          <v-text-field
            v-model="searchQuery"
            label="Tìm kiếm bài nghe..."
            variant="solo-filled"
            density="comfortable"
            hide-details
            clearable
            rounded="lg"
            bg-color="grey-lighten-4"
          >
            <template v-slot:prepend-inner>
              <span class="search-icon mr-2">🔍</span>
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-select
            v-model="selectedLevel"
            :items="levelFilters"
            label="Tất cả cấp độ"
            variant="solo-filled"
            density="comfortable"
            hide-details
            clearable
            rounded="lg"
            bg-color="grey-lighten-4"
          ></v-select>
        </v-col>
        <v-col cols="12" md="3">
          <v-select
            v-model="selectedTopic"
            :items="topicFilters"
            label="Tất cả chủ đề"
            variant="solo-filled"
            density="comfortable"
            hide-details
            clearable
            rounded="lg"
            bg-color="grey-lighten-4"
          ></v-select>
        </v-col>
        <v-col cols="12" md="2" class="d-flex justify-end">
          <v-btn color="grey-lighten-2" icon size="large" @click="resetFilters" class="ml-2 rounded-full elevation-2">
            <span class="filter-icon">🔄</span>
            <v-tooltip activator="parent" location="top">Đặt lại bộ lọc</v-tooltip>
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <!-- Audio List Grid -->
    <v-card class="main-content-card mt-6 pa-4 rounded-xl elevation-3">
      <v-card-title class="card-title d-flex align-center mb-4">
        <span class="card-title-icon mr-2">📋</span>
        Danh Sách Bài Luyện Nghe
      </v-card-title>
      <v-card-text>
        <div v-if="paginatedAudioList.length > 0">
          <v-row>
            <v-col
              v-for="item in paginatedAudioList"
              :key="item.id"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <AudioListItem
                :audio="item"
                @edit="handleEdit"
                @delete="confirmDelete"
              />
            </v-col>
          </v-row>
          <div class="text-center mt-4">
            <v-pagination
              v-model="currentPage"
              :length="pageCount"
              :total-visible="5"
              rounded="circle"
              color="blue-darken-2"
            ></v-pagination>
          </div>
        </div>
        <v-alert v-else type="info" variant="tonal" class="my-4">
          ℹ️ Không có bài nghe nào phù hợp với tìm kiếm hoặc bộ lọc của bạn.
        </v-alert>
      </v-card-text>
    </v-card>

    <!-- Add/Edit Audio Dialog -->
    <AddEditAudioDialog
      v-model:show="dialog"
      :editedAudio="editedAudio"
      :availableLevels="levelFilters.slice(1)"
      :availableTopics="topicFilters.slice(1)"
      @save="saveAudio"
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
import { ref, computed, onMounted, watch } from 'vue';
import AudioListItem from '../../components/audio/AudioListItem.vue'; // Adjust path
import AddEditAudioDialog from '../../components/audio/AddEditAudioDialog.vue'; // Will create this new dialog component
import ConfirmDialog from '../../components/exercise/ConfirmDialog.vue'; // Adjust path

// --- Reactive State ---
const audioList = ref([]);
const searchQuery = ref('');
const selectedLevel = ref('Tất cả cấp độ');
const selectedTopic = ref('Tất cả chủ đề');
const dialog = ref(false); // For Add/Edit dialog
const editedAudio = ref(null); // Audio item being edited
const confirmDeleteDialog = ref(false); // For delete confirmation dialog
const itemToDeleteId = ref(null);
const confirmDialogTitle = ref('');
const confirmDialogMessage = ref('');

// --- Pagination State ---
const currentPage = ref(1);
const itemsPerPage = 8; // Number of items per page in the grid

// --- Data Filters & Options (Example Data) ---
const levelFilters = ['Tất cả cấp độ', 'N5', 'N4', 'N3', 'N2', 'N1'];
const rawAudioData = ref([
  { id: 1, title: 'Tin tức thời tiết hàng ngày', author: 'NHK News', duration: '0:45', level: 'N4', topic: 'Tin tức', src: 'https://www2.nhk.or.jp/gogaku/english/radio/2019/kiso1_20190408_h_1.mp3', transcript: '今日の天気は晴れのち曇り、所により雨が降るでしょう。最高気温は25度、最低気温は15度です。' },
  { id: 2, title: 'Hội thoại tiếng Nhật: Đặt món ăn', author: 'Japanese Pod 101', duration: '1:20', level: 'N5', topic: 'Giao tiếp', src: 'https://assets.languagepod101.com/lessons/beginner_s2l4_010109_jp_m.mp3', transcript: 'いらっしゃいませ。ご注文はお決まりですか？はい、カレーライスをお願いします。飲み物はいかがですか？コーラをお願いします。' },
  { id: 3, title: 'Luyện nghe tiếng Nhật trung cấp: Mẹo du lịch', author: 'JLPT Prep', duration: '2:10', level: 'N3', topic: 'Du lịch', src: 'https://www.japanesefromzero.com/mp3/jfz_jlpt_n3_1.mp3', transcript: '日本の旅行では、交通手段として電車が非常に便利です。特に、JRパスを使うと、新幹線も乗り放題になり、お得です。荷物は少なめにすることをお勧めします。' },
  { id: 4, title: 'Tin tức tiếng Nhật nâng cao: Kinh tế', author: 'Asahi Shimbun', duration: '3:00', level: 'N1', topic: 'Kinh tế', src: 'https://example.com/audio/n1_economy.mp3', transcript: '最近の経済指標によると、日本の景気は緩やかに回復している兆しが見られます。しかし、世界経済の不確実性が依然として存在するため、予断を許さない状況が続いています。' },
  { id: 5, title: 'Hội thoại cơ bản: Chào hỏi', author: 'Minna No Nihongo', duration: '0:50', level: 'N5', topic: 'Giao tiếp', src: 'https://example.com/audio/greeting.mp3', transcript: 'おはようございます。こんにちは。こんばんは。お元気ですか。' },
  { id: 6, title: 'Văn hóa Nhật Bản: Lễ hội mùa hè', author: 'Japan Culture', duration: '2:40', level: 'N3', topic: 'Văn hóa', src: 'https://example.com/audio/summer_festival.mp3', transcript: '日本の夏祭りには、盆踊りや花火大会など、様々な伝統行事があります。浴衣を着て参加する人も多く、とても賑やかです。' },
  { id: 7, title: 'Giải thích Ngữ pháp N2: 〜ば〜ほど', author: 'Grammar Sensei', duration: '1:55', level: 'N2', topic: 'Ngữ pháp', src: 'https://example.com/audio/grammar_n2.mp3', transcript: 'この文型は、「〜すればするほど〜になる」という意味で、比例関係を表します。練習すればするほど上手になります。' },
  { id: 8, title: 'Phỏng vấn xin việc tiếng Nhật', author: 'Career Support', duration: '4:10', level: 'N1', topic: 'Công việc', src: 'https://example.com/audio/job_interview.mp3', transcript: '面接では、自己紹介をしっかり準備し、質問に対して簡潔に答えることが重要です。入社への熱意を伝えることも忘れないでください。' },
  { id: 9, title: 'Kể chuyện cổ tích Nhật Bản', author: 'Fairy Tales JP', duration: '3:30', level: 'N4', topic: 'Giải trí', src: 'https://example.com/audio/folktale.mp3', transcript: '昔々、あるところに、おじいさんとおばあさんがいました。おじいさんは山へ芝刈りに、おばあさんは川へ洗濯に行きました。' },
  { id: 10, title: 'Hướng dẫn nấu ăn: Sushi', author: 'Cooking Master', duration: '5:00', level: 'N3', topic: 'Ẩm thực', src: 'https://example.com/audio/cooking_sushi.mp3', transcript: 'まずは、新鮮な魚を選びましょう。次に、酢飯を作ります。ご飯と酢を混ぜ、手早く冷ましてください。' },
]);


const topicFilters = computed(() => {
  const topics = new Set(audioList.value.map(item => item.topic));
  return ['Tất cả chủ đề', ...Array.from(topics).sort()];
});

// --- Computed Properties for Statistics ---
const totalAudios = computed(() => audioList.value.length);
const totalDuration = computed(() => {
  let totalMinutes = 0;
  audioList.value.forEach(item => {
    const [min, sec] = item.duration.split(':').map(Number);
    totalMinutes += min + sec / 60;
  });
  const hours = Math.floor(totalMinutes / 60);
  const remainingMinutes = Math.round(totalMinutes % 60);
  return `${hours > 0 ? hours + 'h ' : ''}${remainingMinutes}m`;
});
const totalLevels = computed(() => levelFilters.length - 1); // Exclude "Tất cả cấp độ"
const totalTopics = computed(() => topicFilters.value.length - 1); // Exclude "Tất cả chủ đề"

// --- Filtered & Paginated Data ---
const filteredAudioList = computed(() => {
  let filtered = audioList.value;

  // Apply search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.author.toLowerCase().includes(query) ||
      (item.transcript && item.transcript.toLowerCase().includes(query)) // Ensure transcript exists
    );
  }

  // Apply level filter
  if (selectedLevel.value !== 'Tất cả cấp độ') {
    filtered = filtered.filter(item => item.level === selectedLevel.value);
  }

  // Apply topic filter
  if (selectedTopic.value !== 'Tất cả chủ đề') {
    filtered = filtered.filter(item => item.topic === selectedTopic.value);
  }

  return filtered;
});

const pageCount = computed(() => {
  return Math.ceil(filteredAudioList.value.length / itemsPerPage);
});

const paginatedAudioList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredAudioList.value.slice(start, end);
});

// --- Watchers ---
watch([searchQuery, selectedLevel, selectedTopic], () => {
  currentPage.value = 1; // Reset to first page on filter change
});

// --- Methods ---
const getLevelColor = (level) => {
  switch (level) {
    case 'N5': return 'green-lighten-1';
    case 'N4': return 'light-blue-lighten-1';
    case 'N3': return 'teal-lighten-1';
    case 'N2': return 'orange-lighten-1';
    case 'N1': return 'red-lighten-1';
    default: return 'grey';
  }
};

const openAddDialog = () => {
  editedAudio.value = null; // Clear edited item for new entry
  dialog.value = true;
};

const handleEdit = (item) => {
  // Deep copy the item to avoid direct modification
  editedAudio.value = JSON.parse(JSON.stringify(item));
  dialog.value = true;
};

// Function to show the custom delete confirmation dialog
const confirmDelete = (id, title) => {
  itemToDeleteId.value = id;
  confirmDialogTitle.value = 'Xác nhận xóa bài nghe';
  confirmDialogMessage.value = `Bạn có chắc chắn muốn xóa bài nghe "${title}" này không? Hành động này không thể hoàn tác.`;
  confirmDeleteDialog.value = true;
};

// Function to handle the actual deletion after user confirmation
const handleDeleteConfirmed = () => {
  if (itemToDeleteId.value) {
    audioList.value = audioList.value.filter(a => a.id !== itemToDeleteId.value);
    console.log(`Đã xóa bài nghe với ID: ${itemToDeleteId.value}`);
  }
  confirmDeleteDialog.value = false; // Close the confirmation dialog
  itemToDeleteId.value = null; // Clear the item to delete
  currentPage.value = 1; // Reset to first page in case current page becomes empty
};

const saveAudio = (item) => {
  if (item.id) {
    // Update existing item
    const index = audioList.value.findIndex(a => a.id === item.id);
    if (index !== -1) {
      Object.assign(audioList.value[index], item);
    }
  } else {
    // Add new item
    const newId = audioList.value.length ? Math.max(...audioList.value.map(a => a.id)) + 1 : 1;
    audioList.value.push({ ...item, id: newId });
  }
  dialog.value = false; // Close dialog
  currentPage.value = 1; // Reset to first page
};

const resetFilters = () => {
  searchQuery.value = '';
  selectedLevel.value = 'Tất cả cấp độ';
  selectedTopic.value = 'Tất cả chủ đề';
};

// --- Lifecycle Hook ---
onMounted(() => {
  // Simulate loading data from a service
  audioList.value = rawAudioData.value; // For now, use local raw data
  // In a real app: audioList.value = await getListeningExercises();
});
</script>

<style scoped>
/* Base Styles for the Dashboard */
.listening-management-background {
  background-color: #F0F2F5; /* Màu nền xám nhạt */
  min-height: 100vh;
  font-family: 'Roboto', sans-serif;
}

/* Page Title Section */
.page-title {
  color: #333333;
  font-size: 2.2rem !important;
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}
.page-title-icon {
  font-size: 2.8rem;
  line-height: 1;
  vertical-align: middle;
  transform: translateY(-2px);
}

/* Add Button */
.add-button {
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: none;
  transition: all 0.2s ease-in-out;
}
.add-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.btn-icon {
  font-size: 1.2rem;
  line-height: 1;
}

/* Summary Cards */
.summary-card {
  min-height: 140px;
  padding: 24px !important;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}
.summary-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15) !important;
}
.summary-card .text-h5 {
  margin-top: 8px;
}
.text-dark-emphasis {
  color: #333333 !important;
}
.text-medium-emphasis {
  color: #606060 !important;
}

/* Common Card Styles for Filters and List */
.main-content-card {
  background-color: #FFFFFF !important;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  border: none;
}
.card-title {
  color: #333333;
  font-weight: 700;
  font-size: 1.5rem !important;
  padding: 16px 24px;
  border-bottom: 1px solid #EEEEEE;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
}
.card-title-icon {
  font-size: 1.8rem;
  line-height: 1;
  vertical-align: middle;
}

/* Text Fields and Selects (Filters) */
.v-text-field, .v-select {
  border-radius: 12px !important;
}
.search-icon {
    font-size: 1.2rem;
    line-height: 1;
    margin-top: 2px;
}
.filter-icon {
    font-size: 1.2rem;
    line-height: 1;
}

/* Pagination */
.v-pagination {
  margin: 20px auto;
}
.v-pagination :deep(.v-pagination__item) {
    font-weight: 600;
}
.v-pagination :deep(.v-pagination__item--active) {
    background-color: #2196F3 !important; /* Màu xanh primary */
    color: white !important;
    box-shadow: 0 4px 15px rgba(33, 150, 243, 0.4);
}
.v-pagination :deep(.v-pagination__item:not(.v-pagination__item--active)) {
    background-color: #E3F2FD !important; /* Nền xanh nhạt cho các trang khác */
    color: #1976D2 !important; /* Chữ màu xanh đậm */
}
.v-pagination :deep(.v-pagination__item--is-empty) {
    background-color: transparent !important;
}

/* Responsive Adjustments */
@media (max-width: 960px) { /* md breakpoint */
  .d-flex.justify-end {
    justify-content: flex-start !important;
  }
  .add-button {
    width: 100%;
    margin-top: 15px;
  }
  .summary-card {
    height: auto;
    padding: 15px !important;
  }
  .main-content-card .v-col {
    padding-bottom: 0 !important;
    padding-top: 0 !important;
  }
}

@media (max-width: 600px) { /* sm breakpoint */
  .pa-8 {
    padding: 16px !important;
  }
  .page-title {
    font-size: 28px !important;
  }
  .page-title-icon {
    font-size: 2.2rem;
  }
  .text-subtitle-1 {
    font-size: 14px !important;
    padding-left: 0 !important; /* Remove padding for mobile */
  }
  .add-button {
    font-size: 14px;
    height: 48px !important;
  }
  .summary-card .text-h5 {
    font-size: 20px !important;
  }
}
</style>
