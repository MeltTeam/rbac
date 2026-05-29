<script lang="ts" setup>
import { MForm } from '@/components'
import { useResetPwd } from './useResetPwd'

defineOptions({ name: 'ResetPwd' })
const { setInstance, formData, formRules, formItems, getFormTitle } = useResetPwd()
</script>

<template>
  <MForm :ref="setInstance" validate-on-rule-change :form-title="getFormTitle()" :form-items="formItems" :rules="formRules" :model="formData"></MForm>
</template>
