/*
 * @LastEditors: jwzx
 * @LastEditTime: 2020-08-12 11:25:11
 */
const request = require("request");
const logger = require("./logger");
const Result = require("./result");

/**
 * @description:promise http get请求 
 * @param {地址为手工拼接好的url} 
 * @return: 依据接口返回的errorCode === "1000" 成功返回body.data 失败输出body
 */
const sendQuest = function(url) {
    return new Promise((resolve, reject) => {
        request({
            url:url,
            timeout : 0 
            
        }, (err, res, body) => {
            if (err) {
                logger.error(`604 - 请求错误 - ${url}`);
                if (res) {
                    res.status(200).json(new Result().ERROR(`请求结果失败${url}`));
                } else {
                    logger.error(`600 - 服务器错误 - ${url}`);
                }
                reject(err);
            } else {
                const resData = JSON.parse(body);
                if(resData.errorCode == '1000' && resData.data){
                    logger.info("SUCCESS!:" + url);
                    resolve(resData.data);
                } else {
                    logger.error(`603 - 结果为空或接口返回异常 - ${url}:${JSON.stringify(resData)}`);
                    resolve("");
                }
            }
        });
    }).catch((err)=>{
        logger.error(err)
    })
};

/**
 * @description: 封装的$req
 * @param {url:不需要拼接的方法名,params:参数json} 
 * @return: 返回值同sendQuest
 */
const requestUrl = function(url,params) {
    params = params ? params : {}
    const reqParams = Object.keys(params).map(function (key) {  
        return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
    }).join("&")
    return sendQuest(apiUrl + reqApi[url] + "?" + reqParams)
}

module.exports = {sendQuest,requestUrl}



