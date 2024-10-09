<template>
  <div class="flex-1 flex flex-col gap-4 justify-start w-full h-full">
    <div class="flex flex-row justify-between items-center pt-10  px-2" v-if="lsrObject">
      <button class="btn btn-sm btn-ghost " @click="back">
        <IonIcon size="large" :icon="arrowBack"></IonIcon> {{ lsrObject.format('YYYY/MM/DD HH') }} / {{ selectedGender
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
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch, type Ref } from 'vue'
import Pillars from './Pillars.vue'
import Fortune from './Fortune.vue'
import AI from './AI.vue'
import { arrowBack } from 'ionicons/icons';
import { useAppData } from './composable'
import { useRoute, useRouter } from 'vue-router';
const { back } = useRouter();

const { params } = useRoute()

const { year, month, day, hour, gender, mode } = params;

const tabOn = ref('paipan')

const {
  updateBirthday,
  updateGender,
  updateCalendarMode,
  calendarMode,
  selectedGender,
  lsrObject
} = useAppData()

if (!lsrObject.value) {
  updateBirthday(parseInt(year + ''), parseInt(month + ''), parseInt(day + ''), hour + '')
  updateGender(parseInt(gender + ''))
  updateCalendarMode(mode + '')
}
</script>

<style scoped>
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
