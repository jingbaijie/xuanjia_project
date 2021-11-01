/*
 * @LastEditors: jwzx
 * @LastEditTime: 2020-08-20 18:07:41
 */ 
const interface = require("./interface");
const changeThemeInfo = require("./changeUserTheme");
/**
 * 获取页面模版信息
 */
async function getTemplateInfo(options){
    //获取页面模版信息
    let templateInfo = await interface.getTemplateInfo(options);
    let templateUrl = templateInfo ? templateInfo.templateUrl : "";
    //页面基础文件夹地址
    let basePageUrl = templateUrl.replace(/(\/html\/)?\w+\.html/,"");
    //模版地址
    try {
        templateUrl = templateUrl.split("/").splice(2).join("/").replace(".html","");
    } catch (error) {
    }
    
    return {
        basePageUrl,
        templateUrl,
        templateInfo
    };
}
/**
 * 获取通用页面信息和个人主题信息
 * @param {*} options 
 */
async function getCommonPageInfo(options){
    //通用页面信息
    //  let commonPageInfo = await interface.getFindCommonPageInfo(options);
    let commonPageInfo = await interface.getFindRecCommonPageInfo(options);
    //个人用户主题
    let selectThemeDetailByUserId = await interface.getSelectThemeDetailByUserId(options);
    commonPageInfo = changeThemeInfo(commonPageInfo,selectThemeDetailByUserId);
    let title = commonPageInfo.pageInfo.commPageCname;
    
    return {
        commonPageInfo,
        selectThemeDetailByUserId,
        title
    }
}

module.exports = {
    getTemplateInfo,
    getCommonPageInfo
}

