<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGoogleMapStore } from '../stores/GoogleMap'

import PrimaryButton from '../components/PrimaryButton.vue'
import SecondaryButton from '../components/SecondaryButton.vue'

const BUTTON_TYPES = {
  search: "search",
  locate_me: "locate_me",
  none: "",
}

const keywords = ref("")
const errorMessage = ref("")
const hoveringButton = ref(BUTTON_TYPES.none)

const googleMapStore = useGoogleMapStore()
await googleMapStore.initialize()

const hasKeywords = computed(() => {
  return keywords.value.length > 0
})

const hasErrorMessage = computed(() => {
  return errorMessage.value.length > 0
})

function clearKeywords() {
  keywords.value = ""
}

function onInputKeyDown(event: KeyboardEvent) {
  if(hasErrorMessage.value)
    errorMessage.value = ""

  const isEnterPressed = event.key === "Enter"
  if(isEnterPressed)
    getAutocompleteSuggestions()
}

function getAutocompleteSuggestions() {
  if(hasKeywords.value) {
    googleMapStore.getAutocompleteSuggestions(keywords.value)
  } else {
    errorMessage.value = "Keywords cannot be blank!"
  }
}
</script>

<template>
  <div>
    <div class="input-container">
      <input type="text" placeholder="Enter keywords, e.g. Toronto" v-model="keywords" :class="`input ${hasErrorMessage ? 'input--error' : ''}`" @keydown="onInputKeyDown" />
      <div class="button-container" @mouseenter="hoveringButton = BUTTON_TYPES.search" @mouseleave="hoveringButton = BUTTON_TYPES.none">
        <PrimaryButton class="button" @click="getAutocompleteSuggestions">
          <span class="material-icons icon">search</span>
        </PrimaryButton>
        <div v-if="hoveringButton === BUTTON_TYPES.search" class="tooltip">Search</div>
      </div>
      <div class="button-container" @mouseenter="hoveringButton = BUTTON_TYPES.locate_me" @mouseleave="hoveringButton = BUTTON_TYPES.none">
        <SecondaryButton class="button" @click="googleMapStore.locateMe">
          <span class="material-icons icon">my_location</span>
        </SecondaryButton>
        <div v-if="hoveringButton === BUTTON_TYPES.locate_me" class="tooltip">Locate Me!</div>
      </div>
      <button class="cancel-button" v-if="hasKeywords" @click="clearKeywords">
        <span class="material-icons icon">close</span>
      </button>
    </div>
    <div class="error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>

<style scoped>
.input-container {
  @apply relative w-full flex;
}

.input {
  @apply text-xs pl-2 pr-8 grow rounded shadow duration-100;
}

.input--error {
  @apply border border-red-500 bg-red-100 text-red-500 placeholder:text-red-400;
}

.button-container {
  @apply relative;
}

.button {
  @apply p-1.5 rounded flex items-center shadow ml-2;
}

.tooltip {
  @apply absolute text-xs bg-slate-700 text-slate-50 p-2 rounded mt-1 whitespace-nowrap -translate-x-1/2 left-1/2;
}

.cancel-button {
  @apply absolute right-0 mr-20 mt-0.5 p-1 flex items-center rounded-full duration-100 hover:bg-slate-100;
}

.error-message {
  @apply h-4 mt-1 px-2 text-xs text-red-500;
}

.icon {
  @apply text-xl leading-5;
}
</style>
