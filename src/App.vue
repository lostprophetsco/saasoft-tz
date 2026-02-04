<template>
  <div class="app">
    <div class="container">
      <Header @add-account="addAccount" />
      <Panel />
      <Table :accounts="accounts" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Header from '@/components/Header.vue'
import Panel from '@/components/Panel.vue'
import Table from '@/components/Table.vue'
import type { Account } from '@/types/account'

const accounts = ref<Account[]>([])

const addAccount = () => {
  console.log('Add account clicked')
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
