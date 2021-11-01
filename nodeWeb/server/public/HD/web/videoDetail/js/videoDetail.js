/*
 * @LastEditors: jwzx
 * @LastEditTime: 2020-11-30 21:07:56
 */
addEvent.on("pageEvent",function(e){
 
    var  transferObj =basePageInfo.transferObj;
    var  reqQuery = basePageInfo.reqQuery;

   
    var page = {
        contentId : basePageInfo.commonPageInfo.pageInfo.commonPageId,
        videoListJSon : transferObj.videoListJSonData,
        cartoonData : transferObj.cartoonDetailData,
        cartoonId : transferObj.cartoonId,
        curPageMaxEListNum : transferObj.maxPageNum,
    //    curpageNum : reqQuery.curpageNum ? reqQuery.curpageNum : 1,
        curpageNum : 1,
        //当前展示集数起点
        episodeBegin: 0,
        // 是否使用大数据推荐数据
        bigDataSwitch: true,
        // 运营侧人工配置下部推荐位数据
        recommendBottom_manualConfig: transferObj.pageInfo.recommendBottom,
        // 大数据推荐下部推荐位数据
        recommendBottom_bigData: [],
        // 最终使用下部推荐位数据
        recommendBottom: transferObj.pageInfo.recommendBottom,

        episodeEnd : transferObj.episodeEnd,
        pageList: transferObj.pageList,
        maxEpisodeListNum : transferObj.maxEpisodeListNum,
        imgUrl : transferObj.localImg,
        curButtomList: transferObj.curButtomList,
        recRows: transferObj.recRows,
        recPage: 0,
        recStep: transferObj.recStep,
        recommendBottom:transferObj.pageInfo.recommendBottom,
        emptyImgUrl: transferObj.pageInfo.emptyImgUrl,
        userId:xjDataLog.getUserId(),
        disablePageNum:0,
        curEpisodeListNum:reqQuery.curEpisodeListNum ? reqQuery.curEpisodeListNum : 0,
        totalPage:transferObj.pageInfo.totalPage,
        toggleCollectStateFlag:true,
        defaultFocusId:"hands_x0_y0_DMXQvideo_",

        init:function(){
            if(!this.cartoonData || this.cartoonData.booleanUp == 0) {
                setTimeout(function(){
                    CT.BackPortalMainPage();
                },3000);
                CT.undercarriageTip();
            }
            try{
                orderJs.auth_cache_info = {
                    result: -1,
                    authTime:new Date().getTime(),
                    data:null,
                    time_out:60000,
                    cache_strategy:2
                }
            } catch (e){

            }
            
            this.getVideoData();
            //获取收藏状态
            this.getCollectState();
            this.showAdsePosi();
            
            if(CT.$("viptitle_1")) {
                // var _activity_areaCodes = ["1002","1502","1503","1504","1505","1506","1510","1509","101000",
                // "3002","3005","3023","3024","3025","3033","3034","3035","3095","3201","3202","3203","3204","3209","3210","3211","3212","3213","101200","101700","101800"
                var _activity_areaCodes = ["3002","3005","3023","3024","3025","3033","3034","3035","3095","3201","3202","3203","3204","3209","3210","3211","3212","3213","101200","101700","101800"
            ];
            try{
                _activity_areaCodes = ajaxConf.SystemConfigKeys.first_free_areaids.configValue.split(",");
            }catch(e){}
            
            if(!_activity_areaCodes || _activity_areaCodes.length == 0) {
                CT.$("viptitle_1").style.display = "block";
                return;
            }else if(orderJs && orderJs.getAreaOfUser) {
                    orderJs.getAreaOfUser(function(res,areaCode){
                        clearTimeout(window["toOrderTimeOut"]);
                        if(_activity_areaCodes.indexOf(areaCode) > -1) {
                            CT.$("viptitle_1").style.display = "none";
                            window["viptitle_1_is_free"] = true;
                        } else {
                            CT.$("viptitle_1").style.display = "block";
                        }
                    });
                }
            }
        },
        
        getVideoData: function() {
            var _this = this;
            //视频框和收藏、播放按钮
            var videoListJSon = this.videoListJSon || {};
            var cartoonData = this.cartoonData || {};
            //所有集数信息
            try {
                //播放视频
                this.playSmallVideo();
            } catch (e) {}

            //卡通的详细描述
            if (cartoonData) {
                //显示一屏集数
                this.showEpisodes(1,this.episodeEnd);
                //是否显示剧集集合按钮翻页箭头
                this.isShowTurnPageArrow();
                //推荐位下架判断
                this.isBooleanUp();
                // //初始化页面按钮
                
            }
                //clearTimeout(_this.focusInitTimeout );
                setTimeout(function(){
                    if(curFocus && curFocus.FocusID && curFocus.FocusID.length >0) {
                        _this.defaultFocusId = curFocus.FocusID
                    }
                    PAGE.focusInit();
                    PAGE.changeFocus(_this.defaultFocusId);
                    _this.clearData();
                    // 使用大数据推荐或运营配置推荐
                    if (_this.bigDataSwitch) {
                        // 获取大数据推荐
                        // 拼接运营指定条数的人工配置数据，则大数据少请求几条
                        var recommendNum = recRows * recStep + 1;
                        var configNum = _this.recommendBottom_manualConfig.length;
                        // if (_this.recommendBottom_manualConfig && _this.recommendBottom_manualConfig[0]) {
                        //     var more1Obj = CT.getMoresObj(_this.recommendBottom_manualConfig[0].more1);
                        //     var configNum = more1Obj.configNum || 0;
                        //     recommendNum -= configNum;
                        // }
                        // 拼接运营指定条数的人工配置数据在头部
                        _this.recommendBottom_manualConfig = _this.recommendBottom_manualConfig.slice(0, configNum);
                        for (var index = 0; index < _this.recommendBottom_manualConfig.length; index++) {
                            if (_this.recommendBottom_manualConfig[index].recommendDisplayValue == _this.cartoonId) {
                                _this.recommendBottom_manualConfig.splice(index, 1);
                            }
                        }
                        var data = {
                            params: {
                                // 必选：片单ID
                                movieId: _this.cartoonId,
                                // 可选：推荐条数，默认10条
                                recommendNum: recommendNum,
                                // 可选：排序类型：0：升序，1：降序，2：随机，默认为1
                                sortType: 1
                            }
                        }
                        interface.getBigDataRecCartoon_byMovieId(data, function (result) {
                            if (result && result.successFlg == 1 && result.data) {
                                _this.recommendBottom_bigData = result.data;
                                //智能推荐去重
                                for(var i = 0; i < _this.recommendBottom_bigData.length; i++){
                                    for(var z = 0; z < _this.recommendBottom_manualConfig.length; z++){
                                        if(_this.recommendBottom_manualConfig[z].recommendDisplayValue == _this.recommendBottom_bigData[i].id || _this.recommendBottom_bigData[i].id == _this.cartoonId){
                                            _this.recommendBottom_bigData.splice(i,1);
                                        }
                                    }
                                }
                                var defaultNum = recRows * recStep;
                                var maxNum = _this.recommendBottom_bigData.length > defaultNum ? defaultNum : _this.recommendBottom_bigData.length;
                                // 大数据转换后的数据数组
                                var tempArr = [];
                                // 循环转换大数据
                                for (var index = 0; index < maxNum; index++) {
                                    // 其他数据转换为坑位推荐数据：
                                    var transInfo = {
                                        // 必传：需要被转换的数据
                                        transObj: _this.recommendBottom_bigData[index],
                                        // 必传：转换的类型，比如： 1，大数据片单推荐→坑位推荐数据：1；默认
                                        transType: 1,
    
                                        // 选传：目标模板数据
                                        // targetObj: CT.stringToJson(CT.jsonToString(_this.recommendBottom_manualConfig[index])),
                                        // 选传：设定转换类型不能满足的定制化情景，需转换键名对，如：{"a" : "b"}代表被转换对象的b属性的值，赋值到模板对象的a属性上去。
                                        transDiffKeys: {
                                            "recommendDisplayValue": "id"
                                        },
                                        // 选传：设定转换类型不能满足的定制化情景，需写死某属性值，需写死某属性值。如：{"a" : b}代表值b，赋值到模板对象的a属性上去。
                                        transSpecialKeys: {},
                                        //当前只能推荐位于现在推荐模组中的下标
                                        recIndex: _this.recommendBottom_manualConfig.length + index + 1
                                    }
                                    var tempObj = CT.transObjDataToRec(transInfo);
                                    // 转换后的数据推入大数据数组
                                    if (defaultNum - _this.recommendBottom_manualConfig.length > tempArr.length) {
                                        if (tempObj && tempObj.recommendDisplayValue != _this.cartoonId) {
                                            tempArr.push(tempObj);
                                        }
                                    } else {
                                        break;
                                    }
                                }
                                _this.recommendBottom = _this.recommendBottom_manualConfig.concat(tempArr);
                                _this.showData();
                            } else {
                                _this.showData();
                            }
                        });
                    } else {
                        _this.showData();
                    }
                }, 0);
        },

        /**
        *  先获取收藏状态并显示
        *  contentType : 1    0-游戏，1-卡通，2-视频
        */
        getCollectState: function() {
            var _this = this;
            var data = {
                params: {
                    userId: _this.userId,
                    contentId: _this.cartoonId,
                    contentType: 1
                },
                ajaxConfig: { async: true }
            }
            interface.findMediaCollectStatus(data, function(e) {
                if (e.data == 0 || e.data == "0") { //已收藏
                    CT.$("collectImage").src = _this.imgUrl+"collect.png";
                } else { //未收藏
                    CT.$("collectImage").src = _this.imgUrl+"nocollect.png";
                }
            })
        },
        toggleCollectState: function() {
            var _this = this;
            if (!_this.toggleCollectStateFlag) {
                return;
            }
            var data = {
                params: {
                    userId: _this.userId,
                    contentId: _this.cartoonId,
                    contentType: 1
                },
                ajaxConfig: { async: true }
            }
            _this.toggleCollectStateFlag = false;
            interface.findMediaCollectStatus(data, function(e) {
                if (e.data == 0 || e.data == "0") { //已收藏
                    _this.delCollect();
                } else { //未收藏
                    _this.saveCollect();
                }
            })
        },
        /**
        *  添加用户收藏
        */
        saveCollect: function() {
            if(!this.cartoonData || this.cartoonData == '') {
                CT.alertTip("该内容不存在");
                return;
            }
            var _this = this;
            var params = {
                userId: _this.userId,
                contentId: _this.cartoonId,
                contentType: 1
            };
            interface.saveUserCollect(params, function(data) {
                if (data.successFlg == 1) { //1代表收藏成功或内容已经收藏
                    CT.$("collectImage").src = _this.imgUrl+"collect.png";
                    _this.toggleCollectStateFlag = true;
                } else {
                    //收藏失败
                }
            });
        },
        /**
        *  删除收藏
        */
        delCollect: function() {
            var _this = this;
            var params = {
                userId: _this.userId,
                contentId: _this.cartoonId,
                contentType: 1
            };
            interface.deleteUserCollect(params, function(data) {
                if (data.successFlg == 1) { //删除成功
                    CT.$("collectImage").src = _this.imgUrl+"nocollect.png";
                    _this.toggleCollectStateFlag = true;
                } else {
                    //删除失败
                }
            });
        },

        /**
        * 显示集数
        * 传一个起初和终结值，显示中间的所有集数
        * @param episodeBegin 显示集数的起点
        * @param episodeEnd  显示集数最大
        */
        showEpisodes: function(episodeBegin, episodeEnd) {
            var _this = this;
            _this.episodeBegin = episodeBegin;
            var episode = "";
            var num = 0; //div定位使用
            for (var i = episodeBegin; i <= episodeEnd; i++) {
                episode += "<div class='episodes' style='top:8px;left:" + (num * 115) + "px;'>";
                num++;
                if (this.videoListJSon[i - 1].isFree == 0) { //免费图标
                    // episode += "<img class='position' style='top:-17px;' src='../image/free.png'>";
                } else { //vip图标
                    episode += "<img id='viptitle_" + i + "' class='position vip'" + (i == 1 && window["viptitle_1_is_free"] == true? " style='display: none;' ": "") + " src='"+this.imgUrl+"vip.png'>";
                }
                episode += i;
                episode += "</div>";
            }
            CT.$("episode").innerHTML = episode;
        },
        /**
        * 是否显示剧集集合按钮翻页箭头
        */
        isShowTurnPageArrow: function() {
            var _this = this;
            //最大分页数
            var maxPageNum = Math.ceil((_this.pageList.length || 0) / _this.maxEpisodeListNum);
            if (maxPageNum > _this.curpageNum) {
                //不是最后一个分页
                CT.$('trunPageTipImg') && (CT.$('trunPageTipImg').style.visibility = 'visible');
            } else {
                //是最后一个分页
                CT.$('trunPageTipImg') && (CT.$('trunPageTipImg').style.visibility = 'hidden');
            }
        },
        /**
        *  播放小视频
        */
        playSmallVideo: function() {
            var mediaCode = this.videoListJSon[0].movieDetails[0].playUrl;

        if (window.navigator.appVersion.indexOf("Safari") > -1) {
        videoPlayer.SmallPlay({
                top: 68,
                left: 87,
                height: 205,
                width: 350,
                nns_ids: mediaCode,
                videoIndex: 0,
                smallVideoInfo: this.videoListJSon[0]
            });
        }else{
            videoPlayer.SmallPlay({
                top: 68,
                left: 87,
                height: 212,
                width: 350,
                nns_ids: mediaCode, //合集媒资
                videoIndex: 0, //当前集数下标
                //上传小视频播放日志所用信息
                smallVideoInfo: this.videoListJSon[0]
            });
        }

        },
        /**
        * 判断推荐位是否下架
        */
        isBooleanUp: function() {
            for (var i = 0; i < this.recommendBottom.length; i++) {
                CT.isBooleanUp(this.recommendBottom[i].booleanUp, "hands_x0_y0_buttom" + i + "_", "recommend");
            }
            // for (var i = 0; i < this.curButtomList.length; i++) {
            //     CT.isBooleanUp(this.curButtomList[i].booleanUp, "hands_x0_y0_buttom" + i + "_", "recommend");
            // }
        },
        /**
        * 展示推荐位数据
        * */
        showData: function() {
            // 获取数据
            var arr = this.getCurData();
                // 清除数据
            this.clearData();
                // 渲染数据
            for (var _i = 0; _i < arr.length; _i++) {
                (function(i){
                    // 赋值数据
                    var ele = PAGE.getModelByFocusId('hands_x0_y0_buttom' + i + '_');
                    ele.TempData = arr[i];
                    ele.enFocus = true;
                    CT.$('recBotImg' + i).src = AjaxConfig.imgUrl + arr[i].recommendPic.picPath;
                    CT.$('contentTitle' + i).innerHTML = arr[i].recommendDisplayName.length > 8 ? arr[i].recommendDisplayName.slice(0, 8) : arr[i].recommendDisplayName;
                    CT.$('contentTitle' + i).style.visibility = 'visible';
                    if (arr[i].booleanFree == 0) {
                        CT.addClass(CT.$("freeBadge" + i), 'freeBadge');
                    } else {
                        if (CT.hasClass(CT.$("freeBadge" + i), 'freeBadge')) {
                            CT.removeClass(CT.$("freeBadge" + i), 'freeBadge');
                        }
                    }
                })(_i)
            }
            //地步数据下翻光标错误问题
            if (curFocus.FocusID.indexOf('hands_x0_y0_buttom') > -1) {
                var curBtnIndex = Number(curFocus.FocusID.substring(18, 19));
                if (curBtnIndex > arr.length - 1) {
                    //当前光标超出渲染数据
                    CT.$('buttom' + curBtnIndex).style.visibility = 'hidden';
                    PAGE.changeFocus('hands_x0_y0_buttom' + (arr.length - 1) + '_');
                }
            }
        },
        /**
        * 点击 视频框、播放按钮、某一集，准备去全屏
        * 取数据 _this.list[_this.curEpisodeListNum][num]
        * 注：1.判断是否免费  0，免费，1收费
        *     2.收费先去鉴权，鉴权通过直接播放
        * @param num  num == "smallVideo" 小窗口，其他表示下面的选集
        */
        toPlayVideo: function(num) {
            var _this = this;
            interface.findUserForbiddenTime({ params: { userId: _this.userId }, ajaxConfig: { async: true } }, function(res) {
                _this.canWatch = res.data.canWatch;
                if (_this.canWatch) {
                    _this.curEpisode = Number(num);
                    //点击推荐位数据
                    var curData = (num == "smallVideo") ? _this.videoListJSon[0] : (_this.pageList[_this.curEpisodeListNum][num]);
                    var mediaCode = curData.movieDetails[0].playUrl;
                    //添加全屏cookie
                    var index = num == "smallVideo" ? 0 : Number(_this.pageList[_this.curEpisodeListNum][num].videoNumber) - 1;
                    if (index < 9) {
                        var pageNo = 0;
                        var defaultFocus = "hands_x0_y0_number" + index + "_";
                    } else {
                        var pageNo = index - 8;
                        var defaultFocus = "hands_x0_y0_number8_";
                    }
                    var params = {
                        pageNo: pageNo,
                        defaultFocus: defaultFocus
                    };
                    params = CT.jsonToString(params);
                    CT.setCookie('listNotes', params);
                    //记录返回
                    PAGE.otherPageParam = "&contentId=" + _this.contentId + "&contentEName=" + basePageInfo.commonPageInfo.pageInfo.commPageEname + "&contentCName=" + basePageInfo.commonPageInfo.pageInfo.commPageCname + "&cartoonId=" + _this.cartoonId + "&curFocusId=" + curFocus.FocusID + "&curpageNum=" + _this.curpageNum + "&curEpisodeListNum=" + _this.curEpisodeListNum + "&curEpisode=" + _this.curEpisode;
                    CT.goPage();
                    _this.playVideo(curData);
                } else {
                    //在禁播时间段，禁止观看
                // CT.alertTip('小朋友要爱护自己的眼睛，现在是禁止观看时间哦~', { time: 3000 })
                    var nowatch_pro = _this.createDiv({_id:"nowatch_pro",_top:parseInt((720-388)/3),_left:parseInt((1280 - 357) / 2),_width:357,_height:388});
                    nowatch_pro.style.zIndex = "9999";
                    nowatch_pro.innerHTML = "<img src='" + _this.emptyImgUrl.replace("empty.png","nowatching_alert.png") + "'>";
                    clearTimeout(page.showNoWatchinger);
                    page.showNoWatchinger = setTimeout(function(){
                        nowatch_pro.innerHTML = "";
                    },5000);
                }
            });
        },
        
        /**
        * 全屏
        * @param curData 全屏播放需要的数据
        */
        playVideo: function(curData) {
            var _this = this;
            //跳转
            curData.recommendDisplayType = 2; //页面类型2表示全屏页面
            curData.cartoonId = _this.cartoonId;
            CT.toAnterRecommendUrl(curData);
        },
        /**
        * 截取当前数据
        * */
        getCurData: function() {
            var startIndex = this.recPage * this.recStep
            var endIndex = startIndex + this.recStep * this.recRows
            if (endIndex > this.recommendBottom.length) {
                endIndex = this.recommendBottom.length
            }
            var newArr = this.recommendBottom.slice(startIndex, endIndex)
            return newArr
        },
        /**
        * 清除数据
        * */
        clearData: function() {
            for (var i = 0; i < this.recRows * this.recStep; i++) {
                CT.$('recBotImg' + i).src = this.emptyImgUrl;
                PAGE.getModelByFocusId('hands_x0_y0_buttom' + i + '_').enFocus = false
                CT.$('contentTitle' + i).innerHTML = '';
                CT.$('contentTitle' + i).style.visibility = 'hidden';
            }
        },
        /**
        * 选集按钮获焦事件
        * */
        initButtonRecShow: function(curIndex) {
            var _this = this;
            curFocus.TempData = {
                recommendTrackName: "DMXQepisode" + (parseInt(curIndex) + parseInt(_this.episodeBegin) - 1)
            };
        },
        /**
        *  切换页码光标
        *  @param num  当num不存在时是上部光标切换到页码光标、当num=1是第一页、num=_this.maxPageNum-1是最后一页码
        *  
        */
        togglePage: function(num) {
            var _this = this;
            if (!num) {
                if (_this.videoListJSon.length > 0) {
                    PAGE.changeFocus("hands_x0_y0_DMXQselect0_");
                } else {
                    PAGE.changeFocus("hands_x0_y0_buttom0_");
                }
            } else if (num == 1) {
                if (_this.curpageNum > 1) { //需要翻页
                    var pageNum = "";
                    PAGE.focusArr["hands_x0_y0_DMXQselect" + _this.disablePageNum + "_"].coo.right = "hands_x0_y0_DMXQselect" + (_this.disablePageNum + 1) + "_";
                    var maxPageNum = _this.maxEpisodeListNum;
                    _this.curPageMaxEListNum = maxPageNum;
                    _this.curpageNum--;
                    for (var i = 0; i < maxPageNum; i++) {
                        //数字
                        pageNum += "<div class='pageNum' id='pageNum" + i + "'>" + (10 * ((_this.curpageNum - 1) * _this.maxEpisodeListNum + i) + 1) + "-" + (10 * ((_this.curpageNum - 1) * _this.maxEpisodeListNum + i + 1) < (_this.videoListJSon.length) ? 10 * ((_this.curpageNum - 1) * _this.maxEpisodeListNum + i + 1) : (_this.videoListJSon.length)) + "</div>";
                    }
                    CT.$("pageNum").innerHTML = pageNum;
                    PAGE.changeFocus("hands_x0_y0_DMXQselect0_");
                }
            } else if (num == _this.maxEpisodeListNum - 1) {
                if (_this.curpageNum * _this.maxEpisodeListNum < Math.ceil(_this.videoListJSon.length / 10)) { //需要翻页
                    var pageNum = "";
                    var remainPage = Math.ceil(_this.videoListJSon.length / 10) - (_this.curpageNum * _this.maxEpisodeListNum);
                    var maxPageNum = remainPage > _this.maxEpisodeListNum ? _this.maxEpisodeListNum : remainPage;
                    _this.curPageMaxEListNum = maxPageNum;
                    for (var i = 0; i < maxPageNum; i++) {
                        //数字
                        pageNum += "<div class='pageNum' id='pageNum" + i + "'>" + (10 * (i + _this.maxEpisodeListNum*_this.curpageNum) + 1) + "-" + (10 * ((i + _this.maxEpisodeListNum*_this.curpageNum) + 1) < (_this.videoListJSon.length) ? 10 * ((i + _this.maxEpisodeListNum*_this.curpageNum) + 1) : (_this.videoListJSon.length)) + "</div>";
                    }
                    _this.curpageNum++;
                    CT.$("pageNum").innerHTML = pageNum;
                    PAGE.changeFocus("hands_x0_y0_DMXQselect0_");
                    if (maxPageNum != 6) {
                        PAGE.focusArr["hands_x0_y0_DMXQselect" + (maxPageNum - 1) + "_"].coo.right = "disable";
                        _this.disablePageNum = maxPageNum - 1;
                    }
                } else {
                    PAGE.changeFocus("hands_x0_y0_DMXQGN0_");
                }
            } else {
                PAGE.changeFocus("hands_x0_y0_DMXQselect" + _this.curEpisodeListNum + "_");
            }
            //是否显示剧集集合按钮翻页箭头
            _this.isShowTurnPageArrow();
        },
        /**
        *  切换每个页码对应的具体的某几集
        *  @param num 序号
        */
        toggleEpisode: function(num) {
            var _this = this;
            num = num || 0;
            //是否显示剧集集合按钮翻页箭头
            _this.isShowTurnPageArrow();
            _this.curEpisodeListNum = num;
            //先清空黄色字体样式
            _this.clearColor();
            //改变页码样式
            PAGE.addClass(CT.$("pageNum" + num), "pageColor");
            var episodeBegin = 10 * ((_this.curpageNum - 1) * _this.maxEpisodeListNum + num) + 1;
            var episodeEnd = CT.$("pageNum" + num).innerText;
            episodeEnd = parseInt(episodeEnd.slice(episodeEnd.indexOf("-") + 1, episodeEnd.length));
            //最后一个未禁止的焦点按钮下标
            var lastShowBtnIndex = Number(episodeEnd) - Number(episodeBegin);
            for (var index = 0; index < 10; index++) {
                if (index <= lastShowBtnIndex) {
                    //集数按钮启用焦点
                    PAGE.getModelByFocusId('hands_x0_y0_episode' + index + '_').enFocus = true;
                } else {
                    //集数按钮禁用焦点
                    PAGE.getModelByFocusId('hands_x0_y0_episode' + index + '_').enFocus = false;
                }
            }
            _this.showEpisodes(episodeBegin, episodeEnd);
        },
        //创建div元素
        createDiv : function(param,contains) {
            if(!param || typeof(param._id) != 'string') return null;
            if(!CT.$(param._id)) {
                var el = document.createElement("div");
                el.id = param._id;
                if(!isNaN(parseInt(param._top)) || !isNaN(parseInt(param._left))) {
                    el.style.position = "absolute";
                    el.style.top = (!isNaN(parseInt(param._top)) ? parseInt(param._top):0) + "px";
                    el.style.left = (!isNaN(parseInt(param._left)) ? parseInt(param._left):0) + "px";
                }
                el.style.width = (parseInt(param._width) >=0 ? parseInt(param._width):0) + "px";
                el.style.height = (parseInt(param._height) >=0 ? parseInt(param._height):0) + "px";
                // _id,_top,_left,_width,_hegith
                if(!contains) {
                    contains = document.getElementsByTagName("body")[0] 
                }
                contains.appendChild(el);
            }
            return CT.$(param._id);
        },
        /**
         * 跳转
         */
        toPage:function(){
            var _this = this;
            if(curFocus&&curFocus.TempData) {
                //记录返回
                PAGE.otherPageParam = "&contentId=" + _this.contentId + "&contentEName=" + CT.requestValue("contentEName") + "&contentCName=" + CT.requestValue("contentCName") + "&cartoonId=" + _this.cartoonId + "&curFocusId=" + curFocus.FocusID + "&curpageNum=" + _this.curpageNum + "&curEpisodeListNum=" + _this.curEpisodeListNum + "&curEpisode=" + _this.curEpisode;
                CT.goPage();
                CT.toAnterRecommendUrl(curFocus.TempData);
            }
        },
        /**
         * 跳转订购页
         */
        toOrderPage: function(){
            var _this = this;//记录返回
            PAGE.otherPageParam = "&contentId=" + _this.contentId + "&contentEName=" + CT.requestValue("contentEName") + "&contentCName=" + CT.requestValue("contentCName") + "&cartoonId=" + _this.cartoonId + "&curFocusId=" + curFocus.FocusID + "&curpageNum=" + _this.curpageNum + "&curEpisodeListNum=" + _this.curEpisodeListNum + "&curEpisode=" + _this.curEpisode;
            CT.goPage();
            orderJs.getAuth(function(){
                CT.alertTip("已订购");
            });
        },
        /**
         * 广告位创建
         */
        createPosition:function(order_portals,idx){
            if(order_portals.length - 1 < idx ) return;
            var _this = this;
            var order_portal = order_portals[idx];
            var order_ele = _this.createDiv({
                _id:"hands_x0_y0_order" + idx + "_",
                _top:order_portal.pageRecommendConfigTabVos[0].yvalue,
                _left:order_portal.pageRecommendConfigTabVos[0].xvalue,
                _width:order_portal.recommendPic.picW,
                _height:order_portal.recommendPic.picH
            });
            var _top1 = order_portal.pageRecommendConfigTabVos[0].yvalue;
            //order_ele.style.background="url('" + AjaxConfig.imgUrl + order_portal.recommendPic.picPath + "')";
            order_ele.innerHTML = "<img id='order" + idx + "' width='"+order_portal.recommendLabelpic.picW+"' height='" + order_portal.recommendLabelpic.picH + "' src='" + AjaxConfig.imgUrl + order_portal.recommendLabelpic.picPath + "' style='visibility:hidden;zIndex:100;position:absolute;top:0px;left:0px;'>"
            +"<img id='order" + idx + "_img_' width='"+order_portal.recommendLabelpic.picW+"' height='" + order_portal.recommendLabelpic.picH + "' src='" + AjaxConfig.imgUrl + order_portal.recommendPic.picPath + "' style='zIndex:100;position:absolute;top:0px;left:0px;'>";

            var button = {
                id: 'hands_x0_y0_order' + idx + "_",
                // clickHandler: 'javascript:orderJs.toOrderPage()',
                clickHandler: 'javascript:page.toOrderPage()',
                right: _top1 > 100? "hands_x0_y0_DMXQGN0_" : "disable",
                left: _top1 > 100? "hands_x0_y0_DMXQvideo_" : "disable",
                up: 'disable',
                down: _top1 < 100 ? 'hands_x0_y0_DMXQvideo_' : 'disable',
                focusType: 7,
                TempData : order_portal
            }
            // 2.配置more2为任意值,决定是未订购用户是不先跳订购而直接跳相应活动或专题页面,不配置,优先鉴权跳订购.
            if(order_portal.more2 && order_portal.more2.length > 0) {
                button.TempData = order_portal;
                button.clickHandler = "javascript:page.toPage()"
            }
            if(_top1 > 100) {
                button.downEvent = "javascript:page.togglePage()";
            }
            if(!_this.orderButtons) _this.orderButtons = [];
            _this.orderButtons.push(order_ele)
            buttons.push(button);
            order_portals[idx].isShowed = true;
            clearTimeout(_this.focusInitTimeout );
            _this.focusInitTimeout = setTimeout(function(){
                if(curFocus && curFocus.FocusID && curFocus.FocusID.length >0) {
                    _this.defaultFocusId = curFocus.FocusID
                }
                PAGE.focusInit();
                PAGE.getModelByFocusId(_this.defaultFocusId).enFocus=true;
                PAGE.changeFocus(_this.defaultFocusId);
                _this.showData();
            },1200);
        },
        //显示广告位
        showAdsePosi: function(){
            var _this = this;
            if(basePageInfo.commonPageInfo['recommend_5'] && basePageInfo.commonPageInfo['recommend_5'].length > 0) {
                var order_portals = basePageInfo.commonPageInfo['recommend_5'];
                for(var i = 0;i < order_portals.length;i++) {
                    if(order_portals[i].isShowed == true) continue;
                    // 1.配置more1为任意值,订购用户和非订购用户都显示. 不配置值,已订购用户不显示
                    if(!order_portals[i].more1 || order_portals[i].more1.length == 0) {
                        (function(_i){
                            orderJs.getAuth(
                            function(){},
                            function(){
                            _this.createPosition(order_portals,_i);
                            })
                        })(i);
                    } else {
                        _this.createPosition(order_portals,i);
                    }
                }
            }
        },
        /**
         * 
         * @param {*} _action 方向按键
         * @param {*} _default 如果不合,用默认的
         */
        toUpOrderBtn:function(_action,_default){
            var _this = this;
            var _id = _default;
            if(_this.orderButtons) {
                switch(_action) {
                    case "up" :
                        for(var i = 0;i < _this.orderButtons.length;i++) {
                            var order_ele = _this.orderButtons[i];
                            if(parseInt(order_ele.style.top) < (curFocus.Y_Posi > 0 ? curFocus.Y_Posi : 51)) {
                                _id = order_ele.id;
                                break;
                            }
                        }
                        break;
                    case "right" :
                        for(var i = 0;i < _this.orderButtons.length;i++) {
                            var order_ele = _this.orderButtons[i];
                            if(parseInt(order_ele.style.left) > (curFocus.X_Posi > 0 ? curFocus.X_Posi : 57)) {
                                _id = order_ele.id;
                                break;
                            }
                        }
                        break;
                    case "left" :
                        max_left = {};
                        for(var i = 0;i < _this.orderButtons.length;i++) {
                            var order_ele = _this.orderButtons[i];
                            if(!max_left.left || max_left.left < parseInt(order_ele.style.left)) {
                                max_left.left = parseInt(order_ele.style.left);
                                _id = order_ele.id;
                            }
                        }
                        break;
                        
                }
            } else {
                PAGE.changeFocus(_default);
            }
            
            if(PAGE.focusArr[_id]){PAGE.changeFocus(_id);} else if(_default && PAGE.focusArr[_default]) {PAGE.changeFocus(_default);};
        },
        /**
        * 底部推荐向上，先判断卡通是否存在至少一集
        */
        buttomUpEvent: function(index) {
            var _this = this;
            if (_this.recPage > 0) {
                _this.recPage--
                    _this.showData()
            } else {
                if (_this.videoListJSon.length > 0) {
                    PAGE.changeFocus("hands_x0_y0_episode0_");
                } else {
                    PAGE.changeFocus("hands_x0_y0_DMXQvideo_");
                }
            }
            _this.runText(curFocus.FocusID.split('_')[3].replace(/[^0-9]/ig, ""))
        },
        /**
        * 详情页推荐位向下事件
        * */
        buttomDownEvent: function(index) {
            var _this = this
            // if (_this.recPage < _this.totalPage) {
            //     _this.recPage++
            //     _this.showData()
            // }
            if (_this.recPage < _this.recRows - 1) {
                _this.recPage++
                _this.showData()
            }
            _this.runText(curFocus.FocusID.split('_')[3].replace(/[^0-9]/ig, ""))
        },
        //添加跑马灯
        runText: function(index) {
            var _this = this;
            var showTitle = " " + curFocus.TempData.recommendDisplayName;
            if (curFocus.TempData && curFocus.TempData.recommendDisplayName && curFocus.FocusID.indexOf("hands_x0_y0_buttom") >= 0) {
                CT.$("contentTitle" + index).innerHTML = CT.setMarquee(showTitle, 16, 4);
            }
        },
        //去除跑马灯
        stopText: function(index) {
            CT.$("contentTitle" + index).innerHTML = String(curFocus.TempData.recommendDisplayName).substring(0, 8);
        },
        /**
        * 清除每一个集数集合的样式
        */
        clearColor: function() {
            var _this = this;
            for (var i = 0; i < _this.curPageMaxEListNum; i++) {
                PAGE.removeClass(CT.$("pageNum" + i), "pageColor");
            }
        },
        /**
        *  底部推荐位点击跳转到相对应的详情页
        *  booleanUp = 0表示已经下架，下架的卡通不跳转
        *  @param num 序号
        */
        toVideoDetail: function(num) {
            var _this = this;
            if (_this.recommendBottom[num].booleanUp != 0) {
            // if (_this.curButtomList[num].booleanUp != 0) {
                // 逻辑需要重写
                orderJs.getAuth(function () {

                //智能推荐是否跳转订购与第一个人工推荐保持一致
                if((curFocus.TempData.recommendTrackName+"").indexOf("intelligent") > -1){
                    curFocus.TempData.more1 = _this.recommendBottom[0].more1;
                }
                    CT.toAnterRecommendUrl(curFocus.TempData);
                });
            }else{
                CT.undercarriageTip();
            }
        },
    }
    window.transferObj = transferObj;
    window.reqQuery = reqQuery;
    window.page = page;
    page.init(e);
})

  



function backFunc() {
    var columnBackUrl = CT.getCookie("columnBackUrl");
    CT.delCookie("columnBackUrl");
    if (columnBackUrl) {
        // CT.delPreMemoryPage();
        CT.commonJumpUrl(columnBackUrl);
    } else {
        CT.backPage();
    }
}
