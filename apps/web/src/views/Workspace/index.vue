<script lang="ts" setup>
import { goTo } from '@/router'

defineOptions({ name: 'Workspace' })
</script>

<template>
  <div class="Workspace_container max-h-full flex-center py-10">
    <MButton @click="goTo('ColorPalette')">ColorPalette</MButton>
    <MButton @click="goTo('Test')">Test</MButton>
    <MButton @click="goTo('Login')">Login</MButton>
  </div>
</template>
