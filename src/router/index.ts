import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Analyze from '../views/Analyze.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/show/:year/:month/:day/:hour/:gender',
      name: 'analyze',
      component: Analyze
    },
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
