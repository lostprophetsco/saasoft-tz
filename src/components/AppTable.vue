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

    <Column field="login" class="log-pass__header">
      <template #header>
        <span>Логин</span>
        <span>Пароль</span>
      </template>

      <template #body="{ data }">
        <div class="log-pass__body">
          <InputText
            v-model="data.login"
            :invalid="!data.login"
            :maxlength="MAX_LENGTHS.LOGIN"
            @blur="updateAccount(data)"
          />

          <Password
            v-if="data.type === 'Локальная'"
            v-model="data.password"
            :invalid="!data.password"
            :maxlength="MAX_LENGTHS.PASSWORD"
            :feedback="false"
            toggleMask
            @blur="updateAccount(data)"
          />
        </div>
      </template>
    </Column>

    <Column header="">
      <template #body="{ data }">
        <Button
          icon="pi pi-trash"
          class="p-button-danger p-button-text"
          @click="deleteAccount(data.id)"
        />
      </template>
    </Column>
  </DataTable>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ACCOUNT_TYPES, MAX_LENGTHS } from '@/types/account'
import { useValidation } from '@/composables/useValidation'
import { useAccountForm } from '@/composables/useAccountForm'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Password from 'primevue/password'
import Button from 'primevue/button'
import type { Account } from '@/types/account'
import type { EditableAccount, TableProps, TableEmits } from '@/types/table'

const props = defineProps<TableProps>()
const emit = defineEmits<TableEmits>()

const accountTypes = ACCOUNT_TYPES
const { validateAccount } = useValidation()
const { createEditableAccount, resetOnTypeChange, prepareForUpdate } = useAccountForm()

const prepareAccountForEdit = (account: Account): EditableAccount => {
  return createEditableAccount(account)
}

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

:deep(.log-pass__header) {
  .p-datatable-column-header-content {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
}

.log-pass__body {
  display: flex;
  gap: 2rem;

  .p-password {
    flex: 1 0 calc(50% - 1rem);
  }
}
</style>
