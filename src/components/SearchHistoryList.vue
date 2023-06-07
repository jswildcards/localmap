<script setup lang="ts">
import { useGoogleMapStore } from '../stores/GoogleMap'

const googleMapStore = useGoogleMapStore()

function setSearchHistoryPage(pageNumber: string | number) {
  if(pageNumber !== '...') {
    googleMapStore.setSearchHistoryPage(pageNumber)
  }
}

function pageNumberState(pageNumber: string | number) {
  if(pageNumber === '...')
    return 'page-number--unclickable'

  if(pageNumber === googleMapStore.searchHistoryPage)
    return 'page-number--active'

  return 'page-number--clickable'
}
</script>

<template>
  <div class="search-history-list">
    <div class="list-title">
      <div class="list-title-content">
        <span class="material-icons icon">
          history
        </span>
        <span class="ml-1">Search History</span>
      </div>
      <button class="delete-button" v-if="googleMapStore.hasSelectedSearchHistoryRecords" @click="googleMapStore.deleteSelectedSearchHistoryRecords()">
        <span class="material-icons icon">delete</span>
        <span>Delete</span>
      </button>
    </div>
    <div v-if="googleMapStore.hasSearchHistory" class="list-body">
      <div class="list-items-container">
        <button v-for="record in googleMapStore.searchHistoryList" :key="record.placeId" class="record" @click="googleMapStore.toggleSelectedSearchHistoryRecord(record.placeId)">
          <span class="material-icons mr-2">
            {{ googleMapStore.selectedSearchHistoryRecords.has(record.placeId) ? 'check_box' : 'check_box_outline_blank' }}
          </span>
          {{ record.address }}
        </button>
      </div>
      <div class="pagination">
        <button @click="googleMapStore.decreaseSearchHistoryPage" v-if="googleMapStore.searchHistoryPage > 1" class="page-number page-number--clickable">
          <span class="material-icons">arrow_left</span>
        </button>
        <button v-for="pageNumber in googleMapStore.allSearchHistoryPages" :key="pageNumber" @click="setSearchHistoryPage(pageNumber)" :class="`page-number ${pageNumberState(pageNumber)}`">
          {{ pageNumber }}
        </button>
        <button @click="googleMapStore.increaseSearchHistoryPage" v-if="googleMapStore.searchHistoryPage < googleMapStore.searchHistoryTotalPages" class="page-number page-number--clickable">
          <span class="material-icons">arrow_right</span>
        </button>
      </div>
    </div>
    <div v-else class="record--empty">
      <img src="empty.svg" class="record--empty__image" />
      <div>You have no search history.</div>
      <div>Maybe try searching something first.</div>
    </div>
  </div>
</template>

<style scoped>
.search-history-list {
  @apply flex flex-col;
}

.list-title {
  @apply px-4 mb-2 text-sm font-bold flex items-center justify-between;
}

.list-title-content {
  @apply py-1 flex items-center;
}

.delete-button {
  @apply p-1 flex items-center text-red-500 rounded duration-100 hover:bg-slate-200;
}

.list-body {
  @apply grow flex flex-col;
}

.list-items-container {
  @apply grow;
}

.pagination {
  @apply p-4;
}

.icon {
  @apply text-xl leading-5;
}

.record {
  @apply p-4 w-full text-left duration-100 flex hover:bg-slate-200 hover:shadow;
}

.record--empty {
  @apply p-4 flex flex-col items-center text-center text-slate-500 text-sm;
}

.record--empty__image {
  @apply mb-4 h-20;
}

.pagination {
  @apply flex justify-center;
}

.page-number {
  @apply text-sm w-8 h-8 rounded flex justify-center items-center;
}

.page-number--unclickable {
  @apply cursor-default;
}

.page-number--clickable {
  @apply duration-100 hover:bg-slate-200;
}

.page-number--active {
  @apply bg-sky-400 text-slate-50;
}
</style>
