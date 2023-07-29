<template>
  <div v-for="(filter, key) in cardSend.filters" :key="key">
    <ModelSendCardFilter
      :project-id="cardSend.projectId"
      :model-id="cardSend.modelId"
      :is-active="cardSend.activeFilters?.includes(key as string)"
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
