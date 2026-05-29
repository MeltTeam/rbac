<script lang="ts" setup>
import { t } from '@/i18n'

defineOptions({ name: 'LoginProblem' })
const r = useRouter()
</script>

<template>
  <div class="w-full flex justify-between">
    <div class="flex select-none">
      <span class="noAccount"> {{ t('pages.Login.SvgLogin.noAccount') }}</span>
      <ElButton type="primary" link @click="() => r.push({ name: 'EmailRegister' })">{{ t('pages.Login.SvgLogin.register') }}</ElButton>
    </div>
    <div>
      <ElButton type="primary" link @click="() => r.push({ name: 'ResetPwd' })">{{ t('pages.Login.SvgLogin.forgetPwd') }}</ElButton>
    </div>
  </div>
</template>

<style scoped>
.noAccount {
  color: var(--el-text-color-regular);
}
</style>
