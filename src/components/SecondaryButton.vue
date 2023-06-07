<template>
  <button class="secondary-button">
    <slot></slot>
  </button>
</template>

<style scoped>
.secondary-button {
  @apply bg-slate-100 text-slate-700 duration-100 hover:bg-slate-200;
}
</style>
