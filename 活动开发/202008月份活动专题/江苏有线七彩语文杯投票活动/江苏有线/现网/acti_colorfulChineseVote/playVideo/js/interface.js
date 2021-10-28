var interface = {
    //接口地址
    //interfaceUrl:"http://180.96.20.178:8097/iptv-web-api/api/web/",
    //页面相关接口
    interfaceUrl: AjaxConfig.interfaceUrl,
	voteInterface:"http://172.31.183.147:8090/iptv-web-api-vote/api/web/",
        //活动相关接口
        actInterfaceUrl: AjaxConfig.actInterfaceUrl,
        /**
         * ajax请求
         * @param data ajax请求需要的数据
         *		  data.url			请求的地址
         *		  data.params		请求的参数
         *        data.ajaxConfig   请求的配置，可以配置method，async，ContentType，如果不配置取默认值
         * @param callback 请求成功之后的回调函数
         */
        ajax: function(data, callback, cb) {
            var url = data.url;
            var params = data.params || {};
            params.times = new Date().getTime();
            var ajaxConfig = data.ajaxConfig || {};
            var method = ajaxConfig.method || "get";
            var async = ajaxConfig.async || false;
            var ContentType = ajaxConfig.ContentType || "json";
            ajax.init({
                url: url,
                method: method,
                params: params,
                async: async,
                ContentType: ContentType,
                success: function(e) {

                    callback && callback(e);
                    cb && cb(e);
                },
                fail: function(status) {

                    callback && callback(status);
                }
            });
        },
        /**
         * 	 * 获取播放串url
         * 	 	 * @param params 请求接口的参数 userCode assetID spCode targetSystemID devicetype
         * 	 	 	 * @param callback 请求回调函数
         * 	 	 	 	 * 接口输出参数：{	}
         * 	 	 	 	 	 * 使用方式：interface.findPlayUrlByMediaCode(data，function(){});
         * 	 	 	 	 	 	 * http://172.31.231.229:28080/jsyx/order/jsyxInterfaceForward?userCode=&assetID=&spCode=&targetSystemID=&devicetype=
         * 	 	 	 	 	 	 	 */

        findPlayUrlByMediaCode: function(data, callback) {
            var _this = this;
            var userCode = xjDataLog.getUserId();
            var param = {
                    spCode: "SP1N02A00_08_030",
                    targetSystemID: "30-S",
                    devicetype: 6,
                    userCode: userCode,
                    assetID: data.assetID
                }
                //alert('userCode >>>> '+userCode);
                //alert('interfaceUrl'+_this.interfaceUrl);
            _this.ajax({
                //	url: "http://172.31.231.229:28080/jsyx/order/jsyxInterfaceForward",
                url: AjaxConfig.origin + "/jsyx/order/jsyxInterfaceForward",
                params: param || {},
                ajaxConfig: data.ajaxConfig || {}
            }, callback);
        },
        /**
         * 请求通用页面信息
         * @param params 请求接口的参数 contentId ：内容编号 或 contentName	： 页面英文名称
         * 接口输出参数：{	successFlg		成功标识，1：成功，0：失败
         *				  	resultCode		错误码
         *			     	resultMsg		错误描述
         *					data	pageInfo	booleanUp
         *			     			            commPageCname
         *				 	 					commonPageInfo	公用头部LOGO，分类，个人中心配置
         *				 	        recommend_1 数组	页面的具体配置信息 }
         * 使用方式：interface.findCommonPageInfo(data，function（）｛｝);
         */
        findCommonPageInfo: function(data, callback) {
            //alert("请求通用页面信息请求通用页面信息参数：");
            var _this = this;
            var params = data.params || {};
            var ajaxConfig = data.ajaxConfig || {};
            callback = callback || function() {};
            var url = _this.voteInterface + "findCommonPageInfo";
            //alert(window.location.href)
            var ajaxData = {
                url: url,
                params: params,
                ajaxConfig: ajaxConfig
            };
            _this.ajax(ajaxData, callback, function(e) {
                setLoggerInfo.pageInfoLog = e;
            });
        },
        /**
         * 请求通用页面的地址
         * @param params 请求接口的参数 contentId ：内容编号，每个坑对对应的commPageId或者是commPageEname
         * @param callback 请求成功之后的回调函数
         * 接口输出参数：{	successFlg		成功标识，1：成功，0：失败
         *				  	resultCode		错误码
         *			     	resultMsg		错误描述
         *					data	        data.templateUrl  跳转地址  例如：/HD/web/videoDetail/html/videoDetail.html
         * 使用方式：interface.findTemplateInfo(data，function（）｛｝);
         */
        findTemplateInfo: function(params, callback) {
            var _this = this;
            params = params || {};
            callback = callback || function() {}
            var url = _this.interfaceUrl + "findTemplateInfo";
            var data = {
                url: url,
                params: params
            };
            _this.ajax(data, callback);
        },
        /**
         * 获取用户的详情信息
         * @param params 请求接口的参数 contentId ：内容编号（用户编号userId）[ searchName（暂未使用）]
         * @param callback 请求成功之后的回调函数
         * 接口输出参数:{
         *                  successFlg	成功标识，1：成功，0：失败
         *					resultCode	错误码
         *					resultMsg	错误描述
         *					data	    用户数据
         *           }
         * 使用方式：interface.findUserDetailByUserId(data，function（）｛｝);
         */
        findUserDetailByUserId: function(params, callback) {
            var _this = this;
            params = params || {};
            callback = callback || function() {}
            var url = _this.interfaceUrl + "findUserDetailByUserId";
            var data = {
                url: url,
                params: params
            };
            _this.ajax(data, callback);
        },
        /**
         * 修改用户的详情信息
         * @param params 请求接口的参数 userId ：内容编号（用户编号userId）userInfo：待定
         * @param callback 请求成功之后的回调函数
         * 接口输出参数:{
         *                  successFlg	成功标识，1：成功，0：失败
         *					resultCode	错误码
         *					resultMsg	错误描述
         *					data	    用户数据
         *           }
         * 使用方式：interface.updateUserInfo(data，function（）｛｝);
         */
        updateUserInfo: function(params, callback) {
            var _this = this;
            params = params || {};
            callback = callback || function() {}
            var url = _this.interfaceUrl + "updateUserInfo";
            var data = {
                url: url,
                params: params
            };
            _this.ajax(data, callback);
        },
        /**
         * 获取游戏详情接口
         * @param params 请求接口的参数userId 用户名， contentId ：内容编号（游戏ID编号），[ isFree：0免费1收费 ][ booleanUp ：0下架  2上架  默认上架 ][ flag：0最新 1非最新]
         * @param callback 请求成功之后的回调函数
         * 接口输出参数:{
         *                  successFlg	成功标识，1：成功，0：失败
         *					resultCode	错误码
         *					resultMsg	错误描述
         *					data	    游戏详情
         *           }
         * 使用方式：interface.findGameDetailById(data，function（）｛｝);
         */
        findGameDetailById: function(data, callback) {
            var _this = this;
            var params = data.params || {};
            var ajaxConfig = data.ajaxConfig || {};
            callback = callback || function() {};
            var url = _this.interfaceUrl + "findGameDetailById";
            var ajaxData = {
                url: url,
                params: params,
                ajaxConfig: ajaxConfig
            };
            _this.ajax(ajaxData, callback);
        },
        /**
         * 获取通过卡通id获取这个卡通下所有视频详情列表
         * @param params 请求接口的参数，有两种请求方式，传videoId获取单个视频的详情，传cartoonId获取视频集合
         *                （1）videoNumber ：视频集数（非必传，传则表示查询指定卡通下第几集视频的详情）
         *                （2）cartoonId ： 卡通ID  必传
         *                （3）videoId ： 视频集Id  非必传(和videoNumber二选一)
         * @param callback 请求成功之后的回调函数
         * 接口输出参数:{
         *                  successFlg	成功标识，1：成功，0：失败
         *					resultCode	错误码
         *					resultMsg	错误描述
         *					data	    视频详情
         *           }
         * 使用方式：interface.findVideoListByCartoonId(data，function（）｛｝);
         * 使用方式：interface.findVideoDetailById(data，function（）｛｝);
         */
        findVideoListByCartoonId: function(data, callback) {
            var _this = this;
            var params = data.params || {};
            var ajaxConfig = data.ajaxConfig || {};
            callback = callback || function() {};
            var url = _this.voteInterface + "findVideoListByCartoonId";
            var ajaxData = {
                url: url,
                params: params,
                ajaxConfig: ajaxConfig
            };
            _this.ajax(ajaxData, callback);
        },
        findVideoDetailById: function(data, callback) {
            var _this = this;
            var params = data.params || {};
            var ajaxConfig = data.ajaxConfig || {};
            callback = callback || function() {};
            var url = _this.interfaceUrl + "findVideoDetailById";
            var ajaxData = {
                url: url,
                params: params,
                ajaxConfig: ajaxConfig
            };
            _this.ajax(ajaxData, callback);
        },
        /**
         * 获取卡通详情接口
         * @param params 请求接口的参数 [contentId ：内容编号（卡通详情编号）][isFree:0免费 1不免费][searchFlag:不为null表示开启搜索接口][cartoonCname:开启搜索前提下，填入的卡通中文名称,必填][cartoonEname:开启搜索前提下，填入的卡通英文名称,必填]
         * @param callback 请求成功之后的回调函数
         * 接口输出参数:{
         *                  successFlg	成功标识，1：成功，0：失败
         *					resultCode	错误码
         *					resultMsg	错误描述
         *					data	    视频详情
         *           }
         * 使用方式：interface.findCartoonDetailById(data，function（）｛｝);
         */
        findCartoonDetailById: function(data, callback) {
            var _this = this;
            var params = data.params || {};
            var ajaxConfig = data.ajaxConfig || {};
            callback = callback || function() {};
            var url = _this.voteInterface + "findCartoonDetailById";
            var ajaxData = {
                url: url,
                params: params,
                ajaxConfig: ajaxConfig
            };
            _this.ajax(ajaxData, callback);
        },
        /**
         * 获取活动详情接口
         * @param params 请求接口的参数 contentId ：内容编号（本接口为表njxj_activity_detail_tab的ID，指活动期数）[searchName:搜索关键字（暂未使用）]
         * @param callback 请求成功之后的回调函数
         * 接口输出参数:{
         *                  successFlg	成功标识，1：成功，0：失败
         *					resultCode	错误码
         *					resultMsg	错误描述
         *					data	    视频详情
         *           }
         * 使用方式：interface.findActivityDetailById(data，function（）｛｝);
         */
        findActivityDetailById: function(params, callback) {
            var _this = this;
            params = params || {};
            callback = callback || function() {}
            var url = _this.actInterfaceUrl + "findActivityDetailById";
            var data = {
                url: url,
                params: params
            };
            _this.ajax(data, callback);
        },
        /**
         * 获取奖品详情接口
         * @param params 请求接口的参数 contentId ：内容编号（ID，即奖品编号）[searchName:搜索关键字（暂未使用）]
         * @param callback 请求成功之后的回调函数
         * 接口输出参数:{
         *                  successFlg	成功标识，1：成功，0：失败
         *					resultCode	错误码
         *					resultMsg	错误描述
         *					data	    视频详情
         *           }
         * 使用方式：interface.findPrizeById(data，function（）｛｝);
         */
        findPrizeById: function(params, callback) {
            var _this = this;
            params = params || {};
            callback = callback || function() {}
            var url = _this.interfaceUrl + "findPrizeById";
            var data = {
                url: url,
                params: params
            };
            _this.ajax(data, callback);
        },
        /**
         * 获取任务详情接口
         * @param params 请求接口的参数 contentId ：内容编号（ID，即任务编号）[searchName:搜索关键字（暂未使用）]
         * @param callback 请求成功之后的回调函数
         * 接口输出参数:{
         *                  successFlg	成功标识，1：成功，0：失败
         *					resultCode	错误码
         *					resultMsg	错误描述
         *					data	    视频详情
         *           }
         * 使用方式：interface.findMissionById(data，function（）｛｝);
         */
        findMissionById: function(params, callback) {
            var _this = this;
            params = params || {};
            callback = callback || function() {}
            var url = _this.interfaceUrl + "findMissionById";
            var data = {
                url: url,
                params: params
            };
            _this.ajax(data, callback);
        },
        /**
         * 获取用户黑白名单详情接口
         * @param params 请求接口的参数 ｛contentId ：内容编号（本接口指userId，不能为空）[searchName:搜索关键字（暂未使用）]
         * @param callback 请求成功之后的回调函数
         * 接口输出参数:{
         *                  successFlg	成功标识，1：成功，0：失败
         *					resultCode	错误码
         *					resultMsg	错误描述
         *					data	    视频详情
         *           }
         * 使用方式：interface.findWhithBlackDetailById(data，function（）｛｝);
         */
        findWhithBlackDetailById: function(params, callback) {
            var _this = this;
            params = params || {};
            callback = callback || function() {}
            var url = _this.interfaceUrl + "findWhithBlackDetailById ";
            var data = {
                url: url,
                params: params
            };
            _this.ajax(data, callback);
        },
        /**
         * 获取家长锁详情接口
         * @param params 请求接口的参数 contentId ：内容编号（本接口指userId，不能为空）[searchName:搜索关键字（暂未使用）]
         * @param callback 请求成功之后的回调函数
         * 接口输出参数:{
         *                  successFlg	成功标识，1：成功，0：失败
         *					resultCode	错误码
         *					resultMsg	错误描述
         *					data	    视频详情
         *           }
         * 使用方式：interface.findUserLockById(data，function（）｛｝);
         */
        findUserLockById: function(params, callback) {
            var _this = this;
            params = params || {};
            callback = callback || function() {}
            var url = _this.interfaceUrl + "findUserLockById";
            var data = {
                url: url,
                params: params
            };
            _this.ajax(data, callback);
        },
        /**
         * 修改家长锁详情接口
         * @param params 请求接口的参数 userId ：内容编号（本接口指userId，不能为空）content：密码
         * @param callback 请求成功之后的回调函数
         * 接口输出参数:{
         *                  successFlg	成功标识，1：成功，0：失败
         *					resultCode	错误码
         *					resultMsg	错误描述
         *					data	    视频详情
         *           }
         * 使用方式：interface.updateUserLock(data，function（）｛｝);
         */
        updateUserLock: function(params, callback) {
            var _this = this;
            params = params || {};
            callback = callback || function() {}
            var url = _this.interfaceUrl + "updateUserLock";
            var data = {
                url: url,
                params: params
            };
            _this.ajax(data, callback);
        },
        /**
         * 获取卡通下所有视频列表接口  (不需要，同findVideoDetailById)
         * @param params 请求接口的参数 contentId ：内容编号（本接口指卡通id，不能为空）[searchName:搜索关键字（暂未使用）]
         * @param callback 请求成功之后的回调函数
         * 接口输出参数:{
         *                  successFlg	成功标识，1：成功，0：失败
         *					resultCode	错误码
         *					resultMsg	错误描述
         *					data	    视频详情
         *           }
         * 使用方式：interface.findVideosByCartoonId(data，function（）｛｝);
         */
        findVideosByCartoonId: function(params, callback) {
            var _this = this;
            params = params || {};
            callback = callback || function() {}
            var url = _this.interfaceUrl + "findVideosByCartoonId";
            var data = {
                url: url,
                params: params
            };
            _this.ajax(data, callback);
        },
        /**
         * 获取父标签下所有子标签列表接口
         * @param params 请求接口的参数 parentId ：内容编号（父标签id，不能为空）可以查看njxj_product_type 表
         * 	       等级查询，如果输入parentId =0则查询炫佳乐园和绚丽动漫的所有集合，如果输入的1查询绚丽动漫的最高级列表，如果输入的2则查询炫佳乐园最高级列表.....
         * @param callback 请求成功之后的回调函数
         * 接口输出参数:{
         *                  successFlg	成功标识，1：成功，0：失败
         *					resultCode	错误码
         *					resultMsg	错误描述
         *					data	    详情
         *           }
         * 使用方式：interface.findTypesByParentId(data，function（）｛｝);
         */
        findTypesByParentId: function(params, callback) {
            var _this = this;
            params = params || {};
            callback = callback || function() {}
            var url = _this.interfaceUrl + "findTypesByParentId";
            var data = {
                url: url,
                params: params
            };
            _this.ajax(data, callback);
        },
        /**
         * 获取标签下所有内容列表接口
         * @param params 请求接口的参数 typeId ：内容编号（具体标签类型id，不能为空）可以查看njxj_product_type_binding_tab 表
         *         njxj_product_type_binding_tab表绑定了njxj_product_type 表，njxj_product_type_binding_tab的typeId是njxj_product_type的id
         * @param callback 请求成功之后的回调函数
         * 接口输出参数:{
         *                  successFlg	成功标识，1：成功，0：失败
         *					resultCode	错误码
         *					resultMsg	错误描述
         *					data	    详情
         *           }
         * 使用方式：interface.findContentsByTypeId(data，function（）｛｝);
         */
        findContentsByTypeId: function(params, callback) {
            var _this = this;
            params = params || {};
            callback = callback || function() {}
            var url = _this.interfaceUrl + "findContentsByTypeId";
            var data = {
                url: url,
                params: params
            };
            _this.ajax(data, callback);
        },
        /**
         * 获取用户收藏内容列表接口
         * @param params 请求接口的参数 contentId ：内容编号（userId，不能为空）[contenType 0所有，1游戏，2视频。]
         * @param callback 请求成功之后的回调函数
         * 接口输出参数:{
         *                  successFlg	成功标识，1：成功，0：失败
         *					resultCode	错误码
         *					resultMsg	错误描述
         *					data	    详情
         *           }
         * 使用方式：interface.findCollectsByUserId(data，function（）｛｝);
         */
        findCollectsByUserId: function(data, callback) {
            var _this = this;
            var params = data.params || {};
            var ajaxConfig = data.ajaxConfig || {};
            callback = callback || function() {};
            var url = _this.interfaceUrl + "findCollectsByUserId";
            var ajaxData = {
                url: url,
                params: params,
                ajaxConfig: ajaxConfig
            };
            _this.ajax(ajaxData, callback);
        },
        /**
         * 检测是否收藏接口  （游戏或者卡通）
         * @param params 请求接口的参数 userId : 用户id，contentId ：内容编号，contentType 1游戏，2视频
         * @param callback 请求成功之后的回调函数
         * 接口输出参数:{
         *                  successFlg	成功标识，1：成功，0：失败（1代表收藏成功或内容已经收藏，0收藏失败）
         *					resultCode	错误码
         *					resultMsg	错误描述
         *					data	    详情
         *           }
         * 使用方式：interface.findMediaCollectStatus(data，function（）｛｝);
         */
        findMediaCollectStatus: function(data, callback) {
            var _this = this;
            var params = data.params || {};
            var ajaxConfig = data.ajaxConfig || {};
            callback = callback || function() {};
            var url = _this.interfaceUrl + "findMediaCollectStatus";
            var ajaxData = {
                url: url,
                params: params,
                ajaxConfig: ajaxConfig
            };
            _this.ajax(ajaxData, callback);
        },
        /**
         * 检测或添加收藏接口
         * @param params 请求接口的参数 userId : 用户id，contentId ：内容编号，contentType 1游戏，2视频
         * @param callback 请求成功之后的回调函数
         * 接口输出参数:{
         *                  successFlg	成功标识，1：成功，0：失败（1代表收藏成功或内容已经收藏，0收藏失败）
         *					resultCode	错误码
         *					resultMsg	错误描述
         *					data	    详情
         *           }
         * 使用方式：interface.saveUserCollect(data，function（）｛｝);
         */
        saveUserCollect: function(params, callback) {
            var _this = this;
            params = params || {};
            callback = callback || function() {}
            var url = _this.interfaceUrl + "saveUserCollect";
            var data = {
                url: url,
                params: params
            };
            _this.ajax(data, callback);
        },
        /**
         * 删除收藏接口
         * @param params 请求接口的参数 userId : 用户id，contentId ：内容编号，contenType 1游戏，2视频
         * @param callback 请求成功之后的回调函数
         * 接口输出参数:{
         *                  successFlg	成功标识，1：成功，0：失败
         *					resultCode	错误码
         *					resultMsg	错误描述
         *					data	    详情
         *           }
         * 使用方式：interface.deleteUserCollect(data，function（）｛｝);
         */
        deleteUserCollect: function(params, callback) {
            var _this = this;
            params = params || {};
            callback = callback || function() {}
            var url = _this.interfaceUrl + "deleteUserCollect";
            var data = {
                url: url,
                params: params
            };
            _this.ajax(data, callback);
        },
        /**
         * 获取记录 接口（玩过的游戏和看过的卡通）
         * @param params 请求接口的参数 userId 
         * @param callback 请求成功之后的回调函数
         * 接口输出参数:{
         *                  successFlg	成功标识，1：成功，0：失败
         *					resultCode	错误码
         *					resultMsg	错误描述
         *					data	    详情
         *           }
         * 使用方式：interface.findHistoryList(data，function（）｛｝);
         */
        findHistoryList: function(data, callback) {
            var _this = this;
            var params = data.params || {};
            var ajaxConfig = data.ajaxConfig || {};
            callback = callback || function() {};
            var url = _this.interfaceUrl + "view/history";
            var ajaxData = {
                url: url,
                params: params,
                ajaxConfig: ajaxConfig
            };
            _this.ajax(ajaxData, callback);
        },
        /**
         * 添加记录信息接口（玩过的游戏和看过的卡通）
         * @param params 请求接口的参数 userId contentId 游戏或卡通ID，contentType 游戏或卡通类型（0-游戏，2-视频），playType0-主动，1-被动（小窗口）（默认为0），videoId视频Id
         * @param callback 请求成功之后的回调函数  可以不传
         * 接口输出参数:{
         *                  successFlg	成功标识，1：成功，0：失败
         *					resultCode	错误码
         *					resultMsg	错误描述
         *					data	    详情
         *           }
         * 使用方式：interface.insertHistoryList(data，function（）｛｝);
         */
        insertHistoryList: function(params, callback) {
            var _this = this;
            params = params || {};
            callback = callback || function() {}
            var url = _this.interfaceUrl + "view/history/insert";
            var data = {
                url: url,
                params: params
            };
            _this.ajax(data, callback);
        },
        /**
         * 删除记录信息接口（玩过的游戏和看过的卡通）
         * @param params 请求接口的参数 userId contentId 游戏或卡通ID，contentType 游戏或卡通类型（0-游戏，2-视频），playType0-主动，1-被动（小窗口）（默认为0），videoId视频Id
         * @param callback 请求成功之后的回调函数  可以不传
         * 接口输出参数:{
         *                  successFlg	成功标识，1：成功，0：失败
         *					resultCode	错误码
         *					resultMsg	错误描述
         *					data	    详情
         *           }
         * 使用方式：interface.deleteHistoryList(data，function（）｛｝);
         */
        deleteHistoryList: function(params, callback) {
            var _this = this;
            params = params || {};
            callback = callback || function() {}
            var url = _this.interfaceUrl + "view/history/delete";
            var data = {
                url: url,
                params: params
            };
            _this.ajax(data, callback);
        },
        /**
         * 获取任务列表接口
         * @param params 请求接口的参数 [no 默认第一页，当前页][size 默认10，分页大小]
         * @param callback 请求成功之后的回调函数
         * 接口输出参数:{
         *                  successFlg	成功标识，1：成功，0：失败
         *					resultCode	错误码
         *					resultMsg	错误描述
         *					data	    详情
         *           }
         * 使用方式：interface.findMissionList(data，function（）｛｝);
         */
        findMissionList: function(params, callback) {
            var _this = this;
            params = params || {};
            callback = callback || function() {}
            var url = _this.interfaceUrl + "findMissionList";
            var data = {
                url: url,
                params: params
            };
            _this.ajax(data, callback);
        },
        /**
         * 获取任务完成状态接口
         * @param params 请求接口的参数 userId   用户ID
         * @param callback 请求成功之后的回调函数
         * 接口输出参数:{
         *                  successFlg	成功标识，1：成功，0：失败
         *					resultCode	错误码
         *					resultMsg	错误描述
         *					data	    详情 BOOLEAN_PERFORM  是否完成任务(0 未完成；1 完成)
         *				                     BOOLEAN_GETPRIZE  是否获取奖品(0 未领取；1 领取)
         *           }
         * 使用方式：interface.findMissionStatus(data，function（）｛｝);
         */
        findMissionStatus: function(params, callback) {
            var _this = this;
            params = params || {};
            callback = callback || function() {}
            var url = _this.interfaceUrl + "findMissionStatus";
            var data = {
                url: url,
                params: params
            };
            _this.ajax(data, callback);
        },
        /**
         * 获取奖品列表接口
         * @param params 请求接口的参数 [no 默认第一页，当前页][size 默认10，分页大小]
         * @param callback 请求成功之后的回调函数
         * 接口输出参数:{
         *                  successFlg	成功标识，1：成功，0：失败
         *					resultCode	错误码
         *					resultMsg	错误描述
         *					data	    详情
         *           }
         * 使用方式：interface.findPrizeList(data，function（）｛｝);
         */
        findPrizeList: function(params, callback) {
            var _this = this;
            params = params || {};
            callback = callback || function() {}
            var url = _this.interfaceUrl + "findPrizeList";
            var data = {
                url: url,
                params: params
            };
            _this.ajax(data, callback);
        },
        /**
         * 查询用户获奖信息接口
         * @param params 请求接口的参数  userId 用户id
         * @param callback 请求成功之后的回调函数
         * 接口输出参数:{
         *                  successFlg	成功标识，1：成功，0：失败
         *					resultCode	错误码
         *					resultMsg	错误描述
         *					data	    详情  PRIZE_FROM	奖品来源 1 活动 0 平台
         *				                      GETPRIZE_TYPE	奖品状态 0 未发货 1 正在发货 2 已收货 3 放弃兑奖
         *           }
         * 使用方式：interface.findUserPrize(data，function（）｛｝);
         */
        findUserPrize: function(params, callback) {
            var _this = this;
            params = params || {};
            callback = callback || function() {}
            var url = _this.interfaceUrl + "findUserPrize";
            var data = {
                url: url,
                params: params
            };
            _this.ajax(data, callback);
        },
        /**
         * 上传用户获奖信息接口
         * @param params 请求接口的参数  userId 用户id，  missionId 任务ID， contentId	奖品ID
         * @param callback 请求成功之后的回调函数
         * 接口输出参数:{
         *                  successFlg	成功标识，1：成功，0：失败
         *					resultCode	错误码
         *					resultMsg	错误描述
         *					data	    详情
         *           }
         * 使用方式：interface.uploadUserPrize(data，function（）｛｝);
         */
        uploadUserPrize: function(params, callback) {
            var _this = this;
            params = params || {};
            callback = callback || function() {}
            var url = _this.interfaceUrl + "uploadUserPrize";
            var data = {
                url: url,
                params: params
            };
            _this.ajax(data, callback);
        },
        /**
         * 获取通用专题页面信息接口
         * @param params 请求接口的参数 [contentId 内容编号][contentName 页面名称]
         * @param callback 请求成功之后的回调函数
         * 接口输出参数:{
         *                  successFlg	成功标识，1：成功，0：失败
         *					resultCode	错误码
         *					resultMsg	错误描述
         *					data	    详情
         *           }
         * 使用方式：interface.findRecCommonPageInfo(data，function（）｛｝);
         */
        findRecCommonPageInfo: function(params, callback) {
            var _this = this;
            params = params || {};
            callback = callback || function() {}
            var url = _this.interfaceUrl + "findRecCommonPageInfo";
            var data = {
                url: url,
                params: params
            };
            _this.ajax(data, callback);
        },
        /**
         * 查询用户签到状态接口
         * @param params 请求接口的参数  contentId 用户id
         * @param callback 请求成功之后的回调函数
         * 接口输出参数:{
         *                  successFlg	成功标识，1：成功，0：失败（0未签到 1已签到）
         *					resultCode	错误码（1000 已签到   1006未签到）
         *					resultMsg	错误描述
         *					data	    详情
         *           }
         * 使用方式：interface.findSignStatusByUserId(data，function（）｛｝);
         */
        findSignStatusByUserId: function(params, callback) {
            var _this = this;
            params = params || {};
            callback = callback || function() {}
            var url = _this.interfaceUrl + "findSignStatusByUserId";
            var data = {
                url: url,
                params: params
            };
            _this.ajax(data, callback);
        },
        /**
         * 用户签到接口
         * @param params 请求接口的参数  userId 用户id
         * @param callback 请求成功之后的回调函数
         * 接口输出参数:{
         *                  successFlg	成功标识，1：成功，0：失败
         *					resultCode	错误码
         *					resultMsg	错误描述
         *					data	    详情
         *           }
         * 使用方式：interface.userSign(data，function（）｛｝);
         */
        userSign: function(params, callback) {
            var _this = this;
            params = params || {};
            callback = callback || function() {}
            var url = _this.interfaceUrl + "userSign";
            var data = {
                url: url,
                params: params
            };
            _this.ajax(data, callback);
        },
        /**
         * 搜索
         * @param params 请求接口的参数  searchValue 搜索内容的首字母
         * @param callback 请求成功之后的回调函数
         * 接口输出参数:{
         *                  successFlg	成功标识，1：成功，0：失败
         *					resultCode	错误码
         *					resultMsg	错误描述
         *					data	    详情
         *           }
         * 使用方式：interface.search(data，function（）｛｝);
         */
        search: function(params, callback) {
            var _this = this;
            params = params || {};
            callback = callback || function() {}
            var url = _this.interfaceUrl + "search";
            var data = {
                url: url,
                params: params
            };
            _this.ajax(data, callback);
        },
        /**
         * 获取 热搜数据
         * @param params 请求接口的参数  rankType	 筛选条件：0-按天；1-按周；2-按月；3-按季度；4-按年（不传，默认为0）
         * @param callback 请求成功之后的回调函数
         * 接口输出参数:{
         *                  successFlg	成功标识，1：成功，0：失败
         *					resultCode	错误码
         *					resultMsg	错误描述
         *					data	    详情
         *           }
         * 使用方式：interface.topSearch(data，function（）｛｝);
         */
        topSearch: function(params, callback) {
            var _this = this;
            params = params || {};
            callback = callback || function() {}
            var url = _this.interfaceUrl + "topSearch";
            var data = {
                url: url,
                params: params
            };
            _this.ajax(data, callback);
        },
        /**
         * 上传搜索记录
         * @param params 请求接口的参数  userId 用户id，contentType内容类型，contentValue内容id
         * @param callback 请求成功之后的回调函数
         * 接口输出参数:{
         *                  successFlg	成功标识，1：成功，0：失败
         *					resultCode	错误码
         *					resultMsg	错误描述
         *					data	    详情
         *           }
         * 使用方式：interface.uploadSearchRecord(data，function（）｛｝);
         */
        uploadSearchRecord: function(params, callback) {
            var _this = this;
            params = params || {};
            callback = callback || function() {}
            var url = _this.interfaceUrl + "uploadSearchRecord";
            var data = {
                url: url,
                params: params
            };
            _this.ajax(data, callback);
        },
        /**
         * 获取服务器时间接口
         * @param callback 请求成功之后的回调函数
         * 接口输出参数:{
         *                  successFlg	成功标识，1：成功，0：失败
         *					resultCode	错误码
         *					resultMsg	错误描述
         *					data	     "2019-05-21 15:26:53"
         *           }
         * 使用方式：interface.getSystemDate(function（）｛｝);
         */
        getSystemDate: function(callback) {
            var _this = this;
            callback = callback || function() {}
            var url = _this.interfaceUrl + "getSystemDate";
            var data = {
                url: url,
                params: {}
            };
            _this.ajax(data, callback);
        },
        /**
         * 获取用户IP接口
         * @param callback 请求成功之后的回调函数
         * 接口输出参数:{
         *                  successFlg	成功标识，1：成功，0：失败
         *					resultCode	错误码
         *					resultMsg	错误描述
         *					data
         *           }
         * 使用方式：interface.getSystemIP(function（）｛｝);
         */
        getSystemIP: function(callback) {
            var _this = this;
            callback = callback || function() {}
            var url = _this.interfaceUrl + "getSystemIP";
            var data = {
                url: url,
                params: {}
            };
            _this.ajax(data, callback);
        },
        /**
         * 添加用户
         * @param callback 请求成功之后的回调函数
         * 接口输出参数:{
         *                  successFlg	成功标识，1：成功，0：失败
         *					resultCode	错误码
         *					resultMsg	错误描述
         *					data
         *           }
         * 使用方式：interface.insertUserInfo(function（）｛｝);
         */
        insertUserInfo: function(params, callback) {
            var _this = this;
            params = params || {};
            callback = callback || function() {}
            var url = _this.interfaceUrl + "insertUserInfo";
            var data = {
                url: url,
                params: params
            };
            _this.ajax(data, callback);
        },
        /**
         * 前台向后台打印日志接口
         * @param args 需要打印的信息
         * @param method post或者get  默认get ，post模式可以打印大批量数据
         * 接口输出参数:{
         *                  successFlg	成功标识，1：成功，0：失败
         *					resultCode	错误码
         *					resultMsg	错误描述
         *					data
         *           }
         * 使用方式：interface.loggerInfo(args);
         * 			interface.loggerInfo(args,"post");
         */
        loggerInfo: function(args, method) {
            var _this = this;
            //if(xjDataLog.getUserId() == '0314nhwsltcs20001'){
            if (method && method.toLocaleUpperCase() == "POST") {
                var _this = this;
                var params = { "loggerInfo": (typeof args == "object" ? ajax.jsonToString(args) : args) };
                ajax.init({
                    url: AjaxConfig.interfaceUrl + "loggerInfo",
                    method: "post",
                    params: params,
                    async: true,
                    success: function(data) {},
                    error: function(err) {}
                })
            } else {
                var img = new Image(0, 0);
                img.src = _this.interfaceUrl + "loggerInfo?loggerInfo=" + args;
            }

            //}
        },
        /**
         * 黑白名单
         */
        checkUserBlackWhiteList: function(params, callback) {
            var _this = this;
            params = params || {};
            var url = _this.interfaceUrl + "checkUserBlackWhiteList";
            var data = {
                url: url,
                params: params
            };
            _this.ajax(data, callback);
        },
        /**
         * 订购播放记录日志 ---卡通信息获取接口
         */
        getSystemConfigByKey: function(callback) {
            var _this = this;
            callback = callback || function() {};
            var url = _this.interfaceUrl + "/getSystemConfigByKey";
            var data = {
                url: url,
                params: { key: "sys_default_cartoon_ids" },
            };
            _this.ajax(data, callback);
        },

};