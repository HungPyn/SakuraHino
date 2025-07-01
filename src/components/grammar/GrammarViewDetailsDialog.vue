<template>
  <v-dialog
    :model-value="show"
    @update:model-value="closeDialog"
    max-width="700px"
    persistent
  >
    <v-card rounded="lg" elevation="8" v-if="itemDetails">
      <v-card-title class="pa-4 bg-primary text-white">
        <span class="text-h6 font-weight-bold">Chi tiết {{ itemDetails.type }}: {{ itemDetails.title }}</span>
        <v-spacer></v-spacer>
        <v-btn icon flat @click="closeDialog">
          <v-icon color="white">fa-solid fa-xmark</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="pa-6">
        <v-row dense>
          <v-col cols="12" sm="6">
            <v-card class="info-card" rounded="lg" flat>
              <v-list-item>
                <v-list-item-title class="font-weight-bold">Cấp độ:</v-list-item-title>
                <v-list-item-subtitle>
                  <v-chip :color="getLevelColor(itemDetails.level)" size="small" class="font-weight-medium">
                    {{ itemDetails.level }}
                  </v-chip>
                </v-list-item-subtitle>
              </v-list-item>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6">
            <v-card class="info-card" rounded="lg" flat>
              <v-list-item>
                <v-list-item-title class="font-weight-bold">Trạng thái:</v-list-item-title>
                <v-list-item-subtitle>
                  <v-chip :color="getStatusColor(itemDetails.status)" size="small" class="font-weight-medium">
                    {{ itemDetails.status === 'Published' ? 'Đã xuất bản' : itemDetails.status === 'Draft' ? 'Bản nháp' : itemDetails.status }}
                  </v-chip>
                </v-list-item-subtitle>
              </v-list-item>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-list-item>
              <v-list-item-title class="font-weight-bold">Tác giả:</v-list-item-title>
              <v-list-item-subtitle>{{ itemDetails.author }}</v-list-item-subtitle>
            </v-list-item>
          </v-col>
          <v-col cols="12">
            <v-list-item>
              <v-list-item-title class="font-weight-bold">Ngày tạo:</v-list-item-title>
              <v-list-item-subtitle>{{ itemDetails.date }}</v-list-item-subtitle>
            </v-list-item>
          </v-col>
        </v-row>

        <v-divider class="my-4"></v-divider>

        <!-- Grammar specific details -->
        <template v-if="itemDetails.type === 'Ngữ pháp'">
          <h3 class="text-h6 mb-2">Mô tả:</h3>
          <p class="text-body-1 mb-2">{{ itemDetails.description }}</p>

          <h3 class="text-h6 mb-2">Ví dụ tiếng Nhật:</h3>
          <p class="text-body-1 mb-2">{{ itemDetails.exampleJp }}</p>

          <h3 class="text-h6 mb-2">Ví dụ tiếng Việt:</h3>
          <p class="text-body-1 mb-2">{{ itemDetails.exampleVn }}</p>

          <p class="font-weight-medium mt-4">Số học viên đã xem: <span class="text-primary">{{ itemDetails.students }}</span></p>
        </template>

        <!-- Lecture specific details -->
        <template v-else-if="itemDetails.type === 'Bài giảng'">
          <h3 class="text-h6 mb-2">Thông tin bài giảng:</h3>
          <v-row dense>
            <v-col cols="12" sm="6">
              <v-list-item>
                <v-list-item-title class="font-weight-bold">Thời lượng:</v-list-item-title>
                <v-list-item-subtitle>{{ itemDetails.duration }}</v-list-item-subtitle>
              </v-list-item>
            </v-col>
            <v-col cols="12" sm="6">
              <v-list-item>
                <v-list-item-title class="font-weight-bold">Số từ vựng:</v-list-item-title>
                <v-list-item-subtitle>{{ itemDetails.vocabularyCount }}</v-list-item-subtitle>
              </v-list-item>
            </v-col>
            <v-col cols="12" sm="6">
              <v-list-item>
                <v-list-item-title class="font-weight-bold">Số ngữ pháp:</v-list-item-title>
                <v-list-item-subtitle>{{ itemDetails.grammarCount }}</v-list-item-subtitle>
              </v-list-item>
            </v-col>
            <v-col cols="12" sm="6">
              <v-list-item>
                <v-list-item-title class="font-weight-bold">Lượt xem:</v-list-item-title>
                <v-list-item-subtitle>{{ itemDetails.views }}</v-list-item-subtitle>
              </v-list-item>
            </v-col>
            <v-col cols="12">
              <v-list-item>
                <v-list-item-title class="font-weight-bold">Tags:</v-list-item-title>
                <v-list-item-subtitle>
                  <v-chip v-for="tag in itemDetails.tags" :key="tag" :color="getTagColor(tag)" size="small" class="mr-2">{{ tag }}</v-chip>
                  <span v-if="!itemDetails.tags || itemDetails.tags.length === 0">Không có tags</span>
                </v-list-item-subtitle>
              </v-list-item>
            </v-col>
          </v-row>
        </template>
      </v-card-text>

      <v-card-actions class="pa-4 bg-grey-lighten-4">
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          variant="flat"
          @click="closeDialog"
        >
          Đóng
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  show: Boolean,
  itemDetails: Object, // The item object (grammar or lecture) to display
});

const emit = defineEmits(['update:show']);

const closeDialog = () => {
  emit('update:show', false);
};

// Helper functions (copied from GrammarManagement to keep styles consistent)
const getLevelColor = (level) => {
    switch (level) {
        case 'N5': return 'green-lighten-1';
        case 'N4': return 'light-blue-lighten-1';
        case 'N3': return 'teal-lighten-1';
        case 'N2': return 'orange-lighten-1';
        case 'N1': return 'red-lighten-1';
        default: return 'grey';
    }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Published': return 'success';
    case 'Hoạt động': return 'success';
    case 'Draft': return 'blue-grey-lighten-1';
    case 'Bản nháp': return 'blue-grey-lighten-1';
    case 'Đã xuất bản': return 'success';
    case 'Pending Review': return 'orange';
    case 'Rejected': return 'error';
    default: return 'grey';
  }
};

const getTagColor = (tag) => {
    switch (tag) {
        case 'Video': return 'deep-purple-lighten-3';
        case 'Tương tác': return 'pink-lighten-3';
        case 'Audio': return 'light-green-lighten-3';
        case 'Văn bản': return 'brown-lighten-3';
        case 'Ebook': return 'cyan-lighten-3';
        default: return 'grey-lighten-1';
    }
};
</script>

<style scoped>
.info-card {
  background-color: #F8F8F8; /* A very light grey background */
  border: 1px solid #E0E0E0; /* Light border */
}

.info-card .v-list-item {
  padding: 8px 16px; /* Adjust padding inside the list item if necessary */
}
</style>
