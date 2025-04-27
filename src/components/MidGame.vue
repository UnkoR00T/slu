<script setup lang="ts">
import { useMainData } from '@/stores/mainDataStore.ts'
import { mainGameType } from '@/types/mainGameType.ts'
import { ref, type Ref } from 'vue'
import type { goalType } from '@/types/goalType.ts'
import type { foulType } from '@/types/foulType.ts';

const mainDataStore = useMainData();

const editGoalTeam: Ref<number> = ref(0);
const editGoalIndex: Ref<number> = ref(-1);

const hostTeamGoals = ref([] as goalType[]);
const guestTeamGoals = ref([] as goalType[]);

const hostPlayers = ref(mainDataStore.tempStorage.hostTeam.players);
const guestPlayers = ref(mainDataStore.tempStorage.guestTeam.players);

let hostGoalCounter = 1;
let guestGoalCounter = 1;

mainDataStore.data.load().then((res: mainGameType) => {
  hostTeamGoals.value = res.hostTeam.goals;
  guestTeamGoals.value = res.guestTeam.goals;

  hostPlayers.value = res.hostTeam.players;
  guestPlayers.value = res.guestTeam.players;

  hostGoalCounter = res.hostTeam.goals.length;
  guestGoalCounter = res.guestTeam.goals.length;
})

const addGoal = (team: number) => {
  const newGoal: goalType = {
    goalNumber: team === 1 ? hostGoalCounter++ : guestGoalCounter++,
    playerId: 'wrong',
    assistId: 'wrong',
    time: 0,
    code: "wrong",
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

const saveForm = async () => {
  try {
    for (const goal of hostTeamGoals.value) {
      await mainDataStore.goals.add(1, goal.playerId, goal.assistId, goal.time, goal.code);
    }

    for (const goal of guestTeamGoals.value) {
      await mainDataStore.goals.add(2, goal.playerId, goal.assistId, goal.time, goal.code);
    }

    for (const foul of hostTeamFouls.value) {
      await mainDataStore.fouls.add(1, foul.playerId, foul.time, foul.code, foul.start, foul.end);
    }

    for (const foul of guestTeamFouls.value) {
      await mainDataStore.fouls.add(2, foul.playerId, foul.time, foul.code, foul.start, foul.end);
    }

    alert("Saved");
  } catch (e) {
    alert(`Error: ${e}`);
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

const editFoulTeam: Ref<number> = ref(0);
const editFoulIndex: Ref<number> = ref(-1);

const hostTeamFouls = ref([] as foulType[]);
const guestTeamFouls = ref([] as foulType[]);

mainDataStore.data.load().then((res) => {
  hostTeamFouls.value = res.hostTeam.fouls;
  guestTeamFouls.value = res.guestTeam.fouls;
});

const addFoul = (team: number) => {
  const newFoul: foulType = {
    playerId: 'wrong',
    time: 0,
    code: 'wrong',
    start: 0,
    end: 0,
  };

  if (team === 1) {
    hostTeamFouls.value.push(newFoul);
    editFoulTeam.value = team;
    editFoulIndex.value = hostTeamFouls.value.length - 1;
  } else {
    guestTeamFouls.value.push(newFoul);
    editFoulTeam.value = team;
    editFoulIndex.value = guestTeamFouls.value.length - 1;
  }
};

const removeFoul = (team: number, index: number) => {
  if (confirm('Are you sure?')) {
    if (team === 1) {
      hostTeamFouls.value.splice(index, 1);
    } else {
      guestTeamFouls.value.splice(index, 1);
    }
  }
};
</script>

<template>
  <h1>Mid Game</h1>
  <div class="teamSeparator">
    <div class="teamSection">
      <h2>Host Team</h2>
      <div class="flex">
        <div class="goals">
          <h3>Goals</h3>
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
                <select v-model="goal.playerId" class="border mr-2">
                  <option v-for="player in hostPlayers" :key="player.number" :value="player.number">
                    {{ player.number }} - {{player.name}}
                  </option>
                  <option value="wrong" disabled>NR</option>
                </select>
                <select v-model="goal.assistId" class="border mr-2">
                  <option v-for="player in hostPlayers" :key="player.number" :value="player.number">
                    {{ player.number }} - {{player.name}}
                  </option>
                  <option value="wrong" disabled>ASIST</option>
                </select>
                <input
                  type="time"
                  v-model="goal.time"
                  placeholder="Time"
                  class="border mr-2"
                />
                <select v-model="goal.code" class="border mr-2">
                  <option value="wrong" disabled>KOD</option>
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
                Goal: {{ goal.goalNumber }} |
                Player: {{ goal.playerId }} |
                Assist: {{ goal.assistId === 'none' ? 'None' : goal.assistId }} |
                Time: {{ goal.time }} |
                Code: {{ goal.code === 'custom' ? goal.customCode : goal.code }}
              </div>
            </li>
            <li><button @click="addGoal(1)" class="textInteractable" style="color: blue;">+ Add Goal</button></li>
          </ul>
        </div>
        <div class="fouls">
          <h3>Fouls</h3>
          <ul>
            <li v-for="(foul, index) in hostTeamFouls" :key="index" class="flex">
              <button
                class="textInteractable border border-blue-600 text-blue-600 px-3 hover:text-white hover:bg-blue-600"
                @click="editFoulTeam === 1 && editFoulIndex === index ? (editFoulTeam = 0, editFoulIndex = -1) : (editFoulTeam = 1, editFoulIndex = index)">
                {{ editFoulTeam === 1 && editFoulIndex === index ? "Save" : "Edit" }}
              </button>
              <button
                class="textInteractable border border-red-600 text-red-600 border-l-0 px-3 hover:text-white hover:bg-red-600 mr-2"
                @click="removeFoul(1, index)">
                Delete
              </button>
              <div v-if="editFoulTeam === 1 && editFoulIndex === index">
                <select v-model="foul.playerId" class="border mr-2">
                  <option v-for="player in hostPlayers" :key="player.number" :value="player.number">
                    {{ player.number }} - {{ player.name }}
                  </option>
                  <option value="wrong">NR</option>
                </select>
                <input
                  type="number"
                  v-model="foul.time"
                  placeholder="Minutes"
                  class="border mr-2"
                />
                <select v-model="foul.code" class="border mr-2">
                  <option value="wrong" selected disabled>KOD</option>
                  <option value="201">201 - Uderzenie</option>
                  <option value="201">202 - Blokowanie kija</option>
                  <option value="203">203 - Podbijanie kija</option>
                  <option value="205">205 - Wysokie kopnięcie</option>
                  <option value="206">206 - Ostra gra</option>
                  <option value="209">209 - Trzymanie</option>
                  <option value="210">210 - Przeszkadzanie</option>
                  <option value="211">211 - Nieprawidłowa odległość</option>
                  <option value="212">212 - Gra w pozycji leżącej</option>
                  <option value="213">213 - Gra ręką</option>
                  <option value="215">215 - Nieprawidłowa wymiana</option>
                  <option value="216">216 - Zbyt duża liczba zawodników na boisku</option>
                  <option value="217">217 - Powtarzające się przewinienie</option>
                  <option value="218">218 - Opóźnianie gry</option>
                  <option value="219">219 - Protest przeciwko decyzji sędziego</option>
                  <option value="220">220 - Nieprawidłowe wejście na boiskow</option>
                  <option value="221">221 - Nieprawidłowe wyposażenie</option>
                  <option value="222">222 - Mierzenie kija</option>
                  <option value="224">224 - Gra bez kija</option>
                  <option value="225">225 - Niepozbieranie złamanego kija</option>
                  <option value="501">501 - Niebezpieczna gra kijem</option>
                  <option value="502">502 - Rzucanie kijem/sprzętem</option>
                  <option value="503">503 - Hakowanie</option>
                  <option value="504">504 - Brutalna gra ciałem (2+10 MIN)</option>
                  <option value="101">101 - Niesportowe zachowanie</option>
                  <option value="102">102 - Symulacja: KARA MECZOWA (2+2+20 MIN)</option>
                  <option value="301">301 - Techniczna kara meczowa</option>
                  <option value="302">302 - Kara meczowa</option>
                  <option value="custom">CUSTOM</option>
                </select>
                <input
                  v-if="foul.code === 'custom'"
                  type="text"
                  v-model="foul.customCode"
                  placeholder="Custom Code"
                  class="border mr-2"
                />
                <input
                  type="time"
                  v-model="foul.start"
                  placeholder="Start Time"
                  class="border mr-2"
                />
                <input
                  type="time"
                  v-model="foul.end"
                  placeholder="End Time"
                  class="border"
                />
              </div>
              <div v-else>
                Player: {{ foul.playerId }} |
                Time: {{ foul.time }} min |
                Code: {{ foul.code === 'custom' ? foul.customCode : foul.code }} |
                Start: {{ foul.start }} |
                End: {{ foul.end }}
              </div>
            </li>
            <li>
              <button @click="addFoul(1)" class="textInteractable" style="color: blue;">+ Add Foul</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="teamSection">
      <h2>Guest Team</h2>
      <div class="flex">
        <div class="goals">
          <h3>Goals</h3>
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
                <select v-model="goal.playerId" class="border mr-2">
                  <option v-for="player in guestPlayers" :key="player.number" :value="player.number">
                    {{ player.number }} - {{player.name}}
                  </option>
                  <option value="wrong" disabled>NR</option>
                </select>
                <select v-model="goal.assistId" class="border mr-2">
                  <option v-for="player in guestPlayers" :key="player.number" :value="player.number">
                    {{ player.number }} - {{player.name}}
                  </option>
                  <option value="wrong" disabled>ASIST</option>
                </select>
                <input
                  type="time"
                  v-model="goal.time"
                  placeholder="Time"
                  class="border mr-2"
                />
                <select v-model="goal.code" class="border mr-2">
                  <option value="wrong" selected disabled>KOD</option>
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
                Goal: {{ goal.goalNumber }} |
                Player: {{ goal.playerId }} |
                Assist: {{ goal.assistId === 'none' ? 'None' : goal.assistId }} |
                Time: {{ goal.time }} |
                Code: {{ goal.code === 'custom' ? goal.customCode : goal.code }}
              </div>
            </li>
            <li><button @click="addGoal(2)" class="textInteractable" style="color: blue;">+ Add Goal</button></li>
          </ul>
        </div>
        <div class="fouls">
          <h3>Fouls</h3>
          <ul>
            <li v-for="(foul, index) in guestTeamFouls" :key="index" class="flex">
              <button
                class="textInteractable border border-blue-600 text-blue-600 px-3 hover:text-white hover:bg-blue-600"
                @click="editFoulTeam === 2 && editFoulIndex === index ? (editFoulTeam = 0, editFoulIndex = -1) : (editFoulTeam = 2, editFoulIndex = index)">
                {{ editFoulTeam === 2 && editFoulIndex === index ? "Save" : "Edit" }}
              </button>
              <button
                class="textInteractable border border-red-600 text-red-600 border-l-0 px-3 hover:text-white hover:bg-red-600 mr-2"
                @click="removeFoul(2, index)">
                Delete
              </button>
              <div v-if="editFoulTeam === 2 && editFoulIndex === index">
                <select v-model="foul.playerId" class="border mr-2">
                  <option v-for="player in guestPlayers" :key="player.number" :value="player.number">
                    {{ player.number }} - {{ player.name }}
                  </option>
                  <option value="wrong">NR</option>
                </select>
                <input
                  type="number"
                  v-model="foul.time"
                  placeholder="Minutes"
                  class="border mr-2"
                />
                <select v-model="foul.code" class="border mr-2">
                  <option value="wrong" selected disabled>KOD</option>
                  <option value="201">201 - Uderzenie</option>
                  <option value="201">202 - Blokowanie kija</option>
                  <option value="203">203 - Podbijanie kija</option>
                  <option value="205">205 - Wysokie kopnięcie</option>
                  <option value="206">206 - Ostra gra</option>
                  <option value="209">209 - Trzymanie</option>
                  <option value="210">210 - Przeszkadzanie</option>
                  <option value="211">211 - Nieprawidłowa odległość</option>
                  <option value="212">212 - Gra w pozycji leżącej</option>
                  <option value="213">213 - Gra ręką</option>
                  <option value="215">215 - Nieprawidłowa wymiana</option>
                  <option value="216">216 - Zbyt duża liczba zawodników na boisku</option>
                  <option value="217">217 - Powtarzające się przewinienie</option>
                  <option value="218">218 - Opóźnianie gry</option>
                  <option value="219">219 - Protest przeciwko decyzji sędziego</option>
                  <option value="220">220 - Nieprawidłowe wejście na boiskow</option>
                  <option value="221">221 - Nieprawidłowe wyposażenie</option>
                  <option value="222">222 - Mierzenie kija</option>
                  <option value="224">224 - Gra bez kija</option>
                  <option value="225">225 - Niepozbieranie złamanego kija</option>
                  <option value="501">501 - Niebezpieczna gra kijem</option>
                  <option value="502">502 - Rzucanie kijem/sprzętem</option>
                  <option value="503">503 - Hakowanie</option>
                  <option value="504">504 - Brutalna gra ciałem (2+10 MIN)</option>
                  <option value="101">101 - Niesportowe zachowanie</option>
                  <option value="102">102 - Symulacja: KARA MECZOWA (2+2+20 MIN)</option>
                  <option value="301">301 - Techniczna kara meczowa</option>
                  <option value="302">302 - Kara meczowa</option>
                  <option value="custom">CUSTOM</option>
                </select>
                <input
                  v-if="foul.code === 'custom'"
                  type="text"
                  v-model="foul.customCode"
                  placeholder="Custom Code"
                  class="border mr-2"
                />
                <input
                  type="time"
                  v-model="foul.start"
                  placeholder="Start Time"
                  class="border mr-2"
                />
                <input
                  type="time"
                  v-model="foul.end"
                  placeholder="End Time"
                  class="border"
                />
              </div>
              <div v-else>
                Player: {{ foul.playerId }} |
                Time: {{ foul.time }} min |
                Code: {{ foul.code === 'custom' ? foul.customCode : foul.code }} |
                Start: {{ foul.start }} |
                End: {{ foul.end }}
              </div>
            </li>
            <li>
              <button @click="addFoul(2)" class="textInteractable" style="color: blue;">+ Add Foul</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <div class="buttons flex gap-3 mt-5">
    <button
      class="border rounded-full p-2 duration-200 border-sky-500 bg-sky-500 hover:bg-sky-600 hover:border-sky-600 dark:border-sky-700 dark:bg-sky-700 dark:text-white"
      @click="saveForm()">
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

.teamSeparator {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.teamSection {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.flex {
  display: flex;
  gap: 20px;
}

.goals,
.fouls {
  flex: 1;
}
</style>
