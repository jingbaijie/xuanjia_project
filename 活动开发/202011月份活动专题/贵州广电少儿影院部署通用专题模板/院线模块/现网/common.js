// 1，公共工具方法；    2，院线新增接口方法
//***********************************************************************************************************院线（cinema line）公共工具方法
var CL = {};
(function () {
    function CinemaLine() {
        /**
         * 跳转至推荐页面 
         * @param outJson 页面配置信息
         * @param recommend    需跳转页面的推荐类型名称
         * @param index    需跳转页面的的推荐详情编号
         * @example
         *      CL.toAnterRecommendUrl(outJson,"recommend_1",0);
        */
        this.toAnterRecommendUrl = function (outJson, recommend, index) {
            if (recommend && outJson[recommend]) {
                var recommendmap = outJson[recommend][index];
            } else {
                var recommendmap = outJson;
            }
            var recommendDisplayType = recommendmap.recommendDisplayType;
            //推荐详表显示的类型 0 游戏 1 卡通 2视频 3 跳转指定地址 4 通用页面id 5 活动id 6专题 7分类内容 8卡通需要鉴权 88其它
            switch (recommendDisplayType) {
                case 1:
                    //卡通，预处理调用CT里面的该方法，因为配的卡通默认跳卡通列表视频详情页，这里改成院线详情页
                    recommendmap.commpageName = 'seyyxqy';
                    recommendmap.commpageId = 'seyyxqy';
                    CT.toAnterRecommendUrl(recommendmap);
                    break;
				case 6:
					var params = {
						contentId: recommendmap.commpageId,
						action: recommendmap.commpageName,
						contentType: "column"
					}
					CT.getAnterByIdOrAction(params);
					break;
                default:
                    break;
            }
        };
        /**
         * 返回到院线首页
         * 
         */
        this.backCinemalMainPage = function() {
            var _this = this;
            var params = {
                contentId: "seyyym",
                //curFocusId: prePageFocusID,
                contentType: "page"
            };
            CT.getAnterByIdOrAction(params);
        };
    };
    CL = new CinemaLine();
})();


//***********************************************************************************************************院线（cinema line）公共接口请求方法
var interfaceCL = {
    //测试网
    tokenUrl: AjaxConfig.origin + '/order_gzgd/api/order/',
    //现网
    // tokenUrl: document.URL.match(/(http|https)(:\/\/)[^\/]+/g)[0] + "/order_gzgd/order/",
    /**
     * ajax请求
     * @param data ajax请求需要的数据
     *		  data.url			请求的地址
     *		  data.params		请求的参数
     *        data.ajaxConfig   请求的配置，可以配置method，async，ContentType，如果不配置取默认值
     * @param callback 请求成功之后的回调函数
     */
    ajax: function (data, callback, cb) {
        var url = data.url;
        var params = data.params || {};
        params.times = new Date().getTime();
        var ajaxConfig = data.ajaxConfig || {};
        var method = ajaxConfig.method || "get";
        var async = ajaxConfig.async == 'useFalse' ? 'useFalse' : true;
        var ContentType = ajaxConfig.ContentType || "json";
        ajax.init({
            url: url,
            method: method,
            params: params,
            async: async,
            ContentType: ContentType,
            success: function (e) {
                cb && cb(e)
                callback && callback(e);
            },
            fail: function (status) {
                var dataType = CT.dataType(status);
                if (dataType == 'string') {
                    status = '请求接口失败：' + status;
                } else if (dataType == 'object') {
                    status.request = '请求接口失败!';
                } else if (dataType == 'array') {
                    status.push('请求接口失败!');
                } else {
                    status = '请求接口失败：' + CT.jsonToString(status);
                }
                callback && callback(status);
            }
        });
    },
    /**
     * 单片点播订购产品详情接口
     * @param params contentId:内容ID（现在就传卡通ID） orderContentType：订购内容类型：1专题，2活动，3节目集，4游戏，5节目，66其他（这个目前直接传3就可以了）
            {
                contentId: cartoonId,
                orderContentType: 3
            }
     * @param callback 请求成功之后的回调函数
     * 接口输出参数：
            {
                "data": [
                    {
                        "contentPriceType": 1,  //内容计费类型：1单次，2全站整包
                        "courseCname": "单一片单统一设置价格",  //中文名称
                        "ename": "dypdtyszjg",  //英文简写
                        "id": 2,  //ID
                        "memberPrice": 1.00,  //会员价格
                        "orderContentType": "3",   //订购内容类型：1专题，2活动，3节目集，4游戏，5节目，66其他
                        "orderProductType": 2,  //订购产品所属表：1内容定价表，2计费产品表   在确认订单时需要传递到后台
                        "periodType": "DAY",  //订购周期：HOUR,DAY，WEEK，MONTH，YEAR
                        "periodValue": "1",  //周期值   tip: periodType为HOUR,periodValue为1则是1小时
                        "movieName": "学会观察篇（1-2年级）", // 影片名称
                        "price": 1.00,  //价格  这个页面展示的价格
                        "priceDesc": "价格描述",  //价格描述
                        "promotionalPrice": 1.00  //促销价格
                    }
                ],
                "errorCode": "1000",
                "errorMsg": "操作成功",
                "successFlg": 1
            }
     * 使用方式：interface.getOrderMovieInfo(data, function() {});
     */
    getOrderMovieInfo: function (data, callback) {
        var _this = this;
        data = data || {};
        var params = data.params
        var ajaxConfig = data.ajaxConfig || {};
        callback = callback || function () { }
        var url = interface.interfaceUrl + "selectOrderProductInfo";
        var data = {
            url: url,
            params: params,
            ajaxConfig: ajaxConfig
        };
        _this.ajax(data, callback);
    },
    /**
     * 单片点播订购产品 二维码 详情接口
     * @param params
            {
                userId: ,//用户ID
                ordertype: ,//订单类型 4单片点播
                contentId: ,//内容片单ID
                contentCname: ,//内容片单名称
                fromType: ,//内容片单类型 3节目集
            }
     * @param callback 请求成功之后的回调函数
     * 接口输出参数：
            {
                "data": {
                    "orderId": "100013855096",  订单ID
                    "orderProductId": "1",   // 单片点播订购产品ID
                    "orderProductType": "2",  // 订购产品所属表：1内容定价表，2计费产品表
                    "qrCodeUrl": "http://localhost:8080/xj_base_boot_war_exploded/api/order/getQRCodeUrl?orderId=100013855096&productName=null&fee=1.90&userId=1111",    // 二维码地址
                    "userId": "1111"  // 用户ID
                },
                "errorCode": "1000",
                "errorMsg": "操作成功",
                "successFlg": 1
            }
     * 使用方式：interface.getOrderMovieQRCode(data, function() {});
     */
    getOrderMovieQRCode: function (data, callback) {
        var _this = this;
        data = data || {};
        var params = data.params
        var ajaxConfig = data.ajaxConfig || {};
        callback = callback || function () { }
        var url = _this.tokenUrl + "getQRCode";
        var data = {
            url: url,
            params: params,
            ajaxConfig: ajaxConfig
        };
        _this.ajax(data, callback);
    },
    /**
     * 单片点播订购产品 二维码订购状态 详情接口
     * @param params
            {
                orderId:订单ID
            }
     * @param callback 请求成功之后的回调函数
     * 接口输出参数：  
            {
                "data": {
                    "orderState": 0 // 订单支付状态：0待支付，1支付成功，2支付失败，3已退订
                },
                "errorCode": "1000",
                "errorMsg": "操作成功",
                "successFlg": 1
            }
     * 使用方式：interface.getOrderMovieQRCodeStatus(data, function() {});
     */
    getOrderMovieQRCodeStatus: function (data, callback) {
        var _this = this;
        data = data || {};
        var params = data.params
        var ajaxConfig = data.ajaxConfig || {};
        callback = callback || function () { }
        var url = _this.tokenUrl + "getQRCodeOrderState";
        var data = {
            url: url,
            params: params,
            ajaxConfig: ajaxConfig
        };
        _this.ajax(data, callback);
    },
}







