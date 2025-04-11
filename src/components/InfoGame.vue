<script setup lang="ts">
import { useMainData } from '@/stores/mainDataStore.ts'
import { ref, type Ref } from 'vue'
import type { gameInfoType } from '@/types/gameInfoType.ts'

const mainDataStore = useMainData();
const localGameInfo: Ref<gameInfoType> = ref(mainDataStore.tempStorage.gameInfo);

const save = () => {
  mainDataStore.tempStorage.gameInfo = localGameInfo.value;
  mainDataStore.data.save().then(() => {
    alert("Data has been saved!")
  }).catch(() => {

  })
}
const clear = () => {
  if(confirm("Are you sure?")){
    localStorage.removeItem("mainData");
    window.location.reload();
  }
}

</script>

<template>
  <h1 class="text-lg">Game Info:</h1>
  <main>

    <div class="inputBox my-2">
      <p>Organizer</p>
      <input
        type="text"
        class="border p-1 rounded"
        name="organizer"
        id="organizerInput"
        v-model="localGameInfo.organizer"
        placeholder="Organizer's name"
      >
    </div>
    <div class="inputBox my-2">
      <p>Games</p>
      <input
        type="text"
        class="border p-1 rounded"
        name="games"
        id="gamesInput"
        v-model="localGameInfo.games"
        placeholder="Games"
      >
    </div>
    <div class="inputBox my-2">
      <p>Place</p>
      <input
        type="text"
        class="border p-1 rounded"
        name="place"
        id="placeInput"
        v-model="localGameInfo.place"
        placeholder="Place"
      >
    </div>
    <div class="inputBox my-2">
      <p>Date</p>
      <input
        type="date"
        class="border p-1 rounded"
        name="date"
        id="dateInput"
        v-model="localGameInfo.date">
    </div>
    <div class="inputBox my-2">
      <p>Game number</p>
      <input
        type="number"
        class="border p-1 rounded"
        name="gameNumber"
        id="gameNumberInput"
        v-model="localGameInfo.game_number"
        placeholder="Game number"
      >
    </div>
    <div class="inputBox my-2">
      <p>Start</p>
      <input
        type="text"
        class="border p-1 rounded"
        name="start"
        id="startInput"
        v-model="localGameInfo.start"
        placeholder="16:59"
      >
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
input {
  width: 200px;
}
</style>
