import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/Login.vue'),
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('../layouts/MainLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../pages/Dashboard.vue'),
      },
      {
        path: 'posts',
        name: 'Posts',
        component: () => import('../pages/Posts.vue'),
      },
      {
        path: 'ads',
        name: 'Ads',
        component: () => import('../pages/Ads.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
