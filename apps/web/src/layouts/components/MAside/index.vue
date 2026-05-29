<script lang="ts" setup>
import type { MAsideInstance, MAsideProps } from './IMAside'
import { ElAside } from 'element-plus'
import { mergeProps } from 'vue'

defineOptions({ name: 'MAside' })
const props = withDefaults(defineProps<MAsideProps>(), {
  headerHeight: '60px',
  footerHeight: '30px',
})
defineSlots<MAsideInstance['$slots']>()
const vm = getCurrentInstance()
function changeRef(i: Element | ComponentPublicInstance | null) {
  if (!i) return
  if (vm && i) vm.exposed = vm.exposeProxy = i as MAsideInstance
}
</script>

<template>
  <ElAside
    v-bind="mergeProps($attrs, props)"
    :ref="changeRef"
    class="MAside"
    :style="{ '--m-header-height': $slots.header ? props.headerHeight : '0px', '--m-footer-height': $slots.footer ? props.footerHeight : '0px' }"
  >
    <div v-if="$slots.header" class="MAside_header">
      <slot name="header"></slot>
    </div>
    <ElScrollbar v-if="$slots.default" class="MAside_scrollbar">
      <slot name="default"></slot>
    </ElScrollbar>
    <div v-if="$slots.footer" class="MAside_footer">
      <slot name="footer"></slot>
    </div>
  </ElAside>
</template>

<style scoped>
.el-aside.MAside {
  @apply bg-white shadow-lg shadow-slate-500/40 dark:bg-slate-950 dark:shadow-primary/40 flex-col-center border-r border-[var(--el-border-color)];
}
.MAside_header {
  @apply select-none  text-[1rem] text-center  font-black text-shadow-lg shadow-slate-500/40  dark:shadow-primary/40 bg-primary-950/.8 w-full text-[var(--el-text-color-regular)] h-[var(--m-header-height)] lh-[var(--m-header-height)];
}
.MAside_scrollbar {
  height: calc(100% - var(--m-header-height) - var(--m-footer-height));
}
.MAside_footer {
  @apply w-full flex-center h-[var(--m-footer-height)];
}
</style>
