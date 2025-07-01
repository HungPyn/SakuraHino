<template>
  <v-container fluid class="vocabulary-management-dashboard pa-8">
    <v-row align="center" class="mb-6">
      <v-col cols="12" md="8">
        <h1 class="text-h4 font-weight-bold page-title">
          <span class="page-title-icon mr-3">🌟</span>
          Quản Lý Từ Vựng
        </h1>
        <p class="text-subtitle-1 text-grey-darken-1 pl-10">
        </p>
      </v-col>
      <v-col cols="12" md="4" class="d-flex justify-end">
        <v-btn color="primary" class="mr-2 rounded-lg pa-4" size="large" @click="handleImport">
          <span class="btn-icon mr-2">📥</span> Import
        </v-btn>
        <v-btn color="success" class="mr-2 rounded-lg pa-4" size="large" @click="handleExport">
          <span class="btn-icon mr-2">📤</span> Export
        </v-btn>
        <v-btn color="blue-darken-2" class="rounded-lg pa-4" size="large" @click="addNewVocabulary">
          <span class="btn-icon mr-2">➕</span> Thêm Từ Vựng
        </v-btn>
      </v-col>
    </v-row>

    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="4">
        <v-card class="dashboard-card statistic-card total-vocabulary pa-4 d-flex align-center justify-center rounded-xl elevation-3">
          <span class="statistic-icon mr-4" :style="{ color: $vuetify.theme.themes.light.colors['blue-darken-2'] }">📚</span>
          <div class="text-center">
            <div class="text-h5 font-weight-bold">{{ totalVocabulary }}</div>
            <div class="text-subtitle-1 text-grey-darken-1">Tổng từ vựng</div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-card class="dashboard-card statistic-card total-categories pa-4 d-flex align-center justify-center rounded-xl elevation-3">
          <span class="statistic-icon mr-4" :style="{ color: $vuetify.theme.themes.light.colors['purple-darken-2'] }">🗂️</span>
          <div class="text-center">
            <div class="text-h5 font-weight-bold">{{ totalCategories }}</div>
            <div class="text-subtitle-1 text-grey-darken-1">Tổng danh mục</div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-card class="dashboard-card statistic-card total-levels pa-4 d-flex align-center justify-center rounded-xl elevation-3">
          <span class="statistic-icon mr-4" :style="{ color: $vuetify.theme.themes.light.colors['orange-darken-2'] }">📊</span>
          <div class="text-center">
            <div class="text-h5 font-weight-bold">{{ totalLevels }}</div>
            <div class="text-subtitle-1 text-grey-darken-1">Tổng cấp độ</div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="dashboard-card pa-4 mb-6 rounded-xl elevation-3">
      <v-row align="center">
        <v-col cols="12" md="4">
          <v-text-field
            v-model="searchQuery"
            label="Tìm kiếm từ vựng..."
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
            v-model="filterLevel"
            :items="levelOptions"
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
            v-model="filterCategory"
            :items="categoryOptions"
            label="Tất cả danh mục"
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
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <v-card class="dashboard-card mt-6 pa-4 rounded-xl elevation-3">
      <v-card-title class="card-title d-flex align-center mb-4">
        <span class="card-title-icon mr-2">📋</span>
        Danh Sách Từ Vựng
      </v-card-title>
      <v-card-text>
        <v-data-table-server
          :headers="headers"
          :items="filteredWords"
          :items-length="totalWordsCount"
          :loading="loading"
          v-model:page="currentPage"
          v-model:items-per-page="itemsPerPage"
          class="elevation-0 vocabulary-table"
          item-value="id"
          @update:options="loadItems"
        >
          <template v-slot:item.stt="{ index }">
            {{ (currentPage - 1) * itemsPerPage + index + 1 }}
          </template>

          <template v-slot:item.kanji="{ item }">
            <div class="font-weight-medium text-blue-darken-3">{{ item.kanji }}</div>
            <div class="text-caption text-grey-darken-1">{{ item.kana }}</div>
          </template>

          <template v-slot:item.level="{ item }">
            <v-chip :color="getLevelColor(item.level)" size="small" label class="rounded-pill px-3 py-1 text-caption font-weight-medium">
              {{ item.level }}
            </v-chip>
          </template>

          <template v-slot:item.difficulty="{ item }">
            <v-chip :color="getDifficultyColor(item.difficulty)" size="small" label class="rounded-pill px-3 py-1 text-caption font-weight-medium">
              {{ item.difficulty }}
            </v-chip>
          </template>

          <template v-slot:item.updated="{ item }">
            <div class="text-caption text-grey-darken-1">{{ formatDate(item.updated) }}</div>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-tooltip text="Chỉnh sửa" location="top">
              <template v-slot:activator="{ props }">
                <v-btn icon size="small" variant="flat" color="blue-lighten-5" v-bind="props" @click="editVocabulary(item)" class="rounded-lg mr-1 action-btn">
                  ✏️
                </v-btn>
              </template>
            </v-tooltip>
            <v-tooltip text="Xóa" location="top">
              <template v-slot:activator="{ props }">
                <v-btn icon size="small" variant="flat" v-bind="props" @click="showDeleteConfirmation(item)" class="rounded-lg mr-1 action-btn">
                  🗑️
                </v-btn>
              </template>
            </v-tooltip>
            <v-tooltip text="Thêm vào Flashcard" location="top">
              <template v-slot:activator="{ props }">
                <v-btn icon size="small" variant="flat" color="green-lighten-5" v-bind="props" @click="addToFlashcard(item)" class="rounded-lg action-btn">
                  🃏
                </v-btn>
              </template>
            </v-tooltip>
          </template>

          <template v-slot:no-data>
            <v-alert
              type="info"
              variant="tonal"
              class="my-4"
            >
              ℹ️ Không có từ vựng nào phù hợp với tìm kiếm hoặc bộ lọc của bạn.
            </v-alert>
          </template>

          <template v-slot:bottom>
            <div class="d-flex justify-center align-center pt-4">
              <v-pagination
                v-model="currentPage"
                :length="pageCount"
                :total-visible="5"
                rounded="circle"
                color="blue-darken-2"
              ></v-pagination>
            </div>
          </template>
        </v-data-table-server>
      </v-card-text>
    </v-card>

    <v-dialog v-model="dialog" max-width="700px" transition="dialog-bottom-transition">
      <v-card class="rounded-xl elevation-8 dialog-card">
        <v-toolbar color="blue-darken-2" dark flat class="rounded-t-xl">
          <v-toolbar-title class="text-h6 font-weight-bold pl-3">
            {{ editingVocabulary ? '✏️ Chỉnh sửa Từ Vựng' : '✨ Thêm Từ Vựng Mới' }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="closeDialog">
            <span class="text-h6">❌</span>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pa-6">
          <v-form ref="formRef" @submit.prevent="saveVocabulary">
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  label="Từ Vựng Tiếng Nhật (Kanji)"
                  v-model="form.kanji"
                  required
                  variant="outlined"
                  class="rounded-lg"
                  density="comfortable"
                  prepend-inner-icon="📝"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  label="Kana / Romaji"
                  v-model="form.kana"
                  variant="outlined"
                  class="rounded-lg"
                  density="comfortable"
                  prepend-inner-icon="�️"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  label="Nghĩa Tiếng Việt"
                  v-model="form.meaning"
                  required
                  variant="outlined"
                  rows="3"
                  class="rounded-lg"
                  density="comfortable"
                  prepend-inner-icon="🇻🇳"
                ></v-textarea>
              </v-col>
              <v-col cols="12" sm="4">
                <v-select
                  label="Cấp Độ"
                  v-model="form.level"
                  :items="levelOptions"
                  required
                  variant="outlined"
                  class="rounded-lg"
                  density="comfortable"
                  prepend-inner-icon="💯"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="4">
                <v-select
                  label="Danh Mục"
                  v-model="form.category"
                  :items="categoryOptions"
                  required
                  variant="outlined"
                  class="rounded-lg"
                  density="comfortable"
                  prepend-inner-icon="🗂️"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="4">
                <v-select
                  label="Độ Khó"
                  v-model="form.difficulty"
                  :items="difficultyOptions"
                  required
                  variant="outlined"
                  class="rounded-lg"
                  density="comfortable"
                  prepend-inner-icon="⚡"
                ></v-select>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-4 bg-grey-lighten-4 rounded-b-xl d-flex justify-end">
          <v-btn color="grey-darken-1" variant="flat" class="rounded-lg px-6 py-3" @click="closeDialog">
            Hủy
          </v-btn>
          <v-btn color="blue-darken-2" variant="elevated" class="rounded-lg px-6 py-3" @click="saveVocabulary">
            Lưu Từ Vựng
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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

<script>
import { ref, computed, onMounted, watch } from 'vue';
// Import the custom ConfirmDialog component
import ConfirmDialog from '../exercise/ConfirmDialog.vue'// Adjust path if necessary based on your project structure

export default {
  name: 'VocabularyManagementView',
  components: {
    ConfirmDialog, // Register the component
  },
  setup() {
    const searchQuery = ref('');
    const filterLevel = ref('');
    const filterCategory = ref('');

    const dialog = ref(false); // For Add/Edit form
    const editingVocabulary = ref(null);
    const form = ref({
      id: null,
      kanji: '',
      kana: '',
      meaning: '',
      level: null,
      category: null,
      difficulty: null,
      updated: ''
    });

    // State for custom delete confirmation dialog
    const confirmDeleteDialog = ref(false);
    const itemToDelete = ref(null); // Stores the item object to be deleted
    const confirmDialogTitle = ref('');
    const confirmDialogMessage = ref('');

    // Dữ liệu giả lập - Đã thêm N1, N2, N3, N4, N5
    const allWords = ref([
      { id: 1, kanji: '学校', kana: 'がっこう', meaning: 'trường học', level: 'N5', category: 'Giáo dục', difficulty: 'Dễ', updated: '2024-01-20' },
      { id: 2, kanji: '友達', kana: 'ともだち', meaning: 'bạn bè', level: 'N5', category: 'Quan hệ xã hội', difficulty: 'Dễ', updated: '2024-01-18' },
      { id: 3, kanji: '料理', kana: 'りょうり', meaning: 'nấu ăn, món ăn', level: 'N4', category: 'Ẩm thực', difficulty: 'Trung bình', updated: '2024-01-22' },
      { id: 4, kanji: '食べる', kana: 'たべる', meaning: 'ăn', level: 'N5', category: 'Động từ', difficulty: 'Dễ', updated: '2024-01-19' },
      { id: 5, kanji: '飲む', kana: 'のむ', meaning: 'uống', level: 'N5', category: 'Động từ', difficulty: 'Dễ', updated: '2024-01-21' },
      { id: 6, kanji: '読む', kana: 'よむ', meaning: 'đọc', level: 'N4', category: 'Động từ', difficulty: 'Trung bình', updated: '2024-01-25' },
      { id: 7, kanji: '日本語', kana: 'にほんご', meaning: 'tiếng Nhật', level: 'N5', category: 'Ngôn ngữ', difficulty: 'Dễ', updated: '2024-01-15' },
      { id: 8, kanji: '家族', kana: 'かぞく', meaning: 'gia đình', level: 'N5', category: 'Quan hệ xã hội', difficulty: 'Dễ', updated: '2024-01-17' },
      { id: 9, kanji: '大きい', kana: 'おおきい', meaning: 'lớn', level: 'N4', category: 'Tính từ', difficulty: 'Trung bình', updated: '2024-01-23' },
      { id: 10, kanji: '小さい', kana: 'ちいさい', meaning: 'nhỏ', level: 'N4', category: 'Tính từ', difficulty: 'Trung bình', updated: '2024-01-24' },
      { id: 11, kanji: '書く', kana: 'かく', meaning: 'viết', level: 'N4', category: 'Động từ', difficulty: 'Trung bình', updated: '2024-01-26' },
      { id: 12, kanji: '勉強', kana: 'べんきょう', meaning: 'học', level: 'N3', category: 'Hành động', difficulty: 'Khó', updated: '2024-01-27' },
      { id: 13, kanji: '仕事', kana: 'しごと', meaning: 'công việc', level: 'N3', category: 'Công việc', difficulty: 'Trung bình', updated: '2024-01-28' },
      { id: 14, kanji: '難しい', kana: 'むずかしい', meaning: 'khó', level: 'N2', category: 'Tính từ', difficulty: 'Khó', updated: '2024-01-29' },
      { id: 15, kanji: '簡単', kana: 'かんたん', meaning: 'dễ', level: 'N2', category: 'Tính từ', difficulty: 'Trung bình', updated: '2024-01-30' },
      { id: 16, kanji: '未来', kana: 'みらい', meaning: 'tương lai', level: 'N1', category: 'Thời gian', difficulty: 'Rất khó', updated: '2024-02-01' },
      { id: 17, kanji: '希望', kana: 'きぼう', meaning: 'hy vọng', level: 'N1', category: 'Cảm xúc', difficulty: 'Rất khó', updated: '2024-02-02' },
      { id: 18, kanji: '旅行', kana: 'りょこう', meaning: 'du lịch', level: 'N4', category: 'Du lịch', difficulty: 'Dễ', updated: '2024-02-03' },
      { id: 19, kanji: '病院', kana: 'びょういん', meaning: 'bệnh viện', level: 'N3', category: 'Địa điểm', difficulty: 'Trung bình', updated: '2024-02-04' },
      { id: 20, kanji: '駅', kana: 'えき', meaning: 'nhà ga', level: 'N5', category: 'Địa điểm', difficulty: 'Dễ', updated: '2024-02-05' },
    ]);

    // Các cấp độ từ N1 đến N5
    const levelOptions = ['N1', 'N2', 'N3', 'N4', 'N5'];
    const categoryOptions = computed(() => [...new Set(allWords.value.map(w => w.category))].sort());
    const difficultyOptions = ['Dễ', 'Trung bình', 'Khó', 'Rất khó']; // Thêm "Rất khó"

    // Pagination và server-side data simulation
    const currentPage = ref(1);
    const itemsPerPage = ref(10);
    const loading = ref(false);
    const totalWordsCount = ref(0);
    const filteredWords = ref([]); // Dữ liệu hiển thị trên bảng sau khi lọc và phân trang

    // Headers cho bảng Vuetify, bao gồm cột STT
    const headers = [
      { title: 'STT', align: 'center', key: 'stt', sortable: false }, // Cột số thứ tự
      { title: 'Từ vựng', align: 'start', key: 'kanji', sortable: true },
      { title: 'Nghĩa', align: 'start', key: 'meaning', sortable: false },
      { title: 'Cấp độ', align: 'center', key: 'level', sortable: true },
      { title: 'Danh mục', align: 'start', key: 'category', sortable: true },
      { title: 'Độ khó', align: 'center', key: 'difficulty', sortable: true },
      { title: 'Cập nhật', align: 'end', key: 'updated', sortable: true },
      { title: 'Thao tác', align: 'center', key: 'actions', sortable: false },
    ];

    // Computed properties for stat cards
    const totalVocabulary = computed(() => allWords.value.length);
    const totalCategories = computed(() => categoryOptions.value.length);
    const totalLevels = computed(() => levelOptions.length); // Lấy từ levelOptions

    // Function to simulate server-side data loading
    const loadItems = (options) => {
      loading.value = true;
      currentPage.value = options.page;
      itemsPerPage.value = options.itemsPerPage;

      let items = allWords.value;

      // Apply search and filters
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        items = items.filter(item =>
          item.kanji.toLowerCase().includes(query) ||
          item.kana.toLowerCase().includes(query) ||
          item.meaning.toLowerCase().includes(query)
        );
      }

      if (filterLevel.value) {
        items = items.filter(item => item.level === filterLevel.value);
      }

      if (filterCategory.value) {
        items = items.filter(item => item.category === filterCategory.value);
      }

      // Apply sorting (basic example)
      if (options.sortBy && options.sortBy.length > 0) {
        const sortBy = options.sortBy[0];
        items.sort((a, b) => {
          const aValue = a[sortBy.key];
          const bValue = b[sortBy.key];

          if (aValue < bValue) return sortBy.order === 'asc' ? -1 : 1;
          if (aValue > bValue) return sortBy.order === 'asc' ? 1 : -1;
          return 0;
        });
      }

      totalWordsCount.value = items.length;

      // Apply pagination
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      filteredWords.value = items.slice(start, end);

      loading.value = false;
    };

    // Watchers for filters and search query to trigger data reload
    watch([searchQuery, filterLevel, filterCategory], () => {
      currentPage.value = 1; // Reset to first page on filter change
      loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: [] }); // Pass sortBy as empty array
    });

    // Computed property for total pages
    const pageCount = computed(() => {
      return Math.ceil(totalWordsCount.value / itemsPerPage.value);
    });

    // Methods
    const getLevelColor = (level) => {
      switch (level) {
        case 'N5': return 'blue-lighten-2';
        case 'N4': return 'green-lighten-2';
        case 'N3': return 'orange-lighten-2';
        case 'N2': return 'red-lighten-2';
        case 'N1': return 'purple-lighten-2';
        default: return 'grey';
      }
    };

    const getDifficultyColor = (difficulty) => {
      switch (difficulty) {
        case 'Dễ': return 'green-lighten-1';
        case 'Trung bình': return 'orange-lighten-1';
        case 'Khó': return 'red-lighten-1';
        case 'Rất khó': return 'deep-purple-lighten-1'; // Màu mới cho "Rất khó"
        default: return 'grey';
      }
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN');
    };

    // New function to reset all filters
    const resetFilters = () => {
      searchQuery.value = '';
      filterLevel.value = null; // Set to null to clear v-select
      filterCategory.value = null; // Set to null to clear v-select
      // Watchers will automatically call loadItems
      console.log('Filters have been reset.');
    };


    const handleImport = () => {
      alert('Chức năng Import đang được phát triển!');
    };

    const handleExport = () => {
      alert('Chức năng Export đang được phát triển!');
    };

    const addNewVocabulary = () => {
      editingVocabulary.value = null;
      form.value = {
        id: null, kanji: '', kana: '', meaning: '', level: null, category: null, difficulty: null, updated: ''
      };
      dialog.value = true;
    };

    const editVocabulary = (item) => {
      editingVocabulary.value = { ...item };
      form.value = { ...item };
      dialog.value = true;
    };

    // Function to show the custom delete confirmation dialog
    const showDeleteConfirmation = (item) => {
      itemToDelete.value = item;
      confirmDialogTitle.value = 'Xác nhận xóa từ vựng';
      confirmDialogMessage.value = `Bạn có chắc chắn muốn xóa từ "${item.kanji}" này không? Hành động này không thể hoàn tác.`;
      confirmDeleteDialog.value = true;
    };

    // Function to handle the actual deletion after user confirmation
    const handleDeleteConfirmed = () => {
      if (itemToDelete.value) {
        allWords.value = allWords.value.filter(v => v.id !== itemToDelete.value.id);
        console.log(`Đã xóa từ với ID: ${itemToDelete.value.id}`);
        loadItems({ page: currentPage.value, itemsPerPage: itemsPerPage.value, sortBy: [] }); // Reload data after deletion
      }
      confirmDeleteDialog.value = false; // Close the confirmation dialog
      itemToDelete.value = null; // Clear the item to delete
    };

    const addToFlashcard = (item) => {
      alert(`"${item.kanji}" đã được thêm vào Flashcard! (Chức năng này cần được phát triển)`);
    };

    const saveVocabulary = () => {
      if (editingVocabulary.value) {
        const index = allWords.value.findIndex(v => v.id === editingVocabulary.value.id);
        if (index !== -1) {
          allWords.value[index] = { ...form.value, updated: new Date().toISOString().slice(0, 10) };
        }
      } else {
        const newId = allWords.value.length ? Math.max(...allWords.value.map(v => v.id)) + 1 : 1;
        allWords.value.push({ ...form.value, id: newId, updated: new Date().toISOString().slice(0, 10) });
      }
      closeDialog();
      loadItems({ page: currentPage.value, itemsPerPage: itemsPerPage.value, sortBy: [] }); // Reload data after save
    };

    const closeDialog = () => {
      dialog.value = false;
    };

    onMounted(() => {
      loadItems({ page: 1, itemsPerPage: 10, sortBy: [] }); // Initial load
    });

    return {
      searchQuery,
      filterLevel,
      filterCategory,
      allWords,
      filteredWords,
      totalWordsCount,
      currentPage,
      itemsPerPage,
      loading,
      pageCount,
      levelOptions,
      categoryOptions,
      difficultyOptions,
      headers,
      totalVocabulary,
      totalCategories,
      totalLevels,
      dialog,
      editingVocabulary,
      form,
      confirmDeleteDialog, // Expose for template
      itemToDelete, // Expose for template
      confirmDialogTitle, // Expose for template
      confirmDialogMessage, // Expose for template
      getLevelColor,
      getDifficultyColor,
      formatDate,
      resetFilters,
      handleImport,
      handleExport,
      addNewVocabulary,
      editVocabulary,
      showDeleteConfirmation, // Use this for delete button click
      handleDeleteConfirmed, // Use this for confirm dialog's confirm event
      addToFlashcard,
      saveVocabulary,
      closeDialog,
      loadItems,
    };
  }
}
</script>

<style scoped>
/* Base Styles for the Dashboard */
.vocabulary-management-dashboard {
  background-color: #F0F2F5; /* Màu nền xám nhạt */
  min-height: calc(100vh - 64px); /* Trừ chiều cao header */
  font-family: 'Roboto', sans-serif; /* Sử dụng font mềm mại hơn */
}

/* Page Title Section */
.page-title {
  color: #333333;
  font-size: 2.2rem !important; /* Vuetify's text-h4 is already ~2.125rem */
  display: flex;
  align-items: center;
  margin-bottom: 8px; /* Slightly less space for a tighter feel */
}
.page-title-icon {
  font-size: 2.8rem; /* Larger emoji for main title */
  line-height: 1;
  vertical-align: middle;
  transform: translateY(-2px); /* Slight adjustment for visual alignment */
}

/* Common Card Styles */
.dashboard-card {
  background-color: #FFFFFF !important;
  border-radius: 16px; /* Bo tròn mạnh hơn cho vẻ mềm mại */
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08); /* Đổ bóng sâu hơn, hiện đại hơn */
  border: none; /* Bỏ viền */
}
.card-title {
  color: #333333;
  font-weight: 700; /* Đậm hơn */
  font-size: 1.5rem !important; /* Lớn hơn một chút */
  padding: 16px 24px;
  border-bottom: 1px solid #EEEEEE;
  margin-bottom: 16px; /* Tăng khoảng cách dưới tiêu đề */
  display: flex;
  align-items: center;
}
.card-title-icon {
  font-size: 1.8rem; /* Kích thước icon tiêu đề thẻ */
  line-height: 1;
  vertical-align: middle;
}

/* Statistic Cards */
.statistic-card {
  min-height: 140px; /* Chiều cao lớn hơn */
  padding: 24px !important; /* Padding lớn hơn */
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out; /* Hiệu ứng hover */
}
.statistic-card:hover {
  transform: translateY(-5px); /* Nâng nhẹ khi hover */
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15); /* Đổ bóng sâu hơn khi hover */
}
.statistic-icon {
  font-size: 4rem; /* Icon thống kê lớn hơn nữa */
  line-height: 1;
  vertical-align: middle;
  opacity: 0.8; /* Hơi mờ một chút */
}

/* Buttons */
.v-btn {
  font-weight: 600;
  letter-spacing: 0.02em; /* Thêm khoảng cách chữ */
  text-transform: none; /* Bỏ chữ hoa mặc định của Vuetify */
  transition: all 0.2s ease-in-out;
}
.v-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.btn-icon {
    font-size: 1.2rem; /* Kích thước emoji trong các nút lớn */
    line-height: 1;
}

/* Text Fields and Selects */
/* Đã có clearable mặc định với thuộc tính `clearable` */
.v-text-field, .v-select {
  border-radius: 12px !important; /* Bo tròn hơn cho input */
}
.search-icon {
    font-size: 1.2rem;
    line-height: 1;
    margin-top: 2px; /* Điều chỉnh vị trí của emoji trong input */
}
/* Filter/Reset button icon */
.filter-icon {
    font-size: 1.2rem; /* Kích thước icon reset */
    line-height: 1;
}

/* Table Styling */
.vocabulary-table :deep(.v-data-table__content) {
  border-radius: 12px; /* Bo tròn mạnh hơn cho bảng */
  overflow: hidden;
}
.vocabulary-table :deep(th) {
  background-color: #E8F0FE !important; /* Nền header xanh nhạt hơn */
  color: #1A237E !important; /* Chữ màu xanh đậm */
  font-weight: 700 !important; /* Đậm hơn */
  font-size: 1rem !important; /* Lớn hơn một chút */
  text-transform: uppercase;
  letter-spacing: 0.05em; /* Thêm khoảng cách chữ */
  padding: 16px 20px !important;
}
.vocabulary-table :deep(td) {
  border-bottom: 1px solid #ECEFF1 !important; /* Đường kẻ mảnh hơn */
  color: #455A64;
  padding: 12px 20px !important; /* Tăng padding */
}
.vocabulary-table :deep(tr:hover) {
  background-color: #F5F9FF !important; /* Hiệu ứng hover xanh nhạt */
}

/* Actions column buttons in table */
.action-btn {
    min-width: 36px !important; /* Đảm bảo nút tròn hơn */
    width: 36px !important;
    height: 36px !important;
    padding: 0 !important;
    box-shadow: none !important;
    transition: all 0.2s ease-in-out;
}
.action-btn:hover {
    box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
    transform: translateY(-1px);
    /* No background color on hover for delete to keep emoji color */
}
/* Emoji inside table action buttons */
.action-btn .v-btn__content {
    font-size: 1rem; /* Điều chỉnh kích thước emoji trong nút nhỏ */
    line-height: 1;
}

/* Chip styling for level and difficulty */
.v-chip {
  font-weight: 600; /* Đậm hơn */
  text-transform: uppercase;
  font-size: 0.8rem; /* Lớn hơn một chút */
  padding: 6px 12px; /* Tăng padding */
  height: auto;
  border-radius: 18px !important; /* Bo tròn hoàn toàn */
}
/* Adjust specific chip colors for "Rất khó" */
.v-chip.bg-deep-purple-lighten-1 {
  background-color: #B39DDB !important;
  color: #512DA8 !important; /* Text color for better contrast */
}

/* Pagination */
.v-pagination {
  margin: 20px auto; /* Canh giữa và thêm khoảng cách */
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

/* Dialog (Popup) Styling */
.dialog-card {
  overflow: hidden; /* Đảm bảo bo tròn không bị tràn */
}
.v-toolbar.rounded-t-xl {
    border-top-left-radius: 16px !important;
    border-top-right-radius: 16px !important;
}
.dialog-card .v-card-text {
  padding: 30px !important; /* Tăng padding bên trong dialog */
  background-color: #F8F9FA; /* Nền hơi xám cho phần nội dung */
}
.dialog-card .v-card-actions {
  border-top: 1px solid #EEEEEE;
  padding: 20px 30px !important; /* Tăng padding */
}

/* Dialog specific input styling */
.v-dialog .v-text-field,
.v-dialog .v-select,
.v-dialog .v-textarea {
  background-color: #FFFFFF !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05); /* Đổ bóng nhẹ cho input trong dialog */
}
.v-dialog .v-text-field .v-field__prepend-inner span,
.v-dialog .v-select .v-field__prepend-inner span,
.v-dialog .v-textarea .v-field__prepend-inner span {
    font-size: 1.1rem; /* Kích thước emoji trong dialog input */
    margin-top: 2px;
}
</style>
�