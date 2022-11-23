import { Instance, SnapshotOut, types, getSnapshot } from "mobx-state-tree"
import Toast from "../components/Toast"
import Config from "../config"
import { Toast as Toast2 } from "native-base"
import { api } from "../services/api"
import { withSetPropAction } from "./helpers/with-set-prop-action"

export const AuthenticationStoreModel = types
  .model("AuthenticationStore")
  .props({
    authToken: types.maybe(types.string),
    authEmail: types.optional(types.string, ""),
    authPassword: types.optional(types.string, ""),
    profile: types.frozen<any>(),
    profilePekerja: types.frozen<any>(),
    fetching: types.optional(types.boolean, false),
    fetching2: types.optional(types.boolean, false),
    otpdata: types.frozen<any>(null),
    role_name: types.optional(types.string, ""),
  })
  .views((store) => ({
    get isAuthenticated() {
      return !!store.authToken
    },
    get validationErrors() {
      return {
        authEmail: (function () {
          if (store.authEmail.length === 0) return "can't be blank"
          if (store.authEmail.length < 6) return "must be at least 6 characters"
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(store.authEmail))
            return "must be a valid email address"
          return ""
        })(),
        authPassword: (function () {
          if (store.authPassword.length === 0) return "can't be blank"
          if (store.authPassword.length < 6) return "must be at least 6 characters"
          return ""
        })(),
      }
    },
  }))
  .actions(withSetPropAction)
  .actions((store) => ({
    setAuthToken(value?: string) {
      store.authToken = value
    },
    setAuthEmail(value: string) {
      store.authEmail = value.replace(/ /g, "")
    },
    setAuthPassword(value: string) {
      store.authPassword = value.replace(/ /g, "")
    },
    setFetching(value: boolean) {
      store.fetching = value
    },
    async loginfunc(data: any) {
      Toast
      if (data.username == "" || data.password == "") {
        Toast({
          type: "error",
          description: "Username atau password tidak boleh kosong",
        })
        return
      }
      this.setFetching(true)
      const responseProfile = await api.login(data)
      if (responseProfile.kind == Config.RESP_OK) {
        const responseProfilePekerja = await api.getProfilePekerja(responseProfile.data.mpekerjaId)
        // const responseFarmPekerja = await api.getFarmPekerja(responseProfile.data.mpekerjaId)
        if (
          responseProfile.kind == Config.RESP_OK
          // && responseFarmPekerja.kind == Config.RESP_OK
        ) {
          // store.setProp("farm", [responseFarmPekerja.data])
          store.setProp("profile", responseProfile.data)
          store.setProp("profilePekerja", responseProfilePekerja.data)
          store.setProp("role_name", responseProfile.data.role_name)
          this.setAuthToken(String(Date.now()))
          this.setFetching(false)
          Toast({
            type: "success",
            description: "Login berhasil",
          })
        } else {
          this.setFetching(false)
        }
      } else {
        Toast2.closeAll()
        const loginPeternak = await api.loginPeternak(data)
        // const responseFarmPeternak = await api.getFarmPeternak(loginPeternak.data.m_user_id)
        if (
          loginPeternak.kind == Config.RESP_OK
          // && responseFarmPeternak.kind == Config.RESP_OK
        ) {
          // store.setProp("farm", responseFarmPeternak.data)
          this.setAuthToken(String(Date.now()))
          store.setProp("profile", loginPeternak.data)
          store.setProp("role_name", loginPeternak.data.role_name)
          store.setProp("profilePekerja", undefined)
          this.setFetching(false)
          Toast({
            type: "success",
            description: "Login berhasil",
          })
        } else {
          this.setFetching(false)
        }
      }
    },
    async logoutfunc(data: any) {
      this.setFetching(true)
      const responseLogout = await api.logout(data)
      if (responseLogout.kind == Config.RESP_OK) {
        // store.setProp("farm", [])
        store.setProp("authToken", undefined)
        store.setProp("profile", undefined)
        store.setProp("profilePekerja", undefined)
        store.setProp("role_name", undefined)
        this.setFetching(false)
      } else {
        this.setFetching(false)
      }
    },
    async sendOtp(data: { email: string; navigation?: any }) {
      if (data.email === "") {
        Toast({ type: "error", description: "Email tidak boleh kosong" })
        return
      }
      store.setProp("fetching", true)
      const response = await api.sendOtp(data)
      if (response.kind === Config.RESP_OK) {
        Toast({ type: "success", description: "Berhasil mengirim Otp" })
        data.navigation.navigate("ForgotPasswordValidateOtp", { email: data.email })
        store.setProp("fetching", false)
      } else {
        // store.setProp("otpdata", null)
        store.setProp("fetching", false)
      }
    },
    async reSendOtp(data: { email: string }) {
      if (data.email === "") {
        Toast({ type: "error", description: "Email tidak boleh kosong" })
        return
      }
      store.setProp("fetching2", true)
      const response = await api.sendOtp(data)
      if (response.kind === Config.RESP_OK) {
        // store.setProp("otpdata", response.data)
        Toast({ type: "success", description: "Berhasil mengirim Otp" })
        store.setProp("fetching2", false)
      } else {
        // store.setProp("otpdata", null)
        store.setProp("fetching2", false)
      }
    },
    async validateOtp(data: { email: string; otp: string; navigation: any }) {
      if (data.otp === "") {
        Toast({ type: "error", description: "Otp tidak boleh kosong" })
        return
      }
      store.setProp("fetching", true)
      const response = await api.validateOtp(data)
      if (response.kind === Config.RESP_OK) {
        // store.setProp("otpdata", response.data)
        Toast({ type: "success", description: "Berhasil validasi Otp" })
        data.navigation.navigate("ForgotPasswordInput", { data: response.data })
        store.setProp("fetching", false)
      } else {
        store.setProp("fetching", false)
      }
    },
    async resetPassword(data: { m_user_id: string; newpassword: string; renewpassword: string }) {
      if (
        data.m_user_id === "" ||
        !data.m_user_id ||
        data.newpassword === "" ||
        data.renewpassword === ""
      ) {
        Toast({ type: "error", description: "Data tidak lengkap" })
        return
      }
      if (data.renewpassword.length < 8 || data.newpassword.length < 8) {
        Toast({ type: "error", description: "Password minimal 8 karakter" })
        return
      }
      // console.log(data)
      store.setProp("fetching", true)
      let res: any
      const response = await api.resetPassword(data)
      // console.log(response)
      if (response.kind === Config.RESP_OK) {
        res = response.data
        Toast({ type: "success", description: "Berhasil reset password" })
        this.loginfunc({ username: res.role_name.username, password: data.renewpassword })
        store.setProp("fetching", false)
      } else {
        store.setProp("fetching", false)
      }
    },
    async resetPasswordPeternak(data: {
      m_user_id: string
      newpassword: string
      renewpassword: string
    }) {
      if (
        data.m_user_id === "" ||
        !data.m_user_id ||
        data.newpassword === "" ||
        data.renewpassword === ""
      ) {
        Toast({ type: "error", description: "Data tidak lengkap" })
        return
      }
      if (data.renewpassword.length < 8 || data.newpassword.length < 8) {
        Toast({ type: "error", description: "Password minimal 8 karakter" })
        return
      }
      // console.log(data)
      store.setProp("fetching", true)
      let res: any
      const response = await api.resetPasswordPeternak(data)
      // console.log(response)
      if (response.kind === Config.RESP_OK) {
        res = response.data
        // console.log("res", res.data.username)
        Toast({ type: "success", description: "Berhasil reset password" })
        this.loginfunc({ username: res.data.username, password: data.renewpassword })
        store.setProp("fetching", false)
      } else {
        store.setProp("fetching", false)
      }
    },
    async changePassword(data: {
      m_user_id: string
      oldpassword: string
      newpassword: string
      renewpassword: string
      navigation: any
    }) {
      if (
        data.m_user_id === "" ||
        !data.m_user_id ||
        data.oldpassword === "" ||
        data.newpassword === "" ||
        data.renewpassword === ""
      ) {
        Toast({ type: "error", description: "Data tidak lengkap" })
        return
      }
      if (data.renewpassword.length < 8 || data.newpassword.length < 8) {
        Toast({ type: "error", description: "Password minimal 8 karakter" })
        return
      }
      store.setProp("fetching", true)
      const response = await api.changePassword(data)
      if (response.kind === Config.RESP_OK) {
        Toast({ type: "success", description: "Berhasil ganti password" })
        data.navigation.goBack()
        store.setProp("fetching", false)
      } else {
        store.setProp("fetching", false)
      }
    },
    async changePasswordPeternak(data: {
      m_user_id: string
      oldpassword: string
      newpassword: string
      renewpassword: string
      navigation: any
    }) {
      if (
        data.m_user_id === "" ||
        !data.m_user_id ||
        data.oldpassword === "" ||
        data.newpassword === "" ||
        data.renewpassword === ""
      ) {
        Toast({ type: "error", description: "Data tidak lengkap" })
        return
      }
      if (data.renewpassword.length < 8 || data.newpassword.length < 8) {
        Toast({ type: "error", description: "Password minimal 8 karakter" })
        return
      }
      store.setProp("fetching", true)
      const response = await api.changePasswordPeternak(data)
      if (response.kind === Config.RESP_OK) {
        Toast({ type: "success", description: "Berhasil ganti password" })
        data.navigation.goBack()
        store.setProp("fetching", false)
      } else {
        store.setProp("fetching", false)
      }
    },
  }))

export interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> {}
export interface AuthenticationStoreSnapshot extends SnapshotOut<typeof AuthenticationStoreModel> {}

// @demo remove-file
