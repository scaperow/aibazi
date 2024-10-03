<template>
  <div class="flex-1 flex flex-col gap-4 justify-start w-full h-full ">
    <div class="flex flex-col mt-16 justify-center px-16 gap-4" v-show="step == 1">
      <div v-for="(item, index) in collapseItems" :key="index" tabindex="0"
        class="collapse collapse-arrow border-base-300 bg-base-200 border">
        <input type="radio" :name="`my-accordion-${item.id}`" :checked="checkedId.includes(item.id)" />
        <div class="collapse-title text-md font-medium items-center flex gap-2">
          <IonIcon :size="'large'" :icon="item.icon"></IonIcon>
          {{ item.title }}
          <!-- 可选是否显示箭头图标 -->
          <IonIcon v-if="item.showArrow" :icon="arrowForward"></IonIcon>
        </div>
        <div class="collapse-content flex flex-row flex-wrap gap-6">
          <button v-for="subItem in item.items"
            class="btn btn-sm btn-outline btn-primary border border-solid border-primary">{{
              subItem.label }}</button>
          <!-- <button class="btn btn-outline btn-primary">Primary</button> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref, watch, type Ref } from 'vue'
import Pillars from './Pillars.vue'
import Fortune from './Fortune.vue'
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
import { arrowForward, manOutline, fitnessOutline, rocketOutline, chatboxEllipsesOutline } from 'ionicons/icons';
import { arrowBack } from 'ionicons/icons';
import { useAppData } from './composable'
import { useRouter } from 'vue-router';
const modalRef = ref(null)
const { back } = useRouter();
const step = ref(1);
const selectedMode = ref(1);
const checkedId = ref([1]);

// 创建 collapse 的数组数据
const collapseItems = ref([
  {
    icon: manOutline, id: 1, title: '运势分析', items: [
      { label: '我近期的整体运势怎么样?', id: 2 },
      { label: '未来一年内我会升职加薪吗?', id: 3 },
      { label: '未来一年内我会跳槽吗?', id: 4 },
      { label: '这次考试我会不会挂科?', id: 5 },
      { label: '这次考试我会不会挂科?', id: 6 },
      { label: '这次项目会不会成功?', id: 7 },
    ]
  },
  {
    icon: rocketOutline, id: 2, title: '前程分析', items: [
      { label: '请问我近期的整体运势怎么样？', id: 1 },
      { label: '未来一年内我会升职加薪吗?', id: 2 },
      { label: '未来一年内我会跳槽吗?', id: 3 },
      { label: '这次考试我会不会挂科?', id: 4 },
      { label: '这次考试我会不会挂科?', id: 5 },
      { label: '这次项目会不会成功?', id: 6 },
    ]
  },
  { icon: fitnessOutline, id: 3, title: '健康分析' },
  { icon: chatboxEllipsesOutline, id: 4, title: '自己提问', showArrow: true }
]);
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
