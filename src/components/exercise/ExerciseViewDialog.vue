<template>
  <v-dialog
    :model-value="show"
    @update:model-value="closeDialog"
    max-width="700px"
    persistent
  >
    <v-card rounded="lg" elevation="8" v-if="exerciseDetails">
      <v-card-title class="pa-4 bg-primary text-white">
        <span class="text-h6 font-weight-bold">Chi tiết Bài tập: {{ exerciseDetails.title }}</span>
        <v-spacer></v-spacer>
        <v-btn icon flat @click="closeDialog">
          <v-icon color="white">fa-solid fa-xmark</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="pa-6">
        <v-row dense>
          <v-col cols="12" sm="6"> <!-- Apply bg-grey-lighten-5 and rounded-lg to the v-col -->
            <v-card class="info-card" rounded="lg" flat>
              <v-list-item>
                <v-list-item-title class="font-weight-bold">Chủ đề:</v-list-item-title>
                <v-list-item-subtitle>{{ exerciseDetails.topic }}</v-list-item-subtitle>
              </v-list-item>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6"> <!-- Apply bg-grey-lighten-5 and rounded-lg to the v-col -->
            <v-card class="info-card" rounded="lg" flat>
              <v-list-item>
                <v-list-item-title class="font-weight-bold">Cấp độ:</v-list-item-title>
                <v-list-item-subtitle>
                  <v-chip :color="getLevelColor(exerciseDetails.level)" size="small" class="font-weight-medium">
                    {{ exerciseDetails.level }}
                  </v-chip>
                </v-list-item-subtitle>
              </v-list-item>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6"> <!-- Apply bg-grey-lighten-5 and rounded-lg to the v-col -->
            <v-card class="info-card" rounded="lg" flat>
              <v-list-item>
                <v-list-item-title class="font-weight-bold">Loại bài tập:</v-list-item-title>
                <v-list-item-subtitle>
                  <v-chip :color="getTypeColor(exerciseDetails.type)" size="small" class="font-weight-medium">
                    {{ getExerciseTypeName(exerciseDetails.type) }}
                  </v-chip>
                </v-list-item-subtitle>
              </v-list-item>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6"> <!-- Apply bg-grey-lighten-5 and rounded-lg to the v-col -->
            <v-card class="info-card" rounded="lg" flat>
              <v-list-item>
                <v-list-item-title class="font-weight-bold">Trạng thái:</v-list-item-title>
                <v-list-item-subtitle>
                  <v-chip :color="getStatusColor(exerciseDetails.status)" size="small" class="font-weight-medium">
                    {{ exerciseDetails.status === 'Published' ? 'Đã xuất bản' : exerciseDetails.status === 'Draft' ? 'Bản nháp' : exerciseDetails.status }}
                  </v-chip>
                </v-list-item-subtitle>
              </v-list-item>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6">
            <v-list-item>
              <v-list-item-title class="font-weight-bold">Tạo bởi:</v-list-item-title>
              <v-list-item-subtitle>{{ exerciseDetails.author }}</v-list-item-subtitle>
            </v-list-item>
          </v-col>
          <v-col cols="12" sm="6">
            <v-list-item>
              <v-list-item-title class="font-weight-bold">Ngày tạo:</v-list-item-title>
              <v-list-item-subtitle>{{ exerciseDetails.date }}</v-list-item-subtitle>
            </v-list-item>
          </v-col>
        </v-row>

        <v-divider class="my-4"></v-divider>

        <!-- Exercise-specific content -->
        <template v-if="exerciseDetails.type === 'matching'">
          <h3 class="text-h6 mb-2">Các cặp nối:</h3>
          <v-list dense class="matching-list">
            <v-list-item v-for="(pair, idx) in exerciseDetails.pairs" :key="idx">
              <v-list-item-content>
                <v-list-item-title class="font-weight-medium">{{ pair.left }}</v-list-item-title>
                <v-list-item-subtitle class="ml-4">- {{ pair.right }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </template>

        <template v-else-if="exerciseDetails.type === 'fill_in_the_blanks'">
          <h3 class="text-h6 mb-2">Câu có chỗ trống:</h3>
          <p class="text-body-1 mb-2" v-html="highlightBlanks(exerciseDetails.sentence)"></p>
          <p class="font-weight-medium">Đáp án đúng: <span class="text-primary">{{ exerciseDetails.correctAnswer }}</span></p>
          <p v-if="exerciseDetails.hint" class="text-body-2">Gợi ý: {{ exerciseDetails.hint }}</p>
        </template>

        <template v-else-if="exerciseDetails.type === 'multiple_choice'">
          <h3 class="text-h6 mb-2">Câu hỏi:</h3>
          <p class="text-body-1 mb-2">{{ exerciseDetails.question }}</p>
          <h3 class="text-h6 mb-2">Các lựa chọn:</h3>
          <v-list dense>
            <v-list-item v-for="(option, idx) in exerciseDetails.options" :key="idx">
              <v-list-item-content>
                <v-list-item-title :class="{'text-primary font-weight-bold': option === exerciseDetails.correctAnswer}">
                  {{ String.fromCharCode(65 + idx) }}. {{ option }}
                  <v-icon v-if="option === exerciseDetails.correctAnswer" size="small" color="success" class="ml-2">fa-solid fa-check-circle</v-icon>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <p v-if="exerciseDetails.explanation" class="text-body-2 mt-4">Giải thích: {{ exerciseDetails.explanation }}</p>
        </template>

        <template v-else-if="exerciseDetails.type === 'notes'">
          <h3 class="text-h6 mb-2">Nội dung lưu ý:</h3>
          <p class="text-body-1">{{ exerciseDetails.content }}</p>
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
import { computed } from 'vue';

const props = defineProps({
  show: Boolean,
  exerciseDetails: Object, // The exercise object to display
});

const emit = defineEmits(['update:show']);

const closeDialog = () => {
  emit('update:show', false);
};

// Helper functions (copied from ExerciseManagement to keep styles consistent)
const getLevelColor = (level) => {
  switch (level) {
    case 'N5': return 'green-lighten-1';
    case 'N4': return 'light-blue-lighten-1';
    case 'N3': return 'teal-lighten-1';
    case 'N2': return 'orange-lighten-1';
    case 'N1': return 'red-lighten-1';
    case 'All': return 'blue-grey-lighten-1';
    default: return 'grey';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Published': return 'success';
    case 'Draft': return 'blue-grey-lighten-1';
    case 'Archived': return 'grey-darken-1';
    default: return 'grey';
  }
};

const getExerciseTypeName = (type) => {
  switch (type) {
    case 'matching': return 'Nối nghĩa';
    case 'fill_in_the_blanks': return 'Điền từ';
    case 'multiple_choice': return 'Chọn từ';
    case 'notes': return 'Lưu ý';
    default: return 'Không xác định';
  }
};

const getTypeColor = (type) => {
  switch (type) {
    case 'matching': return 'blue-grey-lighten-3';
    case 'fill_in_the_blanks': return 'light-green-lighten-3';
    case 'multiple_choice': return 'purple-lighten-3';
    case 'notes': return 'brown-lighten-3';
    default: return 'grey-lighten-1';
  }
};

function highlightBlanks(sentence) {
  return sentence.replace(/___/g, '<span style="font-weight: bold; color: #1a73e8; text-decoration: underline;">___</span>');
}
</script>

<style scoped>
/* Add any specific styles for this dialog if needed */
.matching-list .v-list-item-title {
  display: inline-block;
  min-width: 120px; /* Adjust as needed for alignment */
}

/* Style for the info cards */
.info-card {
  background-color: #F8F8F8; /* A very light grey background */
  border: 1px solid #E0E0E0; /* Light border */
}

.info-card .v-list-item {
  padding: 8px 16px; /* Adjust padding inside the list item if necessary */
}
</style>
