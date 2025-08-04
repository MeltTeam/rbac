<script lang="ts" setup>
import type { ICaptchaImgProps } from './ICaptchaImg'

defineOptions({
  name: 'CaptchaImg',
})
const props = withDefaults(defineProps<ICaptchaImgProps>(), {
  text: '点击刷新',
})
</script>

<template>
  <div class="CaptchaImg_container max-h-[32px] cursor-pointer select-none overflow-hidden border rounded-[4px] bg-amber f-c-c">
    <template v-if="props.captchaImgUrl">
      <img :src="props.captchaImgUrl" alt="图片验证码" class="block h-full w-full object-cover" />
    </template>
    <template v-else> {{ props.text }} </template>
  </div>
</template>
