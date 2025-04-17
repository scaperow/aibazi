export interface UserInfo {
  nickName: string
  avatarUrl: string
  gender: number
  city: string
  province: string
  country: string
  language: string
}

export interface DataRow {
  _id: string
  _openid: string
  created_at: number
}

export type SessionUser = UserInfo & {
  encryptedData: string
}

export type CalendarMode = 'lunar' | 'solar'

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

export interface PayOrder {
  orderId: string
}

export interface ChatRequest {
  model: string
  stream: boolean
  messages: Array<{
    role: string
    content: string
  }>
}
