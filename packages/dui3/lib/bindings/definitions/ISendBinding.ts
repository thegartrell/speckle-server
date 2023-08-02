import { IBinding } from 'lib/bindings/definitions/IBinding'
import { FilterIdentity, FilterTagIdentity } from 'lib/project/model/card/filter/send'
import { ProjectModelCardSend } from 'lib/project/model/card/send'

export const ISendBindingKey = 'sendBinding'

export interface ISendBinding extends IBinding<ISendBindingEvents> {
  addSendCard: (sendCard: ProjectModelCardSend) => Promise<void>
  activateSendFilter: (
    filterIdentity: FilterIdentity,
    activation: boolean
  ) => Promise<void>
  activateSendFilterTag: (
    filterIdentity: FilterTagIdentity,
    activation: boolean
  ) => Promise<void>
}

export interface ISendBindingEvents {
  void: () => void
}
