<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import type { IFormItems } from './components/interfaces/LoginForm'
import router from '@/router'
import { LoginForm } from './components'
import CaptchaImg from './components/CaptchaImg.vue'

defineOptions({
  name: 'SvgLogin',
})
interface IFormData {
  username: string
  password: string
  captcha: string
}
const loginFormData = ref<IFormData>({
  username: '',
  password: '',
  captcha: '',
})
function goTo(name: string) {
  if (name === 'back') return router.back()
  return router.push({
    name,
  })
}
const loginFormInstance = ref<FormInstance | null>(null)
function setInstance(_loginFormInstance: any) {
  loginFormInstance.value = _loginFormInstance
}
const formItems = ref<IFormItems[]>([
  {
    type: 'Input',
    key: 'username',
    props: {
      placeholder: '请输入用户名',
      autocomplete: 'off',
    },
  },
  {
    type: 'Input',
    key: 'password',
    props: {
      placeholder: '请输入密码',
      autocomplete: 'off',
    },
  },
  {
    type: 'Input',
    key: 'captcha',
    props: {
      placeholder: '请输入验证码',
      autocomplete: 'off',
    },
    span: 14,
  },
  {
    type: () => h(CaptchaImg),
    key: 'captchaImg',
    attrs: {
      onClick: () => {
        console.warn('submit')
      },
    },
    span: 10,
  },
  {
    type: 'Template',
    key: 'register',
  },
  {
    type: 'Button',
    key: 'submit',
    props: {
      type: 'primary',
    },
    attrs: {
      onClick: () => {
        console.warn('submit')
      },
    },
    slots: '确认',
  },
  {
    type: 'Button',
    key: 'EmailLogin',
    props: {
      type: 'primary',
    },
    attrs: {
      onClick: () => goTo('EmailLogin'),
    },
    slots: '邮箱登录',
    span: 12,
  },
  {
    type: 'Button',
    key: 'reset',
    props: {
      type: 'primary',
    },
    attrs: {
      onClick: () => {
        loginFormInstance.value?.resetFields()
      },
    },
    slots: 'reset',
    span: 12,
  },
])
</script>

<template>
  <LoginForm :ref="setInstance" form-title="登录" :form-items="formItems" :model="loginFormData">
    <template #register>
      <div class="w-full flex justify-between">
        <div>
          <ElText>没有账号?</ElText>
          <ElButton type="primary" link @click="goTo('EmailRegister')">去注册</ElButton>
        </div>
        <div>
          <ElButton class="" type="primary" link @click="goTo('resetPwd')">忘记密码?</ElButton>
        </div>
      </div>
    </template>
  </LoginForm>
</template>
