<script setup lang="ts">
</script>

<template>

  <main>
    <nav>
      <RouterLink to="/prep">Prep</RouterLink>
      <RouterLink to="/info">Info</RouterLink>
      <RouterLink to="/midgame">Mid game</RouterLink>
      <RouterLink to="/endgame">End game</RouterLink>
    </nav>
    <RouterView />
  </main>

</template>
