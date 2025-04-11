<script setup lang="ts">

import { useMainData } from '@/stores/mainDataStore.ts'

const mainDataStore = useMainData();

const newGoal = () => {
  const team = Number.parseInt(prompt("Team (1/2)", "-1"));
  const playerId = Number.parseInt(prompt("Player Id", "-1"));
  const assistId = Number.parseInt(prompt("Assist Id", "-1"));
  const time = prompt("Time", "16:00");
  const code = prompt("Code", "-");

  mainDataStore.goals.add(team, playerId, assistId, time, code);
  mainDataStore.data.save();
}
const rmGoal = () => {
  const team = Number.parseInt(prompt("Team (1/2)", "-1"));
  const goalId = Number.parseInt(prompt("Goal id", "-1"));

  mainDataStore.goals.remove(team, goalId);
  mainDataStore.data.save();
}
</script>

<template>
  <h1 @click="newGoal()">Mid Game</h1>
  <h1 @click="rmGoal()">Rm</h1>
</template>

<style scoped>

</style>
