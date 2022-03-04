import {ExceptionlessClient} from 'exceptionless/dist/exceptionless';

const exLessClient = ExceptionlessClient.default;
exLessClient.config.apiKey = '1suhJwX6x14Ao1UtfK5vhoKfzwun47KvJDvsKCzv';
exLessClient.config.serverUrl = 'http://10.116.163.185:5000'

const install = Vue => {
  if (install.installed)
    return

  install.installed = true

  Object.defineProperties(Vue.prototype, {
    $exLess: {
      get() {
        return exLessClient
      }
    }
  })
}

export default install
