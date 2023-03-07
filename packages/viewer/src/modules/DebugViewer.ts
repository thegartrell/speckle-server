import { Assets } from './Assets'
import { WorldTree } from './tree/WorldTree'
import { Viewer } from './Viewer'

import nishita from '../assets/nishita.png'
import nishita2 from '../assets/nishita2.png'
import nishita3 from '../assets/nishita3.png'
import { AssetType, SunLightConfiguration } from '../IViewer'
import { Texture } from 'three'
import Logger from 'js-logger'

export class DebugViewer extends Viewer {
  public static lightParamsDawn: SunLightConfiguration = {
    enabled: true,
    castShadow: true,
    intensity: 5,
    color: 0xffffff,
    azimuth: 1.33,
    elevation: 1.57,
    radius: 0,
    indirectLightIntensity: 1.2,
    shadowcatcher: true
  }

  public static lightParamsNoon: SunLightConfiguration = {
    enabled: true,
    castShadow: true,
    intensity: 8,
    color: 0xffffff,
    azimuth: -0.17,
    elevation: 1.74,
    radius: 0,
    indirectLightIntensity: 1.2,
    shadowcatcher: true
  }

  public static lightParamsDusk: SunLightConfiguration = {
    enabled: true,
    castShadow: true,
    intensity: 5,
    color: 0xffffff,
    azimuth: -1.33,
    elevation: 1.54,
    radius: 0,
    indirectLightIntensity: 1.2,
    shadowcatcher: true
  }

  public getRenderer() {
    return this.speckleRenderer
  }

  public requestRenderShadowmap() {
    this.getRenderer().updateDirectLights()
  }

  public getWorldTree() {
    return WorldTree.getInstance()
  }

  public setTimeOfDay(timeOfDay: string) {
    switch (timeOfDay) {
      case 'NONE':
        break
      case 'DAWN':
        Assets.getEnvironment({ src: nishita, type: AssetType.TEXTURE_HDR })
          .then((value: Texture) => {
            this.speckleRenderer.indirectIBL = value
            this.setLightConfiguration(DebugViewer.lightParamsDawn)
          })
          .catch((reason) => {
            Logger.error(reason)
            Logger.error('Fallback to null environment!')
          })
        return DebugViewer.lightParamsDawn
      case 'NOON':
        Assets.getEnvironment({ src: nishita2, type: AssetType.TEXTURE_HDR })
          .then((value: Texture) => {
            this.speckleRenderer.indirectIBL = value
            this.setLightConfiguration(DebugViewer.lightParamsNoon)
          })
          .catch((reason) => {
            Logger.error(reason)
            Logger.error('Fallback to null environment!')
          })
        return DebugViewer.lightParamsNoon
      case 'DUSK':
        Assets.getEnvironment({ src: nishita3, type: AssetType.TEXTURE_HDR })
          .then((value: Texture) => {
            this.speckleRenderer.indirectIBL = value
            this.setLightConfiguration(DebugViewer.lightParamsDusk)
          })
          .catch((reason) => {
            Logger.error(reason)
            Logger.error('Fallback to null environment!')
          })
        return DebugViewer.lightParamsDusk
      default:
        break
    }
  }
}
