<script lang="ts" setup>
import type { IMLoadingProps } from './IMLoading'

defineOptions({
  name: 'MLoading',
})
const props = withDefaults(defineProps<IMLoadingProps>(), {
  count: 5,
  title: import.meta.env.VITE_APP_TITLE,
})
</script>

<template>
  <div class="MLoading_container z-36 wh-full flex-center bg-[#212121]">
    <div class="flex-center flex-col gap-[8px]">
      <section class="dots_container">
        <div v-for="i in props.count" :key="`dot${i}`" class="dot"></div>
      </section>
      <div class="title">{{ props.title ?? 'vite app' }}</div>
    </div>
  </div>
</template>

<style scoped>
.MLoading_container {
  --color-1: #b3d4fc;
  --color-2: #6793fb;
  --color-shadow-1: rgba(178, 212, 252, 0.7);
  --color-shadow-2: rgba(178, 212, 252, 0);
  --size: 20px;
  --size-radius: calc(20px / 2);
  position: absolute;
  top: 0;
  left: 0;
}
.title {
  text-align: center;
  width: 100%;
  font-size: var(--size);
  line-height: var(--size);
  color: var(--color-1);
  user-select: none;
  animation: pulseText 1.5s infinite ease-in-out;
}
.dots_container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}
.dot {
  height: var(--size);
  width: var(--size);
  margin-right: var(--size-radius);
  border-radius: var(--size-radius);
  background-color: var(--color-1);
  animation: pulse 1.5s infinite ease-in-out;
}

.dot:last-child {
  margin-right: 0;
}

.dot:nth-child(1) {
  animation-delay: -0.3s;
}

.dot:nth-child(2) {
  animation-delay: -0.1s;
}

.dot:nth-child(3) {
  animation-delay: 0.1s;
}

@keyframes pulse {
  0% {
    transform: scale(0.8);
    background-color: var(--color-1);
    box-shadow: 0 0 0 0 var(--color-shadow-1);
  }

  50% {
    transform: scale(1.2);
    background-color: var(--color-2);
    box-shadow: 0 0 0 10px var(--color-shadow-2);
  }

  100% {
    transform: scale(0.8);
    background-color: var(--color-1);
    box-shadow: 0 0 0 0 var(--color-shadow-1);
  }
}
@keyframes pulseText {
  0% {
    color: var(--color-1);
    text-shadow:
      1px 1px 2px var(--color-shadow-1),
      0 0 20px var(--color-shadow-2),
      0 0 4px var(--color-shadow-2);
  }

  50% {
    color: var(--color-2);
    text-shadow:
      1px 1px 2px var(--color-shadow-2),
      0 0 20px var(--color-shadow-1),
      0 0 4px var(--color-shadow-2);
  }

  100% {
    color: var(--color-1);
    text-shadow:
      1px 1px 2px var(--color-shadow-1),
      0 0 20px var(--color-shadow-2),
      0 0 4px var(--color-shadow-1);
  }
}
</style>
