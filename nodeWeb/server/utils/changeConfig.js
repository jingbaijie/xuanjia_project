/*
 * @Description: 
 * @Author: jwzx
 * @Date: 2020-11-26 14:57:18
 * @LastEditTime: 2020-11-26 15:23:46
 * @LastEditors: jwzx
 */

 let changeConfig = {
        /**
         * 判断是否从测试设备输出
         * @param {*} req 
         * @param {*} res 
         */
        isDevice : function(req,res){
            let _this = this;
            let isDevice = req.cookies.isDevice;
            if(isDevice == "true" && global.config.deviceUrl ){
                return true;
            }else{
                return false;
            }
        },
        /**
         * 获取更新后config
         * @param {*} req 
         * @param {*} res 
         */
        getConfigFun : function(req,res){
            let _this = this;
            let ajaxConfig = JSON.parse(JSON.stringify(global.config));
            if(_this.isDevice(req,res)){
                ajaxConfig.imgUrl = ajaxConfig.imgUrl.replace(/(https?)(:\/\/)[^\:]+/,global.config.deviceUrl);
                Object.keys(ajaxConfig.ajaxConf).forEach((val,key,array)=>{
                    if(typeof(ajaxConfig.ajaxConf[val]) === "string" && ajaxConfig.ajaxConf[val].indexOf("http") >= 0) {
                        ajaxConfig.ajaxConf[val] = ajaxConfig.ajaxConf[val].replace(/(https?)(:\/\/)[^\:]+/,global.config.deviceUrl)
                    } 
                })
            }

            return ajaxConfig;
        
        }
 }


module.exports = changeConfig;
 