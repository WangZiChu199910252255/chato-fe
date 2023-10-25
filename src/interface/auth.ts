import type { ELoginEmpowerStatus } from '@/enum/auth'

export interface ILoginParams {
  mobile: string
  verification_code: string
  channel: string
  bd_vid: string
  bd_keyword: string
  nickname?: string
  eid?: string
  external_user_id?: string
}

export interface ILoginQRCodeResult {
  session: string
  url: string
}

export interface ILoginQRCodeSerachParams {
  session: string
}

export interface ILoginQRCodeEmpowerResult {
  status: ELoginEmpowerStatus
  external_user_id: string
  token: string | null
}