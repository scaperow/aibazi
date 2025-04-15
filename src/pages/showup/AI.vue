<template>
  <view class="flex flex-1 flex-col bg-base-100">
    <nut-overlay :visible="isFetchingOrder || isAnalyzing"></nut-overlay>
    <!-- <text>请支付 9.9 元解锁本次解析</text>
    <div class=" text-base-content/60 text-md">
      <text>本次支付仅用于生日 {{ lsrObject!.format('YYYY-MM-DD HH:mm') }} 的报告信息 </text>
      <text></text>
      <text>解析成功后，解析报告将自动存储，后续可以随时查看 </text>
    </div>
    <button button class="btn  btn-outline"> 查看健康，财富，运势，注意事项 </button> -->
    <!-- <text class="text-base-content/60 text-sm mx-4">注：以下为系统智能辅助分析，结果仅供参考！</text> -->
    <div class="flex flex-1 flex-col gap-2 w-full  overflow-y-auto bg-base-100 mb-4 pb-32">
      <div class="flex flex-col justify-start flex-1 mx-4 gap-1" v-for="map in maps" :key="map.key">
        <div class="p-4 bg-base-200 rounded-3xl h-auto gap-2 flex flex-col">
          <text class="text-sm font-bold">
            {{ map.label }}
          </text>
          <text class="text-sm text-base-content/60" v-if="!isFetchingOrder && !isAnalyzing && order?.analysis">
            {{ order?.analysis[map.key] }}
          </text>
        </div>
      </div>
      <div class="glass fixed bottom-0 h-32 w-full flex justify-center items-center" v-if="!order || !order?.analysis">
        <button class="btn btn-primary" @click="() => buy(lsrObject.toDate().getTime(), selectedGender!)"
          v-if="!order">支付8.9元，立即查看全部信息</button>
        <button class="btn btn-primary" @click="() => analyze()" v-if="order && !order?.analysis">点击查看结果</button>
      </div>
    </div>
    <!-- <div class="flex-1 h-full w-full justify-center items-center" v-else>
      <div class="text-2xl text-base-content  p-2 rounded-md">📢 重磅功能，后续更新</div>
      <button class="btn btn-primary">点击订阅</button>
    </div> -->
    <!-- <div class="section">
      <text>
        事业官运
      </text>
      <text>
        df
      </text>
    </div> -->
    <!-- <text text class="text-2xl font-bold text-primary">
      {{ score }}分
      </text>
      <div>
        <text class="badge badge-lg" :key="index" v-for="(tag, index) in analysisResult.tagsArray"> {{ tag }}</text>
      </div>
      <div>
        <text>健康</text><text class="text text-xl italic text-primary">{{ analysisResult.health
          }}</text><text class="text-sm"> 分</text>
        <nut-progress :show-text="false" :percentage="analysisResult.health" />
      </div>

      <div>
        <div class="flex "><text>智力</text></div>
      </div>
      <nut-progress :percentage="analysisResult.intelligence" />
      <div class="flex "><text>情商</text></div>
      <nut-progress :percentage="analysisResult.prospect" />
      <div class="flex "><text>前途</text></div>
      <nut-progress :percentage="analysisResult.wealth" />
      <div class="flex "><text>财富</text></div>
      <nut-progress :percentage="analysisResult.emotionalIntelligence" />
      <div class=" bg-base-100 p-2 rounded-md">
        {{ analysisResult.analysis }}
      </div> -->
    <!-- <div class="text-2xl text-base-content  p-2 rounded-md">📢 重磅功能，后续更新</div>
    <button class="btn btn-primary" @tap="onClick">点击订阅</button>
     -->
    <!-- <v-chart class="chart" :option="option" /> -->
    <!-- <div class="flex flex-col mt-16 justify-center px-16 gap-4" v-show="step == 1">
      <div v-for="(item, index) in collapseItems" :key="index" tabindex="0"
        class="collapse collapse-arrow border-base-300 bg-base-200 border">
        <input type="radio" :name="`my-accordion-${item.id}`" :checked="checkedId.includes(item.id)" />
        <div class="collapse-title text-md font-medium items-center flex gap-2">
          <IonIcon :size="'large'" :icon="item.icon"></IonIcon>
          {{ item.title }}
          <IonIcon v-if="item.showArrow" :icon="arrowForward"></IonIcon>
        </div>
        <div class="collapse-content flex flex-row flex-wrap gap-6">
          <button v-for="subItem in item.items"
            class="btn btn-sm btn-outline btn-primary border border-solid border-primary">{{
              subItem.label }}</button>
        </div>
      </div>
    </div> -->
  </view>
</template>
<script lang="ts" setup>
import { computed, onMounted, Ref, ref, watchEffect } from "vue";
const subscribed = ref(false)
import { useAppData, useOrder, useSession, AnalysisResult, Order, CalendarMode } from "../composable";
import Casher from "./Casher.vue";
export interface OrderResponseData {
  order_id: string;
  order_token: string;
  url: '';
}


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

const previewing = ref(false)
const casherRef = ref(null);
const isShow = ref(false);
const { lsrObject, selectedGender, calendarMode } = useAppData()
const { getSession } = useSession()
const { analyze, order, buy, isAnalyzing, isFetchingOrder, isPaying } = useOrder(lsrObject.value!, selectedGender.value!, calendarMode.value!)
// const { buy, pay, payStatus, showCaisher } = useOrder()


// const score = computed(() => {
//   if (!analysisResult.value) {
//     return 0
//   }

//   return Math.floor((analysisResult.value.health +
//     analysisResult.value.emotionalIntelligence +
//     analysisResult.value.intelligence +
//     analysisResult.value.prospect) / 5)
// })


onMounted(() => {
  // if (appData) {
  //   fetchOrder(appData.birthday.getTime(), appData.gender).then((o) => {
  //     order.value = o
  //   })
  // }

  // try {
  //   if (lsrObject.value && selectedGender.value) {
  //     analysis(lsrObject.value.toDate().getTime(), selectedGender.value).then((aiData: AnalysisResult) => {
  //       analysisResult.value = aiData
  //     });
  //   }
  // } catch (error) {
  //   console.error(error)
  // }
})



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
