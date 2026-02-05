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
          :invalid="data.isLabelsInvalid"
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
          :invalid="data.isTypeInvalid"
          @change="onTypeChange(data)"
        />
      </template>
    </Column>

    <Column field="login" header="Логин" :colspan="shouldShowPasswordColumn ? 1 : 2">
      <template #body="{ data }">
        <InputText
          v-model="data.login"
          :invalid="data.isLoginInvalid"
          :maxlength="MAX_LENGTHS.LOGIN"
          @blur="updateAccount(data)"
        />
      </template>
    </Column>

    <Column v-if="shouldShowPasswordColumn" field="password" header="Пароль">
      <template #body="{ data }">
        <Password
          v-if="data.isLocal"
          v-model="data.password"
          :invalid="data.isPasswordInvalid"
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
          v-if="data.isSavedComputed"
          icon="pi pi-trash"
          class="p-button-danger p-button-text"
          @click="deleteAccount(data.id)"
        />
      </template>
    </Column>
  </DataTable>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ACCOUNT_TYPES, MAX_LENGTHS } from '@/types/account'
import { useValidation } from '@/composables/useValidation'
import { useAccountForm } from '@/composables/useAccountForm'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Password from 'primevue/password'
import Button from 'primevue/button'
import type { EditableAccount, TableProps, TableEmits } from '@/types/table'

const props = defineProps<TableProps>()
const emit = defineEmits<TableEmits>()

const accountTypes = ACCOUNT_TYPES
const { validateAccount } = useValidation()
const { createEditableAccount, resetOnTypeChange, prepareForUpdate } = useAccountForm()

// Prepare accounts for editing with formatted labels and computed properties
const editableAccounts = computed(() => {
  return props.accounts.map(account => {
    const editable = createEditableAccount(account)
    return {
      ...editable,
      isLocal: computed(() => editable.type === 'Локальная'),
      isSavedComputed: computed(() => editable.isSaved),
      isLabelsInvalid: computed(() => !editable.labelsFormatted && editable.labelsFormatted !== ''),
      isTypeInvalid: computed(() => !editable.type),
      isLoginInvalid: computed(() => !editable.login),
      isPasswordInvalid: computed(() => !editable.password)
    }
  })
})

const updateAccount = (data: EditableAccount) => {
  const isReady = validateAccount(data)
  const account = prepareForUpdate(data)

  // Устанавливаем флаг готовности к сохранению
  account.isReadyForSave = isReady

  emit('update-account', account)

  // Если готово к сохранению, автоматически сохраняем
  if (isReady) {
    emit('save-account', account)
  }
}

const onTypeChange = (data: EditableAccount) => {
  const updated = resetOnTypeChange(data, data.type)
  updateAccount(updated)
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
