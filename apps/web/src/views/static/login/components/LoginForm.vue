<script lang="ts" setup>
import type { componentType, IFormItems, LoginFormProps, TComponentMap } from './interfaces/LoginForm'
import { h } from 'vue'

defineOptions({ name: 'LoginForm' })
const props = withDefaults(defineProps<LoginFormProps>(), {
  formTitle: '登录',
  gutter: 8,
  hidden: false,
})
const _formItems = computed(() => props.formItems.filter((item) => item.hidden !== true))
const _formProps = computed(() => {
  const { formItems, formTitle, ...formProps } = props
  return formProps
})
const componentMap: TComponentMap = {
  Input: ElInput,
  Button: ElButton,
  /** 用插槽 */
  Template: false,
}
const vm = getCurrentInstance()
function changeRef(instance: any) {
  if (vm) {
    vm.exposeProxy = vm.exposed = instance || {}
  }
}
function getComponent(item: IFormItems) {
  if (typeof item.type !== 'string') return item.type
  return componentMap[item.type as componentType]
}
function getSlots(item: IFormItems) {
  if (typeof item.slots === 'string' || typeof item.slots === 'number') {
    return {
      default: () => h('span', {}, item.slots),
    }
  }
  return item.slots
}
</script>

<template>
  <div class="LoginForm_container min-h-full min-w-full text-center">
    <h1 class="LoginForm_title select-none py-[.5rem] text-2xl font-black">{{ props.formTitle }}</h1>
    <ElForm v-bind="{ ...$attrs, ..._formProps }" :ref="changeRef">
      <ElRow :gutter="props.gutter">
        <ElCol v-for="item in _formItems" :key="item.key" :span="item.span || 24">
          <ElFormItem :label="item.label" :prop="item.key as string">
            <slot :name="item.key">
              <template v-if="getComponent(item)">
                <Component
                  :is="h(getComponent(item), { ...item.attrs, ...item.props }, getSlots(item))"
                  v-model="props.model![item.key as string]"
                  class="w-full"
                ></Component>
              </template>
            </slot>
          </ElFormItem>
        </ElCol>
      </ElRow>
    </ElForm>
  </div>
</template>
