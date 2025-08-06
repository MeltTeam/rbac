<script lang="ts" setup>
import type { ICaptchaImgProps } from './ICaptchaImg'
import { t } from '@/i18n'

defineOptions({
  name: 'CaptchaImg',
})
const props = defineProps<ICaptchaImgProps>()
</script>

<template>
  <div class="CaptchaImg_container max-h-[32px] flex-center cursor-pointer select-none overflow-hidden border rounded-[4px] bg-amber">
    <template v-if="props.captchaImgUrl">
      <img :src="props.captchaImgUrl" :alt="t('图片验证码')" class="block h-full w-full object-cover" />
    </template>
    <template v-else> {{ t('图片占位') }} </template>
  </div>
</template>
