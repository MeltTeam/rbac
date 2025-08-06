/* eslint-disable style/quote-props */
import type { ILoginBySvgDto } from '@packages/types'
import type { FormInstance, FormRules } from 'element-plus'
import type { IFormItems } from '@/components'
import { Icon } from '@iconify/vue'
import { api } from '@/api'
import { CAPTCHA, CAPTCHA_LENGTH, PWD, PWD_MAX, PWD_MIN, USER_NAME, USER_NAME_MAX, USER_NAME_MIN } from '@/constants'
import { t } from '@/i18n'
import { goTo } from '@/router'
import { CaptchaImg } from '../components'

export function useSvgLogin() {
  const formData = reactive<ILoginBySvgDto>({
    username: '',
    password: '',
    captcha: '',
    token: '',
  })
  const getFormTitle = () => t('登录')
  const formInstance = ref<FormInstance | null>(null)
  const captchaImgUrl = ref<null | string>(null)
  const formRules = reactive<FormRules<ILoginBySvgDto>>({
    username: [
      { required: true, message: `${t('请输入')}${t(USER_NAME)}`, trigger: ['blur', 'change'] },
      {
        min: USER_NAME_MIN,
        max: USER_NAME_MAX,
        message: `${t(USER_NAME)}${t('长度')} ${USER_NAME_MIN} ~ ${USER_NAME_MAX}`,
        trigger: ['blur', 'change'],
      },
    ],
    password: [
      { required: true, message: `${t('请输入')}${t(PWD)}`, trigger: ['blur', 'change'] },
      { min: PWD_MIN, max: PWD_MAX, message: `${t(PWD)}${t('长度')} ${PWD_MIN} ~ ${PWD_MAX}`, trigger: ['blur', 'change'] },
    ],
    captcha: [
      { required: true, message: `${t('请输入')}${t(CAPTCHA)}`, trigger: ['blur', 'change'] },
      { min: CAPTCHA_LENGTH, max: CAPTCHA_LENGTH, message: `${t(CAPTCHA)}${t('长度')} ${CAPTCHA_LENGTH}`, trigger: ['blur', 'change'] },
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
        onClick: () => goTo('EmailLogin'),
      },
      slots: t('邮箱登录'),
    },
  ])
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
