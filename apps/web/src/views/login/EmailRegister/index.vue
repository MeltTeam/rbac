<script lang="ts" setup>
import { AsyncMForm } from '@/components'
import { useEmailRegister } from './useEmailRegister'

defineOptions({
  name: 'EmailRegister',
})
const { setInstance, formItems, formRules, formData, getFormTitle } = useEmailRegister()
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
