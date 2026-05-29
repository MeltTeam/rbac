<script lang="ts" setup>
import { MForm } from '@/components'
import { LoginProblem } from '../components'
import { useSvgLogin } from './useSvgLogin'

defineOptions({ name: 'SvgLogin' })
const { formData, formRules, setInstance, formItems, getFormTitle } = useSvgLogin()
</script>

<template>
  <MForm :ref="setInstance" validate-on-rule-change :form-title="getFormTitle()" :form-items="formItems" :rules="formRules" :model="formData">
    <template #ItemLoginProblem>
      <LoginProblem />
    </template>
  </MForm>
</template>
