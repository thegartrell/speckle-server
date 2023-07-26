<template>
  <div>
    <button
      type="button"
      class="rounded-lg bg-black bg-opacity-5 px-2 py-2 text-sm font-medium outline-none"
      @click="openModal"
    >
      <Cog6ToothIcon class="h-6 w-6 text-gray-500" />
    </button>
  </div>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" class="relative z-10" @close="closeModal">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
            >
              <DialogTitle
                as="h3"
                class="mb-4 text-lg font-medium leading-6 text-gray-900"
              >
                Settings
              </DialogTitle>

              <DialogTitle as="h1" class="text-md leading-6 text-gray-900">
                User Preferences
              </DialogTitle>
              <hr class="my-1" />

              <div v-if="hasConnectorConfigBinding" class="my-2">
                <div v-for="config in userConfigs" :key="config.key" class="my-4">
                  <div class="inline-block mr-2">
                    {{ config.title }}
                  </div>
                  <div v-if="config.type === 'toggle'" class="inline-block">
                    <SwitchGroup as="div" class="flex items-center space-x-4">
                      <Switch
                        v-slot="{ checked }"
                        v-model="config.config.value"
                        as="button"
                        class="relative inline-flex flex-shrink-0 h-6 transition-colors duration-200 ease-in-out border-2 border-transparent rounded-full cursor-pointer w-11 focus:outline-none focus:shadow-outline"
                        :class="config.config.value ? 'bg-indigo-600' : 'bg-gray-200'"
                        @click="updateUserConfig(config.key, !config.config.value)"
                      >
                        <span
                          class="inline-block w-5 h-5 transition duration-200 ease-in-out transform bg-white rounded-full"
                          :class="{
                            'translate-x-5': checked,
                            'translate-x-0': !checked
                          }"
                        />
                      </Switch>
                    </SwitchGroup>
                  </div>
                  <div v-if="config.type === 'dropdown'">
                    <div>
                      <Listbox v-model="config.config.value">
                        <div class="relative mt-1">
                          <ListboxButton
                            class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
                          >
                            <span class="block truncate">
                              {{ config.config.value }}
                            </span>
                            <span
                              class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                            ></span>
                          </ListboxButton>

                          <Transition
                            leave-active-class="transition duration-100 ease-in"
                            leave-from-class="opacity-100"
                            leave-to-class="opacity-0"
                          >
                            <ListboxOptions
                              class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                            >
                              <ListboxOption
                                v-for="item in config.config.items"
                                v-slot="{ active, selected }"
                                :key="item"
                                :value="item"
                                as="template"
                              >
                                <li
                                  :class="[
                                    active
                                      ? 'bg-amber-100 text-amber-900'
                                      : 'text-gray-900',
                                    'relative cursor-default select-none py-2 pl-10 pr-4'
                                  ]"
                                >
                                  <span
                                    :class="[
                                      selected ? 'font-medium' : 'font-normal',
                                      'block truncate'
                                    ]"
                                  >
                                    {{ item }}
                                  </span>
                                  <span
                                    v-if="selected"
                                    class="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600"
                                  >
                                    <CheckIcon class="h-5 w-5" aria-hidden="true" />
                                  </span>
                                </li>
                              </ListboxOption>
                            </ListboxOptions>
                          </Transition>
                        </div>
                      </Listbox>
                    </div>
                  </div>
                </div>
              </div>

              <DialogTitle as="h1" class="text-md leading-6 text-gray-900">
                Model Preferences
              </DialogTitle>
              <hr class="my-1" />

              <div v-if="hasConnectorConfigBinding" class="mt-2">
                <div v-for="config in userConfigs" :key="config.key">
                  {{ config.config.value }}
                </div>
              </div>

              <div class="mt-4">
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  @click="closeModal"
                >
                  Close
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle
} from '@headlessui/vue'
import { SwitchGroup, Switch, SwitchLabel } from '@headlessui/vue'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import {
  Listbox,
  ListboxLabel,
  ListboxButton,
  ListboxOptions,
  ListboxOption
} from '@headlessui/vue'

import { Cog6ToothIcon, CheckIcon } from '@heroicons/vue/20/solid'
import { useConnectorConfigStore } from '~/store/connectorConfig'
import {
  TextFieldConfig,
  DropdownConfig,
  ToggleConfig
} from 'lib/bindings/definitions/IConnectorConfigBinding'

const isOpen = ref(false)

function closeModal() {
  isOpen.value = false
}

function openModal() {
  isOpen.value = true
}

const connectorConfigStore = useConnectorConfigStore()
const { userConfigs, hasConnectorConfigBinding } = storeToRefs(connectorConfigStore)
const { updateUserConfig } = connectorConfigStore
</script>
