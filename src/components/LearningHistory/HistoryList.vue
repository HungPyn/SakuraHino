<template>
  <div>
    <!-- Tìm kiếm cơ bản -->
    <input v-model="search" placeholder="Tìm theo tên user..." class="border p-2 rounded mb-3" />

    <!-- Bộ lọc nâng cao -->
    <HistoryFilter :topics="topics" v-model="selectedTopic" />

    <!-- Danh sách -->
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>User</th>
          <th>Topic</th>
          <th>Tiến độ</th>
          <th>Ngày học</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="h in filteredHistories" :key="h.id">
          <td>{{ h.user }}</td>
          <td>{{ h.topic }}</td>
          <td>{{ h.progress }}</td>
          <td>{{ h.date }}</td>
          <td>
            <button class="btn btn-warning btn-sm" @click="$emit('edit', h)">Sửa</button>
            <button class="btn btn-danger btn-sm" @click="$emit('delete', h.id)">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>
    <button class="btn btn-primary" @click="$emit('add')">Thêm mới</button>
  </div>
</template>

<script>
import HistoryFilter from "./LearningHistoryFilters.vue";

export default {
  components: { HistoryFilter },
  props: ["histories", "topics"],
  data() {
    return {
      search: "",
      selectedTopic: ""
    };
  },
  computed: {
    filteredHistories() {
      return this.histories.filter(h => {
        return (
          h.user.toLowerCase().includes(this.search.toLowerCase()) &&
          (this.selectedTopic ? h.topic === this.selectedTopic : true)
        );
      });
    }
  }
};
</script>
