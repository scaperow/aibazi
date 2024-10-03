<template>
  <div class="flex flex-1 flex-col gap-2 w-full bg-base-200 overflow-y-auto">
    <div
      class="bg-base-100 text-base-content/60 px-6 py-4 text-sm flex flex-col overflow-y-auto shrink-0"
    >
      <span
        >命主于出生后 <label class="text-base-content underline mx-1">{{ lucky.desc }}</label></span
      >
      <span class="mt-2">
        交运：命主于公历<label class="text-base-content underline mx-1">{{ lucky.datetime }}</label
        >交运
      </span>
      <span>
        换运：以后每逢尾数带<label class="text-xl text-primary mx-1">{{ lucky.stuffOfYear }}</label
        >的年份换运
      </span>
    </div>
    <template v-for="(viewItem, index) of viewModel">
      <div
        class="flex flex-col flex-1 gap-2 h-56 max-h-56 w-full"
        v-if="viewItem.isShowup()"
        :set="(viewItemStatus = { isEmpty: !viewItem.value || viewItem.value.length <= 0 })"
      >
        <div v-if="!viewItemStatus.isEmpty" class="text-md text-base-content ml-4">
          {{ viewItem.label }}
        </div>
        <div
          v-if="viewItemStatus.isEmpty"
          class="flex flex-1 justify-center mt-10 text-base-content/60"
        >
          {{ viewItem.placeholder }}
          <span class="text-base-content font-bold">{{ viewItem.label }}</span>
        </div>
        <div
          v-else
          class="flex flex-1 flex-row w-full overflow-x-auto gap-1 bg-base-100 p-2 justify-start  h-auto"
        >
          <!-- <div
            class="flex flex-row  pr-1 "
          
         
          > -->
            <div
              v-for="(fortuneItem, index) in viewItem.value" 
              :set="(fortuneItemStatus = { isSelected: selectedMap[String(viewItem.selectMapKey)] === Number(index), isLuckDay: viewItem.selectMapKey === 'luckDay'})"
              class="flex flex-col justify-stretch items-center cursor-pointer mr-1 *:cursor-pointer min-w-10 overflow-hidden *:overflow-hidde shrink flex-1"
                @click="viewItem.onChange(fortuneItem, Number(index))"
              :class="{
                selected: fortuneItemStatus.isSelected,
                'border-r-0': index + 1 === viewItem.value.length
              }"
            >
                <div class="flex flex-col text-base-content/60"  :class="fortuneItemStatus.isSelected ? 'text-primary font-bold':''"
                >
                  <label v-show="fortuneItem.year" class="italic text-sm"  
                  >{{ fortuneItem.year }}</label>
                  <label v-show="fortuneItem.month"  class="italic text-sm" 
                  >{{ fortuneItem.month }}</label>
                  <label v-show="fortuneItem.day"  class="italic text-sm" 
                  >{{ fortuneItem.day }}</label>
                  <label v-show="fortuneItem.age"  class="italic  text-xs "
                 
                    >{{ fortuneItem.age }}岁</label
                  >
                </div>
              <div class="max-w-12 w-full rounded-full  h-1 my-1" :class="fortuneItemStatus.isSelected ?'w-full bg-primary':''"></div>
              <div class="flex flex-row gap-1 items-start h-14">
                <span :class="fortuneItem.stemColor" class="join-item text-xl font-bold">
                  {{ fortuneItem.stemName }}
                </span>
                <div class="flex flex-col">
                  <label  class="block whitespace-nowrap text-xs text-base-content/80" v-for="tenStar of fortuneItem.tenStarsOfBranch">
                    {{ tenStar[0] }}
                  </label>
                </div>
              </div>
              <div class="flex flex-row gap-1 items-end h-14">
                <span :class="fortuneItem.branchColor" class="join-item text-xl font-bold">
                  {{ fortuneItem.branchName }}
                </span>
                <div class="flex flex-col">
                  <label
                    v-for="tenStar of fortuneItem.tenStarsOfBranch"
                    class="block whitespace-nowrap text-xs text-base-content/80"
                  >
                    {{ tenStar[0] }}
                  </label>
                </div>
              </div>
            </div>
          </div>
        <!-- </div> -->
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import { computed, reactive, watch, type Reactive } from 'vue'
import { useAppData } from './composable'
import { set } from 'lodash'

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

const selectedMap: Reactive<{ [index: string]: number }> = reactive({
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
    value: fortunes.value,
    onChange: (fortune: any, index: number) => {
      setFortune(fortune.year)
      selectedMap.fortune = index
    }
  })

  result.push({
    selectMapKey: 'luckYear',
    placeholder: '请选择大运查看',
    isShowup: () => true,
    label: '流年',
    value: luckYears.value,
    onChange: (fortune: any, index: number) => {
      currentLuckYear.value = fortune.year
      selectedMap.luckYear = index
    }
  })

  result.push({
    selectMapKey: 'luckMonth',
    placeholder: '请选择流年查看',
    isShowup: () => selectedMap.fortune !== -1,
    label: '流月',
    value: luckMonths.value,
    onChange: (fortune: any, index: number) => {
      currentLuckMonth.value = fortune.month
      selectedMap.luckMonth = index
    }
  })

  result.push({
    selectMapKey: 'luckDay',
    placeholder: '请选择流月查看',
    isShowup: () => selectedMap.luckYear !== -1,
    label: '流日',
    value: luckDays.value,
    onChange: (fortune: any, index: number) => {
      currentLuckDay.value = fortune.day
      selectedMap.luckDay = index
    }
  })

  return result
})
</script>
