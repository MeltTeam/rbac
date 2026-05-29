import type { FormInstance, FormRules } from 'element-plus'
import type { SvgLoginDTO } from '@/apis'
import type { IFormItems } from '@/components'
import { Icon } from '@iconify/vue'
import { computed } from 'vue'
import { CAPTCHA_LENGTH, PWD_MAX, PWD_MIN, USER_NAME_MAX, USER_NAME_MIN } from '@/constants'
import { t } from '@/i18n'
import { userStore } from '@/stores'
import { getPostLoginRedirectPath } from '@/utils/loginRedirect.util'
import { CaptchaImg, OtherLogin } from '../components'

const API = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')

export function useSvgLogin() {
  const auth = userStore()
  const r = useRouter()
  const route = useRoute()
  const formData = reactive<SvgLoginDTO>({
    name: 'super',
    pwd: 'Aa123456',
    captcha: '',
    token: '',
  })

  const getFormTitle = () => t('pages.Login.SvgLogin.title')

  const formInstance = ref<FormInstance | null>(null)

  const captchaImgUrl = ref<null | string>(null)

  const formRules = computed<FormRules<SvgLoginDTO>>(() => ({
    name: [
      { required: true, message: t('common.form.username'), trigger: ['blur', 'change'] },
      {
        min: USER_NAME_MIN,
        max: USER_NAME_MAX,
        message: `${t('common.form.usernameLength')} ${USER_NAME_MIN} ~ ${USER_NAME_MAX}`,
        trigger: ['blur', 'change'],
      },
    ],
    pwd: [
      { required: true, message: t('common.form.password'), trigger: ['blur', 'change'] },
      { min: PWD_MIN, max: PWD_MAX, message: `${t('common.form.passwordLength')} ${PWD_MIN} ~ ${PWD_MAX}`, trigger: ['blur', 'change'] },
    ],
    captcha: [
      { required: true, message: t('common.form.captcha'), trigger: ['blur', 'change'] },
      {
        min: CAPTCHA_LENGTH,
        max: CAPTCHA_LENGTH,
        message: `${t('common.form.captchaLength')} ${CAPTCHA_LENGTH}`,
        trigger: ['blur', 'change'],
      },
    ],
  }))

  function setInstance(ref: Element | ComponentPublicInstance | null, _refs: Record<string, any>) {
    formInstance.value = ref as FormInstance
  }

  const captchaImgDisabled = ref(false)

  async function getCaptchaHandler() {
    formData.captcha = ''
    const { code, data } = await auth.svgCode('login')
    if (code === '0') {
      formData.token = data?.token
      captchaImgUrl.value = data?.svg
    }
  }

  async function submitHandler() {
    const isValid = await formInstance.value?.validate().catch(() => null)
    if (!isValid) return
    const { code } = await auth.login('svg', formData)
    if (code !== '0') {
      getCaptchaHandler()
      return
    }
    ElMessage({ message: t('pages.Login.SvgLogin.success'), type: 'success', duration: 1000 })
    await auth.getMeInfo().catch(() => null)
    const path = getPostLoginRedirectPath(route.query.redirect)
    await r.push(path)
  }

  const formItems = computed<IFormItems[]>(() => [
    {
      type: 'ElInput',
      key: 'name',
      props: {
        placeholder: t('common.form.username'),
        autocomplete: 'off',
        prefixIcon: h(Icon, {
          icon: 'icon-park-outline:user',
          color: '#bbb',
        }),
      },
    },
    {
      type: 'ElInput',
      key: 'pwd',
      props: {
        showPassword: true,
        type: 'password',
        placeholder: t('common.form.password'),
        autocomplete: 'off',
        prefixIcon: h(Icon, {
          icon: 'icon-park-outline:key',
          color: '#bbb',
        }),
      },
    },
    {
      type: 'ElInput',
      key: 'captcha',
      props: {
        placeholder: t('common.form.captcha'),
        autocomplete: 'off',
        prefixIcon: h(Icon, {
          icon: 'icon-park-outline:unlock-one',
          color: '#bbb',
        }),
      },
      span: 14,
    },
    {
      type: () =>
        h(CaptchaImg, {
          captchaImgUrl: captchaImgUrl.value ?? undefined,
          disabled: captchaImgDisabled.value,
        }),
      key: 'captchaImg',
      attrs: {
        onClick: async () => {
          captchaImgDisabled.value = true
          await formInstance.value
            ?.validateField(['name', 'pwd'])
            .catch(() => ElMessage({ message: t('pages.Login.SvgLogin.captchaWarning'), type: 'warning', duration: 1000 }))
          await getCaptchaHandler()
            .catch(() => null)
            .finally(() => setTimeout(() => (captchaImgDisabled.value = false), 800))
        },
      },
      span: 10,
    },
    {
      type: 'Template',
      key: 'LoginProblem',
    },
    {
      type: 'MButton',
      key: 'submit',
      props: { type: 'primary' },
      attrs: {
        onClick: submitHandler,
      },
      slots: t('common.form.confirm'),
    },
    {
      type: 'MButton',
      key: 'EmailLogin',
      attrs: {
        onClick: () => r.push({ name: 'EmailLogin' }),
      },
      props: {
        icon: h(Icon, { icon: 'icon-park-outline:email-block' }),
      },
      slots: t('pages.Login.components.OtherLogin.Email'),
      span: 8,
    },
    {
      type: 'MButton',
      key: 'QRCode',
      attrs: {
        onClick: () => ElMessage({ message: '功能开发中...', type: 'warning', duration: 1000 }),
      },
      props: {
        icon: h(Icon, { icon: 'icon-park-outline:scan-code' }),
      },
      slots: t('pages.Login.components.OtherLogin.QRCode'),
      span: 8,
    },
    {
      type: 'MButton',
      key: 'Phone',
      attrs: {
        onClick: () => ElMessage({ message: '功能开发中...', type: 'warning', duration: 1000 }),
      },
      props: {
        icon: h(Icon, { icon: 'icon-park-outline:iphone' }),
      },
      slots: t('pages.Login.components.OtherLogin.Phone'),
      span: 8,
    },
    {
      type: () =>
        h(OtherLogin, {
          items: [
            {
              icon: 'simple-icons:gitee',
              title: t('pages.Login.components.OtherLogin.Gitee'),
              onClick: () => (window.location.href = `${API}/v1/auth/login/gitee`),
            },
            {
              icon: 'icon-park-outline:wechat',
              title: t('pages.Login.components.OtherLogin.WeChat'),
              onClick: () => ElMessage({ message: '功能开发中...', type: 'warning', duration: 1000 }),
            },
            {
              icon: 'icon-park-outline:tencent-qq',
              title: t('pages.Login.components.OtherLogin.QQ'),
              onClick: () => (window.location.href = `${API}/v1/auth/login/qq`),
            },
            {
              icon: 'icon-park-outline:github',
              title: t('pages.Login.components.OtherLogin.Github'),
              onClick: () => (window.location.href = `${API}/v1/auth/login/github`),
            },
            {
              icon: 'icon-park-outline:google',
              title: t('pages.Login.components.OtherLogin.Google'),
              onClick: () => ElMessage({ message: '功能开发中...', type: 'warning', duration: 1000 }),
            },
          ],
        }),
      key: 'OtherLogin',
    },
  ])

  getCaptchaHandler()

  async function enterHandler(e: KeyboardEvent) {
    if (e.key !== 'Enter') return
    await submitHandler()
  }
  // 异步组件绑定事件
  // watch(
  //   formInstance,
  //   (val) => {
  //     if (!val) return
  //     window.addEventListener('keydown', enterHandler)
  //   },
  //   { once: true },
  // )
  onActivated(() => {
    window.addEventListener('keydown', enterHandler)
  })
  onDeactivated(() => {
    window.removeEventListener('keydown', enterHandler)
  })

  return {
    formData,
    formInstance,
    formRules,
    setInstance,
    formItems,
    getFormTitle,
  }
}
