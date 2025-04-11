import { defineStore } from 'pinia'
import { mainGameType } from '@/types/mainGameType.ts'
import { ref, type Ref } from 'vue'
import type { teamType } from '@/types/teamType.ts'
import type { goalType } from '@/types/goalType.ts'

export const useMainData = defineStore('main', () => {
  const tempStorage: Ref<mainGameType> = ref({
    guestTeam: {
      name: '',
      players: [],
      trainers: [],
      goals: [],
    },
    hostTeam: {
      name: '',
      players: [],
      trainers: [],
      goals: [],
    },
    gameInfo: {
      organizer: '',
      games: '',
      place: '',
      date: new Date().toDateString(),
      game_number: 0,
      start: '16:00',
      end: '17:00',
    },
  })
  const goals = {
    add: (team: number, playerId: number, assistId: number, time: string, code: string) => {
      const target: teamType = team == 1 ? tempStorage.value.hostTeam : tempStorage.value.guestTeam
      const goal: goalType = {
        playerId: playerId,
        assistId: assistId,
        time: time,
        code: code,
      }
      target.goals.push(goal)
    },
    remove: (team: number, goalIndex: number) => {
      const target: teamType = team == 1 ? tempStorage.value.hostTeam : tempStorage.value.guestTeam;
      target.goals = target.goals.filter((x, i) => i !== goalIndex);
    },
  }
  const data = {
    save: (): Promise<boolean> => {
      return new Promise((resolve, reject) => {
        const json = JSON.stringify(tempStorage.value)
        console.log(json)
        localStorage.setItem('mainData', json)
        resolve(true)
      })
    },

    load: (): Promise<mainGameType> => {
      return new Promise((resolve, reject) => {
        const json = localStorage.getItem('mainData')
        if (json) {
          const temp = JSON.parse(json)
          tempStorage.value = temp
          resolve(temp)
        }
        reject('Failed to load main data')
      })
    },
  }

  data.load().then(res => {
    console.log("Loaded data!")
  }).catch(err => {
    alert(err);
  })

  return { tempStorage, data, goals }
})
