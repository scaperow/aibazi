import { createRouter, createWebHashHistory} from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
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
