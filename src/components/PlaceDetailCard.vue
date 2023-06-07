<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { useGoogleMapStore } from '../stores/GoogleMap'

const googleMapStore = useGoogleMapStore()

const date = ref(new Date())

onMounted(() => {
  setInterval(() => {
    date.value = new Date()
  }, 1000)
})
</script>

<template>
  <div class="card">
    <div v-if="googleMapStore.hasSearchHistory">
      <div class="card-title">{{ googleMapStore.latestSearchHistoryRecord.address }}</div>
      <div class="card-desc">
        <div>{{ googleMapStore.latestSearchHistoryRecord.timezoneName }}</div>
        <div>{{ date.toLocaleString("en-US", { timeZone: googleMapStore.latestSearchHistoryRecord.timezoneId }) }}</div>
      </div>
    </div>
    <div v-else class="card-alt-title">
      Please start searching to get the place details.
    </div>
  </div>
</template>

<style>
.card {
  @apply m-4 p-4 bg-white rounded shadow;
}

.card-title {
  @apply text-xl font-bold mb-4;
}

.card-desc {
  @apply text-sm text-slate-500;
}

.card-alt-title {
  @apply text-lg text-slate-500;
}
</style>
