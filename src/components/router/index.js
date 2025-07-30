import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "root",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/components/admin/LoginView.vue"),
  },
  {
    path: "/admin",
    component: () => import("../layout/AdminLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/components/admin/DashboardView.vue"),
      },
      {
        path: "statistics",
        name: "Statistics",
        component: () => import("@/components/admin/StatisticsView.vue"),
      },
      {
        path: "topic",
        name: "Topic",
        component: () => import("@/components/admin/LessonByTopicView.vue"),
      },
      {
        path: "personal-path",
        name: "Personal-path",
        component: () => import("@/components/admin/LearningPathView.vue"),
      },
      {
        path: "badges",
        name: "Badges",
        component: () => import("@/components/admin/BadgesView.vue"),
      },
      {
        path: "reminders",
        name: "Reminders",
        component: () => import("@/components/admin/RemindersView.vue"),
      },
      {
        path: "entertainment",
        name: "Entertainment",
        component: () => import("@/components/admin/EntertainmentView.vue"),
      },
      {
        path: "community",
        name: "Community",
        component: () => import("@/components/admin/CommunityView.vue"),
      },
      {
        path: "packages",
        name: "Packages",
        component: () => import("@/components/admin/SubscriptionPlansView.vue"),
      },
      {
        path: "settings-general",
        name: "Settings-general",
        component: () => import("@/components/admin/GeneralSettingsView.vue"),
      },
      {
        path: "question/:lessonId",
        name: "question",
        component: () => import("@/components/admin/QuestionView.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuth = localStorage.getItem("isLogin") === "true";
  if (to.meta.requiresAuth && !isAuth) next("/login");
  else next();
});

export default router;
