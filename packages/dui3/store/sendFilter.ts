import {
  FilterIdentity,
  ProjectModelCardSendFilter,
  ProjectModelCardSendFilterData
} from 'lib/project/model/card/filter/send'
import { defineStore, storeToRefs } from 'pinia'
import { useModelStateStore } from './modelState'
import { ListSelection, ListSelectionItems } from 'lib/data/selection/ListSelection'

export const useSendFilterStore = defineStore('sendFilterStore', () => {
  const { $baseBinding, $sendBinding } = useNuxtApp()

  const defaultSendFilter = ref<ListSelection>()

  const modelStateStore = useModelStateStore()
  const { sendCards } = storeToRefs(modelStateStore)

  const init = async () => {
    if (!$baseBinding) return
    defaultSendFilter.value = await $baseBinding.getSendFilter()
    console.log(defaultSendFilter)
  }
  void init()

  const updateSendFilter = async (
    accountId: string,
    projectId: string,
    modelId: string,
    filterId: string,
    newValue: ListSelection
  ) => {
    await $baseBinding.updateSendFilter(
      accountId,
      projectId,
      modelId,
      filterId,
      newValue
    )
  }

  const activateSendFilter = async (
    filterIdentity: FilterIdentity,
    activation: boolean
  ) => {
    console.log(sendCards)

    // const card = sendCards.value.find(
    //   (card) => card.accountId === filterIdentity.accountId
    // )
    // console.log(card)
    await $sendBinding.activateSendFilter(filterIdentity, activation)
  }

  return { defaultSendFilter, updateSendFilter, activateSendFilter }
})
