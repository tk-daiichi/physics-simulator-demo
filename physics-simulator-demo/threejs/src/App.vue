<template>
  <Threejs/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Threejs from '@/components/Threejs.vue'

export default defineComponent({
  name: "App",
  components: {
    Threejs,
  },
});
</script>


<style scoped>
</style>
