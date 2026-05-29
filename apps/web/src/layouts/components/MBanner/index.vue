<script lang="ts" setup>
import svg2 from '@/assets/illustrations/2.svg?raw'
import logoRaw from '@/assets/logo.svg?raw'
import { TITLE } from '@/constants'
import { modeStore, themeStore } from '@/stores'

defineOptions({ name: 'MBanner' })
const theme = themeStore()
const mode = modeStore()
const canvasRef = ref<HTMLCanvasElement | null>(null)
const primaryColor = computed(() => theme.primaryColor)
const inkColor = computed(() => (mode.isDark ? '#cfd3dc' : '#4e5969'))

function renderSvgToCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const svgContent = svg2.replace(/__PRIMARY_COLOR__/g, primaryColor.value).replace(/__INK_COLOR__/g, inkColor.value)
  const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' })
  const svgUrl = URL.createObjectURL(svgBlob)
  const logoContent = logoRaw.replace(/__PRIMARY_COLOR__/g, primaryColor.value).replace(/__INK_COLOR__/g, inkColor.value)
  const logoBlob = new Blob([logoContent], { type: 'image/svg+xml;charset=utf-8' })
  const logoUrl = URL.createObjectURL(logoBlob)
  const img = new Image()
  const cleanup = () => {
    URL.revokeObjectURL(svgUrl)
    URL.revokeObjectURL(logoUrl)
  }
  img.onerror = cleanup
  img.onload = () => {
    const dpr = window.devicePixelRatio || 1
    const width = 250
    const height = 380
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.scale(dpr, dpr)
    const logoSize = 48
    const fontSize = 24
    ctx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`
    const logoY = 20
    const textY = logoY + logoSize + 16
    const illustrationY = textY + fontSize + 24
    const logoImg = new Image()
    logoImg.onerror = cleanup
    logoImg.onload = () => {
      try {
        ctx.drawImage(logoImg, (250 - logoSize) / 2, logoY, logoSize, logoSize)
        ctx.fillStyle = inkColor.value
        ctx.textBaseline = 'top'
        ctx.textAlign = 'center'
        ctx.fillText(TITLE, 250 / 2, textY)
        ctx.drawImage(img, 0, illustrationY, 250, 250)
      } finally {
        cleanup()
      }
    }
    logoImg.src = logoUrl
  }
  img.src = svgUrl
}

watch([primaryColor, inkColor], renderSvgToCanvas)

onMounted(renderSvgToCanvas)
</script>

<template>
  <div class="MBanner_container h-full w-full flex-col-center select-none overflow-hidden">
    <canvas ref="canvasRef" class="MBanner_canvas" width="250" height="380"></canvas>
  </div>
</template>

<style scoped>
.MBanner_container {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}
</style>
