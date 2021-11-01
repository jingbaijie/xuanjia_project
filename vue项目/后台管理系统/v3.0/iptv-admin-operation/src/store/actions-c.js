/*
 * @LastEditors: zhanggao
 * @LastEditTime: 2020-11-17 11:13:54
 */
import axios from '@/common/axios'
import qs from 'qs' // post请求转码
import store from './index'
import urlList from '../utils/interface'

const redisUrl = "http://172.16.32.9:28080/nodeApi/redisflushdb"

function axiosRequest (option) {
    console.log(option)
    return new Promise((resolve, reject) => {
        axios(option).then(res => {
            if(option.reType === "update"){
                axios.get(redisUrl)
            }
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

const http = {
    // 二进制流文件下载
    downloadBlob: function(url, requestJson, config) {
        return new Promise((resolve, reject) => {
            axios.post(url, qs.stringify(Object.assign(requestJson, config)), {
                "responseType": "blob"
            }).then(res => {
                var data = res;
                if (!data) {
                    return
                }
                var blob = new Blob([data.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
                var url = window.URL.createObjectURL(blob);
                var aLink = document.createElement("a");
                aLink.style.display = "none";
                aLink.href = url;
                aLink.setAttribute("download", "excel_" + new Date().getTime() + ".xls");
                document.body.appendChild(aLink);
                aLink.click();
                document.body.removeChild(aLink); //下载完成移除元素
                window.URL.revokeObjectURL(url); //释放掉blob对象
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 二进制流文件下载
    downloadBlobText: function(url, requestJson, config) {
        return new Promise((resolve, reject) => {
            axios.post(url, qs.stringify(Object.assign(requestJson, config)), {
                "responseType": "blob"
            }).then(res => {
                var data = res;
                if (!data) {
                    return
                }
                var blob = new Blob([data.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
                var url = window.URL.createObjectURL(blob);
                var aLink = document.createElement("a");
                aLink.style.display = "none";
                aLink.href = url;
                aLink.setAttribute("download", "text_" + new Date().getTime() + ".txt");
                document.body.appendChild(aLink);
                aLink.click();
                document.body.removeChild(aLink); //下载完成移除元素
                window.URL.revokeObjectURL(url); //释放掉blob对象
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    },
}

const actionApi = {
    //下载前面生成的优惠券卡号，每行一个卡号
    axios_download_saleCard({ commit }, requestData = {}) {
        return http.downloadBlobText("saleCard/download", requestData)
    },
    add_view({ commit }, view) {
        commit('add_cached_view', view)
    },
    del_view({ commit, state }, view) {
        return new Promise(resolve => {
            commit('del_cache_view', view)
            resolve([...state.cachedViews])
        })
    },
    ///content/series/importExcelMedia
    // 节目管理
    //导出
    axios_get_export({ commit }, requestData = {}) {
        return http.downloadBlob("content/series/export", requestData)
    },
    axios_me({ commit }, requestData = {}) {
        let source = axios.CancelToken.source()
        store.commit('axiosCancel_setter', {
            me: source
        })
        requestData.cancelToken = source.token
        return new Promise((resolve, reject) => {
            axios.post('/api/v1/members/me.json', requestData).then(res => {
                if (res.data && +res.data.error === 0) {
                    commit('userInfo_setter', res.data.member)
                } else {}
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    }
}

urlList.forEach(option=>{
    if(option.name){
        actionApi[option.name] = ({ commit },requestData={})=>{
            if(option.method === "get"){
                option.params = requestData
            } else {
                option.data = requestData
            }
            return axiosRequest(option)
        }
    }
})

export default actionApi