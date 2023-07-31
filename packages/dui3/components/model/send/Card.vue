<template>
  <div
    class="relative group flex flex-col md:flex-row md:space-x-2 border-2 border-primary-muted hover:bg-primary-muted rounded-md p-3 transition overflow-hidden mb-1"
  >
    <div
      class="w-full md:w-48 flex flex-col col-span-3 lg:col-span-1 flex-shrink-0 space-y-1"
    >
      <div class="grid grid-cols-6 gap-2">
        <div class="min-h-[25px] flex items-center col-span-3">
          {{ `${cardSend.projectId} - ${cardSend.modelId}` }}
        </div>
        <div
          class="min-h-[25px] flex items-center justify-center text-center col-span-2"
        >
          <FormButton
            v-if="cardSend.filters"
            color="card"
            size="sm"
            class="w-20 rounded-xl bg-black bg-opacity-5 px-2 text-sm font-medium outline-none"
            @click="updateFilterEnabled()"
          >
            <FunnelIcon class="w-3 h-3 mr-2" />
            Filter
          </FormButton>
        </div>
        <div
          class="min-h-[25px] flex items-center justify-center text-center col-span-1"
        >
          <FormButton
            color="card"
            size="sm"
            class="w-20 rounded-xl bg-black bg-opacity-5 px-2 text-sm font-medium outline-none"
          >
            <ArrowUpIcon class="w-5 h-5" />
          </FormButton>
        </div>
      </div>
      <div v-if="filterEnabledRef">
        <ModelSendCardFilters :card-send="cardSend" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ArrowUpIcon, FunnelIcon } from '@heroicons/vue/20/solid'
import { ProjectModelCardSend } from 'lib/project/model/card/send'

const props = defineProps<{
  cardSend: ProjectModelCardSend
  filterEnabled: boolean
}>()

const filterEnabledRef = ref(props.filterEnabled)

function updateFilterEnabled() {
  filterEnabledRef.value = !filterEnabledRef.value
}
</script>
