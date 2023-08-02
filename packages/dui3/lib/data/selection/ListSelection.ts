import { Selection } from './Selection'

export type ListSelectionItem = {
  id: string
  name: string
  color?: string
}

export type ListSelectionItems = {
  [id: string]: ListSelectionItem | ListSelection
}

export type ListSelectionItemsKeys = keyof ListSelectionItems

export type ListSelection = {
  multipleSelection: boolean
  items: ListSelectionItems
  selectedItems: ListSelectionItemsKeys[]
} & Selection

const sendFilterData: ListSelection = {
  id: 'sendFilter',
  name: 'Send Filters',
  multipleSelection: false,
  items: {
    everything: {
      id: 'everything',
      name: 'Everything',
      color: '#FFF'
    },
    selection: {
      id: 'selection',
      name: 'Selection',
      color: '#FFF'
    },
    tags: {
      id: 'tags',
      name: 'Tags',
      multipleSelection: true,
      items: {
        tag1: {
          id: 'SOME GUID FROM HOST APP',
          name: 'Tag 1',
          color: '#FFF'
        },
        tag2: {
          id: 'SOME GUID FROM HOST APP',
          name: 'Tag 2',
          color: '#FFF'
        }
      },
      selectedItems: ['tag1', 'tag2']
    }
  },
  selectedItems: ['everything']
}

console.log(sendFilterData)
