<template>
  <view v-if="eightChar" class="bg-base-100">
    <nut-row>
      <nut-col :offset="4" :span="5">
        <text class="text-sm">年柱</text>
      </nut-col>
      <nut-col :span="5">
        <text class="text-sm">月柱</text>
      </nut-col>
      <nut-col :span="5">
        <text class="text-sm">日柱</text>
      </nut-col>
      <nut-col :span="5">
        <text class="text-sm">时柱</text>
      </nut-col>
    </nut-row>
    <nut-row>
      <nut-col :span="4"><text class="text-sm">十神</text></nut-col>
      <nut-col :span="5" v-for="(cellValue, cellIndex) in eightChar.tenStar" :key="cellIndex">


        <text class="text-sm" :class="[cellIndex === 2 ? 'text-primary' : '']">{{ cellValue }}</text>
      </nut-col>
    </nut-row>

    <nut-row>
      <nut-col :span="4"><text class="text-sm">天干</text></nut-col>
      <nut-col :span="5" class=" flex-1 basis-1/5" v-for="(cellValue, cellIndex) in eightChar.heavenStem"
        :key="cellIndex">
        <text class="px-4 py-1 rounded font-bold text-white text-lg" :class="cellValue.color">{{
          cellValue.name }}</text>
      </nut-col>
    </nut-row>

    <nut-row>
      <nut-col :span="4"><text class="text-sm">地支</text></nut-col>
      <nut-col :span="5" class=" flex-1 basis-1/5" v-for="(cellValue, cellIndex) in eightChar.earthBranch"
        :key="cellIndex">
        <text class="px-4 py-1 rounded font-bold text-white text-lg" :class="cellValue.color">{{
          cellValue.name }}</text>
      </nut-col>
    </nut-row>

    <nut-row>
      <nut-col :span="4"><text class="text-sm">神煞</text></nut-col>
      <nut-col :span="5" class=" flex-1 basis-1/5" v-for="(cellValue, cellIndex) in eightChar.gods" :key="cellIndex">
        <view class="flex gap-1 flex-wrap flex-col justify-start items-start">
          <view class="flex rounded-md flex-row items-center border-solid border border-base-200 flex-nowrap gap-1 px-1"
            v-for="(itemValue, itemIndex) in cellValue" :key="itemIndex">
            <text class="text-success text-xs mt-auto mb-auto" v-if="itemValue.luckLevel === 1">
              吉
            </text>
            <text class="text-error text-xs mt-auto mb-auto" v-if="itemValue.luckLevel === -1">
              凶
            </text>
            <text class="text-xs mt-auto mb-auto" v-if="itemValue.luckLevel === 0">中</text>
            <text class="text-nowrap text-xs">{{ itemValue.name }}</text>
          </view>
        </view>
      </nut-col>
    </nut-row>


    <nut-row>
      <nut-col :span="4"><text class="text-sm">空亡</text></nut-col>
      <nut-col :span="5" v-for="(cellValue, cellIndex) in eightChar.missing" :key="cellIndex">
        <text class="text-sm">{{ cellValue }}</text>
      </nut-col>
    </nut-row>

    <nut-row>
      <nut-col :span="4"><text class="text-sm">纳音</text></nut-col>
      <nut-col :span="5" v-for="(cellValue, cellIndex) in eightChar.sound" :key="cellIndex">
        <text class="text-sm">{{ cellValue }}</text>
      </nut-col>
    </nut-row>
    <button v-if="!isPreviewing" class="mt-10 btn btn-link w-full text-center "
      @click="() => emit('changeTab', 'jiexi')">看不懂？跳转到详细解析页面</button>
  </view>
</template>

<script lang="ts" setup>
import { useAppData } from '../composable'
const { eightChar } = useAppData()
const { isPreviewing } = useAppData()
const emit = defineEmits(['changeTab'])
</script>

<style>
.nut-row {
  .nut-col {
    @apply py-2;

    &:first-of-type {
      @apply text-center;
    }
  }

  &:first-of-type {
    .nut-col {
      @apply text-left;
    }
  }
}

view {
  @apply text-sm;
}

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
    @apply px-4 py-1 rounded;
  }


  view,
  th {
    @apply align-text-top text-left p-1 py-2
  }

  view {
    &:first-child {
      @apply text-sm text-base-content font-semibold text-center;
    }
  }

  th {
    @apply text-sm text-base-content font-semibold;
  }

}
</style>
