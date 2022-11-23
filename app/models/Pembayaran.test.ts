import { PembayaranModel } from "./Pembayaran"

test("can be created", () => {
  const instance = PembayaranModel.create({})

  expect(instance).toBeTruthy()
})
