<template>
  <div class="entertaiment-view-container">
    <div class="entertainment-header">
      <h1 class="entertainment-title">
        <i class="bi-controller text-primary me-2"></i> Quản lý Giải trí
      </h1>
    </div>

    <EntertainmentToolbar
      @search="handleSearch"
      @add="openAdd"
      @filter-genre="handleFilterGenre"
      @filter-status="handleFilterStatus"
      @reset-filters="handleResetFilters"
    />

    <EntertainmentTable
      :stories="paginatedStories"
      @edit="openEdit"
      @delete="deleteStory"
    />
    <p v-if="paginatedStories.length === 0" class="text-center text-muted py-4 m-0">Không có nội dung giải trí nào phù hợp với bộ lọc.</p>

    <EntertainmentPopup
      v-if="showPopup"
      :story="selectedStory"
      @close="closePopup"
      @save="saveStory"
    />

    <div class="d-flex justify-content-center mt-4">
      <Pagination
        :current-page="page"
        :total-pages="totalPages"
        @page-changed="goToPage"
      />
    </div>

    <NotificationToast
      ref="notificationToast"
      :message="toastMessage"
      :type="toastType"
    />
  </div>
</template>

<script>
import EntertainmentToolbar from '../entertainment/EntertainmentToolbar.vue';
import EntertainmentTable from '../entertainment/EntertainmentTable.vue';
import EntertainmentPopup from '../entertainment/EntertainmentPopup.vue';
import NotificationToast from '../share/NotificationToast.vue';
import Pagination from '../share/Pagination.vue'; // Import Pagination component dùng chung
import { storyData } from '../../services/entertainmentService'; // Make sure this is correctly imported

export default {
  components: {
    EntertainmentToolbar,
    EntertainmentTable,
    EntertainmentPopup,
    NotificationToast,
    Pagination, // Đăng ký Pagination
  },
  data() {
    return {
      stories: [...storyData], // Dữ liệu gốc
      searchKeyword: '',
      filterGenre: 'all',  // Thêm trạng thái bộ lọc thể loại
      filterStatus: 'all', // Thêm trạng thái bộ lọc trạng thái
      page: 1,
      perPage: 5, // Số mục trên mỗi trang cố định, có thể làm động sau
      showPopup: false,
      selectedStory: null,

      toastMessage: '',
      toastType: 'success',
    };
  },
  computed: {
    filteredStories() {
      let filtered = this.stories;

      // 1. Lọc theo từ khóa tìm kiếm
      if (this.searchKeyword) {
        const lowerKeyword = this.searchKeyword.toLowerCase();
        filtered = filtered.filter((story) =>
          (story.title && story.title.toLowerCase().includes(lowerKeyword)) ||
          (story.description && story.description.toLowerCase().includes(lowerKeyword))
        );
      }

      // 2. Lọc theo thể loại
      if (this.filterGenre !== 'all') {
        filtered = filtered.filter((story) => story.genre === this.filterGenre);
      }

      // 3. Lọc theo trạng thái
      if (this.filterStatus !== 'all') {
        filtered = filtered.filter((story) => story.status === this.filterStatus);
      }

      return filtered;
    },
    totalPages() {
      return Math.ceil(this.filteredStories.length / this.perPage);
    },
    paginatedStories() {
      const start = (this.page - 1) * this.perPage;
      return this.filteredStories.slice(start, start + this.perPage);
    },
  },
  mounted() {
    // Đảm bảo notificationToast được gán sau khi component được mount
    this.notificationToast = this.$refs.notificationToast;
  },
  methods: {
    handleSearch(keyword) {
      this.searchKeyword = keyword;
      this.page = 1; // Reset về trang 1 khi tìm kiếm
    },
    handleFilterGenre(genre) {
      this.filterGenre = genre;
      this.page = 1; // Reset về trang 1 khi lọc
    },
    handleFilterStatus(status) {
      this.filterStatus = status;
      this.page = 1; // Reset về trang 1 khi lọc
    },
    handleResetFilters() {
      this.searchKeyword = '';
      this.filterGenre = 'all';
      this.filterStatus = 'all';
      this.page = 1;
    },
    goToPage(p) { // Hàm này nhận 'p' từ Pagination component
      if (p >= 1 && p <= this.totalPages) {
        this.page = p;
      }
    },
    openAdd() {
      // Gán các giá trị mặc định cho story mới
      this.selectedStory = {
        id: null,
        title: '',
        description: '',
        genre: 'story', // Giá trị mặc định
        status: 'draft', // Giá trị mặc định
        imageUrl: '',
        content: '',
      };
      this.showPopup = true;
    },
    openEdit(story) {
      this.selectedStory = { ...story };
      this.showPopup = true;
    },
    closePopup() {
      this.showPopup = false;
    },
    saveStory(story) {
      try {
        if (story.id) {
          const index = this.stories.findIndex((s) => s.id === story.id);
          if (index !== -1) {
            this.stories.splice(index, 1, story);
            this.showToast('Cập nhật nội dung giải trí thành công!', 'success');
          }
        } else {
          story.id = Date.now(); // Sử dụng timestamp làm ID tạm thời
          this.stories.unshift(story); // Thêm vào đầu danh sách
          this.page = 1; // Quay về trang 1 để thấy mục mới
          this.showToast('Thêm nội dung giải trí mới thành công!', 'success');
        }
      } catch (error) {
        console.error(error);
        this.showToast('Có lỗi xảy ra khi lưu nội dung giải trí!', 'error');
      }
      this.closePopup();
    },
    deleteStory(id) {
      try {
        // Lọc bỏ story cần xóa
        this.stories = this.stories.filter((s) => s.id !== id);

        // Điều chỉnh trang hiện tại nếu trang đó không còn mục nào
        if (this.page > this.totalPages && this.totalPages > 0) {
          this.page = this.totalPages;
        } else if (this.totalPages === 0) {
          this.page = 1; // Nếu không còn mục nào, về trang 1
        }
        this.showToast('Xóa nội dung giải trí thành công!', 'success');
      } catch (error) {
        console.error(error);
        this.showToast('Xóa nội dung giải trí thất bại!', 'error');
      }
    },
    showToast(message, type = 'success') {
      this.toastMessage = message;
      this.toastType = type;
      this.notificationToast.show();
    },
  },
};
</script>

<style scoped>
.entertaiment-view-container {
  padding: 1.5rem 2rem;
  background-color: #f8fafd;
  min-height: calc(100vh - 60px);
}

.entertainment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.entertainment-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0;
}

/* Các styles khác của bạn */
@media (max-width: 768px) {
  .entertaiment-view-container {
    padding: 1rem;
  }
  .entertainment-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .entertainment-title {
    font-size: 1.75rem;
    margin-bottom: 1rem;
  }
}
@media (max-width: 576px) {
  .entertainment-title {
    font-size: 1.5rem;
  }
}
</style>