import { ref, onBeforeUnmount, type Ref } from 'vue'
import { Lunisolar } from '../lib/lunisolar'
import { Order, ChatRequest, ChatResponse, AnalysisResult } from '../types'
import { axios, AxiosResponse } from 'taro-axios'
import { get, pick } from 'lodash'
import { apiService } from '../plugins/api'
import { orderState, appState } from './shared'

export const useOrder = (
) => {
  const { isFetchingOrder, isFetchingOrders, isAnalyzing, order, orders, payStatus, analysisResult} = orderState
  const { showCaisher, isPaying, calendarMode, birthday, selectedGender} = appState

  const fetchOrders = async () => {
    axios.get('order').then((res) => {
      orderState.orders.value = res.data
    })
  }

  const updateOrder = async (id: string, value: Partial<Order>) => {
    await axios.put(`order/${id}`, value)
    // await (await cloud.database()).collection('order').doc(id).update(value)
  }

  const saveOrder = async (orderRaw: Partial<Order>) => {
    try {
      const { id } = await axios.post('order', {
        ...orderRaw,
        ...{ status: 1, created_at: new Date().getTime() }
      })

      return id

      // const { id } = await (await cloud.database()).collection('order').add({
      //  ...orderRaw,
      //  ...{ status: 1, created_at: new Date().getTime() }
      // })
      // return id
    } catch (error) {
      catcher(error, () => {}, -1)
    }
  }

  const pay = (orderToPay?: Order) => {
    showCaisher.value = true
    payStatus.value = 1
    const payOrder = orderToPay || order.value

    return new Promise<void>((resolve, reject) => {
      // tt.pay({
      //   orderInfo: payOrder,
      //   service: 5,
      //   success: async (res) => {
      //     if (res.code == 0 && payOrder) {
      //       await updateOrder(payOrder._id, { status: 0 })
      //       payStatus.value = 0
      //       resolve()
      //     } else {
      //       reject()
      //     }
      //   },
      //   fail: (error) => {
      //     catcher(error, reject, -2)
      //   }
      // })
    })
  }

  const catcher = (error: any, reject: any, status: number = -1) => {
    console.error(error)
    payStatus.value = status

    reject(error)
  }

  const buy = (birthday: number, gender: number) => {
    showCaisher.value = true
    payStatus.value = 1
    isPaying.value = true
    return new Promise<void>((resolve, reject) => {
      // getCloud().then((cloud) => {
      //   cloud.callContainer({
      //     // 请改成实际业务path
      //     path: '/order/',
      //     init: {
      //       method: 'POST',
      //       header: {
      //         'content-type': 'application/json'
      //       },
      //       body: {
      //         product: 1
      //       },
      //       timeout: 60000 //ms
      //     },
      //     success: async ({ statusCode, header, data }) => {
      //       isPaying.value = true
      //       try {
      //         if (statusCode >= 200 && statusCode < 300) {
      //           let orderData = JSON.parse(data) as Partial<Order>
      //           try {
      //             const id = await saveOrder({
      //               ...pick(orderData, ['order_id', 'order_token', 'price']),
      //               birthday,
      //               gender,
      //               status: 0
      //             })

      //             order.value = {
      //               _id: id,
      //               ...orderData
      //             } as Order
      //           } catch (error) {
      //             return catcher(error, reject, -2)
      //           }

      //           try {
      //             await pay()
      //           } catch (error) {
      //             return catcher(error, reject)
      //           }

      //           try {
      //             await analyze()
      //           } catch (error) {
      //             return catcher(error, reject)
      //           }
      //         }

      //         return catcher('error', reject)
      //       } catch (error) {
      //         catcher('error', reject)
      //       } finally {
      //         isPaying.value = false
      //       }
      //     },
      //     fail: (error) => {
      //       catcher(error, reject)
      //     },
      //     complete: () => {
      //       isPaying.value = false
      //     }
      //   })
      // })
    })
  }

  const fetchOrder = async (birthday: number, gender: number) => {
    isFetchingOrder.value = true

    try {
      const result = await axios.get('order', {
        params: {
          birthday,
          gender,
          status: 0
        }
      })
      // const result = await (
      //   await getDatabase()
      // )
      //   .collection('order')
      //   .where({
      //     birthday,
      //     gender,
      //     status: 0
      //   })
      //   .get()

      order.value = (get(result.data, 0) as Order) || null
    } catch (error) {
      console.error('Failed to fetch order:', error)
    } finally {
      isFetchingOrder.value = false
    }
  }

  const analyze = async () => {
    try {
      isAnalyzing.value = true

      const url = process.env.TARO_APP_TT_BOAT_URL
      const payload: ChatRequest = {
        model: process.env.TARO_APP_TT_BOAT_NAME,
        stream: false,
        messages: [
          {
            role: 'user',
            content: `${calendarMode.value === 'solar' ? '公历' : '农历'} ${new Date(
              birthday.value
            ).toISOString()} ${selectedGender.value === 1 ? '男' : '女'}`
          }
        ]
      }
      const { data } = await axios.request<any, AxiosResponse<ChatResponse>>({
        url,
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          Authorization: 'Bearer ' + process.env.TARO_APP_TT_BOAT_AUTH
        },
        data: payload
      })

      analysisResult.value = JSON.parse(data.choices[0].message.content) as AnalysisResult
      // order.value.analysis = analysisResult

      // await updateOrder(order.value._id, { analysis: analysisResult })
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      isAnalyzing.value = false
    }
  }

  // if (birthday && gender && calendarMode) {
  //   fetchOrder(birthday.toDate().getTime(), gender)
  // }

  onBeforeUnmount(() => {
    showCaisher.value = false
    payStatus.value = 0
  })

  return {
    pay,
    buy,
    orders,
    analyze,
    fetchOrder,
    saveOrder,
    isPaying,
    fetchOrders,
    updateOrder,
    showCaisher,
    isAnalyzing,
    isFetchingOrder,
    isFetchingOrders,
    payStatus,
    order,
    analysisResult
  }
}
