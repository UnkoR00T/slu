<script setup lang="ts">

import { useMainData } from '@/stores/mainDataStore.ts'
import { ref, type Ref } from 'vue'
import type { goalType } from '@/types/goalType.ts'

const mainDataStore = useMainData();

const editGoalTeam: Ref<number> = ref(0);
const editGoalIndex: Ref<number> = ref(-1);

const hostTeamGoals = ref<goalType[]>([]);
const guestTeamGoals = ref<goalType[]>([]);

const hostPlayers = ref(mainDataStore.tempStorage.hostTeam.players);
const guestPlayers = ref(mainDataStore.tempStorage.guestTeam.players);

let hostGoalCounter = 1;
let guestGoalCounter = 1;

const addGoal = (team: number) => {
  const newGoal: goalType = {
    goalNumber: team === 1 ? hostGoalCounter++ : guestGoalCounter++,
    playerId: -1,
    assistId: 'none',
    time: "",
    code: "",
  };

  if (team === 1) {
    hostTeamGoals.value.push(newGoal);
    editGoalTeam.value = team;
    editGoalIndex.value = hostTeamGoals.value.length - 1;
  } else {
    guestTeamGoals.value.push(newGoal);
    editGoalTeam.value = team;
    editGoalIndex.value = guestTeamGoals.value.length - 1;
  }
};

const removeGoal = (team: number, index: number) => {
  if (confirm("Are you sure?")) {
    if (team === 1) {
      hostTeamGoals.value.splice(index, 1);
      hostGoalCounter--;
      hostTeamGoals.value.forEach((goal, i) => {
        goal.goalNumber = i + 1;
      });
      hostGoalCounter = hostTeamGoals.value.length + 1;
    } else {
      guestTeamGoals.value.splice(index, 1);
      guestGoalCounter--;
      guestTeamGoals.value.forEach((goal, i) => {
        goal.goalNumber = i + 1;
      });
      guestGoalCounter = guestTeamGoals.value.length + 1;
    }
  }
};

const saveGoals = async () => {
  try {
    for (const goal of hostTeamGoals.value) {
      await mainDataStore.goals.add(1, goal.playerId, goal.assistId, goal.time, goal.code);
    }

    for (const goal of guestTeamGoals.value) {
      await mainDataStore.goals.add(2, goal.playerId, goal.assistId, goal.time, goal.code);
    }

    alert("Goals saved successfully!");
  } catch (error) {
    alert(`Error saving goals: ${error}`);
  }
};

const clear = () => {
  if (confirm("Are you sure?")) {
    hostTeamGoals.value = [];
    guestTeamGoals.value = [];
    hostGoalCounter = 1;
    guestGoalCounter = 1;
  }
};

</script>

<template>
  <h1>Mid Game</h1>
  <div class="teamSeparator flex">
    <div class="goals">
      <h2>Host Team Goals</h2>
      <ul>
        <li v-for="(goal, index) in hostTeamGoals" :key="index" class="flex">
          <button
            class="textInteractable border border-blue-600 text-blue-600 px-3 hover:text-white hover:bg-blue-600"
            @click="editGoalTeam === 1 && editGoalIndex === index ? (editGoalTeam = 0, editGoalIndex = -1) : (editGoalTeam = 1, editGoalIndex = index)">
            {{ editGoalTeam === 1 && editGoalIndex === index ? "Save" : "Edit" }}
          </button>
          <button
            class="textInteractable border border-red-600 text-red-600 border-l-0 px-3 hover:text-white hover:bg-red-600 mr-2"
            @click="removeGoal(1, index)">
            Delete
          </button>
          <div v-if="editGoalTeam === 1 && editGoalIndex === index">
            <input 
              type="text" 
              v-model="goal.time" 
              placeholder="Time" 
            />
            
            <select v-model="goal.playerId" class="border mr-2">
              <option v-for="player in hostPlayers" :key="player.number" :value="player.number">
                {{ player.number }}
              </option>
            </select>

            <select v-model="goal.assistId" class="border mr-2">
              <option v-for="player in hostPlayers" :key="player.number" :value="player.number">
                {{ player.number }}
              </option>
              <option value="none">Brak</option>
            </select>

            <select v-model="goal.code" class="border mr-2">
              <option value="PP">PP - Gra w przewadze</option>
              <option value="SH">SH - Gra w osłabieniu</option>
              <option value="ESH">ESH - Obustronna gra w osłabieniu</option>
              <option value="DP">DP - Kara opóźniona</option>
              <option value="PS">PS - Rzut karny</option>
              <option value="MPS">MPS - Niewykorzystany rzut karny</option>
              <option value="WG">WG - Gra bez bramkarza</option>
              <option value="EN">EN - Pusta bramka</option>
              <option value="OG">OG - Gol samobójczy</option>
              <option value="ET">ET - Dogrywka</option>
              <option value="custom">Custom Code</option>
            </select>
            <input
              v-if="goal.code === 'custom'"
              type="text"
              v-model="goal.customCode"
              placeholder="Custom Code"
              class="border"
            />
          </div>
          <div v-else>
            Goal: {{ goal.goalNumber }}, 
            Player: {{ goal.playerId }}, 
            Assist: {{ goal.assistId === 'none' ? 'None' : goal.assistId }}, 
            Time: {{ goal.time }}, 
            Code: {{ goal.code === 'custom' ? goal.customCode : goal.code }}
          </div>
        </li>
        <li><button @click="addGoal(1)">+ Add Goal</button></li>
      </ul>

      <h2>Guest Team Goals</h2>
      <ul>
        <li v-for="(goal, index) in guestTeamGoals" :key="index" class="flex">
          <button
            class="textInteractable border border-blue-600 text-blue-600 px-3 hover:text-white hover:bg-blue-600"
            @click="editGoalTeam === 2 && editGoalIndex === index ? (editGoalTeam = 0, editGoalIndex = -1) : (editGoalTeam = 2, editGoalIndex = index)">
            {{ editGoalTeam === 2 && editGoalIndex === index ? "Save" : "Edit" }}
          </button>
          <button
            class="textInteractable border border-red-600 text-red-600 border-l-0 px-3 hover:text-white hover:bg-red-600 mr-2"
            @click="removeGoal(2, index)">
            Delete
          </button>
          <div v-if="editGoalTeam === 2 && editGoalIndex === index">
            <input 
              type="text" 
              v-model="goal.time" 
              placeholder="Time" 
            />
            
            <select v-model="goal.playerId" class="border mr-2">
              <option v-for="player in guestPlayers" :key="player.number" :value="player.number">
                {{ player.number }}
              </option>
            </select>

            <select v-model="goal.assistId" class="border mr-2">
              <option v-for="player in guestPlayers" :key="player.number" :value="player.number">
                {{ player.number }}
              </option>
              <option value="none">Brak</option>
            </select>

            <select v-model="goal.code" class="border mr-2">
              <option value="PP">PP - Gra w przewadze</option>
              <option value="SH">SH - Gra w osłabieniu</option>
              <option value="ESH">ESH - Obustronna gra w osłabieniu</option>
              <option value="DP">DP - Kara opóźniona</option>
              <option value="PS">PS - Rzut karny</option>
              <option value="MPS">MPS - Niewykorzystany rzut karny</option>
              <option value="WG">WG - Gra bez bramkarza</option>
              <option value="EN">EN - Pusta bramka</option>
              <option value="OG">OG - Gol samobójczy</option>
              <option value="ET">ET - Dogrywka</option>
              <option value="custom">Custom Code</option>
            </select>
            <input
              v-if="goal.code === 'custom'"
              type="text"
              v-model="goal.customCode"
              placeholder="Custom Code"
              class="border"
            />
          </div>
          <div v-else>
            Goal: {{ goal.goalNumber }}, 
            Player: {{ goal.playerId }}, 
            Assist: {{ goal.assistId === 'none' ? 'None' : goal.assistId }}, 
            Time: {{ goal.time }}, 
            Code: {{ goal.code === 'custom' ? goal.customCode : goal.code }}
          </div>
        </li>
        <li><button @click="addGoal(2)">+ Add Goal</button></li>
      </ul>
    </div>
  </div>
  <div class="buttons flex gap-3 mt-5">
    <button
      class="border rounded-full p-2 duration-200 border-sky-500 bg-sky-500 hover:bg-sky-600 hover:border-sky-600 dark:border-sky-700 dark:bg-sky-700 dark:text-white"
      @click="saveGoals()">
      <img class="h-10" src="../../public/save_icon.png" alt="Save Goals">
    </button>
    <button
      class="border rounded-full p-2 duration-200 border-red-500 bg-red-500 hover:bg-red-600 hover:border-red-600 dark:border-red-700 dark:bg-red-700 dark:text-white"
      @click="clear()">
      <img class="h-10" src="../../public/trash_icon.png" alt="Clear">
    </button>
  </div>
</template>

<style scoped>
input[type="number"] {
  width: 50px;
}
input[type="text"] {
  width: 150px;
}

.textInteractable {
  cursor: pointer;
}

.textInteractable:hover {
  text-decoration: underline;
}

input[type="text"],
input[type="number"],
select {
  border: 1px solid #ccc;
  padding: 4px;
  border-radius: 4px;
}

button {
  transition: all 0.2s ease-in-out;
}

button:hover {
  transform: scale(1.05);
}
</style>
