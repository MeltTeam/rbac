<script lang="ts" setup>
import type { IColorPalette } from '@/utils/colorPalette.util'
import { modeStore, themeStore } from '@/stores'
import { generatePalette } from '@/utils/colorPalette.util'

defineOptions({ name: 'ColorPalette' })
const r = useRouter()
const mode = modeStore()
const theme = themeStore()

const colors: Array<string> = [
  '#64748b',
  '#6b7280',
  '#71717a',
  '#737373',
  '#78716c',
  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#eab308',
  '#84cc16',
  '#22c55e',
  '#10b981',
  '#14b8a6',
  '#06b6d4',
  '#0ea5e9',
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#a855f7',
  '#d946ef',
  '#ec4899',
  '#f43f5e',
]

const colorPalette = computed<Array<Array<IColorPalette>>>(() => colors.map((color) => generatePalette(color)))
const customColorPalette = computed<Array<IColorPalette>>(() => generatePalette(theme.primaryColor))
</script>

<template>
  <div class="ColorPalette_container flex-col-center py-10">
    <div class="ColorPalette_container_item">
      <MButton @click="() => r.push({ name: 'Dashboard' })"> Dashboard </MButton>
    </div>
    <div class="ColorPalette_container_item">
      <p class="text-lg text-el-primary font-semibold">当前模式: {{ mode.mode }}</p>
      <p class="text-el-secondary">是否为暗黑模式: {{ mode.isDark }}</p>
    </div>
    <div class="ColorPalette_container_item">
      <p class="text-lg text-el-primary font-semibold">当前主题色</p>
      <div class="flex-center gap-4">
        <div class="h-16 w-16 rounded-lg shadow-md" :style="{ backgroundColor: theme.primaryColor }" />
        <div class="text-el-secondary">
          <p>HEX: {{ theme.primaryColor }}</p>
          <p>RGB: {{ theme.primaryColorRgb }}</p>
        </div>
      </div>
    </div>
    <div class="ColorPalette_container_item">
      <p class="mb-2 text-el-primary">自定义主题色</p>
      <div class="flex flex-wrap justify-center gap-1">
        <div
          v-for="{ text, color, num } in customColorPalette"
          :key="color"
          class="ColorPalette_item"
          :style="`color:${text};background-color:${color};`"
        >
          <div>{{ num }}</div>
          <div>背景颜色: {{ color }}</div>
          <div>文字颜色: {{ text }}</div>
        </div>
      </div>
      <div class="mt-4 flex-center gap-4">
        <MThemeBtn />
      </div>
    </div>
    <div class="ColorPalette_container_item">
      <p class="mb-2 text-el-primary">类 Tailwind CSS 颜色</p>
      <div class="max-h-[calc(6rem_*_3_+_0.25rem_*_4)] w-[80%] overflow-auto border border-el-border rounded-lg p-1">
        <div class="flex flex-wrap justify-center gap-1">
          <div v-for="(palette, index) in colorPalette" :key="index" class="flex flex-wrap justify-center gap-1">
            <div v-for="{ text, color, num } in palette" :key="color" class="ColorPalette_item" :style="`color:${text};background-color:${color};`">
              <div>{{ num }}</div>
              <div>背景颜色: {{ color }}</div>
              <div>文字颜色: {{ text }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="ColorPalette_container_item">
      <p class="mb-2 text-el-primary">Element Plus 语义化颜色</p>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-3 sm:grid-cols-2">
        <div class="card p-4">
          <p class="mb-2 text-el-primary">主要文本</p>
          <div class="h-10 w-full rounded bg-el-bg" />
        </div>
        <div class="card p-4">
          <p class="mb-2 text-el-secondary">次要文本</p>
          <div class="h-10 w-full rounded bg-el-fill" />
        </div>
        <div class="card p-4">
          <p class="mb-2 text-el-placeholder">占位文本</p>
          <div class="h-10 w-full border border-el-border rounded" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ColorPalette_container_item {
  @apply mb-[2rem] flex-col-center gap-1;
}
.ColorPalette_item {
  @apply h-[3rem] w-[6rem] select-none border rounded-[4px] p-1 text-center text-[.5rem] font-100;
}
</style>
