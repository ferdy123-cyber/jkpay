import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { Image } from "react-native-compressor"
import Toast from "../components/Toast"
import { api } from "../services/api"
import { withSetPropAction } from "./helpers/with-set-prop-action"
import _ from "lodash"
import Config from "../config"

/**
 * Model description here for TypeScript hints.
 */

export const AktifitasModel = types
  .model("Aktifitas")
  .props({
    nomorSequence: types.optional(types.string, ""),
    fetching: types.optional(types.boolean, false),
    jenisBibit: types.array(types.frozen<any>()),
    jenisBibitKolam: types.array(types.frozen<any>()),
    metodeFlokSusulan: types.array(types.frozen<any>()),
    successModal: types.optional(types.boolean, false),
    warningModal: types.optional(types.boolean, false),
    warningMessage: types.optional(types.string, ""),
    bioflok: types.frozen<any>(),
    karantina: types.frozen<any>(),
    kolamKarantina: types.array(types.frozen<any>()),
    listKarantina: types.array(types.frozen<any>()),
    statusKolam: types.optional(types.string, ""),
    detailKolam: types.frozen<any>(),
    jenisKematian: types.array(types.frozen<any>()),
    listKolamByFarm: types.array(types.frozen<any>()),
    dataDowntime: types.array(types.frozen<any>()),
    dataCuaca: types.array(types.frozen<any>()),
    farm: types.array(types.frozen<any>()),
  })
  .views((self) => ({}))
  .actions(withSetPropAction)
  .actions((store) => ({
    async cekBarcode(data: CekBarcode) {
      store.setProp("nomorSequence", "")
      store.setProp("fetching", true)
      const cekKolamRes = await api.availableKolam(data.mkolamId)
      if (cekKolamRes.kind !== Config.RESP_OK) {
        store.setProp("fetching", false)
        // data.navigation.goBack()
        data.navigation.navigate("Aktifitas")
        return
      }
      if (cekKolamRes.data === null) {
        Toast({
          type: "error",
          description: "Kolam tidak ditemukan",
        })
        store.setProp("fetching", false)
        data.navigation.navigate("Aktifitas")
        return
      }
      if (data.type) {
        if (data.type === "bioflok") {
          const validasiKolam = await api.bioflokValidasiKolam(data.mkolamId)
          const validasiAirKolam = await api.bioflokValidasiAirKolam(data.mkolamId)
          // console.log(validasiAirKolam)
          if (validasiAirKolam.kind !== Config.RESP_OK || validasiKolam.kind !== Config.RESP_OK) {
            store.setProp("fetching", false)
            data.navigation.navigate("Aktifitas")
            return
          }
        }
        if (data.type === "karantina") {
          const validasiKolam = await api.karantinaValidasiKolam(data.mkolamId)
          if (validasiKolam.kind !== Config.RESP_OK) {
            store.setProp("fetching", false)
            data.navigation.navigate("Aktifitas")
            return
          }
        }
        const generateNomorRes = await api.generateNomor({ url: data.type, farmId: data.mFarmId })
        if (generateNomorRes.kind !== Config.RESP_OK) {
          store.setProp("nomorSequence", "")
          store.setProp("fetching", false)
          return
        }
        store.setProp("nomorSequence", generateNomorRes.data)
      }
      // console.log("cek kolam", cekKolamRes.data)
      store.setProp("fetching", false)
    },

    async getJenisBibit() {
      store.setProp("fetching", true)
      const response = await api.getJenisBibit()
      if (response.kind !== Config.RESP_OK) {
        store.setProp("fetching", false)
        return
      }
      store.setProp("jenisBibit", response.data)
      store.setProp("fetching", false)
    },

    async getMetodeFlokSusulan(data: string) {
      store.setProp("fetching", true)
      const response = await api.getMetodeFlokSusulan(data)
      if (response.kind !== Config.RESP_OK) {
        store.setProp("fetching", false)
        return
      }
      store.setProp("metodeFlokSusulan", response.data)
      store.setProp("fetching", false)
    },

    async submitKarantina(data: SubmitKarantina) {
      store.setProp("fetching", true)
      if (
        data.mfarmId === "" ||
        data.jumlahBibit === "" ||
        data.satuan === "" ||
        data.tanggalAkhir === "" ||
        data.tanggalMulai === "" ||
        data.ukuranBibit === "" ||
        data.nomorKarantina === "" ||
        data.mjenisBibitId === ""
      ) {
        Toast({
          type: "error",
          description: "Data Karantina tidak lengkap",
        })
        store.setProp("fetching", false)
        return
      }
      const submitKarantinaRes = await api.submitKarantina([data])
      if (submitKarantinaRes.kind !== Config.RESP_OK) {
        store.setProp("fetching", false)
        store.setProp("successModal", false)
        return
      }
      // console.log(submitKarantinaRes.data)
      store.setProp("successModal", true)
      store.setProp("fetching", false)
    },
    async submitStartFlok(data: dataSubmitStartFlok) {
      try {
        if (
          data.tanggalMulai === "" ||
          data.tanggalBerakhir === "" ||
          data.targetPanen === "" ||
          data.metodeFlokSusulanId === "" ||
          data.jadwalFlokSusulan === "" ||
          data.nomorBioflok === ""
        ) {
          Toast({
            type: "error",
            description: "Data Bioflok tidak lengkap",
          })
          return
        }
        store.setProp("fetching", true)
        const submitStartFlok = await api.submitStartFlok([data])
        if (submitStartFlok.kind === Config.RESP_OK) {
          if (data.imageFile === null || data.imagePath === "") {
            store.setProp("successModal", true)
            store.setProp("fetching", false)
            return
          }
          const result = await Image.compress(`file://${data.imageFile.path}`, {
            compressionMethod: "auto",
          })
          const objImage: any = {
            uri: result,
            type: "image/jpeg",
            name: data.nomorBioflok + ".png",
          }
          const form = new FormData()
          form.append("file", objImage)
          form.append("filepath", data.imagePath)
          const uploadRes = await api.uploadFile(form)
          if (uploadRes.kind !== Config.RESP_OK) {
            store.setProp("fetching", false)
            return
          }
          store.setProp("successModal", true)
          store.setProp("fetching", false)
        } else {
          store.setProp("fetching", false)
        }
      } catch (err) {
        store.setProp("fetching", false)
        Toast({
          type: "error",
          description: "Terjadi masalah saat mengirim data",
        })
        console.log(err)
      }
    },
    changeSuccessModal(data: boolean) {
      store.setProp("successModal", data)
    },
    changeWarningModal(data: boolean) {
      store.setProp("warningModal", data)
    },
    resetDetailKolam() {
      store.setProp("detailKolam", undefined)
    },
    async cekBioflokStatus(data: { id: string; navigation: any }) {
      store.setProp("fetching", true)
      const response = await api.getBioflokStatus(data.id)
      if (response.kind === Config.RESP_OK) {
        if (response.data.length === 0) {
          Toast({
            type: "error",
            description: "Status kolam harus bioflok aktif",
          })
          store.setProp("fetching", false)
          data.navigation.navigate("Aktifitas")
          return
        }
        store.setProp("bioflok", response.data[0])
        store.setProp("fetching", false)
      } else {
        store.setProp("fetching", false)
        data.navigation.navigate("Aktifitas")
      }
    },
    async getKolamKarantina(id: string) {
      store.setProp("fetching", true)
      const response = await api.getKolamKarantina(id)
      // console.log(response)
      if (response.kind === Config.RESP_OK) {
        store.setProp("kolamKarantina", response.data)
        store.setProp("fetching", false)
      } else {
        store.setProp("fetching", false)
      }
    },
    async getListKolamByFarm(id: string) {
      store.setProp("fetching", true)
      const response = await api.getListKolamByFarm(id)
      if (response.kind === Config.RESP_OK) {
        store.setProp("listKolamByFarm", _.sortBy(response.data, "nama"))
        store.setProp("fetching", false)
      } else {
        store.setProp("listKolamByFarm", [])
        store.setProp("fetching", false)
      }
    },
    async getNomorKarantina(id: string) {
      store.setProp("fetching", true)
      const response = await api.getNomorKarantina(id)
      if (response.kind === Config.RESP_OK) {
        store.setProp("listKarantina", response.data)
        store.setProp("fetching", false)
      } else {
        store.setProp("fetching", false)
      }
    },

    async cekKarantinaStatus(data: { id: string; navigation: any }) {
      store.setProp("fetching", true)
      const response = await api.getNomorKarantina(data.id)
      if (response.kind === Config.RESP_OK) {
        // console.log(response)
        if (response.data.length === 0) {
          Toast({
            type: "error",
            description: "Status kolam harus karantina aktif",
          })
          store.setProp("fetching", false)
          data.navigation.navigate("Aktifitas")
          return
        }
        store.setProp("listKarantina", response.data)
        store.setProp("fetching", false)
      } else {
        store.setProp("fetching", false)
      }
    },
    async getDetailKolam(id: string) {
      store.setProp("fetching", true)
      const response = await api.getDetailKolam(id)
      if (response.kind === Config.RESP_OK) {
        store.setProp("detailKolam", response.data)
        store.setProp("fetching", false)
      } else {
        store.setProp("fetching", false)
      }
    },
    async getJenisBibitKolam(id: string) {
      store.setProp("fetching", true)
      const response = await api.getJenisBibitKolam(id)
      if (response.kind === Config.RESP_OK) {
        // console.log(response.data)
        store.setProp("jenisBibitKolam", response.data)
        store.setProp("fetching", false)
      } else {
        store.setProp("jenisBibitKolam", [])
        store.setProp("fetching", false)
      }
    },
    async getJenisKematian() {
      store.setProp("fetching", true)
      const response = await api.allJenisKematian()
      if (response.kind === Config.RESP_OK) {
        console.log(response.data)
        store.setProp("jenisKematian", response.data)
        store.setProp("fetching", false)
      } else {
        store.setProp("jenisKematian", [])
        store.setProp("fetching", false)
      }
    },
    async submitTebarBenih(data: dataSubmitTebarBenih) {
      if (
        data.bioflokId === "" ||
        data.jumlahBenih === "" ||
        data.karantinaId === "" ||
        data.mjenisBibitId === "" ||
        data.rataRataBeratBenih === "" ||
        data.tanggal === ""
      ) {
        Toast({
          type: "error",
          description: "Data tebar benih tidak lengkap",
        })
        return
      }
      store.setProp("fetching", true)
      const response = await api.submitTebarBenih([data])
      if (response.kind === Config.RESP_OK) {
        store.setProp("successModal", true)
        store.setProp("fetching", false)
      } else {
        store.setProp("fetching", false)
        store.setProp("successModal", false)
      }
    },
    async submitPemberianPakan(data: dataPemberianPakan) {
      if (
        (data.bioflokId === null && data.karantinaId === null) ||
        data.kodeWaktu === "" ||
        data.ukuranPakan === "" ||
        data.waktuPemberianPakan === "" ||
        data.beratPakan === ""
      ) {
        Toast({
          type: "error",
          description: "Data pemberian pakan tidak lengkap",
        })
        return
      }
      store.setProp("fetching", true)
      const response = await api.submitPemberianPakan([data])
      if (response.kind === Config.RESP_OK) {
        store.setProp("successModal", true)
        store.setProp("fetching", false)
      } else {
        store.setProp("fetching", false)
        store.setProp("successModal", false)
      }
    },
    async submitUkurPh(data: dataUkurPh) {
      if (
        (data.bioflokId === null && data.karantinaId === null) ||
        data.tanggal === "" ||
        data.jumlahPh === ""
      ) {
        Toast({
          type: "error",
          description: "Data ukur kadar ph tidak lengkap",
        })
        return
      }
      store.setProp("fetching", true)
      const response = await api.submitUkurPh([data])
      if (response.kind === Config.RESP_OK) {
        store.setProp("successModal", true)
        store.setProp("fetching", false)
      } else {
        store.setProp("fetching", false)
        store.setProp("successModal", false)
      }
    },
    async submitUkurNitrit(data: dataUkurNitrit) {
      if (
        (data.bioflokId === null && data.karantinaId === null) ||
        data.tanggal === "" ||
        data.jumlahNitrit === ""
      ) {
        Toast({
          type: "error",
          description: "Data ukur kadar nitrit tidak lengkap",
        })
        return
      }
      store.setProp("fetching", true)
      const response = await api.submitUkurNitrit([data])
      if (response.kind === Config.RESP_OK) {
        store.setProp("successModal", true)
        store.setProp("fetching", false)
      } else {
        store.setProp("fetching", false)
        store.setProp("successModal", false)
      }
    },
    async cekStatusKolam(data: { id: string; navigation: any }) {
      store.setProp("fetching", true)
      const response = await api.getDetailKolam(data.id)
      if (response.kind === Config.RESP_OK) {
        if (response.data === null) {
          Toast({
            type: "error",
            description: "Status kolam tidak diketahui",
          })
          store.setProp("fetching", false)
          data.navigation.navigate("Aktifitas")
          return
        }
        store.setProp("statusKolam", response.data.kodeStatus)
        if (response.data.kodeStatus === "BIOFLOK") {
          this.cekBioflokStatus({ id: data.id, navigation: data.navigation })
        } else if (response.data.kodeStatus === "KARANTINA") {
          this.getNomorKarantina(data.id)
        } else {
          Toast({
            type: "error",
            description: "Status kolam harus bioflok aktif atau karantina",
          })
          store.setProp("fetching", false)
          data.navigation.navigate("Aktifitas")
        }
        store.setProp("fetching", false)
      } else {
        store.setProp("fetching", false)
      }
    },
    async submitUkurNitrat(data: dataUkurNitrat) {
      if (
        (data.bioflokId === null && data.karantinaId === null) ||
        data.tanggal === "" ||
        data.jumlahNitrat === ""
      ) {
        Toast({
          type: "error",
          description: "Data ukur kadar nitrat tidak lengkap",
        })
        return
      }
      store.setProp("fetching", true)
      const response = await api.submitUkurNitrat([data])
      if (response.kind === Config.RESP_OK) {
        store.setProp("successModal", true)
        store.setProp("fetching", false)
      } else {
        store.setProp("fetching", false)
        store.setProp("successModal", false)
      }
    },
    async submitUkurDo(data: dataUkurDo) {
      if (
        (data.bioflokId === null && data.karantinaId === null) ||
        data.tanggal === "" ||
        data.jumlahDo === ""
      ) {
        Toast({
          type: "error",
          description: "Data ukur kadar do tidak lengkap",
        })
        return
      }
      store.setProp("fetching", true)
      const response = await api.submitUkurDo([data])
      if (response.kind === Config.RESP_OK) {
        store.setProp("successModal", true)
        store.setProp("fetching", false)
      } else {
        store.setProp("fetching", false)
        store.setProp("successModal", false)
      }
    },
    async submitUkurAmoniak(data: dataUkurAmoniak) {
      if (
        (data.bioflokId === null && data.karantinaId === null) ||
        data.tanggal === "" ||
        data.jumlahAmoniak === ""
      ) {
        Toast({
          type: "error",
          description: "Data ukur kadar amoniak tidak lengkap",
        })
        return
      }
      store.setProp("fetching", true)
      const response = await api.submitUkurAmoniak([data])
      if (response.kind === Config.RESP_OK) {
        store.setProp("successModal", true)
        store.setProp("fetching", false)
      } else {
        store.setProp("fetching", false)
        store.setProp("successModal", false)
      }
    },
    async submitPengisianAir(data: dataPengisianAir) {
      try {
        if (data.tanggal === "" || data.jumlahDebitPengisian === "") {
          Toast({
            type: "error",
            description: "Data Pengisian Air Kolam tidak lengkap",
          })
          return
        }
        store.setProp("fetching", true)
        const submitStartFlok = await api.submitPengisianAir([data])
        if (submitStartFlok.kind === Config.RESP_OK) {
          if (data.imageFile === null || data.imagePath === "") {
            store.setProp("successModal", true)
            store.setProp("fetching", false)
            return
          }
          const result = await Image.compress(`file://${data.imageFile.path}`, {
            compressionMethod: "auto",
          })
          const objImage: any = {
            uri: result,
            type: "image/jpeg",
            name: data.imageName,
          }
          const form = new FormData()
          form.append("file", objImage)
          form.append("filepath", data.imagePath)
          const uploadRes = await api.uploadFile(form)
          if (uploadRes.kind !== Config.RESP_OK) {
            store.setProp("fetching", false)
            return
          }
          store.setProp("successModal", true)
          store.setProp("fetching", false)
        } else {
          store.setProp("fetching", false)
        }
      } catch (err) {
        store.setProp("fetching", false)
        Toast({
          type: "error",
          description: "Terjadi masalah saat mengirim data",
        })
        console.log(err)
      }
    },
    async submitUkurFlok(data: dataUkurFlok) {
      if (
        (data.bioflokId === null && data.karantinaId === null) ||
        data.tanggal === "" ||
        data.jumlahFlok === ""
      ) {
        Toast({
          type: "error",
          description: "Data ukur kadar flok tidak lengkap",
        })
        return
      }
      store.setProp("fetching", true)
      const response = await api.submitUkurFlok([data])
      if (response.kind === Config.RESP_OK) {
        store.setProp("successModal", true)
        store.setProp("fetching", false)
      } else {
        store.setProp("fetching", false)
        store.setProp("successModal", false)
      }
    },
    async submitTambahFlokSusulan(data: dataTambahFlokSusulan) {
      if (data.bioflokId === "" || data.tanggal === "" || data.jumlahFlok === "") {
        Toast({
          type: "error",
          description: "Data flok susulan tidak lengkap",
        })
        return
      }
      store.setProp("fetching", true)
      const response = await api.submitTambahFlokSusulan([data])
      if (response.kind === Config.RESP_OK) {
        store.setProp("successModal", true)
        store.setProp("fetching", false)
      } else {
        store.setProp("fetching", false)
        store.setProp("successModal", false)
      }
    },
    async submitLaporPanen(data: dataSubmitLaporPanen) {
      try {
        if (
          data.nomorDokumen === "" ||
          data.bioflokId === "" ||
          data.mjenisBibitId === "" ||
          data.totalPanen === "" ||
          data.jumlahEkor === "" ||
          data.tanggal === ""
        ) {
          Toast({
            type: "error",
            description: "Data Laporan Panen tidak lengkap",
          })
          return
        }
        store.setProp("fetching", true)
        const submitLaporPanen = await api.submitLaporPanen([data])
        // console.log(submitLaporPanen)
        if (submitLaporPanen.kind === Config.RESP_OK) {
          if (data.imageFile === null || data.imagePath === "") {
            store.setProp("successModal", true)
            store.setProp("fetching", false)
            return
          }
          const result = await Image.compress(`file://${data.imageFile.path}`, {
            compressionMethod: "auto",
          })
          const objImage: any = {
            uri: result,
            type: "image/jpeg",
            name: data.imageName,
          }
          const form = new FormData()
          form.append("file", objImage)
          form.append("filepath", data.imagePath)
          const uploadRes = await api.uploadFile(form)
          if (uploadRes.kind !== Config.RESP_OK) {
            store.setProp("fetching", false)
            return
          }
          store.setProp("successModal", true)
          store.setProp("fetching", false)
        } else {
          if (submitLaporPanen.data === "warning") {
            store.setProp("warningModal", true)
            store.setProp("warningMessage", submitLaporPanen.kind)
          }
          store.setProp("fetching", false)
        }
      } catch (err) {
        store.setProp("fetching", false)
        Toast({
          type: "error",
          description: "Terjadi masalah saat mengirim data",
        })
        console.log(err)
      }
    },
    async submitLaporKematian(data: dataSubmitLaporKematian) {
      try {
        if (
          data.bioflokId === "" ||
          data.mjenisBibitId === "" ||
          data.tanggal === "" ||
          data.mjenisKematianId === "" ||
          data.jumlahKematian === ""
        ) {
          Toast({
            type: "error",
            description: "Data Laporan Kematian tidak lengkap",
          })
          return
        }
        store.setProp("fetching", true)
        const submitLaporKematian = await api.submitLaporKematian([data])
        // console.log(submitLaporPanen.kind)
        if (submitLaporKematian.kind === Config.RESP_OK) {
          if (data.imageFile === null || data.imagePath === "") {
            store.setProp("successModal", true)
            store.setProp("fetching", false)
            return
          }
          const result = await Image.compress(`file://${data.imageFile.path}`, {
            compressionMethod: "auto",
          })
          const objImage: any = {
            uri: result,
            type: "image/jpeg",
            name: data.imageName,
          }
          const form = new FormData()
          form.append("file", objImage)
          form.append("filepath", data.imagePath)
          const uploadRes = await api.uploadFile(form)
          if (uploadRes.kind !== Config.RESP_OK) {
            store.setProp("fetching", false)
            return
          }
          store.setProp("successModal", true)
          store.setProp("fetching", false)
        } else {
          store.setProp("fetching", false)
        }
      } catch (err) {
        store.setProp("fetching", false)
        Toast({
          type: "error",
          description: "Terjadi masalah saat mengirim data",
        })
        console.log(err)
      }
    },
    async submitPemindahanBibit(data: dataSubmitPemindahanBibit) {
      try {
        if (
          !data.dariKolamId ||
          data.dariKolamId === "" ||
          data.keKolamId === "" ||
          data.mjenisBibitId === "" ||
          data.tanggal === "" ||
          data.jumlahBibit === ""
        ) {
          Toast({
            type: "error",
            description: "Data Pemindahan Bibit tidak lengkap",
          })
          return
        }
        store.setProp("fetching", true)
        const submitPemindahanBibit = await api.submitPemindahanBibit([data])
        // console.log(submitLaporPanen.kind)
        if (submitPemindahanBibit.kind === Config.RESP_OK) {
          if (data.imageFile === null || data.imagePath === "") {
            store.setProp("successModal", true)
            store.setProp("fetching", false)
            return
          }
          const result = await Image.compress(`file://${data.imageFile.path}`, {
            compressionMethod: "auto",
          })
          const objImage: any = {
            uri: result,
            type: "image/jpeg",
            name: data.imageName,
          }
          const form = new FormData()
          form.append("file", objImage)
          form.append("filepath", data.imagePath)
          const uploadRes = await api.uploadFile(form)
          if (uploadRes.kind !== Config.RESP_OK) {
            store.setProp("fetching", false)
            return
          }
          store.setProp("successModal", true)
          store.setProp("fetching", false)
        } else {
          store.setProp("fetching", false)
        }
      } catch (err) {
        store.setProp("fetching", false)
        Toast({
          type: "error",
          description: "Terjadi masalah saat mengirim data",
        })
        console.log(err)
      }
    },
    async submitKurasKolam(data: dataKurasKolam) {
      try {
        if (
          !data.mkolamId ||
          data.mkolamId === null ||
          data.tanggal === "" ||
          data.jenisKuras === "" ||
          data.jumlahDebitYangDikuras === "" ||
          data.sisaDebitAir === ""
        ) {
          Toast({
            type: "error",
            description: "Data Pemindahan Bibit tidak lengkap",
          })
          return
        }
        store.setProp("fetching", true)
        const submitKurasKolam = await api.submitKurasKolam([data])
        // console.log(submitLaporPanen.kind)
        if (submitKurasKolam.kind === Config.RESP_OK) {
          if (data.imageFile === null || data.imagePath === "") {
            store.setProp("successModal", true)
            store.setProp("fetching", false)
            return
          }
          const result = await Image.compress(`file://${data.imageFile.path}`, {
            compressionMethod: "auto",
          })
          const objImage: any = {
            uri: result,
            type: "image/jpeg",
            name: data.imageName,
          }
          const form = new FormData()
          form.append("file", objImage)
          form.append("filepath", data.imagePath)
          const uploadRes = await api.uploadFile(form)
          if (uploadRes.kind !== Config.RESP_OK) {
            store.setProp("fetching", false)
            return
          }
          store.setProp("successModal", true)
          store.setProp("fetching", false)
        } else {
          store.setProp("fetching", false)
        }
      } catch (err) {
        store.setProp("fetching", false)
        Toast({
          type: "error",
          description: "Terjadi masalah saat mengirim data",
        })
        console.log(err)
      }
    },
    async submitKematianKarantina(data: dataKematianKarantina) {
      if (
        data.karantinaId === "" ||
        data.tanggal === "" ||
        data.mjenisBibitId === "" ||
        data.mjenisKematianId === "" ||
        data.jumlahKematian === ""
      ) {
        Toast({
          type: "error",
          description: "Data kematian karantina tidak lengkap",
        })
        return
      }
      store.setProp("fetching", true)
      const response = await api.submitKematianKarantina([data])
      if (response.kind === Config.RESP_OK) {
        store.setProp("successModal", true)
        store.setProp("fetching", false)
      } else {
        store.setProp("fetching", false)
        store.setProp("successModal", false)
      }
    },
    async submitLaporanBobot(data: dataLaporanBobot) {
      if (
        data.bioflokId === "" ||
        data.tanggal === "" ||
        data.jumlahBeratRataRata === "" ||
        data.jumlahSample === ""
      ) {
        Toast({
          type: "error",
          description: "Data laporan berat tidak lengkap",
        })
        return
      }
      store.setProp("fetching", true)
      const response = await api.submitLaporanBobot([data])
      if (response.kind === Config.RESP_OK) {
        store.setProp("successModal", true)
        store.setProp("fetching", false)
      } else {
        store.setProp("fetching", false)
        store.setProp("successModal", false)
      }
    },
    async getDataDowntime(data: dataPagination) {
      store.setProp("fetching", true)
      const response = await api.getDataDowntime(data)
      if (response.kind === Config.RESP_OK) {
        // console.log(response.data)
        store.setProp("dataDowntime", response.data)
        store.setProp("fetching", false)
      } else {
        store.setProp("dataDowntime", [])
        store.setProp("fetching", false)
      }
    },
    async submitLaporanDowntime(data: dataSubmitLaporanDowntime) {
      if (
        data.mfarmId === "" ||
        data.mdowntimeId === "" ||
        data.tanggal === "" ||
        data.jumlahMenit === "" ||
        !data.mkolamId
      ) {
        Toast({
          type: "error",
          description: "Data laporan downtime tidak lengkap",
        })
        return
      }
      store.setProp("fetching", true)
      const response = await api.submitLaporanDowntime([data])
      if (response.kind === Config.RESP_OK) {
        store.setProp("successModal", true)
        store.setProp("fetching", false)
      } else {
        store.setProp("fetching", false)
        store.setProp("successModal", false)
      }
    },
    async getDataCuaca(data: dataPagination) {
      store.setProp("fetching", true)
      const response = await api.getDataCuaca(data)
      if (response.kind === Config.RESP_OK) {
        // console.log(response.data)
        store.setProp("dataCuaca", response.data)
        store.setProp("fetching", false)
      } else {
        store.setProp("dataCuaca", [])
        store.setProp("fetching", false)
      }
    },
    async submitLaporanCuaca(data: dataSubmitLaporanCuaca) {
      if (data.mcuacaId === "" || data.tanggal === "" || !data.mfarmId) {
        Toast({
          type: "error",
          description: "Data laporan cuaca tidak lengkap",
        })
        return
      }
      store.setProp("fetching", true)
      const response = await api.submitLaporanCuaca([data])
      if (response.kind === Config.RESP_OK) {
        store.setProp("successModal", true)
        store.setProp("fetching", false)
      } else {
        store.setProp("fetching", false)
        store.setProp("successModal", false)
      }
    },
    async cekFarm(data: any) {
      console.log(data)
    },
    async getFarmPekerja(id: string) {
      const response = await api.getFarmPekerja(id)
      if (response.kind === Config.RESP_OK) {
        store.setProp("farm", [response.data])
        store.setProp("fetching", false)
      } else {
        store.setProp("fetching", false)
      }
    },
    async getFarmPeternak(id: string) {
      const response = await api.getFarmPeternak(id)
      if (response.kind === Config.RESP_OK) {
        store.setProp("farm", response.data)
        store.setProp("fetching", false)
      } else {
        store.setProp("fetching", false)
      }
    },
  }))

export interface Aktifitas extends Instance<typeof AktifitasModel> {}
export interface AktifitasSnapshotOut extends SnapshotOut<typeof AktifitasModel> {}
export interface AktifitasSnapshotIn extends SnapshotIn<typeof AktifitasModel> {}
export interface CekBarcode {
  mkolamId: string
  navigation: any
  mFarmId?: string
  type?: string
}
export interface SubmitKarantina {
  // isactive: string
  jumlahBibit: string
  kodeStatus: string
  mfarmId: string
  mjenisBibitId: string
  mkolamId: string
  nomorKarantina: string
  noted: string
  satuan: string
  tanggalAkhir: string
  tanggalMulai: string
  ukuranBibit: string
  updatedBy: string
  createdBy: string
}

export interface DataJenisBibit {
  nama: string
  minimalPh: number
  maksimalPh: number
  minimalDo: number
  maksimalDo: number
  minimalNitrit: number
  maksimalNitrit: number
  minimalNitrat: number
  maksimalNitrat: number
  minimalAmoniak: number
  maksimalAmoniak: number
  minimalFlok: number
  maksimalFlok: number
  noted: string
  created: string
  createdBy: string
  updated: string
  updatedBy: string
  isactive: string
  mjenisBibitId: string
}

export interface dataSubmitStartFlok {
  createdBy: string
  imagePath: string
  jadwalFlokSusulan: string
  kodeStatus: string
  metodeFlokSusulanId: string
  mkolamId: string
  nomorBioflok: string
  noted: string
  tanggalBerakhir: string
  tanggalMulai: string
  targetPanen: string
  updatedBy: string
  imageFile: any
  fotoKejadian: any
}

export interface dataSubmitTebarBenih {
  bioflokId: string
  createdBy: string
  jumlahBenih: any
  karantinaId: string
  mjenisBibitId: string
  noted: string
  rataRataBeratBenih: any
  tanggal: string
  updatedBy: string
}

export interface dataPemberianPakan {
  beratPakan: string
  bioflokId: any
  createdBy: string
  karantinaId: any
  kodeWaktu: string
  noted: string
  ukuranPakan: string
  updatedBy: string
  waktuPemberianPakan: string
}

export interface dataUkurPh {
  bioflokId: any
  createdBy: string
  jumlahPh: string
  karantinaId: any
  noted: string
  tanggal: string
  updatedBy: string
}

export interface dataUkurNitrit {
  bioflokId: any
  createdBy: string
  jumlahNitrit: string
  karantinaId: any
  noted: string
  tanggal: string
  updatedBy: string
}

export interface dataUkurNitrat {
  bioflokId: any
  createdBy: string
  jumlahNitrat: string
  karantinaId: any
  noted: string
  tanggal: string
  updatedBy: string
}

export interface dataUkurDo {
  bioflokId: any
  createdBy: string
  jumlahDo: string
  karantinaId: any
  noted: string
  tanggal: string
  updatedBy: string
}

export interface dataUkurAmoniak {
  bioflokId: any
  createdBy: string
  jumlahAmoniak: string
  karantinaId: any
  noted: string
  tanggal: string
  updatedBy: string
}

export interface dataPengisianAir {
  createdBy: string
  fotoKejadian: any
  jumlahDebitPengisian: string
  mkolamId: string
  noted: string
  tanggal: string
  updatedBy: string
  imagePath: string
  imageFile: any
  imageName: string
}

export interface dataUkurFlok {
  bioflokId: any
  createdBy: string
  jumlahFlok: string
  karantinaId: any
  noted: string
  tanggal: string
  updatedBy: string
}

export interface dataTambahFlokSusulan {
  bioflokId: string
  createdBy: string
  jumlahFlok: any
  noted: string
  tanggal: string
  updatedBy: string
}

export interface dataSubmitLaporPanen {
  bioflokId: string
  createdBy: string
  fotoKejadian: any
  ignore: string
  jumlahEkor: any
  mjenisBibitId: string
  nomorDokumen: string
  noted: string
  tanggal: string
  totalPanen: any
  updatedBy: string
  imagePath: string
  imageFile: any
  imageName: string
}

export interface dataSubmitLaporKematian {
  bioflokId: string
  createdBy: string
  fotoKejadian: any
  jumlahKematian: any
  mjenisBibitId: string
  mjenisKematianId: string
  noted: string
  tanggal: string
  updatedBy: string
  imagePath: string
  imageFile: any
  imageName: string
}

export interface dataSubmitPemindahanBibit {
  createdBy: string
  dariKolamId: string
  fotoKejadian: any
  jumlahBibit: string
  keKolamId: string
  mjenisBibitId: string
  noted: string
  tanggal: string
  updatedBy: string
  imagePath: string
  imageFile: any
  imageName: string
}

export interface dataKurasKolam {
  createdBy: string
  fotoKejadian: any
  jenisKuras: string
  jumlahDebitYangDikuras: string
  mkolamId: string
  noted: string
  sisaDebitAir: string
  tanggal: string
  updatedBy: string
  imagePath: string
  imageFile: any
  imageName: string
}

export interface dataKematianKarantina {
  createdBy: string
  jumlahKematian: string
  karantinaId: string
  mjenisBibitId: string
  mjenisKematianId: string
  noted: string
  tanggal: string
  updatedBy: string
}

export interface dataLaporanBobot {
  bioflokId: string
  createdBy: string
  jumlahBeratRataRata: string
  jumlahSample: string
  noted: string
  tanggal: string
  updatedBy: string
}

export interface dataPagination {
  page?: number
  size?: number
  sort?: string
  urutan?: string
}

export interface dataSubmitLaporanDowntime {
  createdBy: string
  jumlahMenit: string
  mdowntimeId: string
  mfarmId: string
  mkolamId: string
  noted: string
  tanggal: string
  updatedBy: string
}

export interface dataSubmitLaporanCuaca {
  createdBy: string
  mcuacaId: string
  mfarmId: string
  noted: string
  tanggal: string
  updatedBy: string
}

export const createAktifitasDefaultModel = () => types.optional(AktifitasModel, {})
