/**
 * new Obj()
 * name: collectObj
 * */
var pageParams = {
    curPage: '',
    defaultFocus: ''
};
//CT.writeInfo("获取cookie>>>>>>>>>>>>>>>>>pageParams=" + CT.getCookie('pageParams'))

if (CT.getCookie('pageParams') != undefined && CT.getCookie('pageParams') != null && CT.getCookie('pageParams') != 'undefined' && CT.getCookie('pageParams') != 'null') {
    var obj = CT.stringToJson(decodeURIComponent(CT.getCookie('pageParams')));
    if (typeof obj == 'object') {
        pageParams = CT.stringToJson(decodeURIComponent(CT.getCookie('pageParams')))
    }

    CT.delCookie('pageParams')
    if (CT.getCookie('pageParams') != undefined && CT.getCookie('pageParams') != null && CT.getCookie('pageParams') != 'undefined' && CT.getCookie('pageParams') != 'null') {
        CT.setCookie('pageParams', '')
    }
}

function District(obj) {
    this.defaultFocus = pageParams.defaultFocus || 'hands_x0_y0_DMEJleftceterbutton3_';            //默认焦点
    this.trueDefaultFocus = 'hands_x0_y0_DMEJleftceterbutton3_';            //默认焦点
    this.version = obj.version || 1;                                                      // 版本1 免费角标 版本2 vip角标
    this.rowNum = obj.rowNum || 2;                                                        // 分页行数
    this.step = obj.step || 4;                                                            // 分页步数
    this.intervalD = obj.intervalD || 16;                                                 // 图片间隙下
    this.intervalR = obj.intervalR || 16;                                                 // 图片间隙右
    this.intervalA = obj.intervalA || 10;                                                 // 箭头的上间隙 位置已计算好 用来进行微调
    this.intervalL = obj.intervalL || -36;                                                // 箭头的左间隙 位置已计算好 用来进行微调
    /** ****************************/
    this.boxHeight = obj.boxHeight || 720;                                                // 容器的高 第一个元素的top + 元素的高 * this.rowNum + 图片间隙下 * this.rowNum
    this.boxWidth = obj.boxWidth || 1280;                                                 // 容器的宽
    /** ****************************/
    this.domTop = obj.domTop || this.boxTop || 167;                                       // 第一个元素的top
    this.domLeft = obj.domLeft || this.boxLeft || 50;                                     // 第一个元素的left
    this.domHeight = obj.domHeight || 233;                                                // 元素的高
    this.domWidth = obj.domWidth || 168;                                                  // 元素的宽
    this.domBorderRadius = obj.domBorderRadius || 16;                                     // 元素的圆角值
    this.focusImgDomHeight = obj.focusImgDomHeight || 233;                                // 焦点图片元素的高
    this.focusImgDomWidth = obj.focusImgDomWidth || 168;                                  // 焦点图片元素的宽
    this.focusImgDomLeft = obj.focusImgDomLeft || 0;                                      // 焦点图片left
    this.focusImgDomTop = obj.focusImgDomTop || 0;                                        // 焦点图片top
    /** ****************************/
    this.arrowWidth0 = obj.arrowWidth0 || 72;                                             // 箭头的宽
    this.arrowHeight0 = obj.arrowHeight0 || 39;                                           // 箭头的高
    this.showRightArrow = obj.showRightArrow == false ? false : true                    // 自定义箭头
    this.arrowLeft = obj.arrowLeft || 1225;                                               // 自定义箭头left
    this.arrowTop = obj.arrowTop || 578;                                                  // 自定义箭头top
    this.arrowWidth = obj.arrowWidth || 62;                                               // 自定义箭头宽
    this.arrowHeight = obj.arrowHeight || 89;                                             // 自定义箭头高
    this.showArrow = obj.showArrow == false ? false : true;                             // 是否显示容器中箭头
    this.arrowCount = 0;                                                                  // 箭头动画记数
    this.timer = null;                                                                   // 动画计时器
    /** ****************************/
    this.allDataInfo = null;                                                                   // 收藏记录信息
    this.allData = [];                                                                    // 收藏记录卡通数据
    this.curPage = pageParams.curPage || 0;                                       // 默认当前页数
    this.totalPage = 0;                                                                   // 总页数
    this.showTitle = obj.showTitle == false ? false : true;                             // 是否显示title
    /** *****************************/
    this.emptyImgUrl = './HD/images/empty.png';                                         // 透明图片地址
    this.titleHeight = obj.titleHeight || 36;                                             // title的高
    this.imgUrl = obj.imgUrl ? obj.imgUrl : basePageInfo.localImg + 'collect/contentFocus.png';     // 焦点图片地址
    this.freeImgUrl = obj.freeImgUrl ? obj.freeImgUrl : basePageInfo.localImg + 'collect/freeBadge.png';     // 焦点图片地址
    this.vipImgUrl = obj.imgUrl ? obj.vipImgUrl : basePageInfo.localImg + 'collect/vipBadge.png';     // 焦点图片地址
    this.playImgUrl = obj.playImgUrl,           // 播放按钮图片
        this.delImgUrl = obj.delImgUrl,             // 删除按钮图片
        this.playFocusImgUrl = obj.playFocusImgUrl, // 播放按钮焦点图片
        this.delFocusImgUrl = obj.delFocusImgUrl   // 删除按钮焦点图片
    /** *************路径记录****************/
}
District.prototype = {
    constructor: District,
    // 初始化
    init: function () {
        var _this = this;
        // 生成容器
        _this.generateContainer();
        // 初始化焦点
        PAGE.focusInit();
        // 获取数据
        _this.getData();
    },
    getData: function () {
        var _this = this;
        //我的收藏
        interface.findCollectsByUserId({ params: { userId: collectPage.userId }, ajaxConfig: { async: false } }, function (res) {
            //保存收藏数据
            _this.allDataInfo = res.data;
            _this.allData = res.data.records;
            _this.getLen();
            // 渲染数据
            _this.showData();
            // 默认焦点
            if (!PAGE.getModelByFocusId(_this.defaultFocus).enFocus || !_this.allData.length) {
                _this.defaultFocus = _this.trueDefaultFocus;
            }
            var start = PAGE.getFocusModel6(_this.defaultFocus);
            start.defaultFocus();
        });
    },
    //获取总记录长度
    getLen: function () {
        var _this = this;
        //清空收藏按钮显示状态
        if (_this.allData.length) {
            CT.$('emptyTip').style.visibility = 'hidden';
            CT.$('hands_x0_y0_DMEJcollectrecordempty_').style.visibility = 'visible';
        } else {
            CT.$('emptyTip').style.visibility = 'visible';
            CT.$('hands_x0_y0_DMEJcollectrecordempty_').style.visibility = 'hidden';
        }
        return _this.allData.length;
    },
    //获取总记录分页数
    getTotalPage: function () {
        var _this = this;
        _this.totalPage = Math.ceil(_this.getLen() / _this.step);
        return _this.totalPage;
    },
    generateContainer: function () {
        var _this = this;
        // 设置容器
        var box = '<div id="districtContainer" style="overflow:hidden; height:'
            + this.boxHeight + 'px;width:'
            + this.boxWidth + 'px"></div>'
        CT.$("rightContentWrapper").innerHTML += box;
        // 设置推荐内容位置
        var doms = "";
        var str = "";

        for (var i = 0; i < this.rowNum; i++) {    // 行
            for (var j = 0; j < this.step; j++) {  // 列
                if (this.showTitle) {
                    str = '<div id="recommendTitle' + (this.step * i + j) + '" style="width: ' + this.domWidth + 'px; height: ' + this.titleHeight + 'px; top: ' + (this.domHeight - this.titleHeight) + 'px; border-radius:0 0 ' + this.domBorderRadius + 'px ' + this.domBorderRadius + 'px; left: 0px;" class="recommendTitle"></div>'
                }
                var dom = '<div class="wrapper">' +
                    '<div class="recommend" id="recommend' + (this.step * i + j) + '" style="position: absolute;background: url(' + _this.emptyImgUrl + ') no-repeat;background-size: contain ;top:' +
                    (this.domTop + (this.domHeight + this.intervalD) * i) + 'px;left:' +
                    (this.domLeft + (this.domWidth + this.intervalR) * j) + 'px;height:' +
                    this.domHeight + 'px;width:' +
                    this.domWidth + 'px;border-radius:' +
                    this.domBorderRadius + 'px;">' +
                    str +
                    '<div id="freeBadge' + (this.step * i + j) + '" style="top: 0;left: 0; width: 59px; height: 30px;background: url(' + _this.freeImgUrl + ');visibility: hidden; border-radius:' + this.domBorderRadius + 'px 0 0 0;"></div>' +
                    '<div id="vipBadge' + (this.step * i + j) + '" style="position: absolute;top: 0;right: 0; width: 52px; height: 53px;background: url(' + _this.vipImgUrl + ');visibility: hidden; border-radius:0 ' + this.domBorderRadius + 'px 0 0;"></div>' +
                    '</div>' +
                    '<div id="hands_x0_y0_recommendFocus' + (this.step * i + j) + '_" class = "recommendFocus" style="position:absolute;z-index: 1;top:' +
                    (this.domTop + (this.domHeight + this.intervalD) * i) + 'px;left:' +
                    (this.domLeft + (this.domWidth + this.intervalR) * j) + 'px;height:' +
                    this.domHeight + 'px;width:' +
                    this.domWidth + 'px;">' +
                    '<img src="' + this.imgUrl + '" class="focusImage" id="recommendFocus' + (this.step * i + j) + '" alt="" style="position: absolute;top: ' + _this.focusImgDomTop + 'px;left: ' + _this.focusImgDomLeft + 'px;visibility: hidden; width: ' + _this.focusImgDomWidth + 'px; height: ' + _this.focusImgDomHeight + 'px;">' +
                    '</div>' +
                    '<div id="recordCover' + (this.step * i + j) + '" style="position: absolute;background: url(' + AjaxConfig.projectUrl + "HD/images/recCover.png" + ') no-repeat; border-radius: ' + this.domBorderRadius + 'px; z-index: 1;top:' +
                    (this.domTop + (this.domHeight + this.intervalD) * i) + 'px;left:' +
                    (this.domLeft + (this.domWidth + this.intervalR) * j) + 'px;height:' +
                    this.domHeight + 'px;width:' +
                    this.domWidth + 'px;visibility: hidden;overflow: hidden;">' +
                    '<div id="hands_x0_y0_play' + (this.step * i + j) + '_" style="position: absolute; top: 68px; left: 37px; width: 94px; height: 34px; background: url(' + this.playImgUrl + ') no-repeat; border-radius: 8px;">' +
                    '<img id="play' + (this.step * i + j) + '" src="' + this.playFocusImgUrl + '" style="position: absolute; top: 0px; left: 0px;border-radius: 8px;visibility: hidden;">' +
                    '</div>' +
                    '<div id="hands_x0_y0_del' + (this.step * i + j) + '_" style="position: absolute; top: 115px; left: 37px; width: 94px; height: 34px; background: url(' + this.delImgUrl + ') no-repeat; border-radius: 8px;">' +
                    '<img id="del' + (this.step * i + j) + '" src="' + this.delFocusImgUrl + '" style="position: absolute; top: 0px; left: 0px; border-radius: 8px;visibility: hidden;">' +
                    '</div>' +
                    '</div>' +

                    '</div>' +
                    '</div>'
                doms += dom

                // 生成推荐位焦点
                var btn = {
                    id: "hands_x0_y0_recommendFocus" + (this.step * i + j) + "_",
                    //是否开启自动查询下一焦点功能
                    //enMove : false,
                    up: "hands_x0_y0_recommendFocus" + (this.step * (i - 1) + j) + "_",
                    down: "hands_x0_y0_recommendFocus" + (this.step * (i + 1) + j) + "_",
                    clickHandler: 'javascript:collectObj.changeBtnToPlay(' + (this.step * i + j) + ')',
                    otherFocusEvent: 'javascript:collectObj.runText(' + (this.step * i + j) + ')',
                    otherBlurEvent: 'javascript:collectObj.stopText(' + (this.step * i + j) + ')',
                    //right:"hands_x0_y0_recommendFocus" + (this.step * i + j + 1) + "_",
                    //rightEvent:'javascript:navPage.midToRight(' + (this.step * i + j) + ')',
                    //upEvent:'javascript:navPage.midToPrePage(' + (this.step * i + j) + ')',
                    //downEvent:'javascript:navPage.midToNextPage(' + (this.step * i + j) + ')',
                    focusType: 7
                };
                // 生成播放和删除焦点
                var playBtn = {
                    id: "hands_x0_y0_play" + (this.step * i + j) + "_",
                    //是否开启自动查询下一焦点功能
                    //enMove : false,
                    down: "hands_x0_y0_del" + (this.step * i + j) + "_",
                    up: "hands_x0_y0_recommendFocus" + (this.step * (i - 1) + j) + "_",
                    left: "hands_x0_y0_recommendFocus" + (this.step * i + j - 1) + "_",
                    right: "hands_x0_y0_recommendFocus" + (this.step * i + j + 1) + "_",
                    clickHandler: 'javascript:collectObj.toContentDetailUrl(' + (this.step * i + j) + ')',
                    otherFocusEvent: 'javascript:collectObj.showSelect(' + (this.step * i + j) + ')',
                    otherBlurEvent: 'javascript:collectObj.hidSelect(' + (this.step * i + j) + ')',
                    focusType: 7
                };
                var delBtn = {
                    id: "hands_x0_y0_del" + (this.step * i + j) + "_",
                    //是否开启自动查询下一焦点功能
                    //enMove : false,
                    up: "hands_x0_y0_play" + (this.step * i + j) + "_",
                    down: "hands_x0_y0_recommendFocus" + (this.step * (i + 1) + j) + "_",
                    left: "hands_x0_y0_recommendFocus" + (this.step * i + j - 1) + "_",
                    right: "hands_x0_y0_recommendFocus" + (this.step * i + j + 1) + "_",
                    clickHandler: 'javascript:collectObj.delCollect(' + (this.step * i + j) + ')',
                    otherFocusEvent: 'javascript:collectObj.showSelect(' + (this.step * i + j) + ')',
                    otherBlurEvent: 'javascript:collectObj.hidSelect(' + (this.step * i + j) + ')',
                    focusType: 7
                };
                if (i == 0) {
                    btn.upEvent = 'javascript:collectObj.upPage()';
                    playBtn.upEvent = 'javascript:collectObj.upPage(' + (this.step * i + j) + ')';
                }
                if (i == this.rowNum - 1) {
                    btn.downEvent = 'javascript:collectObj.downPage(' + (this.step * i + j) + ')';
                    delBtn.downEvent = 'javascript:collectObj.downPage(' + (this.step * i + j) + ')';
                }
                if ((this.step * i + j) % this.step == 0) {
                    btn.left = this.defaultFocus;
                }
                if (j == 0) {
                    //每行第一个
                    btn.left = _this.trueDefaultFocus;
                    playBtn.left = _this.trueDefaultFocus;
                    delBtn.left = _this.trueDefaultFocus;
                } else if (j == this.step - 1) {
                    //每行最后一个
                    playBtn.right = 'disable';
                    delBtn.right = 'disable';
                    btn.right = 'disable';
                }
                buttons.push(btn);
                buttons.push(playBtn);
                buttons.push(delBtn);
            }
        }
        CT.$('districtContainer').innerHTML = doms;
        // 生成箭头
        if (this.showArrow) {
            var arrow = '<div id="down" class="arrow" style="position: absolute;z-index: 2;visibility: hidden;background:url(../image/collect/down.png) no-repeat;top:' +
                (this.domTop + (this.domHeight + this.intervalD) * 2 + this.intervalA) + 'px; left:' +
                (this.domLeft + (this.step * this.domWidth + (this.step - 1) * this.intervalR) / 2 + this.intervalL) + 'px;width:' +
                this.arrowWidth0 + 'px; height:' +
                this.arrowHeight0 + 'px;">' +
                '</div>';
            CT.$('districtContainer').innerHTML += arrow
        } else if (this.showRightArrow) {
            var arrow = '<div id="down" class="arrow" style="background: url(' + basePageInfo.localImg + 'collect/arrowDown0.png)no-repeat;position: absolute;z-index: 2;visibility: hidden; top:' + this.arrowTop + 'px; left:' + this.arrowLeft + 'px;width: ' + this.arrowWidth + 'px; height: ' + this.arrowHeight + 'px;">' +

                '</div>';

            CT.$('districtContainer').innerHTML += arrow
            this.arrowChange()
        }
        //加入清空收藏按钮
        buttons.push({
            id: "hands_x0_y0_DMEJcollectrecordempty_",
            //是否开启自动查询下一焦点功能
            //enMove : false,
            clickHandler: 'javascript:collectObj.delAllCollect()',
            left: this.defaultFocus,
            right: 'disable',
            up: 'disable',
            downEvent: 'javascript:collectObj.delAllBtnDown()',
            focusType: 7
        })

    },
    //删除收藏
    delCollect: function (index) {
        var _this = this;
        //单个删除收藏
        interface.deleteUserCollect({
            userId: collectPage.userId,
            contentType: curFocus.TempData.collectType,
            contentId: curFocus.TempData.collectValue
        }, function (res) {
            if (res.successFlg == 1) {
                var curDataIndex = _this.curPage * _this.step + index;
                _this.allData.splice(curDataIndex, 1);

                //判断数据是否为空
                if (_this.getLen() > 0) {
                    //数据不为空
                    //判断当前焦点是否超出数据长度
                    if (curDataIndex > _this.getLen() - 1) {
                        //超出数据长度
                        var tempIndex = index - 1;
                        //判断是否是
                        if (tempIndex == 0) {
                            tempIndex = 0;
                        }
                        //未超出数据长度
                        PAGE.changeFocus('hands_x0_y0_recommendFocus' + tempIndex + '_');
                    } else {
                        //未超出数据长度
                        PAGE.changeFocus('hands_x0_y0_recommendFocus' + index + '_');
                    }
                } else {
                    //数据为空
                    //切换焦点
                    PAGE.changeFocus(_this.trueDefaultFocus);
                }
                //更新显示状态
                _this.showData();
            } else {
                CT.alertTip('删除失败！');
            }
        });
    },
    //清空收藏
    delAllCollect: function () {
        var _this = this;
        if (!_this.getLen()) {
            return;
        }
        //单个删除收藏
        interface.deleteBatchUserCollect({
            userId: collectPage.userId,
            contentType: _this.allData[0].collectType
        }, function (res) {
            if (res.successFlg == 1) {
                //清空本地数据
                _this.allData.splice(0, _this.getLen());
                //判断数据是否为空
                if (_this.getLen() > 0) {
                    //数据不为空，不可能，除非接口出错
                } else {
                    //数据为空
                    //切换焦点
                    PAGE.changeFocus(_this.trueDefaultFocus);
                }
                //更新显示状态
                _this.showData();
            } else {
                CT.alertTip('删除失败！');
            }
        });
    },
    //清空收藏按钮向下事件
    delAllBtnDown: function () {
        var maxBtnIndex = this.getLen() > this.step - 1 ? this.step - 1 : this.getLen();
        if (curFocus && curFocus.lastFocusId) {
            PAGE.changeFocus(curFocus.lastFocusId);
        } else if (maxBtnIndex) {
            PAGE.changeFocus('hands_x0_y0_recommendFocus' + maxBtnIndex + '_');
        }
    },
    arrowChange: function () {
        var _this = this;
        clearTimeout(_this.timer)
        _this.timer = null
        _this.timer = setTimeout(function () {
            CT.$('down').style.background = 'url("' + basePageInfo.localImg + 'collect/arrowDown' + _this.arrowCount + '.png")no-repeat';
            _this.arrowCount++;
            if (_this.arrowCount >= 2) {
                _this.arrowCount = 0;
            }
            _this.arrowChange()
        }, 300);
    },
    showData: function () {
        var _this = this;

        // 显示箭头
        if (_this.showArrow || _this.showRightArrow) {
            if (this.getTotalPage() > this.curPage + 2) {
                CT.$('down').style.visibility = 'visible'
            } else {
                CT.$('down').style.visibility = 'hidden'
            }
        }

        // 清除页面数据
        _this.clearData();
        // 获取本页数据
        var curData = _this.curData();

        // 显示页面数据
        for (var i = 0; i < curData.length; i++) {
            // 设置按钮数据
            var tempNum = _this.curPage * _this.step + i;
            curData[i].recommendTrackName = "DMEJcollectrecord" + tempNum;
            _this.setBtnTempData('hands_x0_y0_recommendFocus' + i + '_', curData[i]);
            curData[i].recommendTrackName = "DMEJcollectrecordplay" + tempNum;
            _this.setBtnTempData('hands_x0_y0_play' + i + '_', curData[i]);
            curData[i].recommendTrackName = "DMEJcollectrecorddelect" + tempNum;
            _this.setBtnTempData('hands_x0_y0_del' + i + '_', curData[i])

            var recommend = CT.$('recommend' + i);             // 推荐位
            if (this.showTitle) {
                var recommendTitle = CT.$('recommendTitle' + i);   // 跑马灯
                if (!CT.hasClass(recommendTitle, 'recommendTitle')) {
                    CT.addClass(recommendTitle, 'recommendTitle');
                }
            }

            var freeBadge = CT.$('freeBadge' + i);             // 免费角标
            var vipBadge = CT.$('vipBadge' + i);              // VIP角标

            var recommendImg = "";                             // 推荐位图片
            var recomendText = "";                             // 标题
            var booleanFree = "";                              // 是否免费

            try {
                recommendImg = AjaxConfig.defaultCoverImg;
                if (curData[i] && curData[i].mediaPic) {
                    recommendImg = AjaxConfig.imgUrl + curData[i].mediaPic;
                }
                recomendText = curData[i].mediaName;
                booleanFree = curData[i].booleanFree;
            } catch (e) {
                recommendImg = AjaxConfig.defaultCoverImg;
            }

            recommend.style.background = "url(" + recommendImg + ") no-repeat";
            recommend.style.backgroundSize = "contain";
            if (this.showTitle) {
                recommendTitle.innerHTML = recomendText;
            }
            if (booleanFree == 0 && this.version == 1) {
                //freeBadge.style.visibility = "visible";
            } else if (booleanFree == 1 && this.version == 2) {
                //vipBadge.style.visibility = "visible";
            }
        }
    },
    clearData: function () {
        var _this = this;
        for (var i = 0; i < this.rowNum * this.step; i++) {
            var recommend = CT.$('recommend' + i);               // 推荐位
            if (this.showTitle) {
                var recommendTitle = CT.$('recommendTitle' + i);   // 跑马灯
            };
            var freeBadge = CT.$('freeBadge' + i);               // 免费角标
            var vipBadge = CT.$('vipBadge' + i);               // 免费角标

            recommend.style.background = "url(" + _this.emptyImgUrl + ")";
            if (this.showTitle) {
                recommendTitle.innerHTML = "";
                if (CT.hasClass(recommendTitle, 'recommendTitle')) {
                    CT.removeClass(recommendTitle, 'recommendTitle');
                }
            }
            freeBadge.style.visibility = "hidden";
            vipBadge.style.visibility = "hidden";

            var btnObj = PAGE.getFocusModel6("hands_x0_y0_recommendFocus" + i + "_");
            if (btnObj) {
                btnObj.enFocus = false;
                btnObj.TempData = "";
            }

        }
    },
    setBtnTempData: function (key, val) {
        var _this = this;
        var btnObj = PAGE.getFocusModel6(key);
        if (btnObj) {
            btnObj.enFocus = true;
            btnObj.TempData = val;
        }
    },
    curData: function () {
        var _this = this;
        var curData = "";
        var startIndex = _this.step * _this.curPage;
        var endIndex = startIndex + _this.step * this.rowNum;
        if (_this.allData.length >= endIndex) {
            curData = _this.allData.slice(startIndex, endIndex);
        } else {
            curData = _this.allData.slice(startIndex, _this.allData.length);
        }
        return curData;
    },
    /*
        推荐位焦点点击确定
    */
    changeBtnToPlay: function (index) {
        var _this = this;
        PAGE.changeFocus('hands_x0_y0_play' + index + '_');
    },
    /*
        显示操作收藏内容蒙版
    */
    showSelect: function (index) {
        var _this = this;
        CT.$('recordCover' + index).style.visibility = 'visible';
    },
    /*
        隐藏操作收藏内容蒙版
    */
    hidSelect: function (index) {
        var _this = this;
        CT.$('recordCover' + index).style.visibility = 'hidden';
    },
    //去收藏的内容详情页
    toContentDetailUrl: function (index) {
        var _this = this;
        var obj = curFocus.TempData;
        //先记录跳转离开之前的页面参数(分类导航页用例)
        var curFocusIdLast = 'hands_x0_y0_recommendFocus' + index + '_';
        var pageParams = {
            curPage: _this.curPage,
            defaultFocus: curFocusIdLast
        }
        pageParams = CT.jsonToString(pageParams)
        CT.setCookie('pageParams', encodeURIComponent(pageParams))
        PAGE.otherPageParam = "&curFocusId=" + curFocusIdLast + "&contentId=" + basePageInfo.findTemplateInfo.pageId + "&parentId=" + CT.requestValue("parentId") + "&contentIdName=" + CT.requestValue("contentIdName") + "&contentEName=" + basePageInfo.findTemplateInfo.commPageEname + "&contentCName=" + basePageInfo.findTemplateInfo.commPageCname + "&contentType=" + CT.requestValue("contentType");
        CT.goPage();
        obj.recommendDisplayType = obj.collectType;
        obj.recommendDisplayValue = obj.collectValue;
        CT.toAnterRecommendUrl(obj);
    },
    upPage: function (index) {
        if (this.curPage == 0) {
            if (this.getLen()) {
                PAGE.changeFocus('hands_x0_y0_DMEJcollectrecordempty_');
            }
            return;
        }
        if (index || index == 0) {
            PAGE.changeFocus('hands_x0_y0_recommendFocus' + index + '_');
        }
        this.curPage--;
        this.showData();
    },
    downPage: function () {
        if (this.curPage >= (this.getTotalPage() - 2)) {
            return;
        }
        this.curPage++;

        // 最后一页焦点定位
        if (this.curPage == (this.getTotalPage() - 2)) {
            if (this.getLen() % this.step != 0) {
                var nextFocus = "hands_x0_y0_recommendFocus" + (this.getLen() % this.step + this.step - 1) + "_";
                var start = PAGE.getFocusModel6(nextFocus);
                start.defaultFocus();
            }
        }
        this.showData()
    },
    //添加跑马灯
    runText: function (index) {
        if (this.showTitle) {
            var showTitle = " " + curFocus.TempData.mediaName;
            CT.$("recommendTitle" + index).innerHTML = CT.setMarquee(showTitle, 14, 4);
        }

    },
    //去除跑马灯
    stopText: function (index) {
        if (this.showTitle) {
            CT.$("recommendTitle" + index).innerHTML = String(curFocus.TempData.mediaName).substring(0, 8);
        }

    }
};

function backFunc() {
    CT.backPage();
}