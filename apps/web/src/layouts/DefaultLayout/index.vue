<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import { MButton } from '@/components'
import { TITLE } from '@/constants'
import { t } from '@/i18n'
// import { MAside } from '@/layouts/components/MAside'
// import { MCard } from '@/layouts/components/MCard'
import { MMenu } from '@/layouts/components/MMenu'
import { userStore } from '@/stores'

defineOptions({ name: 'DefaultLayout' })
const { logOut } = userStore()
/** KeepAlive.max 勿与 cache 长度绑定；内层不再包 Transition，避免登出/顶层切换时离场动画与整树卸载叠加触发 null vnode */
const keepAliveMax = 10
const route = useRoute()

// 捕获 KeepAlive 的内部错误
onErrorCaptured(() => false)
</script>

<template>
  <ElContainer class="DefaultLayout_container wh-screen">
    <MAside width="200px">
      <template #default>
        <!-- <MMenu :default-openeds="['1']">
          <ElSubMenu index="1">
            <template #title> <Icon icon="mdi:account-cash-outline"></Icon>Navigator One </template>
            <ElMenuItemGroup>
              <template #title>Group 1</template>
              <ElMenuItem index="1-1">Option 1</ElMenuItem>
              <ElMenuItem index="1-2">Option 2</ElMenuItem>
            </ElMenuItemGroup>
            <ElMenuItemGroup title="Group 2">
              <ElMenuItem index="1-3">Option 3</ElMenuItem>
            </ElMenuItemGroup>
            <ElSubMenu index="1-4">
              <template #title>Option4</template>
              <ElMenuItem index="1-4-1">Option 4-1</ElMenuItem>
            </ElSubMenu>
          </ElSubMenu>
          <ElSubMenu index="2">
            <template #title> <Icon icon="mdi:account-cash-outline"></Icon>Navigator Two </template>
            <ElMenuItemGroup>
              <template #title>Group 1</template>
              <ElMenuItem index="2-1">Option 1</ElMenuItem>
              <ElMenuItem index="2-2">Option 2</ElMenuItem>
            </ElMenuItemGroup>
            <ElMenuItemGroup title="Group 2">
              <ElMenuItem index="2-3">Option 3</ElMenuItem>
            </ElMenuItemGroup>
            <ElSubMenu index="2-4">
              <template #title>Option 4</template>
              <ElMenuItem index="2-4-1">Option 4-1</ElMenuItem>
            </ElSubMenu>
          </ElSubMenu>
          <ElSubMenu index="3">
            <template #title> <Icon icon="mdi:account-cash-outline"></Icon>Navigator Three </template>
            <ElMenuItemGroup>
              <template #title>Group 1</template>
              <ElMenuItem index="3-1">Option 1</ElMenuItem>
              <ElMenuItem index="3-2">Option 2</ElMenuItem>
            </ElMenuItemGroup>
            <ElMenuItemGroup title="Group 2">
              <ElMenuItem index="3-3">Option 3</ElMenuItem>
            </ElMenuItemGroup>
            <ElSubMenu index="3-4">
              <template #title>Option 4</template>
              <ElMenuItem index="3-4-1">Option 4-1</ElMenuItem>
            </ElSubMenu>
          </ElSubMenu>
        </MMenu> -->
        <MMenu></MMenu>
      </template>
      <template #header>
        {{ TITLE }}
      </template>
      <template #footer>
        <MButton @click="logOut">
          {{ t('components.MLogoutBtn.content') }}
          <template #icon><Icon icon="mdi:logout"></Icon></template>
        </MButton>
      </template>
    </MAside>
    <ElContainer>
      <ElHeader class="bg-white dark:bg-black"><MModeBtn></MModeBtn></ElHeader>
      <ElScrollbar class="h-[30px]">
        <ElTag :key="route.name" closable type="primary">
          {{ route.name }}
        </ElTag>
      </ElScrollbar>
      <ElMain class="bg-primary-100 dark:bg-primary-950">
        <MCard>
          <RouterView v-slot="{ Component, route: currentRoute }">
            <!-- 根据 route.meta.isCache 决定是否使用 KeepAlive -->
            <KeepAlive v-if="currentRoute.meta.isCache" :max="keepAliveMax">
              <component :is="Component" :key="currentRoute.path" />
            </KeepAlive>
            <component v-else :is="Component" :key="currentRoute.path" />
          </RouterView>
        </MCard>
      </ElMain>
      <ElFooter height="30px" class="bg-white dark:bg-black">底部底部 </ElFooter>
    </ElContainer>
  </ElContainer>
</template>
