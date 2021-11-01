const {sendQuest} = require("../utils/request");
const {logError} = require("../utils/errAction");
const logger = require("../utils/logger");

/**
 * 通过key获取接口地址
 * @param {*} key 地址key 
 */
function getInterfaceUrl(key) {
    key = key || "";
    let interfaceUrl = "";
    switch (key) {
        //请求模版地址
        case "findTemplateInfo":
            interfaceUrl = "web/findTemplateInfo";
            break;
        //请求通用页面信息地址
        case "findCommonPageInfo":
            interfaceUrl = "web/findCommonPageInfo";
            break;
        //请求通用推荐页面信息地址
        case "findRecCommonPageInfo":
            interfaceUrl = "web/findRecCommonPageInfo";
            break;
        //请求主题列表信息地址
        case "selectThemeDetail":
            interfaceUrl = "web/selectThemeDetail";
            break;
        //请求用户主题信息地址
        case "selectThemeDetailByUserId":
            interfaceUrl = "web/selectThemeDetailByUserId";
            break;
        //请求用户眉头定制
        case "findUserCustomByUserId":
            interfaceUrl = "web/findUserCustomByUserId";
            break;
        //请求cartoon详情地址
        case "findCartoonDetailById":
            interfaceUrl = "web/findCartoonDetailById";
            break;
        //请求cartoon子集列表地址
        case "findVideoListByCartoonId":
            interfaceUrl = "web/findVideoListByCartoonId";
            break;
        //请求game详情地址
        case "findGameDetailById" :
            interfaceUrl = "web/findGameDetailById";
            break;
        //请求一级分类下分类列表地址    
        case "findTypesByParentId" : 
            interfaceUrl = "web/findTypesByParentId";
            break;
        //获取参数键值    
        case "getSystemConfigByKey" : 
            interfaceUrl = "web/getSystemConfigByKey";
            break;
        default:
            interfaceUrl = key;
    }
    return global.config.interfaceUrl + interfaceUrl;

}

/**
 * 获取请求信息
 * @param {key,str} options 
 */
async function getInfo(options){
    let {str,key} = options || {};
    let redisConf = {
        key : key + ":" + str
    }
    if(str){
        const paramArr = str.split("&")
        paramArr.forEach(param=>{
            const paArr = param.split("=") || [];
            if(paArr[1] === "undefined" || !paArr[1]){
                logError({
                    code:505,
                    name:"paramsError",
                    message:`接口${key}参数${str}无值`
                });
                return ""
            }
        })
    }
    //读取redis缓存
    let redisData = await global.redis.get(redisConf.key);
    if(redisData){
        return redisData;
    }else{
        let url = getInterfaceUrl(key) + "?" + str;
        let data = await sendQuest(url);
        if(data){
            //设置redis缓存
            global.redis.set(redisConf.key,data,global.config.redisConfig.defaultExpireTime);
        }
        return data;
    }
}

/**
 * 请求页面模版信息
 * @param {contentId,contentName} options 
 */
async function getTemplateInfo(options) {
    let { contentId, contentName } = options || {};
    let str = contentId ? ("contentId=" + contentId) : ("contentId=" + contentName);
    let data =  await getInfo({
        str : str,
        key : "findTemplateInfo"
    })
    return data;
}
/**
 * 获取页面通用信息
 * @param {contentId,contentName} options 
 */
async function getFindCommonPageInfo(options) {
    let { isRecommend,contentId, contentName } = options || {};
    let str = contentId ? ("contentId=" + contentId) : ("contentName=" + contentName);
    str += "&isRecommend=" + (isRecommend == "false"? "false": "true");
    let data =  await getInfo({
        str : str,
        key : "findCommonPageInfo"
    })

    return data;
}
/**
 * 获取请求地址
 * @param {contentId,contentName} options 
 */

async function getFindRecCommonPageInfo(options){
    let { isRecommend,contentId, contentName } = options || {};
    let str = contentId ? ("contentId=" + contentId) : ("contentName=" + contentName);
    str += "&isRecommend=" + (isRecommend == "false"? "false": "true");
    let data =  await getInfo({
        str : str,
        key : "findRecCommonPageInfo"
    })
    return data;
}

/**
 * 获取主题列表
 * @param {*} options 
 */
async function getSelectThemeDetail(options){
    let data = await getInfo({
        key : "selectThemeDetail",
        str : "",
    })
    return data;
}
/**
 * 获取用户主题
 * @param {userId} options 
 */
async function getSelectThemeDetailByUserId(options){
    let {userId} = options || {};
    let str = "userId=" + (userId ? userId : "");
    let data = await getInfo({
        str : str,
        key : "selectThemeDetailByUserId"
    }) 
    return data;
}
/**
 * 获取个人定制眉头信息
 * @param {userId} options 
 * findUserCustomByUserId?userId=-1&times=1596094984466
 */
async function getFindUserCustomByUserId(options){
    let {userId} = options || {};
    let str = "userId=" + (userId ? userId : "");
    let data = await getInfo({
        str : str,
        key : "findUserCustomByUserId"
    }) 
    return data;
}

/**
 * 获取卡通信息
 * @param {cartoonId} options 
 */

async function getFindCartoonDetailById(options){
    let {cartoonId} = options || {};
    let str = "id=" + (cartoonId ? cartoonId : "");
    let data = await getInfo({
        str : str,
        key : "findCartoonDetailById"
    })
    return data;
}
/**
 * 获取卡通子集列表
 * @param {cartoonId,videoId} options 
 */
async function getFindVideoListByCartoonId(options){
    let {cartoonId,videoId} = options || {};
    let str = "cartoonId=" + (cartoonId ? cartoonId : "" ) + (videoId ?  "&videoId=" + videoId : "");
    let data = await getInfo({
        str : str,
        key : "findVideoListByCartoonId"
    })
    return data;
}

/**
 * 获取游戏详情信息
 * @param {gameId} options 
 */
async function getFindGameDetailById(options){
    let {gameId} = options || {};
    let str = "id=" + (gameId ? gameId : "0");
    let data = await getInfo({
        str ,
        key : "findGameDetailById"
    })
    return data;
}

/**
 * 获取一级分类下分类列表
 * @param {parentId} options 
 */

async function getFindTypesByParentId(options){
    let {parentId} = options || {};
    let str = "parentId=" + (parentId ? parentId : "1");
    let data = await getInfo({
        str : str,
        key : "findTypesByParentId",
    })
    return data;
}
/**
 * 获取后台配置参数键值
 * @param {key } key 
 */
async function getSystemConfigByKey(options){
    let {key} = options || {};
    let str = "key=" + (key || 'sys_default_cartoon_ids');
    let data = await getInfo({
        str : str,
        key : "getSystemConfigByKey",
    })
    return data;
}



module.exports = {
    getTemplateInfo,
    getFindCommonPageInfo,
    getFindRecCommonPageInfo,
    getSelectThemeDetail,
    getSelectThemeDetailByUserId,
    getFindUserCustomByUserId,
    getFindCartoonDetailById,
    getFindVideoListByCartoonId,
    getFindGameDetailById,
    getFindTypesByParentId,
    getInfo,
    getSystemConfigByKey
}