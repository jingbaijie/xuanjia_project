import Vue from "vue";
import router from "@/router";
import store from "@/store";
import languageDataList from "../locale";
/**
 * 获取uuid
 */
export function getUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        return (c === "x" ? (Math.random() * 16) | 0 : "r&0x3" | "0x8").toString(
            16
        );
    });
}

/**
 * 是否有权限
 * @param {*} key
 */
export function isAuth(key) {
    let pr = this.Cookies.get("child_module");
    if (pr) {
        return (
            sessionStorage.getItem("permissions").indexOf(pr + ":" + key) !== -1 ||
            false
        );
    } else {
        return sessionStorage.getItem("permissions").indexOf(key) !== -1 || false;
    }
}

/**
 * 树形数据转换
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
export function treeDataTranslate(data, id = "id", pid = "parentId") {
    var res = [];
    var temp = {};
    for (var i = 0; i < data.length; i++) {
        temp[data[i][id]] = data[i];
    }
    for (var k = 0; k < data.length; k++) {
        if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
            if (!temp[data[k][pid]]["children"]) {
                temp[data[k][pid]]["children"] = [];
            }
            if (!temp[data[k][pid]]["_level"]) {
                temp[data[k][pid]]["_level"] = 1;
            }
            data[k]["_level"] = temp[data[k][pid]]._level + 1;
            temp[data[k][pid]]["children"].push(data[k]);
        } else {
            res.push(data[k]);
        }
    }
    return res;
}

/**
 * 清除登录信息
 */
export function clearLoginInfo() {
    Vue.cookie.delete("token");
    store.commit("resetStore");
    router.options.isAddDynamicMenuRoutes = false;
}
/**
 *获取当前语言，从localStorage或配置中读取
 *
 * @return {string} --> like 'en-US', 'zh-CN', 'zh-TW', 'zh-HK'
 * */
export const $getLanguage = function() {
    const currentLanguage = localStorage.getItem("language");
    if (currentLanguage) {
        return currentLanguage;
    } else {
        const navLang = navigator.language;
        const langList = languageDataList.map(item => {
            return item.language;
        });
        const localLang = langList.indexOf(navLang) > -1 ? navLang : "zh-CN";
        localStorage.setItem("language", localLang);
        return localLang;
    }
};