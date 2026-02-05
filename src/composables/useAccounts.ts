import { computed } from 'vue'
import { useAccountsStore } from '@/stores/accounts'
import type { Account } from '@/types/account'

export function useAccounts() {
  const store = useAccountsStore()

  // Реактивный доступ к данным
  const accounts = computed(() => store.accounts)

  // Инициализация при монтировании
  const initialize = () => {
    store.loadFromLocalStorage()
  }

  // Добавление новой записи
  const addAccount = (accountData: Omit<Account, 'id'>) => {
    const account = store.addAccount(accountData)
    console.log('Account added:', account)
    return account
  }

  // Обновление записи
  const updateAccount = (account: Account) => {
    store.updateAccount(account)
  }

  // Сохранение записи (установка флага isSaved)
  const saveAccount = (account: Account) => {
    store.saveAccount(account)
  }

  // Удаление записи
  const deleteAccount = (id: string) => {
    store.deleteAccount(id)
  }

  // Получение сохраненных записей
  const savedAccounts = computed(() => {
    return accounts.value.filter(account => account.isSaved)
  })

  // Проверка наличия записей типа "Локальная"
  const hasLocalAccounts = computed(() => {
    return accounts.value.some(account => account.type === 'Локальная')
  })

  return {
    // Данные
    accounts,
    savedAccounts,
    hasLocalAccounts,

    // Методы
    initialize,
    addAccount,
    updateAccount,
    saveAccount,
    deleteAccount
  }
}
