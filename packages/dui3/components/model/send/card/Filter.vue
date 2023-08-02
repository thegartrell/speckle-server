<template>
  <div class="my-2 flex align-top">
    <FormButton
      :color="isActive ? 'success' : 'card'"
      size="sm"
      class="rounded-xl bg-black bg-opacity-5 text-sm font-medium outline-none mr-2"
      @click="updateSendFilterHandler()"
    >
      <CheckIcon class="w-5 h-5" />
    </FormButton>
    <div>
      <button class="outline-none" @click="showTags()">
        {{ filterData.name }}
      </button>
      <div v-if="tagsEnabled">
        <div
          v-for="item in filterData.items"
          :key="item.name"
          class="inline-block py-1 mx-1"
        >
          <FormButton
            :color="filterData.selectedItems?.includes(item.id) ? 'success' : 'card'"
            size="sm"
            class="rounded-xl bg-black bg-opacity-5 text-sm font-medium outline-none"
            @click="updateSendFilterTagHandler(item.id)"
          >
            <div :class="`h-3 w-3 m-1 ml-0 border bg-[${item.color}]`"></div>
            {{ item.name }}
          </FormButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// TODO: Switch here filters according to filter input type and duplicatable or not
import { CheckIcon } from '@heroicons/vue/20/solid'
import { ListSelectionItem, ListSelection } from 'lib/data/selection/ListSelection'
import { useModelStateStore } from '~/store/modelState'

const modelStateStore = useModelStateStore()
const { activateSendFilter, activateSendFilterTag } = modelStateStore

const tagsEnabled = ref(false)

const props = defineProps<{
  accountId: string
  projectId: string
  modelId: string
  filterId: string
  filterData: ListSelectionItem | ListSelection
  isActive?: boolean
}>()

function updateSendFilterHandler() {
  activateSendFilter(
    {
      accountId: props.accountId,
      projectId: props.projectId,
      modelId: props.modelId,
      filterId: props.filterId
    },
    !props.isActive
  )
}

function updateSendFilterTagHandler(tagId: string) {
  const listSelection = props.filterData as ListSelection
  activateSendFilterTag(
    {
      accountId: props.accountId,
      projectId: props.projectId,
      modelId: props.modelId,
      filterId: props.filterId,
      tagId
    },
    !listSelection.selectedItems?.includes(tagId)
  )
}

const showTags = () => {
  tagsEnabled.value = !tagsEnabled.value
}
</script>
