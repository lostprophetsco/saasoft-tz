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
      const id = this.nextId.toString()
      this.nextId++

      const newAccount: Account = {
        ...account,
        id,
      }

      this.accounts.push(newAccount)
      this.saveToLocalStorage()
      return newAccount
    },

    updateAccount(account: Account): void {
      const index = this.accounts.findIndex((acc) => acc.id === account.id)
      if (index !== -1) {
        this.accounts[index] = account
        this.saveToLocalStorage()
      }
    },

    saveAccount(account: Account): void {
      const index = this.accounts.findIndex((acc) => acc.id === account.id)
      if (index !== -1) {
        this.accounts[index] = {
          ...account,
          isNew: false,
          isSaved: true,
        }
        this.saveToLocalStorage()
      }
    },

    deleteAccount(id: string): void {
      const index = this.accounts.findIndex((acc) => acc.id === id)
      if (index !== -1) {
        this.accounts.splice(index, 1)
        this.saveToLocalStorage()
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
