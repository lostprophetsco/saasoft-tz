import type { EditableAccount } from '@/types/table'
import { MAX_LENGTHS } from '@/types/account'

export function useValidation() {
  // Валидация одной записи
  const validateAccount = (account: EditableAccount): boolean => {
    // Новые записи без данных не сохраняем
    if (account.isNew) return false
    
    // Проверка обязательных полей
    if (!account.type) return false
    if (!account.login.trim()) return false
    if (account.type === 'Локальная' && !account.password?.trim()) return false
    
    return true
  }

  return {
    validateAccount,
    MAX_LENGTHS
  }
}
