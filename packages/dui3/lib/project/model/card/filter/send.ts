export type ProjectModelCardSendFilter = {
  [filterId: string]: ProjectModelCardSendFilterData
}

export type ProjectModelCardSendFilterKeys = keyof ProjectModelCardSendFilter & string

export type ProjectModelCardSendFilterData = {
  name: string
  input: 'toogle'
  duplicable: boolean
  options?: ProjectModelCardSendFilterTag
  activeOptions?: ProjectModelCardSendFilterTagKeys
}

export type ProjectModelCardSendFilterTag = {
  [optionId: string]: ProjectModelCardSendFilterTagData
}

export type ProjectModelCardSendFilterTagKeys = keyof ProjectModelCardSendFilterTag &
  string

export type ProjectModelCardSendFilterTagData = {
  id: string
  name: string
  color: string
}

export type FilterIdentity = {
  accountId: string
  projectId: string
  modelId: string
  filterId: string
}

export type FilterTagIdentity = {
  tagId: string
} & FilterIdentity
