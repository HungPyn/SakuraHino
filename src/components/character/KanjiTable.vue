<template>
  <div>
    <div class="kanji-header">
      <h2>Bảng Kanji</h2>
      <button @click="openForm(null)" class="btn-primary">
        <i class="bi bi-plus-circle-fill"></i> Thêm Kanji
      </button>
    </div>

    <div class="toolbar-container">
      <div class="search-and-filter-bar">
        <div class="search-bar">
          <i class="bi bi-search search-icon"></i>
          <input type="text" v-model="searchQuery" placeholder="Tìm kiếm theo ký tự, ý nghĩa..." class="search-input" />
        </div>
        <div class="filter-group">
          <label for="status-filter">Trạng thái:</label>
          <select id="status-filter" v-model="filters.status" class="form-select">
            <option value="">Tất cả</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>
    </div>

    <div class="table-card">
      <div class="table-responsive">
        <table class="kanji-table">
          <thead>
            <tr>
              <th>Ký tự Kanji</th>
              <th>Ý nghĩa</th>
              <th>Trạng thái</th>
              <th>Audio</th>
              <th class="text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="k in filteredKanji" :key="k.id">
              <td class="kanji-char">{{ k.japaneseCharacter }}</td>
              <td>{{ k.meaning }}</td>
              <td><span :class="['status-badge', 'status-' + k.status.toLowerCase()]">{{ k.status }}</span></td>
              <td>
                <a :href="k.audioURL" target="_blank" v-if="k.audioURL">
                  <i class="bi bi-volume-up-fill audio-icon"></i>
                </a>
              </td>
              <td class="action-buttons text-center">
                <button class="btn-action btn-edit" @click="openForm(k)" title="Sửa">
                  <i class="bi bi-pencil"></i>
                </button>
                <button class="btn-action btn-delete" @click="confirmDelete(k.id)" title="Xóa">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showForm" class="form-modal-overlay">
      <div class="form-modal-content">
        <KanjiForm
          :data="selectedKanji"
          @save="saveKanji"
          @cancel="showForm = false"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { getAllKanji, addKanji, updateKanji, deleteKanji } from "@/services/alphabetService.js";
import KanjiForm from "./KanjiForm.vue";
import Swal from 'sweetalert2';

const kanjiList = ref(getAllKanji());
const showForm = ref(false);
const selectedKanji = ref(null);
const searchQuery = ref('');
const filters = ref({
  status: ''
});

const filteredKanji = computed(() => {
  let list = kanjiList.value;
  const query = searchQuery.value.toLowerCase().trim();

  if (query) {
    list = list.filter(k =>
      k.japaneseCharacter.toLowerCase().includes(query) ||
      k.meaning.toLowerCase().includes(query)
    );
  }

  if (filters.value.status) {
    list = list.filter(k => k.status === filters.value.status);
  }

  return list;
});

const openForm = (kanji) => {
  selectedKanji.value = kanji ? { ...kanji } : null;
  showForm.value = true;
};

const saveKanji = (data) => {
  if (data.id) {
    updateKanji(data.id, data);
    Swal.fire('Cập nhật thành công!', '', 'success');
  } else {
    addKanji(data);
    Swal.fire('Thêm mới thành công!', '', 'success');
  }
  kanjiList.value = getAllKanji();
  showForm.value = false;
};

const confirmDelete = (id) => {
  Swal.fire({
    title: 'Bạn có chắc chắn muốn xóa?',
    text: "Không thể hoàn tác hành động này!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Đồng ý, xóa!'
  }).then((result) => {
    if (result.isConfirmed) {
      deleteKanji(id);
      kanjiList.value = getAllKanji();
      Swal.fire('Đã xóa!', 'Kanji đã được xóa.', 'success');
    }
  });
};
</script>

<style scoped>
.kanji-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}
.kanji-header h2 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin: 0;
  font-weight: 600;
}
.btn-primary {
  background-color: #2ecc71;
  color: white;
  border: none;
  padding: 12px 25px; /* Lớn hơn */
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
.btn-primary:hover {
  background-color: #27ae60;
  transform: translateY(-2px);
  box-shadow: 0 6px 10px rgba(0,0,0,0.15);
}
.toolbar-container {
  margin-bottom: 25px;
  padding: 20px;
  background-color: #f0f4f8;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
.search-and-filter-bar {
  display: flex;
  gap: 20px;
  align-items: center;
}
.search-bar {
  position: relative;
  flex-grow: 1;
}
.search-input {
  width: 100%;
  padding: 12px 12px 12px 45px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}
.search-input:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}
.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #95a5a6;
  font-size: 1.2rem;
}
.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}
.filter-group label {
  font-weight: 500;
  color: #34495e;
}
.form-select {
  padding: 12px 15px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  font-size: 1rem;
  background-color: white;
}
.table-card {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}
.kanji-table {
  width: 100%;
  border-collapse: collapse;
}
.kanji-table th, .kanji-table td {
  padding: 18px; /* Tăng padding */
  border-bottom: 1px solid #eef2f9; /* Màu đường viền nhẹ hơn */
  text-align: left;
}
.kanji-table th {
  background-color: #f7f9fc;
  font-weight: 600;
  color: #7f8c8d;
  text-transform: uppercase;
  font-size: 0.9rem;
}
.kanji-char {
  font-size: 1.8rem;
  font-weight: bold;
  color: #34495e;
}
.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
}
.status-active { background-color: #2ecc71; }
.status-inactive { background-color: #e74c3c; }
.status-draft { background-color: #f39c12; }
.audio-icon {
  font-size: 1.5rem;
  color: #3498db;
  transition: all 0.3s ease;
}
.audio-icon:hover {
  color: #2980b9;
  transform: scale(1.1);
}
.action-buttons {
  white-space: nowrap;
}
.btn-action {
  width: 40px; /* To hơn */
  height: 40px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  margin: 0 4px;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}
.btn-edit { background-color: #eaf3ff; color: #3498db; }
.btn-edit:hover { background-color: #d6e9ff; transform: scale(1.1) rotate(5deg); }
.btn-delete { background-color: #fdecea; color: #e74c3c; }
.btn-delete:hover { background-color: #f9d6d2; transform: scale(1.1) rotate(-5deg); }
.form-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.form-modal-content {
  background: white;
  padding: 30px;
  border-radius: 15px; /* Bo tròn hơn */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 550px;
}
</style>