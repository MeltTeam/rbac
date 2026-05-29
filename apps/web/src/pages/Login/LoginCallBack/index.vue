<script lang="ts" setup>
defineOptions({ name: 'LoginCallBack' })

const r = useRouter()
</script>

<template>
  <div>
    <h1>LoginCallBack</h1>
    <MButton @click="() => r.push({ name: 'Login' })">登录页</MButton>
  </div>
</template>
