import { ProjectModelCardSend } from 'lib/project/model/card/send'
import { defineStore, storeToRefs } from 'pinia'
import { useSendFilterStore } from './sendFilter'

export const useModelStateStore = defineStore('modelStateStore', () => {
  const { $baseBinding } = useNuxtApp()
  const sendCards = ref<ProjectModelCardSend[]>([]) // Use ref here to make sendCards reactive

  const sendFilterStore = useSendFilterStore()
  const { defaultSendFilter } = storeToRefs(sendFilterStore)

  // Get existing model state from connector.
  const init = async () => {
    if (!$baseBinding) return
    const modelState = await $baseBinding.getModelState()
    sendCards.value.push(...modelState.sendCards)
  }
  void init()

  const addSendCard = (sendCard: ProjectModelCardSend) => {
    if (!sendCard.filters && defaultSendFilter.value) {
      sendCard = { ...sendCard, filters: defaultSendFilter.value }
    }
    sendCards.value.push(sendCard)
  }

  return { sendCards, addSendCard }
})
