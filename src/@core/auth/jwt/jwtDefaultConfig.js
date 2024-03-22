// ** Configs
import {Paths} from '@configs/appConfig'


// ** Auth Endpoints
export default {
  loginEndpoint: `${Paths.apiPath}user/session`,
  refreshEndpoint:`${Paths.apiPath}user/session`,
  registerEndpoint: '/jwt/register',
  logoutEndpoint: '/jwt/logout',

  // ** Value of this property will be used as key to store JWT token in storage
  storageTokenKeyName: 'session_token'
}
