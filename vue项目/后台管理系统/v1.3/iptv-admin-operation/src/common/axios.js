/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-04-14 18:58:36
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-05-29 14:21:08
 */
import axios from 'axios'
import router from '../router'

/**
 * Responsible for all HTTP requests.
 */
axios.defaults.timeout = window.configs.axios_TIMEOUT
axios.defaults.baseURL = window.configs.axios_BASEURL

// http request 拦截器
axios.interceptors.request.use(
    config => {
        config.headers['x-a-t'] = localStorage.getItem('token')
        return config
    },
    err => {
        return Promise.reject(err)
    })

axios.interceptors.response.use(
    response => {
        // console.log("*****************************************************")
        // console.log('request url   ' + JSON.stringify(response.config.url));
        // console.log('code ' +response.data.errorCode+' message '+response.data.errorMsg);
        if (response.data.errorCode == '1008') {
            localStorage.removeItem('token');
            router.push('/login');
            // Message({ message: '用户token失效,请重新登录', type: "warning" })
        }
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