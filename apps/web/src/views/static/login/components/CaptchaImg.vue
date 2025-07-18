<script lang="ts" setup>
defineOptions({
  name: 'CaptchaImg',
})
const props = defineProps<{
  captchaImgUrl?: string
}>()
</script>

<template>
  <div class="cursor-pointer select-none overflow-hidden rounded-[4px] bg-amber">
    <template v-if="props.captchaImgUrl">
      <img :src="props.captchaImgUrl" alt="svg验证码" class="block h-full w-full object-cover" />
    </template>
    <template v-else> 验证码占位 </template>
  </div>
</template>

<style scoped></style>
