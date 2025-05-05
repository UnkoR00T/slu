<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useI18n } from 'vue-i18n'
const { locale } = useI18n()
const lang = localStorage.getItem('lang') || 'en';
function switchLang(lang: string) {
  locale.value = lang
}
switchLang(lang);
</script>

<template>
  <div>
    <RouterView />
  </div>
</template>

<style scoped></style>
