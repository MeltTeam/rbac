<script lang="ts" setup>
import type { ColorPickerPanelInstance, DropdownInstance } from 'element-plus'
import { Icon } from '@iconify/vue'
import { t } from '@/i18n'
import { themeStore } from '@/stores'

defineOptions({ name: 'MThemeBtn' })
const predefineColors = ['#17B8A6', '#38bdf8', '#F50057', '#f59e0b', '#6c63ff']
const theme = themeStore()
const color = ref<string>(theme.primaryColor.toUpperCase())
const ElColorPickerPanelRef = ref<ColorPickerPanelInstance | null>(null)
const ElDropdownRef = ref<DropdownInstance | null>(null)
const dropdownVisible = ref(false)
function handleApplyColor() {
  if (!color.value || !color.value.startsWith('#') || color.value.length !== 7) return void 0
  theme.setPrimaryColor(color.value)
  ElDropdownRef.value?.handleClose()
}
function handleResetColor() {
  theme.reset()
  ElDropdownRef.value?.handleClose()
}

/** 处理下拉框显示状态变化(当面板显示时，更新颜色选择器的位置) */
function handleDropdownVisibleChange(visible: boolean) {
  dropdownVisible.value = visible
  if (visible && ElColorPickerPanelRef.value) nextTick(() => ElColorPickerPanelRef.value?.update())
}

/** 监听主题色变化，同步更新本地颜色值 */
watch(
  () => theme.primaryColor,
  (newColor) => {
    color.value = newColor.toUpperCase()
  },
)
</script>

<template>
  <div class="m-theme-button-container flex">
    <ElTooltip :auto-close="500" placement="bottom" :content="t('components.MThemeBtn.content')">
      <ElDropdown
        ref="ElDropdownRef"
        size="large"
        placement="bottom"
        trigger="click"
        popper-class="m-theme-button-popper-container"
        @visible-change="handleDropdownVisibleChange"
      >
        <ElButton class="z-1 m-0 border-none">
          <template #icon>
            <Icon class="cursor-pointer color-primary" icon="icon-park-outline:color-filter" />
          </template>
        </ElButton>
        <template #dropdown>
          <ElColorPickerPanel ref="ElColorPickerPanelRef" v-model="color" :predefine="predefineColors" color-format="hex" :border="false">
            <template #footer>
              <ElButton @click="handleApplyColor">
                {{ t('components.MThemeBtn.apply') }}
              </ElButton>
              <ElButton @click="handleResetColor">
                {{ t('components.MThemeBtn.reset') }}
              </ElButton>
            </template>
          </ElColorPickerPanel>
        </template>
      </ElDropdown>
    </ElTooltip>
  </div>
</template>

<style scoped></style>
