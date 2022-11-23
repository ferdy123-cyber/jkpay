import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import Toast from "../components/Toast"
import Config from "../config"
import { api } from "../services/api"
import { withSetPropAction } from "./helpers/with-set-prop-action"

/**
 * Model description here for TypeScript hints.
 */
export const PembayaranModel = types
  .model("Pembayaran")
  .props({
    detailPembayaran: types.frozen<any>(null),
    produk: types.array(types.frozen<any>()),
    fetching: types.optional(types.boolean, false),
  })
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(withSetPropAction)
  .actions((store) => ({
    async getDetailPembayaran(data: { navigation: any; id: string }) {
      store.setProp("fetching", true)
      const response = await api.getDetailPembayaran(data.id)
      if (response.kind !== Config.RESP_OK) {
        store.setProp("fetching", false)
        return
      }
      if (!response.data.length) {
        Toast({
          type: "error",
          description: "Transaksi tidak ditemukan",
        })
        store.setProp("fetching", false)
        return
      }
      const response2 = await api.getCart(response.data[0].id)
      if (response2.kind !== Config.RESP_OK) {
        store.setProp("fetching", false)
        return
      }
      response.data[0].produk = response2.data
      store.setProp("detailPembayaran", response.data[0])
      data.navigation.navigate("DetailPembayaran")
      // console.log("resp", response.data[0])
      store.setProp("fetching", false)
    },

    async submitPembayaran(data: { navigation: any; id: string }) {
      store.setProp("fetching", true)
      const response = await api.submitPembayaran({
        id: data.id,
        data: { status_transaksi: "Berhasil" },
      })
      if (response.kind !== Config.RESP_OK) {
        store.setProp("fetching", false)
        return
      }
      Toast({
        type: "success",
        description: "Pembayaran Berhasil",
      })
      data.navigation.replace("Home")
      store.setProp("fetching", false)
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface Pembayaran extends Instance<typeof PembayaranModel> {}
export interface PembayaranSnapshotOut extends SnapshotOut<typeof PembayaranModel> {}
export interface PembayaranSnapshotIn extends SnapshotIn<typeof PembayaranModel> {}
export const createPembayaranDefaultModel = () => types.optional(PembayaranModel, {})
