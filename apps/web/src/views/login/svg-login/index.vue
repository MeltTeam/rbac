<!-- eslint-disable style/quote-props -->
<script lang="ts" setup>
import type { ILoginBySvgDto } from '@packages/types'
import type { FormInstance, FormRules } from 'element-plus'
import type { IFormItems } from '@/components'
import { Icon } from '@iconify/vue'
import { api } from '@/api'
import { AsyncMForm } from '@/components'
import { CAPTCHA, CAPTCHA_LENGTH, PWD, PWD_MAX, PWD_MIN, USER_NAME, USER_NAME_MAX, USER_NAME_MIN } from '@/constants'
import { t } from '@/i18n'
import { goTo } from '@/router'
import { CaptchaImg } from '../components'

defineOptions({
  name: 'SvgLogin',
})
// 状态
const formData = reactive<ILoginBySvgDto>({
  username: '',
  password: '',
  captcha: '',
  token: '',
})
const formInstance = ref<FormInstance | null>(null)
const captchaImgUrl = ref<null | string>(null)
const rules = reactive<FormRules<ILoginBySvgDto>>({
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
})
function setInstance(_formInstance: any) {
  formInstance.value = _formInstance ?? null
}
async function getSvg() {
  formData.captcha = ''
  const {
    data: { svg, token },
  } = await api.loginBySvgCaptcha()
  formData.token = token
  captchaImgUrl.value = svg
}
getSvg()
const submitDisabled = computed<boolean>(() => {
  const length = formInstance.value?.fields.length
  return formInstance.value?.fields.filter((item) => item.validateState === 'success').length !== length
})
const formItems = computed<IFormItems[]>(() => [
  {
    type: 'Input',
    key: 'username',
    props: {
      placeholder: t('请输入用户名'),
      autocomplete: 'off',
      'prefix-icon': h(Icon, {
        icon: 'icon-park-outline:user',
        color: '#bbb',
      }),
    },
  },
  {
    type: 'Input',
    key: 'password',
    props: {
      'show-password': true,
      type: 'password',
      placeholder: t('请输入密码'),
      autocomplete: 'off',
      'prefix-icon': h(Icon, {
        icon: 'icon-park-outline:key',
        color: '#bbb',
      }),
    },
  },
  {
    type: 'Input',
    key: 'captcha',
    props: {
      placeholder: t('请输入验证码'),
      autocomplete: 'off',
      'prefix-icon': h(Icon, {
        icon: 'icon-park-outline:unlock-one',
        color: '#bbb',
      }),
    },
    span: 14,
  },
  {
    type: () => h(CaptchaImg, { captchaImgUrl: captchaImgUrl.value ?? undefined }),
    key: 'captchaImg',
    attrs: {
      onClick: async () => {
        await getSvg()
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
      disabled: submitDisabled.value,
    },
    attrs: {
      onClick: () => {
        formInstance.value?.validate(async (isValid: boolean) => {
          console.warn(isValid)
        })
      },
    },
    slots: t('确认'),
  },
  {
    type: 'Button',
    key: 'EmailLogin',
    attrs: {
      onClick: () => goTo('email-login'),
    },
    slots: t('邮箱登录'),
  },
])
</script>

<template>
  <AsyncMForm :ref="setInstance" validate-on-rule-change :form-title="t('登录')" :form-items="formItems" :rules="rules" :model="formData">
    <template #register>
      <div class="w-full flex justify-between">
        <div>
          <ElText>{{ t('没有账号?') }}</ElText>
          <ElButton type="primary" link @click="goTo('email-register')">{{ t('去注册') }}</ElButton>
        </div>
        <div>
          <ElButton class="" type="primary" link @click="goTo('reset-pwd')">{{ t('忘记密码?') }}</ElButton>
        </div>
      </div>
    </template>
  </AsyncMForm>
</template>
