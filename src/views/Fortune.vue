<template>
  <div class="flex flex-1 flex-col gap-2 w-full bg-base-200 overflow-y-auto">
    <div class="bg-base-100 text-base-content/60 px-6 py-4 text-sm flex flex-col overflow-y-auto shrink-0" v-if="lucky">
      <span>命主于出生后 <label class="text-base-content underline mx-1">{{ lucky.desc }}</label></span>
      <span class="mt-2">
        交运：命主于公历<label class="text-base-content underline mx-1">{{ lucky.datetime }}</label>交运
      </span>
      <span>
        换运：以后每逢尾数带<label class="text-xl text-primary mx-1">{{ lucky.stuffOfYear }}</label>的年份换运
      </span>
    </div>
    <template v-for="(viewItem, index) of viewModel" :key="index" >
      <div class="flex flex-col flex-1 gap-2 h-56 max-h-56 w-full" v-if="viewItem.isShowup()">
        <div v-if="!viewItem.isEmpty" class="text-md text-base-content ml-4">
          {{ viewItem.label }}
        </div>
        <div v-if="viewItem.isEmpty" class="flex flex-1 justify-center mt-10 text-base-content/60">
          {{ viewItem.placeholder }}
          <span class="text-base-content font-bold">{{ viewItem.label }}</span>
        </div>
        <div v-else class="flex flex-1 flex-row w-full overflow-x-auto gap-1 bg-base-100 p-2 justify-start  h-auto">
          <div v-for="(fortuneItem, index) in viewItem.value" :key="index"
            class="flex flex-col justify-stretch items-center cursor-pointer mr-1 *:cursor-pointer min-w-10 overflow-hidden *:overflow-hidde shrink flex-1"
            @click="viewItem.onChange(fortuneItem, Number(index))" :class="{
              selected: fortuneItem.isSelected,
              'border-r-0': index + 1 === viewItem.value.length
            }">
            <div class="flex flex-col text-base-content/60"
              :class="fortuneItem.isSelected ? 'text-primary font-bold' : ''">
              <label v-show="fortuneItem.year" class="italic text-sm">{{ fortuneItem.year }}</label>
              <label v-show="fortuneItem.month" class="italic text-sm">{{ fortuneItem.month }}月</label>
              <label v-show="fortuneItem.day" class="italic text-sm">{{ fortuneItem.day }}日</label>
              <label v-show="fortuneItem.age" class="italic  text-xs ">{{ fortuneItem.age }}岁</label>
            </div>
            <div class="max-w-12 w-full rounded-full  h-1 my-1" :class="fortuneItem.isSelected ? 'w-full bg-primary' : ''">
            </div>
            <div class="flex flex-row gap-1 items-start h-14">
              <span :class="fortuneItem.stemColor" class="join-item text-xl font-bold">
                {{ fortuneItem.stemName }}
              </span>
              <div class="flex flex-col">
                <label class="block whitespace-nowrap text-xs text-base-content/80"
                  v-for="(tenStar, index) of fortuneItem.tenStarsOfBranch" :key="index">
                  {{ tenStar[0] }}
                </label>
              </div>
            </div>
            <div class="flex flex-row gap-1 items-end h-14">
              <span :class="fortuneItem.branchColor" class="join-item text-xl font-bold">
                {{ fortuneItem.branchName }}
              </span>
              <div class="flex flex-col">
                <label v-for="(tenStar, index) of fortuneItem.tenStarsOfBranch"
                  class="block whitespace-nowrap text-xs text-base-content/80" :key="index">
                  {{ tenStar[0] }}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import { computed, reactive, type Ref, ref, watch, type Reactive } from 'vue'
import { useAppData } from './composable'
import { map, set } from 'lodash'

const {
  selectedYear,
  currentLuckMonth,
  currentLuckDay,
  fortunes,
  luckYears,
  setFortune,
  luckMonths,
  currentFortune,
  currentLuckYear,
  luckDays,
  lucky
} = useAppData()

const selectedMap: Ref<{ [index: string]: number }> = ref({
  fortune: -1,
  luckYear: -1,
  luckMonth: -1
})

const viewModel = computed(() => {

  const result = []
  result.push({
    selectMapKey: 'fortune',
    isShowup: () => true,

    label: '大运',
    value: map(fortunes.value, (item: any, index: number) => ({
      ...item,
      isSelected: selectedMap.value['fortune'] === Number(index),
      isLuckday: false,
    })),
    isEmpty: !fortunes.value || fortunes.value.length <= 0,
    onChange: (fortune: any, index: number) => {
      setFortune(fortune.year)
      selectedMap.value.fortune = index
    }
  })

  result.push({
    selectMapKey: 'luckYear',
    placeholder: '请选择大运查看',
    isShowup: () => true,
    label: '流年',
    value: map(luckYears.value, (item: any, index: number) => ({
      ...item,
      isSelected: selectedMap.value['luckYear'] === Number(index),
      isLuckday: false,
    })),

    isEmpty: !luckYears.value || luckYears.value.length <= 0,
    onChange: (fortune: any, index: number) => {
      currentLuckYear.value = fortune.year
      selectedMap.value.luckYear = index
    }
  })

  result.push({
    selectMapKey: 'luckMonth',
    placeholder: '请选择流年查看',
    isEmpty: !luckMonths.value || luckMonths.value.length <= 0,
    isShowup: () => selectedMap.value.fortune !== -1,
    label: '流月',
    value: map(luckMonths.value, (item: any, index: number) => ({
      ...item,
      isSelected: selectedMap.value['luckMonth'] === Number(index),
      isLuckday: false,
    })),
    onChange: (fortune: any, index: number) => {
      currentLuckMonth.value = fortune.month
      selectedMap.value.luckMonth = index
    }
  })

  result.push({
    selectMapKey: 'luckDay',
    placeholder: '请选择流月查看',

    isEmpty: !luckDays.value || luckDays.value.length <= 0,
    isShowup: () => selectedMap.value.luckYear !== -1,
    label: '流日',
    value: map(luckDays.value, (item: any, index: number) => ({
      ...item,
      isSelected: selectedMap.value['luckDay'] === Number(index),
      isLuckday: true,
    })),
    onChange: (fortune: any, index: number) => {
      currentLuckDay.value = fortune.day
      selectedMap.value.luckDay = index
    }
  })

  return result
})
</script>
