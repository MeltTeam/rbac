<script lang="ts" setup>
import { MForm } from '@/components'
import { LoginProblem } from '../components'
import { useEmailLogin } from './useEmailLogin'

defineOptions({ name: 'EmailLogin' })
const { setInstance, formItems, formRules, formData, getFormTitle } = useEmailLogin()
</script>

<template>
  <MForm :ref="setInstance" validate-on-rule-change :form-title="getFormTitle()" :form-items="formItems" :rules="formRules" :model="formData">
    <template #ItemLoginProblem>
      <LoginProblem />
    </template>
  </MForm>
</template>
