<script lang="ts" setup>
import type { AppLocale } from '@/i18n'
import { Icon } from '@iconify/vue'
import { getLanguage, localeKeys, setLanguage } from '@/i18n'

defineOptions({
  name: 'MI18nBtn',
})
function _setLanguage(locale: AppLocale) {
  setLanguage(locale)
  ElMessage({
    message: locale,
    type: 'primary',
    duration: 1000,
  })
}
</script>

<template>
  <ElDropdown size="large" placement="bottom" trigger="click" popper-class="MI18nBtn_container">
    <ElButton class="border-none bg-transparent">
      <template #icon>
        <Icon icon="icon-park-outline:translate" class="color-black dark:color-white" />
      </template>
    </ElButton>
    <template v-if="localeKeys.length > 0" #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem v-for="item in localeKeys" :key="item" :disabled="getLanguage() === item" @click="_setLanguage(item)">
          {{ item }}
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>
