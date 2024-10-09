<template>
  <table class="table table-fixed ">
    <thead>
      <tr>
        <th class="w-12"></th>
        <th>年柱</th>
        <th>月柱</th>
        <th>日柱</th>
        <th>时柱</th>
      </tr>
    </thead>
    <tbody v-if="eightChar">
      <tr v-if="eightChar.tenStar">
        <td>十神</td>
        <td v-for="(cellValue, cellIndex) in eightChar.tenStar" :key="cellIndex"
          :class="{ 'text-primary': cellIndex === 2 }">
          <div class="">{{ cellValue }}</div>
        </td>
      </tr>

      <tr v-if="eightChar.heavenStem">
        <td>天干</td>
        <td v-for="(cellValue, cellIndex) in eightChar.heavenStem" :key="cellIndex">
          <label class="px-4 py-1 rounded font-bold text-white text-lg" :class="cellValue.color">{{
            cellValue.name }}</label>
        </td>
      </tr>

      <tr v-if="eightChar.earthBranch">
        <td>地支</td>
        <td v-for="(cellValue, cellIndex) in eightChar.earthBranch" :key="cellIndex">
          <label class="px-4 py-1 rounded font-bold text-white text-lg" :class="cellValue.color">{{
            cellValue.name }}</label>
        </td>
      </tr>

      <tr v-if="eightChar.hideHeavenStems">
        <td>藏干</td>
        <td v-for="(cellValue, cellIndex) in eightChar.hideHeavenStems" :key="cellIndex">
          <div class="flex gap-1 flex-wrap flex-col justify-start items-center">
            <div v-for="(itemValue, cellIndex) in cellValue" :key="cellIndex"
              class="flex flex-row items-center justify-center rounded-md border-solid border-base-200 border pr-1">
              <div class="text-base-content bg-base-200 text-md self-stretch px-1 flex items-center">
                {{ itemValue.name }}
              </div>
              <div class="text-nowrap text-sm">{{ itemValue.tenStar }}</div>
            </div>
          </div>
        </td>
      </tr>

      <!-- <tr>
        <td>空亡</td>
        <td v-for="(cellValue, cellIndex) in eightChar.extraEarthBranches">
          {{ cellValue }}
        </td>
      </tr> -->

      <tr>
        <td>神煞</td>
        <td v-for="(cellValue, cellIndex) in eightChar.gods">
          <!-- {{ cellValue }} -->
          <div class="flex gap-1 flex-wrap flex-col justify-start items-center">
            <div
              class="flex rounded-md flex-row items-center border-solid border border-base-200 flex-nowrap gap-1 px-1"
              v-for="itemValue in cellValue">
              <div class="text-success text-md mt-auto mb-auto" v-if="itemValue.luckLevel === 1">
                吉
              </div>
              <div class="text-error text-md mt-auto mb-auto" v-if="itemValue.luckLevel === -1">
                凶
              </div>
              <div class="text-md mt-auto mb-auto" v-if="itemValue.luckLevel === 0">中</div>
              <div class="text-nowrap">{{ itemValue.name }}</div>
            </div>
          </div>
        </td>
      </tr>

      <tr>
        <td>纳音</td>
        <td v-for="(cellValue, cellIndex) in eightChar.sound">
          {{ cellValue }}
        </td>
      </tr>
      <!-- <tr v-for="(row, rowIndex) in tableData" :key="rowIndex">
        <td width="80" class="font-bold">
          {{ row.title }}
        </td>
        <td
          width="120"
          v-for="(cell, cellIndex) in row.rows"
          :key="cell.key"
          :style="row.style || {}"
        >
          <template v-if="typeof cell === 'string'">
            <label
              class="px-4 py-1 rounded"
              :class="{ 'font-bold': rowIndex === 0 }"
              :style="{
                color: (row.colors ? '#fff' : '') || '',
                background: (row.colors && row.colors[cellIndex]) || '',
                fontSize: row.fontSize ? `${row.fontSize}px` : ''
              }"
              >{{ cell }}</label
            > </template><template v-else>
              <div class="flex gap-1 flex-wrap">
                <div class="badge" v-for="cellItem in cell">{{ cellItem }}</div>
              </div>
            </template>
</td>
</tr> -->
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import { useAppData } from './composable'
const { eightChar } = useAppData()
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
    @apply px-4 py-1 rounded;
  }

  td,
  th {
    @apply align-text-top text-center p-1 py-2;
  }

  td {
    &:first-child {
      @apply text-sm text-base-content font-normal;
    }
  }

  th {
    @apply text-sm text-base-content font-normal;
  }

}

.form {
  @apply flex flex-col gap-4 px-10;

  .item {
    @apply join w-full outline outline-1 outline-slate-100 bg-base-200 hover:bg-base-100 h-12;

    .label {
      @apply join-item w-32 font-bold flex flex-row justify-center items-center text-sm bg-base-300 rounded;
    }

    .content {
      @apply flex flex-1 flex-row justify-start items-center join-item px-6 text-right align-middle cursor-pointer;
    }
  }
}
</style>
