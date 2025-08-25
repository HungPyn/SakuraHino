<template>
  <table class="table table-bordered table-striped">
    <thead>
      <tr>
        <th>ID</th>
        <th>User</th>
        <th>Topic</th>
        <th>Bài học</th>
        <th>Tiến độ</th>
        <th>Ngày</th>
        <th>Hành động</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="h in histories" :key="h.id">
        <td>{{ h.id }}</td>
        <td>{{ h.user }}</td>
        <td>{{ h.topic }}</td>
        <td>{{ h.lesson }}</td>
        <td>{{ h.progress }}</td>
        <td>{{ h.date }}</td>
        <td>
          <button class="btn btn-sm btn-warning me-1" @click="$emit('edit', h)">
            <i class="bi bi-pencil-square"></i>
          </button>
          <button class="btn btn-sm btn-danger" @click="$emit('delete', h.id)">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: ["histories"],
  emits: ["edit", "delete"]
};
</script>
