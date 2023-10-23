import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * Model description here for TypeScript hints.
 */
export const ScanStoreModel = types
  .model("ScanStore")
  .props({
    scans: types.array(types.string),
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    addScan(scan: string) {
      self.scans.push(scan)
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface ScanStore extends Instance<typeof ScanStoreModel> {}
export interface ScanStoreSnapshotOut extends SnapshotOut<typeof ScanStoreModel> {}
export interface ScanStoreSnapshotIn extends SnapshotIn<typeof ScanStoreModel> {}
export const createScanStoreDefaultModel = () => types.optional(ScanStoreModel, {})
