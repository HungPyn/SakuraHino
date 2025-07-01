import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'root',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/components/admin/LoginView.vue')
  },
  {
    path: '/admin',
    component: () => import('../layout/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/components/admin/DashboardView.vue')
      },
      {
        path: 'statistics',
        name: 'Statistics',
        component: () => import('@/components/admin/StatisticsView.vue')
      },
      {
        path: 'vocabulary',
        name: 'Vocabulary',
        component: () => import('@/components/admin/VocabularyView.vue')
      },
      {
        path: 'grammar',
        name: 'Grammar',
        component: () => import('@/components/admin/GrammarView.vue')
      },
       {
        path: 'exercises',
        name: 'Exercises',
        component: () => import('@/components/admin/ExerciseView.vue')
      },
       {
        path: 'listening',
        name: 'Listening',
        component: () => import('@/components/admin/AudioView.vue')
      }, {
        path: 'exams',
        name: 'Exams',
        component: () => import('@/components/admin/JLPTView.vue')
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const isAuth = localStorage.getItem('isLogin') === 'true';
  if (to.meta.requiresAuth && !isAuth) next('/login');
  else next();
});

export default router;