<template>
  <div class="entertainment-table-container card">
    <div class="card-body p-0">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Tiêu đề</th>
              <th scope="col">Thể loại</th>
              <th scope="col">Trạng thái</th>
              <th scope="col">Chương</th> <th scope="col">Chủ đề</th> <th scope="col">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="stories.length === 0">
              <td colspan="7" class="text-center py-4 text-muted">Không có nội dung giải trí nào.</td>
            </tr>
            <tr v-for="story in stories" :key="story.id">
              <td>{{ story.id }}</td>
              <td>
                <div class="d-flex align-items-center">
                  <img
                    :src="story.imageUrl || 'https://via.placeholder.com/50x50?text=No+Image'"
                    alt="Story Image"
                    class="rounded-circle me-3"
                    width="50"
                    height="50"
                    loading="lazy"
                  />
                  <div class="story-info">
                    <h6 class="mb-0 text-dark">{{ story.title }}</h6>
                    <small class="text-muted text-truncate d-block" style="max-width: 200px;">{{ story.description }}</small>
                  </div>
                </div>
              </td>
              <td>
                <span :class="['badge', getGenreBadgeClass(story.genre)]">{{ formatGenre(story.genre) }}</span>
              </td>
              <td>
                <span :class="['badge', getStatusBadgeClass(story.status)]">{{ formatStatus(story.status) }}</span>
              </td>
              <td>{{ story.chapter !== null ? story.chapter : '-' }}</td> <td>{{ story.topic || '-' }}</td> <td>
                <div class="d-flex gap-2">
                  <button class="btn btn-sm btn-info" @click="$emit('edit', story)" title="Chỉnh sửa">
                    <i class="bi bi-pencil-square"></i>
                  </button>
                  <button class="btn btn-sm btn-danger" @click="confirmDelete(story.id)" title="Xóa">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    stories: {
      type: Array,
      required: true,
    },
  },
  emits: ['edit', 'delete'],
  methods: {
    confirmDelete(id) {
      if (confirm('Bạn có chắc chắn muốn xóa nội dung giải trí này không?')) {
        this.$emit('delete', id);
      }
    },
    getGenreBadgeClass(genre) {
      switch (genre) {
        case 'story': return 'bg-primary';
        case 'comic': return 'bg-info';
        case 'game': return 'bg-warning text-dark';
        case 'quiz': return 'bg-danger';
        case 'other': return 'bg-secondary';
        default: return 'bg-light text-dark';
      }
    },
    formatGenre(genre) {
      switch (genre) {
        case 'story': return 'Truyện ngắn';
        case 'comic': return 'Truyện tranh';
        case 'game': return 'Trò chơi';
        case 'quiz': return 'Câu đố';
        case 'other': return 'Khác';
        default: return genre;
      }
    },
    getStatusBadgeClass(status) {
      switch (status) {
        case 'published': return 'bg-success';
        case 'draft': return 'bg-secondary';
        case 'archived': return 'bg-warning text-dark';
        default: return 'bg-light text-dark';
      }
    },
    formatStatus(status) {
      switch (status) {
        case 'published': return 'Đã xuất bản';
        case 'draft': return 'Bản nháp';
        case 'archived': return 'Lưu trữ';
        default: return status;
      }
    },
  },
};
</script>

<style scoped>
.entertainment-table-container {
  border: none;
  border-radius: 0.75rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  overflow: hidden; /* Ensures rounded corners are applied */
  margin-top: 1.5rem; /* Add margin to separate from toolbar */
}

.table {
  min-width: 800px; /* Ensure table doesn't get too small */
}

.table th,
.table td {
  padding: 1rem;
  white-space: nowrap; /* Prevent text wrapping in columns */
}

.table thead th {
  font-weight: 600;
  color: #555;
  text-transform: uppercase;
  font-size: 0.85rem;
}

.table tbody tr:hover {
  background-color: #f0f4f8; /* Lighter hover effect */
}

.badge {
  padding: 0.5em 0.8em;
  border-radius: 0.35rem;
  font-weight: 600;
  font-size: 0.75em;
  letter-spacing: 0.5px;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  border-radius: 0.3rem;
}

img.rounded-circle {
  object-fit: cover;
  flex-shrink: 0; /* Prevent image from shrinking */
}

.story-info h6 {
  font-size: 1rem;
  font-weight: 600;
}

.story-info small {
  font-size: 0.8rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .table-responsive {
    border: 1px solid #e9ecef; /* Add border for scrollable area */
    border-radius: 0.75rem;
  }
}
</style>