<template>
  <div class="admin-page-container">
    <div class="page-header">
      <h1 class="page-title">
        <i class="bi bi-fonts icon"></i> Quản lý Luyện viết Bảng chữ cái
      </h1>
    </div>

    <div class="tabs-container">
      <button 
        :class="['tab-button', { 'active': activeTab === 'hiragana' }]"
        @click="activeTab = 'hiragana'">
        Hiragana
      </button>
      <button 
        :class="['tab-button', { 'active': activeTab === 'katakana' }]"
        @click="activeTab = 'katakana'">
        Katakana
      </button>
      <button 
        :class="['tab-button', { 'active': activeTab === 'kanji' }]"
        @click="activeTab = 'kanji'">
        Kanji
      </button>
    </div>

    <div class="tab-content">
      <div v-if="activeTab === 'hiragana'">
        <KanaTable :chars="hiragana" type="Hiragana" />
      </div>
      <div v-else-if="activeTab === 'katakana'">
        <KanaTable :chars="katakana" type="Katakana" />
      </div>
      <div v-else-if="activeTab === 'kanji'">
        <KanjiTable />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getHiragana, getKatakana } from "../../services/alphabetService.js";
import KanaTable from "../character/KanaTable.vue";
import KanjiTable from "../character/KanjiTable.vue";

const activeTab = ref('kanji');
const hiragana = getHiragana();
const katakana = getKatakana();
</script>

<style scoped>
.admin-page-container {
  padding: 30px;
  background-color: #eef2f9; /* Màu nền nhẹ nhàng hơn */
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
.page-header {
  margin-bottom: 25px;
  text-align: center;
}
.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  display: inline-flex;
  align-items: center;
  gap: 15px;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
}
.icon {
  font-size: 2.2rem;
  color: #3498db;
}
.tabs-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  background-color: #dbe4f1;
  border-radius: 12px;
  padding: 5px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}
.tab-button {
  background-color: transparent;
  border: none;
  padding: 12px 30px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  color: #555;
  transition: all 0.3s ease;
  border-radius: 10px;
}
.tab-button.active {
  background-color: #ffffff;
  color: #3498db;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.tab-button:hover {
  color: #3498db;
}
.tab-content {
  background-color: #ffffff;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}
</style>