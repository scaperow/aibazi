import { AnalysisResult } from './composable'
import { filter, first, get, map, pick, reject, zip } from 'lodash'
//@ts-ignore
import { Builder } from 'shiren-columns'
//@ts-ignore
import { plate } from 'shiren-calendar'
import {
  computed,
  onBeforeUnmount,
  onMounted,
  onRenderTriggered,
  ref,
  watch,
  watchEffect,
  type Ref
} from 'vue'
// 引入lunisolar
import lunisolar, { Lunisolar } from '../lib/lunisolar'
import { axios, AxiosResponse, PostData } from 'taro-axios'
// import {axios} from 'axios/dist/browser/axios.cjs'

import theGods from '../lib/lunisolar/plugins/theGods'
import char8ex from '../lib/lunisolar/plugins/char8ex'
import takeSound from '../lib/lunisolar/plugins/takeSound'

import zhCn from '../lib/lunisolar/locale/zh-cn'

import pluginchar8exZh from '../lib/lunisolar/plugins/char8ex/locale/zh-cn'
import plugintheGodsZh from '../lib/lunisolar/plugins/theGods/locale/zh-cn'
import pluginTakeSoundZh from '../lib/lunisolar/plugins/takeSound/locale/zh-cn'
import Taro from '@tarojs/taro'
const cloud = tt.createCloud({
  envID: 'env-kjWAq03gZo',
  serviceID: '1khe8dcriwufv'
})

// 定义用户信息对象的接口
interface UserInfo {
  nickName: string
  avatarUrl: string
  gender: number
  city: string
  province: string
  country: string
  language: string
}

export type SessionUser = UserInfo & {
  encryptedData: string
}

// 定义整体返回数据结构的接口
interface UserProfileResponse {
  userInfo: UserInfo
  rawData: string
  signature: string
  encryptedData: string
  iv: string
  cloudId: string
  errMsg: string
}

export type CalendarMode = 'lunar' | 'solar'

lunisolar
  .extend(char8ex)
  .extend(theGods)
  .extend(takeSound)
  .locale(zhCn)
  .locale(pluginchar8exZh)
  .locale(plugintheGodsZh)
  .locale(pluginTakeSoundZh)

const BG_ELEMENT_COLORS: any = {
  金: 'bg-matel/80',
  木: 'bg-wood/80',
  水: 'bg-water/80',
  火: 'bg-fire/80',
  土: 'bg-earth/80'
}

const FG_ELEMENT_COLORS: any = {
  金: 'text-matel',
  木: 'text-wood',
  水: 'text-water',
  火: 'text-fire',
  土: 'text-earth'
}

const TENSTARS: any = {
  印: '正印',
  卩: '偏印',
  劫: '劫财',
  比: '比肩',
  伤: '伤官',
  食: '食神',
  财: '正财',
  才: '偏财',
  官: '正官',
  杀: '七杀'
}

export interface ChatResponse {
  id: string
  choices: Array<{
    finish_reason: string
    index: number
    message: {
      content: string
      role: string
    }
  }>
  created: number
  model: string
  object: string
  bot_usage: {
    model_usage: Array<{
      prompt_tokens: number
      completion_tokens: number
      total_tokens: number
    }>
    action_usage: any[]
    action_details: any[]
  }
  metadata: {}
}

export interface AnalysisResult {
  // health: number // 健康
  // intelligence: number // 智商
  // emotionalIntelligence: number // 情商
  // prospect: number // 前途
  // wealth: number // 财富
  // tags: string // 标签
  // tagsArray: string[]
  // analysis: string
  wuxing: string // 五行分析
  gexing: string // 性格分析
  jiyun: string // 基本运势
  guanyun: string // 事业官运
  zhuli: string // 事业助力
  zuli: string // 事业阻力
  dayun: string // 大运走势
  liunian: string // 流年运势
  ganqing: string // 感情运势
  tiaoli: string // 运势调理
}

const currentLuckMonth = ref(0)
const currentLuckDay = ref(0)
const calendarMode = ref<'solar' | 'lunar'>('solar')
const selectedYear = ref<number>()
const selectedMonth = ref<number>()
const selectedDay = ref<number>()
const selectedHour = ref<number>()
const selectedGender: Ref<number | null> = ref(null)
const lsrObject = ref()
const birthday = ref()

const showCaisher = ref(false)
const isPreviewing = ref(true)
let previewStatusLoaded = false
export const useAppData = () => {
  const currentLuckYear: Ref<any> = ref(null)
  const currentFortune: Ref<any> = ref(null)
  const updateBirthday = (date: Date, mode: CalendarMode) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    calendarMode.value = mode

    if (calendarMode.value === 'lunar') {
      lsrObject.value = lunisolar.fromLunar({
        year,
        month,
        day,
        hour
      })
    } else {
      lsrObject.value = lunisolar(date)
    }
  }

  const updateGender = (gender: number | null) => {
    selectedGender.value = gender
  }

  const updateCalendarMode = (value: string) => {
    calendarMode.value = value as 'solar' | 'lunar'
  }

  const eightChar = computed(() => {
    if (!lsrObject.value || selectedGender.value === null) {
      return null
    }
    const lsr = lsrObject.value
    const c8 = lsr.char8ex(selectedGender.value as 0 | 1)
    const hiddenStems = [
      c8.year.branch.hiddenStems,
      c8.month.branch.hiddenStems,
      c8.day.branch.hiddenStems,
      c8.hour.branch.hiddenStems
    ].map((branchStems) => branchStems.map((branchStem) => branchStem.name))

    const branchStems = [
      c8.year.branchTenGod,
      c8.month.branchTenGod,
      c8.day.branchTenGod,
      c8.hour.branchTenGod
    ].map((branchStems) => branchStems.map((branchStem) => branchStem.name))

    return {
      tenStar: [
        c8.year.stemTenGod.name,
        c8.month.stemTenGod.name,
        c8.day.stemTenGod.name,
        // selectedGender.value === Gender.MAN ? '元男' : '元女',
        c8.hour.stemTenGod.name
      ],
      heavenStem: [c8.year.stem, c8.month.stem, c8.day.stem, c8.hour.stem].map((stem) => ({
        name: stem.name,
        color: BG_ELEMENT_COLORS[stem.e5.name]
      })),
      earthBranch: [c8.year.branch, c8.month.branch, c8.day.branch, c8.hour.branch].map(
        (branch) => ({
          name: branch.name,
          color: BG_ELEMENT_COLORS[branch.e5.name]
        })
      ),
      // /**c8 不支持  中取十神,  tyme4ts 库来实现 */
      hideHeavenStems: zip(hiddenStems, branchStems).map((pair) =>
        zip(pair[0], pair[1]).map(([name, tenStar]) => ({ name, tenStar }))
      ),
      sound: [c8.year.takeSound, c8.month.takeSound, c8.day.takeSound, c8.hour.takeSound],
      missing: [c8.year.missing, c8.month.missing, c8.day.missing, c8.hour.missing].map(
        (missings) => missings.join('-')
      ),
      gods: [c8.year.gods, c8.month.gods, c8.day.gods, c8.hour.gods].map((gods) =>
        gods.map((god) => {
          return {
            name: get(pluginchar8exZh.char8ex.gods as object, god.name),
            luckLevel: god.luckLevel
          }
        })
      )
    }
  })
  const stemNames = lunisolar.Stem.getNames()
  const stemNamesFortune = ['', ...stemNames]
  const fortunes = computed(() => {
    if (!lsrObject.value) {
      return []
    }

    const lsr = lsrObject.value
    const info = plate(true, lsr.year, lsr.month, lsr.day, lsr.hour)

    const {
      basic,
      lucky: { datetime }
    } = info

    const dg = basic.g[2]
    // 把四柱天干｜地支索引转换为对应的天干颜色
    info.basic.g = Builder.g(dg, info.basic.g)
    info.basic.z = Builder.z(dg, info.basic.z)
    // 把大运的天干｜地支索引转换为对应的天干颜色
    info.lucky.g = Builder.g(dg, info.lucky.g)
    info.lucky.z = Builder.z(dg, info.lucky.z)

    return map(
      filter(datetime, (_, i: number) => i < 10),
      (luckyTime: any, index: number) => {
        const lunar = lunisolar(luckyTime)

        return {
          age: lunar.year - lsr.year,
          year: lunar.year,
          stemName: info.lucky.g[index].name,
          branchName: info.lucky.z[index].name,
          branchColor: FG_ELEMENT_COLORS[(first(info.lucky.z[index].element) as any).name],
          stemColor: FG_ELEMENT_COLORS[(first(info.lucky.g[index].element) as any).name],
          tenStarsOfBranch: map(info.lucky.z[index].spirit, (spirit) => TENSTARS[spirit.name]),
          tenStarsOfStem: map(info.lucky.g[index].spirit, (spirit) => TENSTARS[spirit.name])
        }
      }
    )
  })

  const lucky = computed(() => {
    if (!lsrObject.value) {
      return null
    }

    const lsr = lsrObject.value
    const info = plate(true, lsr.year, lsr.month, lsr.day, lsr.hour)

    const {
      basic,
      lucky: { desc, g, z, datetime },
      shiren: { year }
    } = info

    return {
      desc,
      year,
      datetime: datetime[0],
      stuffOfYear: (year + '')[3]
    }
  })

  const setFortune = (fortune: any) => {
    currentFortune.value = fortune
  }
  const setLuckYear = (year: any) => {
    currentLuckYear.value = year
  }

  const luckYears = computed(() => {
    if (!lsrObject.value || !currentFortune.value) {
      return null
    }

    const lsr = lsrObject.value
    const info = plate(true, lsr.year, lsr.month, lsr.day, lsr.hour)
    const { basic } = info
    const dg = basic.g[2]
    return Builder.year(currentFortune.value).map((item: any, index: number) => {
      const luckYear = Builder.gz(dg, item)
      const { g: stem, z: branch } = luckYear

      return {
        year: currentFortune.value + index,
        age: currentFortune.value + index - lsr.year,
        branchName: branch.name,
        stemName: stem.name,
        branchColor: get(FG_ELEMENT_COLORS, (first(branch.element) as any).name),
        stemColor: get(FG_ELEMENT_COLORS, (first(stem.element) as any).name),
        tenStarsOfBranch: map(branch.spirit, (spirit) => TENSTARS[spirit.name]),
        tenStarsOfStem: map(stem.spirit, (spirit) => TENSTARS[spirit.name])
      }
    })
  })

  const luckMonths = computed(() => {
    if (!lsrObject.value || !currentLuckYear.value) {
      return null
    }

    const lsr = lsrObject.value
    const info = plate(true, lsr.year, lsr.month, lsr.day, lsr.hour)
    const { basic } = info
    const dg = basic.g[2]
    return Builder.month(currentLuckYear.value).map((item: any, index: number) => {
      const { g: stem, z: branch } = Builder.gz(dg, item)

      return {
        ...item,
        month: index + 1,
        branchName: branch.name,
        stemName: stem.name,
        branchColor: get(FG_ELEMENT_COLORS, first<any>(branch.element).name),
        stemColor: get(FG_ELEMENT_COLORS, first<any>(stem.element).name),
        tenStarsOfBranch: map(branch.spirit, (spirit) => TENSTARS[spirit.name]),
        tenStarsOfStem: map(stem.spirit, (spirit) => TENSTARS[spirit.name])
      }
    })
  })

  const luckDays = computed(() => {
    if (!lsrObject.value || !currentLuckMonth.value) {
      return null
    }

    const lsr = lsrObject.value
    const info = plate(true, lsr.year, lsr.month, lsr.day, lsr.hour)
    const { basic, lucky } = info
    const dg = basic.g[2]
    const luckMonth = luckMonths.value.find(
      (luckMonth: any) => luckMonth.month === currentLuckMonth.value
    )
    return Builder.day(luckMonth).map((item: any, index: number) => {
      const { g: stem, z: branch } = Builder.gz(dg, item)

      return {
        day: index + 1,
        branchName: branch.name,
        stemName: stem.name,
        branchColor: get(FG_ELEMENT_COLORS, (first(branch.element) as any).name),
        stemColor: get(FG_ELEMENT_COLORS, (first(stem.element) as any).name),
        tenStarsOfBranch: map(branch.spirit, (spirit) => TENSTARS[spirit.name]),
        tenStarsOfStem: map(stem.spirit, (spirit) => TENSTARS[spirit.name])
      }
    })
  })

  const getPreviewStatus = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (new Date('2025-12-12').getTime() < new Date().getTime()) {
        return resolve(false)
      }

      getCloud()
        .then((cloud) => {
          cloud.callContainer({
            // 请改成实际业务path
            path: '/app/',

            success: async ({ statusCode, header, data }) => {
              resolve(get(JSON.parse(data), 'isPreview', false))
            },
            fail: () => {
              console.error('fail')
              resolve(true)
            }
          })
        })
        .catch(() => {
          console.error('catch')
          resolve(true)
        })
    })
  }

  if (!previewStatusLoaded) {
    previewStatusLoaded = true

    getPreviewStatus().then((val: boolean) => {
      isPreviewing.value = val
    })
  }

  return {
    isPreviewing,
    birthday,
    updateBirthday,
    updateGender,
    eightChar,
    luckYears,
    luckMonths,
    setLuckYear,
    luckDays,
    currentFortune,
    currentLuckYear,
    currentLuckDay,
    lsrObject,
    lucky,
    fortunes,
    selectedYear,
    selectedMonth,
    selectedDay,
    selectedHour,
    calendarMode,
    selectedGender,
    setFortune,
    updateCalendarMode,
    currentLuckMonth
  }
}

export const useSession = () => {
  const sessionKey = 'session'
  let session: SessionUser = Taro.getStorageSync<SessionUser>(sessionKey)

  const getSession = async (): Promise<SessionUser> => {
    if (session) {
      return Promise.resolve(session)
    }

    return new Promise((resolve, reject) => {
      Taro.getUserProfile({
        desc: '',
        success: ({ errMsg, userInfo, rawData, iv }: any) => {
          if (!userInfo) {
            console.error(errMsg)
            reject(errMsg)
          } else {
            session = {
              ...userInfo,
              ...{
                encryptedData: userInfo.encryptedData,
                iv
              }
            }
            Taro.setStorageSync(sessionKey, rawData)
            resolve(session)
          }
        },
        fail: reject
      })
    })
  }

  return {
    getSession
  }
}

export interface Order extends DataRow {
  order_id: string
  order_token: string
  price: number
  status: number
  birthday: number
  gender: number
  calendar_mode: number
  analysis?: AnalysisResult
}

export interface DataRow {
  _id: string
  _openid: string
  created_at: number
}

export interface PayOrder {
  orderId: string
}

const getCloud = async (): Promise<any> => {
  return new Promise((resolve, reject) => {
    tt.login({
      success: async () => {
        const cloud = tt.createCloud({
          envID: 'env-kjWAq03gZo',
          serviceID: '1khe8dcriwufv'
        })

        resolve(cloud)
      },
      fail: (error) => {
        reject(error)
      }
    })
  })
}

const getDatabase = async () => {
  const cloud = await getCloud()
  return await (cloud as any).database()
}

const payStatus = ref(-2)

export const useOrder = (
  birthday?: Lunisolar,
  gender?: number,
  calendarMode?: 'solar' | 'lunar'
) => {
  const orders: Ref<Order[]> = ref([])
  const isFetchingOrders = ref(false)
  const isAnalyzing = ref(false)
  const isFetchingOrder = ref(false)
  const order: Ref<Order | null> = ref(null)
  const isPaying = ref(false)

  const fetchOrders = async () => {
    isFetchingOrders.value = true
    try {
      const res = await (await getDatabase())
        .collection('order')
        .orderBy('created_at', 'desc')
        .get()
      orders.value = res.data
    } finally {
      isFetchingOrders.value = false
    }
  }

  const updateOrder = async (id: string, value: Partial<Order>) => {
    await (await cloud.database()).collection('order').doc(id).update(value)
  }

  const saveOrder = async (orderRaw: Partial<Order>) => {
    try {
      const { id } = await (await cloud.database()).collection('order').add({
        ...orderRaw,
        ...{ status: 1, created_at: new Date().getTime() }
      })

      return id
    } catch (error) {
      catcher(error, () => {}, -1)
    }
  }

  const pay = (orderToPay?: Order) => {
    showCaisher.value = true
    payStatus.value = 1
    const payOrder = orderToPay || order.value

    return new Promise<void>((resolve, reject) => {
      tt.pay({
        orderInfo: payOrder,
        service: 5,
        success: async (res) => {
          if (res.code == 0 && payOrder) {
            await updateOrder(payOrder._id, { status: 0 })
            payStatus.value = 0
            resolve()
          } else {
            reject()
          }
        },
        fail: (error) => {
          catcher(error, reject, -2)
        }
      })
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
      getCloud().then((cloud) => {
        cloud.callContainer({
          // 请改成实际业务path
          path: '/order/',
          init: {
            method: 'POST',
            header: {
              'content-type': 'application/json'
            },
            body: {
              product: 1
            },
            timeout: 60000 //ms
          },
          success: async ({ statusCode, header, data }) => {
            isPaying.value = true
            try {
              if (statusCode >= 200 && statusCode < 300) {
                let orderData = JSON.parse(data) as Partial<Order>
                try {
                  const id = await saveOrder({
                    ...pick(orderData, ['order_id', 'order_token', 'price']),
                    birthday,
                    gender,
                    status: 0
                  })

                  order.value = {
                    _id: id,
                    ...orderData
                  } as Order
                } catch (error) {
                  return catcher(error, reject, -2)
                }

                try {
                  await pay()
                } catch (error) {
                  return catcher(error, reject)
                }

                try {
                  await analyze()
                } catch (error) {
                  return catcher(error, reject)
                }
              }

              return catcher('error', reject)
            } catch (error) {
              catcher('error', reject)
            } finally {
              isPaying.value = false
            }
          },
          fail: (error) => {
            catcher(error, reject)
          },
          complete: () => {
            isPaying.value = false
          }
        })
      })
    })
  }

  const fetchOrder = async (birthday: number, gender: number) => {
    isFetchingOrder.value = true

    try {
      const result = await (
        await getDatabase()
      )
        .collection('order')
        .where({
          birthday,
          gender,
          status: 0
        })
        .get()

      order.value = (get(result.data, 0) as Order) || null
    } catch (error) {
      console.error('Failed to fetch order:', error)
    } finally {
      isFetchingOrder.value = false
    }
  }

  const analyze = async () => {
    let analysisResult: AnalysisResult | null = null

    if (!order.value) {
      return Promise.resolve(null)
    }

    try {
      isAnalyzing.value = true

      const url = process.env.TARO_APP_TT_BOAT_URL
      const payload: ChatRequest = {
        model: process.env.TARO_APP_TT_BOAT_NAME,
        stream: false,
        messages: [
          {
            role: 'user',
            content: `${order.value.calendar_mode === 1 ? '公历' : '农历'} ${new Date(
              order.value.birthday
            ).toISOString()} ${order.value.gender === 1 ? '男' : '女'}`
          }
        ]
      }

      const { data } = await axios.request<any, AxiosResponse<ChatResponse>>({
        url,
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          Authorization: 'Bearer 02018add-d7dd-4c70-b0a8-82b5b67e4d84'
        },
        data: payload
      })

      analysisResult = JSON.parse(data.choices[0].message.content) as AnalysisResult
      order.value.analysis = analysisResult

      await updateOrder(order.value._id, { analysis: analysisResult })
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      isAnalyzing.value = false
    }
  }

  if (birthday && gender && calendarMode) {
    fetchOrder(birthday.toDate().getTime(), gender)
  }

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
    order
  }
}

export interface ChatRequest {
  model: string
  stream: boolean
  messages: Array<{
    role: string
    content: string
  }>
}

export default {
  useAppData,
  useSession,
  useOrder
}
