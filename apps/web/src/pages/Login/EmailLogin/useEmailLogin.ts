import type { FormInstance, FormRules } from 'element-plus'
import type { EmailLoginDTO } from '@/apis'
import type { IFormItems } from '@/components'
import { Icon } from '@iconify/vue'
import { CAPTCHA_LENGTH, PWD_MAX, PWD_MIN } from '@/constants'
import { t } from '@/i18n'
import { userStore } from '@/stores'
import { getPostLoginRedirectPath } from '@/utils/loginRedirect.util'

export function useEmailLogin() {
  const route = useRoute()
  const r = useRouter()
  const { login, emailCode, getMeInfo } = userStore()
  const formData = reactive<EmailLoginDTO>({
    email: '',
    pwd: '',
    captcha: '',
  })
  const getFormTitle = () => t('pages.Login.EmailLogin.title')
  const formInstance = ref<FormInstance | null>(null)
  function setInstance(_formInstance: any) {
    formInstance.value = _formInstance ?? null
  }
  const emailValidateState = computed(() => {
    const email = formInstance.value?.fields.find((field: any) => field.prop === 'email')
    return !email || email.validateState !== 'success'
  })
  const pwdValidateState = computed(() => {
    const pwd = formInstance.value?.fields.find((field: any) => field.prop === 'pwd')
    return !pwd || pwd.validateState !== 'success'
  })
  const formValidateState = computed<boolean>(() => {
    const length = formInstance.value?.fields.length
    return formInstance.value?.fields.filter((field: any) => field.validateState === 'success').length !== length
  })
  async function getCaptchaHandler() {
    try {
      formData.captcha = ''
      const { code, msg } = await emailCode('login', { email: formData.email })
      if (code !== '0') {
        ElMessage({ message: msg, type: 'error', duration: 1000 })
        return
      }
      ElMessage({ message: msg, type: 'success', duration: 1000 })
    } catch (e) {
      console.error(e)
    }
  }
  async function submitHandler() {
    formInstance.value?.validate(async (isValid: boolean) => {
      if (isValid) {
        try {
          const { code, msg } = await login('email', formData)
          if (code !== '0') {
            ElMessage({ message: msg, type: 'error', duration: 1000 })
            return
          }
          ElMessage({ message: t('pages.Login.EmailLogin.success'), type: 'success', duration: 1000 })
          await getMeInfo().catch(() => null)
          const path = getPostLoginRedirectPath(route.query.redirect)
          await r.push(path)
        } catch {
          formData.captcha = ''
        }
      }
    })
  }
  const formRules = computed<FormRules<EmailLoginDTO>>(() => ({
    email: [
      { required: true, message: t('common.form.email'), trigger: ['blur', 'change'] },
      {
        pattern: /^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i,
        message: t('common.form.emailInvalid'),
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
  const formItems = computed<IFormItems[]>(() => [
    {
      type: 'ElInput',
      key: 'email',
      props: {
        placeholder: t('common.form.email'),
        autocomplete: 'off',
        prefixIcon: h(Icon, {
          icon: 'icon-park-outline:email-lock',
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
      type: 'MButton',
      key: 'captchaEmail',
      props: {
        type: 'primary',
        disabled: emailValidateState.value || pwdValidateState.value,
      },
      attrs: {
        onClick: getCaptchaHandler,
      },
      slots: t('common.form.send'),
      span: 10,
    },
    {
      type: 'Template',
      key: 'LoginProblem',
    },
    {
      type: 'MButton',
      key: 'submit',
      props: {
        type: 'primary',

        disabled: formValidateState.value,
      },
      attrs: {
        onClick: submitHandler,
      },
      slots: t('common.form.confirm'),
    },
    {
      type: 'MButton',
      key: 'Back',
      attrs: {
        onClick: r.back,
      },
      slots: t('common.form.back'),
    },
  ])
  async function enterHandler(e: KeyboardEvent) {
    if (e.key !== 'Enter') return
    if (formValidateState.value && !(emailValidateState.value || pwdValidateState.value)) await getCaptchaHandler()
    if (!formValidateState.value) await submitHandler()
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
    /** 表单数据 */
    formData,
    /** 表单实例 */
    formInstance,
    /** 表单规则 */
    formRules,
    /** 表单实例获取  */
    setInstance,
    /** 表单项 */
    formItems,
    /** 获取表单标题 */
    getFormTitle,
  }
}
