<template>
  <div class="flex-1 flex flex-col  justify-start w-full h-full ">
    <div class="flex justify-center items-center mt-16 px-16">
      <img  src="../assets/logo_hero.png" class="h-60 w-auto dark:invert object-contain object-bottom" />
    </div>
    <div class="flex flex-row w-full justify-center gap-2 items-center text-base-content/60 mt-2">
      <span>八字排盘</span>
      <label class="divider divider-horizontal my-2"></label>
      <span>流年大运 </span>
      <label class="divider divider-horizontal my-2"></label>
      <span> 智能解析</span>
    </div>

    <div class="form mt-36">
      <div class="item">
        <div class="label">出生时间</div>
        <div @click="openPicker" class="content" :class="[selectedDataString ? 'neutral-content' : '	base-content']">
          <div class="badge  bg-secondary flex-shrink-0" v-show="selectedDataString">
            {{ calendarMode === 'lunar' ? '农历' : '公历' }}
          </div>
          <div class="self-shrink flex-grow-1">{{ selectedDataString || '请点击选择' }}</div>
        </div>
      </div>
      <div class="item">
        <div class="label">性别</div>
        <div id="open-action-sheet" class="content"
          :class="[selectedGenderString ? 'neutral-content' : '	base-content']">
          {{ selectedGenderString || '请点击选择' }}
        </div>
      </div>
      <button class="btn btn-primary w-full mx-4 max-w-64 self-center mt-2" 
        @click="submit">测算</button>
    </div>
    <ion-modal ref="modalRef" mode="ios">
      <div class="flex flex-col">
        <div class="flex justify-between py-2 px-4">
          <div role="tablist" class="tabs tabs-boxed  tabs-md">
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
        <ion-picker-column :value="selectedColumn(column.name)!.value" mode="ios"
          @ionChange="($event) => onColumnChanged(index, $event.detail)" v-for="(column, index) in columns"
          :Key="column.name">
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
import logoHero from '@/assets/logo_hero.png'
import { computed, ref, watch, type Ref } from 'vue'
import {
  IonModal,
  IonButtons,
  IonButton,
  IonPicker,
  IonText,
  IonPickerColumn,
  IonPickerColumnOption,
  IonActionSheet,
  toastController
} from '@ionic/vue'
import { useAppData } from './composable'
import { useRouter } from 'vue-router'
import lunisolar from 'lunisolar'
const modalRef = ref(null)
const { push } = useRouter();

// 计算某年某月的天数
const calculateDaysInMonth = (year: number, month: number) => {
  return new Date(year, month, 0).getDate() // 获取某年某月的天数
}

const selectedDataString = computed(() =>
  lsrObject.value ? lsrObject.value.format(calendarMode.value === 'lunar' ? 'lY年 lMlD lH時' : 'YYYY/MM/DD HH点') : ''
)

const selectedGenderString = computed(() =>
  selectedGender.value != null ? `${selectedGender.value === 1 ? '男' : '女'}` : ''
)

const confirm = () => {
  const modal = (modalRef.value! as typeof IonModal);
  updateBirthday(selectedYear.value as number, selectedMonth.value as number, selectedDay.value as number, selectedHour.value )

  if (modal) {
    modal.$el.dismiss();
  }
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
  selectedGender,
  lsrObject
} = useAppData()
// // 选中的年、月、日
const now = new Date()
const selectedYear = ref<number>(now.getFullYear() - 20)
const selectedMonth = ref<number>(now.getMonth() + 1)
const selectedDay = ref<number>(now.getDate())
const selectedHour = ref<string>('00')
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

const submit = async () => {
  let errorMessage = null;
  if (!selectedDataString.value) {
    errorMessage = '请选出生日期';
  }

  else if (selectedGender.value === null) {
    errorMessage = '请选择性别';
  }

  if (errorMessage) {
    const toast = await toastController.create({
      mode: 'ios',
      message: errorMessage,
      duration: 2500,
      position: 'top'
    });

    await toast.present();
    return;
  }

  push(`/show/${selectedYear.value}/${selectedMonth.value}/${selectedDay.value}/${selectedHour.value}/${selectedGender.value}/${calendarMode.value}`)
}

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
      selectedHour.value = value
      break
  }
}

// 根据当前年份和月份生成天数选项
const generateDayOptions = (year: number, month: number) => {
  // const year = lsrObject.value?.year || new Date().getFullYear();
  // const month = lsrObject.value?.year || new Date().getMonth();
  if (calendarMode.value === 'solar') {
    // 公历生成天数
    const daysInMonth = calculateDaysInMonth(year, month)
    return Array.from({ length: daysInMonth }, (_, i) => ({
      text: `${i + 1}日`,
      value: i + 1
    }))
  } else {
    // 农历生成天数

    const daysInMonth = calculateDaysInMonth(year, lunisolar(`${year}-${month}-1`).lunar.month)
    return Array.from({ length: daysInMonth }, (_, i) => ({
      text: `${i + 1}日`,
      value: i + 1
    }))
  }
}

const selectedColumn = ((name: string) => {
  if (name === 'year')
    return selectedYear;
  if (name === 'month')
    return selectedMonth;
  if (name === 'day')
    return selectedDay
  if (name === 'time')
    return selectedHour
})

// // 定义日期选择器的列
const columns = ref([
  {
    name: 'year',
    options: Array.from({ length: 100 }, (_, i) => ({
      text: `${2024 - i}年`,
      value: 2024 - i
    })).reverse()
  },
  {
    name: 'month',
    options: Array.from({ length: 12 }, (_, i) => ({
      text: `${i + 1}月`,
      value: i + 1
    })).reverse()
  },
  {
    name: 'day',
    options: generateDayOptions(selectedYear.value as number, selectedMonth.value as number)
  },
  {
    name: 'time',
    options: [
      { text: '00:00', value: '00' },
      { text: '01:00', value: '01' },
      { text: '02:00', value: '02' },
      { text: '03:00', value: '03' },
      { text: '04:00', value: '04' },
      { text: '05:00', value: '04' },
      { text: '06:00', value: '06' },
      { text: '07:00', value: '07' },
      { text: '08:00', value: '08' },
      { text: '09:00', value: '08' },
      { text: '10:00', value: '10' },
      { text: '11:00', value: '11' },
      { text: '12:00', value: '12' },
      { text: '13:00', value: '13' },
      { text: '14:00', value: '14' },
      { text: '15:00', value: '15' },
      { text: '16:00', value: '16' },
      { text: '17:00', value: '17' },
      { text: '18:00', value: '18' },
      { text: '19:00', value: '19' },
      { text: '20:00', value: '20' },
      { text: '21:00', value: '21' },
      { text: '22:00', value: '22' },
      { text: '23:00', value: '23' }
    ]
  }
])

// 监听年份和月份的变化，更新天数
watch([selectedYear, selectedMonth, calendarMode], ([newYear, newMonth]) => {
  columns.value[2].options = generateDayOptions(newYear as number, newMonth as number) // 更新天数选项
})

// 打开 picker
const openPicker = async () => {
  ; (modalRef.value! as typeof IonModal).$el.present()
}
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
  @apply flex flex-col gap-4 px-16;

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
