<template>
  <div class="bg-base-100">
    <div class="flex flex-row justify-center items-center px-2  sticky top-4">
      <div role="tablist" class="tabs tabs-boxed tabs-md border-transparent self-center">
        <a role="tab" class="tab" :class="{ 'tab-active': tabOn === 'paipan' }" @click="tabOn = 'paipan'">排盘</a>
        <a role="tab" class="tab" :class="{ 'tab-active': tabOn === 'yunshi' }" @click="tabOn = 'yunshi'">运势</a>
        <a role="tab" class="tab" :class="{ 'tab-active': tabOn === 'jiexi' }" @click="tabOn = 'jiexi'">解析</a>
      </div>
    </div>
    <div v-if="showCaisher" style="z-index: 100"
      class="flex flex-col justify-end absolute top-0 bottom-0 left-0 right-0 h-full max-h-full">
      <casher></casher>
    </div>
    <div class="flex-1 flex flex-col gap-4 justify-start w-screen h-screen bg-base-200 pb-3" :scroll-y="true">
      <Pillars class="pt-6" v-if="tabOn === 'paipan'" @changeTab="tabOn = $event"></Pillars>
      <Fortune class="pt-6" v-if="tabOn === 'yunshi'" @changeTab="tabOn = $event"></Fortune>
      <AI class="pt-6 " v-if="tabOn === 'jiexi'"></AI>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Pillars from './Pillars.vue'
import Fortune from './Fortune.vue'
import AI from './AI.vue'
import { useAppData, useOrder } from '../../composables';
import Casher from './Casher.vue';
import { onMounted } from 'vue';
import Taro from '@tarojs/taro';
const tabOn = ref('paipan')
const { showCaisher } = useOrder()
const { lsrObject } = useAppData()

onMounted(() => {
  if (!lsrObject.value) {
    Taro.navigateTo({
      url: '/pages/index/index'
    })
  }
})

</script>

<style scoped>
.container {
  @apply flex flex-col justify-center gap-4 h-full max-w-3xl bg-white rounded-3xl p-8 flex-1 left-auto right-auto px-10;
}
</style>
