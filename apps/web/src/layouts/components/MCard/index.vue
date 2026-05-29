<script lang="ts" setup>
import type { MCardInstance, MCardProps } from './IMCard'
import { mergeProps } from 'vue'

defineOptions({ name: 'MCard' })
const props = withDefaults(defineProps<MCardProps>(), {
  bodyStyle: undefined,
})
const vm = getCurrentInstance()
function changeRef(i: Element | ComponentPublicInstance | null) {
  if (!i) return
  if (vm && i) vm.exposed = vm.exposeProxy = i as MCardInstance
}
</script>

<template>
  <ElCard v-bind="mergeProps($attrs, props)" :ref="changeRef" class="MCard_container">
    <template v-for="(_, name) in $slots" :key="name" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps ?? {}"></slot>
    </template>
  </ElCard>
</template>

<style scoped>
.MCard_container {
  @apply h-full max-h-full overflow-auto rounded-[8px] bg-white shadow-lg shadow-slate-500/40 dark:bg-slate-950 dark:shadow-primary/40;
}
.scrollbar-none::-webkit-scrollbar {
  display: none; /* 隐藏滚动条 */
}

.scrollbar-none {
  -ms-overflow-style: none; /* IE 和 Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
