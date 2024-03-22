import {getUserData} from '@src/auth/utils'
import jwtDefaultConfig from './jwtDefaultConfig'
import {axiosDb, axiosDf, DfTokens} from '@configs/appConfig'
import { data } from 'jquery'

export default class JwtService {
  // ** jwtConfig <= Will be used by this service
  jwtConfig = { ...jwtDefaultConfig }

  // ** For Refreshing Token
  isAlreadyFetchingAccessToken = false

  // ** For Refreshing Token
  subscribers = []

  constructor(jwtOverrideConfig) {
    this.jwtConfig = { ...this.jwtConfig, ...jwtOverrideConfig }

    // ** Request Interceptor
    axiosDb.interceptors.request.use(
      config => {
        config.headers['X-DreamFactory-API-Key'] = DfTokens.apiKey
        // ** Get token from localStorage
          // ** Get token from localStorage
    const accessToken = this.getToken();
    const userData = getUserData();        // ** If token is present add it to request's Authorization Header
        if (accessToken) {
          // ** eslint-disable-next-line no-param-reassign
       config.headers[
            "X-DreamFactory-Session-Token"
          ] = `${userData.session_token}`;
        }
        return config
      },
      error => Promise.reject(error)
    )

    axiosDf.interceptors.request.use(
      config => {
        config.headers['X-DreamFactory-API-Key'] = DfTokens.apiKey
        // ** Get token from localStorage
        const accessToken = this.getToken();
        const userData = getUserData();        // ** If token is present add it to request's Authorization Header
        if (accessToken) {
          // ** eslint-disable-next-line no-param-reassign
               config.headers[
        "X-DreamFactory-Session-Token"
      ] = `${userData.session_token}`;
        }
        return config
      },
      error => Promise.reject(error)
    )

    // ** Add request/response interceptor
    axiosDb.interceptors.response.use(
      response => response,
      error => {
        // ** const { config, response: { status } } = error
        const { config, response } = error
        const originalRequest = config

        // ** if (status === 401) {
        if (response && response.status === 401) {
          if (!this.isAlreadyFetchingAccessToken) {
            this.isAlreadyFetchingAccessToken = true
            this.refreshToken().then(r => {
              this.isAlreadyFetchingAccessToken = false

              // ** Update accessToken in localStorage
              this.setToken(r.data.accessToken)
              this.onAccessTokenFetched(r.data.accessToken)
            })
          }
          const retryOriginalRequest = new Promise(resolve => {
            this.addSubscriber(accessToken => {
              config.headers['X-DreamFactory-Session-Token'] = accessToken
              resolve(this.axios(originalRequest))
            })
          })
          return retryOriginalRequest
        }
        return Promise.reject(error)
      }
    )
  }

  configureAxios(config) {
    config.headers['X-DreamFactory-API-Key'] = DfTokens.apiKey
    // ** Get token from localStorage
    const accessToken = this.getToken()
    const userData = getUserData()
    // ** If token is present add it to request's Authorization Header
    if (accessToken) {
      // ** eslint-disable-next-line no-param-reassign
      config.headers['X-DreamFactory-Session-Token'] = `${userData.session_token}`
    }
    return config
  }

  onAccessTokenFetched(accessToken) {
    this.subscribers = this.subscribers.filter(callback => callback(accessToken))
  }

  addSubscriber(callback) {
    this.subscribers.push(callback)
  }

  getToken() {
    return localStorage.getItem(this.jwtConfig.storageTokenKeyName)
  }

  setToken(value) {
    localStorage.setItem(this.jwtConfig.storageTokenKeyName, value)
  }

  login(...args) {
    return new Promise((resolve, reject) => {
      axiosDf
      .post(this.jwtConfig.loginEndpoint, ...args)
      .then((res) => {
        const config = {
          headers: {
            'X-DreamFactory-Session-Token' : res.data.session_token
          }
        }

        axiosDb
          .get(`_table/gbl_usuario/${res.data.id}?id_field=df_id&related=sys_perfil_by_per_id`, config)
          .then((user) => {
            resolve({ nome: user.data.nome, email: res.data.email, role: res.data.role, id: user.data.id, avatar: user.data.avatar, dfid: res.data.id, session_token: res.data.session_token, cli_id: user.data?.cli_id })
          })
      })
      .catch((error) => {
        reject(error)
      })
    })
  }

  register(...args) {
    return axiosDf.post(this.jwtConfig.registerEndpoint, ...args)
  }

  refreshToken() {
    return axiosDf.put(this.jwtConfig.refreshEndpoint)
  }
}
