/* eslint-disable @typescript-eslint/require-await */

import { IBinding } from '~~/lib/bindings/definitions/IBinding'

/**
 * The name under which this binding will be registered.
 */
export const IConnectorConfigBindingKey = 'connectorConfigBinding'

/**
 * Connector config binding interface.
 */
export interface IConnectorConfigBinding
  extends IBinding<IConnectorConfigBindingEvents> {
  getUserConfig: () => Promise<ConnectorConfig[]>
  getModelConfig: () => Promise<ConnectorConfig[]>
  updateUserConfig: (newValue: ConnectorConfig[]) => Promise<void>
}

export interface IConnectorConfigBindingEvents {
  void: () => void
}

export type ConnectorConfig = {
  key: string
  title: string
  type: 'text' | 'dropdown' | 'toggle'
  config: TextFieldConfig | DropdownConfig | ToggleConfig
}

export type TextFieldConfig = {
  value: string
}

export type DropdownConfig = {
  value: string
  items: string[]
}

export type ToggleConfig = {
  value: boolean
}
