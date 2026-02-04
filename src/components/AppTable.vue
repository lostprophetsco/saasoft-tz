<template>
  <DataTable :value="editableAccounts">
    <template #empty>
      <div class="empty-message">
        <i class="pi pi-inbox"></i>
        <p>Нет учетных записей</p>
        <p>Нажмите "Добавить" для создания новой записи</p>
      </div>
    </template>
    <Column field="labels" header="Метка">
      <template #body="{ data }">
        <InputText
          v-model="data.labelsFormatted"
          :invalid="!data.labelsFormatted && data.labelsFormatted !== ''"
          :maxlength="MAX_LENGTHS.LABELS"
          @blur="updateAccount(data)"
        />
      </template>
    </Column>

    <Column field="type" header="Тип записи">
      <template #body="{ data }">
        <Select
          v-model="data.type"
          :options="accountTypes"
          :invalid="!data.type"
          @change="onTypeChange(data)"
        />
      </template>
    </Column>

    <Column field="login" header="Логин" :colspan="shouldShowPasswordColumn ? 1 : 2">
      <template #body="{ data }">
        <InputText
          v-model="data.login"
          :invalid="!data.login"
          :maxlength="MAX_LENGTHS.LOGIN"
          @blur="updateAccount(data)"
        />
      </template>
    </Column>

    <Column v-if="shouldShowPasswordColumn" field="password" header="Пароль">
      <template #body="{ data }">
        <Password
          v-if="data.type === 'Локальная'"
          v-model="data.password"
          :invalid="!data.password"
          :maxlength="MAX_LENGTHS.PASSWORD"
          :feedback="false"
          toggleMask
          @blur="updateAccount(data)"
        />
        <span v-else>-</span>
      </template>
    </Column>

    <Column v-if="hasDeletableAccounts" header="">
      <template #body="{ data }">
        <Button
          v-if="data.isSaved"
          icon="pi pi-trash"
          class="p-button-danger p-button-text"
          @click="deleteAccount(data.id)"
        />
      </template>
    </Column>
  </DataTable>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { ACCOUNT_TYPES, MAX_LENGTHS } from '@/types/account'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Password from 'primevue/password'
import Button from 'primevue/button'
import type { Account, LabelItem } from '@/types/account'
import type { EditableAccount, TableProps, TableEmits } from '@/types/table'

const props = defineProps<TableProps>()
const emit = defineEmits<TableEmits>()

const accountTypes = ACCOUNT_TYPES

const formatLabels = (labels: LabelItem[]): string => {
  return labels.map((item) => item.text).join('; ')
}

const parseLabels = (labelsString: string): LabelItem[] => {
  if (!labelsString.trim()) return []

  return labelsString
    .split(';')
    .map((text) => text.trim())
    .filter((text) => text.length > 0)
    .map((text) => ({ text }))
}

const isAccountValid = (account: EditableAccount): boolean => {
  // Проверка обязательных полей
  if (!account.type) return false
  if (!account.login.trim()) return false
  if (account.type === 'Локальная' && !account.password?.trim()) return false

  return true
}

const prepareAccountForEdit = (account: Account): EditableAccount => {
  return {
    ...account,
    labelsFormatted: formatLabels(account.labels),
  }
}

const updateAccount = (data: EditableAccount) => {
  const isReady = isAccountValid(data)

  const account: Account = {
    id: data.id,
    labels: parseLabels(data.labelsFormatted || ''),
    type: data.type,
    login: data.login,
    password: data.type === 'LDAP' ? null : data.password,
    isReadyForSave: isReady,
    isSaved: false, // При любом изменении сбрасываем isSaved
  }

  emit('update-account', account)

  // Если готово к сохранению, автоматически сохраняем
  if (isReady) {
    emit('save-account', account)
  }
}

const onTypeChange = (data: EditableAccount) => {
  if (data.type === 'LDAP') {
    data.password = null
  } else if (data.type === 'Локальная' && !data.password) {
    data.password = ''
  }
  updateAccount(data)
}

const deleteAccount = (id: string) => {
  emit('delete-account', id)
}

// Показывать колонку пароля только для записей типа "Локальная"
const shouldShowPasswordColumn = computed(() => {
  return props.accounts.some((account) => account.type === 'Локальная')
})

// Показывать колонку с кнопками удаления только для сохраненных записей
const hasDeletableAccounts = computed(() => {
  return props.accounts.some((account) => account.isSaved)
})

// Prepare accounts for editing with formatted labels
const editableAccounts = ref<EditableAccount[]>(props.accounts.map(prepareAccountForEdit))

watch(
  () => props.accounts,
  (newAccounts) => {
    editableAccounts.value = newAccounts.map(prepareAccountForEdit)
  },
  { deep: true },
)
</script>

<style scoped>
:deep(.p-invalid) {
  border-color: #dc3545 !important;
}

:deep(.p-select) {
  width: 100%;
}

:deep(.p-inputtext, .p-password) {
  width: 100%;
}

.empty-message {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
}

.empty-message p {
  margin: 0.5rem 0;
}
</style>
