import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/Login.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('../layouts/MainLayout.vue'),
    redirect: '/dashboard',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../pages/Dashboard.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'posts',
        name: 'Posts',
        component: () => import('../pages/Posts.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'posts/create',
        name: 'PostCreate',
        component: () => import('../pages/PostEdit.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'posts/edit/:id',
        name: 'PostEdit',
        component: () => import('../pages/PostEdit.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'ads',
        name: 'Ads',
        component: () => import('../pages/Ads.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'ads/create',
        name: 'AdCreate',
        component: () => import('../pages/AdEdit.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'ads/edit/:id',
        name: 'AdEdit',
        component: () => import('../pages/AdEdit.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('../pages/Users.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 全局前置守卫 - 认证检查
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()

  // 检查路由是否需要认证
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth !== false)
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin === true)

  if (requiresAuth) {
    // 需要认证的路由
    if (authStore.checkAuth()) {
      // 检查是否需要管理员权限
      if (requiresAdmin && authStore.user?.role !== 'ADMIN') {
        ElMessage.error('没有权限访问该页面')
        next({ path: '/dashboard' })
        return
      }
      // 已认证，允许访问
      next()
    } else {
      // 未认证，重定向到登录页
      next({
        path: '/login',
        query: { redirect: to.fullPath }, // 保存目标路由，登录后可以跳转回来
      })
    }
  } else {
    // 不需要认证的路由
    if (to.path === '/login' && authStore.checkAuth()) {
      // 已登录用户访问登录页，重定向到首页
      next({ path: '/dashboard' })
    } else {
      next()
    }
  }
})

export default router
