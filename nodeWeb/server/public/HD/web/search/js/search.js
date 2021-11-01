var localImg = basePageInfo.localImg;
var commonPageInfo = basePageInfo.commonPageInfo;
var search = {
    //用户id
    userId: "12321",
    //页面ID
    contentId: basePageInfo.commonPageInfo.pageInfo.commonPageId || 1,
    totalLen: 0,

    //需要展示的搜索长度
    searchResultLen: 2,
    //热搜的内容
    hotSearchList: [],
    //热搜上下切换的数量
    hotSearchNum: CT.requestValue("hotSearchNum") || 0,
    // 是否使用大数据推荐数据
    bigDataSwitch: true,
    //右侧推荐的数据，大数据来源
    rightRecommendJson_bigData: [],
    //右侧推荐的数据，手工配置来源
    rightRecommendJson_manualConfig: commonPageInfo.recommend_2 || [],
    //右侧推荐的数据，实际使用
    rightRecommendJson: commonPageInfo.recommend_2 || [],
    //推荐分页
    rmdTotalLen: 0,
    //右侧推荐，当前显示的数据
    curRightJson: [],
    //搜索关键字
    searchKeywords: CT.requestValue("searchKeywords") || "",
    //搜索的结果
    searchResultJson: null,
    //右侧显示搜索结果的页数
    searchResultNum: Number(CT.requestValue("searchResultNum")) || 1,
    //显示每一页数据
    searchResultSize: 6,
    //右侧显示的页数的偏移量.如第一页显示0-5,第二页3-8,第三页6-11.
    //计算每页开始start_idx = (pagesize + offset )*(currentpage -1)
    searchResultNumOffset: -3,
    //右侧用于记录再次返回到这页面显示搜索结果的翻页
    // backSearchResultNum: Number(CT.requestValue("searchResultNum")) || 0,
    //右侧6个位置的定位
    recommendPsition: [{
        top: 0,
        left: 0
    }, {
        top: 0,
        left: 198
    }, {
        top: 0,
        left: 198 * 2
    },
    {
        top: 233 + 23,
        left: 0
    }, {
        top: 233 + 23,
        left: 198
    }, {
        top: 233 + 23,
        left: 198 * 2
    },
        //{top:390,left:0},{top:390,left:180},{top:390,left:350}
    ],
    //右侧显示的数据是否是搜索出来的结果
    showSearchResult: false,
    /**
     * 获取页面数据
     * 显示左侧的数字和字母，中间的热搜，右侧的推荐
     */
    init: function () {
        var _this = this;
        /*    if (_this.backSearchResultNum) {
                _this.searchResultNum = _this.backSearchResultNum;
            } else {
                _this.searchResultNum = _this.rightRecommendJson.length > 6 ? 2 : (parseInt(_this.rightRecommendJson.length / 3) + (_this.rightRecommendJson.length % 3 > 0 ? 1 : 0));
            }*/
        //显示左边数字和字母
        _this.showNumberLetter();
        //创建热搜并显示热搜
        _this.creatHotSearch();
        if (_this.searchKeywords) {
            _this.clearTipText();
        }
    },
    //背景图
    setBjImg: function () {
        var _this = this;
        CT.$("BJ").src = AjaxConfig.imgUrl + commonPageInfo.pageInfo.pageTemplateBgpic.picPath;
    },
    /**
     * 显示左边数字字母
     * 先创建推荐位置，后通过_this.setButtons创建按钮
     * 删除按钮和数字字母的切换按钮在这个方法定义
     */
    showNumberLetter: function () {
        var _this = this;
        // 创建数字
        buttons.push({
            id: "hands_x0_y0_del_",
            clickHandler: "javascript:search.delText()",
            up: "disable",
            left: "disable",
            right: "hands_x0_y0_clear_",
            downEvent: "javascript:search.downBtnInit()",
            focusType: 7
        }, {
            id: "hands_x0_y0_clear_",
            clickHandler: "javascript:search.clearText()",
            up: "disable",
            left: "hands_x0_y0_del_",
            rightEvent: "javascript:search.rightBtnInit()",
            downEvent: "javascript:search.downBtnInit()",
            focusType: 7
        }, {
            id: "hands_x0_y0_changeNumber_",
            clickHandler: "",
            upEvent: "javascript:search.upBtnInit('number')",
            down: "disable",
            left: "disable",
            right: "hands_x0_y0_changeLetter_",
            otherFocusEvent: "javascript:search.changeType('number')",
            focusType: 7
        }, {
            id: "hands_x0_y0_changeLetter_",
            clickHandler: "",
            upEvent: "javascript:search.upBtnInit('letter')",
            down: "disable",
            left: "hands_x0_y0_changeNumber_",
            rightEvent: "javascript:search.rightBtnInit()",
            otherFocusEvent: "javascript:search.changeType('letter')",
            focusType: 7,
        })
        _this.setButtons("letter", 4, 26); //设置字母
        _this.setButtons("number", 3, 10); //设置数字
    },
    /**
     * 创建数字、字母按钮
     * 创建完成之后push到buttons
     * @param name id名称
     * @param step 一行几个
     * @param len 总数
     * @param arr 按钮数组
     */
    setButtons: function (name, step, len, arr) {
        var _this = this;
        for (var i = 0; i < len; i++) {
            var button = {
                id: 'hands_x0_y0_' + name + i + '_',
                clickHandler: 'javascript:search.addUserNumberOrLetter("hands_x0_y0_' + name + i + '_")',
                otherFocusEvent: 'javascript:search.clearTipText()',
                right: 'hands_x0_y0_' + name + Number(i + 1) + '_',
                left: 'hands_x0_y0_' + name + Number(i - 1) + '_',
                up: 'hands_x0_y0_' + name + Number(i - step) + '_',
                down: 'hands_x0_y0_' + name + Number(i + step) + '_',
                focusType: 7
            }
            if ((i == 0)) {
                button.left = "disable";
            }
            if (i < step) {
                button.up = "hands_x0_y0_del_";
            }
            if ((i % step) == (step - 1)) {
                button.rightEvent = "javascript:search.rightBtnInit()";
            }
            if (i == (len - 1)) {
                if (name == "number") {
                    button.right = "hands_x0_y0_changeNumber_";
                } else {
                    button.right = "hands_x0_y0_changeLetter_";
                }
            }
            if ((i + step) >= len) {
                if (name == "number") {
                    button.down = "hands_x0_y0_changeNumber_";
                } else {
                    button.down = "hands_x0_y0_changeLetter_";
                }
            }
            if (arr && arr[i] && arr[i] instanceof Object) {
                for (var key in arr[i]) {
                    button[key] = arr[i][key];
                }
            }
            buttons.push(button)
        }
    },
    /*
        清除提示语
    */
    clearTipText: function () {
        var _this = this;
        CT.$('userText1').innerHTML = '';
    },
    /**
     * 选中数字或字母并填写在搜索框内
     * 搜索长度超过11时，不允许填写
     * 实时搜索
     * @param  focusID 当前选中坐标
     */
    addUserNumberOrLetter: function (focusID) {
        var _this = this;
        var userText = CT.$('userText');
        var index = focusID.match(/[\d]+/g)[2];
        if (userText.innerHTML.length > 11) {
            var el = document.createElement("div");
            el.style.cssText = "position: absolute;top: 91px;left: 173px;padding: 10px;font-size: 30px;color: #fff;z-index: 222;background: rgba(0,0,0,0.8);";
            el.innerHTML = "超出搜索字节范围";
            el.id = "tip";
            document.body.appendChild(el);
            var timer = null;
            clearTimeout(timer);
            timer = setTimeout(function () {
                var tipElm = document.getElementById("tip");
                tipElm.parentNode.removeChild(tipElm);
            }, 1000);
            return;
        }
        if (/number/.test(focusID)) {
            userText.innerHTML += CT.$("numberSpan" + index).innerHTML;
        } else if (/letter/.test(focusID)) {
            userText.innerHTML += CT.$("letterSpan" + index).innerHTML;
        }
        // if(_this.__init == true) {
        _this.searchResultNum = 1;
        // }
        _this.searchResult();
    },
    /**
     * 在右侧显示搜索结果
     * 通过ajax向后台实发送请求获取搜索的结果
     *
     * 如果搜索的结果大于0，则在右侧显示否则不显示
     */
    searchResult: function (searchResultNum) {
        var _this = this;
        var word = CT.$('userText').innerHTML;
        interface.search({
            searchValue: word
        }, function (data) {
            // CT.$("searchAll").innerHTML = "共搜索到" + data.data.length + "条";
            CT.$("allSearch").style.visibility = "hidden";
            //获取搜索的数据
            _this.searchResultJson = data.data || {};
            // _this.totalLen = Math.ceil(_this.searchResultJson.length / 3);
            _this.showSearchResult = true;
            _this.showRightRecommend();
        });
    },

    /**
     * 删除按钮删除搜索内容
     * 对删除之后数据进行 搜索
     * 如果删除完成则显示推荐信息
     * t :清空操作
     */
    delText: function () {
        var _this = this;
        CT.$('userText').innerHTML = CT.$('userText').innerHTML.substring(0, CT.$('userText').innerHTML.length - 1);
        if (CT.$('userText').innerHTML == "") {
            _this.clearText();
        } else {
            _this.searchResult();
        }
    },
    clearText: function () {
        var _this = this;
        CT.$('userText').innerHTML = '';
        CT.$("allSearch").style.visibility = "visible";
        _this.showSearchResult = false;
        _this.searchKeywords = "";
        //显示固定推荐数据
        _this.searchResultNum = 1;
        _this.showRightRecommend();
    },
    /**
     *   删除按钮向下到数字或者字母按键
     */
    downBtnInit: function () {
        var _this = this;
        var btnObj = "";
        if (_this.getCurKeyboardType() == "letter") {
            PAGE.changeFocus("hands_x0_y0_letter0_");
        } else if (_this.getCurKeyboardType() == "number") {
            PAGE.changeFocus("hands_x0_y0_number0_");
        } else {
            return;
        }
    },
    /**
     *  数字和字母切换按键 向上选中数字或者字母
     */
    upBtnInit: function (type) {
        var _this = this;
        var btnObj = "";
        if (type == "letter") {
            PAGE.changeFocus("hands_x0_y0_letter25_");
        } else if (type == "number") {
            PAGE.changeFocus("hands_x0_y0_number9_");
        } else {
            return;
        }
    },
    //字母向右，先判断是否存在热搜
    rightBtnInit: function () {
        var _this = this;
        if (_this.hotSearchList.length > 0) {
            PAGE.changeFocus("hands_x0_y0_DMSSFList0_");
        } else {
            _this.hotTextRight();
        }
    },
    /**
     *  切换数字和字母
     *  选中焦点事件
     *  @returns {string}
     */
    changeType: function (type) {
        var _this = this;
        if (type == "letter") {
            CT.hide(CT.$("number"));
            CT.show(CT.$("letter"));
            CT.hide(CT.$("numberBjImg"));
            CT.show(CT.$("letterBJImg"));
        } else {
            CT.hide(CT.$("letter"));
            CT.show(CT.$("number"));
            CT.hide(CT.$("letterBJImg"));
            CT.show(CT.$("numberBjImg"));
        }
    },
    /**
     *   判断当前 是显示字母或者数字
     * @returns {string}
     */
    getCurKeyboardType: function () { //获取当前键盘类型
        var _this = this;
        var letterDiv = CT.$("letter"); //字母键盘
        var numberDiv = CT.$("number"); //数字键盘
        if (letterDiv.style.visibility == "visible") {
            return "letter"; //字母
        } else if (numberDiv.style.visibility == "visible") {
            return "number"; //数字
        }
    },
    /**
     * 创建空的DOM和按钮
     * 显示中间热搜,创建按钮
     * 先显示前是十个，如果总数没有10就显示所有
     * rankType	 筛选条件：0-按天；1-按周；2-按月；3-按季度；4-按年（不传，默认为0）
     */
    creatHotSearch: function () {
        var _this = this;
        interface.topSearch({
            rankType: 2
        }, function (data) {
            _this.hotSearchList = data.data;
            var listLen = _this.hotSearchList.length > 9 ? 9 : _this.hotSearchList.length;
            _this.hotSearchNum = _this.hotSearchNum || listLen;
            //创建按钮
            var hotSearch = "";
            for (var i = 0; i < listLen; i++) {
                hotSearch += "<div class='btn' id='hands_x0_y0_DMSSFList" + i + "_' style='top:" + (54 * i) + "px;left:-16px;'><img src='" + localImg + "hotSearchName2.png' style='width:265px;height:56px;position:absolute;top:11px;left:20px;'/>";
                hotSearch += "<div class='btn hotTextBoder' id='DMSSFList" + i + "'><img src='" + localImg + "hotSearchBorder.png' style='width:265px;height:56px;z-index:11' /></div>"; //光标
                hotSearch += "<div class='hotText morePonts' id='hotTextDiv" + i + "'><span id='hotText" + i + "'></span></div>"; //文字
                hotSearch += " </div>";
                var hotTextButtons = {
                    id: "hands_x0_y0_DMSSFList" + i + "_",
                    clickHandler: "javascript:search.toDetailPage('hotText'," + i + ")",
                    left: "hands_x0_y0_del_",
                    rightEvent: "javascript:search.hotTextRight()",
                    up: "hands_x0_y0_DMSSFList" + (i - 1) + "_",
                    down: "hands_x0_y0_DMSSFList" + (i + 1) + "_",
                    otherFocusEvent: "javascript:search.hotTextFocus()",
                    otherBlurEvent: "javascript:search.hotTextBlur()",
                    TempData: _this.hotSearchList[i] //添加临时数据
                };
                if (i == 0) {
                    hotTextButtons.upEvent = "javascript:search.hotTextUp()";
                } else if (i == listLen - 1) {
                    hotTextButtons.downEvent = "javascript:search.hotTextDown()";
                }
                buttons.push(hotTextButtons)
            }
            CT.$("hotSearch").innerHTML = hotSearch;
            _this.showHotSearch();
            //
            //右侧推荐位Dom和光标
            _this.creatRightRecommend();
            //初始化按钮
            // 拼接运营指定条数的人工配置数据，则大数据少请求几条
            var recommendNum = 10;
            // if (_this.rightRecommendJson_manualConfig && _this.rightRecommendJson_manualConfig[0]) {
            //     var more1Obj = CT.getMoresObj(_this.rightRecommendJson_manualConfig[0].more1);
            //     var configNum = more1Obj.configNum || 0;
            //     recommendNum -= configNum;
            // }
            PAGE.focusInit();
            if (_this.bigDataSwitch) {
                // 获取大数据推荐
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
                        _this.rightRecommendJson_bigData = result.data;
                        for(var i = 0; i < _this.rightRecommendJson_bigData.length; i++){
                            for(var z = 0; z < _this.rightRecommendJson_manualConfig.length; z++){
                                if(_this.rightRecommendJson_manualConfig[z].recommendDisplayValue == _this.rightRecommendJson_bigData[i].id){
                                    _this.rightRecommendJson_bigData.splice(i,1);
                                }
                            }
                        }
                        var maxNum = recommendNum;
                        // 大数据转换后的数据数组
                        var tempArr = [];
                        // 循环转换大数据
                        for (var index = 0; index < maxNum; index++) {
                            // 其他数据转换为坑位推荐数据：
                            var transInfo = {
                                // 必传：需要被转换的数据
                                transObj: _this.rightRecommendJson_bigData[index],
                                // 必传：转换的类型，比如： 1，大数据片单推荐→坑位推荐数据：1；默认
                                transType: 1,

                                // 选传：目标模板数据
                                // targetObj: CT.stringToJson(CT.jsonToString(_this.rightRecommendJson_manualConfig[index])),
                                // 选传：设定转换类型不能满足的定制化情景，需转换键名对，如：{"a" : "b"}代表被转换对象的b属性的值，赋值到模板对象的a属性上去。
                                transDiffKeys: {
                                    "recommendDisplayValue": "id"
                                },
                                // 选传：设定转换类型不能满足的定制化情景，需写死某属性值，需写死某属性值。如：{"a" : b}代表值b，赋值到模板对象的a属性上去。
                                transSpecialKeys: {},
                                //当前只能推荐位于现在推荐模组中的下标
                                recIndex: _this.rightRecommendJson_manualConfig.length + index + 1
                            }
                            var tempObj = CT.transObjDataToRec(transInfo);
                            // 转换后的数据推入大数据数组
                            tempObj && tempArr.push(tempObj);
                        }
                        // 拼接运营指定条数的人工配置数据在头部
                        // var configArr = _this.rightRecommendJson_manualConfig.slice(0, configNum - 0);
                        _this.rightRecommendJson = _this.rightRecommendJson_manualConfig.concat(tempArr);
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
        //显示固定推荐数据
        _this.showRightRecommend();
        _this.rmdTotalLen = Math.ceil(_this.rightRecommendJson.length / 3);
        if (_this.searchResultNum < _this.rmdTotalLen - 1) {
            CT.$('downArrow').style.visibility = 'visible';
        } else {
            CT.$('downArrow').style.visibility = 'hidden';
        }
        //if(!CT.requestValue('curFocusId') && (_this.searchResultNum = 1)){
        //选中默认按钮
        setTimeout(function () {
            var defaultFocus = CT.requestValue("curFocusId") || "hands_x0_y0_del_";
            PAGE.changeFocus(defaultFocus);
        }, 100);
        //}
    },
    /**
     *  显示热搜
     *  显示之前先清空，_this.hotSearchNum表示截取的结束点
     */
    showHotSearch: function () {
        var _this = this;
        _this.clearHotText();
        var newList = _this.hotSearchList;
        newList = newList.length > 9 ? (newList.slice(_this.hotSearchNum - 9, _this.hotSearchNum)) : newList;
        for (var i = 0; i < newList.length; i++) {
            var showTitle = newList[i].contentName;
            if (showTitle.length > 7) {
                CT.$("hotText" + i).innerHTML = showTitle.slice(0, 10) + "…";
            } else {
                CT.$("hotText" + i).innerHTML = showTitle;
            }

        }
    },
    /**
     * 清除热搜的九个选择项
     * 在切换下一页之前先清空span
     */
    clearHotText: function () {
        var _this = this;
        var listLen = _this.hotSearchList.length > 9 ? 9 : _this.hotSearchList.length;
        for (var i = 0; i < listLen; i++) {
            CT.$("hotText" + i).innerHTML = "";
        }
    },
    /**
     * 热搜向上 如果存在，向上切换
     */
    hotTextUp: function () {
        var _this = this;
        if (_this.hotSearchNum > 9) {
            _this.hotSearchNum--;
            _this.showHotSearch();
        }
        _this.hotTextFocus();
    },
    /**
     * 热搜向下 如果存在，向下切换
     * _this.hotSearchNum < _this.hotSearchList.length 表示存在下一页
     */
    hotTextDown: function () {
        var _this = this;
        if (_this.hotSearchNum < _this.hotSearchList.length) {
            _this.hotSearchNum++;
            _this.showHotSearch();
        }
        _this.hotTextFocus();
    },
    /**
     * 热搜
     * 移动到焦点上执行的事件,滚动文字
     */
    hotTextFocus: function () {
        var _this = this;
        _this.rightRecommendFocus('hotText');
    },
    /**
     * 热搜
     * 离开焦点上执行的事件,停止滚动
     */
    hotTextBlur: function () {
        var _this = this;
        _this.rightRecommendBlur('hotText');
        return;
    },
    /**
     * 热搜选框向右
     * 先判断右侧显示的数据是推荐的还是搜索的，如果是搜索的则要判断是否存在搜索结果
     */
    hotTextRight: function () {
        var _this = this;
        if (_this.showSearchResult && _this.searchResultJson.length <= 0) {
            var focusId = curFocus.FocusID;
            PAGE.changeFocus(focusId);
            // PAGE.disableFocus("hands_x0_y0_recommend0_");
        } else {
            PAGE.changeFocus("hands_x0_y0_recommend0_");
        }
    },

    /**
     * ****************************************************推荐位**************************************************************/
    /**
     * 先获取到 右边6个推荐位信息
     * ajax请求数据
     */
    creatRightRecommend: function () {
        var _this = this;
        var rightRecommendHtml = "";
        var step = 3; //一行显示几个推荐图
        var len = 6; //右侧推荐位显示几张图片，需要几个按钮
        for (var i = 0; i < len; i++) {
            rightRecommendHtml += "<div class='btn' id='hands_x0_y0_recommend" + i + "_' style='top:" + _this.recommendPsition[i].top + "px;left:" + _this.recommendPsition[i].left + "px;backgound-size:contain;background:url(./HD/images/empty.png);width:168px;height:233px;'>"; //底图
            rightRecommendHtml += "<div class='rightRecommendBorder' id='recommend" + i + "'></div>"; //光标	
            rightRecommendHtml += "<div id='freeBadge" + i + "'></div>";
            rightRecommendHtml += "<div class='recommendTxt morePonts' id='recommendTxtDiv" + i + "'><span id='recommendTxt" + i + "'></span></div>"; //文字
            rightRecommendHtml += "</div>";
            var button = {
                id: 'hands_x0_y0_recommend' + i + '_',
                enMove: false,
                clickHandler: 'javascript:search.toDetailPage("rightRecom",' + i + ')',
                right: 'hands_x0_y0_recommend' + Number(i + 1) + '_',
                left: 'hands_x0_y0_recommend' + Number(i - 1) + '_',
                up: 'hands_x0_y0_recommend' + Number(i - step) + '_',
                down: 'hands_x0_y0_recommend' + Number(i + step) + '_',
                otherFocusEvent: "javascript:search.rightRecommendFocus()",
                otherBlurEvent: "javascript:search.rightRecommendBlur()",
                focusType: 7,
                TempData: null //添加临时数据
            }
            if (i == 0) {
                //button.left = "hands_x0_y0_DMSSFList0_";
                button.leftEvent = "javascript:search.rightRecommendLeft()";
            }
            if (i == 0 || i == 1 || i == 2) {
                button.upEvent = "javascript:search.rightRecommendUp()";
            }
            if (i < step) {
                button.up = "disable";
            }
            if ((i % step) == 0) {
                //button.left = "hands_x0_y0_DMSSFList0_";
                button.leftEvent = "javascript:search.rightRecommendLeft()";
            }
            if (i == (len - 1)) {
                button.rightEvent = "javascript:search.rightRecommendDown()";
            }
            if ((i + step) >= len) {
                button.downEvent = "javascript:search.rightRecommendDown()";
            }
            buttons.push(button)
        }
        CT.$("recommend").innerHTML += rightRecommendHtml;
    },
    /**
     *  显示 右边6个推荐位图片showRecommendImg
     */
    showRightRecommend: function (data) {
        var _this = this;
        //判断眉头关键字是否存在，存在请求搜索接口,判断条件只在返回页面的第一次有效
        if (!_this.showSearchResult && _this.searchKeywords) {
            _this.showSearchResult = false;
            CT.$('userText').innerHTML = _this.searchKeywords;
            // _this.searchResultNum = _this.backSearchResultNum;
            _this.searchResult();
            // _this.backSearchResultNum = 0;
            _this.searchKeywords = '';
            return;
        }


        var __show_data = _this.showSearchResult ? _this.searchResultJson : _this.rightRecommendJson;
        var __start = (_this.searchResultSize + _this.searchResultNumOffset) * (_this.searchResultNum - 1);//计算页数开始
        if (__start >= __show_data.length) __start = 0;//超出兼容
        var showData = __show_data.slice(__start, __start + _this.searchResultSize);
        _this.clearRightRecomment();
        // if(  _this.__init != true)  _this.__init = true;    //表示数据有刷新过
        var __focus = curFocus.FocusID;
        var __focus_ok = (__focus.indexOf("hands_x0_y0_recommend") < 0);
        var len = showData.length > 6 ? 6 : showData.length;
        for (var i = 0; i < len; i++) {
            //test recommendDisplayName/cartoonCname
            var name = showData[i].contentName || showData[i].recommendDisplayName;
            if (name.length > 6) {
                CT.$("recommendTxt" + i).innerHTML = String(name).slice(0, 6) + "…";
            } else {
                CT.$("recommendTxt" + i).innerHTML = String(name);
            }
            if (showData[i].booleanFree == 0) {
                CT.addClass(CT.$("freeBadge" + i), 'freeBadge')
            } else {
                if (CT.hasClass(CT.$("freeBadge" + i), 'freeBadge')) {
                    CT.removeClass(CT.$("freeBadge" + i), 'freeBadge')
                }
            }
            CT.$("hands_x0_y0_recommend" + i + "_").style.visibility = 'visible';
            if (!__focus_ok) {
                __focus = "hands_x0_y0_recommend" + i + "_";
                __focus_ok = (curFocus.FocusID == __focus);
            }
            var coverImgUrl = AjaxConfig.defaultCoverImg;
            var coverImg = showData[i].recommendPic ? showData[i].recommendPic.picPath : showData[i].contentPic;
            if (coverImg) {
                coverImgUrl = AjaxConfig.imgUrl + coverImg;
            }
            CT.$("hands_x0_y0_recommend" + i + "_").style.background = 'url(' + coverImgUrl + ') no-repeat';
            CT.$("hands_x0_y0_recommend" + i + "_").style.backgroundSize = "contain";
            PAGE.enableFocus("hands_x0_y0_recommend" + i + "_");
            _this.curRightJson.push(showData[i]);
            //默认推荐位的上下架
            if (!_this.showSearchResult) {
                //	CT.isBooleanUp(showData[i].booleanUp,"hands_x0_y0_recommend"+i+"_","recommend");
            }
            PAGE.getFocusModel6("hands_x0_y0_recommend" + i + "_").TempData = showData[i];


            if (i + 3 >= len) {
                PAGE.focusArr["hands_x0_y0_recommend" + i + "_"].coo.down = "disable";
            }

        }
        if (showData.length < 6 && showData.length > 0) {
            PAGE.focusArr["hands_x0_y0_recommend" + (showData.length - 1) + "_"].coo.right = "disable";
        }
        //焦点处理
        if (__focus) PAGE.changeFocus(__focus);
        if (__show_data.length > 6 && __start + _this.searchResultSize < __show_data.length) {
            CT.$('downArrow').style.visibility = 'visible';
            // }
        } else {
            CT.$('downArrow').style.visibility = 'hidden';
        }
    },
    /**
     * 清除右侧6个推荐位
     */
    clearRightRecomment: function () {
        var _this = this;
        var len = 6; //右侧推荐位显示几张图片，需要几个按钮
        for (var i = 0; i < len; i++) {
            _this.curRightJson = [];
            // CT.$("recommendTxt" + i).innerHTML = "";
            CT.$("hands_x0_y0_recommend" + i + "_").style.visibility = 'hidden';
            PAGE.disableFocus("hands_x0_y0_recommend" + i + "_");
            if (i < 8) {
                PAGE.focusArr["hands_x0_y0_recommend" + i + "_"].coo.right = "hands_x0_y0_recommend" + (i + 1) + "_";
            }
            if (i + 3 < len) {
                PAGE.focusArr["hands_x0_y0_recommend" + i + "_"].coo.down = "hands_x0_y0_recommend" + (i + 3) + "_";
            }
        }
    },
    /**
     *  对搜索结果的显示，向下分页
     *  _this.showSearchResult == true 表示可以切换，右侧显示的是搜索内容
     *  如果是搜索内容切换要先 清空右侧的6个推荐位
     *  searchResultNum  searchResultJson
     */
    rightRecommendDown: function () {
        var _this = this;
        var __show_data = _this.showSearchResult ? _this.searchResultJson : _this.rightRecommendJson;
        // 条件成立 可以翻页  
        if (__show_data && __show_data.length > _this.searchResultNum * (_this.searchResultSize + _this.searchResultNumOffset) - _this.searchResultNumOffset) {
            _this.searchResultNum++;
            _this.showRightRecommend();
        }
    },
    /**
     * 右边推荐位向上事件
     */
    rightRecommendUp: function () {
        var _this = this;
        var _this = this;
        var __show_data = _this.showSearchResult ? _this.searchResultJson : _this.rightRecommendJson;
        // 条件成立 可以翻页  
        if (__show_data && _this.searchResultNum > 1) {
            _this.searchResultNum--;
            _this.showRightRecommend();
        }
    },
    /**
     * 右边推荐位左事件
     */
    rightRecommendLeft: function () {
        var _this = this;
        if (_this.hotSearchList.length > 0) {
            PAGE.changeFocus("hands_x0_y0_DMSSFList0_");
        } else {
            PAGE.changeFocus("hands_x0_y0_del_");
        }
        //判断是不是推荐数据
        if (!_this.showSearchResult && _this.searchResultNum != 1) {
            var _this_searchResultNum = _this.searchResultNum;
            //显示固定推荐数据
            _this.searchResultNum = 1;
            _this.showRightRecommend();
        }
    },
    //获取到焦点 跑马灯
    rightRecommendFocus: function (preStr) {
        var _this = this;
        try {
            var nums = curFocus.FocusID.match(/[\d]+/g);
            var num = Number(nums[nums.length - 1]);
            var showTitle = curFocus.TempData.contentName || curFocus.TempData.recommendDisplayName;
            var idPre = preStr || "recommendTxt";
            CT.$(idPre + num).innerHTML = CT.setMarquee(showTitle, 12, 4)
        } catch (e) {
        }
    },
    //失去焦点 跑马灯
    rightRecommendBlur: function (preStr) {
        var _this = this;
        var num = 1;
        try {
            num = parseInt(curFocus.FocusID.match(/[\d]+/g)[2]);
            var nums = curFocus.FocusID.match(/[\d]+/g);
            num = Number(nums[nums.length - 1]);
        } catch (e) {

        }
        var showTitle = curFocus.TempData.contentName || curFocus.TempData.recommendDisplayName;
        var idPre = preStr || "recommendTxt";
        try {
            if (CT.$("recommendTxtDiv" + num)) {
                CT.removeClass(CT.$("recommendTxtDiv" + num), 'marquee_self');
            }
        } catch (ex1) { }
        // CT.removeClass(CT.$("recommendTxtDiv" + num), 'marquee_self');
        if (showTitle && showTitle.length > 6) {
            showTitle += "";
            CT.$(idPre + num).innerHTML = showTitle.substring(0, 6) + "…";
        }
    },
    /**
     *  去详情页
     *  search.curRightJson[num] 当前选中的光标信息
     *  参数type ，type==hotText表示是中间的热搜，type==rightText 表示是右侧的推荐位
     * (_this.hotSearchNum-6+num) :_this.hotSearchNum-6是当前屏的最小值，num是当前按钮
     */
    toDetailPage: function (type, num) {
        var _this = this;
        //跳转
        PAGE.otherPageParam = "&contentId=" + _this.contentId + "&contentEName=" + basePageInfo.commonPageInfo.pageInfo.commPageEname + "&contentCName=" + basePageInfo.commonPageInfo.pageInfo.commPageCname + "&hotSearchNum=" + _this.hotSearchNum + "&curFocusId=" + curFocus.FocusID + "&searchResultNum=" + _this.searchResultNum + "&searchKeywords=" + CT.$('userText').innerHTML;
        CT.goPage();
        if (type == "hotText") {
            var number = _this.hotSearchList.length > 9 ? (_this.hotSearchNum - 9 + num) : num;
            _this.hotSearchList[number].recommendDisplayType = _this.hotSearchList[number].contentType;
            _this.hotSearchList[number].recommendDisplayValue = _this.hotSearchList[number].contentId;
            CT.toAnterRecommendUrl(_this.hotSearchList[number]);
        } else {
            //test
            _this.curRightJson[num].recommendDisplayType = _this.curRightJson[num].recommendDisplayType || _this.curRightJson[num].contentType;
            _this.curRightJson[num].recommendDisplayValue = _this.curRightJson[num].recommendDisplayValue || _this.curRightJson[num].contentId;
            //跳转之前先上传搜索记录
            interface.uploadSearchRecord({
                userid: _this.userId,
                contentType: _this.curRightJson[num].recommendDisplayType,
                contentValue: _this.curRightJson[num].recommendDisplayValue
            });
            //跳转
            CT.toAnterRecommendUrl(_this.curRightJson[num]);
        }
    }

    //end
}
search.init();


//页面返回
function backFunc() {
    CT.backPage();
}