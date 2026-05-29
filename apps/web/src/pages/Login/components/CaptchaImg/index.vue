<script lang="ts" setup>
import type { ICaptchaImgProps } from './ICaptchaImg'
import { t } from '@/i18n'

defineOptions({ name: 'CaptchaImg' })
const props = defineProps<ICaptchaImgProps>()
</script>

<template>
  <MButton class="captcha_img_container" :class="{ captcha_img_loading: props.disabled }" :disabled="props.disabled">
    <template v-if="props.captchaImgUrl">
      <div class="captcha_img_img_container">
        <img :src="props.captchaImgUrl" :alt="t('pages.Login.components.CaptchaImg.alt')" />
      </div>
    </template>
    <template v-else> {{ props.text ?? t('pages.Login.components.CaptchaImg.text') }} </template>
    <div v-if="props.disabled" class="captcha_img_loading_overlay">
      <div class="captcha_img_spinner">
        <div class="captcha_img_spinner_dot"></div>
        <div class="captcha_img_spinner_dot"></div>
        <div class="captcha_img_spinner_dot"></div>
      </div>
    </div>
  </MButton>
</template>

<style>
.captcha_img_container {
  @apply max-h-[32px] flex-center cursor-pointer select-none overflow-hidden border rounded-[4px] p-0 relative transition-all duration-300;
}
.captcha_img_container.captcha_img_loading {
  @apply cursor-not-allowed;
}
.captcha_img_img_container {
  @apply relative transition-opacity duration-300;
}
.captcha_img_container.captcha_img_loading .captcha_img_img_container {
  @apply opacity-30;
}
.captcha_img_img_container > img {
  @apply block h-full w-full object-cover;
}
.captcha_img_loading_overlay {
  @apply absolute inset-0 bg-primary-200/80 flex items-center justify-center z-10 backdrop-blur-[1px];
  animation: fadeIn 0.2s ease-out;
}
.captcha_img_spinner {
  @apply flex items-center gap-1;
}
.captcha_img_spinner_dot {
  @apply w-2 h-2 rounded-full bg-primary;
  animation: bounce 1.4s ease-in-out infinite both;
}
.captcha_img_spinner_dot:nth-child(1) {
  animation-delay: -0.32s;
}
.captcha_img_spinner_dot:nth-child(2) {
  animation-delay: -0.16s;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1.2);
    opacity: 1;
  }
}
</style>
