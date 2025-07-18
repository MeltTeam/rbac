<script lang="ts" setup>
import type { IFormItems } from './components/interfaces/LoginForm'
import router from '@/router'
import CaptchaImg from './components/CaptchaImg.vue'
import LoginForm from './components/LoginForm.vue'

defineOptions({
  name: 'EmailLogin',
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
const formItems: IFormItems[] = [
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
    type: 'Button',
    key: 'submit',
    props: {
      type: 'primary',
      disabled: loginFormData.value.captcha === '' || loginFormData.value.username === '' || loginFormData.value.password === '',
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
    key: 'SvgLogin',
    props: {
      type: 'success',
    },
    attrs: {
      onClick: () => goTo('SvgLogin'),
    },
    slots: '返回',
  },
]
const LoginFormInstance = useTemplateRef('LoginFormInstance')
onMounted(() => {
  console.warn(LoginFormInstance.value)
})
</script>

<template>
  <LoginForm ref="LoginFormInstance" form-title="邮箱登录" :form-items="formItems" :model="loginFormData"></LoginForm>
</template>
