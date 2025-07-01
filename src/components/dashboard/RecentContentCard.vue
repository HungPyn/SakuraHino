<template>
  <div class="card recent-content-card">
    <div class="card-header">
      <h2 class="card-title">Nội dung mới nhất</h2>
      <div class="actions">
        <button class="btn btn-default type-filter">
          Tất cả loại
          <font-awesome-icon icon="fas fa-chevron-down" class="ml-2 text-xs" />
        </button>
        <button class="btn btn-primary add-new-btn">
          <font-awesome-icon icon="fas fa-plus" />
          Thêm mới
        </button>
      </div>
    </div>

    <div class="table-responsive">
      <table class="content-table">
        <thead>
          <tr>
            <th>Tiêu đề</th>
            <th>Loại</th>
            <th>Cấp độ</th>
            <th>Tác giả</th>
            <th>Ngày tạo</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in paginatedContent" :key="index">
            <td>
              <div class="title-cell">
                <font-awesome-icon :icon="item.icon" class="title-icon" :style="{ color: item.iconColor }" />
                {{ item.title }}
              </div>
            </td>
            <td>{{ item.type }}</td>
            <td>
              <span class="tag" :class="getLevelTagClass(item.level)">{{ item.level }}</span>
            </td>
            <td>{{ item.author }}</td>
            <td>{{ item.date }}</td>
            <td>
              <span class="tag" :class="getStatusTagClass(item.status)">{{ item.status }}</span>
            </td>
            <td>
              <div class="action-buttons">
                <button class="action-btn edit-btn">
                  <font-awesome-icon icon="fas fa-edit" />
                </button>
                <button class="action-btn delete-btn">
                  <font-awesome-icon icon="fas fa-trash-alt" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="table-footer">
      <span class="pagination-info">Hiển thị {{ startIndex }} đến {{ endIndex }} trong tổng số {{ totalContent }} mục</span>
      <div class="pagination-controls">
        <button class="pagination-btn" :disabled="currentPage === 1" @click="prevPage">Trước</button>
        <button
          v-for="page in totalPages"
          :key="page"
          class="pagination-btn"
          :class="{ active: currentPage === page }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
        <button class="pagination-btn" :disabled="currentPage === totalPages" @click="nextPage">Sau</button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';

export default defineComponent({
  name: 'RecentContentCard',
  setup() {
    const allContent = ref([
      {
        icon: 'fas fa-book',
        iconColor: '#2196F3',
        title: 'Từ vựng chủ đề Du lịch N4',
        type: 'Từ vựng',
        level: 'N4',
        author: 'Trần Thị B',
        date: '18/06/2025',
        status: 'Đã xuất bản',
      },
      {
        icon: 'fas fa-headphones-alt',
        iconColor: '#FFC107',
        title: 'Bài nghe: Hội thoại tại nhà hàng',
        type: 'Bài nghe',
        level: 'N5',
        author: 'Lê Văn C',
        date: '17/06/2025',
        status: 'Đã xuất bản',
      },
      {
        icon: 'fas fa-pencil-alt',
        iconColor: '#4CAF50',
        title: 'Ngữ pháp: Thể điều kiện',
        type: 'Ngữ pháp',
        level: 'N3',
        author: 'Nguyễn Thị D',
        date: '16/06/2025',
        status: 'Bản nháp',
      },
      {
        icon: 'fas fa-file-signature',
        iconColor: '#FF9800',
        title: 'Đề thi thử JLPT N2 - Tháng 6/2025',
        type: 'Đề thi',
        level: 'N2',
        author: 'Phạm Văn E',
        date: '15/06/2025',
        status: 'Đang xét duyệt',
      },
      {
        icon: 'fas fa-comments',
        iconColor: '#F44336',
        title: 'Manga: Cuộc sống hàng ngày - Tập 1',
        type: 'Manga',
        level: 'N4-N3',
        author: 'Hoàng Thị F',
        date: '14/06/2025',
        status: 'Bị từ chối',
      },
      {
        icon: 'fas fa-language',
        iconColor: '#2196F3',
        title: 'Từ vựng chủ đề Gia đình N5',
        type: 'Từ vựng',
        level: 'N5',
        author: 'Trần Thị B',
        date: '13/06/2025',
        status: 'Đã xuất bản',
      },
      {
        icon: 'fas fa-book-reader',
        iconColor: '#4CAF50',
        title: 'Bài giảng: Các thể của động từ',
        type: 'Ngữ pháp',
        level: 'N4',
        author: 'Nguyễn Thị D',
        date: '12/06/2025',
        status: 'Đã xuất bản',
      },
      {
        icon: 'fas fa-dumbbell',
        iconColor: '#FFC107',
        title: 'Bài tập: Luyện tập Hán tự N3',
        type: 'Bài tập',
        level: 'N3',
        author: 'Lê Văn C',
        date: '11/06/2025',
        status: 'Bản nháp',
      },
      {
        icon: 'fas fa-headphones-alt',
        iconColor: '#FF9800',
        title: 'Bài nghe: Tin tức hàng ngày',
        type: 'Bài nghe',
        level: 'N2',
        author: 'Phạm Văn E',
        date: '10/06/2025',
        status: 'Đang xét duyệt',
      },
      {
        icon: 'fas fa-comments',
        iconColor: '#F44336',
        title: 'Manga: Du học sinh - Tập 2',
        type: 'Manga',
        level: 'N3',
        author: 'Hoàng Thị F',
        date: '09/06/2025',
        status: 'Bị từ chối',
      },
    ]);

    const itemsPerPage = 5;
    const currentPage = ref(1);

    const totalContent = computed(() => allContent.value.length);
    const totalPages = computed(() => Math.ceil(totalContent.value / itemsPerPage));

    const paginatedContent = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return allContent.value.slice(start, end);
    });

    const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage + 1);
    const endIndex = computed(() => Math.min(currentPage.value * itemsPerPage, totalContent.value));

    const goToPage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
      }
    };

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    };

    const getStatusTagClass = (status) => {
      switch (status) {
        case 'Đã xuất bản':
          return 'tag-status-active';
        case 'Bản nháp':
          return 'tag-status-pending';
        case 'Đang xét duyệt':
          return 'tag-status-review';
        case 'Bị từ chối':
          return 'tag-status-blocked';
        default:
          return '';
      }
    };

    const getLevelTagClass = (level) => {
      switch (level) {
        case 'N5':
          return 'tag-level-n5';
        case 'N4':
          return 'tag-level-n4';
        case 'N3':
          return 'tag-level-n3';
        case 'N2':
          return 'tag-level-n2';
        case 'N1':
          return 'tag-level-n1';
        case 'N4-N3': // For mixed levels, pick one that visually fits
          return 'tag-level-n3'; // Example: using N3 color for N4-N3
        default:
          return '';
      }
    };

    return {
      allContent,
      paginatedContent,
      currentPage,
      totalPages,
      totalContent,
      startIndex,
      endIndex,
      goToPage,
      prevPage,
      nextPage,
      getStatusTagClass,
      getLevelTagClass,
    };
  },
});
</script>

<style scoped>
.recent-content-card {
  grid-column: span 2; /* Occupy 2 columns in a grid */
  box-shadow: 0 4px 12px var(--shadow-light);
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 0;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.type-filter {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  border-radius: var(--border-radius-button);
  background-color: var(--button-default-bg);
  color: var(--text-dark);
  font-size: 15px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.type-filter:hover {
  background-color: var(--button-hover-bg);
}

.add-new-btn {
  padding: 10px 15px;
  font-size: 15px;
}

.table-responsive {
  width: 100%;
  overflow-x: auto; /* Enable horizontal scrolling for table if content overflows */
  flex-grow: 1; /* Allows table to grow and fill available space */
  margin-bottom: 20px;
}

.content-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 700px; /* Minimum width to prevent squishing on smaller screens */
}

.content-table th,
.content-table td {
  padding: 15px 10px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
  font-size: 14px;
  color: var(--text-dark);
}

.content-table th {
  color: var(--text-medium);
  font-weight: 600;
  white-space: nowrap; /* Prevents header text wrapping */
}

.content-table tbody tr:last-child td {
  border-bottom: none; /* No bottom border for the last row */
}

.title-cell {
  display: flex;
  align-items: center;
  font-weight: 500;
}

.title-icon {
  font-size: 16px;
  margin-right: 10px;
  width: 20px; /* Fixed width for icon alignment */
  text-align: center;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: var(--border-radius-circle);
  background-color: var(--background-light);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  color: var(--text-medium);
  transition: background-color 0.2s, color 0.2s;
}

.action-btn:hover {
  background-color: var(--border-color);
  color: var(--primary-color);
}

.delete-btn:hover {
  color: var(--status-blocked-bg); /* Red color for delete on hover */
}

.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  flex-wrap: wrap;
  gap: 15px;
}

.pagination-info {
  font-size: 14px;
  color: var(--text-medium);
}

.pagination-controls {
  display: flex;
  gap: 5px;
}

.pagination-btn {
  padding: 8px 14px;
  border-radius: var(--border-radius-button);
  background-color: var(--button-default-bg);
  color: var(--text-dark);
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s, color 0.2s;
}

.pagination-btn:hover:not(:disabled),
.pagination-btn.active {
  background-color: var(--primary-color);
  color: var(--text-white);
}

.pagination-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .card-title {
    font-size: 17px;
  }
  .type-filter, .add-new-btn {
    padding: 8px 12px;
    font-size: 14px;
  }
  .content-table th, .content-table td {
    padding: 12px 8px;
    font-size: 13px;
  }
  .title-icon {
    font-size: 15px;
    margin-right: 8px;
  }
  .action-btn {
    width: 30px;
    height: 30px;
    font-size: 14px;
  }
  .pagination-info {
    font-size: 13px;
  }
  .pagination-btn {
    padding: 7px 12px;
    font-size: 13px;
  }
}

@media (max-width: 992px) {
  .recent-content-card {
    grid-column: span 1; /* Occupy single column on smaller screens */
  }
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  .card-title {
    margin-bottom: 5px;
  }
  .actions {
    width: 100%;
    justify-content: flex-start;
  }
  .table-footer {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
}

@media (max-width: 768px) {
  .card-title {
    font-size: 16px;
  }
  .type-filter, .add-new-btn {
    padding: 7px 10px;
    font-size: 13px;
  }
  .content-table {
    min-width: 600px; /* Reduce min-width further */
  }
  .content-table th, .content-table td {
    padding: 10px 6px;
    font-size: 12px;
  }
  .pagination-info {
    font-size: 12px;
  }
  .pagination-btn {
    padding: 6px 10px;
    font-size: 12px;
  }
}
</style>




<!-- 
<template>
  <div class="card recent-content-card">
    <div class="card-header">
      <h2 class="card-title">✨ Nội dung mới nhất</h2>
      <div class="actions">
        <v-menu offset-y>
          <template v-slot:activator="{ props }">
            <button class="btn btn-default type-filter" v-bind="props">
              {{ selectedTypeFilter === 'Tất cả loại' ? 'Tất cả loại' : selectedTypeFilter }}
              <span class="ml-2 text-xs">🔽</span>
            </button>
          </template>
          <v-list class="filter-dropdown-list">
            <v-list-item
              v-for="(type, index) in contentTypes"
              :key="index"
              @click="selectTypeFilter(type)"
              :class="{ 'v-list-item--active': selectedTypeFilter === type }"
            >
              <v-list-item-title>{{ type }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        </div>
    </div>

    <div class="table-responsive">
      <table class="content-table">
        <thead>
          <tr>
            <th style="width: 25%;">Tiêu đề</th>
            <th style="width: 12%;">Loại</th>
            <th style="width: 10%;">Cấp độ</th>
            <th style="width: 15%;">Tác giả</th>
            <th style="width: 13%;">Ngày tạo</th>
            <th style="width: 15%;">Trạng thái</th>
            <th style="width: 10%;">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in paginatedContent" :key="item.id || index">
            <td>
              <div class="title-cell">
                <span class="title-icon" :style="{ color: item.iconColor }">
                    <template v-if="item.icon === 'fas fa-book'">📚</template>
                    <template v-else-if="item.icon === 'fas fa-headphones-alt'">🎧</template>
                    <template v-else-if="item.icon === 'fas fa-pencil-alt'">✏️</template>
                    <template v-else-if="item.icon === 'fas fa-file-signature'">📝</template>
                    <template v-else-if="item.icon === 'fas fa-comments'">💬</template>
                    <template v-else-if="item.icon === 'fas fa-language'">🗣️</template>
                    <template v-else-if="item.icon === 'fas fa-book-reader'">📖</template>
                    <template v-else-if="item.icon === 'fas fa-dumbbell'">💪</template>
                    <template v-else>📄</template>
                </span>
                {{ item.title }}
              </div>
            </td>
            <td>{{ item.type }}</td>
            <td>
              <div class="level-cell-content">
                <span class="tag" :class="getLevelTagClass(item.level)">{{ item.level }}</span>
              </div>
            </td>
            <td>{{ item.author }}</td>
            <td>{{ item.date }}</td>
            <td>
              <div class="status-cell-content">
                <span class="tag" :class="getStatusTagClass(item.status)">{{ item.status }}</span>
              </div>
            </td>
            <td>
              <div class="action-buttons">
                <button class="action-btn edit-btn" @click="openDialog(item)">
                  <span>✏️</span> </button>
                <button class="action-btn delete-btn" @click="deleteItem(item)">
                  <span>🗑️</span> </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="table-footer">
      <span class="pagination-info">Hiển thị {{ startIndex }} đến {{ endIndex }} trong tổng số {{ totalContent }} mục</span>
      <div class="pagination-controls">
        <button class="pagination-btn" :disabled="currentPage === 1" @click="prevPage">Trước</button>
        <button
          v-for="page in totalPages"
          :key="page"
          class="pagination-btn"
          :class="{ active: currentPage === page }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
        <button class="pagination-btn" :disabled="currentPage === totalPages" @click="nextPage">Sau</button>
      </div>
    </div>

    <v-dialog v-model="dialog" max-width="700px" transition="dialog-bottom-transition" persistent>
      <v-card class="rounded-xl elevation-8 crud-dialog-card">
        <v-toolbar color="blue-darken-2" dark flat class="rounded-t-xl dialog-toolbar">
          <v-toolbar-title class="text-h6 font-weight-bold pl-3">
            <span class="dialog-title-icon mr-2">📚</span> {{ dialogTitle }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="closeDialog" class="close-dialog-btn">
            <span class="text-h6">❌</span>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pa-6 dialog-content">
          <v-form ref="formRef" @submit.prevent="saveItem">
            <v-text-field
              label="Tiêu đề nội dung"
              v-model="editedItem.title"
              variant="outlined"
              class="rounded-lg mb-4"
              density="comfortable"
              :rules="[v => !!v || 'Tiêu đề là bắt buộc']"
            ></v-text-field>

            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  label="Loại"
                  v-model="editedItem.type"
                  :items="['Từ vựng', 'Ngữ pháp', 'Bài nghe', 'Đề thi', 'Bài tập', 'Manga', 'Khác']"
                  variant="outlined"
                  class="rounded-lg mb-4"
                  density="comfortable"
                  :rules="[v => !!v || 'Loại là bắt buộc']"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  label="Cấp độ"
                  v-model="editedItem.level"
                  :items="['N5', 'N4', 'N3', 'N2', 'N1', 'N4-N3', 'Tất cả']"
                  variant="outlined"
                  class="rounded-lg mb-4"
                  density="comfortable"
                  :rules="[v => !!v || 'Cấp độ là bắt buộc']"
                ></v-select>
              </v-col>
            </v-row>

            <v-text-field
              label="Tác giả"
              v-model="editedItem.author"
              variant="outlined"
              class="rounded-lg mb-4"
              density="comfortable"
              :rules="[v => !!v || 'Tác giả là bắt buộc']"
            ></v-text-field>

            <v-text-field
              label="Ngày tạo (DD/MM/YYYY)"
              v-model="editedItem.date"
              variant="outlined"
              class="rounded-lg mb-4"
              density="comfortable"
              placeholder="VD: 01/01/2025"
              :rules="[v => !!v || 'Ngày tạo là bắt buộc', v => /^\d{2}\/\d{2}\/\d{4}$/.test(v) || 'Định dạng ngày DD/MM/YYYY']"
            ></v-text-field>

            <v-select
              label="Trạng thái"
              v-model="editedItem.status"
              :items="['Đã xuất bản', 'Bản nháp', 'Đang xét duyệt', 'Bị từ chối']"
              variant="outlined"
              class="rounded-lg mb-4"
              density="comfortable"
              :rules="[v => !!v || 'Trạng thái là bắt buộc']"
            ></v-select>

          </v-form>
        </v-card-text>
        <v-card-actions class="pa-4 bg-grey-lighten-4 rounded-b-xl d-flex justify-end dialog-actions">
          <v-btn color="grey-darken-1" variant="flat" class="rounded-lg px-6 py-3" @click="closeDialog">
            Hủy
          </v-btn>
          <v-btn color="blue-darken-2" variant="elevated" class="rounded-lg px-6 py-3" @click="saveItem">
            Lưu
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="400px" transition="dialog-top-transition" persistent>
      <v-card class="rounded-xl elevation-8 confirm-dialog-card">
        <v-toolbar color="red-darken-2" dark flat class="rounded-t-xl dialog-toolbar">
          <v-toolbar-title class="text-h6 font-weight-bold pl-3">
            <span class="dialog-title-icon mr-2">⚠️</span> Xác nhận xóa
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="closeDeleteDialog" class="close-dialog-btn">
            <span class="text-h6">❌</span>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pa-6 text-center dialog-content">
          <p class="text-h6 font-weight-medium">Bạn có chắc chắn muốn xóa mục này?</p>
          <p class="text-subtitle-1 text-grey-darken-1 mt-2">Hành động này không thể hoàn tác.</p>
        </v-card-text>
        <v-card-actions class="pa-4 bg-grey-lighten-4 rounded-b-xl d-flex justify-center dialog-actions">
          <v-btn color="grey-darken-1" variant="flat" class="rounded-lg px-6 py-3" @click="closeDeleteDialog">
            Hủy bỏ
          </v-btn>
          <v-btn color="red-darken-2" variant="elevated" class="rounded-lg px-6 py-3" @click="confirmDelete">
            Xóa
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { defineComponent, ref, computed, nextTick } from 'vue';
// Import FontAwesomeIcon nếu bạn vẫn muốn dùng Font Awesome thay vì Unicode characters
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
// import { library } from '@fortawesome/fontawesome-svg-core';
// import { fas } from '@fortawesome/free-solid-svg-icons';
// library.add(fas);

export default defineComponent({
  name: 'RecentContentCard',
  // components: { FontAwesomeIcon }, // Bỏ comment nếu dùng FontAwesomeIcon
  setup() {
    const allContent = ref([
      { id: 1, icon: 'fas fa-book', iconColor: '#2196F3', title: 'Từ vựng chủ đề Du lịch N4', type: 'Từ vựng', level: 'N4', author: 'Trần Thị B', date: '18/06/2025', status: 'Đã xuất bản' },
      { id: 2, icon: 'fas fa-headphones-alt', iconColor: '#FFC107', title: 'Bài nghe: Hội thoại tại nhà hàng', type: 'Bài nghe', level: 'N5', author: 'Lê Văn C', date: '17/06/2025', status: 'Đã xuất bản' },
      { id: 3, icon: 'fas fa-pencil-alt', iconColor: '#4CAF50', title: 'Ngữ pháp: Thể điều kiện', type: 'Ngữ pháp', level: 'N3', author: 'Nguyễn Thị D', date: '16/06/2025', status: 'Bản nháp' },
      { id: 4, icon: 'fas fa-file-signature', iconColor: '#FF9800', title: 'Đề thi thử JLPT N2 - Tháng 6/2025', type: 'Đề thi', level: 'N2', author: 'Phạm Văn E', date: '15/06/2025', status: 'Đang xét duyệt' },
      { id: 5, icon: 'fas fa-comments', iconColor: '#F44336', title: 'Manga: Cuộc sống hàng ngày - Tập 1', type: 'Manga', level: 'N4-N3', author: 'Hoàng Thị F', date: '14/06/2025', status: 'Bị từ chối' },
      { id: 6, icon: 'fas fa-language', iconColor: '#2196F3', title: 'Từ vựng chủ đề Gia đình N5', type: 'Từ vựng', level: 'N5', author: 'Trần Thị B', date: '13/06/2025', status: 'Đã xuất bản' },
      { id: 7, icon: 'fas fa-book-reader', iconColor: '#4CAF50', title: 'Bài giảng: Các thể của động từ', type: 'Ngữ pháp', level: 'N4', author: 'Nguyễn Thị D', date: '12/06/2025', status: 'Đã xuất bản' },
      { id: 8, icon: 'fas fa-dumbbell', iconColor: '#FFC107', title: 'Bài tập: Luyện tập Hán tự N3', type: 'Bài tập', level: 'N3', author: 'Lê Văn C', date: '11/06/2025', status: 'Bản nháp' },
      { id: 9, icon: 'fas fa-headphones-alt', iconColor: '#FF9800', title: 'Bài nghe: Tin tức hàng ngày', type: 'Bài nghe', level: 'N2', author: 'Phạm Văn E', date: '10/06/2025', status: 'Đang xét duyệt' },
      { id: 10, icon: 'fas fa-comments', iconColor: '#F44336', title: 'Manga: Du học sinh - Tập 2', type: 'Manga', level: 'N3', author: 'Hoàng Thị F', date: '09/06/2025', status: 'Bị từ chối' },
    ]);

    // ==== Type Filter Logic ====
    const contentTypes = ref(['Tất cả loại', 'Từ vựng', 'Ngữ pháp', 'Bài nghe', 'Đề thi', 'Bài tập', 'Manga', 'Khác']);
    const selectedTypeFilter = ref('Tất cả loại'); // Mặc định là 'Tất cả loại'

    const filteredContent = computed(() => {
      if (selectedTypeFilter.value === 'Tất cả loại') {
        return allContent.value;
      }
      return allContent.value.filter(item => item.type === selectedTypeFilter.value);
    });

    const selectTypeFilter = (type) => {
      selectedTypeFilter.value = type;
      currentPage.value = 1; // Reset về trang 1 khi thay đổi bộ lọc
    };

    // ==== Pagination Logic - giờ hoạt động trên filteredContent ====
    const itemsPerPage = 5;
    const currentPage = ref(1);

    const totalContent = computed(() => filteredContent.value.length);
    const totalPages = computed(() => Math.ceil(totalContent.value / itemsPerPage));

    const paginatedContent = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return filteredContent.value.slice(start, end);
    });

    const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage + 1);
    const endIndex = computed(() => Math.min(currentPage.value * itemsPerPage, totalContent.value));

    const goToPage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
      }
    };

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    };

    // ==== Tag Class Logic ====
    const getStatusTagClass = (status) => {
      switch (status) {
        case 'Đã xuất bản': return 'tag-status-active';
        case 'Bản nháp': return 'tag-status-pending';
        case 'Đang xét duyệt': return 'tag-status-review';
        case 'Bị từ chối': return 'tag-status-blocked';
        default: return '';
      }
    };

    const getLevelTagClass = (level) => {
      switch (level) {
        case 'N5': return 'tag-level-n5';
        case 'N4': return 'tag-level-n4';
        case 'N3': return 'tag-level-n3';
        case 'N2': return 'tag-level-n2';
        case 'N1': return 'tag-level-n1';
        case 'N4-N3': return 'tag-level-n3'; // For mixed levels, pick one that visually fits
        default: return '';
      }
    };

    // ==== CRUD Logic (Popup) ====
    const dialog = ref(false);
    const deleteDialog = ref(false);
    const dialogTitle = ref('');
    const editedItem = ref(getDefaultItem());
    const itemToDelete = ref(null);
    const isEditing = ref(false);
    const formRef = ref(null); // Ref for Vuetify form validation

    function getDefaultItem() {
      return {
        id: null,
        icon: 'fas fa-book', // Default icon
        iconColor: '#2196F3', // Default color
        title: '',
        type: '',
        level: '',
        author: '',
        date: new Date().toLocaleDateString('vi-VN'), // Default to current date
        status: 'Bản nháp', // Default status
      };
    }

    // Helper to get icon and color based on type, similar to original data
    function getIconAndColorForType(type) {
      switch (type) {
        case 'Từ vựng': return { icon: 'fas fa-book', iconColor: '#2196F3' };
        case 'Ngữ pháp': return { icon: 'fas fa-pencil-alt', iconColor: '#4CAF50' };
        case 'Bài nghe': return { icon: 'fas fa-headphones-alt', iconColor: '#FFC107' };
        case 'Đề thi': return { icon: 'fas fa-file-signature', iconColor: '#FF9800' };
        case 'Bài tập': return { icon: 'fas fa-dumbbell', iconColor: '#AB47BC' };
        case 'Manga': return { icon: 'fas fa-comments', iconColor: '#F44336' };
        default: return { icon: 'fas fa-file', iconColor: '#607D8B' }; // Generic file icon
      }
    }

    const openDialog = (item) => {
      isEditing.value = true;
      dialogTitle.value = 'Chỉnh sửa Nội dung';
      editedItem.value = { ...item }; // Copy item to editedItem
      dialog.value = true;
      // Reset validation after dialog opens and content is rendered
      nextTick(() => {
        if (formRef.value) {
          formRef.value.resetValidation();
        }
      });
    };

    const closeDialog = () => {
      dialog.value = false;
      isEditing.value = false;
      editedItem.value = getDefaultItem(); // Reset form data
    };

    const saveItem = async () => {
      // Validate form if using Vuetify form components
      const { valid } = await formRef.value.validate();
      if (!valid) return;

      // Update icon and color based on type selected in dialog
      const { icon, iconColor } = getIconAndColorForType(editedItem.value.type);
      editedItem.value.icon = icon;
      editedItem.value.iconColor = iconColor;

      const index = allContent.value.findIndex(i => i.id === editedItem.value.id);
      if (index !== -1) {
        // Update existing item
        allContent.value[index] = { ...editedItem.value };
      } else {
        // Add new item (though 'Thêm mới' button is removed)
        // Assign a new ID (simple increment for example, in real app use UUID)
        editedItem.value.id = allContent.value.length > 0 ? Math.max(...allContent.value.map(i => i.id)) + 1 : 1;
        allContent.value.push(editedItem.value);
      }
      closeDialog();
    };

    const deleteItem = (item) => {
      itemToDelete.value = item;
      deleteDialog.value = true;
    };

    const confirmDelete = () => {
      if (itemToDelete.value) {
        allContent.value = allContent.value.filter(i => i.id !== itemToDelete.value.id);
        // Adjust current page if last item on page was deleted
        if (paginatedContent.value.length === 0 && currentPage.value > 1) {
          currentPage.value--;
        }
      }
      closeDeleteDialog();
    };

    const closeDeleteDialog = () => {
      deleteDialog.value = false;
      itemToDelete.value = null; // Clear item to delete
    };


    return {
      allContent,
      filteredContent, // Dùng filteredContent cho phân trang
      paginatedContent,
      currentPage,
      totalPages,
      totalContent,
      startIndex,
      endIndex,
      goToPage,
      prevPage,
      nextPage,
      getStatusTagClass,
      getLevelTagClass,

      // Filter related
      contentTypes,
      selectedTypeFilter,
      selectTypeFilter,

      // CRUD related
      dialog,
      deleteDialog,
      dialogTitle,
      editedItem,
      itemToDelete,
      openDialog,
      saveItem,
      deleteItem,
      confirmDelete,
      closeDialog,
      closeDeleteDialog,
      formRef, // Expose formRef
    };
  },
});
</script>

<style scoped>
/* Định nghĩa biến CSS nếu chưa có trong dự án của bạn (ví dụ: trong App.vue hoặc main.css) */
/* CÁC BIẾN NÀY NÊN ĐƯỢC ĐỊNH NGHĨA TRONG GLOBAL CSS (ví dụ: main.css) HOẶC AdminLayout.vue NẾU CHÚNG ĐƯỢC SỬ DỤNG TRÊN TOÀN BỘ ỨNG DỤNG */
/* Tôi đặt ở đây để bạn dễ kiểm soát, nhưng nếu có xung đột, hãy xem xét lại vị trí của chúng. */
:root {
  --background-white: #FFFFFF; /* Đảm bảo biến này được định nghĩa là #FFFFFF */
  --background-card: #FFFFFF; /* Đảm bảo card cũng nền trắng */
  --background-light: #F8F9FA; /* Nền hơi xám nhẹ cho các phần khác trong dialog */
  --border-color: #EEEEEE;
  --text-dark: #333333;
  --text-medium: #666666;
  --primary-color: #2196F3; /* Xanh dương */
  --primary-dark: #1976D2;
  --primary-light: #BBDEFB;
  --button-default-bg: #F0F2F5; /* Nền nút default nhẹ nhàng */
  --button-hover-bg: #E0E2E6;
  --button-hover-border: #D0D2D6;
  --border-radius-card: 16px;
  --border-radius-table: 12px; /* Bo tròn góc bảng */
  --border-radius-button: 8px;
  --border-radius-circle: 50%;
  --border-radius-tag: 6px;
  --border-radius-input: 8px;
  --shadow-light: rgba(0, 0, 0, 0.05);
  --shadow-medium: rgba(0, 0, 0, 0.1);
  --shadow-strong: rgba(0, 0, 0, 0.15);
  --table-header-bg: #F5F7FA; /* Nền header bảng */
  --table-row-hover-bg: #FAFAFA; /* Nền hover của hàng */

  /* Status Colors */
  --status-active-bg: #e8f5e9; /* Light Green */
  --status-active-text: #28a745;
  --status-pending-bg: #fff3e0; /* Light Orange */
  --status-pending-text: #ff9800;
  --status-review-bg: #e3f2fd; /* Light Blue */
  --status-review-text: #2196F3;
  --status-blocked-bg: #ffebee; /* Light Red */
  --status-blocked-text: #dc3545;
  --status-blocked-light: #FFCDD2; /* Lighter red for hover */

  /* Level Tag Colors */
  --tag-level-n5-bg: #BBDEFB; /* Light Blue */
  --tag-level-n5-text: #1976D2;
  --tag-level-n4-bg: #C8E6C9; /* Light Green */
  --tag-level-n4-text: #388E3C;
  --tag-level-n3-bg: #FFECB3; /* Light Orange */
  --tag-level-n3-text: #FF8F00;
  --tag-level-n2-bg: #FFCDD2; /* Light Red */
  --tag-level-n2-text: #D32F2F;
  --tag-level-n1-bg: #D1C4E9; /* Light Purple */
  --tag-level-n1-text: #5E35B1;
}

/* Base card styles - ĐẢM BẢO NỀN CARD TRẮNG */
.card {
  background-color: var(--background-white) !important;
  border-radius: var(--border-radius-card);
  padding: 25px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  flex-shrink: 0;
}

.recent-content-card {
  grid-column: span 2;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 0;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

/* Các nút chung */
.btn {
  padding: 10px 15px;
  border-radius: var(--border-radius-button);
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-default {
  background-color: var(--button-default-bg);
  color: var(--text-dark);
  border: 1px solid var(--border-color);
}

.btn-default:hover {
  background-color: var(--button-hover-bg);
  border-color: var(--button-hover-border);
}

.type-filter {
  gap: 8px;
}

.table-responsive {
  width: 100%;
  overflow-x: auto; /* Kích hoạt thanh cuộn ngang nếu nội dung bảng tràn ra */
  flex-grow: 1;
  margin-bottom: 20px;
  border-radius: var(--border-radius-table);
  overflow: hidden; /* Đảm bảo bo tròn góc được áp dụng */
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.content-table {
  width: 100%; /* Bảng sẽ chiếm toàn bộ chiều rộng của .table-responsive */
  table-layout: fixed; /* Rất quan trọng: Chia đều chiều rộng cho các cột theo % đã định */
  border-collapse: separate;
  border-spacing: 0;
  min-width: 950px; /* Điều chỉnh lại min-width để đẹp mắt hơn trên màn hình lớn. */
  background-color: var(--background-white) !important; /* Đảm bảo nền trắng cho bảng */
  border-radius: var(--border-radius-table);
}

.content-table th,
.content-table td {
  padding: 15px 10px;
  text-align: left; /* Mặc định căn trái cho nội dung */
  border-bottom: 1px solid var(--border-color);
  font-size: 14px;
  color: var(--text-dark);
  word-wrap: break-word;
  overflow-wrap: break-word;
  background-color: var(--background-white) !important; /* Đảm bảo nền trắng cho mỗi ô */
}

.content-table th {
  color: var(--text-medium);
  font-weight: 600;
  background-color: var(--table-header-bg) !important; /* Đảm bảo nền header */
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

/* Bo tròn góc cho thead */
.content-table thead tr:first-child th:first-child {
  border-top-left-radius: var(--border-radius-table);
}
.content-table thead tr:first-child th:last-child {
  border-top-right-radius: var(--border-radius-table);
}

.content-table tbody tr:last-child td {
  border-bottom: none;
}

/* Nền hover cho hàng */
.content-table tbody tr:hover {
  background-color: var(--table-row-hover-bg) !important; /* Đảm bảo nền hover vẫn là trắng/xám nhẹ */
}

.title-cell {
  display: flex;
  align-items: center;
  font-weight: 500;
  white-space: normal;
}

.title-icon {
  font-size: 16px;
  margin-right: 10px;
  width: 20px;
  flex-shrink: 0;
  text-align: center;
}

/* --- ĐIỀU CHỈNH ĐỂ NỘI DUNG GIÃN ĐỀU RA HẾT CÁC Ô --- */

/* Căn giữa nội dung trong cột "Cấp độ" */
.level-cell-content {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 20px; /* Đảm bảo chiều cao tối thiểu cho căn giữa */
}

/* Căn giữa nội dung trong cột "Trạng thái" */
.status-cell-content {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 20px; /* Đảm bảo chiều cao tối thiểu cho căn giữa */
}

/* Cột "Thao tác" cũng đã được căn giữa nội dung bên trong */
.action-buttons {
  display: flex;
  gap: 8px;
  white-space: nowrap;
  justify-content: center;
  width: 100%;
}


/* Tag styles (trạng thái và cấp độ) */
.tag {
  display: inline-block;
  padding: 5px 10px;
  border-radius: var(--border-radius-tag);
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}

.tag-status-active {
  background-color: var(--status-active-bg) !important; /* !important để ưu tiên */
  color: var(--status-active-text);
}
.tag-status-pending {
  background-color: var(--status-pending-bg) !important; /* !important để ưu tiên */
  color: var(--status-pending-text);
}
.tag-status-review {
  background-color: var(--status-review-bg) !important; /* !important để ưu tiên */
  color: var(--status-review-text);
}
.tag-status-blocked {
  background-color: var(--status-blocked-bg) !important; /* !important để ưu tiên */
  color: var(--status-blocked-text);
}

.tag-level-n5 {
  background-color: var(--tag-level-n5-bg) !important; /* !important để ưu tiên */
  color: var(--tag-level-n5-text);
}
.tag-level-n4 {
  background-color: var(--tag-level-n4-bg) !important; /* !important để ưu tiên */
  color: var(--tag-level-n4-text);
}
.tag-level-n3 {
  background-color: var(--tag-level-n3-bg) !important; /* !important để ưu tiên */
  color: var(--tag-level-n3-text);
}
.tag-level-n2 {
  background-color: var(--tag-level-n2-bg) !important; /* !important để ưu tiên */
  color: var(--tag-level-n2-text);
}
.tag-level-n1 {
  background-color: var(--tag-level-n1-bg) !important; /* !important để ưu tiên */
  color: var(--tag-level-n1-text);
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: var(--border-radius-circle);
  background-color: var(--background-light) !important; /* Đảm bảo nền nút */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  color: var(--text-medium);
  transition: background-color 0.2s, color 0.2s;
  cursor: pointer;
}

.action-btn:hover {
  background-color: var(--border-color) !important; /* Đảm bảo nền hover */
  color: var(--primary-color);
}

.delete-btn:hover {
  background-color: var(--status-blocked-light) !important; /* Đảm bảo nền hover */
  color: var(--status-blocked-text);
}

.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  flex-wrap: wrap;
  gap: 15px;
}

.pagination-info {
  font-size: 14px;
  color: var(--text-medium);
}

.pagination-controls {
  display: flex;
  gap: 5px;
}

.pagination-btn {
  padding: 8px 14px;
  border-radius: var(--border-radius-button);
  background-color: var(--button-default-bg) !important; /* Đảm bảo nền nút */
  color: var(--text-dark);
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s, color 0.2s;
  cursor: pointer;
}

.pagination-btn:hover:not(:disabled),
.pagination-btn.active {
  background-color: var(--primary-color) !important; /* Đảm bảo nền active */
  color: #FFFFFF;
}

.pagination-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Vuetify Dialog Custom Styles */
.crud-dialog-card {
  background-color: var(--background-white) !important;
}

.confirm-dialog-card {
  background-color: var(--background-white) !important;
}

.dialog-toolbar {
  background-color: var(--primary-color) !important;
  color: #FFFFFF !important;
}

.dialog-content {
  background-color: var(--background-white) !important;
}

.dialog-actions {
  background-color: var(--background-light) !important;
}

.close-dialog-btn {
  color: #FFFFFF !important;
}

/* Styles cho dropdown list của filter */
.filter-dropdown-list {
  background-color: var(--background-white) !important;
  border-radius: var(--border-radius-button);
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  padding: 8px 0;
  min-width: 150px;
}

.filter-dropdown-list .v-list-item {
  min-height: 40px;
  padding: 0 16px;
  font-size: 14px;
  color: var(--text-dark);
  cursor: pointer;
}

.filter-dropdown-list .v-list-item:hover {
  background-color: var(--button-default-bg) !important;
}

.filter-dropdown-list .v-list-item--active {
  background-color: var(--primary-light) !important;
  color: var(--primary-color);
  font-weight: 600;
}


/* Responsive adjustments */
@media (max-width: 1200px) {
  .card-title {
    font-size: 17px;
  }
  .type-filter {
    padding: 8px 12px;
    font-size: 14px;
  }
  .content-table {
    min-width: 850px; /* Giữ nguyên hoặc điều chỉnh nếu cần thanh cuộn sớm hơn */
  }
  .content-table th, .content-table td {
    padding: 12px 8px;
    font-size: 13px;
  }
  .title-icon {
    font-size: 15px;
    margin-right: 8px;
  }
  .action-btn {
    width: 30px;
    height: 30px;
    font-size: 14px;
  }
  .pagination-info {
    font-size: 13px;
  }
  .pagination-btn {
    padding: 7px 12px;
    font-size: 13px;
  }
}

@media (max-width: 992px) {
  .recent-content-card {
    grid-column: span 1;
  }
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  .card-title {
    margin-bottom: 5px;
  }
  .actions {
    width: 100%;
    justify-content: flex-start;
  }
  .table-responsive {
    overflow-x: auto;
  }
  .content-table {
    min-width: 750px; /* Điều chỉnh min-width cho máy tính bảng */
  }
  .table-footer {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
}

@media (max-width: 768px) {
  .card-title {
    font-size: 16px;
  }
  .type-filter {
    padding: 7px 10px;
    font-size: 13px;
  }
  .content-table {
    min-width: 650px; /* Giảm min-width nữa cho điện thoại lớn */
  }
  .content-table th, .content-table td {
    padding: 10px 6px;
    font-size: 12px;
  }
  .pagination-info {
    font-size: 12px;
  }
  .pagination-btn {
    padding: 6px 10px;
    font-size: 12px;
  }
}

@media (max-width: 576px) {
  .card {
    padding: 15px;
  }
  .card-title {
    font-size: 15px;
  }
  .content-table {
    min-width: 550px; /* Giảm min-width cho di động nhỏ hơn */
  }
  .content-table th, .content-table td {
    padding: 8px 5px;
    font-size: 11px;
  }
  .title-icon {
    font-size: 13px;
    margin-right: 5px;
  }
  .tag {
    padding: 4px 8px;
    font-size: 11px;
  }
  .action-btn {
    width: 28px;
    height: 28px;
    font-size: 13px;
  }
  .pagination-btn {
    padding: 5px 8px;
    font-size: 11px;
  }
}
</style> -->