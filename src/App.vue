<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { IonApp, IonContent } from '@ionic/vue'
</script>

<template>
  <div class="max-w-3xl w-full ml-auto mr-auto h-full overflow-y-auto bg-base-100">
    <RouterView v-slot="{ Component, route }">
      <Transition name="fade" mode="out-in">
        <component :key="route.name" :is="Component" />
      </Transition>
    </RouterView>
  </div>
</template>

<style>
#app {
  @apply h-screen w-screen bg-base-200;
}
</style>
