<script lang="ts" setup>
import { MI18nBtn, MModeBtn, MThemeBtn } from '@/components'
import MBanner from '@/layouts/components/MBanner/index.vue'
import { loginCacheStore } from '@/stores'

defineOptions({ name: 'LoginLayout' })
const loginCache = loginCacheStore()
const cache = computed(() => loginCache.cache)
const cacheMax = computed(() => Math.max(cache.value.length, 1))
const route = useRoute()

// 捕获 KeepAlive 的内部错误
onErrorCaptured((err, instance, info) => {
  console.error('Error captured in LoginLayout:', err, info)
  return false
})

watch(
  () => route.name,
  (name) => {
    if (route.meta.isCache && name) {
      loginCache.addCache(name as string)
    }
  },
  { immediate: true },
)
</script>

<template>
  <div
    class="LoginLayout_container wh-full flex-center overflow-hidden bg-[url(@/assets/preImages/bg.svg)] dark:relative dark:from-primary-950 dark:to-slate-950 dark:bg-gradient-to-bl before:content-none dark:before:[background-image:radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] dark:before:[background-size:24px_24px] dark:before:pointer-events-none dark:before:absolute dark:before:inset-0 dark:before:content-['']"
  >
    <div
      class="relative min-h-auto w-[24rem] flex overflow-hidden rounded-[2rem] bg-el-bg px-1rem py-2rem shadow-lg shadow-slate-500/40 2xl:w-[39rem] lg:w-[39rem] md:w-[39rem] sm:w-[24rem] xl:w-[39rem] dark:bg-el-bg dark:shadow-[10px_10px_15px_-3px_rgba(255,255,255,0.4)]"
    >
      <div class="left hidden min-w-[50%] flex-1 items-center justify-center px-[1rem] md:flex">
        <MBanner />
      </div>
      <div class="right flex-1">
        <div class="flex justify-end pb-2">
          <div
            class="flex rounded-[.5rem] bg-el-bg shadow-lg shadow-slate-500/40 dark:bg-el-bg dark:shadow-[10px_10px_15px_-3px_rgba(255,255,255,0.4)]"
          >
            <MThemeBtn />
            <MI18nBtn />
            <MModeBtn />
          </div>
        </div>
        <div class="right_content overflow-hidden">
          <RouterView v-slot="{ Component, route: currentRoute }">
            <Transition name="slide-down" mode="out-in">
              <KeepAlive :include="cache" :max="cacheMax">
                <component :is="Component" :key="currentRoute.path" />
              </KeepAlive>
            </Transition>
          </RouterView>
        </div>
      </div>
    </div>
  </div>
</template>
