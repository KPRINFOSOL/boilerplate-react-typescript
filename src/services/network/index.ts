import axios from 'axios'
import { RootState } from '../../redux/store'
import * as _ from 'lodash'

// PATH VARIABLE REPLACER
function bindPath(url: string, pathVal: any) {
  var newUrl = url
  var pathExpression = /:[a-z0-9]+/gi
  var pathVar
  while (((pathVar = pathExpression.exec(url)), pathVar != null)) {
    let pathVarName = pathVar[0]
    newUrl = newUrl.replace(pathVarName, pathVal[pathVarName.substring(1, pathVarName.length)])
  }
  return newUrl
}
export default {
  setupInterceptors: (store: RootState) => {
    axios.interceptors.request.use(
      function (config: any) {
        const Config = config
        // CHECK REQUEST NEED TO ADD AUTH TOKEN IN THE HEADER
        if (config.headers.isAuthRequired) {
          const token =
            // eslint-disable-next-line max-len
            store.session.authToken || Config.headers.authKey //GET TOKEN FROM REDUX STATE
          if (token) Config.headers.Authorization = `Bearer ${token}` //ADD AUTHORIZATION HEADER
        }
        // DELETE CUSTOM PROPERTY IN THE REQUEST HEADERS
        delete Config.headers.isAuthRequired
        delete Config.headers.authKey

        // PATH VARIABLES IS AVAILABLE
        if (config.headers.path) {
          try {
            Config.url = bindPath(config.url, config.headers.path)
          } catch (e) {
            console.log('ERROR OCCURED WHEN REPLACING PATH VARIABLES', e)
          }
        }

        return config
      },
      function (error) {
        return Promise.reject(error)
      },
    )

    // Add a response interceptor
    axios.interceptors.response.use(
      function (response) {
        return response
      },
      function (error) {
        //catches if the session ended!
        if (
          !axios.isCancel(error) &&
          (_.get(error, 'response.status', '') === 401 ||
            _.get(error, 'response.status', '') === 403)
        ) {
          if (_.get(error, 'response.data.more_info.is_access_denied')) {
            //access denied error
            window.location = <any>'/403'
          } else {
            //session timeout error
            localStorage.clear()
            // store.dispatch(unauthError())
          }
        }
        return Promise.reject(error)
      },
    )
  },
}
