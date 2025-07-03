<template>
  <v-container fluid>
    <v-card class="main-content-card" elevation="2" rounded="lg">
      <div class="d-flex align-center justify-space-between px-6 pt-6 pb-2">
        <v-text-field
          v-model="search"
          placeholder="🔍Tìm kiếm theo tên truyện, số chương..."
          prepend-inner-icon="mdi-magnify"
          variant="solo"
          rounded="xl"
          density="comfortable"
          hide-details
          class="search-input-vocab vocab-search-bar"
          style="max-width: 400px; height: 48px"
          @keyup.enter="page = 1"
          clearable
        />
        <v-btn
          class="add-new-btn-manga"
          color="primary"
          @click="openDialog()"
          size="large"
          rounded
          elevation="1"
        >
          <span style="font-size: 18px; margin-right: 6px">➕</span>
          Thêm chương mới
        </v-btn>
      </div>
      <v-table
        class="manga-table"
        density="comfortable"
        style="margin-top: 8px"
      >
        <thead>
          <tr>
            <th class="header-cell text-center" style="width: 56px">STT</th>
            <th class="header-cell text-center">Tên truyện</th>
            <th class="header-cell text-center">Số chương</th>
            <th class="header-cell text-center">Cấp độ</th>
            <th class="header-cell text-center">Số trang</th>
            <th class="header-cell text-center">Trạng thái</th>
            <th class="header-cell text-center">Cập nhật</th>
            <th class="header-cell text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in pagedChapters" :key="item.id">
            <td class="text-center">
              {{ (page - 1) * itemsPerPage + idx + 1 }}
            </td>
            <td class="text-center font-weight-600">{{ item.mangaTitle }}</td>
            <td class="text-center">{{ item.chapterNumber }}</td>
            <td class="text-center">
              <span
                class="level-chip-vocab"
                :style="{
                  background: getLevelBgColor(item.level),
                  color: getLevelTextColor(item.level),
                }"
              >
                {{ item.level }}
              </span>
            </td>
            <td class="text-center">
              <span>{{ item.pages.length }}</span>
              <v-tooltip text="Thêm phụ đề song ngữ">
                <template #activator="{ props }">
                  <v-btn
                    icon
                    size="x-small"
                    color="primary"
                    @click="openSubtitleDialog(item)"
                    style="margin-left: 4px; background: #e3f2fd"
                    v-bind="props"
                  >
                    <span style="font-size: 16px">🌐</span>
                  </v-btn>
                </template>
              </v-tooltip>
            </td>
            <td class="text-center">
              <span
                class="status-chip-vocab"
                :style="{
                  background: getStatusBgColor(item.status),
                  color: getStatusTextColor(item.status),
                }"
              >
                {{ getStatusText(item.status) }}
              </span>
            </td>
            <td class="text-center">
              {{ formatDate(item.updatedAt) }}
            </td>
            <td class="text-center">
              <v-tooltip text="Duyệt chương">
                <template #activator="{ props }">
                  <v-btn
                    icon
                    class="action-btn"
                    :style="{
                      backgroundColor:
                        item.status === 'approved' ? '#bdbdbd' : '#43a047',
                      color: '#fff',
                    }"
                    :disabled="item.status === 'approved'"
                    @click="approve(item)"
                    v-bind="props"
                    >✔️</v-btn
                  >
                </template>
              </v-tooltip>
              <v-tooltip text="Từ chối chương">
                <template #activator="{ props }">
                  <v-btn
                    icon
                    class="action-btn"
                    :style="{
                      backgroundColor:
                        item.status === 'rejected' ? '#bdbdbd' : '#e53935',
                      color: '#fff',
                    }"
                    :disabled="item.status === 'rejected'"
                    @click="reject(item)"
                    v-bind="props"
                    >❌</v-btn
                  >
                </template>
              </v-tooltip>
              <v-tooltip text="Sửa chương">
                <template #activator="{ props }">
                  <v-btn
                    icon
                    class="action-btn"
                    style="background-color: #1e88e5; color: #fff"
                    @click="openDialog(item)"
                    v-bind="props"
                    >✏️</v-btn
                  >
                </template>
              </v-tooltip>
              <v-tooltip text="Xoá chương">
                <template #activator="{ props }">
                  <v-btn
                    icon
                    class="action-btn"
                    style="background-color: #e53935; color: #fff"
                    @click="confirmDelete(item)"
                    v-bind="props"
                    >🗑️</v-btn
                  >
                </template>
              </v-tooltip>
            </td>
          </tr>
        </tbody>
      </v-table>
      <div class="d-flex justify-center align-center mt-4 mb-4">
        <v-pagination
          v-model="page"
          :length="pageCount"
          :total-visible="5"
          rounded="circle"
          density="comfortable"
        ></v-pagination>
      </div>
    </v-card>

    <MangaUploadDialog
      v-model:show="dialogVisible"
      :edited-chapter="editedChapter"
      :is-saving="isSaving"
      @save="onSaveManga"
    />

    <SubtitleDialog
      v-model:show="subtitleDialogVisible"
      :chapter="selectedChapter"
      @save="onSaveSubtitle"
    />

    <ConfirmDialog
      v-model:show="confirmDialogVisible"
      title="Xác nhận xoá"
      :message="`Bạn có chắc chắn muốn xoá chương '${chapterToDelete?.mangaTitle} - Chap ${chapterToDelete?.chapterNumber}' không?`"
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
import { ref, computed, onMounted, watch } from "vue";
import MangaUploadDialog from "./MangaUploadDialog.vue";
import SubtitleDialog from "./SubtitleDialog.vue";
import ConfirmDialog from "../exercise/ConfirmDialog.vue";
import mangaService from "@/services/mangaService";

const mangaChapters = ref([]);
const loading = ref(true);
const dialogVisible = ref(false);
const subtitleDialogVisible = ref(false);
const confirmDialogVisible = ref(false);
const editedChapter = ref(null);
const selectedChapter = ref(null);
const chapterToDelete = ref(null);
const isSaving = ref(false);

const search = ref("");
const statusFilter = ref(null);
const levelFilter = ref(null);

const snackbar = ref({
  show: false,
  text: "",
  color: "success",
});

const statusOptions = [
  { title: "Chờ duyệt", value: "pending" },
  { title: "Đã duyệt", value: "approved" },
  { title: "Từ chối", value: "rejected" },
];
const levelOptions = ["N5", "N4", "N3", "N2", "N1"];

// Pagination
const page = ref(1);
const itemsPerPage = 10;
const pageCount = computed(() =>
  Math.ceil(filteredChapters.value.length / itemsPerPage)
);
const pagedChapters = computed(() => {
  const start = (page.value - 1) * itemsPerPage;
  return filteredChapters.value.slice(start, start + itemsPerPage);
});

onMounted(fetchChapters);

watch([search, statusFilter, levelFilter], () => {
  page.value = 1;
});

async function fetchChapters() {
  loading.value = true;
  try {
    mangaChapters.value = await mangaService.getMangaChapters();
  } catch {
    showSnackbar("Tải dữ liệu thất bại", "error");
  }
  loading.value = false;
}

const filteredChapters = computed(() => {
  let items = mangaChapters.value;
  if (search.value) {
    const query = search.value.toLowerCase();
    items = items.filter(
      (item) =>
        item.mangaTitle.toLowerCase().includes(query) ||
        String(item.chapterNumber).includes(query) ||
        (item.level && item.level.toLowerCase().includes(query))
    );
  }
  if (statusFilter.value) {
    items = items.filter((item) => item.status === statusFilter.value);
  }
  if (levelFilter.value) {
    items = items.filter((item) => item.level === levelFilter.value);
  }
  return items;
});

function resetFilters() {
  search.value = "";
  statusFilter.value = null;
  levelFilter.value = null;
}

function getLevelBgColor(level) {
  return (
    {
      N5: "#e3f2fd",
      N4: "#e8f5e9",
      N3: "#fffde7",
      N2: "#fce4ec",
      N1: "#ede7f6",
    }[level] || "#f5f7fa"
  );
}
function getLevelTextColor(level) {
  return (
    {
      N5: "#1976d2",
      N4: "#388e3c",
      N3: "#fbc02d",
      N2: "#d81b60",
      N1: "#512da8",
    }[level] || "#1a237e"
  );
}
function getStatusBgColor(status) {
  return (
    {
      pending: "#fff8e1",
      approved: "#e8f5e9",
      rejected: "#ffebee",
    }[status] || "#f5f7fa"
  );
}
function getStatusTextColor(status) {
  return (
    {
      pending: "#fb8c00",
      approved: "#43a047",
      rejected: "#e53935",
    }[status] || "#1a237e"
  );
}
function getStatusText(status) {
  return (
    { pending: "CHỜ DUYỆT", approved: "ĐÃ DUYỆT", rejected: "TỪ CHỐI" }[
      status
    ] || "KHÔNG RÕ"
  );
}

function openDialog(chapter = null) {
  editedChapter.value = chapter ? { ...chapter } : null;
  dialogVisible.value = true;
}

function formatDate(date) {
  if (!date) return "";
  const d = new Date(date);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

async function onSaveManga(chapter) {
  isSaving.value = true;
  try {
    const now = new Date().toISOString();
    if (chapter.id) {
      await mangaService.updateMangaChapter({ ...chapter, updatedAt: now });
      showSnackbar("Cập nhật chương thành công!", "success");
    } else {
      await mangaService.addMangaChapter({ ...chapter, updatedAt: now });
      showSnackbar("Thêm chương mới thành công!", "success");
    }
    dialogVisible.value = false;
    await fetchChapters();
  } catch {
    showSnackbar("Lưu thất bại!", "error");
  }
  isSaving.value = false;
}

function approve(chapter) {
  mangaService
    .updateMangaChapter({ ...chapter, status: "approved" })
    .then(() => {
      showSnackbar("Đã duyệt chương!", "success");
      fetchChapters();
    })
    .catch(() => showSnackbar("Duyệt thất bại!", "error"));
}

function reject(chapter) {
  mangaService
    .updateMangaChapter({ ...chapter, status: "rejected" })
    .then(() => {
      showSnackbar("Đã từ chối chương!", "success");
      fetchChapters();
    })
    .catch(() => showSnackbar("Từ chối thất bại!", "error"));
}

function confirmDelete(chapter) {
  chapterToDelete.value = chapter;
  confirmDialogVisible.value = true;
}
async function onDeleteConfirmed() {
  try {
    await mangaService.deleteMangaChapter(chapterToDelete.value.id);
    showSnackbar("Đã xoá chương!", "success");
    confirmDialogVisible.value = false;
    await fetchChapters();
  } catch {
    showSnackbar("Xoá thất bại!", "error");
  }
}

function openSubtitleDialog(chapter) {
  selectedChapter.value = chapter;
  subtitleDialogVisible.value = true;
}
async function onSaveSubtitle(updatedChapter) {
  try {
    await mangaService.updateMangaChapter(updatedChapter);
    showSnackbar("Lưu phụ đề thành công!", "success");
    subtitleDialogVisible.value = false;
    await fetchChapters();
  } catch {
    showSnackbar("Lưu phụ đề thất bại!", "error");
  }
}

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
.header-cell {
  background-color: #e3f2fd !important;
  color: #1976d2 !important;
  font-weight: 700 !important;
  text-transform: uppercase;
  font-size: 15px;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #e0e0e0;
}
.manga-table :deep(td) {
  font-size: 15px;
  vertical-align: middle;
  border-bottom: 1px solid #f0f2f5;
}
.font-weight-600 {
  font-weight: 600 !important;
}
.chip-bold {
  font-weight: 900 !important;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-size: 16px !important;
  border-radius: 8px !important;
  box-shadow: 0 1px 2px rgba(25, 118, 210, 0.04);
  padding: 0 14px !important;
  opacity: 1 !important;
}
.chip-strong {
  color: inherit !important;
  text-shadow: 0 1px 0 #fff, 0 0 1px #0002;
}
.search-input-vocab {
  background: #fff !important;
  border-radius: 24px !important;
  font-size: 16px !important;
  font-family: "Roboto", Arial, sans-serif;
  box-shadow: 0 1px 2px #0001;
}
.vocab-search-bar {
  background: #f8fafc !important;
  border-radius: 16px !important;
  font-size: 17px !important;
  font-family: "Roboto", Arial, sans-serif;
  box-shadow: 0 1px 2px #0001;
  border: 1.5px solid #e3f2fd !important;
  padding-left: 8px !important;
  min-height: 48px !important;
}
.vocab-search-bar .v-field__prepend-inner {
  margin-left: 8px !important;
}
.level-chip-vocab {
  display: inline-block;
  min-width: 38px;
  padding: 2px 12px;
  border-radius: 16px;
  font-size: 15px;
  font-weight: 700;
  font-family: "Roboto", Arial, sans-serif;
  text-align: center;
  background: #e3f2fd;
  color: #1976d2;
  letter-spacing: 0.2px;
}
.status-chip-vocab {
  display: inline-block;
  min-width: 70px;
  padding: 2px 14px;
  border-radius: 16px;
  font-size: 15px;
  font-weight: 700;
  font-family: "Roboto", Arial, sans-serif;
  text-align: center;
  background: #e8f5e9;
  color: #43a047;
  letter-spacing: 0.2px;
}
.add-new-btn {
  font-weight: 600;
  text-transform: none;
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
.action-btn {
  border-radius: 8px !important;
  margin: 0 2px !important;
  min-width: 32px !important;
  min-height: 32px !important;
  width: 32px !important;
  height: 32px !important;
  transition: background 0.2s;
}
.action-btn:hover {
  filter: brightness(1.1);
}
.manga-table :deep(tr:hover) {
  background-color: #f5f9ff !important;
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
  font-family: "Roboto", Arial, sans-serif !important;
}
.v-pagination .v-btn--active {
  background: #bbdefb !important;
  color: #1976d2 !important;
}
</style>
