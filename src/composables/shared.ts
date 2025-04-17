import { ref, type Ref } from 'vue'
import { AnalysisResult, Order } from '../types'

export const appState = {
  currentLuckMonth: ref(0),
  currentLuckDay: ref(0),
  calendarMode: ref<'solar' | 'lunar'>('solar'),
  selectedYear: ref<number>(),
  selectedMonth: ref<number>(),
  selectedDay: ref<number>(),
  selectedHour: ref<number>(),
  selectedGender: ref<number | null>(null),
  lsrObject: ref(),
  birthday: ref(),
  showCaisher: ref(false),
  isPreviewing: ref(false),
  isPaying: ref(false),
  currentLuckYear: ref(null),
  currentFortune: ref(null)
}

export const orderState = {
  payStatus: ref(-2),
  orders: ref<Order[]>([]),
  isFetchingOrders: ref(false),
  isAnalyzing: ref(false),
  isFetchingOrder: ref(false),
  order: ref<Order | null>(null),
  isPaying: ref(false),
  analysisResult: ref(null)
}

export default {
  appState,
  orderState
}
