<!-- src/components/entertainment/GameManagementTab.vue -->
<template>
  <v-container fluid>
    <v-card class="main-content-card" elevation="2" rounded="lg">
      <v-toolbar flat class="px-4 py-2">
        <v-text-field
          v-model="search"
          density="comfortable"
          label="🔍 Tìm kiếm..."
          variant="solo"
          rounded="lg"
          single-line
          hide-details
          flat
          class="search-input mr-4"
        ></v-text-field>

        <v-select
          v-model="levelFilter"
          :items="levelOptions"
          label="Tất cả cấp độ"
          variant="solo"
          density="comfortable"
          flat
          hide-details
          rounded="lg"
          class="filter-select mr-4"
          clearable
        ></v-select>
        <v-select
          v-model="typeFilter"
          :items="typeOptions"
          label="Tất cả loại"
          variant="solo"
          density="comfortable"
          flat
          hide-details
          rounded="lg"
          class="filter-select"
          clearable
        ></v-select>

        <v-tooltip text="Làm mới bộ lọc" location="top">
          <template v-slot:activator="{ props }">
            <v-btn
              color="grey-lighten-2"
              icon
              size="large"
              @click="resetFilters"
              class="ml-2 rounded-full elevation-2"
              v-bind="props"
            >
              <span class="filter-icon text-h6">🔄</span>
            </v-btn>
          </template>
        </v-tooltip>
        <v-spacer></v-spacer>

        <v-btn
          class="add-new-btn-manga ml-2"
          prepend-icon="mdi-plus-box"
          size="large"
          rounded
          elevation="0"
          @click="openQuestionDialog()"
          ><span style="font-size: 18px; margin-right: 6px">➕</span>
          Thêm Câu hỏi mới
        </v-btn>
      </v-toolbar>
      <v-divider></v-divider>

      <v-data-table
        :headers="headers"
        :items="filteredItems"
        :loading="loading"
        v-model:page="currentPage"
        :items-per-page="itemsPerPage"
        class="game-table"
      >
        <template v-slot:item.stt="{ index }">
          {{ (currentPage - 1) * itemsPerPage + index + 1 }}
        </template>

        <template v-slot:item.questionText="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar
              v-if="item.questionType === 'image_based'"
              size="50"
              class="mr-4"
              rounded="lg"
            >
              <v-img :src="item.imageUrl" :alt="item.answer"></v-img>
            </v-avatar>
            <span class="text-body-2">{{ item.questionText }}</span>
          </div>
        </template>

        <template v-slot:item.answer="{ item }">
          <div class="answer-cell">
            <span class="answer-jp">{{ item.answer }}</span>
            <span v-if="item.answerRomaji" class="answer-romaji">{{
              item.answerRomaji
            }}</span>
          </div>
        </template>

        <template v-slot:item.level="{ item }">
          <v-chip
            class="level-chip-vocab"
            size="small"
            label
            :style="levelColorStyle(item.level)"
          >
            {{ item.level }}
          </v-chip>
        </template>

        <template v-slot:item.creationDate="{ item }">
          <span class="update-date">{{ formatDate(item.creationDate) }}</span>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-tooltip text="Sửa" location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                icon
                size="small"
                variant="text"
                v-bind="props"
                @click="openQuestionDialog(item)"
                ><span class="text-h6">✏️</span></v-btn
              >
            </template>
          </v-tooltip>
          <v-tooltip text="Xóa" location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                icon
                size="small"
                variant="text"
                v-bind="props"
                @click="confirmDelete(item)"
                ><span class="text-h6">🗑️</span></v-btn
              >
            </template>
          </v-tooltip>
        </template>

        <template v-slot:no-data>
          <v-alert type="info" class="ma-4"
            >Chưa có câu hỏi nào được tạo hoặc tìm thấy.</v-alert
          >
        </template>
        <template v-slot:loading>
          <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
        </template>

        <template v-slot:bottom>
          <v-divider></v-divider>
          <div class="d-flex justify-center align-center pa-4">
            <v-pagination
              v-model="currentPage"
              :length="pageCount"
              :total-visible="5"
              rounded="circle"
              density="comfortable"
            ></v-pagination>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <GameQuestionDialog
      v-model:show="dialogVisible"
      :edited-question="editedQuestion"
      @save="onSaveQuestion"
    />
    <ConfirmDialog
      v-model:show="confirmDialogVisible"
      title="Xác nhận xoá"
      :message="`Bạn có chắc chắn muốn xoá câu hỏi '${
        questionToDelete?.questionText || ''
      }' không?`"
      confirm-text="Xoá"
      confirm-color="error"
      @confirm="onDeleteConfirmed"
    />
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      location="top right"
      timeout="2500"
    >
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import GameQuestionDialog from "./GameQuestionDialog.vue";
import ConfirmDialog from "../exercise/ConfirmDialog.vue";
import gameService from "@/services/gameService";

// State
const allQuestions = ref([]);
const loading = ref(true);
const dialogVisible = ref(false);
const editedQuestion = ref(null);
const confirmDialogVisible = ref(false);
const questionToDelete = ref(null);
const snackbar = ref({ show: false, text: "", color: "success" });

const search = ref("");
const levelFilter = ref(null);
const typeFilter = ref(null);
const currentPage = ref(1);
const itemsPerPage = 10;

// Lọc dữ liệu
const filteredItems = computed(() => {
  let items = allQuestions.value;
  if (search.value) {
    const query = search.value.toLowerCase();
    items = items.filter(
      (q) =>
        (q.questionText && q.questionText.toLowerCase().includes(query)) ||
        (q.answer && q.answer.toLowerCase().includes(query)) ||
        (q.topic && q.topic.toLowerCase().includes(query))
    );
  }
  if (levelFilter.value) {
    items = items.filter((q) => q.level === levelFilter.value);
  }
  if (typeFilter.value) {
    items = items.filter((q) => q.questionType === typeFilter.value);
  }
  return items;
});

const pageCount = computed(() =>
  Math.ceil(filteredItems.value.length / itemsPerPage)
);

// Table headers
const headers = [
  { title: "STT", key: "stt", align: "center", width: 60 },
  { title: "NỘI DUNG", key: "questionText", align: "left" },
  { title: "ĐÁP ÁN", key: "answer", align: "center", width: 120 },
  { title: "CẤP ĐỘ", key: "level", align: "center", width: 90 },
  { title: "CHỦ ĐỀ", key: "topic", align: "center", width: 140 },
  { title: "CẬP NHẬT", key: "creationDate", align: "center", width: 120 },
  {
    title: "HÀNH ĐỘNG",
    key: "actions",
    align: "center",
    width: 120,
    sortable: false,
  },
];

// Options cho filter
const levelOptions = ["N5", "N4", "N3", "N2", "N1"];
const typeOptions = [
  { title: "Dựa trên nghĩa", value: "text_based" },
  { title: "Dựa trên hình ảnh", value: "image_based" },
];

// Fetch data
onMounted(fetchQuestions);

async function fetchQuestions() {
  loading.value = true;
  allQuestions.value = await gameService.getAllQuestions();
  loading.value = false;
}

// Reset filter
function resetFilters() {
  search.value = "";
  levelFilter.value = null;
  typeFilter.value = null;
}

// Mở dialog thêm/sửa
function openQuestionDialog(question = null) {
  editedQuestion.value = question ? { ...question } : null;
  dialogVisible.value = true;
}

// Khi lưu từ dialog
async function onSaveQuestion(question) {
  if (question.id) {
    // Sửa
    const ok = await gameService.updateGameQuestion(question);
    if (ok) {
      showSnackbar("Cập nhật câu hỏi thành công!", "success");
    } else {
      showSnackbar("Không tìm thấy câu hỏi để cập nhật!", "error");
    }
  } else {
    // Thêm mới
    await gameService.addGameQuestion(question);
    showSnackbar("Thêm câu hỏi thành công!", "success");
  }
  dialogVisible.value = false;
  await fetchQuestions();
}

// Xoá
function confirmDelete(question) {
  questionToDelete.value = question;
  confirmDialogVisible.value = true;
}
async function onDeleteConfirmed() {
  await gameService.deleteGameQuestion(questionToDelete.value.id);
  showSnackbar("Đã xoá câu hỏi!", "success");
  confirmDialogVisible.value = false;
  await fetchQuestions();
}

// Hàm showSnackbar (nếu chưa có)
function showSnackbar(text, color = "success") {
  snackbar.value.text = text;
  snackbar.value.color = color;
  snackbar.value.show = true;
}

// Format ngày
function formatDate(date) {
  if (!date) return "N/A";
  const d = new Date(date);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

// Màu sắc cấp độ
function levelColorStyle(level) {
  switch (level) {
    case "N5":
      return "background:#e3f2fd;color:#1976d2;font-weight:700;";
    case "N4":
      return "background:#e8f5e9;color:#43a047;font-weight:700;";
    case "N3":
      return "background:#fffde7;color:#fbc02d;font-weight:700;";
    case "N2":
      return "background:#fce4ec;color:#d81b60;font-weight:700;";
    case "N1":
      return "background:#ede7f6;color:#5e35b1;font-weight:700;";
    default:
      return "background:#e3f2fd;color:#1976d2;font-weight:700;";
  }
}
</script>

<style scoped>
.main-content-card {
  border-radius: 16px !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}
.main-content-card .v-toolbar {
  background-color: #ffffff !important;
  border-bottom: 1px solid #e0e0e0;
}
.search-input,
.filter-select,
.add-new-btn,
.game-table :deep(th),
.game-table :deep(td),
.v-pagination .v-btn,
.v-chip {
  font-family: "Roboto", Arial, sans-serif !important;
  font-size: 15px !important;
  letter-spacing: 0.2px;
}
.search-input {
  max-width: 300px;
  background-color: #f0f2f5 !important;
}
.filter-select {
  max-width: 180px;
  background-color: #f0f2f5 !important;
}
.add-new-btn {
  font-weight: 600 !important;
  text-transform: none !important;
}
.add-new-btn-manga {
  background: #1976d2 !important; /* Xanh dương đậm */
  color: #fff !important; /* Chữ trắng */
  font-family: "Roboto", Arial, sans-serif !important;
  font-weight: 700 !important;
  font-size: 17px !important;
  text-transform: none !important;
  box-shadow: none !important;
  border: none !important;
  letter-spacing: 0.1px;
  transition: background 0.2s;
  padding-left: 18px !important;
  padding-right: 18px !important;
}
.add-new-btn-manga:hover {
  background: #1565c0 !important; /* Xanh đậm hơn khi hover */
  color: #fff !important;
}
.game-table :deep(th) {
  background-color: #e3f2fd !important;
  color: #1976d2 !important;
  font-weight: 700 !important;
  text-transform: uppercase;
  border-bottom: 1px solid #e0e0e0;
}
.game-table :deep(td) {
  border-bottom: 1px solid #f0f2f5;
  vertical-align: middle;
  color: #222 !important;
  font-weight: 500 !important;
}
.game-table :deep(tr:hover) {
  background-color: #f5f9ff !important;
}
.v-chip {
  font-weight: 700 !important;
  border-radius: 12px !important;
  font-size: 15px !important;
  letter-spacing: 0.2px;
  font-family: "Roboto", Arial, sans-serif;
  padding: 0 14px !important;
}
.v-pagination {
  justify-content: center !important;
  margin: 0 auto !important;
  gap: 8px !important;
}
.v-pagination .v-btn {
  background: #e3f2fd !important;
  color: #1976d2 !important;
  font-weight: 700 !important;
  font-size: 18px !important;
  min-width: 44px !important;
  min-height: 44px !important;
  border-radius: 12px !important;
  margin: 0 2px !important;
  box-shadow: none !important;
  transition: background 0.2s;
}
.v-pagination .v-btn--active {
  background: #bbdefb !important;
  color: #1976d2 !important;
}
.answer-cell {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.2;
}
.answer-jp {
  color: #1976d2;
  font-weight: 700;
  font-size: 16px;
  font-family: "Roboto", Arial, sans-serif;
  margin-bottom: 2px;
}
.answer-romaji {
  color: #90a4ae;
  font-size: 13px;
  font-family: "Roboto", Arial, sans-serif;
  font-weight: 400;
}
.level-chip-vocab {
  border-radius: 12px !important;
  font-size: 15px !important;
  letter-spacing: 0.2px;
  font-family: "Roboto", Arial, sans-serif;
  padding: 0 14px !important;
}
.update-date {
  color: #90a4ae;
  font-size: 13px;
  font-family: "Roboto", Arial, sans-serif;
  font-weight: 400;
}
</style>
