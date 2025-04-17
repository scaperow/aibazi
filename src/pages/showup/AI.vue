<template>
  <view class="flex flex-1 flex-col bg-base-100">
    <nut-overlay :visible="isAnalyzing" class=" text-white flex justify-center items-center">
      正在分析中，请稍后
    </nut-overlay>
    <div class="flex flex-1 flex-col gap-2 w-full  overflow-y-auto bg-base-100 pb-4">
      <div class="flex flex-col justify-start flex-1 mx-4 gap-1" v-for="map in maps" :key="map.key">
        <div class="p-4 bg-base-200 rounded-3xl h-auto gap-2 flex flex-col">
          <text class="text-sm font-bold">
            {{ map.label }}
          </text>
          <text class="text-sm text-base-content/60" v-if="!isAnalyzing && analysisResult">
            {{ analysisResult[map.key] }}
          </text>
        </div>
      </div>
    </div>

  </view>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { useOrder } from "../../composables";
import { onMounted } from "vue";
export interface OrderResponseData {
  order_id: string;
  order_token: string;
  url: '';
}

const { analyze, isAnalyzing, analysisResult } = useOrder()

onMounted(() => {
  if (!analysisResult.value && !isAnalyzing.value) {
    analyze()
  }
})

const maps = [
  {
    key: 'wuxing',
    label: '五行分析'
  },
  {
    key: 'gexing',
    label: '性格分析'
  },
  {
    key: 'jiyun',
    label: '基本运势'
  },
  {
    key: 'guanyun',
    label: '事业官运'
  },
  {
    key: 'zhuli',
    label: '事业助力'
  },
  {
    key: 'zuli',
    label: '事业阻力'
  },
  {
    key: 'dayun',
    label: '大运走势'
  },
  {
    key: 'liunian',
    label: '流年运势'
  },
  {
    key: 'ganqing',
    label: '感情运势'
  },
  {
    key: 'tiaoli',
    label: '运势调理'
  }
];

</script>

<style scoped>
.section {
  @apply flex flex-row justify-start gap-4 w-full max-w-3xl bg-base-100 rounded-xl p-8 flex-1 left-auto right-auto mx-8;

  text {
    &:first-of-type {
      @apply text-2xl font-bold basis-24 text-center grow-0 shrink-0;
    }

    &:last-of-type {
      @apply text-sm text-center flex-1;
    }
  }
}
</style>
