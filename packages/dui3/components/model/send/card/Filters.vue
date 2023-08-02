<template>
  <div v-for="(filter, key) in cardSend.filters.items" :key="key">
    <ModelSendCardFilter
      :account-id="cardSend.accountId"
      :project-id="cardSend.projectId"
      :model-id="cardSend.modelId"
      :filter-id="(key as string)"
      :is-active="cardSend.filters.selectedItems.includes(key as string)"
      :filter-data="filter"
    />
  </div>
</template>

<script setup lang="ts">
import { ProjectModelCardSend } from 'lib/project/model/card/send'

const props = defineProps<{
  cardSend: ProjectModelCardSend
}>()
</script>
