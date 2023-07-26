import { defineStore } from 'pinia'
import { ConnectorConfig } from 'lib/bindings/definitions/IConnectorConfigBinding'

export const useConnectorConfigStore = defineStore('connectorConfigStore', () => {
  const { $connectorConfigBinding } = useNuxtApp()

  const hasConnectorConfigBinding = ref(!!$connectorConfigBinding)
  const userConfig = ref<ConnectorConfig[]>()

  watch(
    userConfig,
    async (newValue) => {
      if (!newValue || !$connectorConfigBinding) return
      await $connectorConfigBinding.updateUserConfig(newValue)
    },
    { deep: true }
  )

  const userConfigs = computed(() => {
    return userConfig.value
  })

  const updateUserConfig = (key: string, newValue: boolean | string) => {
    const tempUserConfig = userConfig.value
    if (!userConfig.value) {
      tempUserConfig.find((config) => config.key === key).config.value = newValue
    }
    userConfig.value = tempUserConfig
  }

  const init = async () => {
    if (!$connectorConfigBinding) return
    userConfig.value = await $connectorConfigBinding.getUserConfig()
  }
  void init()

  return { userConfigs, updateUserConfig, hasConnectorConfigBinding }
})
