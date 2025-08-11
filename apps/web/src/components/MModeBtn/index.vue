<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import { useMode } from '@/store'

defineOptions({ name: 'MModeBtn' })
const theme = useMode()
</script>

<template>
  <ElButton class="MModeBtn_container m-0 flex-center border-none" @click="theme.toggleMode">
    <template #icon>
      <Icon v-if="theme.mode === 'light'" icon="icon-park-outline:moon" class="color-black" />
      <Icon v-if="theme.mode === 'auto'" icon="icon-park-outline:sun-one" class="color-black dark:color-white" />
      <Icon v-if="theme.mode === 'dark'" icon="icon-park-outline:laptop-computer" class="color-white" />
    </template>
  </ElButton>
</template>
