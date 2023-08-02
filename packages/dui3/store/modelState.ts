import { ProjectModelCardSend } from 'lib/project/model/card/send'
import { defineStore, storeToRefs } from 'pinia'
import { useSendFilterStore } from './sendFilter'
import { FilterIdentity, FilterTagIdentity } from 'lib/project/model/card/filter/send'
import { ListSelection } from 'lib/data/selection/ListSelection'

export const useModelStateStore = defineStore('modelStateStore', () => {
  const { $baseBinding, $sendBinding } = useNuxtApp()
  const sendCards = ref<ProjectModelCardSend[]>([]) // Use ref here to make sendCards reactive

  const sendFilterStore = useSendFilterStore()
  const { defaultSendFilter } = storeToRefs(sendFilterStore)

  // Get existing model state from connector.
  const init = async () => {
    if (!$baseBinding) return
    const modelState = await $baseBinding.getModelState()
    console.log(modelState)

    sendCards.value.push(...modelState.sendCards)
  }
  void init()

  const addSendCard = async (sendCard: ProjectModelCardSend) => {
    if (!sendCard.filters && defaultSendFilter.value) {
      sendCard = { ...sendCard, filters: defaultSendFilter.value }
    }
    sendCards.value.push(sendCard)
    await $sendBinding.addSendCard(sendCard)
  }

  const activateSendFilter = async (
    filterIdentity: FilterIdentity,
    activation: boolean
  ) => {
    const card = sendCards.value.find(
      (card) =>
        card.accountId === filterIdentity.accountId &&
        card.projectId === filterIdentity.projectId &&
        card.modelId === filterIdentity.modelId
    )

    if (card !== undefined) {
      if (card.filters !== undefined) {
        if (card.filters.multipleSelection) {
          if (activation) {
            card.filters?.selectedItems.push(filterIdentity.filterId)
          } else {
            const index = card.filters?.selectedItems?.indexOf(
              filterIdentity.filterId
            ) as number
            if (index > -1) {
              // only splice array when item is found
              card.filters?.selectedItems?.splice(index, 1) // 2nd parameter means remove one item only
            }
          }
        } else {
          if (card.filters?.selectedItems) {
            card.filters.selectedItems = []
            card.filters?.selectedItems.push(filterIdentity.filterId)
          }
        }
      }
    }

    await $sendBinding.activateSendFilter(filterIdentity, activation)
  }

  const activateSendFilterTag = async (
    filterIdentity: FilterTagIdentity,
    activation: boolean
  ) => {
    const card = sendCards.value.find(
      (card) =>
        card.accountId === filterIdentity.accountId &&
        card.projectId === filterIdentity.projectId &&
        card.modelId === filterIdentity.modelId
    )

    console.log(filterIdentity.tagId, 'Tag Id')
    console.log(activation, 'new value')

    if (card !== undefined) {
      if (card.filters !== undefined) {
        const filter = card.filters.items[filterIdentity.filterId] as ListSelection
        console.log(filter)

        if (filter.items !== undefined) {
          console.log(filter.items)

          if (filter.multipleSelection) {
            if (activation) {
              filter.selectedItems.push(filterIdentity.filterId)
              console.log(filter)
            } else {
              console.log(filter.selectedItems)

              const index = filter.selectedItems?.indexOf(
                filterIdentity.filterId
              ) as number
              console.log(index)

              if (index > -1) {
                // only splice array when item is found
                filter.selectedItems?.splice(index, 1) // 2nd parameter means remove one item only
              }
              console.log(filter)
            }
          } else {
            if (filter.selectedItems) {
              filter.selectedItems = []
              filter.selectedItems.push(filterIdentity.filterId)
            }
          }
        }
      }
    }

    await $sendBinding.activateSendFilterTag(filterIdentity, activation)
  }

  return { sendCards, addSendCard, activateSendFilter, activateSendFilterTag }
})
