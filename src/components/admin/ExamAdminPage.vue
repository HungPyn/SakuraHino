<template>
  <div class="admin-page-container">
    <div class="page-header">
      <h1 class="page-title">
        <i class="bi bi-file-earmark-bar-graph icon"></i> Quản lý Kết quả Thi
      </h1>
    </div>
    
    <div class="toolbar-container">
      <div class="filter-group">
        <div class="search-bar">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Tìm kiếm theo tên người dùng..."
            class="search-input"
          />
          <i class="bi bi-search search-icon"></i>
        </div>
        <div class="topic-filter">
          <label for="topic-filter" class="filter-label">Chủ đề:</label>
          <select id="topic-filter" v-model.number="selectedTopicId" class="form-select">
            <option :value="null">Tất cả chủ đề</option>
            <option v-for="t in topics" :key="t.id" :value="t.id">{{ t.name }}</option>
          </select>
        </div>
      </div>
    </div>
    
    <div class="table-card">
      <div class="table-responsive">
        <table class="exam-table">
          <thead>
            <tr>
              <th>Người dùng</th>
              <th>Kỳ thi</th>
              <th>Chủ đề</th>
              <th>Điểm số</th>
              <th>Ngày hoàn thành</th>
              <th class="text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="result in filteredResults" :key="result.id">
              <td>{{ result.userName }}</td>
              <td>{{ result.examName }}</td>
              <td>
                <span :class="['badge', getTopicClass(result.topicName)]">{{ result.topicName }}</span>
              </td>
              <td><span class="score-badge">{{ result.score }}</span></td>
              <td>{{ result.completionDate }}</td>
              <td class="action-buttons text-center">
                <button class="btn-action btn-detail" @click="viewDetail(result)" title="Chi tiết">
                  <i class="bi bi-eye"></i>
                </button>
                <button class="btn-action btn-delete" @click="confirmDelete(result.id)" title="Xóa">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showDetailModal" class="form-modal-overlay">
      <div class="form-modal-content">
        <UserExamDetail
          :examResult="selectedResult"
          @close="showDetailModal = false"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { getAllExamResults, getAllUsers, getAllExams, getAllTopics, deleteExamResult } from "@/services/examService.js";
import Swal from 'sweetalert2';
import UserExamDetail from "../exam/UserExamDetail.vue";

// State
const examResults = ref(getAllExamResults());
const users = ref(getAllUsers());
const exams = ref(getAllExams());
const topics = ref(getAllTopics());
const searchQuery = ref('');
const selectedTopicId = ref(null);
const showDetailModal = ref(false);
const selectedResult = ref(null);

// Computed Properties để kết hợp dữ liệu từ các bảng
const combinedResults = computed(() => {
  return examResults.value.map(result => {
    const user = users.value.find(u => u.id === result.userId);
    const exam = exams.value.find(e => e.id === result.examId);
    const topic = exam ? topics.value.find(t => t.id === exam.topicId) : null;
    return {
      ...result,
      userName: user ? user.fullName : 'N/A',
      examName: exam ? exam.name : 'N/A',
      topicId: exam ? exam.topicId : null,
      topicName: topic ? topic.name : 'N/A'
    };
  });
});

const filteredResults = computed(() => {
  let results = combinedResults.value;
  
  // Lọc theo tên người dùng
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    results = results.filter(r => r.userName.toLowerCase().includes(query));
  }
  
  // Lọc theo chủ đề
  if (selectedTopicId.value !== null) {
    results = results.filter(r => r.topicId === selectedTopicId.value);
  }

  return results;
});

// Methods
const viewDetail = (result) => {
  selectedResult.value = result;
  showDetailModal.value = true;
};

const confirmDelete = (id) => {
  Swal.fire({
    title: 'Bạn có chắc chắn muốn xóa?',
    text: "Hành động này sẽ xóa kết quả thi của người dùng!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Đồng ý, xóa!'
  }).then((result) => {
    if (result.isConfirmed) {
      remove(id);
    }
  });
};

const remove = (id) => {
  try {
    deleteExamResult(id);
    examResults.value = getAllExamResults();
    Swal.fire('Đã xóa!', 'Kết quả đã được xóa thành công.', 'success');
  } catch (error) {
    Swal.fire('Lỗi!', 'Đã xảy ra lỗi khi xóa.', 'error');
  }
};

const getTopicClass = (topicName) => {
  switch (topicName) {
    case 'Ngữ pháp': return 'badge-grammar';
    case 'Từ vựng': return 'badge-vocabulary';
    case 'Nghe hiểu': return 'badge-listening';
    case 'Kanji': return 'badge-kanji';
    case 'Đọc hiểu': return 'badge-reading';
    default: return 'badge-default';
  }
};
</script>

<style scoped>
.admin-page-container { padding: 30px; background-color: #f5f7fa; min-height: 100vh; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
.page-title { font-size: 2.2rem; font-weight: 600; color: #2c3e50; display: flex; align-items: center; gap: 10px; }
.icon { font-size: 1.8rem; color: #3498db; }
.toolbar-container { margin-bottom: 25px; padding: 15px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); }
.filter-group { display: flex; gap: 20px; align-items: center; }
.search-bar { position: relative; width: 300px; }
.search-input { width: 100%; padding: 10px 15px 10px 40px; border: 1px solid #e0e6ed; border-radius: 8px; }
.search-icon { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #95a5a6; }
.topic-filter { display: flex; align-items: center; gap: 10px; }
.filter-label { font-weight: 500; color: #34495e; }
.form-select { padding: 10px 15px; border: 1px solid #e0e6ed; border-radius: 8px; font-size: 1rem; color: #34495e; background-color: #fcfdfe; appearance: none; background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%2334495e' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e"); background-repeat: no-repeat; background-position: right 15px center; background-size: 10px; cursor: pointer; }
.table-card { background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); overflow: hidden; margin-top: 25px; }
.table-responsive { overflow-x: auto; }
.exam-table { width: 100%; border-collapse: separate; border-spacing: 0; font-size: 0.95rem; color: #34495e; }
.exam-table th, .exam-table td { padding: 16px; border-bottom: 1px solid #e0e6ed; transition: background-color 0.3s ease; }
.exam-table th { background-color: #f0f3f8; font-weight: 600; color: #7f8c8d; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.5px; }
.exam-table tbody tr:nth-child(odd) { background-color: #fcfdfe; }
.exam-table tbody tr:hover { background-color: #f3f6f9; }
.text-center { text-align: center; }
.badge { padding: 6px 14px; border-radius: 50px; font-weight: 600; font-size: 0.8rem; color: white; min-width: 100px; text-align: center; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); display: inline-block; }
.score-badge { padding: 5px 10px; background-color: #3498db; color: white; border-radius: 5px; font-weight: bold; }
/* Badge colors */
.badge-grammar { background-color: #9b59b6; }
.badge-vocabulary { background-color: #f39c12; }
.badge-listening { background-color: #e74c3c; }
.badge-kanji { background-color: #1abc9c; }
.badge-reading { background-color: #3498db; }
.badge-default { background-color: #7f8c8d; }
.action-buttons { white-space: nowrap; }
.btn-action { width: 36px; height: 36px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; border: none; cursor: pointer; margin: 0 4px; font-size: 1rem; transition: all 0.3s ease; }
.btn-detail { background-color: #eaf3ff; color: #3498db; }
.btn-detail:hover { background-color: #d6e9ff; transform: scale(1.1); }
.btn-delete { background-color: #fdecea; color: #e74c3c; }
.btn-delete:hover { background-color: #f9d6d2; transform: scale(1.1); }
.form-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.6); display: flex; justify-content: center; align-items: center; z-index: 1000; }
.form-modal-content { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2); width: 90%; max-width: 600px; }
</style>