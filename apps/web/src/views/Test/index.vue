<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import { MModeBtn } from '@/components'
import { goTo } from '@/router'

const types: InstanceType<typeof ElButton>['$props']['type'][] = ['default', 'text', 'primary', 'success', 'warning', 'danger', 'info']
const map: { [key: string]: string } = {
  default: 'primary',
  text: 'primary',
  primary: 'primary',
  success: 'success',
  warning: 'warning',
  danger: 'error',
  info: 'info',
}
function handleClick(type: string | keyof typeof map) {
  ElMessage({
    message: type,
    type: map[type as keyof typeof map],
  })
}
const iconRef = ref('icon-park-outline:components')
setTimeout(() => {
  iconRef.value = 'mdi:account-cash-outline'
}, 10000)
const isLoading = ref(true)
onMounted(() => setTimeout(() => (isLoading.value = false), 500))
</script>

<template>
  <div v-mLoading="isLoading" class="mb-4 wh-screen flex-col-center bg-white dark:bg-black">
    <div class="mb-4 flex">
      <Icon :icon="iconRef"></Icon>
    </div>
    <div class="mb-4 flex">
      <MModeBtn></MModeBtn>
      <MButton @click="goTo('Login')">Login</MButton>
      <MButton @click="goTo('Workspace')">Workspace</MButton>
    </div>
    <div class="mb-4">
      <KeepAlive :include="['MVideo']" :max="1">
        <MVideo></MVideo>
      </KeepAlive>
    </div>
    <div class="mb-4">
      <ElButton v-for="(type, index) in types" :key="index" :type="type" @click="handleClick(type!)">{{ type }}</ElButton>
    </div>
    <div class="mb-4">
      <ElButton v-for="(type, index) in types" :key="index" disabled :type="type" @click="handleClick(type!)">{{ type }}</ElButton>
    </div>
    <div class="mb-4">
      <MButton v-for="(type, index) in types" :key="index" :type="type" @click="handleClick(type!)">{{ type }}</MButton>
    </div>
    <div class="mb-4">
      <MButton v-for="(type, index) in types" :key="index" disabled :type="type" @click="handleClick(type!)">{{ type }}</MButton>
    </div>
  </div>
</template>
