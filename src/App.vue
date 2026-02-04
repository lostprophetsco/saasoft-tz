<template>
  <div class="app">
    <div class="container">
      <AppHeader @add-account="addAccount" />
      <AppPanel />
      <AppTable
        :accounts="accounts"
        @update-account="updateAccount"
        @save-account="saveAccount"
        @delete-account="deleteAccount"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAccountsStore } from '@/stores/accounts'
import AppHeader from '@/components/AppHeader.vue'
import AppPanel from '@/components/AppPanel.vue'
import AppTable from '@/components/AppTable.vue'
import type { Account } from '@/types/account'

const accountsStore = useAccountsStore()
const accounts = ref<Account[]>([])

onMounted(() => {
  accountsStore.loadFromLocalStorage()
  accounts.value = accountsStore.accounts
})

const addAccount = () => {
  accountsStore.addAccount({
    labels: [],
    type: '', // Тип не выбран, пароль не требуется
    login: '',
    password: null,
    isNew: true,
    isReadyForSave: false,
    isSaved: false,
  })

  accounts.value = accountsStore.accounts
}

const updateAccount = (account: Account) => {
  accountsStore.updateAccount(account)
  accounts.value = accountsStore.accounts
}

const saveAccount = (account: Account) => {
  accountsStore.saveAccount(account)
  accounts.value = accountsStore.accounts
  console.log('Saved to Pinia:', account)
}

const deleteAccount = (id: string) => {
  accountsStore.deleteAccount(id)
  accounts.value = accountsStore.accounts
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  background: #fff;
  color: #333;
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}
</style>
