
/**
 *  @namespace button 可配置的参数
 * @type {{id: string, name: string, enFocus: boolean, enable: boolean, focusImage: string, clickHandler: string, left: string, leftOther: string, right: string, rightOther: string, up: string, upOther: string, down: string, downOther: string, other: string, gbWidth: number, gbHeight: number, focusType: number, TempData: null, upEvent: string, rightEvent: string, downEvent: string, leftEvent: string, otherFocusEvent: string, otherBlurEvent: string}}
 * @description
 *  1、button描述<br>
 *      焦点向下按钮优先级<br>
 *      ***以向下事件为例 downEvent （焦点向下事件）> down(向下焦点) > downother(向下焦点被禁，进入这个焦点) > other(前两个焦点都被禁用，进入该焦点) > 进入自动获取焦点模式(以上都没有，enMove 为 true ,)
 *
 *
 *   <br>2、PAGE.focusArr<br>
 *       获取焦点dom类数组
 *       <br>PAGE.focusArr[焦点Id].coo   焦点坐标信息，可用来改变焦点方向及获取焦点的必要信息
 *       <br>PAGE.focusArr[焦点Id].focusmodel   获取焦点模型，里面包含焦点的获焦事件（defaultFocus），失焦事件（defaultBlur），存储的临时数据（TempData）等等
 *   <br>3、PAGE.redirect(URL)
 *   <br>   跳转页面方法
 * <br> 4、 PAGE.changeNum("1")
 *    <br>  页面想使用数字键值方法可在页面重写
 *    <br>  PAGE.changeNum = function(num){
 *     <br>     CT.writeInfo(num)
 *    <br>  }
 *     <br>
 *     5、 PAGE.enableFocus("hands_x0_y0_content0_"); 开启单个光标
 *     <br> var arr = ["hands_x0_y0_content0_","hands_x0_y0_content1_","hands_x0_y0_content3_"];
 *     <br> PAGE.enableFocus(arr);//开启多个光标
 *      <br>
 *      6、 PAGE.disableFocus("hands_x0_y0_content0_"); 禁掉单个光标
 *     <br> var arr = ["hands_x0_y0_content0_","hands_x0_y0_content1_","hands_x0_y0_content3_"];
 *      <br>PAGE.disableFocus(arr);//禁掉多个光标
 *
 *
 */


var btn = {
    /**
     * model id
     */
    id: '',
    /**
     * 按钮描述
     */
    name: '',
    /**
     * 是否开启焦点功能,默认开启
     */
    enFocus: true,
    /**
     * 是否开启ok确认事件，默认开启
     */
    enable: true,
    /**
     * 是否开启光标自动查询下一目标功能
     */
    enMove: true,
    /**
     * 是否 接受 光标自动查询下一目标功能获焦
     */
    canEnMove: true,
    /**
     * 切换新图片地址
     */
    focusImage: '',
    /**
     * 确定键执行事件方法或URL
     */
    clickHandler: '',
    /**
     * 方向左model id
     */
    left: '',
    /**
     * 方向左其他按钮id
     */
    leftOther: '',
    /**
     * 方向右model id
     */
    right: '',
    /**
     * 方向右其他按钮id
     */
    rightOther: '',
    /**
     * 方向上model id
     */
    up: '',
    /**
     * 方向上其他按钮id
     */
    upOther: '',
    /**
     * 方向下model id
     */
    down: '',
    /**
     * 方向右其他按钮id
     */
    downOther: '',
    /**
     * 其他方向
     */
    other: '',
    /**
     *  光标宽
     */
    gbWidth: 0,
    /**
     * 光标高
     */
    gbHeight: 0,
    /**
     * 切换类型
     */
    focusType: 6,
    /**
     *  焦点上的临时数据
     */
    TempData: null,
    /**
     *  焦点上坑位埋点参数
     */
    recommendTrackName: null,
    /**
     * 方向上执行事件
     */
    upEvent: '',
    /**
     * 方向右执行事件
     */
    rightEvent: '',
    /**
     * 方向下执行事件
     */
    downEvent: '',
    /**
     * 方向左执行事件
     */
    leftEvent: '',
    /**
     * 移动到焦点上时，执行的事件
     */
    otherFocusEvent: '',
    /**
     * 失去焦点时，执行的事件
     */
    otherBlurEvent: '',
    /**
     * 当前焦点返回键
     */
    curFocusBackEvent: "",
    /**
     * 对应focusType 类型
     *  focusType = 4;   焦点旋转 360度
     *  focusType = 5;   焦点显示隐藏动画
     *  focusType = 6    焦点及图片变大
     *  focusType = 7    焦点正常
     *  focusType = 8    焦点及图片变大缩小动画
     *  focusType = 9    焦点图显示，展示图隐藏
     */
    // focusType: 8,

};
/**
 *  @namespace 页面buttons 数组
 * @type {Array}
 * @example
 *  buttons.push({
 *      clickHandler: "javascript:searchFunObj.delText()",
        down: "",
        downEvent: "javascript:searchFunObj.downBtnInit()",
        focusType: 7,
        id: "hands_x0_y0_del_",
        left: "disable",
        right: "disable",
        rightEvent: "javascript:searchFunObj.rightBtnInit()",
        up: "hands_x0_y0_navFocus0_",
 *  })
 */
var buttons = [];


/**
 *  @namespace PAGE 作用域
 * @type {{focusArr: Array, focusIDArr: Array, gbInterval: null, divs: null, model: null, coo: null, isAlert: boolean, alertTip: PAGE.alertTip, $: PAGE.$, isEmpty: PAGE.isEmpty, hasOwnProperty: PAGE.hasOwnProperty, focusInit: PAGE.focusInit, focusInitDivDom: PAGE.focusInitDivDom, getCoo: PAGE.getCoo, getDomInfo: PAGE.getDomInfo, getBtnSrc: PAGE.getBtnSrc, FocusModel: PAGE.FocusModel, getModelByFocusId: PAGE.getModelByFocusId, getFocusModel6: PAGE.getFocusModel6, changeFocus: PAGE.changeFocus, directFocusObj: PAGE.directFocusObj, getDomPosi: PAGE.getDomPosi, distanceCALL: PAGE.distanceCALL, ProximityPrinciple: PAGE.ProximityPrinciple, exeCode: PAGE.exeCode, redirect: PAGE.redirect, focusHand: PAGE.focusHand, changeNum: PAGE.changeNum, keyCode: PAGE.keyCode}}
 */

var PAGE = {
    /**
     * 焦点显示样式显示样式
     * @example
     *
     * 对应focusType 类型
     *  focusType = 4;   焦点旋转 360度
     *  focusType = 5;   焦点显示隐藏动画
     *  focusType = 6    焦点及图片变大
     *  focusType = 7    焦点正常
     *  focusType = 8    焦点及图片变大缩小动画
     *  focusType = 9    焦点图显示，展示图隐藏
     *   {
        rotate360 : "rotate360",//旋转360度
        fadeIn : "focusFadeIn",//显示隐藏,
        sacleBig : "sacleBig",//变大
        sacleBigToSmall : "sacleBigToSmall",//变大变小切换  focusType = 8
    },
     */
    styleCssList: {
        rotate360: "rotate360",//旋转360度  focusType=4
        fadeIn: "focusFadeIn",//显示隐藏,   focusType=5
        sacleBig: "sacleBig",//变大         focusType=6
        sacleBigToSmall: "sacleBigToSmall",//变大变小切换  focusType=8
    },

    /**
     * 页面光标生成的dom伪类数组
     */
    focusArr: [],
    /**
     * 页面生成的光标Id数组
     */
    focusIDArr: [],
    /**
     * 光标定时器
     */
    gbInterval: null,
    //当前dom中存在div的集合
    divs: null,
    //光标单例模型
    model: null,
    //光标坐标及方向单例
    coo: null,
    //是否开启alert模式
    /**
     * 是否开启alert  true | flase
     */
    isAlert: true,
    /**
     *  alert弹框
     * @param msg 弹出的内容
     */
    alertTip: function (msg) {
        var _this = this;
        if (_this.isAlert) {
            alert(msg);
        }
    },
    /**
     * 判断样式是否存在
     * @param ele 元素dom
     * @param cls className
     * @returns {RegExpMatchArray | Promise<any> | * | Promise<Response>}
     * @example
     *      <div class="pin animate" id="hands_x0_y0_addContent9_" "></div>
     *
     *      var elm = document.getElementById("hands_x0_y0_addContent9_");
     *      PAGE.hassClass(elm,"pin") //true
     *      PAGE.hassClass(elm,"aaaa") //false
     *
     */
    hasClass: function (ele, cls) {
        return ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
    },
    /**
     * 为指定的dom元素添加样式
     * @param ele 元素dom
     * @param cls 需要添加的className\
     * @example
     *  @example
     *      <div class="pin animate" id="hands_x0_y0_addContent9_" "></div>
     *
     *      var elm = document.getElementById("hands_x0_y0_addContent9_");
     *      PAGE.addClass(elm,"pin1") // elm.className => pin animate pin1
     *
     *
     */
    addClass: function (ele, cls) {
        if (!this.hasClass(ele, cls)) ele.className += " " + cls;
    },
    /**
     * 删除指定dom元素的样式
     * @param ele 元素dom
     * @param cls 需要删除的class
     * @example
     *   <div class="pin animate" id="hands_x0_y0_addContent9_" "></div>
     *
     *      var elm = document.getElementById("hands_x0_y0_addContent9_");
     *      PAGE.removeClass(elm,"pin") // elm.className => animate
     *
     */
    removeClass: function (ele, cls) {
        if (this.hasClass(ele, cls)) {
            var reg = new RegExp("(\\s*)" + cls + "(\\s*)");
            ele.className = ele.className.replace(reg, " ");
        }


    },
    /**
     * 如果存在(不存在)，就删除(添加)一个样式
     * @param ele  元素dom
     * @param cls  需要添加还是删除的className
     * @example
     *
     *  <div class="pin animate" id="hands_x0_y0_addContent9_" "></div>
     *
     *      var elm = document.getElementById("hands_x0_y0_addContent9_");
     *      PAGE.toggleClass(elm,"animate") // elm.className => pin
     *      PAGE.toggleClass(elm,"animate") // elm.className => pin animate
     *      PAGE.toggleClass(elm,"animate") // elm.className => pin
     *
     *
     */
    toggleClass: function (ele, cls, dosome) {
        if (this.hasClass(ele, cls) && dosome == 'removeClass') {
            this.removeClass(ele, cls);
            return;
        } else if (dosome == 'addClass') {
            this.addClass(ele, cls);
            return;
        }
        if (this.hasClass(ele, cls)) {
            this.removeClass(ele, cls);
        } else {
            this.addClass(ele, cls);
        }
    },
    /**
     * 获取当前dom
     * @param id  dom Id值
     * @returns {HTMLElement | null} 返回dom对象
     * @example var dom = PAGE.$("IMGiD");
     */
    $: function (id) {
        var _this = this;
        if (id) {
            return document.getElementById(id);
        } else {
            // _this.alertTip("id为" + id + "不存在，PAGE.$方法报错");
        }

    },
    /**
     * 判断是否支持css3样式
     * @param style  样式
     * @returns {boolean}
     */
    supportCss3: function (style) {
        var prefix = ['webkit', 'Moz', 'ms', 'o'],
            i,
            humpString = [],
            htmlStyle = document.documentElement.style,
            _toHumb = function (string) {
                return string.replace(/-(\w)/g, function ($0, $1) {
                    return $1.toUpperCase();
                });
            };

        for (i in prefix)
            humpString.push(_toHumb(prefix[i] + '-' + style));

        humpString.push(_toHumb(style));

        for (i in humpString)
            if (humpString[i] in htmlStyle) return true;

        return false;
    },
    /**
     * 判断传值是否为空
     * @param obj 需要判断的值是否为空
     * @returns {boolean}
     * @example
     *  var a = "",a1 = null,a2 ,a3 = "null",a4 = "undefined",b = "aa";
     *  PAGE.isEmpty(a1)  //true
     *  PAGE.isEmpty(a2)  //true
     *  PAGE.isEmpty(a3) //true
     *  PAGE.isEmpty(a4)  //true
     *  PAGE.isEmpty(b)  //false
     *
     *
     */
    isEmpty: function (obj) {
        if (typeof obj == "undefined" || obj == null || obj == "" || obj == "null" || obj == "undefined" || obj == {} || obj == []) {
            return true;
        } else {
            return false;
        }
    },
    /**
     * 判断key是否在对象中
     * @param obj  目标对象
     * @param key  目标Key
     * @returns {boolean}
     * @example
     *  var a = {a:1,b:2}
     *  PAGE.hasOwnProperty(a,"a") // true
     *  PAGE.hasOwnProperty(a,"c") // false;
     *
     */
    hasOwnProperty: function (obj, key) {
        obj = obj || {};
        if (!(obj instanceof Object)) return false;
        if (key in obj) {
            return true;
        }
        return false;

    },
    //焦点map
    buttonsMap : {},
    /**
     * 初始化框架,将所有的焦点dom 传入到 PAGE.focusIDArr数组中
     *
     */
    focusInit: function (btnArr,flag) {
        if((!btnArr || btnArr.length == 0) && flag == true) {
            return;
        } else if (!buttons || buttons.length == 0) {
            return;
        }
        btnArr = btnArr || buttons;

        var _this = this;
        // if(flag) {
        //     __buttons = btnArr;
        // } else {
        //     __buttons = buttons;
        // }
        (function(_btnArr){
            for(var i = 0;i < _btnArr.length;i++){
                var curData = _btnArr[i];
                if(curData.id && (!PAGE.focusArr[curData.id] || flag == true)) {
                    _this.buttonsMap[curData.id] = curData;
                    var curDom = _this.$(curData.id);
                    if(curDom) {
                        _this.focusInitDivDom(curDom,curData)
                    }
                }
            }
            // while(_btnArr.length > 0){
               
            // }
        })(btnArr)
        // for(var i=0,len = __buttons.length;i<len;i++){
        //     var curData = __buttons[i];
        //     if(curData.id && (!_this.buttonsMap[curData.id] || flag == true)) {
        //         _this.buttonsMap[curData.id] = curData;
        //     }
        // }
        // _this.divs = document.getElementsByTagName("div");
        // var curDom = null;
        // for(var id in _this.buttonsMap) {
        //     var curDom = _this.$(id);
        //     if(curDom) {
        //     }
        // }
        // for (var i = 0, len = _this.divs.length; i < _this.divs.length; i++) {
        //     curDom = _this.divs[i];
        //     if(PAGE.focusArr[curDom.id] && flag == true ) continue;
        //         //将含有光标的div嵌入到框架中
        //     _this.focusInitDivDom(curDom)
        // }
        //初始化第一个焦点,给当前curFocus 对象赋值
        if (_this.focusIDArr.length > 0 && !_this.isEmpty(_this.focusIDArr[0]) && !_this.isEmpty(_this.focusArr[_this.focusIDArr[0]].focusmodel)) {
            curFocus = PAGE.focusArr[_this.focusIDArr[0]].focusmodel;
        }
    },
    
    /**
     * 取到当前光标dom的model信息，存入到dom对象的 focusmodel 参数中，坐标信息存入到 coo 参数中
     * @param curDom  当前光标dom node
     * @example
     *  取到  PAGE.focusArr[curDom.id].focusmodel   FocusModel  信息
     *  取到   PAGE.focusArr[curDom.id].coo         getCoo  坐标信息
     */
    focusInitDivDom: function (curDom,curBtn) {
        var _this = this;
        if (curDom && curDom.id) {
            if (curDom.id.indexOf("hands") > -1) {
                _this.model = new _this.FocusModel();
                _this.model.FocusID = curDom.id + "";
                // ***************************加载用户手动初始化的值*********************/
                //当前按钮对象
                // var curBtn = null;
                // curBtn = _this.buttonsMap[curDom.id];
                // for (var bt in buttons) {
                //     if (!_this.isEmpty(buttons[bt])) {
                //         var bb = buttons[bt];
                //         if (bb.id == curDom.id) {
                //             curBtn = bb;
                //             break;
                //         }
                //     }
                // }
                if (!_this.isEmpty(curBtn)) {
                    _this.coo = new _this.getCoo(curDom);
                    //焦点图片的 left top width height
                    _this.model.X_Posi = _this.coo.X_Posi;
                    _this.model.Y_Posi = _this.coo.Y_Posi;
                    _this.model.gbWidth = _this.coo.width;
                    _this.model.gbHeight = _this.coo.height;
                    //焦点图片Id
                    _this.model.ImgID = _this.coo.imgId;
                    //焦点图片老地址
                    _this.model.oldSwap = _this.coo.imgsrc;
                    //当点光标是否禁用
                    if ((curBtn.enFocus + "") == "true" || (curBtn.enFocus + "") == "false") {
                        _this.model.enFocus = curBtn.enFocus;
                    }
                    //当前焦点是否禁用ok
                    if ((curBtn.enable + "") == "true" || (curBtn.enable + "") == "false") {
                        _this.model.enable = curBtn.enable;
                    }
                    //当前光标是否禁用自动换焦点
                    if ((curBtn.enMove + "") == "true" || (curBtn.enMove + "") == "false") {
                        _this.model.enMove = curBtn.enMove;
                    }
                    //当前光标是否禁用自动获得焦点
                    if ((curBtn.canEnMove + "") == "true" || (curBtn.canEnMove + "") == "false") {
                        _this.model.canEnMove = curBtn.canEnMove;
                    }
                    //执行的确认事件
                    if (!_this.isEmpty(curBtn.clickHandler)) {
                        _this.model.clickHandler = curBtn.clickHandler;
                    }
                    //光标的临时数据
                    if (!_this.isEmpty(curBtn.TempData)) {
                        _this.model.TempData = curBtn.TempData;
                    }
                    //光标的坑位焦点埋点
                    if (!_this.isEmpty(curBtn.recommendTrackName)) {
                        _this.model.recommendTrackName = curBtn.recommendTrackName;
                    }
                    //光标可切换 的新地址
                    if (!_this.isEmpty(curBtn.focusImage)) {
                        _this.model.focusImage = curBtn.focusImage;
                    }
                    //光标切换类型
                    if (!_this.isEmpty(curBtn.focusType)) {
                        _this.model.FocusType = curBtn.focusType;
                    }
                    //光标的描述
                    if (!_this.isEmpty(curBtn.name)) {
                        _this.model.name = curBtn.name;
                    }

                    //光标切换方向
                    for (var key in _this.coo) {
                        if (!_this.isEmpty(curBtn[key] + "")) {
                            _this.coo[key] = curBtn[key];
                        }
                    }
                    //焦点获取时可执行的事件
                    if (!_this.isEmpty(curBtn.otherFocusEvent)) {
                        _this.model.otherFocusEvent = curBtn.otherFocusEvent;
                    }
                    //焦点失去时可执行的事件
                    if (!_this.isEmpty(curBtn.otherBlurEvent)) {
                        _this.model.otherBlurEvent = curBtn.otherBlurEvent;
                    }
                    //焦点左移时可执行的事件
                    if (!_this.isEmpty(curBtn.leftEvent)) {
                        _this.model.leftEvent = curBtn.leftEvent;
                    }
                    //焦点右移时可执行的事件
                    if (!_this.isEmpty(curBtn.rightEvent)) {
                        _this.model.rightEvent = curBtn.rightEvent;
                    }
                    //焦点上移时可执行的事件
                    if (!_this.isEmpty(curBtn.upEvent)) {
                        _this.model.upEvent = curBtn.upEvent;
                    }
                    //焦点下移时可执行的事件
                    if (!_this.isEmpty(curBtn.downEvent)) {
                        _this.model.downEvent = curBtn.downEvent;
                    }
                    //当前焦点返回可执行的事件
                    if (!_this.isEmpty(curBtn.curFocusBackEvent)) {
                        _this.model.curFocusBackEvent = curBtn.curFocusBackEvent;
                    }

                    _this.model.nodeObj = curDom;
                    //将model模型和coo方向 赋值给 dom 中
                    curDom.focusmodel = _this.model;
                    curDom.coo = _this.coo;
                    PAGE.focusIDArr.push(curDom.id);
                    PAGE.focusArr[curDom.id] = curDom
                }


            }
        } else {
            // _this.alertTip("该光标dom不存在，focusInitDivDom报错")
        }
    },
    /**
     * 传入dom node 获取当前光标的的必要信息
     * @param dom 当前dom node
     * @returns {{X_Posi,Y_Posi,width,height,imgId,imgsrc,enMove,up,
     *  upOther,right,rightOther,down,downOther,left,leftOther,other,upEvent,rightEvent,downEvent,leftEvent
     * }}  返回值
     */
    getCoo: function (dom) {
        var _this = this;
        if (PAGE.isEmpty(dom)) return {};
        //获取光标的必要信息 left top width height
        this.X_Posi = PAGE.getDomInfo(dom, "left");
        this.Y_Posi = PAGE.getDomInfo(dom, "top");
        this.width = PAGE.getDomInfo(dom, "width");
        this.height = PAGE.getDomInfo(dom, "height");
        //光标的图片Id，图片地址
        this.imgId = dom.id.split("_")[3];
        //图片地址
        this.imgsrc = PAGE.getBtnSrc(dom.id);
        //光标上下左右方向执行的方法
        this.enMove = true;//是否允许搜索下一个目标
        this.up = '';
        this.upOther = '';
        this.right = '';
        this.rightOther = '';
        this.down = '';
        this.downOther = '';
        this.left = '';
        this.leftOther = '';
        this.other = '';
        // 某方向执行事件，字符串
        this.upEvent = '';
        this.rightEvent = '';
        this.downEvent = '';
        this.leftEvent = '';
        this.curFocusBackEvent = "";
    },
    /**
     * 获取dom样式信息
     * @param dom dom
     * @param key  dom样式值
     * @returns {*} 如果参数中含有100px val值的 100 number类型
     * @example
     *  var aa = PAGE.$(curFocus.FocusID);
     *  var width = PAGE.getDomInfo(aa,"width"); "100px" => 100
     *  var height = PAGE.getDomInfo(aa,"height"); "100px" => 100
     *  var color = PAGE.getDomInfo(aa,"color"); "red"
     */
    getDomInfo: function (dom, key) {
        var _this = this;
        if (dom) {
            var val = dom.style[key];
            if (val.indexOf("px") > -1) {
                return parseInt(val.match(/[\d]+/g)[0]);
            }
            return val;
        } else {
            alert("dom 不存在");
        }

    },
    /**
     * 获取光标对应图片id
     * @param id 光标图片Id
     * @returns imgSrc
     * @example
     *    dom :
     *       <div id="hands_x0_y0_labelFocus0_" style="position:absolute;top:4px;left:1024px;width:149px;height:48px;z-index: 1">
     <img src="../../HD/images/empty.png" id="labelFocus0" style="visibility: hidden" />
     </div>
     *     mothed :
     *      var imgSrc = PAGE.getBtnSrc("hands_x0_y0_labelFocus0_");
     *      imgSrc => " ../../HD/images/empty.png"
     */
    getBtnSrc: function (id) {
        var _this = this;
        if (id && id.indexOf("hands") > -1) {
            var imgId = id.split("_")[3];
            var imgDom = _this.$(imgId);
            if (!_this.isEmpty(imgDom)) {
                var imgSrc = imgDom.src;
                var backgroundImgSrc = imgDom.style.backgroundImage + "";
                //如果该光标不是image图片时，就要判断改元素的背景图地址
                if (_this.isEmpty(imgSrc) && backgroundImgSrc) {
                    imgSrc = backgroundImgSrc.replace(/(^url\(\"|\"\)$)+/g, "");
                }
                return imgSrc;
            }
        } else {
            _this.alertTip("光标不存在Id,getBtnSrc报错")
        }
    },
    /**
     * 光标模型
     * @constructor
     */
    FocusModel: function () {
        //焦点编号Id,一般为当前焦点Id
        this.FocusID = "";
        //焦点描述名称
        this.name = "";
        //是否开启按ok键,默认开启
        this.enable = true;
        //是否允许此焦点对象获得焦点，默认开启
        this.enFocus = true;
        //是否开启自动换焦点
        this.enMove = true;
        //是否允许此焦点对象在自动换焦点情境下获得焦点，默认开启
        this.canEnMove = true;
        //将自己的对象复制给此属性
        this.own = this;
        //焦点坐标信息 left top width height
        this.X_Posi = 0;
        this.Y_Posi = 0;
        this.gbWidth = 0;
        this.gbHeight = 0;
        //光标显示方式
        this.FocusType = 7;
        //图片切换使用，新图片地址
        this.focusImage = "";
        //原始图片
        this.oldSwap = "";
        //当前光标图片Id
        this.ImgID = "";
        //ok确认事件
        this.clickHandler = "";
        //临时数据
        this.TempData = null;
        //焦点坑位埋点参数
        this.recommendTrackName = null;
        // 在默认获得焦点事件上添加其他执行事件
        this.otherFocusEvent = "";
        // 在默认失去焦点事件上添加额外的执行事件
        this.otherBlurEvent = "";
        // 当前焦点返回触发事件
        this.curFocusBackEvent = "";
        // 上移事件
        this.upEvent = "";
        // 下移事件
        this.downEvent = "";
        // 左移事件
        this.leftEvent = "";
        // 右移事件
        this.rightEvent = "";
        /**
         * 当前焦点确认键触发的事件
         *
         */
        this.OK = function () {
            if (this.enable == true && this.enFocus == true) {
                PAGE.exeCode(this.clickHandler);
            }
        };
        this.init = function () {

        };
        /**
         * 获取当前焦点
         */
        this.defaultFocus = function () {
            if (this.enFocus) {
                this.init();
                //获得焦点之前，先让之前的焦点失去焦点
                if (this.FocusID != curFocus.FocusID) {
                    curFocus.defaultBlur();
                    curFocus = this.own;
                }
                var elm = PAGE.$(curFocus.FocusID);
                var focusImg = PAGE.$(curFocus.ImgID);
                //展示图图片
                var showImg = PAGE.$(curFocus.ImgID + 'Img');
                switch (this.FocusType) {
                    case 4:

                        PAGE.toggleClass(elm, PAGE.styleCssList.rotate360, 'addClass');
                        // 改变焦点对应图片
                        if (!PAGE.isEmpty(curFocus.ImgID)) {
                            focusImg.style.visibility = "visible";
                        }
                        break;
                    case 5:
                        PAGE.toggleClass(focusImg, PAGE.styleCssList.fadeIn, 'addClass');
                        // 改变焦点对应图片
                        if (!PAGE.isEmpty(curFocus.ImgID)) {
                            focusImg.style.visibility = "visible";
                        }
                        break;
                    case 6:
                        showImg && PAGE.toggleClass(showImg, PAGE.styleCssList.sacleBig, 'addClass');
                        PAGE.toggleClass(elm, PAGE.styleCssList.sacleBig, 'addClass');
                    case 7:
                        if (!PAGE.isEmpty(PAGE.$("gb"))) {
                            if (PAGE.gbInterval != null) {
                                clearInterval(PAGE.gbInterval);
                                PAGE.gbInterval = null;
                            }
                            PAGE.$("gb").style.display = "none";
                            PAGE.$("gb").style.visibility = "hidden";
                        }
                        // 改变焦点对应图片
                        if (!PAGE.isEmpty(curFocus.ImgID)) {
                            PAGE.$(curFocus.ImgID).style.visibility = "visible";
                        }
                        break;
                    case 8:
                        //sacleBigToSmall
                        PAGE.toggleClass(elm, PAGE.styleCssList.sacleBigToSmall, 'addClass');
                        // 改变焦点对应图片
                        if (!PAGE.isEmpty(curFocus.ImgID)) {
                            focusImg.style.visibility = "visible";
                        }
                        break;
                    case 9:
                        if (!PAGE.isEmpty(PAGE.$("gb"))) {
                            if (PAGE.gbInterval != null) {
                                clearInterval(PAGE.gbInterval);
                                PAGE.gbInterval = null;
                            }
                            PAGE.$("gb").style.display = "none";
                            PAGE.$("gb").style.visibility = "hidden";
                        }
                        //隐藏显示推荐图，推荐图命名规则，焦点图ID名 + Img
                        showImg && (showImg.style.visibility = "hidden");
                        //放大焦点图
                        PAGE.toggleClass(elm, PAGE.styleCssList.sacleBig, 'addClass');
                        // 改变焦点对应图片
                        if (!PAGE.isEmpty(curFocus.ImgID)) {
                            PAGE.$(curFocus.ImgID).style.visibility = "visible";
                        }
                        break;
                    default:
                        break;
                }
                if (!PAGE.isEmpty(this.otherFocusEvent)) {
                    PAGE.exeCode(this.otherFocusEvent);
                }
            }
        };
        /**
         * 失去当前焦点
         */
        this.defaultBlur = function () {
            if (this.enFocus) {
                var elm = PAGE.$(curFocus.FocusID);
                var focusImg = PAGE.$(curFocus.ImgID);
                //展示图图片
                var showImg = PAGE.$(curFocus.ImgID + 'Img');
                var FocusType = this.FocusType;
                /*  if(this.FocusID == curFocus.FocusID){
                      FocusType = 7;
                  }*/
                switch (FocusType) {
                    case 4:
                        if (PAGE.hasClass(elm, PAGE.styleCssList.rotate360)) {
                            PAGE.removeClass(elm, PAGE.styleCssList.rotate360);
                        }

                        focusImg.style.visibility = "hidden";
                    case 5:
                        if (PAGE.hasClass(focusImg, PAGE.styleCssList.fadeIn)) {
                            PAGE.removeClass(focusImg, PAGE.styleCssList.fadeIn);
                        }

                        focusImg.style.visibility = "hidden";
                        break;
                    case 6:
                        if (PAGE.hasClass(elm, PAGE.styleCssList.sacleBig)) {
                            PAGE.removeClass(elm, PAGE.styleCssList.sacleBig);
                            showImg && PAGE.toggleClass(showImg, PAGE.styleCssList.sacleBig, 'removeClass');
                        }
                    //  PAGE.toggleClass(elm,PAGE.styleCssList.sacleBig);

                    case 7:
                        PAGE.$(curFocus.ImgID).style.visibility = "hidden";
                        break;
                    case 8:
                        // sacleBigToSmall
                        if (PAGE.hasClass(elm, PAGE.styleCssList.sacleBigToSmall)) {
                            PAGE.removeClass(elm, PAGE.styleCssList.sacleBigToSmall);
                        }
                        PAGE.$(curFocus.ImgID).style.visibility = "hidden";
                        break;
                    case 9:
                        PAGE.$(curFocus.ImgID).style.visibility = "hidden";
                        showImg && (showImg.style.visibility = "visible");
                        //恢复焦点图大小
                        PAGE.toggleClass(elm, PAGE.styleCssList.sacleBig, 'removeClass');
                        break;
                    default:

                }
                if (!PAGE.isEmpty(this.otherBlurEvent)) {
                    PAGE.exeCode(this.otherBlurEvent)
                }

            }
        }


    },
    /**
     * 根据焦点Id 即 focusID 获取对应model模型
     * @param _focusId  焦点的Id
     * @returns {*}
     *
     */
    getModelByFocusId: function (_focusId) {
        var _this = this;
        if (_this.isEmpty(_focusId)) return null;
        if (_focusId in PAGE.focusArr) {
            return PAGE.focusArr[_focusId].focusmodel;
        }
    },
    /**
     * 获取指定焦点Id模型对象
     * @param _focusId 焦点Id
     * @returns 焦点Id的FocusModel 模型
     * @example
     *      var curModel = PAGE.getFocusModel6("hands_x0_y0_ImgId_");//获取模型
     *      curModel.defaultFocus();//获取焦点
     */
    getFocusModel6: function (_focusId) {
        var _this = this;
        if (_this.isEmpty(_focusId)) return null;
        var modelObj = _this.getModelByFocusId(_focusId);
        return modelObj;
    },
    /**
     * 将焦点切换到 id为 focusId_ 的dom上
     * @param focusId_ 焦点Id
     * @returns {*}
     * @example
     *      该方法合并了
     *          var curModel = PAGE.getFocusModel6("hands_x0_y0_ImgId_");//获取模型
     *          curModel.defaultFocus();//获取焦点
     *
     *      或者
     *
     *          PAGE.changeFocus("hands_x0_y0_ImgId_");
     *
     */
    changeFocus: function (_focusId) {
        // 切换新焦点之前，需要执行失去焦点事件
        var nextNode = PAGE.getModelByFocusId(_focusId) || PAGE.getModelByFocusId(buttons[0]);
        if (!nextNode || nextNode.enFocus + '' == 'false') {
            return;
        }
        curFocus.defaultBlur();
        var fid = curFocus.FocusID;
        // 给当前焦点重新赋值
        curFocus = nextNode;
        curFocus.lastFocusId = fid;
        curFocus.defaultFocus();
        return nextNode;

    },
    /**
     * 键值方向触发事件
     * @param key 方向键  "up"| "right" | "down" | "left"
     * @example
     *  PAGE.directFocusObj("up");  //键值向上
     *  PAGE.directFocusObj("down"); //键值向下
     */
    directFocusObj: function (key) {
        var _this = this;
        var bl = true;
        var focusID = curFocus.FocusID;
        //如果当前焦点存在，将走焦点的指定方向参数，如果焦点指定的方向不存在，可以走自动获取焦点方法
        if (_this.hasOwnProperty(_this.focusArr, focusID)) {//focusDires
            // 获得当前焦点，是否有指定移动的焦点
            var d = _this.focusArr[focusID].coo;

            // 由于当前方法是用来往右移动的，只需判断是否有右方的focusId
            // 当前焦点，往某方向按键时具有优先执行，如果指定了方向事件，就不会切换当前焦点，而去执行事件
            if (!_this.isEmpty(d[key + "Event"])) {
                PAGE.exeCode(d[key + "Event"]);
                bl = false;
                return;
            } else if (!_this.isEmpty(d[key])) {
                // 如果往下移动被赋值了disable说明啥都不操作
                if (d[key] == "disable") {
                    bl = false;
                    return;
                }
                // 通过focusID找到焦点对象
                var nextNode = _this.getModelByFocusId(d[key]);
                if (nextNode.enFocus == true) {
                    _this.changeFocus(d[key]);
                    bl = false;
                    return;
                    //如果原本设置的按钮被禁用了，倘若设置了downOther值，就让此按钮获得焦点
                } else if (nextNode.enFocus == false && !_this.isEmpty(d[key + "Other"])) {
                    // 通过focusID找到焦点对象
                    var otherNode = _this.getModelByFocusId(d[key + "Other"]);
                    if (otherNode.enFocus == true) {
                        _this.changeFocus(d[key + "Other"]);
                        bl = false;
                        return;
                    }
                } else if (nextNode.enFocus == false && !_this.isEmpty(d.other)) {
                    if (d.other == "disable") {
                        bl = false;
                        return;
                    }
                    // 通过focusID找到焦点
                    var nextNode = _this.getModelByFocusId(d.other)
                    if (nextNode.enFocus == true) {
                        // 切换新焦点之前，需要执行失去焦点事件
                        _this.changeFocus(d.other);
                        bl = false;
                        return;
                    }
                }
            } else if (!_this.isEmpty(d.other)) {
                if (d.other == "disable") {
                    bl = false;
                    return;
                }
                // 通过focusID找到焦点对象
                var nextNode = _this.getModelByFocusId(d.other)
                if (nextNode.enFocus == true) {
                    _this.changeFocus(d.other);
                    bl = false;
                    return;
                }
            }
            //是否禁掉自动搜索
            if (!d.enMove) {
                bl = false;
            }
        }
        if (bl) {
            _this.ProximityPrinciple(key);
        }
    },
    /**
     * 获取焦点dom计算的坐标值
     * @param curNode
     * @returns {
     *          x:0,
     *          y:0,
     *          w:0,
     *          h:0
     * }
     * @example
     * var curBtn = PAGE.$("hands_x0_y0_imgId_");
     *  var coo =  PAGE.getDomPosi(curBtn)
     *  coo {
     *      x : 100,
     *      y ：100，
     *      w : 100,
     *      h : 100
     *  }
     */
    getDomPosi: function (curNode) {
        var _this = this;
        if (!_this.isEmpty(curNode)) {
            var x = curNode.coo.X_Posi;
            var y = curNode.coo.Y_Posi;
            var width = curNode.coo.width;
            var height = curNode.coo.height;
            return {
                x: x,
                y: y,
                w: width,
                h: height
            }
        } else {
            return {
                x: 0,
                y: 0,
                w: 0,
                h: 0
            }
        }
    },

    /**
     * 计算当前焦点与下一个焦点之间的距离
     * @param _coo1 当前焦点
     * @param _coo2 下一个焦点
     * @param type  方向
     * @returns {*[]}
     */
    distanceCALL: function (_coo1, _coo2, type) {
        //获取第一点的X坐标
        var x1 = _coo1.x;
        //获取第一点的Y坐标
        var y1 = _coo1.y;
        //获取第一点的X坐标
        var w1 = _coo1.w;
        //获取第一点的Y坐标
        var h1 = _coo1.h;
        //获取第二点的X坐标
        var x2 = _coo2.x;
        //获取第二点的Y坐标
        var y2 = _coo2.y;
        //获取第二点的X坐标
        var w2 = _coo2.w;
        //获取第二点的Y坐标
        var h2 = _coo2.h;
        //重合的等级高于未重合的等级
        var positionRelative = 1000;
        //判断是不是大图
        var isPositionRelative = false;
        switch (type) {
            case "up":
                //判断是否存在重合
                if ((x1 <= x2 && x1 + w1 >= x2) || (x1 <= x2 + w2 && x1 + w1 >= w2 + x2) || (x1 >= w2 && x1 <= x2 + w2) || (x1 + w1 >= x2 && x1 + w1 <= x2 + w2)) {
                    positionRelative = Math.abs(y1 - (y2 + h2))
                }
                if (w2 > 660) {
                    isPositionRelative = true;
                }

                var mx1 = x1 + w1 / 2;
                var my1 = y1;
                var mx2 = x2 + w2 / 2;
                var my2 = y2 + h2;
                var calX = mx1 - mx2;
                var calY = my1 - my2;
                break;
            case "down":
                //判断是否存在重合
                if ((x1 <= x2 && x1 + w1 >= x2) || (x1 <= x2 + w2 && x1 + w1 >= w2 + x2) || (x1 >= w2 && x1 <= x2 + w2) || (x1 + w1 >= x2 && x1 + w1 <= x2 + w2)) {
                    positionRelative = Math.abs(y1 + h1 - y2);
                }
                if (w2 > 660) {
                    isPositionRelative = true;
                }
                var mx1 = x1 + w1 / 2;
                var my1 = y1 + h1;
                var mx2 = x2 + w2 / 2;
                var my2 = y2;
                var calX = mx1 - mx2;
                var calY = my1 - my2;
                break;
            case "left":
                //判断是否存在重合
                if ((y1 <= y2 && y1 + h1 >= y2) || (y1 <= y2 + h2 && y1 + h1 >= y2 + h2) || (y1 >= y2 && y1 <= y2 + h2) || (y1 + h1 >= y2 && y1 + h1 <= y2 + h2)) {
                    positionRelative = Math.abs(x1 - (x2 + w2));
                }
                if (w2 + x2 >= x1 + w1) {
                    isPositionRelative = true;
                }
                var mx1 = x1;
                var my1 = y1 + h1 / 2;
                var mx2 = x2 + w2;
                var my2 = y2 + h2 / 2
                var calX = mx1 - mx2;
                var calY = my1 - my2;
                break;
            case "right":
                //判断是否存在重合
                if ((y1 <= y2 && y1 + h1 >= y2) || (y1 <= y2 + h2 && y1 + h1 >= y2 + h2) || (y1 >= y2 && y1 <= y2 + h2) || (y1 + h1 >= y2 && y1 + h1 <= y2 + h2)) {
                    positionRelative = Math.abs(x1 + w1 - x2)
                }
                if (w2 > 660) {
                    isPositionRelative = true;
                }
                var mx1 = x1 + w1;
                var my1 = y1 + h1 / 2;
                var mx2 = x2;
                var my2 = y2 + h2 / 2
                var calX = mx1 - mx2;
                var calY = my1 - my2;
                break;
            default:
                break;
        }
        return [Math.round(Math.pow(calX * calX + calY * calY, 0.5)), positionRelative, isPositionRelative];

    },

    /**
     * 根据方向位置 自动获取离当前焦点最近的焦点
     * @param direct 方向 up down left right
     * @constructor
     */
    ProximityPrinciple: function (direct) {
        var _this = this;
        var curNode = null;
        var curId = curFocus.FocusID;

        if (_this.hasOwnProperty(PAGE.focusArr, curId)) {
            curNode = PAGE.focusArr[curId];
        } else {
            return;
        }

        //获取当前元素的坐标值
        var curCoo = _this.getDomPosi(curNode);
        //下部操作范围内的dom集合
        var nextNodeArr = [];
        //是否第一次赋值
        var isFrist = true;
        //是否在方向区域范围内
        var isIncluDir = false;
        //下一个dom
        var nextNode = null;
        //距离最小的dom,初始为当前焦点dom
        var minNextNode = curNode;
        //下一个dom坐标
        var nextNodeCoo = null;
        //距离当前焦点最小的距离
        var minDistance = [0, 0];
        //最小距离的坐标
        var minNodeCoo = {};
        //大图的距离
        var maxDistance = [0, 0];
        //大图距离的坐标
        var maxNodeCoo = {};
        //大图的dom
        var maxNextNode = null;
        var jl = [0, 0];
        // 如果存在上方的焦点,就计算上方的所有焦点中，距离当前焦点最近的
        for (var key in PAGE.focusArr) {
            nextNode = PAGE.focusArr[key];
            //判断下一个焦点是否拒绝自动获焦
            if (nextNode.focusmodel.canEnMove == false) {
                continue;
            }
            nextNodeCoo = _this.getDomPosi(nextNode);
            //通过方向来归属到什么方向的集合,忽略掉被禁用的焦点
            switch (direct) {
                case "up":
                    if (nextNode.focusmodel.enFocus == true && nextNodeCoo.y < curCoo.y) {
                        jl = _this.distanceCALL(curCoo, nextNodeCoo, "up");
                        isIncluDir = true;
                    }
                    break;
                case "down":
                    if (nextNode.focusmodel.enFocus == true && nextNodeCoo.y >= (curCoo.y + curCoo.h - 10)) {
                        jl = _this.distanceCALL(curCoo, nextNodeCoo, "down");
                        isIncluDir = true;
                    }
                    break;
                case "left":
                    if (nextNode.focusmodel.enFocus == true && nextNodeCoo.x < curCoo.x && curCoo.x > 40 || nextNode.id == 'hands_x0_y0_DMXHB0_') {
                        jl = _this.distanceCALL(curCoo, nextNodeCoo, "left");
                        isIncluDir = true;
                    }
                    break;
                case "right":
                    if (nextNode.focusmodel.enFocus == true && nextNodeCoo.x > curCoo.x && (curCoo.x + curCoo.w + 10) <= 1200) {
                        jl = _this.distanceCALL(curCoo, nextNodeCoo, "right");
                        isIncluDir = true;
                    }
                    break;
                default:
                    break;
            }
            //在方向范围内，就做距离比较
            if (isIncluDir) {

                if (isFrist) {
                    minDistance = jl;
                    maxDistance = jl;
                    isFrist = false;
                    minNodeCoo = nextNodeCoo;
                    maxNodeCoo = nextNodeCoo;
                    minNextNode = nextNode;
                    maxNextNode = nextNode;
                } else {
                    if (jl[2] && jl[0] < maxDistance[0]) {
                        maxDistance = jl;
                        maxNextNode = nextNode;
                        maxNodeCoo = nextNodeCoo
                    }
                    /*if (jl[1] < minDistance[1]) {
                        minNextNode = nextNode;
                        minDistance = jl;
                    } else if (jl[1] == minDistance[1]) {*/
                    if (jl[0] <= minDistance[0]) {
                        minNodeCoo = nextNodeCoo;
                        minNextNode = nextNode;
                        minDistance = jl;
                    }
                    // }

                    /* return;
                     if (jl[0] <= minDistance[0]) {
                         // nextNodeCoo:将要用去替换的最近焦点图信息。    minNodeCoo：将被替换的最近焦点图信息
                         //canChange 是否可以替换最近焦点图暂存变量
                         var canChange = false;
                         switch (direct) {
                             case "up" :
                                 if (nextNodeCoo.y > minNodeCoo.y) {
                                     canChange = true;
                                 }
                                 break;
                             case "down" :
                                 if (nextNodeCoo.y < minNodeCoo.y) {
                                     canChange = true;
                                 }
                                 break;
                             case "left" :
                                 if (nextNodeCoo.x > minNodeCoo.x) {
                                     canChange = true;
                                 }
                                 break;
                             case "right" :
                                 if (nextNodeCoo.x < minNodeCoo.x) {
                                     canChange = true;
                                 }
                                 break;
                             default :
                                 break;
                         }
                         if(canChange){
                             minNodeCoo = nextNodeCoo;
                             minNextNode = nextNode;
                             minDistance = jl;
                         }
                     }*/


                }



                isIncluDir = false;

            }

        }

        switch (direct) {
            case "up":
                //如果最小距离的dom的top值小于 大图dom的top值并且 最小距离值小于大图的最小距离值，
                //就将最大图的dom赋值给最小值的dom
                if (minNodeCoo.y < maxNodeCoo.y && minDistance[0] < maxDistance[0]) {
                    minNextNode = maxNextNode;
                }
                break;
            case "down":
                //如果最小距离的dom的top值大图 大图dom的top值并且 最小距离值小于大图的最小距离值，
                //就将最大图的dom赋值给最小值的dom
                if (minNodeCoo.y > maxNodeCoo.y && minDistance[0] < maxDistance[0]) {
                    if (maxNextNode.id.indexOf('rankItem') > -1) {

                    } else {
                        minNextNode = maxNextNode;
                    }

                }
                break;
            case "left":
                //如果最小距离的dom的top值大图 大图dom的top值并且 最小距离值小于大图的最小距离值，
                //就将最大图的dom赋值给最小值的dom
                if (curCoo.y != minNodeCoo.y && minNodeCoo.y > maxNodeCoo.y && maxDistance[2] && minNodeCoo.x >= maxNodeCoo.x) {
                    minNextNode = maxNextNode;
                }
                break;
            default:

        }

        // 切换新焦点之前，需要执行失去焦点事件
        curFocus.defaultBlur();
        var fid = curFocus.FocusID;
        // 给当前焦点重新赋值
        curFocus = minNextNode.focusmodel;
        curFocus.lastFocusId = fid;
        curFocus.defaultFocus();


    },
    /**
     * 解析框架ok确定键触发的事件
     * @param _code  触发焦点的事件
     * @example
     *  PAGE.exeCode("javascript:init()");//触发了init()方法
     *  PAGE.exeCode("http://www.baidu.com");//跳转到指定的地址
     *
     */
    exeCode: function (_code) {
        var _this = this;
        if (_this.isEmpty(_code)) return;
        var code = _code;
        try {
            if (code.indexOf("javascript:") > -1) {
                code = code.replace("javascript:", "");
                eval('(' + code + ')');
                //  setTimeout(code, 0);
            } else {
                _this.redirect(code)
            }

        } catch (e) {
            CT.writeInfo("报错>>" + code);
            console.log(e);
        }
        return true;
    },
    /**
     * 跳转地址方法，可以组织跳转后还可点击
     * @param url  跳转的地址
     */
    redirect: function (url) {
        var _this = this;
        if (_this.isEmpty(url)) return;
        if (curFocus.enable == true) {
            //在执行跳转的时候，就禁止再次点击跳转
            curFocus.enable = false;
            window.location.href = url;
            return;
        }
    },
    /**
     *上下左右键值触发的方法
     * @param direType  up down left right
     */
    focusHand: function (direType) {
        //if (PAGE.displayDire == false) {
        switch (direType) {
            case "UP":
                PAGE.directFocusObj("up");
                break;
            case "DOWN":
                PAGE.directFocusObj("down");
                break;
            case "LEFT":
                PAGE.directFocusObj("left");
                break;
            case "RIGHT":
                PAGE.directFocusObj("right");
                break;
            default:
                break;
        }
        //  }
    },
    /**
     * 按数字键触发的方法
     * @param num 传递的数字键
     * @example
     *   //简单通过数字键跳转网页
     *   var CHANGENUM = "";
     *   PAGE.changeNum = function(num){
     *      CHANGENUM += num;
     *      if(CHANGENUM == "78923"){
     *          window.location.href = "http://www.baidu.com"
     *      }
     *
     *
     *   }
     */
    changeNum: function (num) {

    },
    /**
     * 获取键值code
     * @param evt  键盘事件响应值
     * @returns {any}
     */
    keyCode: function (evt) {
        evt = evt != null && evt != undefined ? evt : window.event;
        var keyCode = evt.which != null && evt.which != undefined && evt.which != 0 ? evt.which : evt.keyCode;
        return keyCode;
    },
    /**
     * 开启一个或者多个光标可获焦
     * @param _focuIds 一个光标或者一个光标数组
     * @returns {*}
     * @example
     *      PAGE.enableFocus("hands_x0_y0_content0_"); 开启单个光标
     *      var arr = ["hands_x0_y0_content0_","hands_x0_y0_content1_","hands_x0_y0_content3_"];
     *      PAGE.enableFocus(arr);//开启多个光标
     */
    enableFocus: function (_focuIds) {
        var _this = this;
        if (_this.isEmpty(_focuIds)) return null;
        var modelObj = null;
        if (typeof (_focuIds) == "string" && _focuIds.constructor == String) {
            modelObj = PAGE.getModelByFocusId(_focuIds);
            if (!_this.isEmpty(modelObj)) {
                modelObj.enFocus = true;
                //PAGE.$(modelObj.ImgID).style.visibility = "visible";
            }
        } else if (typeof (_focuIds) == "object" && _focuIds.constructor == Array) {
            modelObj = new Array();
            for (var i in _focuIds) {
                modelObj[_focuIds[i]] = PAGE.getModelByFocusId(_focuIds[i]);
                if (!_this.isEmpty(modelObj[_focuIds[i]])) {
                    modelObj[_focuIds[i]].enFocus = true;
                    //PAGE.$(modelObj.ImgID).style.visibility = "visible";
                }
            }
        }
        return modelObj;
    },
    /**
     *  禁掉一个或者多个光标可获焦
     * @param _focuIds 一个光标或者一个光标数组
     * @returns {*}
     * @example
     *      PAGE.disableFocus("hands_x0_y0_content0_"); 禁掉单个光标
     *      var arr = ["hands_x0_y0_content0_","hands_x0_y0_content1_","hands_x0_y0_content3_"];
     *      PAGE.disableFocus(arr);//禁掉多个光标
     *
     */
    disableFocus: function (_focuIds) {
        var _this = this;
        if (_this.isEmpty(_focuIds)) return null;
        var modelObj = null;
        if (typeof (_focuIds) == "string" && _focuIds.constructor == String) {
            modelObj = PAGE.getModelByFocusId(_focuIds);
            if (!_this.isEmpty(modelObj)) {
                modelObj.enFocus = false;
                PAGE.$(modelObj.ImgID).style.visibility = "hidden";
            }
        } else if (typeof (_focuIds) == "object" && _focuIds.constructor == Array) {
            modelObj = new Array();
            for (var i in _focuIds) {
                modelObj[_focuIds[i]] = PAGE.getModelByFocusId(_focuIds[i]);
                if (!_this.isEmpty(modelObj[_focuIds[i]])) {
                    modelObj[_focuIds[i]].enFocus = false;
                    PAGE.$(modelObj.ImgID).style.visibility = "hidden";
                }
            }
        }
        return modelObj;
    }

}

var curFocus = new PAGE.FocusModel();


/*************************************键值**********************************************************/

var HW = {
    13: "OK",
    48: "ZERO",
    49: "ONE",
    50: "TWO",
    51: "THREE",
    52: "FOUR",
    53: "FIVE",
    54: "SIX",
    55: "SEVEN",
    56: "EIGHT",
    57: "NINE",
    33: "PAGEUP",
    34: "PAGEDOWN",
    8: "BACK",
    37: "LEFT",
    38: "UP",
    39: "RIGHT",
    40: "DOWN",
    1131: "DEL"
};

var NJGD = {
    640: "BACK_PAGE",
    113: "HOME_PAGE",
    114: "OUT_PAGE"
};

var ZTE = {
    13: "OK",
    48: "ZERO",
    49: "ONE",
    50: "TWO",
    51: "THREE",
    52: "FOUR",
    53: "FIVE",
    54: "SIX",
    55: "SEVEN",
    56: "EIGHT",
    57: "NINE",
    301: "PAGEUP",
    302: "PAGEDOWN",
    126: "BACK",
    271: "LEFT",
    269: "UP",
    272: "RIGHT",
    270: "DOWN",
    261: "VolumeQuiet",
    259: "VolumeUp",
    260: "VolumeDown"
};

var YX = {
    273: "OK",
    48: "ZERO",
    49: "ONE",
    50: "TWO",
    51: "THREE",
    52: "FOUR",
    53: "FIVE",
    54: "SIX",
    55: "SEVEN",
    56: "EIGHT",
    57: "NINE",
    120: "PAGEUP",
    121: "PAGEDOWN",
    122: "BACK",
    29: "LEFT",
    28: "UP",
    30: "RIGHT",
    31: "DOWN",
    99: "F4",
    114: "EXIT"
};

var DaHua = {
    273: "OK",
    48: "ZERO",
    49: "ONE",
    50: "TWO",
    51: "THREE",
    52: "FOUR",
    53: "FIVE",
    54: "SIX",
    55: "SEVEN",
    56: "EIGHT",
    57: "NINE",
    372: "PAGEUP",
    373: "PAGEDOWN",
    340: "BACK",
    3: "LEFT",
    1: "UP",
    4: "RIGHT",
    2: "DOWN",
    339: "EXIT"
};
// 九州
var JiuZhou = {
    13: "OK",
    48: "ZERO",
    49: "ONE",
    50: "TWO",
    51: "THREE",
    52: "FOUR",
    53: "FIVE",
    54: "SIX",
    55: "SEVEN",
    56: "EIGHT",
    57: "NINE",
    283: "BACK",
    513: "BACKMAIN",
    37: "LEFT",
    38: "UP",
    39: "RIGHT",
    40: "DOWN"
};
// 长虹
var ChangHong = {
    13: "OK",
    48: "ZERO",
    49: "ONE",
    50: "TWO",
    51: "THREE",
    52: "FOUR",
    53: "FIVE",
    54: "SIX",
    55: "SEVEN",
    56: "EIGHT",
    57: "NINE",
    27: "BACK",
    37: "LEFT",
    38: "UP",
    39: "RIGHT",
    40: "DOWN",
    33: "PAGEUP",
    34: "PAGEDOWN"
};
var GzAndroid = {
    13: "OK",
    48: "ZERO",
    49: "ONE",
    50: "TWO",
    51: "THREE",
    52: "FOUR",
    53: "FIVE",
    54: "SIX",
    55: "SEVEN",
    56: "EIGHT",
    57: "NINE",
    8: "BACK",
    640: "RETURN",
    37: "LEFT",
    38: "UP",
    39: "RIGHT",
    40: "DOWN",
    33: "PAGEUP",
    34: "PAGEDOWN"
};
var GZGD = {
    640: "BACK", //南京广电返回按键
    113: "RETURN",
    114: "BACKMAIN"
};
var XMBC = {
    340: "BACK",
    270: "RETURN_1",
    283: "RETURN_2",
    8: "RETURN_3",
    513: "BACKMAIN"
};
//广东移动新增键值开始
var BJGH = {
    1: "UP",
    2: "DOWN",
    3: "LEFT",
    4: "RIGHT",
    13: "OK",
    340: "BACK",
    48: "ZERO",
    49: "ONE",
    50: "TWO",
    51: "THREE",
    52: "FOUR",
    53: "FIVE",
    54: "SIX",
    55: "SEVEN",
    56: "EIGHT",
    57: "NINE",
    339: "OUT_PAGE",
    512: "HOME_PAGE",
    1025: "STOP",
    513: "MENU"
};
var GDBC = {
    87: "UP",
    83: "DOWN",
    // 65: "LEFT",
    65: "BACK",
    68: "RIGHT",
    13: "OK",
    8: "BACK",
    48: "ZERO",
    49: "ONE",
    50: "TWO",
    51: "THREE",
    52: "FOUR",
    53: "FIVE",
    54: "SIX",
    55: "SEVEN",
    56: "EIGHT",
    57: "NINE",
    339: "OUT_PAGE",
    512: "HOME_PAGE",
    1025: "STOP",
    513: "MENU"
};
var GDBC_BEIFEN = {
    94: "UP",
    95: "DOWN",
    96: "LEFT",
    97: "RIGHT",
    62: "OK",
    340: "BACK",
    110: "ZERO",
    111: "ONE",
    70: "TWO",
    71: "THREE",
    72: "FOUR",
    73: "FIVE",
    74: "SIX",
    75: "SEVEN",
    76: "EIGHT",
    77: "NINE",
    339: "OUT_PAGE",
    512: "HOME_PAGE",
    1025: "STOP",
    513: "MENU"
};
var HH = {
    38: "UP",
    40: "DOWN",
    37: "LEFT",
    39: "RIGHT",
    13: "OK",
    8: "BACK",
    48: "ZERO",
    49: "ONE",
    50: "TWO",
    51: "THREE",
    52: "FOUR",
    53: "FIVE",
    54: "SIX",
    55: "SEVEN",
    56: "EIGHT",
    57: "NINE",
    1131: "DEL",
    34: "PAGEDOWN",
    33: "PAGEUP"
};
var GDBC_VOLUMN = {
    61: "VOLUMNUP",
    45: "VOLUMNDOWN"
};
//全屏页
var GZBC = {
    13: "OK",
    48: "ZERO",
    49: "ONE",
    50: "TWO",
    51: "THREE",
    52: "FOUR",
    53: "FIVE",
    54: "SIX",
    55: "SEVEN",
    56: "EIGHT",
    57: "NINE",
    283: "BACK",
    513: "BACKMAIN",
    // 65: "LEFT",
    65: "BACK",
    87: "UP",
    68: "RIGHT",
    83: "DOWN",
    67: "VOLUME"
};
//广东移动新增键值结束


function getKeyCodeName(keyCode) {
    return GZBC[keyCode] ||
        GDBC_VOLUMN[keyCode] ||
        HH[keyCode] ||
        GDBC_BEIFEN[keyCode] ||
        HW[keyCode] ||
        NJGD[keyCode] ||
        ZTE[keyCode] ||
        YX[keyCode] ||
        DaHua[keyCode] ||
        JiuZhou[keyCode] ||
        ChangHong[keyCode] ||
        GzAndroid[keyCode] ||
        GZGD[keyCode] ||
        XMBC[keyCode] ||
        BJGH[keyCode] ||
        GDBC[keyCode] || "NULL_KEY"
}



function writeInfoDetailPage (msg) {
    var _this = this;
    
    var el = document.getElementById("msg111");

    if (el) {
        el.innerHTML = el.innerHTML + "；" + msg;
    } else {
        var el = document.createElement("div");
        el.style.position = "absolute";
        el.style.top = "200px";
        el.style.width = "600px";
        el.style.left = "100px";
        el.style.color = "red";
        el.style.fontSize = "20px";
        el.style.background = "rgba(0,0,0,0.8)";
        el.style.zIndex = "9999";
        el.innerHTML = msg;
        el.id = "msg111";
        document.body.appendChild(el);
    }
};


var keyDownEventName = null;//备页面特殊需求
function keyDownEvent1(evt) {
    // var userId = xjDataLog.getUserId();
    // if (userId == "02550719150068440") {
    //     writeInfoDetailPage('===触发keyDown===2222');
        // writeInfoDetailPage('键值11：' + keyCode1 + '；键名：' + keyName);
    // }
    var keyCode1 = PAGE.keyCode(evt);
    var keyName = getKeyCodeName(keyCode1);
    keyDownEventName = keyName;
    // interface.loggerInfo('键值：' + keyCode1 + '；键名：' + keyName);
    try {
        switch (keyName) {
            case "ZERO":
                PAGE.changeNum("0");
                changeNumObj.changeNum("0");
                //  CT.changeNum("0");
                break;
            case "ONE":
                changeNumObj.changeNum("1");
                //  CT.changeNum("1");
                break;
            case "TWO":
                changeNumObj.changeNum("2");
                //   CT.changeNum("2");
                break;
            case "THREE":
                changeNumObj.changeNum("3");
                //      CT.changeNum("3");
                break;
            case "FOUR":
                changeNumObj.changeNum("4");
                //     CT.changeNum("4");
                break;
            case "FIVE":
                changeNumObj.changeNum("5");
                //       CT.changeNum("5");
                break;
            case "SIX":
                changeNumObj.changeNum("6");
                //   CT.changeNum("6");
                break;
            case "SEVEN":
                changeNumObj.changeNum("7");
                //    CT.changeNum("7");
                break;
            case "EIGHT":
                changeNumObj.changeNum("8");
                //         CT.changeNum("8");
                break;
            case "NINE":
                changeNumObj.changeNum("9");
                //      CT.changeNum("9");
                break;
            case "UP":
            case "DOWN":
            case "LEFT":
            case "RIGHT":
                CT.stopJump();
                PAGE.focusHand(keyName);
                break;
            case "OK":
                CT.stopJump();
                curFocus.OK();
                break;
            case "BACK":
            case "BACK_PAGE":
            case "RETURN":
            case "OUT_PAGE":
                CT.stopJump();
				/*
				*/
                try {
                    evt = evt != null && evt != undefined ? evt : window.event;
                    evt.preventDefault();
                } catch (e) {
                }
                if (curFocus.curFocusBackEvent) {
                    PAGE.exeCode(curFocus.curFocusBackEvent);
                } else if (typeof backFunc == "function") {
                    backFunc();
                } else if (typeof backfunc == "function") {
                    backfunc();
                } else {
                    CT.alertTip("返回键无响应！");
                }
                break;
            case "HOME_PAGE":
                CT.exitPlatformPre();
            case "VolumeUp":
                if (volumeUp && typeof volumeUp == "function") {
                    volumeUp();
                }
                break;
            case "VolumeDown":
                if (volumeDown && typeof volumeDown == "function") {
                    volumeDown();
                }
                break;
            default:
                //evt.preventDefault();
                break;
        }
    } catch (e) { }

}
var changeNumObj = {
    changeNum: function () {
        return;
    }
};

// function getUserIdKey() {
//     var userId = "";
//     //系统获取方法
//     try {
//         userId = hardware.STB.serialNumber;
//         CT.setCookie("userId", userId);
//     } catch (e) {}
//     return userId || "-1";
// }

// var userIdKey = getUserIdKey();
// if (userIdKey == "02550719150068440") {
//     writeInfoDetailPage("捕获键值事件为:onkeydown======111:");
//     window.addEventListener("keydown", keyDownEvent1);
//     document.onkeypress = keyDownEvent1;
// } else {
//     document.onkeydown = keyDownEvent1;
// }
try{
    Utility.ioctlWrite("JsAddKeyState", "Y");
    Utility.keyConvert();
}catch(ex){}

document.onkeydown = keyDownEvent1;






