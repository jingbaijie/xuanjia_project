/*
 * @Description: 
 * @Author: jwzx
 * @Date: 2020-07-20 14:27:05
 * @LastEditTime: 2020-08-17 17:59:37
 * @LastEditors: jwzx
 */
const fs = require("fs");
const path = require("path");
const logger = require("./logger");

function redirectUrl(req, res, next) {
    let url = req.originalUrl;
    let originalUrl = url &&  url.split("?")[0] || "";
    let projectName = originalUrl && originalUrl.split("/")[1] || global.config.projectName ;

    if (originalUrl === "/" + global.config.projectName + "/commPage") {
        var reg = new RegExp(/(contentId=\d+|contentName=[a-zA-Z0-9_]+)/g);
        if (reg.test(url)) {
            if(url.indexOf(config.errTipUrl) > -1){
                res.render("orderPage/html/404.ejs",{
                    title : '404页面',
                    basePageUrl: "HD/web/orderPage",
                    basePageInfo : {}
                });
                return;
            }
            url = url.replace(/(contentId=\d+|contentName=[a-zA-Z0-9_]+)/g, config.errTipUrl);
        } else {
            url = url.indexOf("?") > -1 ? (url + "&" + config.errTipUrl) : (url + "?" + config.errTipUrl);
        }
        if (url.indexOf(global.config.projectName) === -1) {
            url = "/" + global.config.projectName + url;
        }
        res.redirect(url);
    }

    global.config.errTipUrlArr.forEach(element => {
        if (element.projectName === projectName) {
            let htmlUrl = path.join(__dirname, "../static" + element.redirectUrl);
            fs.readFile(htmlUrl, (err, data) => {
                if (err) {
                    logger.error(err)
                    res.redirect("/");
                    return
                } 
                let html = data.toString();
                res.send(html);
                return ;
            });
        }
    });
    //当所有路由都匹配不上的时候，就直接走error页面
    let errPageUrl = path.join(__dirname,"../static/index.html");
    fs.readFile(errPageUrl,(err,data)=>{
        if(err) {
            logger.error(err);
            res.redirect("/");
            return;
        }
        let html = data.toString();
        res.send(html);
        return;
    })


}

/**
  * 异常处理
  * 404:路由,
  * 405:模板,
  * 500:其他代码错误,
  * 600:服务器错误,
  * 603:服务器code错误,
  * 604:请求错误,
  */
const errorCollections = {
    404: {
        name: "noRouter",
        type: "Router",
        message: '无此路由'
    },
    405: {
        name: "noTemplate",
        type: "Template",
        message: '找不到模板',
        func: function (err, req, res, next) {
            redirectUrl(req,res,next,err);
        }
    },
    408 : {
        name : "request timeout",
        type : "Timeout",
        message : "请求超时",
        func : function(err,req,res,next){
            redirectUrl(req,res,next,err);
        }
    },
    504: {
        name: "responseError",
        type: "Response",
        message: "返回数据错误"
    },
    505: {
        name: "paramsError",
        type: "Params",
        message: "参数错误"
    },
}

const logError = function (err, req, res, next) {
    if (!err) {
        throw new Error('logError must have param:err');
    } else {
        const paramType = typeof (err);
        if (paramType === "number" || paramType === "string") {
            const errorData = errorCollections[err];
            if (errorData) {
                if (req) {
                    logger.error(`${err} - ${errorData.name} - ${errorData.message} - ${req.originalUrl} - ${req.ip} - ${req.method}`);
                } else {
                    logger.error(`${err} - ${errorData.name} - ${errorData.message}`);
                }
                errorData.func && errorData.func(err, req, res, next);
            } else {
                throw new Error(`errorCollections not have data:${err}`);
            }
        } else if (paramType === "object") {
            if (req) {
                logger.error(`${err.code} - ${err.name} - ${err.message} - ${req.originalUrl} - ${req.ip} - ${req.method}`);
            } else {
                logger.error(`${err.code} - ${err.name} - ${err.message}`);
            }

        } else {
            throw new Error(`err must be string || number || object`);
        }
    }
}

const errTip = function (err, req, res, next) {
    logger.error(`${err.status || 500} - ${err.stack} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    redirectUrl(req,res,next)
}

module.exports = { logError, errTip,redirectUrl }
