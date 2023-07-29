<template>
  <div class="my-2 flex items-center">
    <FormButton
      :color="isActive ? 'success' : 'card'"
      size="sm"
      class="rounded-xl bg-black bg-opacity-5 text-sm font-medium outline-none mr-2"
    >
      <CheckIcon class="w-5 h-5" />
    </FormButton>
    {{ filterData.name }}
  </div>
</template>

<script setup lang="ts">
// TODO: Switch here filters according to filter input type and duplicatable or not
import { CheckIcon, PlusIcon } from '@heroicons/vue/20/solid'
import { ProjectModelCardSendFilterData } from 'lib/project/model/card/filter/send'

const props = defineProps<{
  projectId: string
  modelId: string
  filterData: ProjectModelCardSendFilterData
  isActive?: boolean
}>()
</script>
