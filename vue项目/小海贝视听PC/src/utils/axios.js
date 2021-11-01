import axios from 'axios'

axios.defaults.baseURL = window.configs.axios_BASEURL

// http request 拦截器
axios.interceptors.request.use(
  config => {
    return config
  },
  err => {
    return Promise.reject(err)
  })

axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response) {} else if (error.message) {
      error.response = {
        data: error.message
      }
    }
    return Promise.reject(error.response.data)
  })

export default axios
