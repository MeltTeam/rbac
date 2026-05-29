<script lang="ts" setup>
import type { MMenuInstance, MMenuProps } from './IMMenu'
import { ElMenu } from 'element-plus'
import { mergeProps } from 'vue'

defineOptions({ name: 'MMenu' })
const props = withDefaults(defineProps<MMenuProps>(), {})
const vm = getCurrentInstance()
function changeRef(i: Element | ComponentPublicInstance | null) {
  if (!i) return
  if (vm && i) vm.exposed = vm.exposeProxy = i as MMenuInstance
}
</script>

<template>
  <ElMenu v-bind="mergeProps($attrs, props)" :ref="changeRef" class="MMenu_container">
    <template v-for="(_, name) in $slots" :key="name" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps ?? {}"></slot>
    </template>
  </ElMenu>
</template>

<style scoped>
.el-menu.MMenu_container {
  @apply border-none;
}
</style>
