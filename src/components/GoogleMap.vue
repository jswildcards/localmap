<script setup lang="ts">
import { onMounted, ref, toRefs } from 'vue'
import { useGoogleMapStore } from '../stores/GoogleMap'

const mapContainerElement = ref<HTMLElement | null>(null)

const googleMapStore = useGoogleMapStore()
await googleMapStore.initialize()

onMounted(() => {
  googleMapStore.createMapContainer(mapContainerElement.value)
})
</script>

<template>
  <div ref="mapContainerElement" class="map-container" />
</template>

<style scoped>
.map-container {
  @apply w-full h-full;
}
</style>
