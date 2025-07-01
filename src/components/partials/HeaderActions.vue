<template>
  <v-row align="center" class="mb-6 header-actions-row">
    <v-col cols="12" md="8">
      <h1 class="text-h4 font-weight-bold page-title">
        <span class="mr-3 text-h4">📖</span>
        Quản Lý Từ Vựng Tiếng Nhật
      </h1>
      <p class="text-subtitle-1 text-grey-darken-1 pl-10">Quản lý và chỉnh sửa từ vựng cho ứng dụng học tiếng Nhật</p>
    </v-col>
    <v-col cols="12" md="4" class="d-flex justify-end">
      <v-btn color="primary" class="mr-2" @click="handleImport">📤 Import</v-btn>
      <v-btn color="success" class="mr-2" @click="handleExport">📥 Export</v-btn>
      <v-btn color="blue-darken-2" @click="addNewVocabulary">➕ Thêm Từ Vựng</v-btn>
    </v-col>
  </v-row>
</template>

<script setup>
const emit = defineEmits(['import', 'export', 'add-new']);

const handleImport = () => {
  emit('import');
};

const handleExport = () => {
  emit('export');
};

const addNewVocabulary = () => {
  emit('add-new');
};
</script>

<style scoped>
.header-actions-row {
  /* No specific styling needed here if using global Vuetify styles or parent's theme */
}

.page-title {
  color: #333333;
  font-size: 2.2rem !important;
  display: flex; /* Đảm bảo icon và chữ thẳng hàng */
  align-items: center; /* Căn giữa theo chiều dọc */
}

.page-title .text-h4 {
    line-height: 1; /* Điều chỉnh chiều cao dòng của emoji */
}

.text-grey-darken-1 {
  color: #666666 !important;
}

/* Các style chung từ VocabularyManagementView.vue (nếu cần) */
.vocabulary-management-dashboard {
  background-color: #F0F2F5;
  min-height: calc(100vh - 64px);
}

.dashboard-card {
  background-color: #FFFFFF !important;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  border: 1px solid #E0E0E0;
}
</style>