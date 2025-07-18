<script lang="ts" setup>
import { LoginLayout } from '@/layout'
import { LOGIN_KEEP_ALIVE } from '@/router/staticRoutes'

defineOptions({
  name: 'LoginView',
})
</script>

<template>
  <LoginLayout>
    <RouterView v-slot="{ Component }">
      <Transition name="slide-down" mode="out-in">
        <KeepAlive :include="LOGIN_KEEP_ALIVE" :max="LOGIN_KEEP_ALIVE.length">
          <Component :is="Component" />
        </KeepAlive>
      </Transition>
    </RouterView>
  </LoginLayout>
</template>
