/*
 * @LastEditors: jwzx
 * @LastEditTime: 2020-08-05 17:12:37
 */ 


const multipart = require("connect-multiparty");
const multipartMiddleware = multipart();

const Proxy = require("../utils/http");








module.exports = function (app) {
   

    //页面求接口
    app.use(`/${global.config.projectName}`, require("./commPage"));
    //node接口

    app.use(`/nodeApi`, require("./nodeApi"));
    //转发请求
     global.config.proxyConfArr.forEach((val,index,arr)=>{
        app.use(val.routerRegExp,multipartMiddleware,(req,res)=>{
            new Proxy().init(req,res,val);
        })
    })


   




}