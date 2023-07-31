import {
  ProjectModelCardSendFilter,
  ProjectModelCardSendFilterData
} from 'lib/project/model/card/filter/send'
import { defineStore } from 'pinia'

export const useSendFilterStore = defineStore('sendFilterStore', () => {
  const { $baseBinding } = useNuxtApp()

  const defaultSendFilter = ref<ProjectModelCardSendFilter>()

  const init = async () => {
    if (!$baseBinding) return
    defaultSendFilter.value = await $baseBinding.getSendFilter()
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
