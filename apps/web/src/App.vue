<script lang="ts" setup>
import { themeStore } from '@/stores'

defineOptions({ name: 'App' })
const isLoading = ref(true)
function loadOk() {
  setTimeout(() => {
    isLoading.value = false
  }, 500)
}
const theme = themeStore()
theme.initTheme()

// if (import.meta.env.DEV) {
//   // 只在开发环境启用 vConsole
//   import('vconsole').then(({ default: VConsole }) => {
//     const vConsole = new VConsole()
//     onUnmounted(() => {
//       vConsole.destroy()
//     })
//   })
// }
</script>

<template>
  <div v-mLoading="isLoading" class="App_container wh-screen bg-el-bg-page dark:bg-[#212121]">
    <RouterView v-slot="{ Component }">
      <component :is="Component" @vue:mounted="loadOk" />
    </RouterView>
  </div>
</template>
