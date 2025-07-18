<script lang="ts" setup>
import { ElImage } from 'element-plus'
import bannerUrl from '@/assets/preImages/login_banner.webp'

defineOptions({
  name: 'LoginLayout',
})
</script>

<template>
  <div class="overflow-hidden bg-[url(@/assets/preImages/bg.png)] wh-full f-c-c">
    <div
      class="relative w-[20rem] flex overflow-hidden rounded-[2rem] bg-white px-1rem py-2rem shadow-lg shadow-stone-500/40 2xl:w-[35rem] lg:w-[35rem] md:w-[35rem] sm:w-[20rem] xl:w-[35rem]"
    >
      <div class="left hidden min-w-[50%] flex-1 px-[1rem] md:f-c-c">
        <ElImage fill="contain" :src="bannerUrl" alt="横幅" />
      </div>
      <div class="right flex-1">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
