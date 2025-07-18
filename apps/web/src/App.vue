<script lang="ts" setup>
import RouterLoading from '@/components/RouterLoading.vue'
import { isRouterLoading } from '@/router/guard/progress'

defineOptions({
  name: 'App',
})
</script>

<template>
  <div class="app_container bg-[#212121] wh-screen">
    <RouterView v-show="!isRouterLoading" v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <Component :is="Component" />
      </Transition>
    </RouterView>
    <RouterLoading v-show="isRouterLoading" />
  </div>
</template>
