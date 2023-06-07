<script setup lang="ts">
import { useGoogleMapStore } from '../stores/GoogleMap'

const googleMapStore = useGoogleMapStore()
</script>

<template>
  <div>
    <div class="list-title">
      <div class="list-title-content">
        <span class="material-icons icon">
          lightbulb
        </span>
        <span class="ml-1">Suggestion Result</span>
      </div>
      <button class="close-button" @click="googleMapStore.setIsSuggesting(false)">
        <span class="material-icons icon">close</span>
      </button>
    </div>
    <div v-if="googleMapStore.hasAutocompleteSuggestionRecords">
      <button v-for="record in googleMapStore.autocompleteSuggestionRecords" :key="record.place_id" class="record" @click="googleMapStore.addNewSearchHistoryRecord(record.place_id)">
        {{ record.description }}
      </button>
    </div>
    <div v-else class="record--empty">
      <img src="question.svg" class="record--empty__image" />
      <div>There are no suggestion result.</div>
      <div>Maybe try searching with another keywords.</div>
    </div>
  </div>
</template>

<style scoped>
.list-title {
  @apply px-4 mb-2 text-sm font-bold flex items-center justify-between;
}

.list-title-content {
  @apply py-1 flex items-center;
}

.icon {
  @apply text-xl leading-5;
}

.record {
  @apply p-4 w-full text-left duration-100 hover:bg-slate-200 hover:shadow;
}

.record--empty {
  @apply p-4 flex flex-col items-center text-center text-slate-500 text-sm;
}

.record--empty__image {
  @apply mb-4 h-20;
}

.close-button {
  @apply p-1 flex items-center rounded duration-100 hover:bg-slate-200;
}
</style>
