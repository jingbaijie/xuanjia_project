
var commonPageInfo = basePageInfo.commonPageInfo;
var historyObj = {
    //用户id
    userId: xjDataLog.getUserId(),
    //页面id
    contentId: 81,
    //个人中心分类数据
    outJson: [
        [],
        []
    ],
    //当前页面图片信息
    recommendPageImg: commonPageInfo.recommend_1,
    // 是否使用大数据推荐数据
    bigDataSwitch: true,
    // 大家都在看数据，大数据来源
    recommendBottom_bigData: [],
    // 大家都在看数据，手工配置来源
    recommendBottom_manualConfig: commonPageInfo.recommend_3 || [],
    // 大家都在看数据，实际使用
    recommendBottom: commonPageInfo.recommend_3 || [],
    //初始化焦点
    initFocus: CT.requestValue("curFocusId") || 'hands_x0_y0_DMEJleftceterbutton2_', //CT.requestValue("curFocusId")
    //最近第一天历史记录 第一个推荐位数据下标
    curPageDataIndex0: Number(CT.requestValue("curPageDataIndex0")) || 0,
    //最近第二天历史记录 第一个推荐位数据下标
    curPageDataIndex1: Number(CT.requestValue("curPageDataIndex1")) || 0,
    //大家都在看 第一个推荐位数据下标
    curPageDataIndex2: Number(CT.requestValue("curPageDataIndex2")) || 0,
    //当前所属分类序号
    curPageDataIndex: Number(CT.requestValue("curPageDataIndex")) || 2,
    /**
     * 
     * 显示历史数据
     */
    init: function () {
        //获取当前页面记录数据
        this.getHistoryData();
    },
    getHistoryData: function () {
        var _this = this;
        //历史记录
        interface.findHistoryList({ params: { userId: _this.userId }, ajaxConfig: { async: false } }, function (data) {
            //显示当前所属分类
            CT.$('leftNavBtnLabel2').style.visibility = 'visible';
            //整理历史记录数据到 historyObj.outJson
            // _this.formateData(data.data.records, "createDay");
            _this.formateData(data.data.records || [], "createDay");
            //显示时间轴
            CT.$('timeBar').style.visibility = 'visible';
            //创建右侧观看记录dom
            _this.createRightHistoryDom();
            if (_this.bigDataSwitch) {
                // 获取大数据推荐
                // 拼接运营指定条数的人工配置数据，则大数据少请求几条
                var recommendNum = 4;
                // if (_this.recommendBottom_manualConfig && _this.recommendBottom_manualConfig[0]) {
                //     var more1Obj = CT.getMoresObj(_this.recommendBottom_manualConfig[0].more1);
                //     var configNum = more1Obj.configNum || 0;
                //     recommendNum -= configNum;
                // }
                var data = {
                    params: {
                        // 必选：片单ID
                        userId: xjDataLog.getUserId(),
                        // 可选：推荐条数，默认10条
                        recommendNum: recommendNum,
                        // 可选：排序类型：0：升序，1：降序，2：随机，默认为1
                        sortType: 1
                    }
                }
                interface.getBigDataRecCartoon_byUserId(data, function (result) {
                    if (result && result.successFlg == 1 && result.data) {
                        _this.recommendBottom_bigData = result.data;
                        var maxNum = _this.recommendBottom_manualConfig.length;
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
                                recIndex: _this.recommendBottom_manualConfig.length + index + 1,
                                // 选传：目标模板数据
                                targetObj: CT.stringToJson(CT.jsonToString(_this.recommendBottom_manualConfig[index])),
                                // 选传：设定转换类型不能满足的定制化情景，需转换键名对，如：{"a" : "b"}代表被转换对象的b属性的值，赋值到模板对象的a属性上去。
                                transDiffKeys: {
                                    "recommendDisplayValue": "id"
                                },
                                // 选传：设定转换类型不能满足的定制化情景，需写死某属性值，需写死某属性值。如：{"a" : b}代表值b，赋值到模板对象的a属性上去。
                                transSpecialKeys: {}
                            }
                            var tempObj = CT.transObjDataToRec(transInfo);
                            // 转换后的数据推入大数据数组
                            tempObj && tempArr.push(tempObj);
                        }
                        _this.recommendBottom = tempArr.length > 0 ? tempArr : _this.recommendBottom_manualConfig;
                        // 拼接运营指定条数的人工配置数据在头部
                        var configArr = _this.recommendBottom_manualConfig.slice(0, _this.recommendBottom_manualConfig.length);
                        _this.recommendBottom = configArr.concat(tempArr);
                        _this.lastinit();
                    } else {
                        _this.lastinit();
                    }
                });
            } else {
                _this.lastinit();
            }
        });
    },
    lastinit: function () {
        var _this = this;
        //创建大家都在看
        _this.trueCreatHisDom(2);
        //页面初始化焦点hands_x0_y0_DMEJleftceterbutton2_
        PAGE.focusInit();
        //更新页面数据展示状态
        if (_this.initFocus.indexOf('recordBtn')) {
            var memoryClassIndex = Number(_this.initFocus.substring(12, 13));
            var memoryClassFocusIndex = Number(_this.initFocus.substring(22, 23));
            for (var i = 0; i < 3; i++) {
                if (i == memoryClassIndex) {
                    _this.updateShowRec(i, memoryClassFocusIndex);
                } else {
                    _this.updateShowRec(i, 0);
                }
            }
        }
        try {
            if (curFocus.FocusID != _this.initFocus && PAGE.getModelByFocusId(_this.initFocus)) {
                //重置当前焦点对象
                curFocus = PAGE.getModelByFocusId(_this.initFocus);
            }
        } catch (error) {

        }
        var defaultFocus = _this.initFocus;
        var start = PAGE.getFocusModel6(defaultFocus);
        if (!start) {
            start = PAGE.getFocusModel6("hands_x0_y0_DMEJleftceterbutton2_");
        }
        start.defaultFocus();
    },
    /**
    参数:
        data:传入需要归类的数组
        name:需要归类的对象属性名
    */
    formateData: function (data, name) {
        var _this = this;
        var result = {};
        //遍历数组数据
        data.forEach(function (_item) {
            //获取当前对象键名数组
            //var keysArr = Object.keys(_item);
            var keysArr = [];
            for (var key in _item) {
                if (_item.hasOwnProperty(key)) {
                    keysArr.push(key);
                }
            }
            //用以深复制当前对象
            var tmp = {};
            var _prevKey = null;
            keysArr.forEach(function (el) {
                !result[_item[name]] && (result[_item[name]] = [])
                tmp[el] = _item[el];
                _prevKey = _item[name];
            })
            if (_prevKey && tmp.mediaName && tmp.mediaName.indexOf('短视频') == -1){
                result[_prevKey].push(tmp);
            }
        })
        var keysArr1 = [];
        for (var key in result) {
            if (result.hasOwnProperty(key)) {
                keysArr1.push(key);
            }
        }
        keysArr1.forEach(function (val, index) {
            _this.outJson[index] = result[val];
        });
    },
    /**
        创建观看记录dom
    */
    getCurClassData: function (dayIndex) {
        var _this = this;
        //当前分页所属数据
        var curClassData = _this.outJson[dayIndex];
        if (dayIndex == 2) {
            curClassData = _this.recommendBottom;
        }
        return curClassData;
    },
    /**
        创建观看记录dom
    */
    createRightHistoryDom: function () {
        var _this = this;
        //最大创建的观看记录天数
        var maxDays = _this.outJson.length > 2 ? 2 : _this.outJson.length;
        for (var index = 0; index < maxDays; index++) {
            _this.trueCreatHisDom(index);
        }

        //创建大家都在看
        // _this.trueCreatHisDom(2);
    },
    /**
        真正创建观看记录dom
    */
    trueCreatHisDom: function (dayIndex) {
        var _this = this;
        //当前日期的观看记录
        //大家都在看top值
        var curClassTop = 44 + 270 * dayIndex;
        if (dayIndex == 2) {
            //大家都在看
            var curDayData = _this.recommendBottom;
            //是否存在最近两天记录
            if (_this.outJson[0].length) {
                //存在最近观看记录
                if (!_this.outJson[1].length) {
                    //不存在最近第二天观看记录
                    //改变创建推荐位的初始top值
                    curClassTop = 44 + 270 * (dayIndex - 1);
                    //改变分类标签和翻页箭头的top值
                    CT.$('timePoint2').style.top = '252px';
                    CT.$('rightArrow2').style.top = '410px';
                }
            } else {
                //不存在最近观看记录
                _this.recommendBottom = [];
                //隐藏时间轴
                CT.$('timeBar').style.visibility = 'hidden';
                CT.$('timePoint0').style.visibility = 'hidden';
                CT.$('timePoint1').style.visibility = 'hidden';
                CT.$('timePoint2').style.visibility = 'hidden';
                //显示无观看记录提示图
                CT.$('emptyTip').style.visibility = 'visible';
                return;
                /*当有历史记录时，才渲染固定推荐
                //改变创建推荐位的初始top值
                curClassTop = 44;
                //改变分类标签和翻页箭头的top值
                CT.$('timePoint2').style.top = '-18px';
                CT.$('rightArrow2').style.top = '140px';
                */
            }
        } else {
            var curDayData = _this.outJson[dayIndex];
            //显示当前时间轴日期标识
            if (curDayData[0]) {
                CT.$('recordDateText' + dayIndex).innerHTML = curDayData[0].createDay;
            }
        }
        if (curDayData.length > 4) {
            CT.$('rightArrow' + dayIndex).src = AjaxConfig.imgUrl + _this.recommendPageImg[0].recommendPic.picPath;
        }
        CT.$('timePoint' + dayIndex).style.visibility = 'visible';
        //创建当前日期的dom
        var maxIndex = curDayData.length > 4 ? 4 : curDayData.length;
        for (var index = 0; index < maxIndex; index++) {
            //创建推荐位焦点Btn
            var btn = {
                id: 'hands_x0_y0_' + dayIndex + 'recordBtn' + index + '_',
                otherFocusEvent: 'javascript:historyObj.recBtnOtherFocusEvent(' + dayIndex + ',' + index + ')',
                clickHandler: 'javascript:historyObj.recBtnClickEvent(' + dayIndex + ',' + index + ')',
                //left : 'hands_x0_y0_' + dayIndex + 'recordBtn' + (index - 1) + '_',
                leftEvent: 'javascript:historyObj.recBtnLeftEvent(' + dayIndex + ',' + index + ')',
                //right : 'hands_x0_y0_' + dayIndex + 'recordBtn' + (index + 1) + '_',
                rightEvent: 'javascript:historyObj.recBtnRightEvent(' + dayIndex + ',' + index + ')',
                upEvent: 'javascript:historyObj.recBtnUpEvent(' + dayIndex + ',' + index + ')',
                downEvent: 'javascript:historyObj.recBtnDownEvent(' + dayIndex + ',' + index + ')',
                TempData: curDayData[index]
            }
            buttons.push(btn);

            //创建推荐位焦点Div
            var historyRecShowImgUrl = 'url(' + AjaxConfig.imgUrl + (curDayData[index].mediaPic ? curDayData[index].mediaPic : AjaxConfig.defaultCoverImg) + ') no-repeat';
            if (dayIndex == 2) {
                //大家都在看
                historyRecShowImgUrl = 'url(' + AjaxConfig.imgUrl + (curDayData[index].recommendPic && curDayData[index].recommendPic.picPath ? curDayData[index].recommendPic.picPath : AjaxConfig.defaultCoverImg) + ') no-repeat';
            }
            var recFocusDivObj = {
                domTag: 'div', //img等等
                domAttribute: {
                    'id': 'hands_x0_y0_' + dayIndex + 'recordBtn' + index + '_'
                },
                cssStyle: {
                    'position': 'absolute',
                    'top': curClassTop + 'px',
                    'left': 62 + 200 * index + 'px',
                    'width': 168 + 'px',
                    'height': 233 + 'px',
                    'background': historyRecShowImgUrl,
                    'border-radius': '16px'
                }
            };
            var recFocusDiv = CT.createDom(recFocusDivObj);

            //卡通名文本
            var recTextObj = {
                domTag: 'div',
                domAttribute: {
                    'id': dayIndex + 'recordText' + index,
                    'className': 'recommendTitle',
                    'innerHTML': dayIndex == 2 ? curDayData[index].recommendDisplayName:curDayData[index].mediaName
                }
            };
            var recText = CT.createDom(recTextObj);
            //卡通名文本插入焦点div
            recFocusDiv.appendChild(recText);

            //创建推荐位焦点图片
            var recFocusFocusImgObj = {
                domTag: 'img',
                domAttribute: {
                    'id': dayIndex + 'recordBtn' + index,
                    'src': AjaxConfig.imgUrl + _this.recommendPageImg[0].recommendFocuspic.picPath
                },
                cssStyle: {
                    'position': 'absolute',
                    'top': 0 + 'px',
                    'left': 0 + 'px',
                    'visibility': 'hidden'
                }
            };
            var recFocusFocusImg = CT.createDom(recFocusFocusImgObj);
            //焦点图插入焦点div
            recFocusDiv.appendChild(recFocusFocusImg);

            if (dayIndex == 2) {
                //大家都在看，不插入蒙版
            } else {
                //创建推荐位蒙版Div
                var recCoverDivObj = {
                    domTag: 'div', //img等等
                    domAttribute: {
                        'id': dayIndex + 'recordCover' + index,
                        'bgcolor': 'transparent'
                    },
                    cssStyle: {
                        'position': 'absolute',
                        'top': 0 + 'px',
                        'left': 0 + 'px',
                        'background': 'url("' + AjaxConfig.projectUrl + 'HD/images/recCover.png") no-repeat',
                        'width': 168 + 'px',
                        'height': 233 + 'px',
                        'border-radius': '16px',
                        'visibility': 'hidden'
                    }
                };
                var recCoverDiv = CT.createDom(recCoverDivObj);
                //去掉断点续播
                var nameArr = ['play', 'del'];//['play', 'rePlay', 'del'];
                //观看历史内部按钮
                //上次观看到
                var obj = {
                    domTag: 'div',
                    domAttribute: {
                        'id': dayIndex + 'recordTime' + index,
                        //'innerHTML': '上次观看到13:30:07'
                    },
                    cssStyle: {
                        'position': 'absolute',
                        'top': 8 + 'px',
                        'left': 8 + 'px',
                        'width': '150px',
                        'height': '35px',
                        'line-height': '27px',
                        'text-align': 'center',
                        'font-size': '17px',
                        'color': 'white'
                    }
                };
                var objDom = CT.createDom(obj);
                //上次观看到文本插入蒙版div
                recCoverDiv.appendChild(objDom);
                for (var i = 0; i < nameArr.length; i++) {
                    var name = nameArr[i];
                    //创建操作卡通焦点Div
                    var playDivObj = {
                        domTag: 'div', //img等等 recommendFocuspic
                        domAttribute: {
                            'id': 'hands_x0_y0_' + dayIndex + name + index + '_'
                        },
                        cssStyle: {
                            'position': 'absolute',
                            'top': 68 + 45 * i + 'px',
                            'left': 37 + 'px',
                            'width': '94px',
                            'height': '34px',
                            //去掉断点续播 1变为2
                            'background': 'url(' + AjaxConfig.imgUrl + _this.recommendPageImg[i + 2].recommendPic.picPath + ') no-repeat',
                            'border-radius': '8px'
                        }
                    };
                    var playDiv = CT.createDom(playDivObj);
                    //创建操作卡通焦点图片
                    var playFocusObj = {
                        domTag: 'img',
                        domAttribute: {
                            'id': dayIndex + name + index,
                            //去掉断点续播 1变为2
                            'src': AjaxConfig.imgUrl + _this.recommendPageImg[i + 2].recommendFocuspic.picPath
                        },
                        cssStyle: {
                            'position': 'absolute',
                            'top': 0 + 'px',
                            'left': 0 + 'px',
                            'visibility': 'hidden',
                            'border-radius': '8px'
                        }
                    };
                    var playFocus = CT.createDom(playFocusObj);
                    //创建操作卡通焦点图插入焦点div
                    playDiv.appendChild(playFocus);
                    //操作焦点插入蒙版
                    recCoverDiv.appendChild(playDiv);

                    //创建操作焦点焦点Btn
                    var btn = {
                        id: 'hands_x0_y0_' + dayIndex + name + index + '_',
                        clickHandler: 'javascript:historyObj.' + name + 'ClickEvent(' + dayIndex + ',' + index + ')',
                        otherFocusEvent: 'javascript:historyObj.operationBtnGetFocus(' + dayIndex + ',' + index + ',"' + name + '")',
                        leftEvent: 'javascript:historyObj.recBtnLeftEvent(' + dayIndex + ',' + index + ')',
                        rightEvent: 'javascript:historyObj.recBtnRightEvent(' + dayIndex + ',' + index + ')',
                        up: 'hands_x0_y0_' + dayIndex + nameArr[i - 1] + index + '_',
                        down: 'hands_x0_y0_' + dayIndex + nameArr[i + 1] + index + '_',
                        TempData: curDayData[index]
                    }
                    if (i == 0) {
                        btn.upEvent = 'javascript:historyObj.recBtnUpEvent(' + dayIndex + ',' + index + ')';
                    }
                    if (i == nameArr.length - 1) {
                        btn.downEvent = 'javascript:historyObj.recBtnDownEvent(' + dayIndex + ',' + index + ')';
                    }
                    buttons.push(btn);
                }

                //蒙版插入推荐位焦点div
                recFocusDiv.appendChild(recCoverDiv);
            }

            //推荐位焦点div插入页面
            CT.$('rightCreateDomWarpper').appendChild(recFocusDiv);
        }
    },
    /*
        改变当前焦点遮罩层和当前分类翻页按钮显示状态
    */
    changeArrowStatus: function (dayIndex, index) {
        var _this = this;
        try {
            //隐藏当前焦点遮罩层
            // CT.$(dayIndex + 'recordCover' + index).style.visibility = 'hidden';
            if (CT.$(dayIndex + 'recordCover' + index)) CT.$(dayIndex + 'recordCover' + index).style.visibility = 'hidden';
        } catch (error) {

        }
        //改变翻页指示箭头显示状态
        for (var i = 0; i < 3; i++) {
            CT.$('rightArrow' + i).style.visibility = 'hidden';
        }
        //当前分页所属数据
        var curClassData = _this.getCurClassData(dayIndex);
        //当前分页所属数据长度
        var curClassDataLen = curClassData.length;
        //是否有隐藏数据
        var lastShowDataIndex = _this['curPageDataIndex' + dayIndex] + (3 - index);
        if (lastShowDataIndex < curClassDataLen - 1) {
            //有隐藏数据
            var tempIndex = dayIndex;
            try {
                if (curFocus.FocusID.indexOf("recordBtn") > -1) {
                    //更新原来的类的数据时会显示原来的类的箭头，这里矫正
                    tempIndex = Number(curFocus.FocusID.substring(12, 13))
                }
            } catch (error) {

            }
            CT.$('rightArrow' + tempIndex).style.visibility = 'visible';
        }
    },
    /*
        推荐位焦点获焦事件
    */
    operationBtnGetFocus: function (dayIndex, index, name) {
        var _this = this;
        var recommendTrackName = name == "play" ? "DMEJwatchrecordplay" : "DMEJwatchrecorddelect";
        recommendTrackName = dayIndex + recommendTrackName + _this['curPageDataIndex' + dayIndex];
        //手动添加/更改当前坑位埋点
        if (curFocus.TempData) {
            curFocus.TempData.recommendTrackName = recommendTrackName;
        } else {
            curFocus.TempData = {
                recommendTrackName: recommendTrackName
            }
        }
    },
    /*
        推荐位焦点获焦事件
    */
    recBtnOtherFocusEvent: function (dayIndex, index) {
        var _this = this;
        if (_this.curPageDataIndex != dayIndex) {
            //重置其他分类数据下标
            for (var i = 0; i < 3; i++) {
                if (i != dayIndex) {
                    _this['curPageDataIndex' + i] = 0;
                }
            }
            _this['curPageDataIndex' + dayIndex] = index;
        }
        //更新当前焦点所属分类下标
        _this.curPageDataIndex = dayIndex;
        //改变当前焦点遮罩层和当前分类翻页按钮显示状态
        _this.changeArrowStatus(dayIndex, index);
        //改变展示位置
        if (dayIndex == 0) {
            //最近第一天观看记录获焦
            CT.$('rightContent').style.top = '0px';
            //改变时间轴长度
            CT.$('timeBar').style.height = '620px';
        } else if (dayIndex == 2) {
            //大家都在看获焦
            if (_this.outJson[1].length) {
                //有第二天记录
                CT.$('rightContent').style.top = '-280px';
                //改变时间轴长度
                CT.$('timeBar').style.height = '900px';
            } else {
                //没有第二天分类
                CT.$('rightContent').style.top = '0px';
                //改变时间轴长度
                CT.$('timeBar').style.height = '620px';
            }
        }
    },
    /*
        推荐位焦点点击事件
    */
    recBtnClickEvent: function (dayIndex, index) {
        var _this = this;
        if (_this.curPageDataIndex != dayIndex) {
            //重置其他分类数据下标
            for (var i = 0; i < 3; i++) {
                if (i != dayIndex) {
                    _this['curPageDataIndex' + i] = 0;
                }
            }
            _this['curPageDataIndex' + dayIndex] = index;
        }
        if (dayIndex == 2) {
            //大家都在看
            //记忆页面数据
            _this.memoryPage(dayIndex, index);
            //跳转对应页面
            CT.toAnterRecommendUrl(curFocus.TempData);
        } else {
            //显示当前焦点遮罩层
            CT.$(dayIndex + 'recordCover' + index).style.visibility = 'visible';
            //切换焦点到“继续观看”
            PAGE.changeFocus('hands_x0_y0_' + dayIndex + 'play' + index + '_');
        }
    },
    /*
        推荐位焦点获焦向左事件
    */
    recBtnLeftEvent: function (dayIndex, index) {
        var _this = this;
        if (index == 0) {
            //第一个焦点
            if (_this['curPageDataIndex' + dayIndex] == 0) {
                PAGE.changeFocus('hands_x0_y0_DMEJleftceterbutton2_');
            } else {
                //改变分页数据下标
                _this['curPageDataIndex' + dayIndex]--;
                //更新渲染分页
                _this.updateShowRec(dayIndex, index);
            }
        } else {
            //非第一个焦点
            //改变分页数据下标
            _this['curPageDataIndex' + dayIndex]--;
            //更改当前焦点
            PAGE.changeFocus('hands_x0_y0_' + dayIndex + 'recordBtn' + (index - 1) + '_');
        }
        //隐藏当前焦点遮罩层
        // CT.$(dayIndex + 'recordCover' + index).style.visibility = 'hidden';
        if (CT.$(dayIndex + 'recordCover' + index)) CT.$(dayIndex + 'recordCover' + index).style.visibility = 'hidden';
    },
    /*
        推荐位焦点获焦向右事件
    */
    recBtnRightEvent: function (dayIndex, index) {
        var _this = this;
        //获取当前分类数据
        var dataArr = _this.outJson[dayIndex];
        if (dayIndex == 2) {
            dataArr = _this.recommendBottom;
        }
        if (_this['curPageDataIndex' + dayIndex] == dataArr.length - 1) {
            //最后一条数据，不响应翻页
            return;
        } else {
            //不是最后一条数据，翻页
            //改变分页数据下标
            _this['curPageDataIndex' + dayIndex]++;
            if (index == 3) {
                //更新渲染分页
                _this.updateShowRec(dayIndex, index);
            } else {
                //更改当前焦点
                PAGE.changeFocus('hands_x0_y0_' + dayIndex + 'recordBtn' + (index + 1) + '_');
            }
        }
        //隐藏当前焦点遮罩层
        // CT.$(dayIndex + 'recordCover' + index).style.visibility = 'hidden';
        if (CT.$(dayIndex + 'recordCover' + index)) CT.$(dayIndex + 'recordCover' + index).style.visibility = 'hidden';
    },
    /*
        推荐位焦点获焦向上事件
    */
    recBtnUpEvent: function (dayIndex, index) {
        var _this = this;
        //判断当前分类
        if (dayIndex == 2) {
            //当前分类大家都在看
            //获取下一分类数据
            if (_this.outJson[1].length) {
                //存在最近第二条观看记录
                //获取下一分类最大按钮数
                var maxNum = _this.outJson[1].length - 1 > index ? index : _this.outJson[1].length - 1;
                //切换分类焦点
                PAGE.changeFocus('hands_x0_y0_' + (dayIndex - 1) + 'recordBtn' + maxNum + '_');
                //重置当前分类数据
                if (_this.recommendBottom.length > 4) {
                    _this['curPageDataIndex' + dayIndex] = 0;
                    //更新渲染分页
                    _this.updateShowRec(dayIndex, index, 'reset');
                }
            } else if (_this.outJson[0].length) {
                //只存在最近一天的记录
                //获取下一分类最大按钮数
                var maxNum = _this.outJson[0].length - 1 > index ? index : _this.outJson[0].length - 1;
                //切换分类焦点
                PAGE.changeFocus('hands_x0_y0_' + (dayIndex - 2) + 'recordBtn' + maxNum + '_');
                //重置当前分类数据
                if (_this.recommendBottom.length > 4) {
                    _this['curPageDataIndex' + dayIndex] = 0;
                    //更新渲染分页
                    _this.updateShowRec(dayIndex, index, 'reset');
                }
            } else {
                //不存在最近观看记录，不响应
                return;
            }
        } else {
            //当前分类最近第一天或第二天
            //获取下一分类数据
            if (dayIndex == 1) {
                //当前分类为最近第二天 dayIndex == 1
                //获取下一分类最大按钮数
                var maxNum = _this.outJson[0].length - 1 > index ? index : _this.outJson[0].length - 1;
                //切换分类焦点
                PAGE.changeFocus('hands_x0_y0_' + (dayIndex - 1) + 'recordBtn' + maxNum + '_');
                //重置当前分类数据
                if (_this.outJson[1].length > 4) {
                    _this['curPageDataIndex' + dayIndex] = 0;
                    //更新渲染分页
                    _this.updateShowRec(dayIndex, index, 'reset');
                }
            } else {
                //当前分类为最近第一天，不响应
                return;
            }
        }
        //隐藏当前焦点遮罩层
        
        // CT.$(dayIndex + 'recordCover' + index) && (CT.$(dayIndex + 'recordCover' + index).style.visibility = 'hidden');
        if (CT.$(dayIndex + 'recordCover' + index)) CT.$(dayIndex + 'recordCover' + index).style.visibility = 'hidden';
    },
    /*
        推荐位焦点获焦向下事件
    */
    recBtnDownEvent: function (dayIndex, index) {
        var _this = this;
        //判断当前分类
        if (dayIndex == 0) {
            //当前分类：最近第一天观看记录
            //获取下一分类数据
            if (_this.outJson[1].length) {
                //存在最近第二条观看记录
                //获取下一分类最大按钮数
                var maxNum = _this.outJson[1].length - 1 > index ? index : _this.outJson[1].length - 1;
                //切换分类焦点
                PAGE.changeFocus('hands_x0_y0_' + (dayIndex + 1) + 'recordBtn' + maxNum + '_');
                //重置当前分类数据
                if (_this.outJson[dayIndex].length > 4) {
                    _this['curPageDataIndex' + dayIndex] = 0;
                    //更新渲染分页
                    _this.updateShowRec(dayIndex, index, 'reset');
                }
            } else if (_this.outJson[0].length) {
                //不存在最近第二天的记录
                //获取下一分类最大按钮数
                var maxNum = _this.recommendBottom.length - 1 > index ? index : _this.recommendBottom.length - 1;
                //切换分类焦点
                PAGE.changeFocus('hands_x0_y0_' + (dayIndex + 2) + 'recordBtn' + maxNum + '_');
                //重置当前分类数据
                if (_this.outJson[dayIndex].length > 4) {
                    _this['curPageDataIndex' + dayIndex] = 0;
                    //更新渲染分页
                    _this.updateShowRec(dayIndex, index, 'reset');
                }
            }
        } else {
            //当前分类：大家都在看，或者最近第二天观看记录
            //获取下一分类数据
            if (dayIndex == 1) {
                //当前分类为最近第二天 dayIndex == 1
                //获取下一分类最大按钮数
                var maxNum = _this.recommendBottom.length - 1 > index ? index : _this.recommendBottom.length - 1;
                //切换分类焦点
                PAGE.changeFocus('hands_x0_y0_' + (dayIndex + 1) + 'recordBtn' + maxNum + '_');
                //重置当前分类数据
                if (_this.outJson[dayIndex].length > 4) {
                    _this['curPageDataIndex' + dayIndex] = 0;
                    //更新渲染分页
                    _this.updateShowRec(dayIndex, index, 'reset');
                }
            } else {
                //当前分类为大家都在看，不响应
                return;
            }
        }
        //隐藏当前焦点遮罩层
        // CT.$(dayIndex + 'recordCover' + index).style.visibility = 'hidden';
        if (CT.$(dayIndex + 'recordCover' + index)) CT.$(dayIndex + 'recordCover' + index).style.visibility = 'hidden';
    },
    /*
        更新渲染分页
        dayIndex：当前数据所属分类；index：当前按钮数据下标；isReset：是否重置分类数据，重置下标渲染数据（'reset':重置）
    */
    updateShowRec: function (dayIndex, index, isReset) {
        var _this = this;
        //当前分页所属数据
        var curClassData = _this.getCurClassData(dayIndex);
        //当前分页所属数据长度
        var curClassDataLen = curClassData.length;
        //最大更新推荐位下标
        // var maxNum = curClassDataLen - 1 > 3 ? 3 : curClassDataLen - 1;

        //更新第一个推荐位的数据下标
        var firstUpdateIndex = _this['curPageDataIndex' + dayIndex] - index;

        if(firstUpdateIndex + 3 > curClassDataLen - 1) {
            firstUpdateIndex = curClassDataLen - 4;
        }
        if(firstUpdateIndex < 0) {
            firstUpdateIndex = 0
        }
        if (isReset == 'reset') {
            firstUpdateIndex = 0;
        }
        if(firstUpdateIndex + index > curClassDataLen - 1) {
            index = curClassDataLen - 1 - firstUpdateIndex;
        }

        _this['curPageDataIndex' + dayIndex] = firstUpdateIndex + index;

        for (var i = 0; i < 4; i++) {
            if (firstUpdateIndex + i < curClassDataLen) {
                //可获焦dom
                //展示图img地址
                var recShowImgUrl = AjaxConfig.defaultCoverImg;
                if (curClassData[i + firstUpdateIndex] && curClassData[i + firstUpdateIndex].mediaPic) {
                    recShowImgUrl = AjaxConfig.imgUrl + curClassData[i + firstUpdateIndex].mediaPic;
                }
                //显示当前焦点卡通名
                CT.$(dayIndex + 'recordText' + i).style.visibility = 'visible';
                CT.$(dayIndex + 'recordText' + i).innerHTML = dayIndex == 2 ? curClassData[i + firstUpdateIndex].recommendDisplayName:curClassData[i + firstUpdateIndex].mediaName;
                //更新当前焦点绑定数据
                PAGE.getModelByFocusId('hands_x0_y0_' + dayIndex + 'recordBtn' + i + '_').TempData = curClassData[i + firstUpdateIndex];
                //手动添加/更改当前坑位埋点
                if (PAGE.getModelByFocusId('hands_x0_y0_' + dayIndex + 'recordBtn' + i + '_').TempData) {
                    if((PAGE.getModelByFocusId('hands_x0_y0_' + dayIndex + 'recordBtn' + i + '_').TempData.recommendTrackName+"").indexOf("intelligent") == -1){
                        PAGE.getModelByFocusId('hands_x0_y0_' + dayIndex + 'recordBtn' + i + '_').TempData.recommendTrackName = dayIndex + 'DMEJwatchrecord' + (i + firstUpdateIndex);
                    }
                    // PAGE.getModelByFocusId('hands_x0_y0_' + dayIndex + 'recordBtn' + i + '_').TempData.recommendTrackName = dayIndex + 'DMEJwatchrecord' + (i + firstUpdateIndex);
                } else {
                    PAGE.getModelByFocusId('hands_x0_y0_' + dayIndex + 'recordBtn' + i + '_').TempData = {
                        recommendTrackName: dayIndex + 'DMEJwatchrecord' + (i + firstUpdateIndex)
                    }
                }
                //启用焦点
                PAGE.getFocusModel6('hands_x0_y0_' + dayIndex + 'recordBtn' + i + '_').enFocus = true;
                if (dayIndex == 2) {
                    if (curClassData[i + firstUpdateIndex].recommendPic && curClassData[i + firstUpdateIndex].recommendPic.picPath) {
                        recShowImgUrl = AjaxConfig.imgUrl + curClassData[i + firstUpdateIndex].recommendPic.picPath;
                    }
                }
                (function(_dayIndex,_i){
                    PAGE.getModelByFocusId('hands_x0_y0_' + _dayIndex + 'recordBtn' + _i + '_').TempData = curClassData[_i + firstUpdateIndex];
                    if(CT.$('hands_x0_y0_' + _dayIndex + 'play' + _i + '_')) {
                        PAGE.getModelByFocusId('hands_x0_y0_' + _dayIndex + 'play' + _i + '_').TempData = curClassData[_i + firstUpdateIndex];
                        PAGE.getModelByFocusId('hands_x0_y0_' + dayIndex + 'del' + _i + '_').TempData = curClassData[_i + firstUpdateIndex];
                    }
                    _this.changeArrowStatus(_dayIndex,_i);
                })(dayIndex,i);
                CT.$('hands_x0_y0_' + dayIndex + 'recordBtn' + i + '_').style.background = 'url(' + recShowImgUrl + ') no-repeat';
            } else {
                //不可获焦dom
                try {
                    //禁用焦点
                    PAGE.getFocusModel6('hands_x0_y0_' + dayIndex + 'recordBtn' + i + '_').enFocus = false;
                    //隐藏蒙版
                    //隐藏当前焦点遮罩层
                    CT.$(dayIndex + 'recordCover' + i).style.visibility = 'hidden';
                    //隐藏当前焦点卡通名
                    CT.$(dayIndex + 'recordText' + i).style.visibility = 'hidden';
                    //改变背景图
                    CT.$('hands_x0_y0_' + dayIndex + 'recordBtn' + i + '_').style.background = 'url(./HD/images/empty.png) no-repeat';
                } catch (error) {

                }
            }
        }
        //改变当前焦点遮罩层和当前分类翻页按钮显示状态
        _this.changeArrowStatus(dayIndex, index);
        return index;
    },
    /*
        继续播放按钮点击事件
    */
    playClickEvent: function (dayIndex, index) {
        var _this = this;
        _this.rePlayClickEvent(dayIndex, index);
        return;
        //去掉断点续播
        var obj = curFocus.TempData;
        //先记录跳转离开之前的页面参数(分类导航页用例)
        _this.memoryPage(dayIndex, index);
        obj.recommendDisplayType = 2;
        obj.cartoonId = obj.collectValue;
        obj.id = obj.videoId;
        CT.toAnterRecommendUrl(obj);
    },
    /*
        重新播放按钮点击事件
    */
    rePlayClickEvent: function (dayIndex, index) {
        var _this = this;
        var obj = curFocus.TempData;
        //先记录跳转离开之前的页面参数(分类导航页用例)
        _this.memoryPage(dayIndex, index);
        obj.recommendDisplayType = obj.collectType;
        obj.recommendDisplayValue = obj.collectValue;
        CT.toAnterRecommendUrl(obj);
    },
    /*
        记忆历史页面
    */
    memoryPage: function (dayIndex, index) {
        var _this = this;
        //先记录跳转离开之前的页面参数(分类导航页用例)
        var curFocusIdLast = 'hands_x0_y0_' + dayIndex + 'recordBtn' + index + '_';
        PAGE.otherPageParam = "&contentEName=" + basePageInfo.findTemplateInfo.commPageEname + "&contentType=" + CT.requestValue("contentType") + "&contentId=" + basePageInfo.findTemplateInfo.pageId + "&contentCName=" + basePageInfo.findTemplateInfo.commPageCname + "&curFocusId=" + curFocusIdLast + '&curPageDataIndex=' + _this.curPageDataIndex + ('&curPageDataIndex' + _this.curPageDataIndex + '=' + _this['curPageDataIndex' + _this.curPageDataIndex]);

        CT.goPage();
    },
    /*
        删除观看记录（deleteHistoryList）或者收藏（deleteUserCollect）
     * 删除数据的参数，contentId表示gameId或cartoonId，contenType表示删除的类型 0-游戏，1-卡通，2-视频
    */
    delClickEvent: function (dayIndex, index) {
        var _this = this;
        //当前分页所属数据
        var curClassData = _this.getCurClassData(dayIndex);
        var curDataIndex = _this['curPageDataIndex' + dayIndex];
        var curClassDataObj = curClassData[curDataIndex];
        var delParams = {
            userId: _this.userId,
            contentId: curClassDataObj.collectValue,
            contentType: Number(curClassDataObj.collectType)
        };
        interface.deleteHistoryList(delParams, function (data) {
            _this.delCallBack(dayIndex, index);
        });
    },
    /*
        删除历史记录后的回调事件
    */
    delCallBack: function (dayIndex, index) {
        var _this = this;
        //当前分页所属数据
        var curClassData = _this.getCurClassData(dayIndex);
        //删除本地当前类数据元素
        curClassData.splice(_this['curPageDataIndex' + dayIndex], 1);
        //判断当前元素下标是否超出
        //当前下标超出，判断数据是否为空
        if (curClassData.length > 0) {
            index = _this.updateShowRec(dayIndex, index);
            PAGE.changeFocus('hands_x0_y0_' + dayIndex + 'recordBtn' + index + '_');
            //更新当前类展示
        } else {
            //删除后数据为空，清空两天的本地观看记录
            historyObj.outJson = [
                [],
                []
            ];
            //分类文本清空
            for (var i = 0; i < 2; i++) {
                CT.$('recordDateText' + i).innerHTML = '';
            }
            //清空页面所有分类
            CT.$('rightCreateDomWarpper').innerHTML = '';
            //删除动态创建的button
            buttons.splice(5);
            //重新渲染页面所有分类
            _this.getHistoryData();
        }
    },
}

addEvent.on("pageEvent",function(e){

    historyObj.init();
})

//定义左侧导航按钮向右事件: curBtnIndex：当前焦点下标
generalLeftNavObj.navBtnRighEventCallBack = function (curBtnIndex) {
    var _this = this;
    //历史记录页
    var focus = 'hands_x0_y0_2recordBtn0_';
    if (historyObj.outJson[0].length) {
        focus = 'hands_x0_y0_0recordBtn0_';
    } else if (historyObj.outJson[1].length) {
        focus = 'hands_x0_y0_1recordBtn0_';
    }else {
        return;
    }
    PAGE.changeFocus(focus);
};


//定义左侧列表按钮获焦事件
generalLeftNavObj.navBtnOtherFocusEventCallBack = function ( curBtnIndex) {
    var _this = this;
    try {
        CT.$('rightContent').style.top = '0px';
        historyObj.changeArrowStatus(historyObj.curPageDataIndex);
    } catch (error) {

    }
}
//返回
function backFunc() {
    CT.backPage();
}

