<template>
  <div class="flex-1 flex flex-col justify-center w-screen h-screen bg-base-200">
    <div class="flex flex-col gap-4">
      <div class="flex justify-center items-center px-8 mt-8 ">
        <image :src="hero" mode="widthFix" class="object-contain w-full h-auto dark:invert" />
      </div>
      <div class="flex flex-1 text-xs flex-row w-full justify-center items-center text-base-content/60">
        <span>八字排盘</span>
        <span class="divider divider-horizontal my-2"></span>
        <span>流年大运</span>
        <span class="divider divider-horizontal my-2"></span>
        <span>智能解析</span>
      </div>
    </div>
    <div class="form">
      <div class="item" @click="show = true">
        <div class="label">生日</div>
        <div class="content">
          <div class="badge text-sm" v-show="selectedDataString">
            {{ calendarMode === 'lunar' ? '农历' : '公历' }}
          </div>
          <div class="self-shrink flex-grow-1 text-md" :class="{ 'text-base-content/60': !selectedDataString }">{{
            selectedDataString || '请点击选择' }}</div>
        </div>
      </div>
      <div class="item">
        <div class="label ">性别</div>
        <div class="content">
          <div class="flex flex-row">
            <div @click="updateGender(1)" class=" rounded-l-xl py-2 px-4 bg-base-200 "
              :class="{ 'bg-primary text-primary-content': selectedGender === 1 }">男
            </div>
            <div @click="updateGender(2)" class="rounded-r-xl p-2 px-4 bg-base-200 join-item"
              :class="{ 'bg-primary text-primary-content': selectedGender === 2 }">女
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-2 justify-center items-center  mx-4 mt-8">
      <button class="btn btn-primary w-full mx-4 max-w-64 self-center " @tap="submit()">测算</button>
      <div class="btn btn-ghost w-full max-w-64 self-center text-base-content/60" style="border:0" @tap="showMe">我的信息
      </div>
    </div>
    <nut-toast :msg="toastState.msg" v-model:visible="toastState.show" :type="toastState.type"
      :cover="toastState.cover">
      <text class="p-4 bg-black/60 text-white text-xs rounded-xl">{{ toastState.msg }}</text>
    </nut-toast>
    <nut-popup v-model:visible="show" position="bottom">
      <div class="flex flex-row justify-between items-center px-4 py-2">
        <div class="text-sm text-base-content/80 " @click="show = false">取消</div>
        <div role="tablist" class="tabs tabs-boxed tabs-sm ">
          <a role="tab" class="tab" :class="{ 'tab-active': mode === 'solar' }" @click="mode = 'solar'">公历</a>
          <a role="tab" class="tab" :class="{ 'tab-active': mode === 'lunar' }" @click="mode = 'lunar'">农历</a>
        </div>
        <div class="text-primary text-sm text-base-content/80 " @click="confirm">确认</div>
      </div>
      <nut-date-picker class="mt-2" :formatter="formatter" type="datetime" :min-date="min" :max-date="max"
        :show-toolbar="false" v-model="birthday" :three-dimensional="false">
      </nut-date-picker>
    </nut-popup>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref, type Ref } from 'vue'
import hero from './logo_hero.png'
import { useAppData } from '../../composables'
import { CalendarMode } from '../../types'
import Taro from '@tarojs/taro'

const formatter = (type, option) => {
  switch (type) {
    case 'year':
      option.text += '年'
      break
    case 'month':
      option.text += '月'
      break
    case 'day':
      option.text += '日'
      break
    case 'hour':
      option.text += '时'
      break
    case 'minute':
      option.text += '分'
      break
    default:
      option.text += ''
  }
  return option
}

const selectedDataString = computed(() =>
  lsrObject.value ? lsrObject.value.format(calendarMode.value === 'lunar' ? 'lY年 lMlD lH時' : 'YYYY/MM/DD HH点') : ''
)

const confirm = () => {
  updateBirthday(birthday.value, calendarMode.value)
  show.value = false
}

const {
  updateBirthday,
  updateGender,
  calendarMode,
  selectedGender,
  lsrObject,
  selectedYear,
  selectedHour,
  selectedDay,
  selectedMonth
} = useAppData()
const now = new Date()
const year = selectedYear.value || now.getFullYear() - 20
const month = selectedMonth.value || now.getMonth() + 1
const day = selectedDay.value || now.getDate()
const hour = selectedHour.value || 0
const show = ref(false)
const min = new Date(now.getFullYear() - 100, 0, 1)
const max = new Date(now.getFullYear() + 100, 0, 1)
const birthday = ref(new Date(year, month, day, hour))
const mode: Ref<CalendarMode> = ref('solar')
const toastState = reactive({
  msg: 'toast',
  type: 'text',
  show: false,
  cover: false,
  center: false
})
const openToast = (msg, cover = false) => {
  toastState.show = true
  toastState.msg = msg
  toastState.cover = cover
}

const submit = () => {
  if (!selectedDataString.value) {
    openToast('请选择生日')
    return;
  }

  if (selectedGender.value === null) {
    openToast('请选择性别')
    return;
  }

  Taro.navigateTo({
    url: '/pages/showup/index'
  })
}

const showMe = () => {
  Taro.navigateTo({
    url: '/pages/me/index'
  })
}

onMounted(async () => {
  updateBirthday(birthday.value, mode.value)
  updateGender(1)
})
</script>


<style coped>
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
  @apply flex flex-col flex-1 h-auto flex-grow-0 mt-16 px-4 gap-2;

  .item {
    @apply flex flex-row w-full py-2 bg-base-100 rounded-2xl;

    .label {
      @apply ml-2 font-bold rounded-l-xl flex flex-row justify-start items-center text-sm flex-shrink-0;
    }

    .content {
      @apply mr-2 flex flex-1 flex-row justify-end items-center join-item text-right cursor-pointer text-sm;
    }
  }
}
</style>
