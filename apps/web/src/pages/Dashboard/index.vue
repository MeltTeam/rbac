<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import { h } from 'vue'
import { getResources } from '@/apis'
import { t } from '@/i18n'
import { userStore } from '@/stores'

defineOptions({ name: 'Dashboard' })
const { logOut, getMeInfo } = userStore()
const r = useRouter()
</script>

<template>
  <div class="Workspace_container max-h-full flex-center py-10">
    <MButton @click="() => r.push({ name: 'ColorPalette' })">ColorPalette</MButton>
    <MButton @click="() => r.push({ name: 'Test' })">Test</MButton>
    <MButton
      @click="
        async () => {
          const res = await getResources({ params: { page: 2, limit: 10 } })
          console.warn(res)
        }
      "
    >
      get
    </MButton>
    <MButton @click="getMeInfo">MeInfo</MButton>
    <MButton :icon="h(Icon, { icon: 'mdi:logout' })" @click="logOut">{{ t('components.MLogoutBtn.content') }}</MButton>
  </div>
</template>
