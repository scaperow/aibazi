<template>
  <div class="flex-1  flex-col gap-4  w-full h-full  flex justify-center items-center">
      <div class="text-2xl text-base-content  p-2 rounded-md">📢 重磅功能，后续更新</div>
      <button class="btn btn-primary" @click="subscribed = true">点击订阅</button>
      <label class="text text-sm text-base-content/60" v-show="subscribed">您已成功订阅，该功能上线后会通知您</label>
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
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
const subscribed = ref(false)
// import { computed, ref, watch, type Ref } from 'vue'
// import { use,  } from "echarts/core";
// import { CanvasRenderer } from "echarts/renderers";
// import { RadarChart} from "echarts/charts";
// import {
//   TitleComponent,
//   TooltipComponent,
//   LegendComponent
// } from "echarts/components";
// import VChart, { THEME_KEY } from "vue-echarts";
// import echarts from "vue-echarts"
// import {
//   IonModal,
//   IonButtons,
//   IonButton,
//   IonPicker,
//   IonIcon,
//   IonText,
//   IonPickerColumn,
//   IonPickerColumnOption,
//   IonActionSheet
// } from '@ionic/vue'
// import { arrowForward, manOutline, fitnessOutline, rocketOutline, chatboxEllipsesOutline } from 'ionicons/icons';
// import { arrowBack } from 'ionicons/icons';
// import { useAppData } from './composable'
// import { useRouter } from 'vue-router';
// const modalRef = ref(null)
// const { back } = useRouter();
// const step = ref(1);
// const selectedMode = ref(1);
// const checkedId = ref([1]);

// use([CanvasRenderer])

// const option = ref({
//   color: ['#67F9D8', '#FFE434', '#56A3F1', '#FF917C'],
//   title: {
//     text: 'Customized Radar Chart'
//   },
//   legend: {},
//   radar: [
//     {
//       indicator: [
//         { text: 'Indicator1' },
//         { text: 'Indicator2' },
//         { text: 'Indicator3' },
//         { text: 'Indicator4' },
//         { text: 'Indicator5' }
//       ],
//       center: ['25%', '50%'],
//       radius: 120,
//       startAngle: 90,
//       splitNumber: 4,
//       shape: 'circle',
//       axisName: {
//         formatter: '【{value}】',
//         color: '#428BD4'
//       },
//       splitArea: {
//         areaStyle: {
//           color: ['#77EADF', '#26C3BE', '#64AFE9', '#428BD4'],
//           shadowColor: 'rgba(0, 0, 0, 0.2)',
//           shadowBlur: 10
//         }
//       },
//       axisLine: {
//         lineStyle: {
//           color: 'rgba(211, 253, 250, 0.8)'
//         }
//       },
//       splitLine: {
//         lineStyle: {
//           color: 'rgba(211, 253, 250, 0.8)'
//         }
//       }
//     },
//     {
//       indicator: [
//         { text: 'Indicator1', max: 150 },
//         { text: 'Indicator2', max: 150 },
//         { text: 'Indicator3', max: 150 },
//         { text: 'Indicator4', max: 120 },
//         { text: 'Indicator5', max: 108 },
//         { text: 'Indicator6', max: 72 }
//       ],
//       center: ['75%', '50%'],
//       radius: 120,
//       axisName: {
//         color: '#fff',
//         backgroundColor: '#666',
//         borderRadius: 3,
//         padding: [3, 5]
//       }
//     }
//   ],
//   series: [
//     {
//       type: 'radar',
//       emphasis: {
//         lineStyle: {
//           width: 4
//         }
//       },
//       data: [
//         {
//           value: [100, 8, 0.4, -80, 2000],
//           name: 'Data A'
//         },
//         {
//           value: [60, 5, 0.3, -100, 1500],
//           name: 'Data B',
//           areaStyle: {
//             color: 'rgba(255, 228, 52, 0.6)'
//           }
//         }
//       ]
//     },
//     {
//       type: 'radar',
//       radarIndex: 1,
//       data: [
//         {
//           value: [120, 118, 130, 100, 99, 70],
//           name: 'Data C',
//           symbol: 'rect',
//           symbolSize: 12,
//           lineStyle: {
//             type: 'dashed'
//           },
//           label: {
//             show: true,
//             formatter: function (params) {
//               return params.value;
//             }
//           }
//         },
//         {
//           value: [100, 93, 50, 90, 70, 60],
//           name: 'Data D',
//           areaStyle: {
//             color:  new RadialGradientObject(0.1, 0.6, 1, [
//               {
//                 color: 'rgba(255, 145, 124, 0.1)',
//                 offset: 0
//               },
//               {
//                 color: 'rgba(255, 145, 124, 0.9)',
//                 offset: 1
//               }
//             ])
//           }
//         }
//       ]
//     }
//   ]
// });
</script>

<style  scoped>
.container {
  @apply flex flex-col justify-center gap-4 h-full max-w-3xl bg-white rounded-3xl p-8 flex-1 left-auto right-auto px-10;
}

/* 控制按钮的样式，使其居中显示 */
ion-modal {
  --height: auto;

  align-items: end;
}

ion-picker {
  margin-bottom: var(--ion-safe-area-bottom);
}

table {
  label.content {
    @apply py-1 rounded;
  }
}

.form {
  @apply flex flex-col gap-4 px-6;

  .item {
    @apply join w-full outline outline-1 outline-slate-100 bg-base-200 hover:bg-base-100 h-12;

    .label {
      @apply join-item w-20 font-bold flex flex-row justify-center items-center text-sm bg-base-300 rounded flex-shrink-0;
    }

    .content {
      @apply flex flex-1 flex-row justify-start items-center join-item px-4 text-right align-middle cursor-pointer;
    }
  }
}
</style>
