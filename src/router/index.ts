import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PrepGame from '@/components/PrepGame.vue'
import InfoGame from '@/components/InfoGame.vue'
import MidGameGoals from '@/components/MidGameGoals.vue'
import EndGame from '@/components/EndGame.vue'
import MidGameGoalkeep from '@/components/MidGameGoalkeep.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children: [
        {
          path: '/prep',
          component: PrepGame,
        },
        {
          path: '/info',
          component: InfoGame,
        },
        {
          path: '/midgame/goals',
          component: MidGameGoals,
        },
        {
          path: '/midgame/goalkeep',
          component: MidGameGoalkeep,
        },
        {
          path: '/endgame',
          component: EndGame,
        },
      ],
    },
  ],
})

export default router
