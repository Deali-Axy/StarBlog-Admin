import {ExceptionlessClient} from 'exceptionless/dist/exceptionless';

const exLessClient = ExceptionlessClient.default;
exLessClient.config.apiKey = '1suhJwX6x14Ao1UtfK5vhoKfzwun47KvJDvsKCzv';
exLessClient.config.serverUrl = 'http://exception-less.sblt.deali.cn:9800'

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
