<script lang="ts" setup>
import type { MButtonInstance, MButtonProps } from './IMButton'
import { Icon } from '@iconify/vue'
import { ElButton } from 'element-plus'
import { mergeProps } from 'vue'

defineOptions({ name: 'MButton' })
const props = withDefaults(defineProps<MButtonProps>(), {})
defineSlots<MButtonInstance['$slots']>()
const vm = getCurrentInstance()
function changeRef(i: Element | ComponentPublicInstance | null) {
  if (!i) return
  if (vm && i) vm.exposed = vm.exposeProxy = i as MButtonInstance
}
</script>

<template>
  <ElButton v-bind="mergeProps($attrs, props)" :ref="changeRef" class="MButton_container">
    <template v-for="(_, name) in $slots" :key="name" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps ?? {}"></slot>
    </template>
    <template #loading>
      <slot name="loading"><Icon class="loading_icon" icon="icon-park-outline:loading-four" /></slot>
    </template>
  </ElButton>
</template>

<style scoped>
.el-button.MButton_container {
  --shadow-num: 3px;
  --shadow-a: 0.4;
  --click-shadow: var(--primary-color-400);
  --n-1: ease-in-out;
}
.el-button.MButton_container.el-button--success {
  --click-shadow: var(--success-color-400);
}
.el-button.MButton_container.el-button--warning {
  --click-shadow: var(--warning-color-400);
}
.el-button.MButton_container.el-button--danger {
  --click-shadow: var(--danger-color-400);
}
.el-button.MButton_container.el-button--info {
  --click-shadow: var(--info-color-400);
}
.el-button.MButton_container:active {
  animation: click-shadow 1s infinite ease-in-out;
}
.el-button.MButton_container:hover {
  box-shadow: 0 0 0 1px rgb(var(--click-shadow) / 1);
}
.el-button.MButton_container.is-disabled:active {
  animation: none;
}
.el-button.MButton_container.is-disabled:hover {
  box-shadow: none;
}

@keyframes click-shadow {
  0% {
    box-shadow: 0 0 0 var(--shadow-num) rgb(var(--click-shadow) / var(--shadow-a));
  }
  50% {
    box-shadow: 0 0 0 0 rgb(var(--click-shadow) / var(--shadow-a));
  }
  100% {
    box-shadow: 0 0 0 var(--shadow-num) rgb(var(--click-shadow) / var(--shadow-a));
  }
}
.loading_icon {
  animation: rotate 400ms infinite linear;
  @apply mr-1;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
