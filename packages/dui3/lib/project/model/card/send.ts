import { ListSelection } from 'lib/data/selection/ListSelection'
import { ProjectModelCard } from 'lib/project/model/card'

export type ProjectModelCardSend = {
  filters?: ListSelection
} & ProjectModelCard
