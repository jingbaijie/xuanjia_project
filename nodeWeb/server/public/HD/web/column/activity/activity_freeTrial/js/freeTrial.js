//15天免费体验兑换码
var actiExchangeUrl = AjaxConfig.origin + "/webapi/voucher/verify";
var actiUserId = orderJs.getStbId();
//Column构造函数
function Column(){
    /**
     * 切换焦点
     *
     * @param focusName 焦点名称
     */
    this.changeFocus = function(focusName){
        if(focusName.indexOf("hands") != -1 && document.getElementById(focusName)){
            PAGE.changeFocus(focusName);
        }
    };
    /**
     * 焦点切换时发生的事件,将宽高与定位赋值给animationFocus,并切换animationFocus背景图
     *
     * @param imgUrl 焦点选中图片路径
     */
    this.move = function(imgUrl){
        if(curFocus.FocusID == "hands_x0_y0_inputFocus2_"){
            isOnFocus = true;
        }
        var animationFocus = document.getElementById("animationFocus");
        var arrivalFocus = document.getElementById(curFocus.FocusID);
        animationFocus.style.backgroundImage = 'url("'+ imgUrl +'")';
		animationFocus.style.backgroundRepeat = "no-repeat";
        animationFocus.style.backgroundSize = arrivalFocus.style.width + ' ' + arrivalFocus.style.height;
        animationFocus.style.width = arrivalFocus.style.width;
        animationFocus.style.height = arrivalFocus.style.height;
        animationFocus.style.top = arrivalFocus.style.top;
        animationFocus.style.left = arrivalFocus.style.left;
		//animationFocus.style.backgroundSize = "100%"
    };
    /**
     *判断当前DOM（objDom）元素是否拥有cls类
     *
     * objDom: 查询元素
     * cls类名
     * */
    this.hasClass = function(objDom,cls){
        return objDom.className.match(new RegExp('(\\s+|^)' + cls + '(\\s+|$)'));
    };
    /**
     *为当前DOM（objDom）元素添加cls类
     *
     * objDom: 查询元素
     * cls类名
     * */
    this.addClass = function(objDom,cls){
        if(!this.hasClass(objDom, cls)) objDom.className += " " + cls;
    };
    /**
     *为当前DOM（objDom）元素移除cls类
     *
     * objDom: 查询元素
     * cls类名
     * */
    this.removeClass = function(objDom,cls){
        if(this.hasClass(objDom, cls)) objDom.className = objDom.className.replace(new RegExp('(\\s+|^)' + cls + '(\\s+|$)'), '');
    };
}
Column.prototype = {
    /**
     * 提示弹框图
     */
    tipsImg: document.getElementById("tipsImg"),
    /**
     * 提示弹框外围DIV,用于添加CSS
     */
    tipsDiv: document.getElementById("tipsDiv"),
    /**
     * 输入框图
     */
    inputImg: document.getElementById("inputImg"),
    /**
     * 输入框外围DIV,用于添加CSS
     */
    inputDiv: document.getElementById("inputDiv"),
    /**
     * 提示弹框显示,增加动画CSS,切换焦点
     *
     * @param focusName 切换的焦点名
     * @param imgUrl  提示弹框图路径
     */
    showConfirm: function(focusName,imgUrl){
        this.preFocusName = curFocus.FocusID;
        this.tipsImg.src = imgUrl;
        this.tipsImg.style.visibility = "visible";

		//如果出现动画出现卡顿,则将这两行代码注释掉
        //this.removeClass(this.tipsDiv,"fadeOutRight");
        //this.addClass(this.tipsDiv,"fadeInLeft");
		//如果出现动画出现卡顿,则将这两行代码注释掉

        this.changeFocus(focusName);
    },
    /**
     * 隐藏提示弹框,增加动画CSS,清除已输入的兑换码,切换回出现提示弹框前的一个焦点
     */
    hideConfirm: function(){
        var _this = this;
		document.getElementById("exChangeText").innerHTML = "";
        exChangeNum = "";

		//如果隐藏动画出现卡顿,则将这两行代码注释掉,并将下方setTimeout中的执行方法提出来,不做延时
        //this.removeClass(this.tipsDiv,"fadeInLeft");
        //this.addClass(this.tipsDiv,"fadeOutRight");
		//如果隐藏动画出现卡顿,则将这两行代码注释掉,并将下方setTimeout中的执行方法提出来,不做延时

        //setTimeout(function(){
            _this.tipsImg.style.visibility = "hidden";
        //},500);
        this.changeFocus(this.preFocusName);
    },
    /**
     * 显示输入弹框,增加动画CSS,切换焦点至输入框焦点
     */
    showInput: function(){
        this.beforeInputFocus = curFocus.FocusID;
        this.inputImg.style.visibility = "visible";

		//如果出现动画出现卡顿,则将这两行代码注释掉
        //this.removeClass(this.inputDiv,"fadeOutRight");
        //this.addClass(this.inputDiv,"fadeInLeft");
		//如果出现动画出现卡顿,则将这两行代码注释掉

        this.changeFocus("hands_x0_y0_inputFocus2_");
		isClick = true;
    },
    /**
     * 隐藏输入框,增加动画CSS,切换焦点至出现输入框前的焦点
     */
    hideInput: function(){
        var _this = this;
		document.getElementById("exChangeText").innerHTML = "";
        exChangeNum = "";
		//如果隐藏动画出现卡顿,则将这两行代码注释掉,并将下方setTimeout中的执行方法提出来,不做延时
        //this.removeClass(this.inputDiv,"fadeInLeft");
        //this.addClass(this.inputDiv,"fadeOutRight");
		//如果隐藏动画出现卡顿,则将这两行代码注释掉,并将下方setTimeout中的执行方法提出来,不做延时

        //setTimeout(function(){
            _this.inputImg.style.visibility = "hidden";
        //},500);
        this.changeFocus(this.beforeInputFocus);
    },
    /**
     * 鉴别输入的验证码
     */
    judgeExchange: function(){
		var _this = this;
		//输入的验证码值(字符串类型)
        var exChangeNum = Trim(document.getElementById("exChangeText").innerHTML,"g");
        if(exChangeNum.length == 16 || exChangeNum.length == 16){
            ajax.init({
                url:actiExchangeUrl + "?userId="+actiUserId+"&cardNo="+exChangeNum+"&timestamp=" + Math.round(new Date().getTime() / 1000),
                method:"get",
                params:{
                    // "userId": actiUserId,
                    // "cardNo": exChangeNum
                },
                // async:true,
                // ContentType:"application/x-www-form-urlencoded",
                async: false,
                ContentType: "json",
                success:function(data){
					if(isClick){
						isClick = false;
						if(data){
							//绑定成功
							if(data.errorCode == "1000"){
								_this.showConfirm("hands_x0_y0_successFocus_","./images/getSuccessXLSE.png");
							//用户已使用过验证码:001
							}else if(data.errorCode == "1022"){
								_this.showConfirm("hands_x0_y0_confirmFocus_","./images/haveGetted.png");
							//验证码已被使用:002
							}else if(data.errorCode == "1023" || data.errorCode == "1024" || data.errorCode == "1021"){
								_this.showConfirm("hands_x0_y0_confirmFocus_","./images/beUsed.png");
							//绑定失败,提示验证码错误
							}else{
								_this.showConfirm("hands_x0_y0_inputConFocus_","./images/inputFalse.png");
							}
							isClick = true;
						}else{
							//返回数据有误,提示验证码错误
							_this.showConfirm("hands_x0_y0_inputConFocus_","./images/inputFalse.png");
							isClick = true;
						}
					}

                },
                fail:function(status){
                    //接口请求失败,提示验证码错误
                    _this.showConfirm("hands_x0_y0_inputConFocus_","./images/inputFalse.png");
                }
            });
        }else{
            //验证码不符合规范,提示验证码错误
            this.showConfirm("hands_x0_y0_inputConFocus_","./images/inputFalse.png");
        }
    },
    /**
     * 重置验证码
     */
    reSetExchange: function(){
		document.getElementById("exChangeText").innerHTML = "";
        exChangeNum = "";
        this.hideConfirm();
    }
};