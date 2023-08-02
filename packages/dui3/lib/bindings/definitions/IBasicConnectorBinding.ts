/* eslint-disable @typescript-eslint/require-await */

import { BaseBridge } from '~~/lib/bridge/base'
import { IBinding } from '~~/lib/bindings/definitions/IBinding'
import { Account } from 'lib/accounts/Account'
import { DocumentInfo } from 'lib/data/document/DocumentInfo'
import {
  ProjectModelCardSendFilter,
  ProjectModelCardSendFilterData
} from 'lib/project/model/card/filter/send'
import { ModelState } from 'lib/project/model/state'
import { ListSelection, ListSelectionItems } from 'lib/data/selection/ListSelection'

export const IBasicConnectorBindingKey = 'baseBinding'

// Needs to be agreed between Frontend and Core
export interface IBasicConnectorBinding
  extends IBinding<IBasicConnectorBindingHostEvents> {
  getAccounts: () => Promise<Account[]>
  getSourceApplicationName: () => Promise<string>
  getSourceApplicationVersion: () => Promise<string>
  getDocumentInfo: () => Promise<DocumentInfo>
  getSendFilter: () => Promise<ListSelection>
  updateSendFilter: (
    accountId: string,
    projectId: string,
    modelId: string,
    filterId: string,
    newValue: ListSelection
  ) => Promise<void>
  getModelState: () => Promise<ModelState>
}

export interface IBasicConnectorBindingHostEvents {
  displayToastNotification: (args: ToastInfo) => void
  documentChanged: () => void
}

// NOTE: just a reminder for now
export type ToastInfo = {
  text: string
  details?: string
  type: 'info' | 'error' | 'warning'
}

export class MockedBaseBinding extends BaseBridge {
  constructor() {
    super()
  }

  public async getAccounts() {
    return []
  }

  public async getSourceApplicationName() {
    return 'Mocks'
  }

  public async getSourceApplicationVersion() {
    return Math.random().toString()
  }

  public async getDocumentInfo() {
    return {
      name: 'Mocked File',
      location: 'www',
      id: Math.random().toString()
    }
  }

  public async getSendFilter() {
    return {}
  }

  public async showDevTools() {
    console.log('Mocked bindings cannot do this')
  }
}
