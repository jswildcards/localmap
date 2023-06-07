<template>
  <button class="primary-button">
    <slot></slot>
  </button>
</template>

<style scoped>
.primary-button {
  @apply bg-sky-400 text-slate-50 duration-100 hover:bg-sky-500;
}
</style>
