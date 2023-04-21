import { PropertyInfo } from '@speckle/viewer'
import { difference, isString, uniq } from 'lodash-es'
import { SpeckleObject } from '~~/lib/common/helpers/sceneExplorer'
import { isNonNullable } from '~~/lib/common/helpers/utils'
import {
  useInjectedViewer,
  useInjectedViewerInterfaceState
} from '~~/lib/viewer/composables/setup'

export function useSectionBoxUtilities() {
  const { instance } = useInjectedViewer()
  const {
    sectionBox,
    filters: { selectedObjects }
  } = useInjectedViewerInterfaceState()

  const isSectionBoxEnabled = computed(() => !!sectionBox.value)
  const toggleSectionBox = () => {
    if (isSectionBoxEnabled.value) {
      sectionBox.value = null
      return
    }

    const objectIds = selectedObjects.value.map((o) => o.id).filter(isNonNullable)
    const box = instance.getSectionBoxFromObjects(objectIds)
    sectionBox.value = box
  }

  const sectionBoxOn = () => {
    if (!isSectionBoxEnabled.value) {
      toggleSectionBox()
    }
  }

  const sectionBoxOff = () => {
    sectionBox.value = null
  }

  return {
    isSectionBoxEnabled,
    toggleSectionBox,
    sectionBoxOn,
    sectionBoxOff,
    sectionBox
  }
}

export function useCameraUtilities() {
  const { instance } = useInjectedViewer()
  const {
    filters: { selectedObjects, isolatedObjectIds },
    camera
  } = useInjectedViewerInterfaceState()

  const zoom = (...args: Parameters<typeof instance.zoom>) => {
    instance.zoom(...args)
  }

  const zoomExtentsOrSelection = () => {
    const ids = selectedObjects.value.map((o) => o.id).filter(isNonNullable)

    if (ids.length > 0) {
      return zoom(ids)
    }

    if (isolatedObjectIds.value.length) {
      return zoom(isolatedObjectIds.value)
    }

    zoom()
  }

  const toggleProjection = () => {
    camera.isPerspectiveProjection.value = !camera.isPerspectiveProjection.value
  }

  const setView = (...args: Parameters<typeof instance.setView>) => {
    instance.setView(...args)
  }

  const truck = (...args: Parameters<typeof instance.cameraHandler.controls.truck>) => {
    instance.cameraHandler.controls.truck(...args)
  }

  return { zoomExtentsOrSelection, toggleProjection, camera, setView, truck, zoom }
}

export function useFilterUtilities() {
  const { filters } = useInjectedViewerInterfaceState()

  const isolateObjects = (objectIds: string[]) => {
    filters.isolatedObjectIds.value = uniq([
      ...filters.isolatedObjectIds.value,
      ...objectIds
    ])
  }

  const unIsolateObjects = (objectIds: string[]) => {
    filters.isolatedObjectIds.value = difference(
      filters.isolatedObjectIds.value,
      objectIds
    )
  }

  const hideObjects = (objectIds: string[]) => {
    filters.hiddenObjectIds.value = uniq([
      ...filters.hiddenObjectIds.value,
      ...objectIds
    ])
  }

  const showObjects = (objectIds: string[]) => {
    filters.hiddenObjectIds.value = difference(filters.hiddenObjectIds.value, objectIds)
  }

  const setPropertyFilter = (property: PropertyInfo) => {
    filters.propertyFilter.filter.value = property
    filters.propertyFilter.isApplied.value = true
  }

  const removePropertyFilter = () => {
    filters.propertyFilter.filter.value = null
    filters.propertyFilter.isApplied.value = false
  }

  const resetFilters = () => {
    filters.hiddenObjectIds.value = []
    filters.isolatedObjectIds.value = []
    filters.propertyFilter.filter.value = null
    filters.propertyFilter.isApplied.value = false
    filters.selectedObjects.value = []
  }

  return {
    isolateObjects,
    unIsolateObjects,
    hideObjects,
    showObjects,
    filters,
    setPropertyFilter,
    removePropertyFilter,
    resetFilters
  }
}

export function useSelectionUtilities() {
  const {
    filters: { selectedObjects }
  } = useInjectedViewerInterfaceState()
  const {
    metadata: { worldTree }
  } = useInjectedViewer()

  const setSelectionFromObjectIds = (objectIds: string[]) => {
    const res = worldTree.value
      ? worldTree.value.findAll((node) => {
          const t = node.model as Record<string, unknown>
          const raw = t.raw as Record<string, unknown>
          const id = raw.id as string
          if (!raw || !id) return false
          if (objectIds.includes(id)) return true
          return false
        })
      : []

    const objs = res.map(
      (node) => (node.model as Record<string, unknown>).raw as SpeckleObject
    )
    selectedObjects.value = objs
  }

  const addToSelection = (object: SpeckleObject) => {
    const idx = selectedObjects.value.findIndex((o) => o.id === object.id)
    if (idx !== -1) return

    selectedObjects.value = [...selectedObjects.value, object]
  }

  const removeFromSelection = (objectOrId: SpeckleObject | string) => {
    const oid = isString(objectOrId) ? objectOrId : objectOrId.id
    const idx = selectedObjects.value.findIndex((o) => o.id === oid)
    if (idx === -1) return

    const newObjects = selectedObjects.value.slice()
    newObjects.splice(idx, 1)
    selectedObjects.value = newObjects
  }

  const clearSelection = () => {
    selectedObjects.value = []
  }

  return {
    addToSelection,
    removeFromSelection,
    clearSelection,
    setSelectionFromObjectIds,
    objects: selectedObjects
  }
}
