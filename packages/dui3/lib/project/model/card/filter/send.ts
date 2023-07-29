export type ProjectModelCardSendFilter = {
  [filterId: string]: ProjectModelCardSendFilterData
}

export type ProjectModelCardSendFilterKeys = keyof ProjectModelCardSendFilter & string

export type ProjectModelCardSendFilterData = {
  name: string
  input: 'toogle'
  duplicable: boolean
  tags?: ProjectModelCardSendFilterTag
  activeTags?: ProjectModelCardSendFilterTagKeys
}

export type ProjectModelCardSendFilterTag = {
  [tagId: string]: ProjectModelCardSendFilterTagData
}

export type ProjectModelCardSendFilterTagKeys = keyof ProjectModelCardSendFilterTag &
  string

export type ProjectModelCardSendFilterTagData = {
  name: string
  color: string
}
