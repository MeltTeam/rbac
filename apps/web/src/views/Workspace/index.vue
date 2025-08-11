<script lang="ts" setup>
import { goTo } from '@/router'

defineOptions({ name: 'Workspace' })
const loading = ref(true)
</script>

<template>
  <div class="Workspace_container max-h-full overflow-auto">
    <div class="m-20 bg-yellow-50">
      <MButton :loading="loading" type="primary">Login</MButton>
    </div>
    <div class="m-20 bg-yellow-50">
      <MButton disabled type="primary" @click="goTo('Login')">Login</MButton>
    </div>
    <div class="m-20 bg-yellow-50">
      <MButton type="primary" @click="() => (loading = !loading)">Login</MButton>
    </div>
    <div class="m-20 bg-yellow-50">
      <MButton type="primary" @click="goTo('Login')">Login</MButton>
    </div>
    <div class="m-20 bg-yellow-50">
      <MButton type="primary" @click="goTo('Login')">Login</MButton>
    </div>
    <div class="m-20 bg-yellow-50">
      <MButton type="primary" @click="goTo('Login')">Login</MButton>
    </div>
    <div class="m-20 bg-yellow-50">
      <MButton type="primary" @click="goTo('Login')">Login</MButton>
    </div>
    <div class="m-20 bg-yellow-50">
      <MButton type="primary" @click="goTo('Login')">Login</MButton>
    </div>
    <div class="m-20 bg-yellow-50">
      <MButton type="primary" @click="goTo('Login')">Login</MButton>
    </div>
    <div class="m-20 bg-yellow-50">
      <MButton type="primary" @click="goTo('Login')">Login</MButton>
    </div>
    <div class="m-20 bg-yellow-50">
      <MButton type="primary" @click="goTo('Login')">Login</MButton>
    </div>
    <div class="m-20 bg-yellow-50">
      <MButton type="primary" @click="goTo('Login')">Login</MButton>
    </div>
  </div>
</template>

<style></style>
