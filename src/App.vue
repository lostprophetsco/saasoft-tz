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
import { ref } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import AppPanel from '@/components/AppPanel.vue'
import AppTable from '@/components/AppTable.vue'
import type { Account } from '@/types/account'

const accounts = ref<Account[]>([])

const addAccount = () => {
  const newAccount: Account = {
    id: Date.now().toString(),
    labels: [],
    type: '', // Тип не выбран
    login: '',
    password: null, // Пароль null, т.к. тип не выбран
    isNew: true,
    isReadyForSave: false,
    isSaved: false
  }
  
  accounts.value.push(newAccount)
}

const updateAccount = (account: Account) => {
  const index = accounts.value.findIndex(acc => acc.id === account.id)
  if (index !== -1) {
    accounts.value[index] = account
  }
}

const saveAccount = (account: Account) => {
  const index = accounts.value.findIndex(acc => acc.id === account.id)
  if (index !== -1) {
    const savedAccount = {
      ...account,
      isNew: false, // При сохранении запись больше не новая
      isSaved: true
    }
    accounts.value[index] = savedAccount
    // TODO: Здесь будет сохранение в Pinia
    console.log('Saving to Pinia:', savedAccount)
  }
}

const deleteAccount = (id: string) => {
  const index = accounts.value.findIndex(acc => acc.id === id)
  if (index !== -1) {
    accounts.value.splice(index, 1)
  }
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
