<script setup lang="ts">
import { useMainData } from '@/stores/mainDataStore.ts'
import type { mainGameType } from '@/types/mainGameType.ts'
import { ref } from 'vue'

const mainDataStore = useMainData()

const exportData = () => {
  mainDataStore.data.download().then(() => {})
}
const inputFile = (event: InputEvent) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const file = event.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      mainDataStore.tempStorage = JSON.parse(e.target.result) as mainGameType;
      mainDataStore.data.save().then(() => {
        window.location.reload();
      })
    } catch {
      alert('Invalid JSON file.')
    }
  }
  reader.readAsText(file)
}
const fileInput = ref();
const importData = () => {
  fileInput.value.click();
}
</script>

<template>
  <main>
    <nav class="bg-white dark:bg-sky-700 p-2 pl-[25px] flex sticky top-0">
      <RouterLink
        class="p-2 px-5 text-md m-2 bg-sky-600 rounded-[7px] hover:bg-sky-700 duration-200"
        to="/info"
        >Info</RouterLink
      >
      <RouterLink
        class="p-2 px-5 text-md m-2 bg-sky-600 rounded-[7px] hover:bg-sky-700 duration-200"
        to="/prep"
        >Pre game</RouterLink
      >
      <RouterLink
        class="p-2 px-5 text-md m-2 bg-sky-600 rounded-[7px] hover:bg-sky-700 duration-200"
        to="/midgame"
        >Mid game</RouterLink
      >
      <RouterLink
        class="p-2 px-5 text-md m-2 bg-sky-600 rounded-[7px] hover:bg-sky-700 duration-200"
        to="/endgame"
        >End game</RouterLink
      >
      <div class="dataActions p-2 px-5 text-md m-2 bg-sky-600 rounded-[7px] duration-200">
        Data >
        <div class="options bg-sky-600 rounded">
          <div @click="exportData"
               class="py-1 text-md bg-sky-600 rounded-[7px] hover:bg-sky-700 duration-200"
          >Export</div>
          <div @click="importData"
               class="py-1 text-md bg-sky-600 rounded-[7px] hover:bg-sky-700 duration-200"
          >
            Import
            <input style="display: none" ref="fileInput" type="file" name="file" id="file" @change="inputFile" accept=".json" />
          </div>
        </div>
      </div>
    </nav>
    <div class="p-3">
      <RouterView />
    </div>
  </main>
</template>
<style scoped>
.dataActions{
  width: 100px;
  text-align: center;
  position: relative;
}
.dataActions > div{
  display: none;
  position: absolute;
  width: 100px;
  overflow: hidden;
  top: 40px;
  left: 0;
  box-shadow: 0 0 5px black;
}
.dataActions:hover > div{
  display: block;
}
</style>
