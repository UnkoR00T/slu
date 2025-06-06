<script setup lang="ts">
import { useMainData } from '@/stores/mainDataStore.ts'
import type { mainGameType } from '@/types/mainGameType.ts'
import {type Ref, ref} from 'vue'

const mainDataStore = useMainData()
const router = useRouter();
const toast = useToast();
const version: Ref<{header: string, msg: string}> = ref({header: "", msg: ""});

const exportData = () => {
  mainDataStore.data.download().then(() => {})
}
const inputFile = (event: Event) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const file = event.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      mainDataStore.tempStorage = JSON.parse(e.target.result) as mainGameType
      mainDataStore.data.save().then(() => {
        window.location.reload()
      })
    } catch {
      alert('Invalid JSON file.')
    }
  }
  reader.readAsText(file)
}
const fileInput = ref()
const importData = () => {
  fileInput.value.click()
}
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import authService from '@/functions/api/auth.service.ts'
import {useToast} from "@/stores/toastController.ts";
import {versionApi} from "@/functions/api/version.service.ts";

const { locale } = useI18n()

function switchLang(lang: string) {
  locale.value = lang
  localStorage.setItem('lang', lang)
}
router.beforeEach((to, from, next) => {
  authService.verify().then(() => {
    next();
  }).catch(() => {
  })
})
authService.verify().then(() => {})
const clearData = () => {
  if (confirm("Are you 100% sure you want to do that?")){
    localStorage.removeItem("mainData");
    toast.addToast("Data removed. Refresh page to see effect.");
  }
}

versionApi.getVersionMessage().then(res => {
  version.value = res;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  document.getElementById('version_modal').showModal();
})

</script>

<template>
  <main>
    <nav class="navbar">
      <div class="navbar-start flex gap-2">
        <RouterLink class="btn btn-primary" to="/info">{{ $t('navbar.info') }}</RouterLink>
        <RouterLink class="btn btn-primary" to="/prep">{{ $t('navbar.pre') }}</RouterLink>
        <button
          class="btn btn-primary"
          popovertarget="popover-mid"
          style="anchor-name: --anchor-mid"
        >
          {{ $t('navbar.mid') }}
        </button>
        <ul
          class="dropdown menu w-52 rounded-box bg-base-200 shadow-sm"
          popover
          id="popover-mid"
          style="position-anchor: --anchor-mid"
        >
          <li>
            <RouterLink to="/midgame/goals">{{ $t('navbar.goals') }}</RouterLink>
          </li>
          <li>
            <RouterLink to="/midgame/goalkeep">{{ $t('navbar.goalkeep') }}</RouterLink>
          </li>
          <li>
            <RouterLink to="/midgame/fouls">{{ $t('navbar.fouls') }}</RouterLink>
          </li>
        </ul>
        <RouterLink class="btn btn-primary" to="/endgame">{{ $t('navbar.end') }}</RouterLink>
        <button class="btn btn-primary" popovertarget="popover-1" style="anchor-name: --anchor-1">
          {{ $t('navbar.data') }}
        </button>
        <ul
          class="dropdown menu w-52 rounded-box bg-base-200 shadow-sm"
          popover
          id="popover-1"
          style="position-anchor: --anchor-1"
        >
          <li @click="exportData">
            <a>{{ $t('navbar.export') }}</a>
          </li>
          <li @click="importData">
            <a>{{ $t('navbar.import') }}</a>
          </li>
          <li>
            <RouterLink to="/generated">{{ $t('navbar.pdf') }}</RouterLink>
          </li>
          <li @click="clearData()">
            <p>{{ $t('navbar.clear') }}</p>
          </li>
        </ul>
      </div>
      <div class="navbar-end">
        <button
          class="btn btn-primary"
          popovertarget="popover-lang"
          style="anchor-name: --anchor-lang"
        >
          {{ $t('navbar.lang') }}
        </button>
        <ul
          class="dropdown menu w-52 rounded-box bg-base-200 shadow-sm"
          popover
          id="popover-lang"
          style="position-anchor: --anchor-lang"
        >
          <li @click="switchLang('en')">
            <a>{{ $t('lang.en') }}</a>
          </li>
          <li @click="switchLang('pl')">
            <a>{{ $t('lang.pl') }}</a>
          </li>
          <li @click="switchLang('cz')">
            <a>{{ $t('lang.cz') }}</a>
          </li>
        </ul>
      </div>
      <input
        style="display: none"
        ref="fileInput"
        type="file"
        name="file"
        id="file"
        @change="inputFile"
        accept=".json"
      />
    </nav>
    <div class="p-3">
      <RouterView />
    </div>
    <dialog id="version_modal" class="modal">
      <div class="modal-box">
        <h3 class="text-lg font-bold">{{version.header}}</h3>
        <p class="py-4" v-html="version.msg.replace(/\n/g, '<br>')"></p>
        <div class="modal-action">
          <form method="dialog">
            <!-- if there is a button in form, it will close the modal -->
            <button class="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  </main>
</template>
<style scoped>

</style>
