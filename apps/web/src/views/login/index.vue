<script lang="ts" setup>
import { LoginLayout } from '@/layout'

defineOptions({
  name: 'LoginView',
})
</script>

<template>
  <LoginLayout>
    <RouterView v-slot="{ Component }">
      <Transition name="slide-down" mode="out-in">
        <KeepAlive :include="[]" :max="[].length">
          <Component :is="Component" />
        </KeepAlive>
      </Transition>
    </RouterView>
  </LoginLayout>
</template>
