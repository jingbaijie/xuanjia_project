class request {
    constructor() {
        this._header = { 'content-type': 'application/x-www-form-urlencoded' };
        this.ipConfigLocal = "https://yszc.96335.com:29443";// 新 http://192.168.2.162:11162  旧 http://192.168.2.174:11162
        this.ipConfigImg = "https://yszc.96335.com:29443";//图片
        // this.ipConfig = "https://xxzq.96335.com:29443";//广西测试网
        //this.ipConfig = "https://xxzq.96335.com:28443";//广西现网
        this._baseUrl = this.ipConfigLocal+ '/iptv-wechat-api';
        this.area = this._baseUrl + "/api/area/list"//查询所有地市信息
        this.organ = this._baseUrl + "/api/organization/list"//根据地市编号查询机构分页列表
        this.getOpenId = this._baseUrl + "/api/wechat/getOpenId"//获取openId
        this.getUserInfo = this._baseUrl + "/api/wechat/getWechatUser"//根据 openId 获取用户信息
        //微信用户登录, 存入用户信息
        this.insertUserInfo = this._baseUrl + "/api/wechat/insertWeChatUser";
        this.getCpDetailById = this._baseUrl + "/api/cp/getCpDetailById"//获取机构详情页
        this.collectCp = this._baseUrl + "/api/cp/collectCp"//收藏    已收藏
        this.getCollectList = this._baseUrl + "/content/wechatCollectionTab/getUserCollectedInfo";//我的收藏
        this.getStudent = this._baseUrl + "/api/pageStudent"//学员列表
        this.getStudentDetailById = this._baseUrl + "/api/getCartoonDetailById"//学员详情
        this.findVideoDetailById = this._baseUrl + "/api/web/findVideoDetailById"//视频详情
        this.operateVideo = this._baseUrl + "/content/wechatVideoExtraInfo/operateVideo"//收藏，点赞，转发接口
        this.findRecCommonPageInfo = this._baseUrl + "/api/web/findRecCommonPageInfo"//通用专题-获取通用页面接口，可以通过Ename和ID来查询
        this.insertHistory = this._baseUrl + "/api/web_back/view/history/insert"//新增观看历史        
        this.searchVideoInfoForWeChat = this._baseUrl + "/api/web/searchVideoInfoForWeChat"//根据地市获取所有视频，广西省传空
        this.time = this.ipConfigLocal + "/wechatToken/time"//时间
        this.findVideoDetailById = this._baseUrl + "/api/web/findVideoDetailById"//视频详情页
        // 搜索页 搜索接口
        this.search = this._baseUrl + "/api/web/search"
        // 搜索页 热门搜索推荐接口
        this.hotSearch = this._baseUrl + "/api/web/geHotSerachContent"
        // 上传登录注册页   老学员登录接口
        this.oldStudent = this._baseUrl + "/api/login/oldStudent"
        // 上传登录注册页   新学员注册接口
        this.newStudent = this._baseUrl + "/api/sign/newStudent"
        // 上传登录注册页   获取学员列表
        this.getStuList = this._baseUrl + "/api/list/studentByOpenId"
        // 获取我的作品
        this.getMyWorks = this._baseUrl +"/api/works/list";
        // 删除我的作品
        this.deleteWorks = this._baseUrl + "/api/wechatUpload/delUploadLog";
        //查询观看历史
        this.getHistory = this._baseUrl + "/api/web_back/view/history";
        // 上传文件地址
        this.uploadWorks = this._baseUrl + '/api/wechatUpload/new/uploadWorks'
        // 视频 / 图片广场 接口
        this.getContentSquare = this._baseUrl + '/api/web/getContentSquare';

    }
    /**
     * 接口请求_xujie
     */
    xjRequestApi(paramsObj, callback, failCallback) {
        wx.request({
            url: paramsObj.requestUrl,
            header: paramsObj.header || this._header,
            method: paramsObj.method || "GET",
            data: paramsObj.data || {},
            success: (res) => {
                callback && callback(res);
            },
            fail: (res) => {
                failCallback && failCallback(res);
            }
        })
    }


    /**
     * 设置统一的异常处理
     */
    setErrorHandler(handler) {
        this._errorHandler = handler;
    }

    /**
     * GET类型的网络请求
     */
    getRequest(url, data, header = this._header) {
        return this.requestAll(this._baseUrl + url, data, header, 'GET')
    }

    /**
     * DELETE类型的网络请求
     */
    deleteRequest(url, data, header = this._header) {
        return this.requestAll(this._baseUrl + url, data, header, 'DELETE')
    }

    /**
     * PUT类型的网络请求
     */
    putRequest(url, data, header = this._header) {
        return this.requestAll(this._baseUrl + url, data, header, 'PUT')
    }

    /**
     * POST类型的网络请求
     */
    postRequest(url, data, header = this._header) {
        return this.requestAll(this._baseUrl + url, data, header, 'POST')
    }

    // 封装请求
    requestAll(url, data, header, method) {

        return new Promise((resolve, reject) => {
            // 调用请求显示loading
            wx.showLoading({
                title: '加载中...'
            })

            wx.request({
                url: url,
                data: data,
                header: header,
                method: method,
                success: (res => {
                    // 关闭loading
                    wx.hideLoading()
                    if (res.statusCode === 200) {
                        // 如果token过期，需要重新调用getopenid
                        if (res.data.errorCode == '104') {
                            wx.login({
                                success: res => {
                                }
                            });
                            wx.showToast({
                                title: '服务器超时，请重试',
                                icon: 'none'
                            })
                        } else {
                            resolve(res)
                        }

                    } else {
                        console.log('!200')
                        //其它错误，提示用户错误信息
                        if (this._errorHandler != null) {
                            //如果有统一的异常处理，就先调用统一异常处理函数对异常进行处理
                            this._errorHandler(res)
                        }
                        reject(res)
                    }
                }),
                fail: (res => {
                    // 关闭loading
                    wx.hideLoading()
                    if (this._errorHandler != null) {
                        this._errorHandler(res)
                    }
                    reject(res)
                })
            })
        })
    }
}

export default request