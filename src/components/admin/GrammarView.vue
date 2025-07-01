<template>
  <v-container fluid class="main-content-dashboard pa-8">
    <v-row class="mb-6 align-center">
      <v-col cols="12" md="8">
        <h1 class="text-h4 font-weight-bold text-dark-emphasis mb-2 d-flex align-center">
          <span class="page-title-icon mr-3">📝</span> Quản lý ngữ pháp và bài giảng
        </h1>
        <p class="text-subtitle-1 text-medium-emphasis">
          <v-icon size="18" class="mr-2">fa-solid fa-pen-to-square</v-icon>
     
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
          ➕ Thêm nội dung mới
        </v-btn>
      </v-col>
    </v-row>

    <v-row class="mb-8">
      <v-col cols="12" sm="6" md="3">
        <v-card class="summary-card" elevation="2" rounded="lg" color="blue-lighten-5">
          <v-card-text class="d-flex align-center justify-space-between">
            <div>
              <div class="text-subtitle-2 text-medium-emphasis">📘 Tổng ngữ pháp</div>
              <div class="text-h5 font-weight-bold text-dark-emphasis">{{ totalGrammar }}</div>
            </div>
            <v-icon size="48" color="blue-grey-lighten-2">fa-solid fa-graduation-cap</v-icon>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="summary-card" elevation="2" rounded="lg" color="green-lighten-5">
          <v-card-text class="d-flex align-center justify-space-between">
            <div>
              <div class="text-subtitle-2 text-medium-emphasis">📖 Tổng bài giảng</div>
              <div class="text-h5 font-weight-bold text-dark-emphasis">{{ totalLectures }}</div>
            </div>
            <v-icon size="48" color="green-lighten-2">fa-solid fa-book</v-icon>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="summary-card" elevation="2" rounded="lg" color="purple-lighten-5">
          <v-card-text class="d-flex align-center justify-space-between">
            <div>
              <div class="text-subtitle-2 text-medium-emphasis">👥 Tổng số học viên</div>
              <div class="text-h5 font-weight-bold text-dark-emphasis">3,456</div>
            </div>
            <v-icon size="48" color="purple-lighten-2">fa-solid fa-users</v-icon>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="summary-card" elevation="2" rounded="lg" color="orange-lighten-5">
          <v-card-text class="d-flex align-center justify-space-between">
            <div>
              <div class="text-subtitle-2 text-medium-emphasis">👁️‍🗨️ Lượt xem</div>
              <div class="text-h5 font-weight-bold text-dark-emphasis">12,890</div>
            </div>
            <v-icon size="48" color="orange-lighten-2">fa-solid fa-chart-bar</v-icon>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="main-content-card" elevation="2" rounded="lg">
      <v-toolbar flat class="px-4 py-2">
        <v-text-field
          v-model="searchQuery"
          density="comfortable"
          label="🔍 Tìm kiếm..."
          prepend-inner-icon="fa-solid fa-magnifying-glass"
          single-line
          hide-details
          flat
          variant="solo"
          rounded="lg"
          class="search-input"
        ></v-text-field>

        <v-spacer></v-spacer>

        <v-select
          v-model="selectedLevel"
          :items="levelFilters"
          label="Cấp độ"
          variant="solo-filled"
          density="comfortable"
          flat
          hide-details
          rounded="lg"
          class="filter-select mr-4"
        ></v-select>

        <v-select
          v-model="selectedStatus"
          :items="statusFilters"
          label="Trạng thái"
          variant="solo-filled"
          density="comfortable"
          flat
          hide-details
          rounded="lg"
          class="filter-select"
        ></v-select>

        <v-btn
          color="primary"
          class="ml-4"
          rounded
          elevation="0"
          @click="openDialog"
          prepend-icon="fa-solid fa-plus"
          size="large"
        >
          ➕ Thêm {{ activeTab === 'grammar' ? 'ngữ pháp' : 'bài giảng' }}
        </v-btn>
      </v-toolbar>

      <v-divider></v-divider>

      <v-tabs v-model="activeTab" color="primary" align-tabs="start" class="px-4">
        <v-tab value="grammar">Ngữ pháp</v-tab>
        <v-tab value="lectures">Bài giảng</v-tab>
      </v-tabs>

      <v-card-text class="pa-0 pt-4">
        <v-window v-model="activeTab">
          <v-window-item value="grammar">
            <div v-if="paginatedGrammarItems.length > 0">
              <v-card
                v-for="item in paginatedGrammarItems"
                :key="item.id"
                class="content-item-card mb-4 mx-4"
                elevation="1"
                rounded="lg"
              >
                <v-card-text>
                  <div class="d-flex justify-space-between align-start mb-2">
                    <div class="d-flex flex-column">
                      <div class="d-flex align-center text-subtitle-1 font-weight-bold">
                        <span class="text-h6 mr-2">{{ item.emoji || '💡' }}</span>
                        {{ item.title }}
                        <v-chip :color="getLevelColor(item.level)" size="small" class="ml-3 font-weight-medium">{{ item.level }}</v-chip>
                        <v-chip :color="getStatusColor(item.status)" size="small" class="ml-2 font-weight-medium" variant="outlined">{{ item.status === 'Published' ? 'Hoạt động' : item.status === 'Draft' ? 'Bản nháp' : item.status }}</v-chip>
                      </div>
                      <span class="text-body-2 text-medium-emphasis mt-1">{{ item.description }}</span>
                    </div>
                    <div class="d-flex align-center ga-1">
                      <v-btn icon flat size="small" variant="text" @click="viewItem(item)">
                        <span class="text-h6">🙇‍♀️</span> <!-- View Emoji -->
                        <v-tooltip activator="parent" location="top">Xem chi tiết</v-tooltip>
                      </v-btn>
                      <v-btn icon flat size="small" variant="text" @click="editItem(item)">
                        <span class="text-h6">🛠️</span> <!-- Edit Emoji -->
                        <v-tooltip activator="parent" location="top">Chỉnh sửa</v-tooltip>
                      </v-btn>
                      <v-btn icon flat size="small" variant="text" @click="confirmDelete(item.id, item.title)">
                        <span class="text-h6">🗑️</span> <!-- Delete Emoji -->
                        <v-tooltip activator="parent" location="top"> Xóa</v-tooltip>
                      </v-btn>
                    </div>
                  </div>
                  <div class="text-body-1 font-weight-medium mt-2">{{ item.exampleJp }}</div>
                  <div class="text-body-2 text-medium-emphasis mt-1">{{ item.exampleVn }}</div>
                  <div class="text-caption text-medium-emphasis mt-2 d-flex justify-space-between">
                      <span>{{ item.students }} học viên</span>
                      <span>Tạo: {{ item.date }}</span>
                  </div>
                </v-card-text>
              </v-card>
              <div class="text-center mt-4 mb-4">
                <v-pagination
                  v-model="grammarPage"
                  :length="grammarPageCount"
                  :total-visible="7"
                  rounded="circle"
                ></v-pagination>
              </div>
            </div>
            <v-alert v-else type="info" class="ma-4">
              Không tìm thấy ngữ pháp nào khớp với tiêu chí tìm kiếm.
            </v-alert>
          </v-window-item>

          <v-window-item value="lectures">
            <div v-if="paginatedLectureItems.length > 0">
              <v-card
                v-for="item in paginatedLectureItems"
                :key="item.id"
                class="content-item-card mb-4 mx-4"
                elevation="1"
                rounded="lg"
              >
                <v-card-text>
                  <div class="d-flex justify-space-between align-start mb-2">
                    <div class="d-flex flex-column">
                      <div class="d-flex align-center text-subtitle-1 font-weight-bold">
                        <span class="text-h6 mr-2">{{ item.emoji || '📚' }}</span>
                        {{ item.title }}
                        <v-chip :color="getLevelColor(item.level)" size="small" class="ml-3 font-weight-medium">{{ item.level }}</v-chip>
                        <v-chip v-if="item.tags && item.tags.length > 0" v-for="tag in item.tags" :key="tag" :color="getTagColor(tag)" size="small" class="ml-2 font-weight-medium" variant="outlined">{{ tag }}</v-chip>
                        <v-chip :color="getStatusColor(item.status)" size="small" class="ml-2 font-weight-medium" variant="outlined">{{ item.status === 'Published' ? 'Đã xuất bản' : item.status === 'Draft' ? 'Bản nháp' : item.status }}</v-chip>
                      </div>
                      <span class="text-body-2 text-medium-emphasis mt-1">Thời lượng: {{ item.duration }}</span>
                      <span class="text-body-2 text-medium-emphasis">Từ vựng: {{ item.vocabularyCount }}</span>
                    </div>
                    <div class="d-flex align-center ga-1">
                      <v-btn icon flat size="small" variant="text" @click="viewItem(item)">
                        <span class="text-h6">🙇‍♀️</span>
                        <v-tooltip activator="parent" location="top">Xem chi tiết</v-tooltip>
                      </v-btn>
                      <v-btn icon flat size="small" variant="text" @click="editItem(item)">
                        <span class="text-h6">🛠️</span>
                        <v-tooltip activator="parent" location="top">Chỉnh sửa</v-tooltip>
                      </v-btn>
                      <v-btn icon flat size="small" variant="text" @click="confirmDelete(item.id, item.title)">
                        <span class="text-h6">🗑️</span>
                        <v-tooltip activator="parent" location="top">Xóa</v-tooltip>
                      </v-btn>
                    </div>
                  </div>
                  <div class="text-caption text-medium-emphasis mt-2 d-flex justify-space-between">
                      <span>Ngữ pháp: {{ item.grammarCount }}</span>
                      <span>Lượt xem: {{ item.views }}</span>
                  </div>
                  <div class="text-caption text-medium-emphasis mt-1">Tạo: {{ item.date }}</div>
                </v-card-text>
              </v-card>
              <div class="text-center mt-4 mb-4">
                <v-pagination
                  v-model="lecturePage"
                  :length="lecturePageCount"
                  :total-visible="7"
                  rounded="circle"
                ></v-pagination>
              </div>
            </div>
            <v-alert v-else type="info" class="ma-4">
              Không tìm thấy bài giảng nào khớp với tiêu chí tìm kiếm.
            </v-alert>
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>

    <!-- Grammar/Lecture Form Dialog (for Add/Edit) -->
    <GrammarFormDialog
      v-model:show="dialog"
      :editedItem="editedItem"
      :currentTab="activeTab"
      @save="saveItem"
    />

    <!-- Grammar/Lecture View Details Dialog -->
    <GrammarViewDetailsDialog
      v-model:show="viewDetailsDialog"
      :itemDetails="currentViewedItem"
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
import { ref, computed, watch } from 'vue'
import GrammarFormDialog from '../grammar/GrammarFormDialog.vue' // Adjust path if necessary
import GrammarViewDetailsDialog from '../grammar/GrammarViewDetailsDialog.vue' // Import View Details Dialog
import ConfirmDialog from '../exercise/ConfirmDialog.vue'

const dialog = ref(false) // For Add/Edit form
const viewDetailsDialog = ref(false) // For View Details Dialog
const confirmDeleteDialog = ref(false) // For Delete confirmation

const editedItem = ref(null)
const currentViewedItem = ref(null) // To pass data to view details dialog
const itemToDeleteId = ref(null) // To store ID of item to be deleted
const confirmDialogTitle = ref('') // Title for confirmation dialog
const confirmDialogMessage = ref('') // Message for confirmation dialog

const searchQuery = ref('')
const activeTab = ref('grammar') // 'grammar' or 'lectures'
const selectedLevel = ref('Tất cả cấp độ')
const selectedStatus = ref('Tất cả trạng thái')

// Pagination state
const grammarPage = ref(1)
const lecturePage = ref(1)
const itemsPerPage = 5 // Number of items per page

const levelFilters = ['Tất cả cấp độ', 'N5', 'N4', 'N3', 'N2', 'N1']
const statusFilters = ['Tất cả trạng thái', 'Published', 'Draft', 'Pending Review', 'Rejected']

const allItems = ref([
  { id: 1, title: 'は (wa) - Trợ từ chủ ngữ', description: 'Trợ từ đánh dấu chủ ngữ trong câu', type: 'Ngữ pháp', level: 'N5', author: 'Nguyễn Văn A', date: '2024-01-15', status: 'Published', exampleJp: '私は学生です。', exampleVn: 'Tôi là học sinh.', students: 1250, emoji: '💡' },
  { id: 2, title: 'を (wo) - Trợ từ tân ngữ', description: 'Trợ từ đánh dấu tân ngữ trực tiếp', type: 'Ngữ pháp', level: 'N5', author: 'Trần Thị B', date: '2024-01-16', status: 'Published', exampleJp: '本を読みます。', exampleVn: 'Đọc sách.', students: 980, emoji: '📚' },
  { id: 3, title: 'に (ni) - Trợ từ chỉ thời gian/địa điểm', description: 'Trợ từ chỉ thời gian, địa điểm, hướng', type: 'Ngữ pháp', level: 'N5', author: 'Lê Văn C', date: '2024-01-17', status: 'Draft', exampleJp: '学校に行きます。', exampleVn: 'Đi đến trường.', students: 756, emoji: '📝' },
  { id: 7, title: 'Thể điều kiện ば', description: 'Cách diễn tả điều kiện.', type: 'Ngữ pháp', level: 'N3', author: 'Lê Văn C', date: '2024-01-17', status: 'Draft', exampleJp: '勉強すれば、合格します。', exampleVn: 'Nếu học, sẽ đậu.', students: 720, emoji: '✨' },
  { id: 9, title: 'から (kara)', description: 'Trợ từ chỉ nguyên nhân, lý do.', type: 'Ngữ pháp', level: 'N4', author: 'Phạm Thị D', date: '2024-01-23', status: 'Published', exampleJp: '忙しいから、行けません。', exampleVn: 'Vì bận nên không đi được.', students: 900, emoji: '🌸' },
  { id: 11, title: 'のです/んです (nodesu/ndesu)', description: 'Diễn tả nguyên nhân, giải thích.', type: 'Ngữ pháp', level: 'N4', author: 'Nguyễn Văn A', date: '2024-02-01', status: 'Published', exampleJp: '日本語を勉強しているんです。', exampleVn: 'Tôi đang học tiếng Nhật (để giải thích lý do).', students: 850, emoji: '📖' },
  { id: 12, title: '〜てみる (te miru)', description: 'Thử làm gì đó.', type: 'Ngữ pháp', level: 'N3', author: 'Trần Thị B', date: '2024-02-05', status: 'Draft', exampleJp: 'この本を読んでみます。', exampleVn: 'Tôi sẽ thử đọc quyển sách này.', students: 600, emoji: '👀' },
  { id: 13, title: '〜なければならない (nakereba naranai)', description: 'Phải làm gì đó.', type: 'Ngữ pháp', level: 'N3', author: 'Lê Văn C', date: '2024-02-10', status: 'Published', exampleJp: '毎日日本語を勉強しなければならない。', exampleVn: 'Mỗi ngày phải học tiếng Nhật.', students: 780, emoji: '💪' },

  { id: 4, title: 'Giới thiệu bản thân', type: 'Bài giảng', level: 'N5', author: 'Phạm Thị D', date: '2024-01-10', status: 'Published', tags: ['Video'], duration: '15 phút', vocabularyCount: 20, grammarCount: 5, views: '2,340', emoji: '🎬' },
  { id: 5, title: 'Gia đình và bạn bè', type: 'Bài giảng', level: 'N5', author: 'Nguyễn Văn A', date: '2024-01-12', status: 'Published', tags: ['Tương tác'], duration: '20 phút', vocabularyCount: 35, grammarCount: 8, views: '1,890', emoji: '🧑‍🤝‍🧑' },
  { id: 6, title: 'Đi mua sắm', type: 'Bài giảng', level: 'N4', author: 'Trần Thị B', date: '2024-01-14', status: 'Draft', tags: ['Audio'], duration: '12 phút', vocabularyCount: 25, grammarCount: 0, views: '0', emoji: '🛍️' },
  { id: 8, title: 'Kính ngữ trong tiếng Nhật', description: 'Tổng hợp kiến thức về kính ngữ trong tiếng Nhật.', type: 'Bài giảng', level: 'N2', author: 'Phạm Thị D', date: '2024-01-18', status: 'Published', tags: ['Video'], duration: '30 phút', vocabularyCount: 50, grammarCount: 15, views: '1,500', emoji: '👑' },
  { id: 10, title: 'Phân tích tin tức', description: 'Bài giảng chuyên sâu về đọc tin tức tiếng Nhật.', type: 'Bài giảng', level: 'N1', author: 'Trần Thị B', date: '2024-01-24', status: 'Draft', tags: ['Văn bản'], duration: '45 phút', vocabularyCount: 100, grammarCount: 20, views: '250', emoji: '🗞️' },
  { id: 14, title: 'Văn hóa ẩm thực Nhật Bản', description: 'Khám phá các món ăn truyền thống và phong tục ăn uống.', type: 'Bài giảng', level: 'N4', author: 'Nguyễn Văn A', date: '2024-02-12', status: 'Published', tags: ['Video'], duration: '25 phút', vocabularyCount: 40, grammarCount: 7, views: '1,100', emoji: '🍣' },
  { id: 15, title: 'Luyện nghe JLPT N3', description: 'Các bài tập luyện nghe chuẩn JLPT N3.', type: 'Bài giảng', level: 'N3', author: 'Phạm Thị D', date: '2024-02-15', status: 'Published', tags: ['Audio'], duration: '30 phút', vocabularyCount: 60, grammarCount: 10, views: '950', emoji: '🎧' },
  { id: 16, title: 'Đọc hiểu chuyên sâu N2', description: 'Chiến lược và bài tập đọc hiểu dành cho N2.', type: 'Bài giảng', level: 'N2', author: 'Trần Thị B', date: '2024-02-18', status: 'Pending Review', tags: ['Văn bản'], duration: '40 phút', vocabularyCount: 80, grammarCount: 12, views: '400', emoji: '📖' },
]);

const totalGrammar = computed(() => allItems.value.filter(item => item.type === 'Ngữ pháp').length);
const totalLectures = computed(() => allItems.value.filter(item => item.type === 'Bài giảng').length);

const filteredItems = computed(() => {
  let filtered = allItems.value;

  // 1. Filter by search query
  if (searchQuery.value) {
    const searchLower = searchQuery.value.toLowerCase();
    filtered = filtered.filter(item =>
      item.title.toLowerCase().includes(searchLower) ||
      (item.description && item.description.toLowerCase().includes(searchLower)) ||
      item.author.toLowerCase().includes(searchLower) ||
      (item.exampleJp && item.exampleJp.toLowerCase().includes(searchLower)) ||
      (item.exampleVn && item.exampleVn.toLowerCase().includes(searchLower))
    );
  }

  // 2. Filter by level
  if (selectedLevel.value !== 'Tất cả cấp độ') {
    filtered = filtered.filter(item => item.level === selectedLevel.value);
  }

  // 3. Filter by status
  if (selectedStatus.value !== 'Tất cả trạng thái') {
    filtered = filtered.filter(item => item.status === selectedStatus.value);
  }

  return filtered;
});

const filteredGrammarItems = computed(() => {
  return filteredItems.value.filter(item => item.type === 'Ngữ pháp');
});

const filteredLectureItems = computed(() => {
  return filteredItems.value.filter(item => item.type === 'Bài giảng');
});

// Pagination computed properties
const grammarPageCount = computed(() => {
  return Math.ceil(filteredGrammarItems.value.length / itemsPerPage);
});

const lecturePageCount = computed(() => {
  return Math.ceil(filteredLectureItems.value.length / itemsPerPage);
});

const paginatedGrammarItems = computed(() => {
  const start = (grammarPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredGrammarItems.value.slice(start, end);
});

const paginatedLectureItems = computed(() => {
  const start = (lecturePage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredLectureItems.value.slice(start, end);
});


// Watchers to reset page when filters or tab change
watch([searchQuery, selectedLevel, selectedStatus], () => {
  grammarPage.value = 1;
  lecturePage.value = 1;
});

watch(activeTab, () => {
  grammarPage.value = 1;
  lecturePage.value = 1;
});


function openDialog() {
  editedItem.value = null
  dialog.value = true
}

function editItem(item) {
  if (item.type === 'Ngữ pháp') {
    editedItem.value = {
        id: item.id,
        title: item.title,
        level: item.level,
        status: item.status,
        description: item.description,
        exampleJp: item.exampleJp,
        exampleVn: item.exampleVn,
        type: item.type,
        emoji: item.emoji || ''
    };
  } else if (item.type === 'Bài giảng') {
      editedItem.value = {
        id: item.id,
        title: item.title,
        level: item.level,
        status: item.status,
        type: item.type,
        tags: item.tags || [],
        duration: item.duration,
        vocabularyCount: item.vocabularyCount,
        grammarCount: item.grammarCount,
        views: item.views,
        emoji: item.emoji || ''
      };
  } else {
      editedItem.value = null;
  }
  dialog.value = true
}

function saveItem(item) {
  const index = allItems.value.findIndex(i => i.id === item.id)
  if (index !== -1) {
    Object.assign(allItems.value[index], item);
  } else {
    item.id = Date.now() + Math.floor(Math.random() * 1000)
    if (item.type === 'Ngữ pháp') {
      item.author = 'Admin';
      item.date = new Date().toISOString().substring(0, 10);
      item.students = 0;
      item.emoji = item.emoji || '💡';
    } else if (item.type === 'Bài giảng') {
      item.author = 'Admin';
      item.date = new Date().toISOString().substring(0, 10);
      item.duration = item.duration || '0 phút';
      item.vocabularyCount = item.vocabularyCount || 0;
      item.grammarCount = item.grammarCount || 0;
      item.views = item.views || '0';
      item.emoji = item.emoji || '📚';
    }
    allItems.value.push(item)
  }
  dialog.value = false
}

// Custom delete confirmation logic
function confirmDelete(id, title) {
  itemToDeleteId.value = id;
  confirmDialogTitle.value = 'Xác nhận xóa nội dung';
  confirmDialogMessage.value = `Bạn có chắc chắn muốn xóa "${title}" này không? Hành động này không thể hoàn tác.`;
  confirmDeleteDialog.value = true;
}

async function handleDeleteConfirmed() {
  if (itemToDeleteId.value) {
    // In a real application, you'd call a service here to delete the item from a backend
    allItems.value = allItems.value.filter(i => i.id !== itemToDeleteId.value);
    console.log(`Đã xóa mục với ID: ${itemToDeleteId.value}`);
    // You might want to show a snackbar or toast notification here for success
  }
  confirmDeleteDialog.value = false;
  itemToDeleteId.value = null; // Clear the ID after action
}


const getStatusColor = (status) => {
  switch (status) {
    case 'Published': return 'success';
    case 'Hoạt động': return 'success';
    case 'Draft': return 'blue-grey-lighten-1';
    case 'Bản nháp': return 'blue-grey-lighten-1';
    case 'Đã xuất bản': return 'success';
    case 'Pending Review': return 'orange';
    case 'Rejected': return 'error';
    default: return 'grey';
  }
};

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

const getTagColor = (tag) => {
    switch (tag) {
        case 'Video': return 'deep-purple-lighten-3';
        case 'Tương tác': return 'pink-lighten-3';
        case 'Audio': return 'light-green-lighten-3';
        case 'Văn bản': return 'brown-lighten-3';
        case 'Ebook': return 'cyan-lighten-3'; // New color for Ebook tag if you add it
        default: return 'grey-lighten-1';
    }
};

// Open the custom view details dialog
const viewItem = (item) => {
  currentViewedItem.value = JSON.parse(JSON.stringify(item)); // Deep copy to prevent direct modification
  viewDetailsDialog.value = true;
};
</script>

<style scoped>
:root {
  --app-bg-color: #f5f7fa;
  --card-bg-color: #ffffff;
  --primary-color: #1a73e8;
  --accent-color: #4CAF50;
  --text-dark-emphasis: #333333; /* Màu đen đậm cho chữ */
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
.main-content-dashboard{
    background-color: #F0F2F5; /* Màu nền xám nhạt */
  min-height: calc(100vh - 64px); /* Trừ chiều cao header */
  font-family: 'Roboto', sans-serif;
}
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

.search-input .v-field__overlay {
  border-radius: 8px !important;
}

/* Styling cho các v-select (Bộ lọc) */
.filter-select {
  max-width: 180px;
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

.v-tabs {
  background-color: #ffffff !important;
  padding-left: 20px;
  border-bottom: 1px solid var(--border-color);
}

.v-tab {
  text-transform: none;
  font-weight: 600;
}

/* Content Item Card Styling - Cho cả Ngữ pháp và Bài giảng */
.content-item-card {
  border: 1px solid #e0e0e0;
  transition: box-shadow 0.1s ease-in-out;
}

.content-item-card:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08) !important;
}

/* Responsive Adjustments */
@media (max-width: 1200px) {
  .filter-select {
    max-width: 160px;
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
</style>
