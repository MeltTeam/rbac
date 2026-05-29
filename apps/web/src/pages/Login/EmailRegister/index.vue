<script lang="ts" setup>
import { MForm } from '@/components'
import { useEmailRegister } from './useEmailRegister'

defineOptions({ name: 'EmailRegister' })
const { setInstance, formItems, formRules, formData, getFormTitle } = useEmailRegister()
</script>

<template>
  <MForm :ref="setInstance" validate-on-rule-change :form-title="getFormTitle()" :form-items="formItems" :rules="formRules" :model="formData"></MForm>
</template>
