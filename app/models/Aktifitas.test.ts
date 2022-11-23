import { AktifitasModel } from "./Aktifitas"

test("can be created", () => {
  const instance = AktifitasModel.create({})

  expect(instance).toBeTruthy()
})
