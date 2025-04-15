<template>
  <nut-sticky top="6" v-if="!isPreviewing">
    <div class="flex flex-row justify-center items-center px-2 ">
      <div role="tablist" class="tabs tabs-boxed tabs-md border-transparent self-center">
        <a role="tab" class="tab" :class="{ 'tab-active': tabOn === 'paipan' }" @click="tabOn = 'paipan'">排盘</a>
        <a role="tab" class="tab" :class="{ 'tab-active': tabOn === 'yunshi' }" @click="tabOn = 'yunshi'">运势</a>
        <a role="tab" class="tab" :class="{ 'tab-active': tabOn === 'jiexi' }" @click="tabOn = 'jiexi'">解析</a>
      </div>
    </div>
  </nut-sticky>
  <nut-overlay v-model:visible="showCaisher" style="z-index: 99"
    class="absolute top-0 bottom-0 left-0 right-0"></nut-overlay>

  <div v-if="showCaisher" style="z-index: 100"
    class="flex flex-col justify-end absolute top-0 bottom-0 left-0 right-0 h-full max-h-full">
    <casher></casher>
  </div>
  <!-- <casher></casher> -->
  <scroll-view class="flex-1 flex flex-col gap-4 justify-start w-screen h-screen bg-base-200 pb-3" :scroll-y="true">
    <Pillars class="pt-6" v-if="!isPreviewing && tabOn === 'paipan'" @changeTab="tabOn = $event"></Pillars>
    <Fortune class="pt-6" v-if="!isPreviewing && tabOn === 'yunshi'" @changeTab="tabOn = $event"></Fortune>
    <AI class="pt-6 " v-if="!isPreviewing && tabOn === 'jiexi'"></AI>
  </scroll-view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Pillars from './Pillars.vue'
import Fortune from './Fortune.vue'
import AI from './AI.vue'
import { useAppData, useOrder } from '../composable';
import Casher from './Casher.vue';
import { Lunisolar } from 'types/lunisolar';
const tabOn = ref('paipan')
const { showCaisher } = useOrder()
const { isPreviewing, lsrObject } = useAppData()

const zodiac = ref('')
const lunar = ref('')
const solar = ref('')
const chineseZodiac = ref('')

// 判断是否是有效的日期格式
function isValidDate(year, month, day) {
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

// 根据公历日期获取星座
function getZodiac(date) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const zodiacs = ["摩羯座", "水瓶座", "双鱼座", "白羊座", "金牛座", "双子座", "巨蟹座", "狮子座", "处女座", "天秤座", "天蝎座", "射手座"];
  if (month === 1 && day <= 19 || month === 12 && day >= 22) {
    return zodiacs[0];
  } else {
    return zodiacs[month - (day < 20 ? 1 : 0)];
  }
}

function getChineseZodiac(date) {
  const zodiacArray = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];
  const year = date.getFullYear();
  const offset = (year - 1900) % 12;
  return zodiacArray[offset];
}

function getDateInfo(lunisolar: Lunisolar) {
  const inputDate = lunisolar.toDate();

  zodiac.value = getZodiac(inputDate);
  lunar.value = lunisolar.format('lY年 lMlD lH時')
  chineseZodiac.value = getChineseZodiac(inputDate)
}

getDateInfo(lsrObject.value);

</script>

<style scoped>
.container {
  @apply flex flex-col justify-center gap-4 h-full max-w-3xl bg-white rounded-3xl p-8 flex-1 left-auto right-auto px-10;
}
</style>
