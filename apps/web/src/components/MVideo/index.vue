<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

defineOptions({ name: 'MVideo' })
const isRecording = ref(false)
const videoUrl = ref<string | null>(null)
const downloadUrl = ref<string | null>(null)
const downloadName = ref<string>('recording.mp4')
const recordedChunks = ref<Blob[]>([])
let mediaRecorder: MediaRecorder | null = null

async function startRecording() {
  try {
    // 获取屏幕共享流
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: { width: 1920, height: 1080 }, // 设置视频清晰度
      audio: true, // 如果需要录制音频，确保浏览器支持
    })

    // 创建 MediaRecorder 实例
    mediaRecorder = new MediaRecorder(stream)
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.value.push(event.data)
      }
    }

    // 开始录制
    mediaRecorder.start()

    // 设置状态
    isRecording.value = true
  } catch (error) {
    console.error('获取屏幕共享失败:', error)
    ElMessage.error('您取消了屏幕共享或发生了错误')
  }
}

function stopRecording() {
  if (mediaRecorder) {
    mediaRecorder.stop()
    mediaRecorder.onstop = () => {
      // 合并录制的视频块
      const blob = new Blob(recordedChunks.value, { type: 'video/mp4' })
      const url = URL.createObjectURL(blob)

      // 设置视频 URL
      videoUrl.value = url

      // 提供下载链接
      downloadUrl.value = url
      downloadName.value = `recording-${new Date().toISOString().slice(0, 19).replace('T', '_').replace(/:/g, '-')}.mp4`

      // 清空录制数据
      recordedChunks.value = []

      // 设置状态
      isRecording.value = false
    }
  }
}
</script>

<template>
  <div>
    <MButton :disabled="isRecording" @click="startRecording">开始录屏</MButton>
    <MButton :disabled="!isRecording" @click="stopRecording">停止录屏</MButton>
    <video v-if="videoUrl" class="video_container" :src="videoUrl" controls></video>
    <a v-if="downloadUrl" type="default" link :href="downloadUrl" :download="downloadName" class="download-link"> 下载视频 </a>
  </div>
</template>

<style scoped>
.video_container {
  width: 100%;
  max-width: 600px;
  margin-top: 20px;
}
.download-link {
  display: block;
  margin-top: 10px;
  padding: 10px 20px;
  font-size: 16px;
  text-decoration: none;
  color: white;
  background-color: #007bff;
}
</style>
