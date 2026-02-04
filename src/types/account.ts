export const ACCOUNT_TYPES = ['LDAP', 'Локальная'] as const

export const MAX_LENGTHS = {
  LABELS: 50,
  LOGIN: 100,
  PASSWORD: 100
} as const

export interface LabelItem {
  text: string
}

export type AccountType = 'LDAP' | 'Локальная'

export interface Account {
  id: string
  labels: LabelItem[]
  type: AccountType
  login: string
  password: string | null
}
