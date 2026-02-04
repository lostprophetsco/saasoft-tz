<template>
  <div class="header">
    <h1>Учетные записи</h1>
    <Button icon="pi pi-plus" aria-label="Добавить" variant="outlined" @click="$emit('add-account')" />
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button'

defineEmits<{
  'add-account': []
}>()
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}
</style>
