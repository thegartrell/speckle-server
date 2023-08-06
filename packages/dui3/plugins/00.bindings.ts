import { IRawBridge } from '~/lib/bridge/definitions'

import { GenericBridge } from '~/lib/bridge/generic'
import { SketchupBridge } from '~/lib/bridge/sketchup'

import {
  IAccountBinding,
  IAccountBindingKey
} from '~/lib/bindings/definitions/IAccountBinding'

import {
  ITestBinding,
  ITestBindingKey,
  MockedTestBinding
} from '~/lib/bindings/definitions/ITestBinding'

import {
  IConfigBinding,
  IConfigBindingKey,
  MockedConfigBinding
} from '~/lib/bindings/definitions/IConfigBinding'

import {
  IBasicConnectorBinding,
  IBasicConnectorBindingKey,
  MockedBaseBinding
} from '~/lib/bindings/definitions/IBasicConnectorBinding'

import { ISendBindingKey, ISendBinding } from '~/lib/bindings/definitions/ISendBinding'

import {
  ISelectionBindingKey,
  ISelectionBinding
} from '~/lib/bindings/definitions/ISelectionBinding'

// Makes TS happy
declare let globalThis: Record<string, unknown> & {
  CefSharp?: { BindObjectAsync: (name: string) => Promise<void> }
  chrome?: { webview: { hostObjects: Record<string, IRawBridge> } }
  sketchup?: Record<string, unknown>
}

/**
 * Here we are loading any bindings that we expect to have from all
 * connectors. If some are not present, that's okay - we're going to
 * strip or customize functionality from the ui itself.
 */
export default defineNuxtPlugin(async () => {
  // Registers a set of non existent bindings as a test.
  const nonExistantBindings = await tryHoistBinding('nonExistantBindings')

  // Registers some default test bindings.
  const testBindings =
    (await tryHoistBinding<ITestBinding>(ITestBindingKey)) || new MockedTestBinding()

  // Actual bindings follow below.

  const configBinding =
    (await tryHoistBinding<IConfigBinding>(IConfigBindingKey)) ||
    new MockedConfigBinding()

  const accountBinding = await tryHoistBinding<IAccountBinding>(IAccountBindingKey)

  const baseBinding =
    (await tryHoistBinding<IBasicConnectorBinding>(IBasicConnectorBindingKey)) ||
    new MockedBaseBinding()

  const sendBinding = await tryHoistBinding<ISendBinding>(ISendBindingKey)

  const selectionBinding = await tryHoistBinding<ISelectionBinding>(
    ISelectionBindingKey
  )

  // Any binding implments these two methods below, we just choose one to
  // expose globally to the app.
  const showDevTools = () => {
    configBinding.showDevTools()
  }

  const openUrl = (url: string) => {
    configBinding.openUrl(url)
  }

  return {
    provide: {
      nonExistantBindings,
      testBindings,
      configBinding,
      accountBinding,
      baseBinding,
      sendBinding,
      selectionBinding,
      showDevTools,
      openUrl
    }
  }
})

/**
 * Checks possible browser window targets for a given binding, and, if it finds it,
 * creates a bridge for it and registers it in the global scope.
 * @param name binding name
 * @returns null if the binding was not found, or the binding.
 */
const tryHoistBinding = async <T>(name: string) => {
  let bridge: GenericBridge | SketchupBridge | null = null
  let tempBridge: GenericBridge | SketchupBridge | null = null

  if (globalThis.CefSharp) {
    await globalThis.CefSharp.BindObjectAsync(name)
    tempBridge = new GenericBridge(globalThis[name] as unknown as IRawBridge)
  }

  if (globalThis.chrome && globalThis.chrome.webview && !tempBridge) {
    tempBridge = new GenericBridge(globalThis.chrome.webview.hostObjects[name])
  }

  if (globalThis.sketchup && !tempBridge) {
    tempBridge = new SketchupBridge(name)
  }

  const res = await tempBridge?.create()
  if (res) bridge = tempBridge

  if (!bridge) console.warn(`Failed to bind ${name} binding.`)

  globalThis[name] = bridge
  return bridge as unknown as T
}
