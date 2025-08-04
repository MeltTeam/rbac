<script lang="ts" setup>
defineOptions({ name: 'DefaultView' })
</script>

<template>
  <div class="DefaultView_container">
    <RouterView v-slot="{ Component }">
      <Component :is="Component" />
    </RouterView>
  </div>
</template>
