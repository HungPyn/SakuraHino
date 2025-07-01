<template>
  <router-view />
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
});
</script>

<style>
/* Global CSS is imported here to apply to the entire application */
@import '@/assets/css/global.css';
/* Google Font import is already in public/index.html for optimal loading */
</style>
