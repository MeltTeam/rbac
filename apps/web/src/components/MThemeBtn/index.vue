<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import { goTo } from '@/router'

defineOptions({ name: 'MThemeBtn' })
</script>

<template>
  <ElButton class="MThemeBtn_container m-0 flex-center border-none" @click="goTo('Test')">
    <template #icon>
      <Icon class="cursor-pointer color-primary" icon="icon-park-outline:color-filter" />
    </template>
  </ElButton>
</template>
