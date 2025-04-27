import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PrepGame from '@/components/PrepGame.vue'
import InfoGame from '@/components/InfoGame.vue'
import MidGame from '@/components/MidGame.vue'
import EndGame from '@/components/EndGame.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children: [
        {
          path: "/prep",
          component: PrepGame
        },
        {
          path: "/info",
          component: InfoGame
        },
        {
          path: "/midgame",
          component: MidGame
        },
        {
          path: "/endgame",
          component: EndGame
        }
      ]
    }
  ],
})

export default router
