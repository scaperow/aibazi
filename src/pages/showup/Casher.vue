<template>
  <div class="bg-white shadow-md  w-full ext-center h-auto py-32">
    <div class="flex flex-col justify-center items-center flex-1 h-full" v-if="payStatus === 1">
      <div class=" text-2xl loading loading-spinner loading-xs"></div>
      <text class="mt-2">等待支付...</text>
    </div>
    <div class="flex flex-col justify-center items-center gap-4  h-full" v-if="payStatus === 0">
      <Checked size="40" class="text-success" />
      <text class="text-success">支付成功</text>
      <text class=" mt-2">请手工关闭本对话框</text>
      <button class="btn btn-sm btn-ghost" @click="closePopup">关闭</button>
    </div>
    <div class="flex flex-col justify-center items-center  h-full gap-2" v-if="payStatus < 0">
      <MaskClose size="40" class="text-error" />
      <text class="text-error">网络问题，支付失败，请重试</text>
      <div class="flex flex-row gap-2 mt-4">
        <button class="btn btn-sm " @click="closePopup">关闭</button>
        <button class="btn btn-sm " v-if="payStatus === -1" @click="pay">重试</button>
        <button class="btn btn-sm " v-if="payStatus === -2" @click="pay">重试</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect, watch } from 'vue';
import { useOrder } from '../../composables';
import { Loading, Checked, MaskClose } from '@nutui/icons-vue-taro'

const { pay, payStatus, showCaisher } = useOrder();

// 定义响应式数据
const isShow = ref(false);

// 关闭弹出层的函数
const closePopup = () => {
  showCaisher.value = false
};

// 重新支付的函数，这里可后续完善实际支付逻辑
const retryPayment = () => {
  pay();
  closePopup();
};


</script>
