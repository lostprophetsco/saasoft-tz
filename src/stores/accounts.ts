import { defineStore } from 'pinia'
import type { Account } from '@/types/account'

export const useAccountsStore = defineStore('accounts', {
  state: () => ({
    accounts: [] as Account[],
    nextId: 1,
  }),

  getters: {
    // Резерв для будущих getters
  },

  actions: {
    addAccount(account: Omit<Account, 'id'>): Account {
      console.log('🆕 Adding new account:', account)
      const id = this.nextId.toString()
      this.nextId++

      const newAccount: Account = {
        ...account,
        id,
        isNew: true,
        isSaved: false
      }

      this.accounts.push(newAccount)
      // НЕ сохраняем сразу - только через updateAccount
      return newAccount
    },

    updateAccount(account: Account): void {
      console.log('📝 Updating account:', account)
      const index = this.accounts.findIndex((acc) => acc.id === account.id)
      if (index !== -1) {
        this.accounts[index] = account
        this.saveToLocalStorage()
      }
    },

    saveAccount(account: Account): void {
      console.log('💾 Saving account:', account)
      const index = this.accounts.findIndex((acc) => acc.id === account.id)
      if (index !== -1) {
        // Сохраняем только если запись готова к сохранению
        if (account.isReadyForSave) {
          console.log('✅ Account saved successfully')
          this.accounts[index] = {
            ...account,
            isNew: false,
            isSaved: true,
          }
          this.saveToLocalStorage()
        } else {
          console.log('❌ Account NOT saved - validation failed')
        }
      }
    },

    deleteAccount(id: string): void {
      console.log('🗑️ Deleting account:', id)
      const index = this.accounts.findIndex((acc) => acc.id === id)
      if (index !== -1) {
        const deletedAccount = this.accounts[index]
        this.accounts.splice(index, 1)
        this.saveToLocalStorage()
        console.log('✅ Account deleted successfully:', deletedAccount)
      }
    },

    saveToLocalStorage(): void {
      try {
        localStorage.setItem('accounts', JSON.stringify(this.accounts))
      } catch (error) {
        console.error('Failed to save to localStorage:', error)
      }
    },

    loadFromLocalStorage(): void {
      try {
        const saved = localStorage.getItem('accounts')
        if (saved) {
          const accounts = JSON.parse(saved) as Account[]
          this.accounts = accounts

          // Обновляем nextId чтобы избежать конфликтов ID
          const maxId = Math.max(...accounts.map((acc) => parseInt(acc.id) || 0), 0)
          this.nextId = maxId + 1
        }
      } catch (error) {
        console.error('Failed to load from localStorage:', error)
      }
    },
  },
})
