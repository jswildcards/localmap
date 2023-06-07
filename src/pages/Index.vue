<script setup lang="ts">
import { useGoogleMapStore } from '../stores/GoogleMap'

import AutocompleteSuggestionList from '../components/AutocompleteSuggestionList.vue'
import GoogleMap from '../components/GoogleMap.vue'
import PlaceDetailCard from '../components/PlaceDetailCard.vue'
import SearchInput from '../components/SearchInput.vue'
import SearchHistoryList from '../components/SearchHistoryList.vue'

const googleMapStore = useGoogleMapStore()
</script>

<template>
  <Suspense>
    <div class="main-container">
      <div class="left-container">
        <SearchInput class="search-input-container" />
        <AutocompleteSuggestionList v-if="googleMapStore.isSuggesting" />
        <SearchHistoryList class="search-history-list" v-else />
      </div>

      <div class="right-container">
        <GoogleMap />
      </div>

      <PlaceDetailCard class="place-detail-card-container" />
    </div>

    <template #fallback>
      <div class="fallback-container">
        <img src="loading.svg" width="48" />
      </div>
    </template>
  </Suspense>
</template>

<style scoped>
.main-container {
  @apply w-screen h-screen bg-slate-100 text-slate-700 flex;
}

.left-container {
  @apply w-96 z-10 shadow-2xl flex flex-col;
}

.search-input-container {
  @apply p-4;
}

.search-history-list {
  @apply grow overflow-y-auto;
}

.right-container {
  @apply grow;
}

.fallback-container {
  @apply w-screen h-screen bg-slate-100 text-slate-700 flex flex-col justify-center items-center;
}

.place-detail-card-container {
  @apply absolute bottom-6 right-16 w-96;
}
</style>
