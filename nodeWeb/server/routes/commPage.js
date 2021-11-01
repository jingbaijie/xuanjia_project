/*
 * @LastEditors: jwzx
 * @LastEditTime: 2020-10-27 12:49:00
 */

const express = require("express");
const router = express.Router();
const { getMainPageInfo } = require("../middleware/getPageInfo");
const interface = require("../middleware/interface");
const logger = require("../utils/logger");
const Result = require("../utils/result");

router.get("/commPage", function (req, res) {
    getMainPageInfo(req, res);
})

router.all("/log\??", function (req, res) {
    let loggerInfo = "";
    if (req.method == "POST") {
        loggerInfo = req.body.log;
    } else {
        loggerInfo = req.query.log;
    }
    logger.info("loggerInfo>>>>>>" + loggerInfo);
    res.status(200).json(new Result().SUCCESS());

})

//生成ajaxConf 配置文件

router.get("/HD/js/config.js",async (req,res) => {
    var ajaxConf = global.config.ajaxConf && JSON.stringify(global.config.ajaxConf);
    ajaxConf = `var ajaxConf = ${ajaxConf};`;
   if(global.config.ajaxConf.SystemConfigKeys) {
        if(global.config.ajaxConf.SystemConfigKeys instanceof Array) {
            ajaxConf += "ajaxConf.SystemConfigKeys = {};";
            // global.config.ajaxConf.SystemConfigKeys.forEach( async function(key){
            for(var idx in global.config.ajaxConf.SystemConfigKeys) {
                key = global.config.ajaxConf.SystemConfigKeys[idx];
                if(key) {
                    var options={key: key.trim()};
                    let systemConfig = await interface.getSystemConfigByKey(options);
                    if(systemConfig) {
                        delete systemConfig["remark"];
                        delete systemConfig["updateTime"];
                        delete systemConfig["updateBy"];
                        delete systemConfig["createTime"];
                        delete systemConfig["createBy"];
                        ajaxConf += "ajaxConf.SystemConfigKeys." + key + "=" + JSON.stringify(systemConfig) + ";";
                    }
                }
            }
            // });
        }
   }
   res.send(ajaxConf);
});


//没有匹配路由就直接跳转到首页
router.get(/\/|(\/HD\/index.html)/, async (req, res) => {
    let {action=""} = req.query;
    let contentIdArr = action.split('_')
	let len = contentIdArr.length
    let type = len > 1 ? contentIdArr[1] : '';
    let opts = {
        contentName : "loginportal_2019v1"
    }

    if(action && type != 0 && type != 1){
        opts.contentName =  action;
    }
    let basePageInfo = await interface.getFindCommonPageInfo(opts);

    res.render("index", {
        title: "登录入口",
        imgUrl: global.config.imgUrl,
        ajaxConf : global.config.ajaxConf,
        basePageInfo
    });
})





module.exports = router;


