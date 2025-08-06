<script lang="ts" setup>
defineOptions({
  name: 'App',
})
const isLoading = ref(true)
</script>

<template>
  <div v-mLoading="isLoading" class="App_container wh-screen bg-[#212121]">
    <RouterView v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <Component :is="Component" @vue:mounted="() => (isLoading = false)" />
      </Transition>
    </RouterView>
  </div>
</template>
