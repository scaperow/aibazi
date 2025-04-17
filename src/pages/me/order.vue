<template>
  <div class="flex flex-1 flex-col justify-center items-center w-full h-full  bg-base-200">
    <nut-toast :msg="state.msg" v-model:visible="state.show" :type="state.type" :cover="state.cover">
      <text class="p-4 bg-black/60 text-white text-sm rounded-xl text-wrap">{{ state.msg }}</text>
    </nut-toast>
    <div v-show="isLoading" class=" text-2xl loading loading-spinner loading-xs"></div>
    <nut-empty v-if="!isLoading && (!orders || orders.length === 0)" class="w-screen h-screen" image="empty"
      description="暂无记录"></nut-empty>

    <div class="flex w-full flex-1 flex-col gap-4">
      <div v-for="(order, index) in orders" :key="index"
        class="flex flex-row justify-between flex-1 px-4 mx-4 py-2 items-center gap-1 bg-base-100 rounded-xl"
        @click="showDetail(order)">
        <div class="flex flex-col gap-1">
          <text class="text-xs text-primary">解析生日</text>
          <text class="text-sm ">
            {{ order.calendar_mode === 1 ? '公历' : '农历' }}/{{ getBirthdayTime(order.birthday) }}/{{ order.gender === 1 ?
              '男' : '女' }}
          </text>
          <text class="text-xs">
            订单号：{{ order.order_id }}
          </text>
          <text class="text-xs text-base-content/60">
            下单时间：{{ getOrderTime(order.created_at) }}
          </text>
        </div>
        <div class="flex flex-col justify-end shrink-0 grow-0 basis-16">
          <div class="text-md font-bold text-primary">
            {{ (order.price / 1000) || 0 }} <text class="text-sm">元</text>
          </div>
          <div class="text-sm text-base-content/60" :class="order.status === 0 ? ' text-success' : 'text-error'">
            {{ getStatusLabel(order.status) }}
          </div>
        </div>
      </div>
    </div>
  </div>

</template>
<script setup lang="ts">
import { useOrder } from '../../composables';
import { Order } from '../../types';
import lunisolar from '../../lib/lunisolar'
import { get } from 'lodash';
import { reactive } from 'vue';
const state = reactive({
  msg: 'toast',
  type: 'text',
  show: false,
  cover: false,
  title: '',
  bottom: '',
  center: true
})
const openToast = (type, msg, cover = false) => {
  state.show = true
  state.msg = msg
  state.type = type
  state.cover = cover
}
const timeout = 30 * 60 * 1000;
const { orders, pay, isFetchingOrders: isLoading } = useOrder();
const getStatusLabel = (status: number) => {
  if (status === 0) {
    return '已支付'
  }

  if (status === 1) {
    return '等待支付'
  }

  if (status === -1) {
    return '支付异常'
  }
}

const getOrderTime = (time: number) => {
  return lunisolar(new Date(time)).format('YYYY/MM/DD HH:mm:ss')
}

const getBirthdayTime = (time: number) => {
  return lunisolar(new Date(time)).format('YYYY/MM/DD HH:mm')
}

const showDetail = (order: Order) => {
  if (order.status != 0) {
    const leftTime = order.created_at - new Date().getTime()
    //30 minuts
    const payTime = 30 * 60 * 1000

    if (leftTime >= payTime) {

    }

    pay(order).catch((error) => {
      openToast('error', get(error, 'errMsg', '支付失败，请重新下单'))
    })
  }
}
</script>
