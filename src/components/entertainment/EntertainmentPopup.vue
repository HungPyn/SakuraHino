<template>
  <div class="modal fade show d-block" style="background: rgba(0,0,0,0.5)">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ story?.id ? 'Chỉnh sửa' : 'Thêm mới' }} bộ truyện</h5>
          <button class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label">Tên truyện</label>
            <input v-model="localStory.title" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label">Số chương</label>
            <input v-model.number="localStory.chapterCount" type="number" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label">Chủ đề</label>
            <input v-model="localStory.topic" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label">Nội dung</label>
            <textarea v-model="localStory.content" rows="4" class="form-control"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="$emit('close')">Hủy</button>
          <button class="btn btn-primary" @click="save">Lưu</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['story'],
  data() {
    return {
      localStory: this.story
        ? { ...this.story }
        : { title: '', chapterCount: 1, topic: '', content: '' },
    };
  },
  methods: {
    save() {
      if (!this.localStory.title.trim()) return alert('Vui lòng nhập tên truyện');
      this.$emit('save', this.localStory);
    },
  },
};
</script>