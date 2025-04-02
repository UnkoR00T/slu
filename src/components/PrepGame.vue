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
mainDataStore.load().then((res) => {
  hostTeamName.value = res.hostTeam.name;
  guestTeamName.value = res.guestTeam.name;

  hostTeamPlayers.value = res.hostTeam.players;
  guestTeamPlayers.value = res.guestTeam.players;
});

const save = async () => {
  try{
    mainDataStore.tempStorage.hostTeam.name = hostTeamName.value;
    mainDataStore.tempStorage.guestTeam.name = guestTeamName.value;

    mainDataStore.tempStorage.hostTeam.players = hostTeamPlayers.value;
    mainDataStore.tempStorage.guestTeam.players = guestTeamPlayers.value;

    await mainDataStore.save();
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
  if (team == 1){
    hostTeamPlayers.value.splice(index, 1);
  }else{
    guestTeamPlayers.value.splice(index, 1);
  }
}

</script>

<template>
  <main>
    <div class="teamPrep">
      <div class="teamName">
        Host's:
        <input type="text" v-model="hostTeamName">
      </div>
      <ul>
        <li v-for="(player, index) in hostTeamPlayers" v-bind:key="index">
          <span class="textInteractable" @click="edit(1, index)">Edit</span>
          <span class="textInteractable" style="color: red;" @click="remove(1, index)">Delete</span>
          <span v-if="editTeam === 1 && editIndex === index"><input type="number" name="playerNumber" id="playerNumber" v-model="hostTeamPlayers[index].number" placeholder="Player's number"></span>
          <span v-else>{{player.number}}</span>
          <span v-if="editTeam === 1 && editIndex === index"><input type="text" name="playerName" id="playerName" v-model="hostTeamPlayers[index].name" placeholder="Player's name"></span>
          <span v-else>{{player.name}}</span>
          <span v-if="editTeam === 1 && editIndex === index">Capitan: <input type="checkbox" name="playerCapitan" id="playerCapitan" v-model="hostTeamPlayers[index].capitan"></span>
          <span v-else>C: {{player.capitan ? "💚" : "🩷"}}</span>
          <span v-if="editTeam === 1 && editIndex === index">Goalkeeper: <input type="checkbox" name="playerGoalkeeper" id="playerGoalkeeper" v-model="hostTeamPlayers[index].goalkeeper"></span>
          <span v-else>G: {{player.goalkeeper ? "💚" : "🩷"}}</span>
          <span v-if="editTeam === 1 && editIndex === index"><input type="text" name="playerLicense" id="playerLicense" v-model="hostTeamPlayers[index].license" placeholder="License"></span>
          <span v-else>{{player.license}}</span>
        </li>
        <li><span class="textInteractable" @click="addPlayer(1)">+ Add player</span></li>
      </ul>
    </div>
    <div class="teamPrep">

    </div>
    <button @click="save()">Save</button>
  </main>
</template>

<style scoped>
.textInteractable{
  color: blue;
  cursor: pointer;
}
.textInteractable:hover{
  text-decoration: underline;
}
ul{
  list-style-type: none;
}
li>span{
  margin: 0 5px;
}
input[type="number"]{
  width: 35px;
}
</style>
