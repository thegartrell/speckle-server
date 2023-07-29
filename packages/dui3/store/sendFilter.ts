import { ProjectModelCardSendFilterData } from 'lib/project/model/card/filter/send'
import { defineStore } from 'pinia'

export const useSendFilter = defineStore('sendFilterStore', () => {
  const { $baseBinding } = useNuxtApp()

  let defaultSendFilter
  const init = async () => {
    if (!$baseBinding) return
    defaultSendFilter = await $baseBinding.getSendFilter()
  }
  void init()

  const updateSendFilter = async (
    projectId: string,
    modelId: string,
    filterId: string,
    newValue: ProjectModelCardSendFilterData
  ) => {
    await $baseBinding.updateSendFilter(projectId, modelId, filterId, newValue)
  }

  return { defaultSendFilter, updateSendFilter }
})
