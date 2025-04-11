import { defineStore } from 'pinia'
import { mainGameType } from '@/types/mainGameType.ts'
import { ref, type Ref } from 'vue'
import type { teamType } from '@/types/teamType.ts'
import type { goalType } from '@/types/goalType.ts'
import type { foulType } from '@/types/foulType.ts'

export const useMainData = defineStore('main', () => {
  const tempStorage: Ref<mainGameType> = ref({
    guestTeam: {
      name: '',
      players: [],
      trainers: [],
      goals: [],
      fouls: []
    },
    hostTeam: {
      name: '',
      players: [],
      trainers: [],
      goals: [],
      fouls: []
    },
    gameInfo: {
      organizer: '',
      games: '',
      place: '',
      date: '2000-01-01',
      game_number: 0,
      start: '',
      end: '',
    },
  })

  const fouls = {
    add: (team: number, playerId: number, time: number, code: string, starts: string): Promise<number> => {
      return new Promise<number>((resolve, reject) => {
        if (team != 1 && team != 2) reject(`Team: ${team} isnt supported. Team should be 1 (hosts) or 2 (guests).`);
        const target: teamType = team == 1 ? tempStorage.value.hostTeam : tempStorage.value.guestTeam;
        if (!target) reject(`Failed to fetch target team.`);
        const foul: foulType = {
          playerId: playerId,
          time: time,
          code: code,
          start: starts,
          end: "",
        }
        const index = target.fouls.push(foul);
        resolve(index);
      })
    },
    endFoul: (team: number, foulIndex: number, ends: string): Promise<void> => {
      return new Promise<void>((resolve, reject) => {
        if (team != 1 && team != 2) reject(`Team: ${team} isnt supported. Team should be 1 (hosts) or 2 (guests).`);
        const target: teamType = team == 1 ? tempStorage.value.hostTeam : tempStorage.value.guestTeam;
        if (!target) reject(`Failed to fetch target team.`);
        if (!target.fouls[foulIndex]) reject(`Foul index is out of bounds.`);
        target.fouls[foulIndex].end = ends;
        resolve();
      })
    },
    remove: (team: number, foulIndex: number): Promise<void> => {
      return new Promise<void>((resolve, reject) => {
        if (team != 1 && team != 2) reject(`Team: ${team} isnt supported. Team should be 1 (hosts) or 2 (guests).`);
        const target: teamType = team == 1 ? tempStorage.value.hostTeam : tempStorage.value.guestTeam;
        if (!target) reject(`Failed to fetch target team.`);
        if (!target.fouls[foulIndex]) reject(`Foul index is out of bounds.`);
        delete(target.fouls[foulIndex]);
        resolve();
      })
    }
  }
  const goals = {
    add: (team: number, playerId: number, assistId: number, time: string, code: string): Promise<number> => {
      return new Promise<number>((resolve, reject) => {
        if (team != 1 && team != 2) reject(`Team: ${team} isnt supported. Team should be 1 (hosts) or 2 (guests).`);
        const target: teamType = team == 1 ? tempStorage.value.hostTeam : tempStorage.value.guestTeam
        const goal: goalType = {
          playerId: playerId,
          assistId: assistId,
          time: time,
          code: code,
        }
        const index = target.goals.push(goal)
        resolve(index);
      })
    },
    remove: (team: number, goalIndex: number): Promise<void> => {
      return new Promise<void>((resolve, reject) => {
        const target: teamType = team == 1 ? tempStorage.value.hostTeam : tempStorage.value.guestTeam;
        if(goalIndex >= target.goals.length) reject("Given goal index is out of bounds");
        target.goals = target.goals.filter((x, i) => i !== goalIndex);
        resolve();
      })
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
    download: (): Promise<void> => {
      return new Promise<void>((resolve, reject) => {
        const jsonString = JSON.stringify(tempStorage.value, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = tempStorage.value.gameInfo.game_number + "_" + tempStorage.value.gameInfo.organizer + ".json"; // Desired file name
        document.body.appendChild(a); // Required for Firefox
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        resolve();
      })
    }
  }

  data.load().then(res => {
    console.log("Loaded data!")
  }).catch(err => {
    alert(err + ". Generating!");
    data.save().then(() => {
      console.log("Generated and saved blank info!");
    })
  })

  return { tempStorage, data, goals, fouls }
})
