<template>
  <div class="flex flex-1 flex-col h-screen w-screen gap-4 bg-base-200 items-center justify-center">
    <div class="avatar">
      <div class="mask mask-squircle w-20">
        <image :src="avatar" mode="cover" class="w-full h-full object-contain" />
      </div>个人中心
    </div>
    <!-- <div class="bg-base-100"> -->
    <div class="bg-base-100 menu w-56 rounded-xl px-4">
      <div :key="index" v-for="(menu, index) in menus"
        class="flex flex-row justify-between border  py-2  border-b-slate-100 " @click="navigate(menu.router)">
        <text>{{ menu.label }}</text>
        <Right class=" text-base-content/60"></Right>
      </div>

      <!-- <div>
        <button open-type="im" data-im-id="{{ imId }}">
          跳转 IM
        </button>
      </div> -->
    </div>
    <!-- </div> -->
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import avatar from './avatar.png';
import { Right } from '@nutui/icons-vue-taro'
import Taro from "@tarojs/taro";
const menus = ref([{ label: '排盘记录', router: 'order' }, { label: '订单记录', router: 'order' }, { label: '在线客服', router: 'customer' }])
const imId = ref(32);
const navigate = (routerStuff: string) => {
  Taro.navigateTo({
    url: `/pages/me/${routerStuff}`
  })
}
// const openChat = () => {
//   Taro.openCustomerServiceChat({
//     corpId: '企业ID',
//     url: '客服聊天窗口的URL',
//     success: function () {
//       // 打开成功的回调函数
//     },
//     fail: function (error) {
//       // 打开失败的回调      函数
//     }
//   })
// }
</script>

<style></style>
