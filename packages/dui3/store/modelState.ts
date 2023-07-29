import { ProjectModelCardSend } from 'lib/project/model/card/send'
import { defineStore } from 'pinia'

export const useModelStateStore = defineStore('modelStateStore', () => {
  const { $baseBinding } = useNuxtApp()
  const sendCards = ref<ProjectModelCardSend[]>([]) // Use ref here to make sendCards reactive

  // Get existing model state from connector.
  const init = async () => {
    if (!$baseBinding) return
    const modelState = await $baseBinding.getModelState()
    sendCards.value.push(...modelState.sendCards)
  }
  void init()

  const addSendCard = (sendCard: ProjectModelCardSend) => {
    sendCards.value.push(sendCard)
  }

  return { sendCards, addSendCard }
})
