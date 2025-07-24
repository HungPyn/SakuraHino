<template>
  <div class="entertaiment-view-container">
    <h1 class="badge-title">
      <i class="bi-controller text-primary me-2"></i> Giải trí
    </h1>
    <div class="entertainment-view p-4">
      <EntertainmentToolbar @search="handleSearch" @add="openAdd" />

      <EntertainmentTable
        :stories="paginatedStories"
        @edit="openEdit"
        @delete="deleteStory"
      />

      <EntertainmentPopup
        v-if="showPopup"
        :story="selectedStory"
        @close="closePopup"
        @save="saveStory"
      />

      <nav class="mt-3">
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: page === 1 }">
            <button class="page-link" @click="goToPage(page - 1)">Trước</button>
          </li>
          <li
            class="page-item"
            v-for="p in totalPages"
            :key="p"
            :class="{ active: page === p }"
          >
            <button class="page-link" @click="goToPage(p)">{{ p }}</button>
          </li>
          <li class="page-item" :class="{ disabled: page === totalPages }">
            <button class="page-link" @click="goToPage(page + 1)">Sau</button>
          </li>
        </ul>
      </nav>
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
import { storyData } from '../../services/entertainmentService';

export default {
  components: {
    EntertainmentToolbar,
    EntertainmentTable,
    EntertainmentPopup,
    NotificationToast,
  },
  data() {
    return {
      stories: [...storyData],
      searchKeyword: '',
      page: 1,
      perPage: 5,
      showPopup: false,
      selectedStory: null,

      toastMessage: '',
      toastType: 'success',
    };
  },
  computed: {
    filteredStories() {
      return this.stories.filter((story) =>
        story.title.toLowerCase().includes(this.searchKeyword.toLowerCase())
      );
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
    this.notificationToast = this.$refs.notificationToast;
  },
  methods: {
    handleSearch(keyword) {
      this.searchKeyword = keyword;
      this.page = 1;
    },
    goToPage(p) {
      if (p >= 1 && p <= this.totalPages) {
        this.page = p;
      }
    },
    openAdd() {
      this.selectedStory = null;
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
          if (index !== -1) this.stories.splice(index, 1, story);
          this.showToast('Cập nhật truyện thành công!', 'success');
        } else {
          story.id = Date.now();
          this.stories.unshift(story);
          this.page = 1;
          this.showToast('Thêm truyện mới thành công!', 'success');
        }
      } catch (error) {
        console.error(error);
        this.showToast('Có lỗi xảy ra khi lưu truyện!', 'error');
      }
      this.closePopup();
    },
    deleteStory(id) {
      try {
        this.stories = this.stories.filter((s) => s.id !== id);
        if (this.page > this.totalPages) {
          this.page = this.totalPages || 1;
        }
        this.showToast('Xóa truyện thành công!', 'success');
      } catch (error) {
        console.error(error);
        this.showToast('Xóa truyện thất bại!', 'error');
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

<style>
.entertaiment-view-container {
  padding: 1.5rem 2rem;
  background-color: #f8fafd;
  min-height: calc(100vh - 60px);
}
</style>
