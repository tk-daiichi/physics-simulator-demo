<template>
  <!-- <Test3D/> -->
  <WaveSim/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Test3D from '@/components/Test3D.vue'
import WaveSim from '@/components/WaveSim.vue'

export default defineComponent({
  name: "App",
  components: {
    Test3D,
    WaveSim,
  },
});
</script>


<style scoped>
</style>
