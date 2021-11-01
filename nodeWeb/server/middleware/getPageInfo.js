const PageVO = require("../middleware/pageVo");
const interface = require("../middleware/interface");
const { getTemplateInfo, getCommonPageInfo } = require("../middleware/getTemplateInfo");
const { logError } = require("../utils/errAction");
const changeConfig = require("../utils/changeConfig");

/**
 * 响应模板信息
 * @param {*} options 
 * @param {*} req 
 * @param {*} res 
 */
async function getPageInfo(options, req, res) {

    console.time(options.contentName);

    let { basePageUrl, templateUrl, templateInfo } = await getTemplateInfo(options);

    let ajaxConfObj = changeConfig.getConfigFun(req,res);
    if(ajaxConfObj.ajaxConf.recommendPage && //是否需要获取下架内容
        (ajaxConfObj.ajaxConf.recommendPage.indexOf(req.query.contentName) >= 0 || 
        ajaxConfObj.ajaxConf.recommendPage.indexOf(req.query.contentId) >= 0 || 
        ajaxConfObj.ajaxConf.recommendPage.indexOf(req.query.contentEName) >= 0) 
        ){
        options.isRecommend = "false";
    } else {
        options.isRecommend = "true";
    }

    //输出信息
    let outInfo = {
        //页面基础文件夹地址
        basePageUrl,
        title: "",
        imgUrl: global.config.imgUrl,
        //ajax配置地址
        ajaxConf : global.config.ajaxConf,
        basePageInfo: {
            findTemplateInfo: templateInfo,
            localImg: basePageUrl + "/image/",
            reqQuery: req.query,
            nodeButtons:[],
            basePageUrl,
            logError
        },
    }
    //判断页面是否需要切换ip端口
    // let isDevice = req.cookies.isDevice;
    // if(isDevice == "true"){
    //     outInfo.imgUrl = outInfo.imgUrl.replace(/(https?)(:\/\/)[^\:]+/,global.config.deviceUrl);
    //     Object.keys(outInfo.ajaxConf).forEach((val,key,array)=>{
    //         outInfo.ajaxConf[val] = outInfo.ajaxConf[val].replace(/(https?)(:\/\/)[^\:]+/,global.config.deviceUrl)
    //     })
      
    // }

    //请求到的页面类型
    let { action } = options;
    if (!action) {
        action = templateUrl.match(/\w+/g) && templateUrl.match(/\w+/g)[0];
        if (!action) {
            logError(405, req, res)
            return;
        }
    }
    switch (action) {
        //专题
        case "column": {
            options.isRecommend = "false";
            let commonPageInfo = await interface.getFindRecCommonPageInfo(options);
            if (commonPageInfo.pageInfo) {
                outInfo.title = commonPageInfo.pageInfo.commPageCname;
            }
            outInfo.basePageInfo = {
                commonPageInfo,
                ...outInfo.basePageInfo
            }
            break;
        }
        //分类内容 
        case "category": {
            let { commonPageInfo, selectThemeDetailByUserId, title } = await getCommonPageInfo(options);
            let typesByParentInfo = await interface.getFindTypesByParentId(options);
            let findUserCustomByUserId = await interface.getFindUserCustomByUserId(options);
            outInfo.title = title;
            outInfo.basePageInfo = {
                commonPageInfo,
                findUserCustomByUserId,
                selectThemeDetailByUserId,
                typesByParentInfo,
                ...outInfo.basePageInfo
            }
            break;
        }
        //全屏播放
        case "playVideo":
        //卡通    
        case "videoDetail": {
            let { commonPageInfo, selectThemeDetailByUserId, title } = await getCommonPageInfo(options);
            let cartoonVideoList = await interface.getFindVideoListByCartoonId(options);
            let cartoonDetail = await interface.getFindCartoonDetailById(options);
            if(!cartoonDetail) cartoonDetail= cartoonVideoList && cartoonVideoList[0].cartoonInfo;
            outInfo.title = title;
            outInfo.basePageInfo = {
                commonPageInfo,
                selectThemeDetailByUserId,
                cartoonVideoList,
                cartoonDetail,
                ...outInfo.basePageInfo
            }
            break;
        }
        //游戏
        case "gameDetail": {
            let { commonPageInfo, selectThemeDetailByUserId, title } = await getCommonPageInfo(options);
            let gameDetail = await interface.getFindGameDetailById(options);
            outInfo.title = title;
            outInfo.basePageInfo = {
                commonPageInfo,
                selectThemeDetailByUserId,
                gameDetail,
                ...outInfo.basePageInfo
            }
            break;
        }
        case "personalCenter": {
            const commonParams = {
                contentId: "",
                contentName: "personalCenter",
                userId:req.query.userId,
                isRecommend: "true"
            }
            let { commonPageInfo, selectThemeDetailByUserId, title } = await getCommonPageInfo(commonParams);
            let personalCenterPageInfo = null;
            const temName = templateUrl.match(/\w+/g)[2];
            if (temName != "personalCenter") {
                // 获取个人中心配置信息信息
                const commonInfo = await getCommonPageInfo(options);
                personalCenterPageInfo = commonInfo.commonPageInfo;
                title = personalCenterPageInfo.pageInfo.commPageCname;
                personalCenterPageInfo.pageInfo.pageTemplateBgpic.picPath = commonPageInfo.pageInfo.pageTemplateBgpic.picPath
            }
            outInfo.title = title;
            outInfo.basePageInfo = {
                commonPageInfo : personalCenterPageInfo ? personalCenterPageInfo : commonPageInfo ,
                selectThemeDetailByUserId,
                personalCenterPageInfo : commonPageInfo,
                ...outInfo.basePageInfo
            }
            break;
        }
        // 首页数据
        case "mainPage": {
            options.isRecommend = "false";
            let selectThemeDetail = await interface.getSelectThemeDetail(options);
            let { commonPageInfo, selectThemeDetailByUserId, title } = await getCommonPageInfo(options);
            let findUserCustomByUserId = await interface.getFindUserCustomByUserId(options);
            outInfo.title = title;
            outInfo.basePageInfo = {
                commonPageInfo,
                findUserCustomByUserId,
                selectThemeDetailByUserId,
                selectThemeDetail,
                ...outInfo.basePageInfo,

            }
            break;
        }
        default: {
            let { commonPageInfo, selectThemeDetailByUserId, title } = await getCommonPageInfo(options);
            outInfo.title = title;
            outInfo.basePageInfo = {
                commonPageInfo,
                selectThemeDetailByUserId,
                ...outInfo.basePageInfo,

            }
        }
    }
    //页面背景图 
    if (outInfo.basePageInfo.commonPageInfo.pageInfo && outInfo.basePageInfo.commonPageInfo.pageInfo.pageTemplateBgpic) {
        outInfo.basePageInfo.bgImg = outInfo.imgUrl + outInfo.basePageInfo.commonPageInfo.pageInfo.pageTemplateBgpic.picPath;
    }


    res.format({
       

        'text/html': function () {
            res.setHeader('Accept-Ranges', 'bytes');
            res.render(templateUrl, outInfo);
            if(outInfo){
                //设置redis缓存
                global.redis.set(req.url,outInfo,global.config.redisConfig.defaultExpireTime);
            }

            console.timeEnd(options.contentName);
        },

        'application/json': async function () {
            //读取redis缓存
            let RedisOutInfo = await global.redis.get(req.url.replace(/\?times=[\d]*/g,""));
            if(RedisOutInfo){
                res.status(200).send(RedisOutInfo);
            }else{
                res.status(200).send(outInfo);
            }


        },
        'text/plain': function () {
            res.status(200).json(outInfo);
        },

        'default': function () {
            // log the request and respond with 406
            res.status(406).send('Not Acceptable');
        }
    })
}

//页面请求封装
async function  getMainPageInfo(req, res) {
    let contentName = req.query.contentName;
    //接口出现两个
    if (contentName) {
        req.query.contentName = Object.prototype.toString.call(contentName) == "[object String]" ? contentName : contentName[0];
    }

    let options = {
        baseUrl: req.path,
        basePageURL: "",
        ...req.query
    };
    let pageVo = new PageVO(options);
    let accept = req.headers.accept;
    switch(accept){
        case "application/json":
             //读取redis缓存
             let RedisOutInfo = await global.redis.get(req.url.replace(/\?times=[\d]*/g,""));
             if(RedisOutInfo){
                 res.status(200).send(RedisOutInfo);
             }else{
                  getPageInfo(pageVo, req, res);
             }
        break;
        default:
            getPageInfo(pageVo, req, res);
           

    }
    

}

module.exports = {
    getPageInfo,
    getMainPageInfo
}