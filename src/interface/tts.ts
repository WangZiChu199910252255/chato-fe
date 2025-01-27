export interface ITTSParams {
  text: string
  audio_key: string
  domain_slug: string
  token: string
  finish_reason?: 'done' | 'full'
}

export interface ITTSItem {
  exists: boolean
  provider: string
  text: string
  url: string
}

export interface ITTSList {
  contentList: ITTSItem[]
}
