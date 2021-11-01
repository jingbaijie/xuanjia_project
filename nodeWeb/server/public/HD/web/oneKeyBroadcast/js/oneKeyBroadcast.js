// const { json } = require("body-parser");

var page = {
    imgUrl: AjaxConfig.imgUrl,//图片Ip地址
    localImg: basePageInfo.localImg,
    emptyImgUrl: './HD/images/empty.png',//空图片地址
    //页面英文名 从眉头取覆盖
    contentName: null,
    //页面编号ID 从眉头取覆盖
    contentId: null,
    commonPageInfo: basePageInfo.commonPageInfo,//推荐信息
    //箭头动画计时器，所用变量
    arrowCount: 0,
    //箭头动画计时器
    arrowTimer: null,
    //眉头分类标签数据
    recommendNavData: [],
    //视频进度条总长
    fullBarLength: 810,
    //进度条起始left位置
    barStartLeftPos: 108,
    //当前所属导航分类下标
    // curNavclassIndex: Number(CT.requestValue("curNavclassIndex")) || 0,
    curNavclassIndex: 0,
    //该字段为存贮眉头分类的详细数据，X为眉头顺序编号,动态创建赋值，有多少个导航分类就有多少个
    //navLabelDetailDataX

    //当前播放视频数据,curVideoPlayingData0或curVideoPlayingData1.....对应后台配置videoId请求过来的视频详情数据，如已存在则不用请求
    //curVideoPlayingData : Number(CT.requestValue("curVideoPlayingDataIndex")) || 0,
    //当前播放视频数据下标
    // curVideoPlayingDataIndex: Number(CT.requestValue("curVideoPlayingDataIndex")) || 0,
    curVideoPlayingDataIndex: 0,
    //当前上部隐藏小视频的数量
    // curhidVideoNum: Number(CT.requestValue("curhidVideoNum")) || 0,
    curhidVideoNum:  0,
    //当前选中小视频的光标序号（总共五个，即为右侧小视频显示区域五个固定光标）
    // curVideoFocusIndex: Number(CT.requestValue("curNavclassIndex")) || 0,
    curVideoFocusIndex:  0,
    //右侧小视频最大渲染数
    curLeftVideoBtnListMaxlen: 1,

    //页面初始化焦点
    // startFocus: CT.requestValue("curFocusId") || 'hands_x0_y0_DMEJonelickvideo_',
    startFocus: 'hands_x0_y0_DMEJonelickvideo_',
    init: function () {
        var _this = this;
        _this.getCommonPageInfo();
    },
    //请求页面通用眉头信息
    getCommonPageInfo: function () {
        var _this = this;
        _this.getCommonPageDataTodo(_this.commonPageInfo);
    },
    //请求到页面基本数据后的操作
    getCommonPageDataTodo: function (data) {
        var _this = this;
        //眉头数据赋值
        _this.recommendNavData = data.recommend_1;
        //创建眉头导航
        _this.createNav();
        //创建右侧视频列表
        _this.createLeftVideoList();
        //创建其他元素（右侧视频选中，弹幕，左侧列表上方播放中和下放提示箭头）
        _this.createOther();
        
        //初始化焦点
        PAGE.focusInit();
        _this.getCurNavData(_this.curNavclassIndex);
        var start = PAGE.getFocusModel6(_this.startFocus);
        start.defaultFocus();
    },
	/*
	生成眉头导航
	*/
    createNav: function () {
        var _this = this;
        //创建右侧列表按钮
        var navBtnListArea = document.createElement('div');
        navBtnListArea.id = 'navBtnListArea';
        //navBtnListArea.className = 'navBtnListArea';
        var navLabelImgAddWidth = 0;
        for (var index = 0; index < _this.recommendNavData.length; index++) {
            if (index > 0) {
                navLabelImgAddWidth += Number(_this.recommendNavData[index - 1].recommendPic.picW);
            }
            var navBtnObj = document.createElement('div');
            navBtnObj.id = 'hands_x0_y0_DMEJonelick' + index + '_';
            navBtnObj.style.position = 'absolute';
            navBtnObj.style.left = 30 + 22 * index + navLabelImgAddWidth + 'px';
            navBtnObj.style.top = '20px';
            //展示图
            var leftBtnBGImg = new Image();
            leftBtnBGImg.id = 'leftBtnBGImg' + index;
            leftBtnBGImg.style.left = '9px';
            leftBtnBGImg.style.top = '7px';
            leftBtnBGImg.src = AjaxConfig.imgUrl + _this.recommendNavData[index].recommendPic.picPath;
            navBtnObj.appendChild(leftBtnBGImg);
            //标识选中图
            var navBtnEd = new Image();
            navBtnEd.id = 'navBtnEd' + index;
            navBtnEd.style.top = '6px';
            navBtnEd.style.left = '9px';
            try {
                navBtnEd.src = AjaxConfig.imgUrl + _this.recommendNavData[index].recommendFocuspic.picPath;
            } catch (error) {

            }
            navBtnEd.style.visibility = 'hidden';
            navBtnObj.appendChild(navBtnEd);
            //焦点图
            var DMEJonelick = new Image();
            DMEJonelick.id = 'DMEJonelick' + index;
            DMEJonelick.style.left = '6px';
            DMEJonelick.style.top = '9px';
            DMEJonelick.src = AjaxConfig.imgUrl + _this.recommendNavData[index].recommendLabelpic.picPath;
            DMEJonelick.style.visibility = 'hidden';
            navBtnObj.appendChild(DMEJonelick);

            navBtnListArea.appendChild(navBtnObj);

            //生成焦点
            var btn = {
                id: 'hands_x0_y0_DMEJonelick' + index + '_',
                clickHandler: 'javascript:page.getCurNavData(' + index + ')',
                //otherFocusEvent : 'javascript:page.navBtnGetFocus(' + index + ')',
                //otherBlurEvent:'javascript:page.rightBtnBlurFocus(' + index + ')',
                left: 'hands_x0_y0_DMEJonelick' + (index - 1) + '_',//"hands_x0_y0_hotRecommendFocus_",
                //leftEvent : 'javascript:page.rightBtntoLeft(' + index + ')',
                right: "hands_x0_y0_DMEJonelick" + (index + 1) + "_",
                up: 'disable',
                down: 'hands_x0_y0_DMEJonelickvideo_',
                //downEvent:'javascript:page.midFiexRecBtnDown(' + index + ')',
                focusType: 7
            }
            if (index == 0) {
                btn.left = 'disable';
            } else if (index == _this.recommendNavData.length - 1) {
                btn.right = 'disable';
            }
            buttons.push(btn);
        }
        CT.$('wrapper').appendChild(navBtnListArea);
    },
    /*
    获取渲染当前分类视频数据
    */
    getCurNavData: function (classIndex) {
        var _this = this;
        //记录当前渲染的数据所属导航，切换导航分类标识状态
        _this.curNavclassIndex = classIndex;
        //重置当前播放视频的数据下标
        _this.curVideoPlayingDataIndex = 0;
        _this.curhidVideoNum = 0;
        _this.curVideoFocusIndex = 0;
        for (var index = 0; index < _this.recommendNavData.length; index++) {
            CT.$('navBtnEd' + index).style.visibility = 'hidden';
        }
        CT.$('navBtnEd' + classIndex).style.visibility = 'visible';
        if (_this['navLabelDetailData' + classIndex]) {
            //渲染当前分类视频
            //渲染数据
            _this.showCurNavClass(classIndex);
        } else {
            //获取当前分类数据并渲染
            var contentId = _this.recommendNavData[classIndex].commpageId;
            if (!contentId) {
                //当前分类没有配对应（页面）数据
                return;
            }
            interface.changeThemeSwitch = false;
            interface.findCommonPageInfo({ params: { "contentId": contentId }, ajaxConfig: { async: true } }, function (data) {
                //如果是第一次请求的当前分类数据，则保存下来
                _this['navLabelDetailData' + classIndex] = data;
                //渲染数据
                _this.showCurNavClass(classIndex);
            });
        }
    },
    /*
        获取当前分类的视频数据
    */
    getCurNavVideoData: function () {
        var _this = this;
        return _this['navLabelDetailData' + _this.curNavclassIndex].data.recommend_1;
    },
    /*
        获取当前播放中的视频数据
    */
    getCurPlayingVideoData: function () {
        var _this = this;
        return _this['curVideoPlayingData' + _this.curNavclassIndex + _this.curVideoPlayingDataIndex];
    },
    /*
    渲染当前分类视频
    */
    showCurNavClass: function (classIndex) {
        var _this = this;
        if (_this['navLabelDetailData' + classIndex]) {
            //当前分类有数据
            //换背景图
            if (_this['navLabelDetailData' + classIndex].data.pageInfo.pageTemplateBgpic) {
                CT.$('BJ').src = AjaxConfig.imgUrl + _this['navLabelDetailData' + classIndex].data.pageInfo.pageTemplateBgpic.picPath;
            }
            //渲染右侧小视频
            _this.curLeftVideoBtnListMaxlen = _this['navLabelDetailData' + classIndex].data.recommend_1.length > 5 ? 5 : _this['navLabelDetailData' + classIndex].data.recommend_1.length;
            for (var index = 0; index < 5; index++) {
                if (_this.curLeftVideoBtnListMaxlen > index) {
                    //解禁右侧视频列表按钮
                    PAGE.getModelByFocusId('hands_x0_y0_rightVideoFocus' + index + '_').enFocus = true;
                } else {
                    //禁掉右侧视频列表按钮
                    PAGE.getModelByFocusId('hands_x0_y0_rightVideoFocus' + index + '_').enFocus = false;
                    CT.$('videoMask' + index).style.visibility = 'hidden';
                }
            }
            //渲染卡通封面 
            _this.updatevideoListCover();
            //播放第一个小视频
            _this.changeVideo(0);
        }
    },
    /*
    更新当前分类视频列表封面显示状态
    */
    updatevideoListCover: function () {
        var _this = this;
        if (_this.getCurNavVideoData()) {
            //当前分类有数据
            //渲染（更新）右侧小视频
            for (var index = 0; index < _this.curLeftVideoBtnListMaxlen; index++) {
                //渲染卡通封面 
                CT.$('rightBtnBGImg' + index).src = AjaxConfig.imgUrl + _this.getCurNavVideoData()[index + _this.curhidVideoNum].recommendPic.picPath;
                //绑定按钮数据
                PAGE.getModelByFocusId('hands_x0_y0_rightVideoFocus' + index + '_').TempData = _this.getCurNavVideoData()[index + _this.curhidVideoNum];
            }
        }
    },
	/*
	生成右侧视频列表
	*/
    createLeftVideoList: function () {
        var _this = this;
        //创建右侧列表按钮
        var videoListArea = document.createElement('div');
        videoListArea.id = 'videoListArea';
        videoListArea.style.position = 'absolute';
        videoListArea.style.top = '93px';
        videoListArea.style.left = '1055px';
        videoListArea.style.width = '200px';
        videoListArea.style.height = '575px';
        videoListArea.style.borderRadius = '0px 6px 6px 0px';
        videoListArea.style.overflow = 'hidden';
        videoListArea.style.background = "url(" + _this.localImg + "videoListBG.png) no-repeat";
        //右侧视频包裹显示区域
        var videoListShowArea = document.createElement('div');
        videoListShowArea.id = 'videoListShowArea';
        videoListShowArea.style.position = 'absolute';
        videoListShowArea.style.top = '0px';
        videoListShowArea.style.left = '7px';
        videoListShowArea.style.width = '193px';
        videoListShowArea.style.height = '575px';
        for (var index = 0; index < 5; index++) {
            var rightVideoBtnObj = document.createElement('div');
            rightVideoBtnObj.id = 'hands_x0_y0_rightVideoFocus' + index + '_';
            rightVideoBtnObj.style.position = 'absolute';
            rightVideoBtnObj.style.left = '0px';
            rightVideoBtnObj.style.top = 10 + index * 125 + 'px';
            rightVideoBtnObj.style.width = '180px';
            rightVideoBtnObj.style.height = '109px';
            //展示图
            var rightVideoBtnBGImg = new Image();
            rightVideoBtnBGImg.id = 'rightBtnBGImg' + index;
            rightVideoBtnBGImg.style.position = 'absolute';
            rightVideoBtnBGImg.style.left = '0px';
            rightVideoBtnBGImg.style.top = '0px';
            rightVideoBtnBGImg.src = _this.emptyImgUrl;
            //rightVideoBtnBGImg.src = '../image/videocover.png'; 
            rightVideoBtnObj.appendChild(rightVideoBtnBGImg);
            //标识选中图
            var rightVideoBtnEd = new Image();
            rightVideoBtnEd.id = 'rightVideoBtnEd' + index;
            rightVideoBtnEd.style.position = 'absolute';
            rightVideoBtnEd.style.left = '-7px';
            rightVideoBtnEd.style.top = '0px';
            try {
                rightVideoBtnEd.src = AjaxConfig.imgUrl + _this.commonPageInfo.recommend_2[0].recommendLabelpic.picPath;
            } catch (error) {
                rightVideoBtnBGImg.src = _this.localImg + 'videoListBtnEd.png';
            }
            rightVideoBtnEd.style.visibility = 'hidden';
            rightVideoBtnObj.appendChild(rightVideoBtnEd);
            //焦点图
            var RightVideoBtnFocus = new Image();
            RightVideoBtnFocus.id = 'rightVideoFocus' + index;
            try {
                RightVideoBtnFocus.src = AjaxConfig.imgUrl + _this.commonPageInfo.recommend_2[0].recommendPic.picPath;
            } catch (error) {
                RightVideoBtnFocus.src = _this.localImg + 'videoListBtnEd.png';
            }
            RightVideoBtnFocus.style.visibility = 'hidden';
            rightVideoBtnObj.appendChild(RightVideoBtnFocus);
            //视频蒙版
            var videoMask = document.createElement('img');
            videoMask.id = 'videoMask' + index;
            videoMask.style.position = 'absolute';
            videoMask.style.left = '0px';
            videoMask.style.top = '0px';
            videoMask.style.width = '180px';
            videoMask.style.height = '109px';
            videoMask.src = _this.localImg + 'cover.png';
            videoMask.style.borderRadius = '5px';
            videoMask.style.visibility = 'visible';
            rightVideoBtnObj.appendChild(videoMask);

            videoListShowArea.appendChild(rightVideoBtnObj);

            //生成焦点
            var btn = {
                id: 'hands_x0_y0_rightVideoFocus' + index + '_',
                //先禁用
                enFocus: false,
                clickHandler: 'javascript:page.changeVideo(' + index + ')',
                otherFocusEvent: 'javascript:page.videoListBtnFocus(' + index + ')',
                //otherBlurEvent:'javascript:page.rightBtnBlurFocus(' + index + ')',
                left: 'hands_x0_y0_DMEJonelickvideo_',
                //leftEvent : 'javascript:page.rightBtntoLeft(' + index + ')',
                right: 'disable',
                upEvent: 'javascript:page.videoListBtnUp(' + index + ')',
                downEvent: 'javascript:page.videoListBtnDown(' + index + ')',
                //downEvent:'javascript:page.midFiexRecBtnDown(' + index + ')',
                TempData: '',
                focusType: 7
            }
            buttons.push(btn);
        }
        //控制可视区域插入展示区域
        videoListArea.appendChild(videoListShowArea);
        CT.$('wrapper').appendChild(videoListArea);
    },
    /*
        右侧小视频按钮获焦事件
    */
    videoListBtnFocus: function (videoFocusIndex) {
        var _this = this;
        _this.curVideoFocusIndex = videoFocusIndex;
        _this.updateRightBtnsState();
        //和选中图重叠时隐藏当前焦点图
        _this.overlapImgHid(videoFocusIndex);
    },
    /*
        右侧小视频按钮，选中状态图和光标图重合时，隐藏光标图
    */
    overlapImgHid: function (videoFocusIndex) {
        var _this = this;
        if (page.curVideoPlayingDataIndex - page.curhidVideoNum == videoFocusIndex) {
            // CT.$('rightVideoFocus' + videoFocusIndex).style.visibility = 'hidden';
            //更换当前展示播放中视频名
            CT.$('nowVideoNameDiv').innerHTML = _this.getCurNavVideoData()[_this.curVideoPlayingDataIndex].recommendDisplayName;
        }
    },
    /*
        右侧小视频按钮向上事件
    */
    videoListBtnUp: function (videoFocusIndex) {
        var _this = this;
        if (videoFocusIndex <= 1) {
            //第一个按钮向上事件
            if (_this.curhidVideoNum > 0) {
                _this.curhidVideoNum--;
                _this.updateRightBtnsState();
            } else {
                PAGE.changeFocus('hands_x0_y0_rightVideoFocus0_');
            }
        } else {
            //其他按钮向上事件
            PAGE.changeFocus('hands_x0_y0_rightVideoFocus' + (videoFocusIndex - 1) + '_')
        }
    },
    /*
        右侧小视频按钮向下事件
    */
    videoListBtnDown: function (videoFocusIndex) {
        var _this = this;
        if (videoFocusIndex == 4) {
            //最后一个按钮向下事件
            if (_this.curhidVideoNum + 4 < _this.getCurNavVideoData().length - 1) {
                _this.curhidVideoNum++;
            }
            _this.updateRightBtnsState();
        } else {
            //其他按钮向下事件
            PAGE.changeFocus('hands_x0_y0_rightVideoFocus' + (videoFocusIndex + 1) + '_')
        }
    },
    /*
    渲染当前分类视频
    */
    changeVideo: function (videoFocusIndex) {
        var _this = this;
        _this.curVideoPlayingDataIndex = _this.curhidVideoNum + videoFocusIndex;
        //更改右侧当前小视频播焦点标识状态
        _this.updateRightBtnsState();
        //和选中图重叠时隐藏当前焦点图
        _this.overlapImgHid(videoFocusIndex);
        //重新播放小视频
        _this.playSmallVideo(videoFocusIndex);
    },
    /*
    播放当前小视频
    */
    playSmallVideo: function () {
        var _this = this;
        //获取视频详细信息
        var curVideoDetailInfo = null;
        
        // loggerInfo('zzw ======>>>>>onekey == >> playSmallVideo >>> start');
        try{
            curVideoDetailInfo = _this.getCurPlayingVideoData();
        }catch(ex) {
            // loggerInfo('zzw ======>>>>>curVideoDetailInfo_err >>>' + ajax.jsonToString(ex));
        }
        if (curVideoDetailInfo) {
            var playParams = {
                top: 95,
                left: 31,
                height: 577,
                width: 1020,
                nns_ids: curVideoDetailInfo.data[0].movieDetails[0].playUrl, //合集媒资
                videoIndex: 0,//当前集数下标
                //上传小视频播放日志所用信息
                smallVideoInfo: curVideoDetailInfo.data[0]
            };
            // loggerInfo('wyy ======>>>>>videoPlayer begin>22222222222>>>> '+ ajax.jsonToString(playParams));
            videoPlayer.SmallPlay(playParams);
        } else {
            var params = {
                videoId: _this.getCurNavVideoData()[_this.curVideoPlayingDataIndex].recommendDisplayValue
            }
            interface.findVideoListByCartoonId({
                params: params,
                ajaxConfig: {
                    async: true
                }
            }, function (e) {
                //保存当前视频详情信息
                _this['curVideoPlayingData' + _this.curNavclassIndex + _this.curVideoPlayingDataIndex] = e;
                var playParams = {
                    top: 95,
                    left: 31,
                    height: 577,
                    width: 1020,
                    nns_ids: e.data[0].movieDetails[0].playUrl, //合集媒资
                    videoIndex: 0,//当前集数下标
                    //上传小视频播放日志所用信息
                    smallVideoInfo: e.data[0]
                };
               // loggerInfo('wyy ======>>>>>videoPlayer begin>>>>> '+ ajax.jsonToString(playParams),"post");
               // loggerInfo('wyy ======>>>>>videoPlayer begin>>>>> t');
                videoPlayer.SmallPlay(playParams);
            });
        }
    },
    /*
        更新右侧视频列表按钮选中状态
        params:
    */
    updateRightBtnsState: function () {
        var _this = this;
        for (var index = 0; index < _this.curLeftVideoBtnListMaxlen; index++) {
            CT.$('videoMask' + index).style.visibility = 'visible';
            CT.$('rightVideoBtnEd' + index).style.visibility = 'hidden';
        }
        CT.$('videoMask' + _this.curVideoFocusIndex).style.visibility = 'hidden';
        var selectingBtnNum = _this.curVideoPlayingDataIndex - _this.curhidVideoNum;
        if (selectingBtnNum >= 0 && selectingBtnNum <= 4) {
            CT.$('rightVideoBtnEd' + selectingBtnNum).style.visibility = 'visible';
            CT.$('videoMask' + selectingBtnNum).style.visibility = 'hidden';
        }
        //渲染卡通封面 
        _this.updatevideoListCover();
        //调整显示区域
        if (_this.curVideoFocusIndex == 4) {
            CT.$('videoListShowArea').style.top = '-55px';
        } else if (_this.curVideoFocusIndex == 0) {
            CT.$('videoListShowArea').style.top = '0px';
        }
        //控制提示箭头
        if (_this.curhidVideoNum + 5 < _this.getCurNavVideoData().length) {
            CT.$('PageTuringTip').style.visibility = 'visible';
        } else {
            CT.$('PageTuringTip').style.visibility = 'hidden';
        }
    },
	/*
	生成其他元素（右侧视频选中，弹幕，左侧列表上方播放中和下放提示箭头）
	*/
    createOther: function () {
        var _this = this;
        //右侧视频选中框
        var DMEJonelickvideo = document.createElement('div');
        DMEJonelickvideo.id = 'hands_x0_y0_DMEJonelickvideo_';
        DMEJonelickvideo.style.position = 'absolute';
        DMEJonelickvideo.style.left = '27px';
        DMEJonelickvideo.style.top = '90px';
        //焦点图
        var focusImg = new Image();
        focusImg.id = 'DMEJonelickvideo';
        focusImg.src = AjaxConfig.imgUrl + _this.commonPageInfo.recommend_2[0].recommendFocuspic.picPath;
        focusImg.style.visibility = 'hidden';
        DMEJonelickvideo.appendChild(focusImg);
        CT.$('wrapper').appendChild(DMEJonelickvideo);
        //生成焦点
        var btn = {
            id: 'hands_x0_y0_DMEJonelickvideo_',
            clickHandler: 'javascript:page.clickVideo()',
            otherFocusEvent: 'javascript:page.videoFocusgetFocus()',
            //otherBlurEvent:'javascript:page.(' + index + ')',
            left: 'disable',
            rightEvent: 'javascript:page.videoFocusChangeFocus("right")',
            upEvent: 'javascript:page.videoFocusChangeFocus("up")',
            down: 'disable',
            focusType: 7
        }
        buttons.push(btn);

        //播放中图
        var playingImg = new Image();
        playingImg.style.position = 'absolute';
        playingImg.style.left = '970px';
        playingImg.style.top = '50px';
        playingImg.src = AjaxConfig.imgUrl + _this.commonPageInfo.recommend_2[1].recommendFocuspic.picPath;
        CT.$('wrapper').appendChild(playingImg);

        //视频名
        var videoNameDiv = document.createElement('div');
        videoNameDiv.id = 'videoNameDiv';
        videoNameDiv.style.position = 'absolute';
        videoNameDiv.style.left = '995px';
        videoNameDiv.style.top = '50px';
        videoNameDiv.style.width = '220px';
        videoNameDiv.style.height = '22px';
        videoNameDiv.style.lineHeight = '22px';
        //正在播放文字
        var playingDiv = document.createElement('div');
        playingDiv.id = 'playingDiv';
        playingDiv.style.position = 'absolute';
        playingDiv.style.left = '0px';
        playingDiv.style.top = '0px';
        playingDiv.style.width = '90px';
        playingDiv.style.height = '22px';
        playingDiv.innerHTML = '正在播放：';
        videoNameDiv.appendChild(playingDiv);
        //当前片花名
        var videoNameMarquee = document.createElement('marquee');
        videoNameMarquee.id = 'nowVideoNameDiv';
        videoNameMarquee.style.position = 'absolute';
        videoNameMarquee.style.left = '73px';
        videoNameMarquee.style.top = '0px';
        videoNameMarquee.style.width = '130px';
        videoNameMarquee.style.height = '22px';
        videoNameMarquee.innerHTML = '';
        videoNameDiv.appendChild(videoNameMarquee);
        CT.$('wrapper').appendChild(videoNameDiv);

        //弹幕图
        var bulletChatImg = new Image();
        bulletChatImg.style.position = 'absolute';
        bulletChatImg.style.left = '43px';
        bulletChatImg.style.top = '490px';
        bulletChatImg.src = AjaxConfig.imgUrl + _this.commonPageInfo.recommend_2[1].recommendLabelpic.picPath;
        CT.$('wrapper').appendChild(bulletChatImg);

        //视频进度条div
        var barAreaWidth = '42px'
        var videoProcessBarDiv = document.createElement('div');
        videoProcessBarDiv.id = 'videoProcessBarDiv';
        videoProcessBarDiv.style.position = 'absolute';
        videoProcessBarDiv.style.left = '30px';
        videoProcessBarDiv.style.top = '626px';
        videoProcessBarDiv.style.width = '1022px';
        videoProcessBarDiv.style.height = barAreaWidth;
        videoProcessBarDiv.style.backgroundColor = 'rgba(0,0,0,0.55)';
        videoProcessBarDiv.style.color = 'white';
        videoProcessBarDiv.style.lineHeight = barAreaWidth;
        videoProcessBarDiv.style.borderRadius = '0 0 6px 6px';
        videoProcessBarDiv.style.display = 'none';
        //视频当前播放时长
        var videoNowTime = document.createElement('div');
        videoNowTime.id = 'videoNowTime';
        videoNowTime.style.position = 'absolute';
        videoNowTime.style.left = '20px';
        videoNowTime.style.top = '0px';
        videoNowTime.style.width = '100px';
        videoNowTime.style.height = barAreaWidth;
        videoNowTime.innerHTML = '10:10:10';
        videoProcessBarDiv.appendChild(videoNowTime);
        //总进度条
        var fullBar = document.createElement('div');
        fullBar.id = 'fullBar';
        fullBar.style.backgroundColor = 'white';
        fullBar.style.position = 'absolute';
        fullBar.style.left = _this.barStartLeftPos + 'px';
        fullBar.style.top = '21px';
        fullBar.style.width = _this.fullBarLength + 'px';
        fullBar.style.height = '5px';
        fullBar.style.borderRadius = '3px';
        videoProcessBarDiv.appendChild(fullBar);
        //当前进度条
        var nowBar = document.createElement('div');
        nowBar.id = 'nowBar';
        nowBar.style.backgroundColor = 'lightseagreen';
        nowBar.style.position = 'absolute';
        nowBar.style.left = _this.barStartLeftPos + 'px';
        nowBar.style.top = '21px';
        nowBar.style.width = '10px';
        nowBar.style.height = '5px';
        nowBar.style.borderRadius = '3px';
        videoProcessBarDiv.appendChild(nowBar);
        //视频总时长
        var videoTotalTime = document.createElement('div');
        videoTotalTime.id = 'videoTotalTime';
        videoTotalTime.style.position = 'absolute';
        videoTotalTime.style.left = '935px';
        videoTotalTime.style.top = '0px';
        videoTotalTime.style.width = '100px';
        videoTotalTime.style.height = barAreaWidth;
        videoTotalTime.innerHTML = '10:10:10';
        videoProcessBarDiv.appendChild(videoTotalTime);
        //当前进度条播放点
        var videoTimePoint = document.createElement('div');
        videoTimePoint.id = 'videoTimePoint';
        videoTimePoint.style.position = 'absolute';
        videoTimePoint.style.left = _this.barStartLeftPos + 'px';
        videoTimePoint.style.top = '19px';
        videoTimePoint.style.width = '10px';
        videoTimePoint.style.height = '10px';
        videoTimePoint.style.backgroundColor = 'white';
        videoTimePoint.style.borderRadius = '10px';
        videoProcessBarDiv.appendChild(videoTimePoint);
        CT.$('wrapper').appendChild(videoProcessBarDiv);

        //翻页提示按钮图
        var arrowImg = new Image();
        arrowImg.id = 'PageTuringTip';
        arrowImg.style.position = 'absolute';
        arrowImg.style.left = '1130px';
        arrowImg.style.top = '645px';
        arrowImg.src = AjaxConfig.imgUrl + _this.commonPageInfo.recommend_2[1].recommendPic.picPath;
        arrowImg.style.visibility = 'hidden';
        CT.$('wrapper').appendChild(arrowImg);
    },
    /*
        大视频焦点框点击事件
    */
    clickVideo: function () {
        var _this = this;
        interface.findUserForbiddenTime({ params: { userId: xjDataLog.getUserId() }, ajaxConfig: { async: true } }, function(res) {
            _this.canWatch = res.data.canWatch;
            if (_this.canWatch) {
                var curPlayObj = _this.getCurPlayingVideoData();
                var jumpObj = {
                    cartoonId: curPlayObj.data[0].cartoonId,
                    id: curPlayObj.data[0].movieDetails[0].videoId,
                    recommendDisplayType: 2
                }
                //记录页面
                PAGE.otherPageParam = "&contentId=" + (_this.contentId || basePageInfo.commonPageInfo.pageInfo.commonPageId) + "&contentEName=" + (_this.contentEName || basePageInfo.commonPageInfo.pageInfo.commPageEname) + "&contentCName=" +
                    basePageInfo.commonPageInfo.pageInfo.commPageCname + "&contentType=" + CT.requestValue("contentType") + "&curFocusId=" + (jumpObj.curFocusId || curFocus.FocusID) + '&curNavclassIndex=' + _this.curNavclassIndex + '&curVideoPlayingDataIndex=' + _this.curVideoPlayingDataIndex + '&curhidVideoNum=' + _this.curhidVideoNum + '&curVideoFocusIndex=' + _this.curVideoFocusIndex;
                CT.goPage();
                CT.toAnterRecommendUrl(jumpObj);
            } else {
                //在禁播时间段，禁止观看
                // CT.alertTip('小朋友要爱护自己的眼睛，现在是禁止观看时间哦',{time:3000,"z-index":9999})
                if(!_this.createDiv) {
                    //创建div元素
                    _this.createDiv = function(param,contains) {
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
                    }
                }
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
    /*
        大视频焦点框切换焦点事件
    */
    videoFocusChangeFocus: function (keyDirection) {
        var _this = this;
        if (keyDirection == 'right') {
            //视频框向右切换焦点
            PAGE.changeFocus('hands_x0_y0_rightVideoFocus' + _this.curVideoFocusIndex + '_');
        } else if (keyDirection == 'up') {
            //视频框向上切换焦点
            PAGE.changeFocus('hands_x0_y0_DMEJonelick' + _this.curNavclassIndex + '_');
        }
    },
    /*
        大视频焦点框获得焦点事件
    */
    videoFocusgetFocus: function () {
        var _this = this;
        if (curFocus.lastFocusId.indexOf('rightVideoFocus') > -1) {
            //右侧视频列表焦点切换到视频播放框焦点，调整右侧展示状态
            if (_this.curVideoPlayingDataIndex + 1 > _this.curhidVideoNum + 5) {
                //正在播放的视频在显示区域下方
                _this.curhidVideoNum = _this.curVideoPlayingDataIndex + 1 - 5;
                _this.curVideoFocusIndex = 4;
                _this.updateRightBtnsState();
            } else if (_this.curVideoPlayingDataIndex + 1 <= _this.curhidVideoNum) {
                //正在播放的视频在显示区域上方
                if (_this.curVideoPlayingDataIndex > 0) {
                    //正在播放的视频不是第一条数据
                    _this.curVideoFocusIndex = 1;
                    _this.curhidVideoNum = _this.curVideoPlayingDataIndex + 1 - 2;
                } else {
                    //正在播放的视频是第一条数据
                    _this.curVideoFocusIndex = 0;
                    _this.curhidVideoNum = 0;
                }
                _this.updateRightBtnsState();
            } else {
                //正在播放的视频在显示区域
                if (_this.curVideoPlayingDataIndex == _this.curhidVideoNum) {
                    //当前播放视频在第一个焦点
                    if (_this.curhidVideoNum == 0) {
                        //没有隐藏视频
                        _this.curVideoFocusIndex = 0;
                    } else {
                        //有隐藏视频
                        _this.curVideoFocusIndex = 1;
                        _this.curhidVideoNum--;
                    }
                } else {
                    //当前播放视频不在第一个焦点
                    _this.curVideoFocusIndex = _this.curVideoPlayingDataIndex - _this.curhidVideoNum;
                }
                _this.updateRightBtnsState();
            }
        }
    }
}

//页面返回
function backFunc() {
    try{
        CT.backPage();
    }catch(ex) {
        loggerInfo('zzw ======>>>>>backFun_err >>>' + ajax.jsonToString(ex));
    }
}

