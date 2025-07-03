<template>
  <v-container fluid class="pa-8">
    <v-row align="center" class="mb-6">
      <v-col>
        <h1 class="text-h4 font-weight-bold">🎭 Quản lý Giải trí</h1>
        <p class="text-subtitle-1 text-grey-darken-1">
          Quản lý nội dung Manga và Game học tập
        </p>
      </v-col>
    </v-row>

    <v-card rounded="lg">
      <v-tabs v-model="tab" color="primary" align-tabs="start">
        <v-tab value="manga">
          <v-icon left class="mr-2">fa-solid fa-book-open</v-icon>
          Quản lý Manga
        </v-tab>
        <v-tab value="game">
          <v-icon left class="mr-2">fa-solid fa-gamepad</v-icon>
          Quản lý Game
        </v-tab>
      </v-tabs>
      <v-divider></v-divider>

      <v-window v-model="tab">
        <v-window-item value="manga" class="pa-4">
          <MangaManagementTab />
        </v-window-item>
        <v-window-item value="game" class="pa-4">
          <GameManagementTab />
        </v-window-item>
      </v-window>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import MangaManagementTab from "@/components/entertainment/MangaManagementTab.vue";
import GameManagementTab from "@/components/entertainment/GameManagementTab.vue";

const tab = ref("manga");
</script>
