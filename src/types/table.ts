import type { Account } from './account'

export interface EditableAccount extends Account {
  labelsFormatted: string
  isNew?: boolean
  isReadyForSave?: boolean
  isSaved?: boolean
}

export interface TableProps {
  accounts: Account[]
}

export interface TableEmits {
  'update-account': [account: Account]
  'save-account': [account: Account]
  'delete-account': [id: string]
}
