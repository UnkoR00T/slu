<script setup lang="ts">
import { useMainData } from '@/stores/mainDataStore.ts'
import { mainGameType } from '@/types/mainGameType.ts'
import { ref, type Ref } from 'vue'
import type { goalType } from '@/types/goalType.ts'
import { useI18n } from 'vue-i18n'
import { useToast } from '@/stores/toastController.ts'

const mainDataStore = useMainData()

const editGoalTeam: Ref<number> = ref(0)
const editGoalIndex: Ref<number> = ref(-1)

const hostTeamGoals = ref<goalType[]>([])
const guestTeamGoals = ref<goalType[]>([])

const hostPlayers = ref(mainDataStore.tempStorage.hostTeam.players)
const guestPlayers = ref(mainDataStore.tempStorage.guestTeam.players)

const { t } = useI18n()
const toastController = useToast();

mainDataStore.data.load().then((res: mainGameType) => {
  hostTeamGoals.value = res.hostTeam.goals
  guestTeamGoals.value = res.guestTeam.goals

  hostPlayers.value = res.hostTeam.players
  guestPlayers.value = res.guestTeam.players
})

const addGoal = (team: number) => {
  const newGoal: goalType = {
    goalNumber: team === 1 ? hostTeamGoals.value.length + 1 : guestTeamGoals.value.length + 1,
    playerId: null,
    assistId: null,
    time: '',
    code: '',
  }

  if (team === 1) {
    hostTeamGoals.value.push(newGoal)
    editGoalTeam.value = team
    editGoalIndex.value = hostTeamGoals.value.length - 1
  } else {
    guestTeamGoals.value.push(newGoal)
    editGoalTeam.value = team
    editGoalIndex.value = guestTeamGoals.value.length - 1
  }
}
const edit = (team: number, index: number) => {
  if (editGoalTeam.value == team && editGoalIndex.value == index) {
    editGoalTeam.value = 0
    editGoalIndex.value = -1
  } else {
    editGoalTeam.value = team
    editGoalIndex.value = index
  }
}
const removeGoal = (team: number, index: number) => {
  if (confirm('Are you sure?')) {
    if (team === 1) {
      hostTeamGoals.value.splice(index, 1)
      hostTeamGoals.value.forEach((goal, i) => {
        goal.goalNumber = i + 1
      })
    } else {
      guestTeamGoals.value.splice(index, 1)
      guestTeamGoals.value.forEach((goal, i) => {
        goal.goalNumber = i + 1
      })
    }
  }
}

const saveGoals = async () => {
  mainDataStore.data
    .save()
    .then(() => {
      toastController.addToast(t('global.saved'));
    })
    .catch(() => {
      alert('Something went wrong!')
    })
}
</script>

<template>
  <h1 class="text-xl mb-2 font-bold">{{ $t('midtab.midgame') }}:</h1>
  <div class="teamSeparator">
    <div class="mb-4">
      <h2 class="text-lg font-bold mb-2">{{ $t('midtab.hostgoals') }}</h2>
      <div class="overflow-x-auto">
        <table class="table table-zebra table-sm">
          <thead>
            <tr>
              <th class="w-[160px]">{{ $t('global.actions') }}</th>
              <th class="w-[100px]">{{ $t('midtab.goal') }} #</th>
              <th class="w-[5rem]">{{ $t('midtab.time') }}</th>
              <th>{{ $t('midtab.player') }}</th>
              <th>{{ $t('midtab.assist') }}</th>
              <th>{{ $t('midtab.code') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(goal, index) in hostTeamGoals" :key="index">
              <td>
                <button class="btn btn-primary btn-sm mr-1" @click="edit(1, index)">
                  {{ $t('global.edit') }}
                </button>
                <button class="btn btn-sm btn-error" @click="removeGoal(1, index)">
                  {{ $t('global.delete') }}
                </button>
              </td>
              <td>{{ goal.goalNumber }}</td>
              <td>
                <span v-if="editGoalTeam === 1 && editGoalIndex === index">
                  <input
                    type="text"
                    v-model="goal.time"
                    placeholder="17:99"
                    class="input input-sm w-24"
                  />
                </span>
                <span v-else>{{ goal.time }}</span>
              </td>
              <td>
                <span v-if="editGoalTeam === 1 && editGoalIndex === index">
                  <input list="players" class="input input-sm" v-model="goal.playerId" />
                  <datalist id="players">
                    <option
                      v-for="player in hostPlayers"
                      :key="player.number"
                      :value="player.number"
                    >
                      {{ player.number }} - {{ player.name }}
                    </option>
                  </datalist>
                </span>
                <span v-else>{{ goal.playerId }}</span>
              </td>
              <td>
                <span v-if="editGoalTeam === 1 && editGoalIndex === index">
                  <input list="players2" class="input input-sm" v-model="goal.assistId" />
                  <datalist id="players2">
                    <option
                      v-for="player in hostPlayers"
                      :key="player.number"
                      :value="player.number"
                    >
                      {{ player.number }} - {{ player.name }}
                    </option>
                  </datalist>
                </span>
                <span v-else>{{ !goal.assistId ? 'None' : goal.assistId }}</span>
              </td>
              <td>
                <span v-if="editGoalTeam === 1 && editGoalIndex === index">
                  <input list="codes" class="input input-sm" v-model="goal.code" />
                  <datalist id="codes">
                    <option value="PP">{{ $t('codes.powerplay') }}</option>
                    <option value="SH">{{ $t('codes.shorthanded') }}</option>
                    <option value="ESH">{{ $t('codes.esh') }}</option>
                    <option value="DP">{{ $t('codes.delayedPenalty') }}</option>
                    <option value="PS">{{ $t('codes.penaltyShot') }}</option>
                    <option value="MPS">{{ $t('codes.missedPenaltyShot') }}</option>
                    <option value="WG">{{ $t('codes.emptyNet') }}</option>
                    <option value="EN">{{ $t('codes.emptyGoal') }}</option>
                    <option value="OG">{{ $t('codes.ownGoal') }}</option>
                    <option value="ET">{{ $t('codes.overtime') }}</option>
                  </datalist>
                </span>
                <span v-else>{{ goal.code }}</span>
              </td>
            </tr>
            <tr>
              <td colspan="6">
                <button @click="addGoal(1)" class="text-blue-600 hover:underline cursor-pointer">
                  + {{ $t('midtab.addgoal') }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div>
      <h2 class="text-lg font-bold mb-2">{{ $t('midtab.guestgoals') }}</h2>
      <div class="overflow-x-auto">
        <table class="table table-zebra table-sm">
          <thead>
            <tr>
              <th class="w-[160px]">{{ $t('global.actions') }}</th>
              <th class="w-[100px]">{{ $t('midtab.goal') }} #</th>
              <th class="w-[5rem]">{{ $t('midtab.time') }}</th>
              <th>{{ $t('midtab.player') }}</th>
              <th>{{ $t('midtab.assist') }}</th>
              <th>{{ $t('midtab.code') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(goal, index) in guestTeamGoals" :key="index">
              <td>
                <button class="btn btn-sm btn-primary mr-1" @click="edit(2, index)">
                  {{ $t('global.edit') }}
                </button>
                <button class="btn btn-sm btn-error" @click="removeGoal(2, index)">
                  {{ $t('global.delete') }}
                </button>
              </td>
              <td>{{ goal.goalNumber }}</td>
              <td>
                <span v-if="editGoalTeam === 2 && editGoalIndex === index">
                  <input
                    type="text"
                    v-model="goal.time"
                    placeholder="17:99"
                    class="input input-sm w-24"
                  />
                </span>
                <span v-else>{{ goal.time }}</span>
              </td>
              <td>
                <span v-if="editGoalTeam === 2 && editGoalIndex === index">
                  <input list="players" class="input input-sm" v-model="goal.playerId" />
                  <datalist id="players">
                    <option
                      v-for="player in guestPlayers"
                      :key="player.number"
                      :value="player.number"
                    >
                      {{ player.number }} - {{ player.name }}
                    </option>
                  </datalist>
                </span>
                <span v-else>{{ goal.playerId }}</span>
              </td>
              <td>
                <span v-if="editGoalTeam === 2 && editGoalIndex === index">
                  <input list="players2" class="input input-sm" v-model="goal.assistId" />
                  <datalist id="players2">
                    <option
                      v-for="player in guestPlayers"
                      :key="player.number"
                      :value="player.number"
                    >
                      {{ player.number }} - {{ player.name }}
                    </option>
                  </datalist>
                </span>
                <span v-else>{{ !goal.assistId ? 'None' : goal.assistId }}</span>
              </td>
              <td>
                <span v-if="editGoalTeam === 2 && editGoalIndex === index">
                  <input list="codes" class="input input-sm" v-model="goal.code" />
                  <datalist id="codes">
                    <option value="PP">{{ $t('codes.powerplay') }}</option>
                    <option value="SH">{{ $t('codes.shorthanded') }}</option>
                    <option value="ESH">{{ $t('codes.esh') }}</option>
                    <option value="DP">{{ $t('codes.delayedPenalty') }}</option>
                    <option value="PS">{{ $t('codes.penaltyShot') }}</option>
                    <option value="MPS">{{ $t('codes.missedPenaltyShot') }}</option>
                    <option value="WG">{{ $t('codes.emptyNet') }}</option>
                    <option value="EN">{{ $t('codes.emptyGoal') }}</option>
                    <option value="OG">{{ $t('codes.ownGoal') }}</option>
                    <option value="ET">{{ $t('codes.overtime') }}</option>
                  </datalist>
                </span>
                <span v-else>{{ goal.code }}</span>
              </td>
            </tr>
            <tr>
              <td colspan="6">
                <button @click="addGoal(2)" class="text-blue-600 hover:underline cursor-pointer">
                  + {{ $t('midtab.addgoal') }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div class="buttons flex gap-3 mt-5">
    <button class="btn btn-primary" @click="saveGoals()">
      <p class="text-xl">{{ $t('global.save') }}</p>
    </button>
  </div>
</template>

<style scoped></style>
