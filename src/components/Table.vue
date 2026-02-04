<template>
    <data-table :value="accounts">
      <column field="labels" header="Метка" />
      <column field="type" header="Тип записи" />
      <column field="login" header="Логин" />
      <column field="password" header="Пароль" />
      <column header="" />
    </data-table>
</template>

<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import type { Account } from '@/types/account'

interface Props {
  accounts: Account[]
}

defineProps<Props>()
</script>
