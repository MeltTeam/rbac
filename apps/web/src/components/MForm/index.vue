<script lang="ts" setup>
import type { IFormItems, MFormInstance, MFormProps, TCompMapKey } from './IMForm'
import { h } from 'vue'
import { CompMap } from './compMap'

defineOptions({ name: 'MForm' })
const props = withDefaults(defineProps<MFormProps>(), {
  gutter: 8,
  hidden: false,
  showMessage: true,
})
const vm = getCurrentInstance()
function changeRef(i: Element | ComponentPublicInstance | null) {
  if (!i) return
  if (vm && i) vm.exposed = vm.exposeProxy = i as MFormInstance
}
const _formItems = computed(() => props.formItems.filter((item) => item.hidden !== true))
const _formProps = computed(() => {
  const { formItems, formTitle, ...formProps } = props
  return formProps
})

function getComponent(item: IFormItems) {
  if (typeof item.type !== 'string') return item.type
  // 组件 或 false(插槽传模板)
  return CompMap[item.type as TCompMapKey]
}
function getSlots(item: IFormItems) {
  // text node
  if (typeof item.slots === 'string' || typeof item.slots === 'number') return { default: () => h('span', {}, item.slots) }
  // h fn
  return item.slots
}
</script>

<template>
  <div class="MForm_container">
    <slot name="title">
      <template v-if="props.formTitle">
        <h1 class="MForm_title">{{ props.formTitle }}</h1>
      </template>
    </slot>
    <ElForm v-bind="{ ...$attrs, ..._formProps }" :ref="changeRef">
      <ElRow :gutter="props.gutter">
        <ElCol v-for="item in _formItems" :key="item.key" :span="item.span || 24">
          <ElFormItem :class="[`MForm_item_${item.key}`]" :label="item.label" :prop="item.key in props.model! ? item.key : undefined">
            <slot :name="`Item${item.key}`">
              <component
                :is="
                  h(
                    getComponent(item) as Component,
                    { ...(item.attrs as Record<string, any>), ...(item.props as Record<string, any>), ...(item.events as Record<string, any>) },
                    getSlots(item),
                  )
                "
                v-if="getComponent(item)"
                v-model="props.model![item.key as string]"
                class="w-full"
              ></component>
            </slot>
          </ElFormItem>
        </ElCol>
      </ElRow>
    </ElForm>
  </div>
</template>

<style>
.MForm_container {
  @apply min-h-full min-w-full px-[4px] text-center;
}
.MForm_title {
  @apply select-none py-[.5rem] text-2xl  font-black text-shadow-lg shadow-slate-500/40  dark:shadow-primary/40;
  color: var(--el-text-color-regular);
}
</style>
