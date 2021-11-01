var interface = {
    //接口地址
    //interfaceUrl:"http://180.96.20.178:8097/iptv-web-api/api/web/",
    //页面相关接口
    interfaceUrl: AjaxConfig.interfaceUrl,
    //活动相关接口
    actInterfaceUrl: AjaxConfig.actInterfaceUrl,
    bobyfaceUrl: AjaxConfig.bobyfaceUrl,
    tokenUrl: AjaxConfig.tokenUrl,
    origin: AjaxConfig.origin,
    pointsActUrl: ajaxConf.webPointApiUrl,
    //开关配置项
    //是否调用更换主题方法
    changeThemeSwitch: true,
    //是否开启向后台打印日志方法
    isDebug: true,
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
        var async = ajaxConfig.async == false ? false : true;
        var ContentType = ajaxConfig.ContentType || "json";
        var beforeSend = ajaxConfig.beforeSend || "";
        ajax.init({
            url: url,
            method: method,
            params: params,
            async: async,
            ContentType: ContentType,
            beforeSend : beforeSend,
            success: function(e) {
                cb && cb(e)
                callback && callback(e);
            },
            fail: function(status) {
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
     * 获取页面所有信息
     * @param data ajax请求需要的数据
     * @param callback 请求成功之后的回调函数
     */
    findPageBasePageInfo:function(callback){
        var _this=this;
        var userCode=xjDataLog.getUserId();
        var data = null;
        _this.ajax({
            url : document.URL,
            params:  {},
            ajaxConfig: {
                async: true,
                ContentType: "json",
                beforeSend : function(xhr){
                    xhr.setRequestHeader('Accept', 'application/json');
                }
            }
        }, callback);
    },
    /**
     * 获取播放串
     * @param data ajax请求需要的数据
     * @param callback 请求成功之后的回调函数
     */
    findPlayUrlByMediaCode:function(data,callback){
        var _this=this;
        var userCode=xjDataLog.getUserId();
        var param={
            spCode:"SP1N02A00_08_030",
            targetSystemID:"30-S",
            devicetype:6,
            userCode:userCode,
            assetID:data.assetID
        }
        _this.ajax({
            url : AjaxConfig.origin + "/jsyx/order/jsyxInterfaceForward",
            params: param || {},
            ajaxConfig: data.ajaxConfig || {}
        }, callback);
    },
    /**
     * 请求通用页面信息
     * @param params 请求接口的参数 contentId ：内容编号 或 contentName	： 页面英文名称
     * @param callback 请求成功之后的回调函数
     * 可以在data里面定义 ajax请求的参数，比如是否异步，数据的格式等
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
        var _this = this;
        var params = data.params || {};
        var ajaxConfig = data.ajaxConfig || {};
        callback = callback || function() {};
        var url = _this.interfaceUrl + "findCommonPageInfo";
        var ajaxData = {
            url: url,
            params: params,
            ajaxConfig: ajaxConfig
        };
        _this.ajax(ajaxData, callback, function(e) {
            //保存页面的所有数据，generalNavBar.js会用到AjaxConfig.commonPageInfo
            AjaxConfig.commonPageInfo = e.data || e;
            if (_this.changeThemeSwitch) {
                CT.changeTheme(e, 1);
            }
            setLoggerInfo.pageInfoLog = e;
            window.curPageInfo = {
                "commPageCname": e.data.pageInfo.commPageCname,
                "commPageEname": e.data.pageInfo.commPageEname,
                "contentId": "",
                "contentType": xjDataLog.getPageType1(),
                "userId": xjDataLog.getUserId()
            }
            if (!CT.getCookie("logCollParam")) {
                CT.setCookie("logCollParam", ajax.jsonToString(curPageInfo));
            }
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
        var ajaxConfig = params.ajaxConfig || {};
        callback = callback || function() {}
        var url = _this.interfaceUrl + "findTemplateInfo";
        var data = {
            url: url,
            params: params,
            ajaxConfig: ajaxConfig
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
        var url = _this.interfaceUrl + "findVideoListByCartoonId";
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
        var url = _this.interfaceUrl + "findCartoonDetailById";
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
        var url = _this.interfaceUrl + "findWhithBlackDetailById";
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
     * 新增家长锁详情接口
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
    insertUserLock: function(params, callback) {
        var _this = this;
        params = params || {};
        callback = callback || function() {}
        var url = _this.interfaceUrl + "insertUserLock";
        var data = {
            url: url,
            params: params
        };
        _this.ajax(data, callback);
    },
    /**
     * 取消童锁接口
     * @param {*} data
     * @param {*} callback
     */
    clearUserLock: function (data,callback){
        var _this = this;
        var params = data.params || {};
        var ajaxConfig = data.ajaxConfig || {};
        callback=callback||function(){};
        var url = _this.interfaceUrl + "clearUserLock";
        var data = {
            url:url,
            params:params,
            ajaxConfig:ajaxConfig
        };
        _this.ajax(data,callback);
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
     * @param params 请求接口的参数 userId : 用户id，contentId ：内容编号，contentType 1游戏，2视频
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
     * 清空收藏接口
     * @param params 请求接口的参数 userId : 用户id， contentType 1游戏，2视频， booleanCollect ：1
     * @param callback 请求成功之后的回调函数
     * 接口输出参数:{
     *                  successFlg	成功标识，1：成功，0：失败
     *					resultCode	错误码
        *					resultMsg	错误描述
        *					data	    详情
        *           }
        * 使用方式：interface.deleteUserCollect(data，function（）｛｝);
        */
    deleteBatchUserCollect: function(params, callback) {
        var _this = this;
        params = params || {};
        params.booleanCollect = 1;
        callback = callback || function() {}
        var url = _this.interfaceUrl + "deleteBatchUserCollect";
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
     * @param params 请求接口的参数 userId contentId 游戏或卡通ID，contentType 游戏或卡通类型（0-游戏，1-视频），playType0-主动，1-被动（小窗口）（默认为0），videoId视频Id
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
        params.isRecommend = "false";
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
     * 根据用户id添加宝宝信息
     * @param params 请求接口的参数  userId 用户id
     * @param callback 请求成功之后的回调函数
     *  接口输出参数:{
     *                  successFlg	成功标识，1：成功，0：失败
     *					errorCode	错误码
        *					errorMsg	错误描述
        *					data
        *           }
        */

    insertBaby: function(params, callback) {
        var _this = this;
        params = params || {};
        var url = _this.bobyfaceUrl + "insertBaby";
        var data = {
            url: url,
            params: params
        };
        _this.ajax(data, callback);
    },

    /**
     * 根据用户id新增宝宝信息并更新用户babyId
     *  @param params 请求接口的参数  userId 用户id
     * @param callback 请求成功之后的回调函数
     *  接口输出参数:{
     *                  successFlg	成功标识，1：成功，0：失败
     *					errorCode	错误码
        *					errorMsg	错误描述
        *					data
        *           }
        */
    updateBaby: function(params, callback) {
        var _this = this;
        params = params || {};
        var url = _this.bobyfaceUrl + "updateBabyByUserId";
        var data = {
            url: url,
            params: params
        };
        _this.ajax(data, callback);
    },

    /**
     * 根据用户id查询宝宝
     *  @param params 请求接口的参数  userId 用户id
     * @param callback 请求成功之后的回调函数
     *  接口输出参数:{
     *                  successFlg	成功标识，1：成功，0：失败
     *					errorCode	错误码
        *					errorMsg	错误描述
        *					data
        *           }
        */
    findBabyInfo: function(params, callback) {
        var _this = this;
        params = params || {};
        var url = _this.bobyfaceUrl + "findBabyByUserId";
        var data = {
            url: url,
            params: params
        };
        _this.ajax(data, callback);
    },
    /*
    * 获取当前正在用的眉头中部导航分类（家长中心可控制上下架）
    * 入参：{userId : }
    * 返回：{
    "data": [
        "1",//导航id
        "2",
        "3"
    ],
    "errorCode": "1000",
    "errorMsg": "操作成功",
    "successFlg": 1
    }
    */
    getCurUserNavItem: function(params, callback) {
        var _this = this;
        params = params || {};
        var url = _this.interfaceUrl + "findUserCustomByUserId";
        var data = {
            url: url,
            params: params
        };
        _this.ajax(data, callback);
    },
    /**
    * 获取主题列表
    * 入参：{}
    * 返回：
    * {
    "data": [
    {
        "booleanUp": 2,
        "endTime": null,
        "id": 2,
        "startTime": null,
        "themeAttrMap": {
            "THEME_LOGO": "/pic/category/20200304/20200304101630155_alz5b.png,,",
            "THEME_COVER_PIC": "/pic/main/20200319/20200319095240617_eiwyc.png,,/pic/main/20200319/20200319095319919_0yekf.png",
            "THEME_CATEGORY_BIGPIC": "/pic/other/20200306/20200306161453464_2ovc4.jpg,,"
            ...
        },
        "themeCname": "紫色主题",
        "themeEname": "ziSeTheme",
        "themeTrackName": "test_black_piont"
    },
    {
        ...
    }
    ],
    "errorCode": "1000",
    "errorMsg": "操作成功",
    "successFlg": 1
    }
    */
    getThemeList: function(data, callback) {
        var _this = this;
        var params = data.params || {};
        var ajaxConfig = data.ajaxConfig || {};
        callback = callback || function() {};
        var url = _this.interfaceUrl + "selectThemeDetail";
        var data = {
            url: url,
            params: params,
            ajaxConfig: ajaxConfig
        };
        _this.ajax(data, callback);
    },
    /**
    * 获取用户定制主题
    * 入参：{userId : }
    * 返回：{
    "data": {
        "booleanUp": 2,
        "endTime": null,
        "id": 2,
        "startTime": null,
        "themeAttrMap": {
            "THEME_LOGO": "/pic/category/20200304/20200304101630155_alz5b.png,,",
            ...
        },
        "themeCname": "紫色主题",
        "themeEname": "ziSeTheme",
        "themeTrackName": "test_black_piont"
    },
    "errorCode": "1000",
    "errorMsg": "操作成功",
    "successFlg": 1
    }
    */
    getUserTheme: function(data, callback) {
        var _this = this;
        var params = data.params || {};
        var ajaxConfig = data.ajaxConfig || {};
        callback = callback || function() {};
        var url = _this.interfaceUrl + "selectThemeDetailByUserId";
        var data = {
            url: url,
            params: params,
            ajaxConfig: ajaxConfig
        };
        _this.ajax(data, callback);
    },
    /**
        * 更新user表 主题，禁止观看时间，家长定制菜单字段
        * 入参：{
                userId : -1,
            themeId : 3,//可选
            customId : 1_2_3,//可选
            forbiddenTime : 20:00-22:00//可选
        * 		}
        * 返回：{
        "data": "",
        "errorCode": "1000",
        "errorMsg": "操作成功",
        "successFlg": 1
        }
    */
    updateExtraUserInfo: function(data, callback) {
        var _this = this;
        var params = data.params || {};
        var ajaxConfig = data.ajaxConfig || {};
        callback = callback || function() {};
        var url = _this.interfaceUrl + "updateExtraUserInfo";
        var data = {
            url: url,
            params: params,
            ajaxConfig: ajaxConfig
        };
        _this.ajax(data, callback);
    },
    /**
        * 修改禁止观看时间
        * 入参：{
        userId : -1,
        forbiddenTime : '09:00 - 12:00',
        * 		}
        * 返回：{
        "data": "",
        "errorCode": "1000",
        "errorMsg": "操作成功",
        "successFlg": 1
        }
    */
    updateForbiddenTime: function (data, callback) {
        var _this = this;
        var params = data.params || {};
        var ajaxConfig = data.ajaxConfig || {};
        callback = callback || function () { };
        var url = _this.interfaceUrl + "updateForbiddenTime";
        var data = {
            url: url,
            params: params,
            ajaxConfig: ajaxConfig
        };
        _this.ajax(data, callback);
    },
    /**
        * 修改禁止眉头分类首页是否展示
        * 入参：{
        userId : -1,
        isShow:true,//显示，false不显示
        customId：//眉头ID
        * 		}
        * 返回：{
        "data": "",
        "errorCode": "1000",
        "errorMsg": "操作成功",
        "successFlg": 1
        }
    */
    updateCustomThemeInfo: function (data, callback) {
        var _this = this;
        var params = data.params || {};
        var ajaxConfig = data.ajaxConfig || {};
        callback = callback || function () { };
        var url = _this.interfaceUrl + "updateCustomThemeInfo";
        var data = {
            url: url,
            params: params,
            ajaxConfig: ajaxConfig
        };
        _this.ajax(data, callback);
    },
    /**
             * 查询禁止观看时间，家长定制菜单字段
                * 入参：{
                        userId : -1,
                     
                *      }
                * 返回：{
                    "data": {
                        "canWatch": true,  是否禁止观看
                        "forbiddenTime": "20:00-22:00"  禁止观看时间段
                    },
                    "errorCode": "1000",
                    "errorMsg": "操作成功",
                    "successFlg": 1
                        }
    */
    findUserForbiddenTime: function(data, callback) {
        var _this = this;
        var params = data.params || {};
        var ajaxConfig = data.ajaxConfig || {};
        callback = callback || function() {};
        var url = _this.interfaceUrl + "findUserForbiddenTimeByUserId";
        var data = {
            url: url,
            params: params,
            ajaxConfig: ajaxConfig
        };
        _this.ajax(data, callback);
    },
        //取消童锁接口
        clearUserLock: function (data, callback) {
            var _this = this;
            var params = data.params || {};
            var ajaxConfig = data.ajaxConfig || {};
            callback = callback || function () { };
            var url = _this.interfaceUrl + "clearUserLock";
            var data = {
                url: url,
                params: params,
                ajaxConfig: ajaxConfig
            };
            _this.ajax(data, callback);
        },
    /**
     * 转发接口，某些跨域接口转发到后台，后台发起请求得到结果后返回给前端
     * 入参：{
                ajaxConfig : {
                        method : 'post'
                },
                params : {
                        forward ：转发的接口地址,
                        params : {
                                参数A : X,
                                参数B : Y
                        }
                }
            }
        *          
        * 返回：未知
    */
    jumpUrl: function(data, callback) {
        var _this = this;
        var params = data.params || {};
        var ajaxConfig = data.ajaxConfig || {};
        callback = callback || function() {};
        var url = _this.interfaceUrl + "jumpUrl";
        //params.forward && (params.forward = encodeURIComponent(params.forward));
        if ((ajaxConfig.method && ajaxConfig.method.toLowerCase() == 'get') || !ajaxConfig.method) {
            //params.params = encodeURIComponent(ajax.formatParams(params.params));
            params.params = ajax.formatParams(params.params);
        }
        var data = {
            url: url,
            params: params,
            ajaxConfig: ajaxConfig
        };
        _this.ajax(data, callback);
    },
    getToken: function(params, callback) {
        var _this = this;
        params = params || {};

        callback = callback || function() {}
        var url = _this.tokenUrl + "WebUserToken";
        var data = {
            url: url,
            params: params,

        };
        _this.ajax(data, callback);
    },
    /**
     * 查询citycode
     */
    findCityCode: function() {
        var _this = this;
        var params = data.params || {};
        var ajaxConfig = data.ajaxConfig || {};
        callback = callback || function() {};
        var url = _this.origin + "/order_gzgd/auth/getCityCode";
        var data = {
            url: url,
            params: params,
            ajaxConfig: ajaxConfig,
        };
        _this.ajax(data, callback);
    },

    findAuth: function(data, callback) {
        var _this = this;
        var params = data.params || {};
        var ajaxConfig = data.ajaxConfig || {};
        callback = callback || new Function;
        // var url = _this.interfaceUrl + "/jsyx_auth/too/auth";
        // var url = _this.origin + "/jsyx_auth_cloud_test/too/auth";
        var url = _this.origin + "/jsyx_auth_cloud/too/auth";
        if(CT.getPath().indexOf("-test") >0) {  //测试环境
            url = _this.origin + "/jsyx_auth_cloud_test/too/auth";
        }
        var authParams = {
            url: url,
            params: params,
            ajaxConfig: ajaxConfig,
        };
        _this.ajax(authParams, callback);
    },
    toOrder: function(data, callback) {
        var _this = this;
        var params = data.params || {};
        var ajaxConfig = data.ajaxConfig || {};
        callback = callback || new Function;
        var url = _this.origin + "/order_gzgd/auth/confirmOrder";
        var authParams = {
            url: url,
            params: params,
            ajaxConfig: ajaxConfig,
        };
        _this.ajax(authParams, callback);
    },
    /**
     *  通过key 获取系统参数管理中配置参数
     * @param  callback 回调
     * @param  key      指定要取的key 
     * @example
     *  interface.getSystemConfigByKey(function(data){
     * 	    console.log(data)
     *  },"sys_default_cartoon_ids")
     */
    getSystemConfigByKey: function (callback, key) {
        var _this = this;
        callback = callback || function () { };
        var url = _this.interfaceUrl + "/getSystemConfigByKey";
        key = key || "sys_default_cartoon_ids";
        var data = {
            url: url,
            params: { key: key },
        };
        _this.ajax(data, callback);
    },

    /*************************************** 纯工具类接口 *******************************************************/
    /**
     * 清除主题接口接口缓存
     * 主题接口缓存： updateExtraUserInfo;
     * 定制眉头接口缓存： updateCustomThemeInfo;
     * @param callback 请求成功之后的回调函数
     * 入参：
        var clearData = {
            //必传参数，清除缓存的关键字
            keyWord: 'updateExtraUserInfo',
            //可选参数，清除缓存的入参，默认userID
            params: {
                userId: xjDataLog.getUserId()
            },
            //可选参数，ajax请求配置
            ajaxConfig: {

            }
        }
        * 
        * 接口输出参数：{
        *                  msg: "删除成功selectThemeDetailByUserId:userId=-1",
        *                  code: 200
        *              }
        * 使用方式： interface.clearNodeCache(clearData);
        */
    clearNodeCache: function(data, callback) {
        var _this = this;
        data = data || {}
        var keyWord = data.keyWord;
        if (!keyWord) {
            return;
        }
        var paramsDefault = {
            userId: xjDataLog.getUserId()
        };
        var params = data.params || paramsDefault;
        var ajaxConfig = data.ajaxConfig || {};
        callback = callback || function() {}
        var nodeUrl = "/nodeApi/";
        if(AjaxConfig.projectUrl.indexOf("iptv-nodeweb-test") >0) nodeUrl = "/nodeApi-test/"
        var url = AjaxConfig.origin + nodeUrl + keyWord;
        var data = {
            url: url,
            params: params,
            ajaxConfig: ajaxConfig
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
        function loggerInfo(args, method) {
            var url =  AjaxConfig.projectUrl  + "/log?";
            var userId = '';
            try {

                userId = Utility.getSystemInfo("UID");
                if (!userId) {
                    userId = CITV.loginInfo.userId;
                }
            } catch (e) {
                try {
                    stbId = hardware.STB.serialNumber;
                } catch (e) {
        
                }
            }
            if (method && method.toLocaleUpperCase() == "POST") {
                var params = {
                    "log": ""
                };
                if (typeof args == "object") {
                    args.userId = userId;
                    params.log = JSON.stringify(args);
                } else {
                    params.log = "userId:" + userId + "---" + args;
                }
                if (!args) {
                    
                    return;
                }
                try {
                    oAjax = new XMLHttpRequest();
                } catch (e) {
                    oAjax = new ActiveXObject("Microsoft.XMLHTTP");
                };
                oAjax.open("POST", url, true);
                /*/post相比get方式提交多了个这个*/
                oAjax.setRequestHeader("Content-type", "application/json;charset=utf-8");
                /*//post发送数据*/
                oAjax.withCredentials = true;
                oAjax.send(JSON.stringify(params));
                oAjax.onreadystatechange = function () {
                    /*/当状态为4的时候，执行以下操作*/
                    if (oAjax.readyState == 4) {
                        if (oAjax.status == 200) {
                            // success && success(eval("(" + oAjax.responseText + ")"));
                        } else {
                            // fail && fail(status);
                        }
                    };
                };
            }else{
                var img = new Image();
                img.src = url + "log=" + "userId:" + userId + "---" + args + "---v=" + new Date().getTime();
            }

        }


        loggerInfo(args,method)
        
        
    },
        /***************************************************** 苏州有线新增接口  **************************************************/
    /*
    方法功能：
        获取大数据推荐片单， 根据用户id。
    调用方法：
        var data = {
            params: {
                // 必选：用户ID
                userId： ,
                // 可选：推荐条数，默认10条
                recommendNum: 13,
                // 可选：排序类型：0：升序，1：降序，2：随机，默认为1
                sortType: 1
            }
        }
        interface.getBigDataRecCartoon_byUserId(data, function (result) {});
    */
    getBigDataRecCartoon_byUserId: function (data, callback) {
        var _this = this;
        data = data || {};
        params = data.params || {};
        // 是否收费，1：收费
        params.isFree = 1;
        // 是否上架，2：上架
        params.booleanUp = 2;
        // 当前页面id
        params.contentId = CT.requestValue("contentId");
        var ajaxConfig = params.ajaxConfig || {};
        callback = callback || function () { }
        var url = AjaxConfig.bigDataRecCartoonUrl + "getRecommendMovieByUserId";
        var data = {
            url: url,
            params: params,
            ajaxConfig: ajaxConfig
        };
        _this.ajax(data, callback);
    },
    /*
    方法功能：
        获取大数据推荐片单， 根据卡通id。
    调用方法：
        var data = {
            params: {
                // 必选：片单ID
                movieId: ,
                // 可选：推荐条数，默认10条
                recommendNum: 13,
                // 可选：排序类型：0：升序，1：降序，2：随机，默认为1
                sortType: 1
            }
        }
        interface.getBigDataRecCartoon_byUserId(data, function (result) {});
    */
    getBigDataRecCartoon_byMovieId: function (data, callback) {
        var _this = this;
        data = data || {};
        params = data.params || {};
        // 是否收费，1：收费
        params.isFree = 1;
        // 是否上架，2：上架
        params.booleanUp = 2;
        // 当前页面id
        params.contentId = CT.requestValue("contentId");
        var ajaxConfig = params.ajaxConfig || {};
        callback = callback || function () { }
        var url = AjaxConfig.bigDataRecCartoonUrl + "getRecommendMovieByMovieId";
        var data = {
            url: url,
            params: params,
            ajaxConfig: ajaxConfig
        };
        _this.ajax(data, callback);
    },
    /*  获取 accesstokenStr
        var tokenObj = {
            getTokenSucCallback: 
        }
    */
    getAccesstokenStr: function (tokenObj) {
        var _this = this;
        // var token = "R5FB4BB1EU1098A0E0K3BB42B83I8DD0780AP8M315DE7EV20928Z4E3F5W1648855D15FDFB2A";
        // interface.loggerInfo("getTokenLog user token: " + token, "post");
        // return token;

        tokenObj = tokenObj || {};
        var accessToken = "";
        // 缓存token
        // if (tokenObj["delCookie"] == "yes") {
        //     CT.setCookie("accesstokenStr", "");
        //     CT.delCookie("accesstokenStr");
        // }
        // var accessToken = CT.getCookie("accesstokenStr");
        // var accessToken = "";
        // if (!accessToken) {
        //     try {
        //         accessToken = iPanel.ioctlRead("sys.homed.token");
        //     } catch (e) {
        //         accessToken = "test0001";
        //     }
        // }
        //如果获取不到接口请求  http://slave.jscnwx.com/account/login?deviceno=72450513480049129&devicetype=1&accounttype=1&account=51593027&accesstoken=&pwd=96e79218965eb72c92a549dd5a330112
        if (!accessToken || (accessToken + "").length < 20) {
            var userId = xjDataLog.getUserId();
            var reqUserId = interface.getReqUserId();
            var pp = {
                // 设备唯一标识符，比如机顶盒的序列号、 CA 卡号等
                "deviceno": userId,
                // 终端设备类型，取值 0：全部；1：机盒序列号；2：CA 卡号。 
                "devicetype": 1,
                // 价格所适用的交易平台，取值 0：广电， 1：IOS。默认取值为 0 
                "businessplatform": 0,
                // 账号类型，取值   1：用户 id 登录；   2： 用户名登录
                "accounttype": 1,
                // 实际使用 user/get_list接口返回的bind_user_id。 文档注释：根据 accounttype 定 必选  登录账号，与 accounttype 对应：1）userid，用户 id； 2）username，用户名
                "account": reqUserId,//1,//
                "accesstoken": "",
                "pwd": "96e79218965eb72c92a549dd5a330112",
            }
            // interface.loggerInfo("getTokenLog playLog orderLog get params: " + CT.jsonToString(pp) + "------reqUrl===" + AjaxConfig.loginUrl, "post");
            var params = {
                url: AjaxConfig.loginUrl,
                method: "get",
                params: pp,
                ContentType: "json",
                async: false,
                success: function (res) {
                    // interface.loggerInfo("getTokenLog playLog orderLog get result (res.ret == 0 is success): " + CT.jsonToString(res), "post");
                    if (res.ret == 0) {
                        accessToken = res.access_token;
                        CT.setCookie("accesstokenStr", accessToken);
                        tokenObj.accessToken = accessToken;
                        tokenObj.getTokenSucCallback && tokenObj.getTokenSucCallback(tokenObj);
                        try {
                            xjDataLog.uploadOrderSuccess({
                                orderState: 4,
                                orderMessage: res.ret_msg || "",
                                more1: userId + "_" + res.ret,
                                more2: userId || "",
                                more3: ajax.jsonToString(pp),
                                more4: '获取token:' + ajax.jsonToString(res)
                            });
                        } catch (error) {

                        }
                    } else {
                        CT.alertTip("您的机顶盒获取token失败！");
                        try {
                            xjDataLog.uploadOrderSuccess({
                                orderState: 5,
                                orderMessage: res.ret_msg || "",
                                more1: res.ret,
                                more2: userId || "",
                                more3: 'request:' + AjaxConfig.loginUrl + ajax.jsonToString(pp),
                                more4: ajax.jsonToString(res)
                            });
                        } catch (error) {

                        }
                    }
                },
                fail: function (status) { }
            };
            if (window.navigator.userAgent.indexOf("Coship") >= 0) {
                params.async = true;
            }
            ajax.init(params);
        } else {
            tokenObj.accessToken = accessToken;
            tokenObj.getTokenSucCallback && tokenObj.getTokenSucCallback(tokenObj);
        }
    },
    /*
        获取请求的设备ID。 
        interface.getDeviceId();
    */
    getDeviceId: function () {
        var _this = this;
        var deviceId = CT.getCookie("userDeviceId");
        if (deviceId && deviceId != "undefined" && deviceId != "null") {
            // interface.loggerInfo("getFamilyInfoLog get getDeviceId 111: " + deviceId, "post");
            return deviceId;
        } else {
            // interface.loggerInfo("getFamilyInfoLog get getDeviceId 222: " + deviceId, "post");
            interface.getDeviceIdFamilyMemberList();
            deviceId = CT.getCookie("userDeviceId");
            return deviceId;
        }
    },
    /*
       获取请求的用户ID。 
       interface.getDeviceId();
    */
    getReqUserId: function () {
        var _this = this;
        var deviceId = CT.getCookie("userReqUserId");
        if (deviceId && deviceId != "undefined" && deviceId != "null") {
            // interface.loggerInfo("getFamilyInfoLog get getReqUserId 111: " + deviceId, "post");
            return deviceId;
        } else {
            interface.getDeviceIdFamilyMemberList();
            deviceId = CT.getCookie("userReqUserId");
            // interface.loggerInfo("getFamilyInfoLog get getReqUserId 222: " + deviceId, "post");
            return deviceId;
        }
    },
    /*
       获取某个设备所属家庭的用户信息列表。 
       var familyInfoParams = {
            sucCallback: ,
            failCallback: ,
       }
       interface.getDeviceIdFamilyMemberList(familyInfoParams);
    */
    getDeviceIdFamilyMemberList: function (familyInfoParams) {
        var _this = this;
        familyInfoParams = familyInfoParams || {};
        //userId
        var userId = xjDataLog.getUserId();
        var pp = {
            // 设备唯一标识符，比如机顶盒的序列号、 CA 卡号等。 
            "deviceno": userId,
            // 终端设备类型，取值 0：全部；1：机顶 盒序列号；2：CA 卡号。 
            "devicetype": 1,
            // 翻页参数，第几页
            "pageidx": 1,
            // 翻页参数，每页多少个
            "pagenum": 6
        };
        // interface.loggerInfo("getFamilyInfoLog get params: " + CT.jsonToString(pp) + "------reqUrl===" + AjaxConfig.familyMemberListUrl, "post");
        ajax.init({
            url: AjaxConfig.familyMemberListUrl,
            method: "get",
            params: pp,
            ContentType: "json",
            async: false,
            success: function (res) {
                // interface.loggerInfo("getFamilyInfoLog get result: " + CT.jsonToString(res), "post");
                if (res.ret == 0) {
                    var success = familyInfoParams.sucCallback;
                    if (success) {
                        success(res.device_id);
                    } else {
                        CT.setCookie("userDeviceId", res.device_id);
                        var userReqUserId = res.bind_user_id;// res.alternative_user_name;//
                        CT.setCookie("userReqUserId", userReqUserId);
                    }
                } else {
                    var fail = familyInfoParams.failCallback;
                    fail && fail(res.device_id);
                }
                try {
                    var logObj = {
                        // 接口请求参数
                        reqParams: pp,
                        // 接口请求结果
                        reqResult: res,
                        // 接口代码，0：订购支付成功；10：询价接口；11：创建订单接口；其他情况：均为订购支付接口返回的状态
                        orderState: 12,
                    }
                    var orderLogObj = orderJs.getUploadOrderLogParams(logObj);
                    xjDataLog.uploadOrderSuccess(orderLogObj);
                } catch (error) {
                    
                }
            },
            fail: function (status) {
                loggerInfo("请求userId的ajax失败");
            }
        });
    },

    //用积分兑换奖品
    //参数  奖品Id prizeId  
    //用户Id userId
    changePrizeByPoints: function (data, callback) {
        var _this = this;
        var params = data.params || {};
        var ajaxConfig = data.ajaxConfig || {};
        callback = callback || function () { };
        var url = _this.pointsActUrl + "prize/changePrizeByPoints";
        var data = {
            url: url,
            params: params,
            ajaxConfig: ajaxConfig
        };
        _this.ajax(data, callback);
    },

    /**
     * 获取所有奖品以及用户的兑奖状态
     * @param params prizeType 奖品体系类型2积分3兑换
     * @param params outId 关联活动id
     * @param params userId 用户Id
     */
    getPrizeListByUserId: function (data, callback) {
        var _this = this;
        var params = data.params || {};
        var ajaxConfig = data.ajaxConfig || {};
        callback = callback || function () { };
        var url = _this.pointsActUrl + "prize/getPrizeListByUserId";
        var data = {
            url: url,
            params: params,
            ajaxConfig: ajaxConfig
        };
        _this.ajax(data, callback);
    },

    /**
     * 获取符合条件的所有任务
     * @param params 无
     */
    getTaskDetailList: function (data, callback) {
        var _this = this;
        var params = data.params || {};
        var ajaxConfig = data.ajaxConfig || {};
        callback = callback || function () { };
        var url = _this.pointsActUrl + "task/detail/getTaskDetailList";
        var data = {
            url: url,
            params: params,
            ajaxConfig: ajaxConfig
        };
        _this.ajax(data, callback);
    },

    /**
     * 上传用户积分
     * @param params userid 用户机顶盒id
     * @param params taskid 平台即活动id
     * @param params prizeid 奖品id
     * @param params points 换算出来的最终积分
     * @param params more1 more2 more3 more4
     * 示例:{userid:"777",openid:"123",platform:"1",taskid:"4",prizeid:"5",points:"1",createTime:"2021-04-22",updateTime:"2021-04-22",more1:"11",more2:"22",more3:"33",more4:"44"}
     */
    insertPoints: function (data, callback) {
        var _this = this;
        var params = data.params || {};
        var ajaxConfig = data.ajaxConfig || {};
        callback = callback || function () { };
        var url = _this.pointsActUrl + "log/user/points/insertPoints";
        var data = {
            url: url,
            params: params,
            ajaxConfig:{
                method:"post",
            }
        };
        _this.ajax(data, callback);
    },

    /**
     * 更新用户信息
     * @param params nickName 昵称
     * @param params sex 性别1男 0女
     * @param params age 固定传1
     * @param params ageRegion 年龄区间 0代表0-3岁 4代表4-6岁 7代表7-13岁 13代表13岁以上
     * @param params phone 手机号
     * @param params userid 用户机顶盒id
     * @param params hobby 多个爱好 示例:1,3,4
     * @param params more1 头像和昵称接口获取到的主键id
     */
    pointsUpdateUserInfo: function (data, callback) {
        var _this = this;
        var params = data.params || {};
        var ajaxConfig = data.ajaxConfig || {};
        callback = callback || function () { };
        var url = _this.pointsActUrl + "user/info/updateUserInfo";
        var data = {
            url: url,
            params: params,
            ajaxConfig:{
                method:"post",
            }
        };
        _this.ajax(data, callback);
    },

    /**
     * 根据用户id获取所有任务，以及任务完成
     * @param params userId 用户机顶盒id
     * @param params prizeType 此次体系类型2表示积分固定2
     * @param params activityId 活动id
     */
    getTaskByUserId: function (data, callback) {
        var _this = this;
        var params = data.params || {};
        var ajaxConfig = data.ajaxConfig || {};
        callback = callback || function () { };
        var url = _this.pointsActUrl + "task/detail/getTaskByUserId";
        var data = {
            url: url,
            params: params,
            ajaxConfig: ajaxConfig
        };
        _this.ajax(data, callback);
    },

    //获取所有可用头像昵称列表
    //参数  无
    getUserHeadInfoList: function (data, callback) {
        var _this = this;
        var params = data.params || {};
        var ajaxConfig = data.ajaxConfig || {};
        callback = callback || function () { };
        var url = _this.pointsActUrl + "head/info/userHeadInfoList";
        var data = {
            url: url,
            params: params,
            ajaxConfig: ajaxConfig
        };
        _this.ajax(data, callback);
    },

    /**
     * 上传用户信息
     * @param params nickName 昵称
     * @param params sex 性别1男 0女
     * @param params age 固定传1
     * @param params ageRegion 年龄区间 0代表0-3岁 4代表4-6岁 7代表7-13岁 13代表13岁以上
     * @param params phone 手机号
     * @param params userid 用户机顶盒id
     * @param params hobby 多个爱好 示例:1,3,4
     * @param params more1 头像和昵称接口获取到的主键id
     */
    addUserInfo: function (data, callback) {
        var _this = this;
        var params = data.params || {};
        var ajaxConfig = data.ajaxConfig || {};
        callback = callback || function () { };
        var url = _this.pointsActUrl + "user/info/addUserInfo";
        var data = {
            url: url,
            params: params,
            ajaxConfig:{
                method:"post",
            }
        };
        _this.ajax(data, callback);
    },


    /**
     * 获取当天片单是否已经重复观看
     * @param params userid 用户机顶盒id(小写)
     */
    getLogUserPoints: function (data, callback) {
        var _this = this;
        var params = data.params || {};
        var ajaxConfig = data.ajaxConfig || {};
        callback = callback || function () { };
        var url = _this.pointsActUrl + "log/user/points/getLogUserPoints";
        var data = {
            url: url,
            params: params,
            ajaxConfig: ajaxConfig
        };
        _this.ajax(data, callback);
    },


    /**
     * 根据所传userId和activityId获取总积分
     * @param params activityId 活动id
     */
    getUserSumPoints: function (data, callback) {
        var _this = this;
        var params = data.params || {};
        var ajaxConfig = data.ajaxConfig || {};
        callback = callback || function () { };
        var url = _this.pointsActUrl + "sum/points/getUserSumPoints";
        var data = {
            url: url,
            params: params,
            ajaxConfig: ajaxConfig
        };
        _this.ajax(data, callback);
    },

    /**
     * 根据传入的活动id（outId）和奖品类型id（prizeType）获取所有奖品
     * @param params prizeType 此处固定为3表示兑换体系
     * @param params outId 活动id此处固定1
     * @param userId 用户Id
     */
    getPrizeList: function (data, callback) {
        var _this = this;
        var params = data.params || {};
        var ajaxConfig = data.ajaxConfig || {};
        callback = callback || function () { };
        var url = _this.pointsActUrl + "prize/getPrizeList";
        var data = {
            url: url,
            params: params,
            ajaxConfig: ajaxConfig
        };
        _this.ajax(data, callback);
    },

    /**
     * 获取用户信息
     * @param params userid 用户机顶盒id(id为小写)
     */
    getUserInfoList: function (data, callback) {
        var _this = this;
        var params = data.params || {};
        var ajaxConfig = data.ajaxConfig || {};
        callback = callback || function () { };
        var url = _this.pointsActUrl + "user/info/userInfoList";
        var data = {
            url: url,
            params: params,
            ajaxConfig: ajaxConfig
        };
        _this.ajax(data, callback);
    },
    
    /**
     * 根据用户id和奖品id获取用户兑奖详情
     * @param params userId 用户机顶盒id
     * @param params prizeId 用户机顶盒id(id为小写)
     */
     getUserPrizeInfo: function (data, callback) {
        var _this = this;
        var params = data.params || {};
        var ajaxConfig = data.ajaxConfig || {};
        callback = callback || function () { };
        var url = _this.pointsActUrl + "log/user/prize/list";
        var data = {
            url: url,
            params: params,
            ajaxConfig: ajaxConfig
        };
        _this.ajax(data, callback);
    },

    /**
     * 根据主键id和more1字段提交手机号
     * @param params id 主键id
     * @param params more1 
     */
    commitPhoneNum: function (data, callback) {
        var _this = this;
        var params = data.params || {};
        var ajaxConfig = data.ajaxConfig || {};
        callback = callback || function () { };
        var url = _this.pointsActUrl + "log/user/prize/updateById";
        var data = {
            url: url,
            params: params,
            ajaxConfig:{
                method:"post",
            }
        };
        _this.ajax(data, callback);
    },

    /**
     * 一元周卡领取记录入库
     * @param params userId
     * @param params activityId 
     * @param params activityName (可不传) 
     */
    insertActivityGainRecord: function (data, callback) {
        var _this = this;
        var params = data.params || {};
        var ajaxConfig = data.ajaxConfig || {};
        callback = callback || function () { };
        var url = ajaxConf.webApiUrl + "activity/insertActivityGainRecord";
        var data = {
            url: url,
            params: params,
            ajaxConfig: ajaxConfig
        };
        _this.ajax(data, callback);
    },

    /**
     * 一元周卡活动,获取用户状态
     * @param params userId  必传
     * @param params database  不必传 数据库名
     */
    getUserState: function (data, callback) {
        var _this = this;
        var params = data.params || {};
        var ajaxConfig = data.ajaxConfig || {};
        callback = callback || function () { };
        var url = _this.interfaceUrl + "getUserState";
        var data = {
            url: url,
            params: params,
            ajaxConfig: ajaxConfig
        };
        _this.ajax(data, callback);
    },

    /**
     * 一元周卡活动,老用户获取状态
     * 针对老用户的单独接口：（前提：上面针对新用户的接口返回的是state为0,才调用这个老用户接口）
     * @param params userId  必传
     * @param params database  必传 数据库名  cloud_base_channel_log_v1_3_test(测试网)
     */
    getOldUserState: function (data, callback) {
        var _this = this;
        var params = data.params || {};
        var ajaxConfig = data.ajaxConfig || {};
        callback = callback || function () { };
        var url = ajaxConf.imgUrl + "/userrecord/api/web/getOldUserState";
        var data = {
            url: url,
            params: params,
            ajaxConfig: ajaxConfig
        };
        _this.ajax(data, callback);
    },


};