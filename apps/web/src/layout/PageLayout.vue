<script lang="ts" setup>
defineOptions({ name: 'PageLayout' })
</script>

<template>
  <div
    class="PageLayout_container max-h-full overflow-auto rounded-[8px] bg-white shadow-lg shadow-slate-500/40 dark:bg-slate-950 dark:shadow-primary/40"
  >
    <slot></slot>
  </div>
</template>
