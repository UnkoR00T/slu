import { defineStore } from 'pinia'
import { mainGameType } from '@/types/mainGameType.ts'
import { ref, type Ref } from 'vue'

export const useMainData = defineStore('main', () => {
  const tempStorage: Ref<mainGameType> = ref({
    guestTeam: {
      name: "",
      players: [],
      trainers: []
    }, hostTeam: {
      name: "",
      players: [],
      trainers: []
    }
  });

  const save = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const json = JSON.stringify(tempStorage.value);
      console.log(json);
      localStorage.setItem('mainData', json);
      resolve(true);
    })
  }

  const load = (): Promise<mainGameType> => {
    return new Promise((resolve, reject) => {
      const json = localStorage.getItem('mainData');
      if (json) {
        const temp = JSON.parse(json);
        tempStorage.value = temp;
        resolve(temp);
      }
      reject("Failed to load main data");
    })
  }

  return { tempStorage, save, load }
})
