/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://github.com/infinitered/ignite/blob/master/docs/Backend-API-Integration.md)
 * documentation for more details.
 */
import {
  ApiResponse, // @demo remove-current-line
  ApisauceInstance,
  create,
} from "apisauce"
import Config from "../../config"
import { getGeneralApiProblem } from "./api-problem" // @demo remove-current-line
import type {
  ApiConfig,
  ApiFeedResponse,
  ApiSubmitKarantina, // @demo remove-curent-line
} from "./api.types"
// import type { EpisodeSnapshotIn } from "../../models/Episode" // @demo remove-current-line

/**
 * Configuring the apisauce instance.
 */
export const API_CONFIG: ApiConfig = {
  url: Config.API_BASE,
  timeout: 10000,
}

/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */
export class Api {
  apisauce: ApisauceInstance
  config: ApiConfig

  /**
   * Set up our API instance. Keep this lightweight!
   */
  constructor(config: ApiConfig = API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
        "x-tag": "bioflokApps",
      },
    })
  }

  async login(data: object) {
    // make the api call
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.post(
      `apiauth/login/pekerjafarm`,
      data,
    )
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return { ...problem, data: "error" }
      }
    }
    return { kind: Config.RESP_OK, data: response.data.profile }
  }
  async loginPeternak(data: object) {
    // make the api call
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.post(
      `apiauth/login/peternak`,
      data,
    )
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return { ...problem, data: "error" }
      }
    }
    return { kind: Config.RESP_OK, data: response.data.profile }
  }
  async logout(data: string) {
    // make the api call
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.post(
      "apiauth/login/nextlogout",
      data,
    )
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return { ...problem, data: "error" }
      }
    }
    return { kind: Config.RESP_OK, data: response.data.message }
  }

  async getProfilePekerja(data: string) {
    // make the api call
    // console.log("data", data)
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.get(
      `api/master/pekerja/${data}`,
    )
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return { ...problem, data: "error" }
      }
    }
    return { kind: Config.RESP_OK, data: response.data.data }
  }
  async availableKolam(id: string) {
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.get(`api/master/kolam/${id}`)
    // console.log(response)
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return { ...problem, data: "error" }
      }
    }
    return { kind: Config.RESP_OK, data: response.data.data }
  }
  async getJenisBibit() {
    // jenisBibit/kolam/01236790-4039-40bb-897a-a650213c3238
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.get(`api/master/jenisBibit`)
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return { ...problem, data: "error" }
      }
    }
    return { kind: Config.RESP_OK, data: response.data.data }
  }
  async submitKarantina(data: object) {
    const response: ApiResponse<ApiSubmitKarantina> = await this.apisauce.post(
      `api/master/karantina`,
      data,
    )
    // console.log(response)
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return { ...problem, data: "error" }
      }
    }
    return { kind: Config.RESP_OK, data: response.data }
  }
  async submitStartFlok(data: object) {
    const response: ApiResponse<ApiSubmitKarantina> = await this.apisauce.post(
      `api/master/bioflok`,
      data,
    )
    // console.log(response)
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return { ...problem, data: "error" }
      }
    }
    return { kind: Config.RESP_OK, data: response.data }
  }
  async uploadFile(data: any) {
    // make the api call
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.post(`apifile/fileapi`, data)
    // console.log(response)
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return { ...problem, data: "error" }
      }
    }
    return { kind: Config.RESP_OK, data: response.data }
  }
  async generateNomor(data: { url: string; farmId: string }) {
    // make the api call
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.post(
      `api/generate/dokumennumber/${data.url}?mFarmId=${data.farmId}`,
    )
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return { ...problem, data: "error" }
      }
    }
    return { kind: Config.RESP_OK, data: response.data.data }
  }
  async getMetodeFlokSusulan(id: string) {
    // make the api call
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.get(
      `api/metode/flok/farm/${id}`,
    )
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return { ...problem, data: "error" }
      }
    }
    // console.log(response.data.data)
    return { kind: Config.RESP_OK, data: response.data.data }
  }
  async getBioflokStatus(id: string) {
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.get(
      `api/status/bioflok/${id}`,
    )
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return { ...problem, data: "error" }
      }
    }
    // console.log(response.data.data)
    return { kind: Config.RESP_OK, data: response.data.data }
  }
  async getKolamKarantina(id: string) {
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.get(
      `api/master/kolam/karantina/farm/${id}`,
    )
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return { ...problem, data: "error" }
      }
    }
    return { kind: Config.RESP_OK, data: response.data.data }
  }
  async getNomorKarantina(id: string) {
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.get(
      `api/status/karantina/${id}`,
    )
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return { ...problem, data: "error" }
      }
    }
    return { kind: Config.RESP_OK, data: response.data.data }
  }
  async submitTebarBenih(data: object) {
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.post(`api/tebar/benih`, data)
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return { ...problem, data: "error" }
      }
    }
    return { kind: Config.RESP_OK, data: response.data.data }
  }
  async submitPemberianPakan(data: object) {
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.post(
      `api/pemberian/pakan`,
      data,
    )
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return { ...problem, data: "error" }
      }
    }
    return { kind: Config.RESP_OK, data: response.data.data }
  }
  async submitUkurPh(data: object) {
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.post(`api/kadar/ph`, data)
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return { ...problem, data: "error" }
      }
    }
    return { kind: Config.RESP_OK, data: response.data.data }
  }
  async submitUkurNitrit(data: object) {
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.post(
      `api/kadar/nitrit`,
      data,
    )
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return { ...problem, data: "error" }
      }
    }
    return { kind: Config.RESP_OK, data: response.data.data }
  }
  async getDetailKolam(id: string) {
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.get(`api/master/kolam/${id}`)
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return { ...problem, data: "error" }
      }
    }
    return { kind: Config.RESP_OK, data: response.data.data }
  }
  async submitUkurNitrat(data: object) {
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.post(
      `api/kadar/nitrat`,
      data,
    )
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return { ...problem, data: "error" }
      }
    }
    return { kind: Config.RESP_OK, data: response.data.data }
  }
  async submitUkurDo(data: object) {
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.post(`api/kadar/do`, data)
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return { ...problem, data: "error" }
      }
    }
    return { kind: Config.RESP_OK, data: response.data.data }
  }
  async submitUkurAmoniak(data: object) {
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.post(
      `api/kadar/amoniak`,
      data,
    )
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return { ...problem, data: "error" }
      }
    }
    return { kind: Config.RESP_OK, data: response.data.data }
  }
  async bioflokValidasiKolam(id: string) {
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.get(
      `api/master/bioflok/validasi/${id}`,
    )
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return { ...problem, data: "error" }
      }
    }
    return { kind: Config.RESP_OK, data: response.data.status }
  }
  async bioflokValidasiAirKolam(id: string) {
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.get(
      `api/master/bioflok/validasi/air/${id}`,
    )
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return { ...problem, data: "error" }
      }
    }
    return { kind: Config.RESP_OK, data: response.data.status }
  }
  async karantinaValidasiKolam(id: string) {
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.get(
      `api/master/karantina/validasi/${id}`,
    )
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return { ...problem, data: "error" }
      }
    }
    return { kind: Config.RESP_OK, data: response.data.status }
  }
  async submitPengisianAir(data: object) {
    const response: ApiResponse<ApiSubmitKarantina> = await this.apisauce.post(
      `api/isi/airKolam`,
      data,
    )
    // console.log(response)
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return { ...problem, data: "error" }
      }
    }
    return { kind: Config.RESP_OK, data: response.data }
  }
  async submitUkurFlok(data: object) {
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.post(`api/kadar/flok`, data)
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return { ...problem, data: "error" }
      }
    }
    return { kind: Config.RESP_OK, data: response.data.data }
  }
  async submitTambahFlokSusulan(data: object) {
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.post(
      `api/flok/susulan`,
      data,
    )
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return { ...problem, data: "error" }
      }
    }
    return { kind: Config.RESP_OK, data: response.data.data }
  }
  async getJenisBibitKolam(id: string) {
    // jenisBibit/kolam/01236790-4039-40bb-897a-a650213c3238
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.get(
      `api/master/jenisBibit/kolam/${id}`,
    )
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return { ...problem, data: "error" }
      }
    }
    return { kind: Config.RESP_OK, data: response.data.data }
  }
  async submitLaporPanen(data: object) {
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.post(
      `api/transaksi/panen`,
      data,
    )
    // console.log(response)

    if (!response.ok) {
      if (response.data.code == "202") {
        return { data: "warning", kind: response.data.message }
      }
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return { ...problem, data: "error" }
      }
    }
    return { kind: Config.RESP_OK, data: response.data.data }
  }
  async allJenisKematian() {
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.get(`api/jenis/kematian/all`)
    // console.log(response)
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return { ...problem, data: "error" }
      }
    }
    return { kind: Config.RESP_OK, data: response.data.data }
  }
  async submitLaporKematian(data: object) {
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.post(
      `api/data/kematian`,
      data,
    )
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return { ...problem, data: "error" }
      }
    }
    return { kind: Config.RESP_OK, data: response.data.data }
  }
  async getListKolamByFarm(id: string) {
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.get(
      `api/master/kolam/farm/${id}`,
    )
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return { ...problem, data: "error" }
      }
    }
    return { kind: Config.RESP_OK, data: response.data.data }
  }
  async submitPemindahanBibit(data: object) {
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.post(
      `api/pemindahan/bibit`,
      data,
    )
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return { ...problem, data: "error" }
      }
    }
    return { kind: Config.RESP_OK, data: response.data.data }
  }
  async submitKurasKolam(data: object) {
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.post(`api/kuras/kolam`, data)
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return { ...problem, data: "error" }
      }
    }
    return { kind: Config.RESP_OK, data: response.data.data }
  }
  async submitKematianKarantina(data: object) {
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.post(
      `api/master/kematianKarantina`,
      data,
    )
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return { ...problem, data: "error" }
      }
    }
    return { kind: Config.RESP_OK, data: response.data.data }
  }
  async submitLaporanBobot(data: object) {
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.post(`api/data/berat`, data)
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return { ...problem, data: "error" }
      }
    }
    return { kind: Config.RESP_OK, data: response.data.data }
  }
  async getDataDowntime(data: object) {
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.get(
      `api/master/downtime`,
      data,
    )
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return { ...problem, data: "error" }
      }
    }
    return { kind: Config.RESP_OK, data: response.data.data }
  }
  async submitLaporanDowntime(data: object) {
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.post(
      `api/laporan/downtime`,
      data,
    )
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return { ...problem, data: "error" }
      }
    }
    return { kind: Config.RESP_OK, data: response.data.data }
  }
  async getDataCuaca(data: object) {
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.get(`api/master/cuaca`, data)
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return { ...problem, data: "error" }
      }
    }
    return { kind: Config.RESP_OK, data: response.data.data }
  }
  async submitLaporanCuaca(data: object) {
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.post(
      `api/laporan/cuaca`,
      data,
    )
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return { ...problem, data: "error" }
      }
    }
    return { kind: Config.RESP_OK, data: response.data.data }
  }
  async sendOtp(data: object) {
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.post(
      `apiauth/login/sendOtpForgotPassword`,
      data,
    )
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return { ...problem, data: "error" }
      }
    }
    return { kind: Config.RESP_OK, data: response.data.data }
  }
  async validateOtp(data: object) {
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.post(
      `apiauth/login/validasiotp`,
      data,
    )
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return { ...problem, data: "error" }
      }
    }
    return { kind: Config.RESP_OK, data: response.data.data }
  }

  async resetPassword(data: object) {
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.post(
      `apiauth/login/resetpwdpekerja`,
      data,
    )
    // console.log(Config.RESP_OK)
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return { ...problem, data: "error" }
      }
    }
    return { kind: Config.RESP_OK, data: response.data }
  }

  async resetPasswordPeternak(data: object) {
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.post(
      `apiauth/login/resetpwdpeternak`,
      data,
    )
    // console.log(Config.RESP_OK)
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return { ...problem, data: "error" }
      }
    }
    return { kind: Config.RESP_OK, data: response.data }
  }

  async changePassword(data: object) {
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.post(
      `apiauth/login/changepwdpekerja`,
      data,
    )
    // console.log(Config.RESP_OK)
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return { ...problem, data: "error" }
      }
    }
    return { kind: Config.RESP_OK, data: response.data }
  }

  async changePasswordPeternak(data: object) {
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.post(
      `apiauth/login/changepwdpeternak`,
      data,
    )
    // console.log(Config.RESP_OK)
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return { ...problem, data: "error" }
      }
    }
    return { kind: Config.RESP_OK, data: response.data }
  }

  async getFarmPekerja(id: string) {
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.get(
      `api/master/farm/pekerja/${id}`,
    )
    // console.log(Config.RESP_OK)
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return { ...problem, data: "error" }
      }
    }
    return { kind: Config.RESP_OK, data: response.data.data }
  }

  async getFarmPeternak(id: string) {
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.get(
      `api/master/farm/user/${id}`,
    )
    // console.log(Config.RESP_OK)
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return { ...problem, data: "error" }
      }
    }
    return { kind: Config.RESP_OK, data: response.data.data }
  }

  async getDetailPembayaran(id: string) {
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.get(
      `/api/transaksi?nomor_transaksi=${id}&&status_transaksi=Menunggu Pembayaran`,
    )
    // console.log(Config.RESP_OK)
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return { ...problem, data: "error" }
      }
    }
    return { kind: Config.RESP_OK, data: response.data.data }
  }

  async getCart(id: string) {
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.get(
      `/api/cart/getAll?transaction_id=${id}`,
    )
    // console.log(Config.RESP_OK)
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return { ...problem, data: "error" }
      }
    }
    return { kind: Config.RESP_OK, data: response.data.data }
  }

  async submitPembayaran(data: { id: string; data: any }) {
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.put(
      `/api/transaksi/${data.id}`,
      data.data,
    )
    // console.log(Config.RESP_OK)
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return { ...problem, data: "error" }
      }
    }
    return { kind: Config.RESP_OK, data: response.data.data }
  }
}

//20
export const api = new Api()
