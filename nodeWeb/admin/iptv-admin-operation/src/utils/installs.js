import {Indicator, Toast} from 'mint-ui'

export default {
  install (Vue, options) {
    /**
     *全局展示信息
     *
     * */
    Vue.prototype.$message = {
      success: (message) => Toast({
        message: message,
        position: 'bottom'
      }),
      error: (message) => Toast({
        message: message,
        iconClass: 'icon icon-error'
      }),
      warn: (message) => Toast({
        message: message,
        iconClass: 'icon icon-warn'
      })
    }
    /**
     *全局展示loading
     *
     * */
    Vue.prototype.$loading = {
      open: (message) => {
        Indicator.open({
          text: message,
          spinnerType: 'snake'
        })
      },
      close: () => {
        Indicator.close()
      }
    }
  }
}
