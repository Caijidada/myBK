import { createRouter, createWebHistory } from "vue-router";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import AdminLayout from "@/layouts/AdminLayout.vue";

const routes = [
  {
    path: "/",
    component: DefaultLayout,
    children: [
      { path: "", component: () => import("@/pages/home/Home.vue") },
      { path: "user", component: () => import("@/pages/user/UserCenter.vue") },
    ],
  },
  {
    path: "/admin",
    component: AdminLayout,
    children: [
      { path: "", component: () => import("@/pages/admin/Dashboard.vue") },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;