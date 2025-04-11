<script setup lang="ts">

import { useMainData } from '@/stores/mainDataStore.ts'

const mainDataStore = useMainData();

const exportData = () => {
  mainDataStore.data.download().then(() => {

  });
}

</script>

<template>

  <main>
    <nav class="bg-white dark:bg-sky-700 p-2 pl-[25px] flex sticky top-0">
      <RouterLink class="p-2 px-5 text-md m-2 bg-sky-600 rounded-[7px] hover:bg-sky-700 duration-200" to="/info">Info</RouterLink>
      <RouterLink class="p-2 px-5 text-md m-2 bg-sky-600 rounded-[7px] hover:bg-sky-700 duration-200" to="/prep">Pre game</RouterLink>
      <RouterLink class="p-2 px-5 text-md m-2 bg-sky-600 rounded-[7px] hover:bg-sky-700 duration-200" to="/midgame">Mid game</RouterLink>
      <RouterLink class="p-2 px-5 text-md m-2 bg-sky-600 rounded-[7px] hover:bg-sky-700 duration-200" to="/endgame">End game</RouterLink>
      <button @click="exportData()">Export</button>
    </nav>
    <div class="p-3">
      <RouterView />
    </div>
  </main>

</template>
