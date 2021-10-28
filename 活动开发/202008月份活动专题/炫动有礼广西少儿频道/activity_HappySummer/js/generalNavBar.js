/*

通用眉头生成方法调用示例：
    navBarObj.(initObj);
    参数解析：initObj ： {
                          logo:logoObj || null,//非必传，如果传，参数值为null（按默认信息生成）或者自定义对象；不传则不生成LOGO
                          navInfo: "mid",//非必传，具体详解看 下面 【2】
                        }

                        如果不需要生成某一项，则不需在initObj中声名对应键名；如不声明 logo属性，则不生成LOGO。

                        对应的 logoObj、navMObj和navRObj具体描述如下。



【1】 logo生成参数 logoObj：
    参数： logoObj == null //按默认配置生成LOGO
    参数： logoObj ： {
                    left: number,//生成logo的X轴坐标，非必传
                    top: number,//生成logo的Y轴坐标，非必传
                    width: number//生成logo的宽（不用高，防止图片变形），非必传
                }

   过滤用户调用传参后的终极传参格式(此处说明，调用不需理会)：
                    {
                        picCname: "首页焦点图",
                        picH: "67",
                        picPath: AjaxConfig.projectUrl +"HD/images/LOGO.png",
                        picW: "184",
                        left: number,//生成logo的X轴坐标，非必传
                        top: number,//生成logo的Y轴坐标，非必传
                        width: number//生成logo的宽（不用高，防止图片变形），非必传
                    }

【2】 生成中部,右部导航图标参数 navInfo 属性 ：
    参数： navInfo == string类型 和 object类型

    （1） string 类型：
        1.string类型按照默认配置生成。
        2.参数值：
            1） "mid" : 生成中部导航图标及按钮。
            2） "right" : 生成右部导航图及按钮。
            3） "below" : 生成右部导航图及按钮。
            3） "midAndRight" : 生成中部和右部导航栏和按钮。
            3） "midAndBelow" : 生成中部和下部导航栏和按钮。

    （2） object 类型：
                navInfo : {
                    navPrefix : "navRight",//生成的导航区域 前缀区分，如 navMid（中部导航图标），navRight（右部导航图标） ！！！必传
                    navSelectedImgName : "",//当前导航分类被选中但光标离开分类按钮时，表示当前分类选中状态的图----的Id前缀  ！！！建议不传
                    left : 960,//中部导航图第一个图标生成的X轴位置  ！非必传，有默认
                    top : 60,//中部导航图所有图标生成的Y轴位置 ！非必传，有默认
                    step : -20//中部导航图所有图标生成的间隔  ！非必传，有默认
                    direction : 'row'//'row'或'col'中部导航图所有图标生成的方向  ！非必传，有默认，默认横向生成
                }

注意事项 ！！！重要！！！ ：
    (1)如果 传自定义参数（navInfo属性为 对象）:然后中部和右部导航栏都要生成的话，需要先把 navBarObj.isAllNav 改成 true。然后先生成中部(navPrefix : "navMid")，再生成右部(navPrefix : "navRight")
    (2)自定义导航按钮相关响应事件（根据自己需求在自己页面重新定义，覆盖原来的默认实现）：
        2.1）导航栏按钮的方向键键应答为：navBarObj.navBtnArrowEvent : function (keyDirection,keyInfo,keyDataName,keyIndex)==>"down"{触发方向}, keyInfo{生成当前按钮的初始化对象，就是上面的“navInfo”或者默认的配置},keyDataName{"生成按钮的数据来源(recommend_X)存放属性名： 按钮前缀+Data"}， keyIndex{"当前nav按钮Id"}); 具体执行什么可自定义该函数内容。
        2.2）导航栏按钮的OK键键应答为：navBarObj.navBtnClickEvent(keyInfo,keyDataName,keyIndex)；//参数解析同上
        2.3）导航栏按钮的获得焦点应答为：navBarObj.navBtnBlurEvent(keyInfo,keyDataName,keyIndex)；//参数解析同上
        2.4）导航栏按钮的失去焦点应答为：navBarObj.navBtnFocusEvent(keyInfo,keyDataName,keyIndex)；//参数解析同上
    (3)再初始化页面焦点之前，如果生成了眉头导航栏，需要把 相应的btn放到buttons数组里面。
            即合并 buttons 和 navBarObj.navBtnArr:
                        buttons.push.aplly(buttons,navBarObj.navBtnArr);
                        或
                        Array.prototype.push.apply(buttons,navBarObj.navBtnArr)


    initObj.callBack : 创建完眉头的回调事件。
*
*
*
* */
var navBarObj = {
	//盛放页面通用眉头数据的变量  每一个页面需要有这个变量
    commonPageInfo : null,
	//是否同时生成中部和右部导航栏。 ---焦点逻辑
    isAllNav : false,
	//生成中部导航栏的长度。 ---焦点逻辑
    midNavLength : 0,
    init : function (initObj) {
        var _this = this;
        _this.commonPageInfo = AjaxConfig.commonPageInfo;
        //获取用户定制眉头
        interface.getCurUserNavItem({userId : xjDataLog.getUserId()},function (dataResult) {
            //过滤家长控制后的眉头
            //不能下架的眉头rankID（1：首页，7：免费专区，8：专题合集）
            var canNotDownNavStr = '1_7_8';
            if (dataResult.data && dataResult.data.length > 0) {
                for (var i = 0; i < dataResult.data.length; i++) {
                    for (var j = 0; j < _this.commonPageInfo.data.pageInfo.commonPageInfo.recommend_2.length; j++) {
                        var tempRankId = _this.commonPageInfo.data.pageInfo.commonPageInfo.recommend_2[j].rankId + '';
                        if (tempRankId == dataResult.data[i] && canNotDownNavStr.indexOf(tempRankId) == -1) {
                            _this.commonPageInfo.data.pageInfo.commonPageInfo.recommend_2.splice(j,1);
                        }
                    }
                }
            }
            //判断是否生成logo
            if("logo" in initObj){
                var logoObj = _this.commonPageInfo.data.pageInfo.commonPageInfo.recommend_1[0].recommendPic || {};
                if(initObj.logo){
                    for(var keyName in initObj.logo){
                        switch (keyName){
                            case 'left':
                                logoObj.left = initObj.logo['left']-100 + 'px';
                                break;
                            case 'top':
                                logoObj.top = initObj.logo['top'] + 'px';
                                break;
                            case 'width':
                                logoObj.width = initObj.logo['width'] + 'px';
                                break;
                            default:
                                break;
                        }
                    }
                }
                _this.setLogo(logoObj);
            }
            //判断是否生成 导航图标
            //判断传入导航生成信息的数据类型
            var whereNav = CT.dataType(initObj.navInfo);
            if(whereNav == "string"){
                switch (initObj.navInfo){
                    case 'mid':
                        _this.setNavPre("mid",initObj);
                        break;
                    case 'right':
                        _this.setNavPre("right",initObj);
                        break;
                    case 'below':
                        _this.setNavPre("below",initObj);
                        break;
                    case 'midAndRight':
                        _this.isAllNav = true;//声名同时生成中部和右部导航条
                        _this.setNavPre("mid",initObj);
                        _this.setNavPre("right",initObj);
                        break;
                    case 'midAndBelow':
                        _this.isAllNav = true;//声名同时生成中部和右部导航条
                        _this.setNavPre("mid",initObj);
                        _this.setNavPre("below",initObj);
                        break;
                    default:
                        break;
                }
            }else if(whereNav == "object"){
                _this.setNavPre("object",initObj);
            }
            initObj.callBack && initObj.callBack();
        });
    },
    //生成logo
    setLogo : function(logoObj) {
        var logoObj = logoObj || {};
        var logoEle = document.getElementById('logoImg');
        if(logoEle){
            //已有logo，赋值src
            logoEle.src = logoObj.picPath || '本地logo图路径';
        }else{
            //创建logo
            logoEle = document.createElement('img');
            logoEle.id = "logoImg";
            logoEle.src = AjaxConfig.imgUrl+logoObj.picPath || '本地logo图路径';
            logoEle.style.width = logoObj.picW + "px";
            logoEle.style.height = logoObj.picH + "px";
            logoEle.style.position = "absolute";
            logoEle.style.left = logoObj.left || "48px";
            logoEle.style.top = logoObj.top || "100px";
            if (logoObj.width) {
                logoEle.style.width = logoObj.width;
            }
            //插入logo
            document.getElementsByTagName('body')[0].appendChild(logoEle);
        }
    },
    //生成 区域（中部或右部）导航图标前，数据处理及调用
    setNavPre : function(whereNav,initObj) {
        //如果没有指明生成哪部分导航图标，则不执行。
        if(!whereNav){
            return null;
        }
        var _this = this;
        //生成图标的数据数组，初始化对象为右部导航条数据来源
        var navArr = _this.commonPageInfo.data.pageInfo.commonPageInfo.recommend_3  || [];
        //生成图标的位置参数对象，初始化对象为右部导航条
        var navPosObj = {
            navPrefix : "navRight",//生成的导航区域 前缀区分，如 navMid（中部导航图标），navRight（右部导航图标）
            navSelectedImgName : "",//当前导航分类被选中但光标离开分类按钮时，表示当前分类选中状态的图----的Id前缀
            left : 1040,//中部导航图第一个图标生成的X轴位置
            top : 60,//中部导航图所有图标生成的Y轴位置
            step : -10,//中部导航图所有图标生成的间隔
            direction : 'row',//导航图所有图标生成的方向
        };
        if(whereNav == "mid"){
            navArr = _this.commonPageInfo.data.pageInfo.commonPageInfo.recommend_2 || [];
            _this.midNavLength = navArr.length;
            //如果生成中部导航条，则需要改变相关 ID前缀 和 申明是否有选中状态图
            navPosObj.navPrefix = "navMid";
            navPosObj.navSelectedImgName = "navMidSelectedImg";
            navPosObj.left = 220;
            navPosObj.top = 70;
            navPosObj.step = 15;
            navPosObj.direction = 'row';
        }   
        if(whereNav == "below"){
            navArr = _this.commonPageInfo.data.pageInfo.commonPageInfo.recommend_3 || [];
            _this.midNavLength = navArr.length;
            //如果生成中部导航条，则需要改变相关 ID前缀 和 申明是否有选中状态图
            navPosObj.navPrefix = "navBelow";
            navPosObj.navSelectedImgName = "navBelowSelectedImg";
            navPosObj.left = 50;
			navPosObj.top = 30;
            navPosObj.step = 15;
            navPosObj.direction = 'col';
        }
        if(whereNav == "object"){
            for(var keyName in initObj.navInfo){
                switch (keyName){
                    case 'left':
                        navPosObj.left = Number(initObj.navInfo['left']);
                        break;
                    case 'top':
                        navPosObj.top = Number(initObj.navInfo['top']);
                        break;
                    case 'step':
                        navPosObj.step = Number(initObj.navInfo['step']);
                        break;
                    case 'navPrefix':
                        navPosObj.navPrefix = String(initObj.navInfo['navPrefix']);
                        break;
                    case 'navSelectedImgName':
                        navPosObj.navSelectedImgName = String(initObj.navInfo['navSelectedImgName']);
                        break;
                    default:
                        navPosObj.keyName = initObj.navInfo[keyName];
                        break;
                }
            }
        }
        _this.setNav(navArr,navPosObj);
    },
    //生成 区域（中部或右部）导航图标
    setNav : function(navMidArr,navMidPosObj) {
        var _this = this;
        var navMidArr = navMidArr || [];
        _this[navMidPosObj.navPrefix + 'Data'] = navMidArr;
        var navMidDiv = document.getElementById(navMidPosObj.navWrapperName + 'Div');
        //防止多次创建导航条，当然，如果页面已经存在相同的id，会导致创建导航条失败
        if(!navMidDiv){
            //创建 图标元素容器
            navMidDiv = document.createElement('div');
            navMidDiv.id = navMidPosObj.navPrefix + 'Div';
            navMidDiv.style.position = 'absolute';
            navMidDiv.style.left = '0px';
            navMidDiv.style.top = '0px';
            //创建 导航图标元素
            for(var i = 0; i < navMidArr.length; i++){
                if(navMidPosObj.navSelectedImgName){
                    //navMidPosObj.navSelectedImgName
                    //创建选中状态图
                    var navMidSelectedImg = document.createElement('img');
                    navMidSelectedImg.id = navMidPosObj.navSelectedImgName + i;
                    navMidSelectedImg.src = AjaxConfig.imgUrl + (navMidArr[i].recommendLabelpic?navMidArr[i].recommendLabelpic.picPath : navMidArr[i].recommendPic.picPath);
                    navMidSelectedImg.style.width = navMidArr[i].recommendPic.picW + 'px';
                    navMidSelectedImg.style.height = navMidArr[i].recommendPic.picH + 'px';
                    navMidSelectedImg.style.position = "absolute";
                    navMidSelectedImg.style.visibility = "hidden";
                    if (navMidArr[i].commpageId == Number(CT.requestValue("contentId"))) {
                        navMidSelectedImg.style.visibility = "visible";
                        _this.showNavSelectedId = i;
                    }
                    if (navMidPosObj.direction == 'col') {
                        //纵向生成元素
                        navMidSelectedImg.style.top = navMidPosObj.top + i * (Number(navMidPosObj.step) + Number(navMidArr[i].recommendPic.picH)) + 'px';
                        navMidSelectedImg.style.left = navMidPosObj.left + 'px';
                    }else{
                        //横向生成元素
                        navMidSelectedImg.style.top = navMidPosObj.top + 'px';
                        navMidSelectedImg.style.left = navMidPosObj.left + i * (Number(navMidPosObj.step) + Number(navMidArr[i].recommendPic.picW)) + 'px';
                    }
				}
				//创建展示图
				var navMidShowImg = document.createElement('img');
				navMidShowImg.id = navMidPosObj.navPrefix + "Focus" + i + 'Img';
				navMidShowImg.src = AjaxConfig.imgUrl + navMidArr[i].recommendPic.picPath;
				navMidShowImg.style.width = navMidArr[i].recommendPic.picW + 'px';
				navMidShowImg.style.height = navMidArr[i].recommendPic.picH + 'px';
				navMidShowImg.style.position = "absolute";
                if (navMidPosObj.direction == 'col') {
                    //纵向生成元素
                    navMidShowImg.style.top = navMidPosObj.top + i * (Number(navMidPosObj.step) + Number(navMidArr[i].recommendPic.picH)) + 'px';
                    navMidShowImg.style.left = navMidPosObj.left + 'px';
                }else{
                    //横向生成元素
                    navMidShowImg.style.top = navMidPosObj.top + 'px';
                    navMidShowImg.style.left = navMidPosObj.left + i * (Number(navMidPosObj.step) + Number(navMidArr[i].recommendPic.picW)) + 'px';
                }
				//创建光标DIV
				var navMidFocusDiv = document.createElement('div');
				navMidFocusDiv.id = "hands_x0_y0_" + navMidPosObj.navPrefix + "Focus" + i+"_";
				navMidFocusDiv.style.width = navMidArr[i].recommendFocuspic.picW + 'px';
				navMidFocusDiv.style.height = navMidArr[i].recommendFocuspic.picH + 'px';
				navMidFocusDiv.style.position = "absolute";
                if (navMidPosObj.direction == 'col') {
                    //纵向生成元素
                    navMidFocusDiv.style.top = navMidPosObj.top + i * (Number(navMidPosObj.step) + Number(navMidArr[i].recommendFocuspic.picH)) + 'px';
                    navMidFocusDiv.style.left = navMidPosObj.left + 'px';
                }else{
                    //横向生成元素
                    navMidFocusDiv.style.top = navMidPosObj.top + 'px';
                    navMidFocusDiv.style.left = navMidPosObj.left + i * (Number(navMidPosObj.step) + Number(navMidArr[i].recommendFocuspic.picW)) + 'px';
                }
				//创建光标IMG
				var navMidFocusImg = document.createElement('img');
				navMidFocusImg.id = navMidPosObj.navPrefix + "Focus" + i;
				navMidFocusImg.src = AjaxConfig.imgUrl+navMidArr[i].recommendFocuspic.picPath;
				navMidFocusImg.style.width = navMidArr[i].recommendFocuspic.picW + 'px';
				navMidFocusImg.style.height = navMidArr[i].recommendFocuspic.picH + 'px';
                navMidFocusImg.style.visibility = "hidden";
				if(navMidPosObj.navSelectedImgName){
					navMidDiv.appendChild(navMidSelectedImg);
				}
				navMidDiv.appendChild(navMidShowImg);
				navMidFocusDiv.appendChild(navMidFocusImg);
				navMidDiv.appendChild(navMidFocusDiv);
                //创建buttons
				//先判断isAutoFindFocus，自动选找焦点页面true，其他页面fasle（可以不用定义）AjaxConfig.isAutoFindFocus
				if(false){
				    
				}else{
                    /*
                    */
					var btnObj = {
						id:"hands_x0_y0_" + navMidPosObj.navPrefix + "Focus" + i+"_",
                        clickHandler:'javascript:navBarObj.navBtnClickEvent(' + CT.jsonToString(navMidPosObj) + ',"' + (navMidPosObj.navPrefix + 'Data') + '",' + i + ')',
						leftEvent:'javascript:navBarObj.navBtnArrowEvent("left",' + CT.jsonToString(navMidPosObj) + ',"' + (navMidPosObj.navPrefix + 'Data') + '",' + i + ')',
						rightEvent:'javascript:navBarObj.navBtnArrowEvent("right",' + CT.jsonToString(navMidPosObj) + ',"' + (navMidPosObj.navPrefix + 'Data') + '",' + i + ')',
						downEvent:'javascript:navBarObj.navBtnArrowEvent("down",' + CT.jsonToString(navMidPosObj) + ',"' + (navMidPosObj.navPrefix + 'Data') + '",' + i + ')',
						otherBlurEvent:'javascript:navBarObj.navBtnBlurEvent(' + CT.jsonToString(navMidPosObj) + ',"' + (navMidPosObj.navPrefix + 'Data') + '",' + i + ')',
                        otherFocusEvent:'javascript:navBarObj.navBtnFocusEvent(' + CT.jsonToString(navMidPosObj) + ',"' + (navMidPosObj.navPrefix + 'Data') + '",' + i + ')',
                        TempData : navMidArr[i],
						focusType: 7
                    }
                    if(navMidPosObj.navPrefix =='navMid'){
                        btnObj.up="hands_x0_y0_addHeaderFocus0_";
                    }
                    if(navMidPosObj.navPrefix =='navBelow' && i==0){
                        btnObj.up="hands_x0_y0_navMidFocus1_";
                    }
					if(i == 0){
						if(_this.isAllNav && navMidPosObj.navPrefix == "navRight"){
							btnObj.left = "hands_x0_y0_navMidFocus" + (_this.midNavLength - 1)+"_";
							btnObj.leftEvent = '';
						}
					}
					if(i == navMidArr.length-1){
						if(_this.isAllNav && navMidPosObj.navPrefix == "navMid"){
							btnObj.right = "hands_x0_y0_navRightFocus0_";
						}else {
							btnObj.right = "disable";
						}
                    }
				}
                buttons.push(btnObj);
            }
            if (navMidDiv.id.toLowerCase().indexOf('below') > -1) {
                try {
                    CT.$('firstScreenWrapper') && CT.$('firstScreenWrapper').appendChild(navMidDiv);
                } catch (error) {
                    
                }
            } else {
                document.getElementsByTagName('body')[0].appendChild(navMidDiv);
            }
        }
    },
    /**
    * nav按钮点击函数
    * @param params 
    *   keyInfo:生成当前按钮的初始化信息。
    *   keyIndex：生成当前按钮的序号。
    * 使用方式：如有特殊响应事件需求，在自己页面重新定义函数：navBarObj.navBtnClickEvent : function (keyInfo,keyDataName,keyIndex) {...};
    */
    navBtnClickEvent : function (keyInfo,keyDataName,keyIndex) {
        var _this = navBarObj;
        //此函数内容根据页面实际需求，在引用页面定义覆盖，以下为默认逻辑
    },
    /**
    * nav导航按钮方向键触发事件
    * @param params 
    *   keyDirection：触发的方向键方向。
    *   keyInfo:生成当前按钮的初始化信息。
    *   keyDataName：生成按钮的数据来源(recommend_X)存放属性名： 按钮前缀+Data
    *   keyIndex：生成当前按钮的序号。
    * 使用方式：如有特殊响应事件需求，在自己页面重新定义函数：navBarObj.navBtnArrowEvent : function (keyDirection,keyInfo,keyDataName,keyIndex) {...};
    */
    navBtnArrowEvent : function(keyDirection,keyInfo,keyDataName,keyIndex){
        var _this = navBarObj;
        var curKeyDateArr = _this[keyDataName] || [];
        //以下代码根据自己页面实际需求
		switch (keyDirection){
            case 'left': 
                //导航栏按钮向左事件
                if (keyInfo.navPrefix == 'navMid' && keyIndex == 0 || keyInfo.navPrefix == 'navBelow') {
                    //不做响应
                }else{
                    PAGE.changeFocus("hands_x0_y0_" + keyInfo.navPrefix + "Focus" + (i-1)+"_");
                }
                break;
            case 'right': 
                //导航栏按钮向右事件
                if (keyIndex == curKeyDateArr.length - 1) {
                    //向右无响应
                }else{
                    PAGE.changeFocus("hands_x0_y0_" + keyInfo.navPrefix + "Focus" + (i+1)+"_");
                }
                break;
            case 'up': 
                //导航栏按钮向上事件
                //啥也不做

                break;
            case 'down': 
                //导航栏按钮向下事件
                break;
            default :
                break;
		}
    },
    /**
    * nav导航按钮失去焦点触发事件
    * @param params 
    *   keyInfo:生成当前按钮的初始化信息。
    *   keyDataName：生成按钮的数据来源(recommend_X)存放属性名： 按钮前缀+Data
    *   keyIndex：生成当前按钮的序号。
    * 使用方式：如有特殊响应事件需求，在自己页面重新定义函数：navBarObj.navBtnBlurEvent : function (keyInfo,keyDataName,keyIndex) {...};
    */
   navBtnBlurEvent : function(keyInfo,keyDataName,keyIndex){
    var _this = navBarObj;
    var curKeyDateArr = _this[keyDataName] || [];
        //以下代码根据自己页面实际需求
    },
    /**
    * nav导航按钮获得焦点触发事件
    * @param params 
    *   keyInfo:生成当前按钮的初始化信息。
    *   keyDataName：生成按钮的数据来源(recommend_X)存放属性名： 按钮前缀+Data
    *   keyIndex：生成当前按钮的序号。
    * 使用方式：如有特殊响应事件需求，在自己页面重新定义函数：navBarObj.navBtnFocusEvent : function (keyInfo,keyDataName,keyIndex) {...};
    */
   navBtnFocusEvent : function(keyInfo,keyDataName,keyIndex){
    var _this = navBarObj;
    var curKeyDateArr = _this[keyDataName] || [];
        //以下代码根据自己页面实际需求
    },
    //记录nav选中的序号
    showNavSelectedId :0
}
