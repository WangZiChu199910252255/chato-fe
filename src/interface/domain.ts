import type { EDomainConversationMode, EDomainStatus, EDomainType } from '@/enum/domain'
import type { IOrg } from './user'

export interface IDomainCustomerLimit {
  rate_limit_switch: number
  rate_limit: {
    time_seconds: number
    num: number
    response: string
  }
  quota_limit_switch: number
  quota_limit: {
    total: number
    response: string
  }
  token_limit_switch: number
  token_limit: {
    token: string
    error_response: string
    correctness_response: string
  }
}

export interface IDomainInfo {
  id: number
  created: string
  modified: string
  name: string
  slug: string
  org: IOrg
  file_count: number
  system_prompt: string
  welcome: string
  creator: number
  updater: number
  avatar: string
  avatar_show: boolean
  name_show: boolean
  message_style: string
  suspend_style: string
  whitelist_sites: string
  lang: string
  reply_tone: string
  reply_length: number
  temperature: number
  customer_limit: Partial<IDomainCustomerLimit>
  shortcuts: string
  desc: string
  desc_show: number
  type: EDomainType
  deleted: string
  status: EDomainStatus
  visible: number // 是否在资源广场展示: 1 是 0 否
  template: number // 是否为模板: 1 是 0 否
  question_max_length: number
  system_prompt_max_length: number
  brand_name: string
  brand_logo: string
  ad_content: string
  ad_frequency: number
  ad_show: number
  category: string
  token: string
  llm: string | null
  top_k: number
  keyword_block: string[]
  keyword_block_reply: string
  keyword_block_show: boolean
  conversation_mode: EDomainConversationMode // 机器人对话类型
  brand_show: number
  qa_modifiable: number
  question_ref_source_show: number
  name_and_avatar_show: number
  is_session_effective: number
}

export interface IDomainShortcut {
  title: string
  response: string
  images: string[]
  image: string
}

export interface IDomainDetail {
  customer_limit: {
    rate_limit_switch: boolean
    rate_limit: {
      time_seconds: number
      num: number
      response: string
    }
    quota_limit_switch: boolean
    quota_limit: {
      total: number
      response: string
    }
  }
  show: {
    ad_show: boolean
    name_and_avatar_show: boolean
    desc_show: boolean
    question_ref_source_show: boolean
    suspend_style: string
    suspend_style_color: string
    message_style: string
    qa_modifiable: boolean
  }
  domain: IDomainInfo
  shortcuts: IDomainShortcut[]
}

export interface IDomainLLMConfig {
  name: string
  type: string
  consume_quota: number
  need_vip: boolean
}
