<script setup lang="ts">

import { useMainData } from '@/stores/mainDataStore.ts'

const mainDataStore = useMainData();

const newGoal = () => {
  const team = Number.parseInt(prompt("Team (1/2)", "-1"));
  const playerId = Number.parseInt(prompt("Player Id", "-1"));
  const assistId = Number.parseInt(prompt("Assist Id", "-1"));
  const time = prompt("Time", "16:00");
  const code = prompt("Code", "-");

  mainDataStore.goals.add(team, playerId, assistId, time, code).then(() => {
    mainDataStore.data.save();
  }).catch((err) => {
    alert(err);
  });
}
const rmGoal = () => {
  const team = Number.parseInt(prompt("Team (1/2)", "-1"));
  const goalId = Number.parseInt(prompt("Goal id", "-1"));

  mainDataStore.goals.remove(team, goalId).then(() => {
    mainDataStore.data.save();
  }).catch((err) => {
    alert(err);
  });
}

const addFoul = () => {
  const team = Number.parseInt(prompt("Team (1/2)", "-1"));
  const playerId = Number.parseInt(prompt("Player Id", "-1"));
  const time = prompt("Time", "2");
  const starts = prompt("Starts", "16:00");
  const code = prompt("Code", "-");

  mainDataStore.fouls.add(team, playerId, time, code, starts).then((index) => {
    console.log(index);
    mainDataStore.data.save();
  }).catch((err) => {
    alert(err);
  });
}
</script>

<template>
  <h1>Mid Game</h1>
  <div class="teamSeparator flex">
    <div class="goals">
      <p @click="newGoal()">Add goal</p>
      <p @click="rmGoal()">Remove goal</p>
    </div>
    <div class="fouls">
      <p @click="addFoul()">Add foul</p>
    </div>
  </div>
</template>

<style scoped>

</style>
