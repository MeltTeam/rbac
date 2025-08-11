<script lang="ts" setup>
import { AsyncMForm } from '@/components'
import { t } from '@/i18n'
import { goTo } from '@/router'
import { useSvgLogin } from './useSvgLogin'

defineOptions({ name: 'SvgLogin' })
const { formData, formRules, setInstance, formItems, getFormTitle } = useSvgLogin()
</script>

<template>
  <AsyncMForm :ref="setInstance" validate-on-rule-change :form-title="getFormTitle()" :form-items="formItems" :rules="formRules" :model="formData">
    <template #register>
      <div class="w-full flex justify-between">
        <div>
          <ElText>{{ t('没有账号?') }}</ElText>
          <ElButton type="primary" link @click="goTo('EmailRegister')">{{ t('去注册') }}</ElButton>
        </div>
        <div>
          <ElButton type="primary" link @click="goTo('ResetPwd')">{{ t('忘记密码?') }}</ElButton>
        </div>
      </div>
    </template>
  </AsyncMForm>
</template>
