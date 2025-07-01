<template>
  <div class="admin-layout">
    <Sidebar />
    <main class="main-content">
      <Header />
      <div class="page-content">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import Sidebar from '@/components/layout/Sidebar.vue';
import Header from '@/components/layout/Header.vue';

export default defineComponent({
  name: 'AdminLayout',
  components: {
    Sidebar,
    Header,
  },
});
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--background-light);
}

.main-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 30px;
  overflow: hidden; /* Prevents main content from causing unwanted scrollbars */
}

.page-content {
  flex-grow: 1;
  overflow-y: auto; /* Allows content within the page to scroll if it overflows */
  padding-top: 10px; /* Small space between header and actual page content */
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .admin-layout {
    flex-direction: column; /* Stack layout on smaller screens */
  }
  .main-content {
    padding: 20px; /* Adjust padding */
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 15px; /* Further adjust padding */
  }
}
</style>
