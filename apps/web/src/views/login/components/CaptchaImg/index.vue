<script lang="ts" setup>
import type { ICaptchaImgProps } from './ICaptchaImg'
import { t } from '@/i18n'

defineOptions({ name: 'CaptchaImg' })
const props = defineProps<ICaptchaImgProps>()
</script>

<template>
  <MButton class="CaptchaImg_container max-h-[32px] flex-center cursor-pointer select-none overflow-hidden border rounded-[4px] p-0">
    <template v-if="props.captchaImgUrl">
      <img :src="props.captchaImgUrl" :alt="t('views.Login.components.CaptchaImg.alt')" class="block h-full w-full object-cover" />
    </template>
    <template v-else> {{ t('views.Login.components.CaptchaImg.text') }} </template>
  </MButton>
</template>
