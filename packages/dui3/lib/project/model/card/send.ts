import { ProjectModelCard } from 'lib/project/model/card'
import {
  ProjectModelCardSendFilter,
  ProjectModelCardSendFilterKeys
} from 'lib/project/model/card/filter/send'

export type ProjectModelCardSend = {
  filters?: ProjectModelCardSendFilter
  activeFilters?: ProjectModelCardSendFilterKeys[]
} & ProjectModelCard
