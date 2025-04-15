<template>
  <div class="flex flex-col w-screen h-screen justify-between">
    <div class="chat-box flex flex-1 overflow-y-auto border p-2 rounded flex-col gap-2">
      <div v-for="(message, index) in messages" :key="index"
      class="rounded-xl"
        :class="message.sender === 'user' ? 'text-right bg-blue-200 p-2 rounded mr-8' : 'text-left bg-gray-200 p-2 rounded ml-8'">
        <text> {{ message.text }}</text>
      </div>
    </div>
    <div class="mt-4 pb-8 flex-1 grow-0 flex flex-row  items-center justify-center gap-1 px-4">
      <input v-model="newMessage" type="text" class=" border-none input input-bordered flex-1" placeholder="请输入输入消息" />
      <div @click="sendMessage" class="join-item btn btn-primary w-10">发送</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Taro from '@tarojs/taro';
import { Ref, ref } from 'vue';
interface Message {
  text: string;
  sender: string;
}

// 存储聊天消息的数组
const messages: Ref<Message[]> = ref([]);
// 用户输入的新消息
const newMessage = ref('');
// 从localStorage获取聊天消息（Taro方式）
const loadMessages = () => {
  try {
    const storedMessages = Taro.getStorageSync('chatMessages');
    if (storedMessages) {
      messages.value = storedMessages;
    }
  } catch (e) {
    console.error('从localStorage获取聊天消息失败：', e);
  }
};

// 将聊天消息保存到localStorage（Taro方式）
const saveMessages = () => {
  try {
    Taro.setStorageSync('chatMessages', messages.value);
  } catch (e) {
    console.error('将聊天消息保存到localStorage失败：', e);
  }
};
const sendMessage = () => {
  if (newMessage.value) {
    messages.value.push({
      sender: 'user',
      text: newMessage.value
    });
    newMessage.value = '';
    // // 模拟客服回复（这里只是简单示例，可根据需求扩展真实逻辑）
    // setTimeout(() => {
    //   messages.value.push({
    //     sender: 'customerService',
    //     text: '您好，感谢您的咨询，我们会尽快处理您的问题。'
    //   });
    // }, 1000);
    saveMessages();
  }
};

// 组件加载时加载聊天消息
loadMessages();

</script>

<style scoped></style>
