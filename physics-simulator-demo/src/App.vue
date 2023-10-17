<script setup lang="ts">
  import NumIngicator from './components/NumIngicator.vue'
  import LinearAcceleration from './components/LinearAcceleration.vue'
</script>

<template>
  <!-- <NumIngicator></NumIngicator> -->
  <LinearAcceleration></LinearAcceleration>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
