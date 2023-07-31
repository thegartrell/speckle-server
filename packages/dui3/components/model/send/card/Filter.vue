<template>
  <div class="my-2 flex align-top">
    <FormButton
      :color="isActive ? 'success' : 'card'"
      size="sm"
      class="rounded-xl bg-black bg-opacity-5 text-sm font-medium outline-none mr-2"
    >
      <CheckIcon v-if="!filterData.duplicable" class="w-5 h-5" />
      <PlusIcon v-else class="w-5 h-5" />
    </FormButton>
    <div class="">
      <button class="outline-none" @click="showTags()">
        {{ filterData.name }}
      </button>
      <div v-if="tagsEnabled">
        <div
          v-for="tag in filterData.tags"
          :key="tag.name"
          class="inline-block py-1 mx-1"
        >
          <FormButton
            :color="filterData.activeTags?.includes(tag.name) ? 'success' : 'card'"
            size="sm"
            class="rounded-xl bg-black bg-opacity-5 text-sm font-medium outline-none"
          >
            <div
              :class="`h-3 w-3 m-1 ml-0 border`"
              :style="`{'background': ${tag.color}}`"
            ></div>
            {{ tag.name }}
          </FormButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// TODO: Switch here filters according to filter input type and duplicatable or not
import { CheckIcon, PlusIcon } from '@heroicons/vue/20/solid'
import { ProjectModelCardSendFilterData } from 'lib/project/model/card/filter/send'

const tagsEnabled = ref(false)

const props = defineProps<{
  projectId: string
  modelId: string
  filterData: ProjectModelCardSendFilterData
  isActive?: boolean
}>()

const showTags = () => {
  tagsEnabled.value = !tagsEnabled.value
}

console.log(props.filterData)
</script>
