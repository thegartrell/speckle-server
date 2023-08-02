<template>
  <div class="flex md:flex md:flex-grow flex-row justify-end space-x-1 p-2 pb-4">
    <FormButton size="sm" @click="addSendCardHandler">
      <ArrowUpIcon class="w-5 h-5" />
      Send
    </FormButton>
  </div>
  <div v-for="sendCard in sendCards" :key="sendCard.projectId">
    <ModelSendCard :card-send="sendCard" :filter-enabled="false" />
  </div>
</template>
<script setup lang="ts">
import { ArrowUpIcon } from '@heroicons/vue/20/solid'
import { storeToRefs } from 'pinia'
import { useModelStateStore } from '~/store/modelState'

const modelStateStore = useModelStateStore()
const { sendCards } = storeToRefs(modelStateStore)
const { addSendCard } = modelStateStore

const modelId = () => new Date().getTime().toString()

function addSendCardHandler() {
  addSendCard({ accountId: 'account', projectId: 'test', modelId: modelId() })
}
</script>
