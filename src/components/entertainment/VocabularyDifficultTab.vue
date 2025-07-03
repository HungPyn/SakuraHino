<template>
  <v-container fluid>
    <v-card class="main-content-card" elevation="2" rounded="lg">
      <v-toolbar flat class="px-4 py-2">
        <v-text-field
          v-model="search"
          density="comfortable"
          label="🔍 Tìm kiếm từ vựng..."
          variant="solo"
          rounded="lg"
          single-line
          hide-details
          flat
          class="search-input mr-4"
        ></v-text-field>
        <v-spacer></v-spacer>
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
        <template v-slot:item.word="{ item }">
          <span
            class="text-body-2"
            :style="item.important ? 'color:#d81b60;font-weight:700;' : ''"
          >
            {{ item.word }}
            <v-icon v-if="item.important" color="error" size="18" class="ml-1"
              >mdi-star</v-icon
            >
          </span>
        </template>
        <template v-slot:item.meaning="{ item }">
          <span>{{ item.meaning }}</span>
        </template>
        <template v-slot:item.mistakeCount="{ item }">
          <v-chip
            color="error"
            variant="tonal"
            size="small"
            label
            class="justify-center d-flex"
            style="width: 48px"
          >
            {{ item.mistakeCount }}
          </v-chip>
        </template>
        <template v-slot:item.actions="{ item }">
          <div style="display: flex; align-items: center; gap: 4px">
            <v-tooltip text="Xem chi tiết" location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  icon
                  size="small"
                  variant="text"
                  v-bind="props"
                  @click="viewDetail(item)"
                  style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  "
                >
                  <span
                    style="
                      font-size: 20px;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                    "
                    >👁️</span
                  >
                </v-btn>
              </template>
            </v-tooltip>
            <v-tooltip text="Đánh dấu quan trọng" location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  icon
                  size="small"
                  variant="text"
                  v-bind="props"
                  @click="toggleImportant(item)"
                  style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  "
                >
                  <span
                    :style="`font-size: 20px; display: flex; align-items: center; justify-content: center; color: ${
                      item.important ? '#FFC107' : '#BDBDBD'
                    };`"
                  >
                    ⭐
                  </span>
                </v-btn>
              </template>
            </v-tooltip>
            <v-tooltip text="Xoá" location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  icon
                  size="small"
                  variant="text"
                  v-bind="props"
                  @click="confirmDelete(item)"
                  style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  "
                >
                  <span
                    style="
                      font-size: 20px;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      color: #e53935;
                    "
                    >🗑️</span
                  >
                </v-btn>
              </template>
            </v-tooltip>
          </div>
        </template>
        <template v-slot:no-data>
          <v-alert type="info" class="ma-4">
            Không có từ vựng khó nhớ nào.
          </v-alert>
        </template>
        <template v-slot:loading>
          <v-skeleton-loader type="table-row@8"></v-skeleton-loader>
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

    <!-- Dialog xem chi tiết -->
    <v-dialog v-model="detailDialog" max-width="400">
      <v-card>
        <v-card-title>
          <span class="text-h6">Chi tiết từ vựng</span>
        </v-card-title>
        <v-card-text>
          <div><b>Từ vựng:</b> {{ selectedWord?.word }}</div>
          <div><b>Ý nghĩa:</b> {{ selectedWord?.meaning }}</div>
          <div><b>Số lần sai:</b> {{ selectedWord?.mistakeCount }}</div>
          <div>
            <b>Trạng thái:</b>
            <v-chip
              :color="selectedWord?.important ? 'error' : 'grey'"
              size="small"
              label
            >
              {{ selectedWord?.important ? "Quan trọng" : "Bình thường" }}
            </v-chip>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="detailDialog = false">Đóng</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog xác nhận xoá -->
    <v-dialog v-model="confirmDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6" style="background: #f44336; color: #fff">
          <v-icon color="white" class="mr-2">mdi-alert-circle</v-icon>
          Xác nhận xoá
        </v-card-title>
        <v-card-text>
          Bạn có chắc chắn muốn xoá từ "<b>{{ wordToDelete?.word }}</b
          >" khỏi danh sách không?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="confirmDialog = false">HUỶ</v-btn>
          <v-btn
            color="error"
            variant="flat"
            @click="deleteWord"
            style="color: #fff; font-weight: 700"
          >
            XÁC NHẬN XOÁ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      location="top right"
      timeout="2200"
    >
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed } from "vue";

// Dữ liệu mẫu (có thể thay bằng API sau)
const allWords = ref([
  {
    id: 1,
    word: "覚える",
    meaning: "Nhớ, ghi nhớ",
    mistakeCount: 7,
    important: false,
  },
  { id: 2, word: "難しい", meaning: "Khó", mistakeCount: 10, important: true },
  { id: 3, word: "忘れる", meaning: "Quên", mistakeCount: 8, important: false },
  { id: 4, word: "復習", meaning: "Ôn tập", mistakeCount: 6, important: false },
  {
    id: 5,
    word: "間違える",
    meaning: "Sai, nhầm lẫn",
    mistakeCount: 12,
    important: true,
  },
  { id: 6, word: "努力", meaning: "Nỗ lực", mistakeCount: 5, important: false },
]);

const loading = ref(false);
const search = ref("");
const currentPage = ref(1);
const itemsPerPage = 8;

// Table headers
const headers = [
  { title: "STT", key: "stt", align: "center", width: 60 },
  { title: "TỪ VỰNG", key: "word", align: "left" },
  { title: "Ý NGHĨA", key: "meaning", align: "left" },
  {
    title: "SỐ LẦN SAI",
    key: "mistakeCount",
    align: "left",
    width: 160,
    class: "no-wrap",
  },
  {
    title: "THAO TÁC",
    key: "actions",
    align: "center",
    width: 140,
    sortable: false,
  },
];

// Lọc dữ liệu
const filteredItems = computed(() => {
  let items = allWords.value;
  if (search.value) {
    const query = search.value.toLowerCase();
    items = items.filter(
      (w) =>
        w.word.toLowerCase().includes(query) ||
        w.meaning.toLowerCase().includes(query)
    );
  }
  return items;
});

const pageCount = computed(() =>
  Math.ceil(filteredItems.value.length / itemsPerPage)
);

// Dialogs & trạng thái
const detailDialog = ref(false);
const selectedWord = ref(null);
const confirmDialog = ref(false);
const wordToDelete = ref(null);
const snackbar = ref({ show: false, text: "", color: "success" });

// Xem chi tiết
function viewDetail(word) {
  selectedWord.value = word;
  detailDialog.value = true;
}

// Đánh dấu quan trọng
function toggleImportant(word) {
  word.important = !word.important;
  showSnackbar(
    word.important ? "Đã đánh dấu quan trọng!" : "Đã bỏ đánh dấu quan trọng.",
    word.important ? "error" : "info"
  );
}

// Xoá
function confirmDelete(word) {
  wordToDelete.value = word;
  confirmDialog.value = true;
}
function deleteWord() {
  allWords.value = allWords.value.filter((w) => w.id !== wordToDelete.value.id);
  showSnackbar("Đã xoá!", "success");
  confirmDialog.value = false;
}

// Snackbar
function showSnackbar(text, color = "success") {
  snackbar.value.text = text;
  snackbar.value.color = color;
  snackbar.value.show = true;
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
</style>
