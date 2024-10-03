<template>
  <div class="flex-1 flex flex-col gap-4 justify-start w-full h-full">
    <div class="flex flex-row justify-between items-center pt-10  px-2">
      <button class="btn btn-sm btn-ghost " @click="back">
        <IonIcon size="large" :icon="arrowBack"></IonIcon> {{ lunarDay.format('YYYY/MM/DD HH') }} / {{ selectedGender
          === 1 ? '男' :
          "女"
        }}
      </button>
      <div role="tablist" class="tabs tabs-boxed tabs-md border-primary self-center">
        <a role="tab" class="tab" :class="{ 'tab-active': tabOn === 'paipan' }" @click="tabOn = 'paipan'">排盘</a>
        <a role="tab" class="tab" :class="{ 'tab-active': tabOn === 'yunshi' }" @click="tabOn = 'yunshi'">运势</a>
        <a role="tab" class="tab" :class="{ 'tab-active': tabOn === 'jiexi' }" @click="tabOn = 'jiexi'">解析</a>
      </div>
    </div>
    <Pillars v-show="tabOn === 'paipan'"></Pillars>
    <Fortune v-show="tabOn === 'yunshi'"></Fortune>
    <AI v-show="tabOn === 'jiexi'"></AI>

    <ion-modal ref="modalRef" mode="ios">
      <div class="flex flex-col">
        <div class="flex justify-between py-2 px-4">
          <div role="tablist" class="tabs tabs-boxed">
            <a role="tab" class="tab" :class="{ 'tab-active': calendarMode === 'solar' }"
              @click="updateCalendarMode('solar')">公历</a>
            <a role="tab" class="tab" :class="{ 'tab-active': calendarMode === 'lunar' }"
              @click="updateCalendarMode('lunar')">农历</a>
          </div>
          <ion-buttons>
            <ion-button @click="confirm"> 确认 </ion-button>
          </ion-buttons>
        </div>
      </div>

      <ion-picker mode="ios">
        <ion-picker-column mode="ios" @ionChange="($event) => onColumnChanged(index, $event.detail)"
          v-for="(column, index) in columns" :Key="column.name">
          <ion-picker-column-option v-for="option in column.options" :value="option.value" :key="option.value">{{
            option.text }}</ion-picker-column-option>
        </ion-picker-column>
      </ion-picker>
    </ion-modal>

    <ion-action-sheet mode="ios" trigger="open-action-sheet" header="选择性别" :buttons="actionSheetButtons"
      @didDismiss="({ detail }) => onSelectGender(detail)"></ion-action-sheet>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch, type Ref } from 'vue'
import Pillars from './Pillars.vue'
import Fortune from './Fortune.vue'
import AI from './AI.vue'
import {
  IonModal,
  IonButtons,
  IonButton,
  IonPicker,
  IonIcon,
  IonText,
  IonPickerColumn,
  IonPickerColumnOption,
  IonActionSheet
} from '@ionic/vue'
import { arrowBack } from 'ionicons/icons';
import { useAppData } from './composable'
import { useRouter } from 'vue-router';
const modalRef = ref(null)
const { back } = useRouter();

// 计算某年某月的天数
const calculateDaysInMonth = (year: number, month: number) => {
  return new Date(year, month, 0).getDate() // 获取某年某月的天数
}

const tabOn = ref('paipan')

const confirm = () => {
  updateBirthday(selectedYear.value, selectedMonth.value, selectedDay.value, selectedHour.value)
    ; (modalRef.value! as typeof IonModal).$el.dismiss()
}

const onSelectGender = ({ data }: any) => {
  if (data === 1 || data === 0) {
    updateGender(data)
  }
}

const {
  updateBirthday,
  updateGender,
  updateCalendarMode,
  calendarMode,
  lunarDay,
  selectedGender
} = useAppData()
// // 选中的年、月、日
const selectedYear = ref<number>(1989)
const selectedMonth = ref<number>(3)
const selectedDay = ref<number>(18)
const selectedHour = ref<number>(2)
const actionSheetButtons = ref([
  {
    text: '男',
    data: 1
  },
  {
    text: '女',
    data: 0
  }
])

const onColumnChanged = (column: number, { value }: any) => {
  switch (column) {
    case 0:
      selectedYear.value = parseInt(value)
      break
    case 1:
      selectedMonth.value = parseInt(value)
      break
    case 2:
      selectedDay.value = parseInt(value)
      break
    case 3:
      selectedHour.value = parseInt(value)
      break
  }
}

// 根据当前年份和月份生成天数选项
const generateDayOptions = (year: number, month: number) => {
  if (calendarMode.value === 'solar') {
    // 公历生成天数
    const daysInMonth = calculateDaysInMonth(year, month)
    return Array.from({ length: daysInMonth }, (_, i) => ({
      text: `${i + 1}日`,
      value: i + 1
    }))
  } else {
    // 农历生成天数
    const daysInMonth = calculateDaysInMonth(lunarDay.value.year, lunarDay.value.month)
    return Array.from({ length: daysInMonth }, (_, i) => ({
      text: `农历${i + 1}日`,
      value: i + 1
    }))
  }
}

// // 定义日期选择器的列
const columns = ref([
  {
    name: 'year',
    options: Array.from({ length: 100 }, (_, i) => ({
      text: `${2024 - i}年`,
      value: 2024 - i
    }))
  },
  {
    name: 'month',
    options: Array.from({ length: 12 }, (_, i) => ({
      text: `${i + 1}月`,
      value: i + 1
    }))
  },
  {
    name: 'day',
    options: generateDayOptions(selectedYear.value, selectedMonth.value)
  },
  {
    name: 'time',
    options: [
      { text: '00:00', value: '00:00' },
      { text: '01:00', value: '01:00' },
      { text: '02:00', value: '02:00' },
      { text: '03:00', value: '03:00' },
      { text: '04:00', value: '04:00' },
      { text: '05:00', value: '04:00' },
      { text: '06:00', value: '06:00' },
      { text: '07:00', value: '07:00' },
      { text: '08:00', value: '08:00' },
      { text: '09:00', value: '08:00' },
      { text: '10:00', value: '10:00' },
      { text: '11:00', value: '11:00' },
      { text: '12:00', value: '12:00' },
      { text: '13:00', value: '13:00' },
      { text: '14:00', value: '14:00' },
      { text: '15:00', value: '15:00' },
      { text: '16:00', value: '16:00' },
      { text: '17:00', value: '17:00' },
      { text: '18:00', value: '18:00' },
      { text: '19:00', value: '19:00' },
      { text: '20:00', value: '20:00' },
      { text: '21:00', value: '21:00' },
      { text: '22:00', value: '22:00' },
      { text: '23:00', value: '23:00' }
    ]
  }
])

</script>

<style scss scoped>
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
