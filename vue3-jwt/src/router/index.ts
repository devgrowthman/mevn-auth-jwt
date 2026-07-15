import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
// import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashbaord',
    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { 
        guest: true,
        layout: 'auth'
      }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/auth/RegisterView.vue'),
      meta: {
        guest: true,
        layout: 'auth'
      }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/dashboard/DashboardView.vue'),
      meta: {
        requiresAuth: true,
        layout: 'dashboard'
      }
    }
  ],
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  console.log('cek authStore', authStore.initialized)

  // if (!authStore.initialized) {
  //   return false
  // }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return {
      name: 'login'
    }
  }

  if (to.meta.guest && authStore.isAuthenticated) {
    return {
      name: 'dashboard'
    }
  }

  return true
})

export default router
