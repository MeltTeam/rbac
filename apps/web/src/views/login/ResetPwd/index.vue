<script lang="ts" setup>
import { AsyncMForm } from '@/components'
import { useResetPwd } from './useResetPwd'

defineOptions({
  name: 'ResetPwd',
})
const { setInstance, formData, formRules, formItems, getFormTitle } = useResetPwd()
</script>

<template>
  <AsyncMForm
    :ref="setInstance"
    validate-on-rule-change
    :form-title="getFormTitle()"
    :form-items="formItems"
    :rules="formRules"
    :model="formData"
  ></AsyncMForm>
</template>
