<script setup lang="ts">

import { useMainData } from '@/stores/mainDataStore.ts'
import type { playerType } from '@/types/playerType.ts'
import { ref, type Ref } from 'vue'

const mainDataStore = useMainData();

const editTeam: Ref<number> = ref(0);
const editIndex: Ref<number> = ref(-1);

const hostTeamName: Ref<string> = ref("");
const guestTeamName: Ref<string> = ref("");
const hostTeamPlayers: Ref<playerType[]> = ref([]);
const guestTeamPlayers: Ref<playerType[]> = ref([]);
const hostTeamTrainers: Ref<string[]> = ref([]);
const guestTeamTrainers: Ref<string[]> = ref([]);
mainDataStore.data.load().then((res) => {
  hostTeamName.value = res.hostTeam.name;
  guestTeamName.value = res.guestTeam.name;

  hostTeamPlayers.value = res.hostTeam.players;
  guestTeamPlayers.value = res.guestTeam.players;

  hostTeamTrainers.value = res.hostTeam.trainers;
  guestTeamTrainers.value = res.guestTeam.trainers;
});

const save = async () => {
  try{
    mainDataStore.tempStorage.hostTeam.name = hostTeamName.value;
    mainDataStore.tempStorage.guestTeam.name = guestTeamName.value;

    mainDataStore.tempStorage.hostTeam.players = hostTeamPlayers.value;
    mainDataStore.tempStorage.guestTeam.players = guestTeamPlayers.value;

    mainDataStore.tempStorage.hostTeam.trainers = hostTeamTrainers.value;
    mainDataStore.tempStorage.guestTeam.trainers = guestTeamTrainers.value;

    await mainDataStore.data.save();
    alert("Saved")
  }catch(e){
    alert("Error: " + e);
  }
}

const addPlayer = (team: number) => {
  if (team == 1){
    hostTeamPlayers.value.push({
      number: -1,
      name: "",
      capitan: false,
      goalkeeper: false,
      license: ""
    });
    editTeam.value = team;
    editIndex.value = hostTeamPlayers.value.length -1;
  }else{
    guestTeamPlayers.value.push({
      number: -1,
      name: "",
      capitan: false,
      goalkeeper: false,
      license: ""
    })
    editTeam.value = team;
    editIndex.value = guestTeamPlayers.value.length -1;
  }
}
const edit = (team: number, index: number) => {
  if(editTeam.value == team && editIndex.value == index){
    editTeam.value = 0;
    editIndex.value = -1;
  }else{
    editTeam.value = team;
    editIndex.value = index;
  }
}
const remove = (team:number, index:number) => {
  if(confirm("Are you sure?")){
    if (team == 1){
      hostTeamPlayers.value.splice(index, 1);
    }else if (team == 2){
      guestTeamPlayers.value.splice(index, 1);
    }else if (team == 3){
      hostTeamTrainers.value.splice(index, 1);
    }else{
      guestTeamTrainers.value.splice(index, 1);
    }
  }
}

const clear = () => {
  if(confirm("Are you sure?")){
    localStorage.removeItem("mainData");
    window.location.reload();
  }
}

const addTrainer = (team: number) => {
  if(team == 1){
    hostTeamTrainers.value.push("");
    edit(3, hostTeamTrainers.value.length - 1);
  }else{
    guestTeamTrainers.value.push("");
    edit(4, guestTeamTrainers.value.length - 1);
  }
}

</script>

<template>
  <main>
    <div class="teamPrep">
      <div class="teamName mb-2">
        <h1 class="text-lg">Host's:</h1>
        <input type="text" v-model="hostTeamName" class="border rounded px-1">
      </div>
      <ul class="grid">
        <li
          v-for="(player, index) in hostTeamPlayers" v-bind:key="index"
          class="flex"
        >
          <button
            class="textInteractable border border-blue-600 text-blue-600 px-3 hover:text-white hover:bg-blue-600"
            :class="{'rounded-bl': index == hostTeamPlayers.length - 1, 'rounded-tl': index === 0}"
            @click="edit(1, index)">Edit</button>
          <button
            class="textInteractable border border-red-600 text-red-600 border-l-0 px-3 hover:text-white hover:bg-red-600 mr-2"
            :class="{'rounded-br': index == hostTeamPlayers.length - 1, 'rounded-tr': index === 0}"
            @click="remove(1, index)">Delete</button>
          <span v-if="editTeam === 1 && editIndex === index" id="inputNumber">
            <input
              type="number"
              name="playerNumber"
              id="playerNumber"
              v-model="hostTeamPlayers[index].number"
              placeholder="Player's number"
              class="border"
              :class="{'rounded-bl': index == hostTeamPlayers.length - 1, 'rounded-tl': index === 0}"
            >
          </span>
          <span v-else id="inputNumber"
                class="border"
                :class="{'rounded-bl': index == hostTeamPlayers.length - 1, 'rounded-tl': index === 0}"
          >{{player.number}}</span>

          <span v-if="editTeam === 1 && editIndex === index" id="inputPlayerName">
            <input
              type="text"
              name="playerName"
              id="playerName"
              v-model="hostTeamPlayers[index].name"
              placeholder="Player's name"
              class="border"
            >
          </span>
          <span v-else id="inputPlayerName" class="border">{{player.name}}</span>

          <span v-if="editTeam === 1 && editIndex === index" class="border px-2" id="inputCapitan">
            Capitan: <input
            type="checkbox"
            name="playerCapitan"
            id="playerCapitan"
            v-model="hostTeamPlayers[index].capitan"
          >
          </span>
          <span v-else id="inputCapitan" class="border">C: {{player.capitan ? "YES" : "NO"}}</span>

          <span v-if="editTeam === 1 && editIndex === index" class="border px-2" id="inputGoalkeeper">
            Goalkeeper: <input
            type="checkbox"
            name="playerGoalkeeper"
            id="playerGoalkeeper"
            v-model="hostTeamPlayers[index].goalkeeper"
          >
          </span>
          <span v-else id="inputGoalkeeper" class="border">G: {{player.goalkeeper ? "YES" : "NO"}}</span>

          <span v-if="editTeam === 1 && editIndex === index" id="inputPlayerLicense">
            <input
              type="text"
              name="playerLicense"
              id="playerLicense"
              v-model="hostTeamPlayers[index].license"
              placeholder="License"
              class="border"
              :class="{'rounded-br': index == hostTeamPlayers.length - 1, 'rounded-tr': index === 0}"
            >
          </span>
          <span v-else id="inputPlayerLicense"
                class="border"
                :class="{'rounded-br': index == hostTeamPlayers.length - 1, 'rounded-tr': index === 0}"
          >{{player.license}}</span>
        </li>
        <li><span class="textInteractable text-blue-600" @click="addPlayer(1)">+ Add player</span></li>
      </ul>
      <ul class="grid">
        <li v-for="(trainer, index) in hostTeamTrainers" class="flex" v-bind:key="index">
          <button
            class="textInteractable border border-blue-600 text-blue-600 px-3 hover:text-white hover:bg-blue-600"
            :class="{'rounded-bl': index == hostTeamTrainers.length - 1, 'rounded-tl': index === 0}"
            @click="edit(3, index)">Edit</button>
          <button
            class="textInteractable border border-red-600 text-red-600 border-l-0 px-3 hover:text-white hover:bg-red-600 mr-2"
            :class="{'rounded-br': index == hostTeamTrainers.length - 1, 'rounded-tr': index === 0}"
            @click="remove(3, index)">Delete</button>
          <span v-if="editTeam === 3 && editIndex === index" id="inputPlayerName">
            <input
              type="text"
              name="trainerName"
              id="trainerName"
              v-model="hostTeamTrainers[index]"
              placeholder="Trainer's name"
              class="border"
              :class="{'rounded-bl': index == hostTeamTrainers.length - 1, 'rounded-tl': index === 0, 'rounded-br': index == hostTeamTrainers.length - 1, 'rounded-tr': index === 0}"
            >
          </span>
          <span v-else id="inputPlayerName"
                class="border"
                :class="{'rounded-bl': index == hostTeamTrainers.length - 1, 'rounded-tl': index === 0, 'rounded-br': index == hostTeamTrainers.length - 1, 'rounded-tr': index === 0}"
          >{{trainer != "" ? trainer : "None"}}</span>
        </li>
        <li><span class="textInteractable text-blue-600" @click="addTrainer(1)">+ Add trainer</span></li>
      </ul>
    </div>
    <div class="teamPrep">
      <div class="teamName mb-2">
        <h1 class="text-lg">Guest's:</h1>
        <input type="text" v-model="guestTeamName" class="border rounded px-1">
      </div>
      <ul class="grid">
        <li
          v-for="(player, index) in guestTeamPlayers" v-bind:key="index"
          class="flex"
        >
          <button
            class="textInteractable border border-blue-600 text-blue-600 px-3 hover:text-white hover:bg-blue-600"
            :class="{'rounded-bl': index == guestTeamPlayers.length - 1, 'rounded-tl': index === 0}"
            @click="edit(2, index)">Edit</button>
          <button
            class="textInteractable border border-red-600 text-red-600 border-l-0 px-3 hover:text-white hover:bg-red-600 mr-2"
            :class="{'rounded-br': index == guestTeamPlayers.length - 1, 'rounded-tr': index === 0}"
            @click="remove(2, index)">Delete</button>
          <span v-if="editTeam === 2 && editIndex === index" id="inputNumber">
            <input
              type="number"
              name="playerNumber"
              id="playerNumber"
              v-model="guestTeamPlayers[index].number"
              placeholder="Player's number"
              class="border"
              :class="{'rounded-bl': index == guestTeamPlayers.length - 1, 'rounded-tl': index === 0}"
            >
          </span>
          <span v-else id="inputNumber"
                class="border"
                :class="{'rounded-bl': index == guestTeamPlayers.length - 1, 'rounded-tl': index === 0}"
          >{{player.number}}</span>

          <span v-if="editTeam === 2 && editIndex === index" id="inputPlayerName">
            <input
              type="text"
              name="playerName"
              id="playerName"
              v-model="guestTeamPlayers[index].name"
              placeholder="Player's name"
              class="border"
            >
          </span>
          <span v-else id="inputPlayerName" class="border">{{player.name}}</span>

          <span v-if="editTeam === 2 && editIndex === index" class="border px-2" id="inputCapitan">
            Capitan: <input
            type="checkbox"
            name="playerCapitan"
            id="playerCapitan"
            v-model="guestTeamPlayers[index].capitan"
          >
          </span>
          <span v-else id="inputCapitan" class="border">C: {{player.capitan ? "YES" : "NO"}}</span>

          <span v-if="editTeam === 2 && editIndex === index" class="border px-2" id="inputGoalkeeper">
            Goalkeeper: <input
            type="checkbox"
            name="playerGoalkeeper"
            id="playerGoalkeeper"
            v-model="guestTeamPlayers[index].goalkeeper"
          >
          </span>
          <span v-else id="inputGoalkeeper" class="border">G: {{player.goalkeeper ? "YES" : "NO"}}</span>

          <span v-if="editTeam === 2 && editIndex === index" id="inputPlayerLicense">
            <input
              type="text"
              name="playerLicense"
              id="playerLicense"
              v-model="guestTeamPlayers[index].license"
              placeholder="License"
              class="border"
              :class="{'rounded-br': index == guestTeamPlayers.length - 1, 'rounded-tr': index === 0}"
            >
          </span>
          <span v-else id="inputPlayerLicense"
                class="border"
                :class="{'rounded-br': index == guestTeamPlayers.length - 1, 'rounded-tr': index === 0}"
          >{{player.license}}</span>
        </li>
        <li><span class="textInteractable text-blue-600" @click="addPlayer(2)">+ Add player</span></li>
      </ul>
      <ul class="grid">
        <li v-for="(trainer, index) in guestTeamTrainers" class="flex" v-bind:key="index">
          <button
            class="textInteractable border border-blue-600 text-blue-600 px-3 hover:text-white hover:bg-blue-600"
            :class="{'rounded-bl': index == guestTeamTrainers.length - 1, 'rounded-tl': index === 0}"
            @click="edit(4, index)">Edit</button>
          <button
            class="textInteractable border border-red-600 text-red-600 border-l-0 px-3 hover:text-white hover:bg-red-600 mr-2"
            :class="{'rounded-br': index == guestTeamTrainers.length - 1, 'rounded-tr': index === 0}"
            @click="remove(4, index)">Delete</button>
          <span v-if="editTeam === 4 && editIndex === index" id="inputPlayerName">
            <input
              type="text"
              name="trainerName"
              id="trainerName"
              v-model="guestTeamTrainers[index]"
              placeholder="Trainer's name"
              class="border"
              :class="{'rounded-bl': index == guestTeamTrainers.length - 1, 'rounded-tl': index === 0, 'rounded-br': index == guestTeamTrainers.length - 1, 'rounded-tr': index === 0}"
            >
          </span>
          <span v-else id="inputPlayerName"
                class="border"
                :class="{'rounded-bl': index == guestTeamTrainers.length - 1, 'rounded-tl': index === 0, 'rounded-br': index == guestTeamTrainers.length - 1, 'rounded-tr': index === 0}"
          >{{trainer != "" ? trainer : "None"}}</span>
        </li>
        <li><span class="textInteractable text-blue-600" @click="addTrainer(2)">+ Add trainer</span></li>
      </ul>
    </div>
    <div class="buttons flex gap-3 mt-5">
      <button
        class="border rounded-full p-2 duration-200 border-sky-500 bg-sky-500 hover:bg-sky-600 hover:border-sky-600 dark:border-sky-700 dark:bg-sky-700 dark:text-white"
        @click="save()">
        <img class="h-10" src="../../public/save_icon.png">
      </button>
      <button
        class="border rounded-full p-2 duration-200 border-red-500 bg-red-500 hover:bg-red-600 hover:border-red-600 dark:border-red-700 dark:bg-red-700 dark:text-white"
        @click="clear()">
        <img class="h-10" src="../../public/trash_icon.png">
      </button>
    </div>
  </main>
</template>

<style scoped>
span#inputNumber{
  width: 50px;
}
span#inputNumber > input{
  width: 100%;
}
span#inputPlayerName{
  width: 200px;
}
span#inputPlayerName > input{
  width: 100%;
}
span#inputCapitan{
  width: 150px;
}
span#inputGoalkeeper{
  width: 150px;
}
span#inputPlayerLicense{
  width: 100px;
}
span#inputPlayerLicense > input{
  width: 100%;
}
.textInteractable{
  cursor: pointer;
}
.textInteractable:hover{
  text-decoration: underline;
}
ul{
  list-style-type: none;
}
span{
  line-height: 36px;
}
input[type="number"]{
  width: 50px;
}
</style>
