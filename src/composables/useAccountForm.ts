import type { Account, AccountType } from '@/types/account'
import type { EditableAccount } from '@/types/table'

export function useAccountForm() {
  // Создание новой пустой записи
  const createEmptyAccount = (): EditableAccount => ({
    id: Date.now().toString(),
    labels: [],
    labelsFormatted: '',
    type: '',
    login: '',
    password: null,
    isNew: true,
    isReadyForSave: false,
    isSaved: false
  })

  // Создание записи для редактирования
  const createEditableAccount = (account: Account): EditableAccount => {
    return {
      ...account,
      labelsFormatted: formatLabels(account.labels)
    }
  }

  // Форматирование меток из массива в строку
  const formatLabels = (labels: { text: string }[]): string => {
    return labels.map(item => item.text).join('; ')
  }

  // Парсинг меток из строки в массив
  const parseLabels = (labelsString: string): { text: string }[] => {
    if (!labelsString.trim()) return []
    
    return labelsString
      .split(';')
      .map(text => text.trim())
      .filter(text => text.length > 0)
      .map(text => ({ text }))
  }

  // Преобразование EditableAccount в Account
  const toAccount = (editable: EditableAccount): Account => {
    return {
      id: editable.id,
      labels: parseLabels(editable.labelsFormatted || ''),
      type: editable.type,
      login: editable.login,
      password: editable.type === 'LDAP' ? null : editable.password,
      isNew: editable.isNew,
      isReadyForSave: editable.isReadyForSave,
      isSaved: editable.isSaved
    }
  }

  // Сброс полей при смене типа
  const resetOnTypeChange = (account: EditableAccount, newType: AccountType): EditableAccount => {
    const updated = { ...account, type: newType }
    
    if (newType === 'LDAP') {
      updated.password = null
    } else if (newType === 'Локальная' && !updated.password) {
      updated.password = ''
    }
    
    return updated
  }

  // Подготовка данных для обновления
  const prepareForUpdate = (account: EditableAccount): Account => {
    return {
      ...toAccount(account),
      isSaved: false, // При обновлении сбрасываем флаг сохранения
      isNew: false // При обновлении сбрасываем флаг новой записи
    }
  }

  return {
    // Создание записей
    createEmptyAccount,
    createEditableAccount,
    
    // Преобразование данных
    formatLabels,
    parseLabels,
    toAccount,
    
    // Манипуляции с данными
    resetOnTypeChange,
    
    // Подготовка для операций
    prepareForUpdate
  }
}
