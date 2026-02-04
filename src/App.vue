<template>
  <div class="app">
    <div class="container">
      <AppHeader @add-account="handleAddAccount" />
      <AppPanel />
      <AppTable
        :accounts="accounts"
        @update-account="handleUpdateAccount"
        @save-account="handleSaveAccount"
        @delete-account="handleDeleteAccount"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAccounts } from '@/composables/useAccounts'
import { useAccountForm } from '@/composables/useAccountForm'
import AppHeader from '@/components/AppHeader.vue'
import AppPanel from '@/components/AppPanel.vue'
import AppTable from '@/components/AppTable.vue'
import type { Account } from '@/types/account'

const { accounts, initialize, addAccount, updateAccount, saveAccount, deleteAccount } = useAccounts()
const { createEmptyAccount } = useAccountForm()

onMounted(() => {
  initialize()
})

const handleAddAccount = () => {
  const newAccount = createEmptyAccount()
  addAccount(newAccount)
}

const handleUpdateAccount = (account: Account) => {
  updateAccount(account)
}

const handleSaveAccount = (account: Account) => {
  saveAccount(account)
}

const handleDeleteAccount = (id: string) => {
  deleteAccount(id)
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
