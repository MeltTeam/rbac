<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import { useTheme } from '@/store'

defineOptions({
  name: 'MThemeBtn',
})
const theme = useTheme()
</script>

<template>
  <ElButton class="MThemeBtn_container border-none bg-transparent" @click="theme.toggleTheme">
    <template #icon>
      <Icon v-if="theme.mode === 'light'" icon="icon-park-outline:moon" class="color-black" />
      <Icon v-if="theme.mode === 'auto'" icon="icon-park-outline:sun-one" class="color-black dark:color-white" />
      <Icon v-if="theme.mode === 'dark'" icon="icon-park-outline:switch-one" class="color-white" />
    </template>
  </ElButton>
</template>
