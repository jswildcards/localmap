<script setup lang="ts">
  import { ref } from 'vue'

import SecondaryButton from '../components/SecondaryButton.vue'

const isHovering = ref(false)
</script>

<template>
  <div class="locate-me-container" @mouseenter="isHovering = true" @mouseleave="isHovering = false">
    <SecondaryButton class="locate-me-button">
      <span class="material-icons">my_location</span>
    </SecondaryButton>
    <div v-if="isHovering" class="locate-me-tooltip">Locate Me!</div>
  </div>
</template>

<style scoped>
.locate-me-button {
  @apply p-4 flex items-center shadow rounded-full;
}

.locate-me-tooltip {
  @apply mb-1 p-2 whitespace-nowrap text-xs bg-slate-700 text-slate-50 absolute bottom-full rounded;
}
</style>
