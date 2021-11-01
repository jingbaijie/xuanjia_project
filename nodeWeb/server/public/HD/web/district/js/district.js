/**
 * new Obj()
 * name: districtObj
 * */
var baseUrl = basePageInfo.basePageUrl;

var pageParams = {
    curPage: '',
    curFocusId: '',
    curClassifyId: 0
};
// CT.writeInfo("获取cookie>>>>>>>>>>>>>>>>>pageParams=" + CT.getCookie('pageParams'))

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

var buttons = [];
function District(obj) {
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
    this.arrowTop = obj.arrowTop || 628;                                                  // 自定义箭头top
    this.arrowWidth = obj.arrowWidth || 62;                                               // 自定义箭头宽
    this.arrowHeight = obj.arrowHeight || 89;                                             // 自定义箭头高
    this.showArrow = obj.showArrow == false ? false : true;                             // 是否显示容器中箭头
    this.arrowCount = 0;                                                                  // 箭头动画记数
    this.timer = null;                                                                   // 动画计时器
    /** ****************************/
    this.allData = [];                                                                    // 所有的展示数据
    this.allDataArr = {};                                                                 // 所有分类数据
    this.curPage = pageParams.curPage || 0;                                       // 默认当前页数
    this.totalPage = 0;                                                                   // 总页数
    this.showTitle = obj.showTitle == false ? false : true;                             // 是否显示title
    /** *****************************/
    this.titleHeight = obj.titleHeight || 36;                                             // title的高
    this.imgUrl = obj.imgUrl ? AjaxConfig.imgUrl + obj.imgUrl : baseUrl + '/imgs/focus2.png';     // 焦点图片地址
    this.freeImgUrl = obj.freeImgUrl ? AjaxConfig.imgUrl + obj.freeImgUrl : baseUrl + '/imgs/freeBadge.png';     // 焦点图片地址
    this.vipImgUrl = obj.imgUrl ? AjaxConfig.imgUrl + obj.vipImgUrl : baseUrl + '/imgs/vipBadge.png';     // 焦点图片地址
    this.classifyNum = obj.classifyNum || 1;                                              // 分类数目
    this.classifyFocus = "hands_x0_y0_classifyFocus0_";                                   // 分类焦点
    this.curClassifyId = pageParams.curClassifyId || 0;                                // 默认分类                                                             // 当前分类
    /** *************路径记录****************/
    this.curFocusId = pageParams.curFocusId || 'hands_x0_y0_recommendFocus0_'     // 默认焦点
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
        _this.getData(_this.curClassifyId);
        // 默认焦点
        var start = PAGE.getFocusModel6(_this.curFocusId);
        start.defaultFocus();
    },
    getData: function (i) {
        var _this = this;
        _this.curClassifyId = i;
        if (districtPage.recommend_1.length > 1 && districtPage.recommend_1[i]) {
            for (var j = 0; j < districtPage.recommend_1.length; j++) {
                CT.$('classifyImg' + j).src = AjaxConfig.imgUrl + districtPage.recommend_1[j].recommendPic.picPath;
            }
            CT.$('classifyImg' + i).src = AjaxConfig.imgUrl + districtPage.recommend_1[i].recommendFocuspic.picPath;
        }
        _this.classifyFocus = 'hands_x0_y0_classifyFocus' + i + '_';
        // 已缓存分类数据
        if (_this.allDataArr['rec' + i]) {
            _this.allData = _this.allDataArr['rec' + i];
            _this.len = _this.allData.length;
            _this.totalPage = Math.ceil(_this.len / _this.step);
            _this.showData();
        } else {

            var typeId = districtPage.recommend_1[i].recommendDisplayValue;

            interface.findContentsByTypeId({ "typeId": typeId }, function (res) {

                _this.allDataArr['rec' + i] = res.data;
                _this.allData = res.data;
                _this.len = _this.allData.length;
                _this.totalPage = Math.ceil(_this.len / _this.step);
                // 渲染数据
                _this.showData();
            });
        }

    },
    generateContainer: function () {
        var _this = this;
        // 设置容器
        var box = '<div id="districtContainer" style="overflow:hidden; height:'
            + this.boxHeight + 'px;width:'
            + this.boxWidth + 'px"></div>'
        document.getElementsByTagName("body")[0].innerHTML += box;
        // 设置推荐内容位置
        var doms = "";
        var str = "";

        for (var i = 0; i < this.rowNum; i++) {    // 行
            for (var j = 0; j < this.step; j++) {  // 列
                if (this.showTitle) {
                    str = '<div id="recommendTitle' + (this.step * i + j) + '" style="width: ' + this.domWidth + 'px; height: ' + this.titleHeight + 'px; top: ' + (this.domHeight - this.titleHeight) + 'px; border-radius:0 0 ' + this.domBorderRadius + 'px ' + this.domBorderRadius + 'px; left: 0px;" class="recommendTitle"></div>'
                }
                var dom = '<div class="wrapper">' +
                    '<div class="recommend" id="recommend' + (this.step * i + j) + '" style="position: absolute;background: url(' + baseUrl + '/imgs/empty.png) no-repeat;background-size: contain ;top:' +
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
                    '</div>'
                doms += dom

                // 生成焦点
                var btn = {
                    id: "hands_x0_y0_recommendFocus" + (this.step * i + j) + "_",
                    //是否开启自动查询下一焦点功能
                    //enMove : false,
                    clickHandler: 'javascript:districtObj.toContentDetailUrl(' + (this.step * i + j) + ')',
                    otherFocusEvent: 'javascript:districtObj.runText(' + (this.step * i + j) + ')',
                    otherBlurEvent: 'javascript:districtObj.stopText(' + (this.step * i + j) + ')',
                    //right:"hands_x0_y0_recommendFocus" + (this.step * i + j + 1) + "_",
                    //rightEvent:'javascript:navPage.midToRight(' + (this.step * i + j) + ')',
                    //upEvent:'javascript:navPage.midToPrePage(' + (this.step * i + j) + ')',
                    //downEvent:'javascript:navPage.midToNextPage(' + (this.step * i + j) + ')',
                    focusType: 7
                };
                if (i == 0) {
                    btn.upEvent = 'javascript:districtObj.upPage()';
                }
                if (i == this.rowNum - 1) {
                    btn.downEvent = 'javascript:districtObj.downPage(' + (this.step * i + j) + ')';
                }
                buttons.push(btn)
            }
        }
        CT.$('districtContainer').innerHTML = doms
        // 生成箭头
        if (this.showArrow) {
            var arrow = '<div id="down" class="arrow" style="position: absolute;z-index: 2;visibility: hidden;background:url(' + baseUrl + '/imgs/down.png) no-repeat;top:' +
                (this.domTop + (this.domHeight + this.intervalD) * 2 + this.intervalA) + 'px; left:' +
                (this.domLeft + (this.step * this.domWidth + (this.step - 1) * this.intervalR) / 2 + this.intervalL) + 'px;width:' +
                this.arrowWidth0 + 'px; height:' +
                this.arrowHeight0 + 'px;">' +
                '</div>';
            CT.$('districtContainer').innerHTML += arrow
        } else if (this.showRightArrow) {
            var arrow = '<div id="down" class="arrow" style="background: url(' + baseUrl + '/imgs/arrowDown0.png)no-repeat;position: absolute;z-index: 2;visibility: hidden; top:' + this.arrowTop + 'px; left:' + this.arrowLeft + 'px;width: ' + this.arrowWidth + 'px; height: ' + this.arrowHeight + 'px;">' +
                /*'<img id="down" src="../imgs/arrowDown0.png"/>' +*/
                '</div>';

            CT.$('districtContainer').innerHTML += arrow
            this.arrowChange()
        }

    },
    arrowChange: function () {
        var _this = this;
        clearTimeout(_this.timer)
        _this.timer = null
        _this.timer = setTimeout(function () {
            CT.$('down').style.background = 'url("' + baseUrl + '/imgs/arrowDown' + _this.arrowCount + '.png")no-repeat';
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
            if (this.totalPage > this.curPage + 2) {
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
            _this.setBtnTempData('hands_x0_y0_recommendFocus' + i + '_', curData[i])

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
                recommendImg = AjaxConfig.imgUrl + curData[i].iconPic.picPath;
                recomendText = curData[i].contentCname;
                booleanFree = curData[i].booleanFree;
            } catch (e) {
                recommendImg = baseUrl + "/imgs/empty.png";
            }

            recommend.style.background = "url(" + recommendImg + ") no-repeat";
            recommend.style.backgroundSize = "contain";
            if (this.showTitle) {
                recommendTitle.innerHTML = recomendText;
            }
            if (booleanFree == 0 && this.version == 1) {
                freeBadge.style.visibility = "visible";
            } else if (booleanFree == 1 && this.version == 2) {
                vipBadge.style.visibility = "visible";
            }
        }
    },
    clearData: function () {
        for (var i = 0; i < this.rowNum * this.step; i++) {
            var recommend = CT.$('recommend' + i);               // 推荐位
            if (this.showTitle) {
                var recommendTitle = CT.$('recommendTitle' + i);   // 跑马灯
            };
            var freeBadge = CT.$('freeBadge' + i);               // 免费角标
            var vipBadge = CT.$('vipBadge' + i);               // 免费角标

            recommend.style.background = "url(" + baseUrl + "/imgs/empty.png)";
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
    toContentDetailUrl: function (index) {
        var _this = this;
        var obj = curFocus.TempData;
        //先记录跳转离开之前的页面参数(分类导航页用例)
        var pageParams = {
            curPage: _this.curPage,
            curFocusId: curFocus.FocusID,
            curClassifyId: _this.curClassifyId
        }
        pageParams = CT.jsonToString(pageParams)
        CT.setCookie('pageParams', encodeURIComponent(pageParams))
        //PAGE.otherPageParam = "&curFocusId="+curFocus.FocusID + "&contentId=" + basePageInfo.commonPageInfo.pageInfo.commonPageId + "&parentId=" + CT.requestValue("parentId") + "&contentIdName=" + CT.requestValue("contentIdName") + "&startBtnIndex=" + navPage.startBtnIndex + "&curLabelBtnIndex=" + navPage.curLabelBtnIndex + "&curClassContentPageIndex=" + navPage.curClassContentPageIndex+"&contentEName="+basePageInfo.commonPageInfo.pageInfo.commPageEname+"&contentCName="+basePageInfo.commonPageInfo.pageInfo.commPageCname + "&contentType=" + CT.requestValue("contentType");
        PAGE.otherPageParam = "&curFocusId=" + curFocus.FocusID + "&contentId=" + basePageInfo.commonPageInfo.pageInfo.commonPageId + "&parentId=" + CT.requestValue("parentId") + "&contentIdName=" + CT.requestValue("contentIdName") + "&contentEName=" + basePageInfo.commonPageInfo.pageInfo.commPageEname + "&contentCName=" + basePageInfo.commonPageInfo.pageInfo.commPageCname + "&contentType=" + CT.requestValue("contentType");
        CT.goPage();
        obj.recommendDisplayType = obj.contentType;
        obj.recommendDisplayValue = obj.contentId;
        CT.toAnterRecommendUrl(obj);
    },
    upPage: function () {
        if (this.curPage == 0) {
            // 如果有分类
            if (this.classifyNum > 1) {
                var start = PAGE.getFocusModel6(this.classifyFocus);
                start.defaultFocus();
            }
            return;
        }
        this.curPage--;
        this.showData();
    },
    downPage: function () {
        if (this.curPage >= (this.totalPage - 2)) {
            return;
        }
        this.curPage++;

        // 最后一页焦点定位
        if (this.curPage == (this.totalPage - 2)) {
            if (this.len % this.step != 0) {
                var nextFocus = "hands_x0_y0_recommendFocus" + (this.len % this.step + this.step - 1) + "_";
                var start = PAGE.getFocusModel6(nextFocus);
                start.defaultFocus();
            }
        }
        this.showData()
    },
    //添加跑马灯
    runText: function (index) {
        if (this.showTitle) {
            var showTitle = " " + curFocus.TempData.contentCname;
            CT.$("recommendTitle" + index).innerHTML = CT.setMarquee(showTitle, 14, 4);
        }

    },
    //去除跑马灯
    stopText: function (index) {
        if (this.showTitle) {
            CT.$("recommendTitle" + index).innerHTML = String(curFocus.TempData.contentCname).substring(0, 8);
        }

    }
};

function backFunc() {
    CT.backPage();
}