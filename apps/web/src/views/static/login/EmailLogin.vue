<!-- eslint-disable style/quote-props -->
<script lang="ts" setup>
import type { ILoginByEmailDto } from '@packages/types'
import type { FormInstance, FormRules } from 'element-plus'
import type { IFormItems } from '@/components'
import { Icon } from '@iconify/vue'
import { AsyncMForm } from '@/components'
import { CAPTCHA, CAPTCHA_LENGTH, EMAIL, PWD, PWD_MAX, PWD_MIN, USER_NAME, USER_NAME_MAX, USER_NAME_MIN } from '@/constants'
import { goTo } from '@/router'

defineOptions({
  name: 'EmailLogin',
})
// 状态
const formData = reactive<ILoginByEmailDto>({
  username: '',
  password: '',
  captcha: '',
  email: '',
})
const formInstance = ref<FormInstance | null>(null)
const rules = reactive<FormRules<ILoginByEmailDto>>({
  username: [
    { required: true, message: `请输入${USER_NAME}`, trigger: ['blur', 'change'] },
    { min: USER_NAME_MIN, max: USER_NAME_MAX, message: `${USER_NAME}长度 ${USER_NAME_MIN} ~ ${USER_NAME_MAX}`, trigger: ['blur', 'change'] },
  ],
  password: [
    { required: true, message: `请输入${PWD}`, trigger: ['blur', 'change'] },
    { min: PWD_MIN, max: PWD_MAX, message: `${PWD}长度 ${PWD_MIN} ~ ${PWD_MAX}`, trigger: ['blur', 'change'] },
  ],
  captcha: [
    { required: true, message: `请输入${CAPTCHA}`, trigger: ['blur', 'change'] },
    { min: CAPTCHA_LENGTH, max: CAPTCHA_LENGTH, message: `${CAPTCHA}长度 ${CAPTCHA_LENGTH}`, trigger: ['blur', 'change'] },
  ],
  email: [{ required: true, message: `请输入${EMAIL}`, trigger: ['blur', 'change'] }],
})
function setInstance(_formInstance: any) {
  formInstance.value = _formInstance ?? null
}
const submitDisabled = computed<boolean>(() => {
  const length = formInstance.value?.fields.length
  return formInstance.value?.fields.filter((item) => item.validateState === 'success').length !== length
})
const formItems = computed<IFormItems[]>(() => [
  {
    type: 'Input',
    key: 'username',
    props: {
      placeholder: '请输入用户名',
      autocomplete: 'off',
      'prefix-icon': h(Icon, {
        icon: 'icon-park-outline:user',
      }),
    },
  },
  {
    type: 'Input',
    key: 'password',
    props: {
      'show-password': true,
      type: 'password',
      placeholder: '请输入密码',
      autocomplete: 'off',
      'prefix-icon': h(Icon, {
        icon: 'icon-park-outline:key',
      }),
    },
  },
  {
    type: 'Input',
    key: 'email',
    props: {
      placeholder: '请输入邮箱',
      autocomplete: 'off',
      'prefix-icon': h(Icon, {
        icon: 'icon-park-outline:email-lock',
      }),
    },
  },
  {
    type: 'Input',
    key: 'captcha',
    props: {
      placeholder: '请输入验证码',
      autocomplete: 'off',
      'prefix-icon': h(Icon, {
        icon: 'icon-park-outline:unlock-one',
        color: '#bbb',
      }),
    },
    span: 14,
  },
  {
    type: 'Button',
    key: 'captchaEmail',
    props: {
      type: 'primary',
      disabled: formData.email === '',
    },
    slots: '发送',
    span: 10,
  },
  {
    type: 'Button',
    key: 'submit',
    props: {
      type: 'primary',
      disabled: submitDisabled.value,
    },
    attrs: {
      onClick: () => {
        formInstance.value?.validate(async (isValid: boolean) => {
          console.warn(isValid)
        })
      },
    },
    slots: '确认',
  },
  {
    type: 'Button',
    key: 'back',
    attrs: {
      onClick: () => goTo('SvgLogin'),
    },
    slots: '返回',
  },
])
</script>

<template>
  <AsyncMForm :ref="setInstance" validate-on-rule-change form-title="邮箱登录" :form-items="formItems" :rules="rules" :model="formData"></AsyncMForm>
</template>
