import { ApiResponse } from "apisauce"
import Toast from "../../components/Toast"

export function getGeneralApiProblem(response: ApiResponse<any>) {
  if (!response.ok && response.data && response.data.message) {
    if (response.status !== 400) {
      Toast({
        type: "error",
        description: response.data.message ? response.data.message : "Unknown Error From Backend",
      })
      return { kind: response.data.message ? response.data.message : "Unknown Error From Backend" }
    } else if (response.status === 400) {
      Toast({ type: "error", description: response.data.message })
      return { kind: response.data.message }
    } else {
      Toast({ type: "error", description: "Unknown Error From Backend" })
      return { kind: "Unknown Error From Backend" }
    }
  }

  if (!response.ok && response.data && response.data.error) {
    if (response.status !== 400) {
      Toast({
        type: "error",
        description: response.data.error ? response.data.error : "Unknown Error From Backend",
      })
      return { kind: response.data.error ? response.data.error : "Unknown Error From Backend" }
    } else if (response.status === 400) {
      Toast({ type: "error", description: response.data.error })
      return { kind: response.data.error }
    } else {
      Toast({ type: "error", description: "Unknown Error From Backend" })
      return { kind: "Unknown Error From Backend" }
    }
  }

  if (!response.ok && response.problem && response.problem === "TIMEOUT_ERROR") {
    Toast({ type: "error", description: "Gagal Terkoneksi ke server, harap coba lagi" })
    return { kind: "Gagal Terkoneksi ke server, harap coba lagi" }
  }

  if (!response.ok && response.problem && response.problem === "NETWORK_ERROR") {
    Toast({ type: "error", description: "Tidak dapat terhubung ke server" })
    return { kind: "Tidak dapat terhubung ke server" }
  }

  if (!response.ok && response.problem && response.problem === "SERVER_ERROR") {
    Toast({ type: "error", description: "Tidak dapat terhubung ke server" })
    return { kind: "Tidak dapat terhubung ke server" }
  }

  Toast({ type: "error", description: "Terjadi masalah di server" })
  return { kind: "Tidak dapat terhubung ke server" }

  // switch (response.problem) {
  //   case "CONNECTION_ERROR":
  //     return { kind: "cannot-connect", temporary: true }
  //   case "NETWORK_ERROR":
  //     return { kind: "cannot-connect", temporary: true }
  //   case "TIMEOUT_ERROR":
  //     return { kind: "timeout", temporary: true }
  //   case "SERVER_ERROR":
  //     console.log("ok")
  //   // return { kind: "server" }
  //   case "UNKNOWN_ERROR":
  //     return { kind: "unknown", temporary: true }
  //   case "CLIENT_ERROR":
  //     switch (response.status) {
  //       case 401:
  //         return { kind: "unauthorized" }
  //       case 403:
  //         return { kind: "forbidden" }
  //       case 404:
  //         return { kind: "not-found" }
  //       default:
  //         return { kind: "rejected" }
  //     }
  //   case "CANCEL_ERROR":
  //     return null
  // }

  return null
}
