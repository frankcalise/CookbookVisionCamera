import { ScanStoreModel } from "./ScanStore"

test("can be created", () => {
  const instance = ScanStoreModel.create({})

  expect(instance).toBeTruthy()
})
