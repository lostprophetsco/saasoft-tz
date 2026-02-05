import type { ComputedRef } from 'vue'
import type { Account } from './account'

export interface EditableAccount extends Account {
  labelsFormatted: string
  isNew?: boolean
  isReadyForSave?: boolean
  isSaved?: boolean
  isLocal?: ComputedRef<boolean>
  isSavedComputed?: ComputedRef<boolean>
  isLabelsInvalid?: ComputedRef<boolean>
  isTypeInvalid?: ComputedRef<boolean>
  isLoginInvalid?: ComputedRef<boolean>
  isPasswordInvalid?: ComputedRef<boolean>
}

export interface TableProps {
  accounts: Account[]
}

export interface TableEmits {
  'update-account': [account: Account]
  'save-account': [account: Account]
  'delete-account': [id: string]
}
