<template>
  <v-dialog
    :model-value="show"
    @update:model-value="closeDialog"
    max-width="500px"
    persistent
  >
    <v-card rounded="lg" elevation="8">
      <v-card-title class="pa-4 bg-error text-white">
        <v-icon left class="mr-2">fa-solid fa-triangle-exclamation</v-icon>
        <span class="text-h6 font-weight-bold">{{ title }}</span>
        <v-spacer></v-spacer>
        <v-btn icon flat @click="closeDialog">
          <v-icon color="white">fa-solid fa-xmark</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="pa-6 text-body-1 text-medium-emphasis">
        {{ message }}
      </v-card-text>

      <v-card-actions class="pa-4 bg-grey-lighten-4">
        <v-spacer></v-spacer>
        <v-btn
          color="grey-darken-1"
          variant="text"
          @click="closeDialog"
        >
          Hủy
        </v-btn>
        <v-btn
          color="error"
          variant="flat"
          @click="confirmAction"
          prepend-icon="fa-solid fa-trash"
        >
          Xác nhận xóa
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  show: Boolean,
  title: {
    type: String,
    default: 'Xác nhận hành động'
  },
  message: {
    type: String,
    default: 'Bạn có chắc chắn muốn thực hiện hành động này không?'
  },
});

const emit = defineEmits(['update:show', 'confirm', 'cancel']);

const closeDialog = () => {
  emit('update:show', false);
  emit('cancel'); // Emit cancel event
};

const confirmAction = () => {
  emit('confirm'); // Emit confirm event
  emit('update:show', false); // Close dialog after confirming
};
</script>

<style scoped>
/* Scoped styles for the dialog */
</style>
