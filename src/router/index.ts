import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/show/:year/:month/:day/:hour/:gender/:mode',
      name: 'analyze',
      component: import('../views/Analyze.vue')
    },
    {
      path: '/',
      name: 'home',
      component: ()=> import('../views/Home.vue')
    }
  ]
})

export default router
