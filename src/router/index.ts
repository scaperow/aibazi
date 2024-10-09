import { createRouter, createWebHashHistory} from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/show/:year/:month/:day/:hour/:gender/:mode',
      name: 'show',
      component: import('../views/Show.vue')
    },
    {
      path: '/',
      name: 'main',
      component: ()=> import('../views/Home.vue')
    }
  ]
})  

export default router
