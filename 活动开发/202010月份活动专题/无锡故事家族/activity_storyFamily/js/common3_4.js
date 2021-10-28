﻿var CT = null;
var TE = true;
try {
    (function () {
        function b2() {
            this.getVideoDeviceId = function (callBackFn) {
                var _this = this;
                //在请求userId之前先获取到sn
                var sn = "";
                try {
                    sn = iPanel.ioctlRead("ro.di.stb_sn");
                } catch (e) {
                    sn = "sn_test";
                }
                if (!sn) {

                    try {
                        sn = hardware.STB.serialNumber;
                    } catch (e) {}
                }
                ajax.init({
                    url: "http://access.jscnwx.com/account/user/get_list",
                    method: "get",
                    params: {
                        "deviceno": sn,
                        "devicetype": 1,
                        "pageidx": 1,
                        "pagenum": 6
                    },
                    ContentType: "json",
                    async: false,
                    success: function (res) {
                        if (res.ret == 0) {
                            callBackFn && callBackFn(res.device_id);
                        }
                    },
                    fail: function (status) {
                        loggerInfo("请求userId的ajax失败");
                    }
                });
            }
            /**
             * 获取首页地址
             */
            this.getEpgDomain = function (isAllUrl) {
                var _this = this;
                var mainURL = "";
                var userId = xjDataLog.getUserId();
                var BossPlatForm = xjDataLog.getPlatform(); //CT.getCookie("BossPlatForm") || "HUAWEI";

                try {
                    //获取epg大厅首页方法

                } catch (e) {

                }
                if (isAllUrl === "isAllUrl") {
                    if (_this.BoosPlatForm == "HUAWEI") {
                        mainURL += "Category.jsp";
                    } else if (_this.BoosPlatForm == "ZTE") {
                        mainURL += "portal.jsp";
                    }
                };
                return mainURL;
            };
            /**
             *          * 获取地址栏眉头参数
             *                   * @method CT.GetQueryLocationString
             *                            * @param name 需要获取参数值的key
             *                                     * @returns {null}
             *                                              * @example
             *                                                       *    var action = CT.GetQueryLocationString('action');
             *                                                                */
            this.GetQueryLocationString = function (name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
                var r = window.location.search.substr(1).match(reg);
                if (r != null) return unescape(r[2]);
                return null;
            };
            /**
             * 取拼接字符串中自定的值  "a=11&b=22"
             * 
             * */
            this.getValueByName = function (str, name) {
                if (!str) return "";
                str = str.replace("＆", "&");
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
                var r = str.match(reg);
                if (r != null) return unescape(r[2]);
            };
            this.getUserInfo = function (callBackFn) {
                var _this = this;
                //在请求userId之前先获取到sn
                var sn = "";
                try {
                    sn = iPanel.ioctlRead("ro.di.stb_sn");
                } catch (e) {
                    sn = "sn_test";
                }
                if (!sn) {

                    try {
                        sn = hardware.STB.serialNumber;
                    } catch (e) {
                        sn = "sn_test";
                    }
                }
                var userId = CT.getUserInfo(sn);


                _this.getTokenInfo(userId, sn, callBackFn);

            };
            this.getTokenInfo = function (userId, sn, callBackFn) {
                //获取accessToken，deviceId
                var accessToken = "";
                var deviceId = "";
                var pid = "xldm";
                /*try{
						accessToken = iPanel.ioctlRead("sys.homed.token");
				}catch(e){
						accessToken = "accessToken_test";
			    }*/
                if (!accessToken) {
                    ajax.init({
                        url: "http://access.jscnwx.com/account/login",
                        method: "get",
                        params: {
                            "deviceno": sn,
                            "devicetype": 1,
                            "accounttype": 1,
                            "account": userId,
                            "accesstoken": "",
                            "pwd": "96e79218965eb72c92a549dd5a330112"
                        },
                        ContentType: "json",
                        async: false,
                        success: function (res) {
                            if (res.ret == 0) {
                                accessToken = res.access_token;
                                deviceId = res.device_id;
                                // loggerInfo("在index通过ajax方法获取accessToken》》》》》》》》》》》》》》》》》》》》》"+accessToken);
                                CT.delCookie("userPidToken");
                                CT.setCookie("userPidToken", "userId=" + userId + "&pid=" + pid + "&tokenStr=" + accessToken + "&deviceId=" + deviceId + "&sn=" + sn);
                                callBackFn && callBackFn();
                            }
                        },
                        fail: function (status) {
                            loggerInfo("------------------------------userId-失败ergergerggggggggggggggg---");
                        }
                    });
                } else {
                    // loggerInfo("在index通过else获取accessToken》》》》》》》》》》》》》》》》》》》》》"+accessToken);
                    CT.delCookie("userPidToken");
                    CT.setCookie("userPidToken", "userId=" + userId + "&pid=" + pid + "&tokenStr=" + accessToken + "&deviceId=" + deviceId + "&sn=" + sn);
                }


            };
            this.GetQueryLocationString = function (name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
                var r = window.location.search.substr(1).match(reg);
                if (r != null) return unescape(r[2]);
                return null;
            };
            /**
             * 机顶盒获取版本号
             * @method CT.version
             * @returns {string}
             */
            this.version = function () {
                var version = "1.0";
                return version;
            };
            /**
             * CT.$(id)
             * 获取id的元素
             * @method  CT.$
             * @param id   dom 的id值
             * @returns {*} 返回的dom对象
             * @example
             *  var div = CT.$("id")
             */
            this.$ = function (id) {
                var dom;
                if (typeof (id) == 'undefined' || id == '' || id == undefined || id == null) return null;
                try {
                    dom = document.getElementById(id) || null;
                } catch (e) {
                    dom = null;
                }
                return dom;
            };
            /**
             * 获取浏览器名称
             * @method CT.getBrowser
             * @returns {string}
             */
            this.getBrowser = function () {
                var b3 = "";
                try {
                    var b4 = navigator.appName;
                } catch (e) {
                    var b4 = "";
                }
                if (b4.indexOf("iPanel") != -1) {
                    b3 = "iPanel";
                } else if (b4.indexOf("Microsoft") != -1) {
                    b3 = "Miscrosoft";
                } else if (b4.indexOf("Google") != -1) {
                    b3 = "Google";
                } else if (b4.indexOf("Netscape") != -1) {
                    b3 = "Netscape";
                } else if (b4.indexOf("Opera") != -1) {
                    b3 = "Opera";
                }
                return b3;
            };
            this.browser = this.getBrowser();
            /**
             * 获取浏览器版本
             * @param str
             * @returns {boolean}
             */
            this.getBrowVersion = function (str) {
                var bl = false;
                if (this.isnull(str)) return bl;
                try {
                    var usa = navigator.userAgent;
                } catch (e) {
                    var usa = "";
                }

                if (usa.indexOf(str) != -1) {
                    bl = true;
                }
                return bl;
            };
            /**
             * 设置cookie
             * @method CT.setCookie
             * @param name cookie的key值
             * @param value  cookie的val值
             * @param timestr  设置cookie的时间戳
             * @example
             * 即document.cookie= name+"="+value+";path=/";   时间可以不要，但路径(path)必须要填写，因为JS的默认路径是当前页，如果不填，此cookie只在当前页面生效！~
             *     CT.setCookie('aa','val')
             */
            this.setCookie = function (name, value, timestr) {
                // value = encodeURIComponent(CT.jsonToString(value));
                if (window.localStorage) {
                    window.localStorage.setItem(name, value);
                    try {
                        var exp2 = new Date;
                        var id = this.isnull(timestr) == false ? timestr : "D1";
                        var t = this.getSec(id);
                        exp2.setTime(exp2.getTime() + t);
                        document.cookie = name + ("=" + escape(value) + ";expires=" + exp2.toGMTString() + ";path=/;");

                    } catch (e) {

                    }
                } else {
                    var exp2 = new Date;
                    var id = this.isnull(timestr) == false ? timestr : "D1";
                    var t = this.getSec(id);
                    exp2.setTime(exp2.getTime() + t);
                    document.cookie = name + ("=" + escape(value) + ";expires=" + exp2.toGMTString() + ";path=/;");
                }
            };
            /**
             * 获取cookie
             * @method CT.getCookie
             * @param name cookie的key值
             * @returns {*}
             * @example
             * var name =  CT.getCookie('name');
             */
            this.getCookie = function (name) {
                name = name || 'middle_user_info';
                if (window.localStorage) {
                    var value = window.localStorage.getItem(name);
                    if (value) {
                        // value = value === '' ? value : CT.stringToJson(decodeURIComponent(value));
                        value = value === '' ? value : decodeURIComponent(value);
                        return value;
                    } else {
                        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
                        if (arr != null) {
                            return unescape(arr[2]);
                        }
                    }
                    //   return null;
                } else {
                    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
                    if (arr != null) {
                        return unescape(arr[2]);
                    }
                    return null;
                }
            };
            /**
             * 删除cookie
             * @method CT.delCookie
             * @param name cookie的key值
             * @example
             *  CT.delCookie('name')
             */
            this.delCookie = function (name) {
                if (window.localStorage) {
                    localStorage.removeItem(name);
                    try {
                        var exp = new Date();
                        exp.setTime(exp.getTime() - 1);
                        var cval = this.getCookie(name);
                        if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ";path=/;";

                    } catch (e) {

                    }
                } else {
                    var exp = new Date();
                    exp.setTime(exp.getTime() - 1);
                    var cval = this.getCookie(name);
                    if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ";path=/;";

                }
            };
            /**
             * 获取给定日期的毫秒数
             * @param sec
             * @returns {number} 毫秒时间  默认是一天毫秒数
             * @example
             *   var oneDay = CT.getsec("D1") = CT.getsec("a1");   //  86400000
             *   var oneHour = CT.getsec("H1");                    //  3600000
             *   var oneMinute = CT.getsec("M1");
             *   var oneSecond = CT.getsec("S1");
             */
            this.getSec = function (sec) {
                var str1 = sec.substring(1, sec.length) * 1;
                var str2 = sec.substring(0, 1);
                if (str2 == "S") {
                    return str1 * 1000;
                } else if (str2 == "M") {
                    return str1 * 60 * 1000;
                } else if (str2 == "H") {
                    return str1 * 60 * 60 * 1000;
                } else if (str2 == "D") {
                    return str1 * 24 * 60 * 60 * 1000;
                } else {
                    return 1 * 24 * 60 * 60 * 1000;
                }
            };
            /**
             * 将秒转成时间
             * @param t1
             * @returns {string}
             * @example
             *      CT.timeFormat(10000)
             *      结果：  2:46:40
             */
            this.timeFormat = function (t1) {
                var sign = "";
                if (t1 < 0) {
                    sing = "-";
                    t1 = 0 - t1;
                }
                var hh = (Math.floor(t1 / 3600) % 24 + 1000).toString().substring(2);
                var mm = (Math.floor((t1 % 3600) / 60) + 100).toString().substring(1);
                var ss = (t1 % 60 + 100).toString().substring(1);

                return sign + hh + ":" + mm + ":" + ss;
            }
            /**
             * 消除字符串两侧空格
             * @method CT.trim
             * @param str 处理的字符穿
             * @returns {string|void|XML|*}
             * @example
             *   var aa = '  aaa aa   '
             *   var newaa = CT.trim(aa);
             *   console.log(newaa)// aaa aa
             */
            this.trim = function (str) {
                str = str.replace(/^(\s|\u00A0)+/, '');
                for (var i = str.length - 1; i >= 0; i--) {
                    if (/\S/.test(str.charAt(i))) {
                        str = str.substring(0, i + 1);
                        break;
                    }
                }
                return str;
            };
            /**
             * 返回详细的数据类型
             * @method CT.dataType(obj)
             * @param obj 需要判断数据类型的数据
             * @returns dataType
             * @example
             *   var obj = [];
             *   var dataType = CT.dataType(obj);
             *   console.log(dataType);// array
             */
            this.dataType = function (obj) {
                var dataType = typeof obj;
                if (dataType == "object") {
                    if (obj == null) {
                        dataType = "null";
                    } else {
                        var type = Object.prototype.toString.call(obj);
                        if (type == '[object Array]') {
                            dataType = 'array';
                        } else if (type == '[object Object]') {
                            dataType = "object"
                        }
                    }
                }
                return dataType;
            };

            /**
             * 获取地址参数值
             * @method  CT.requestValue
             * @param d  参数key
             * @returns {*}
             * @example
             *      var action = CT.requestValue("action");
             *
             *
             */
            this.requestValue = function (d) {
                var b = window.location.href;
                var f = b.indexOf("?");
                var e = b.substr(f + 1);
                var c = e.split("&");
                for (var a = 0; a < c.length; a++) {
                    var g = c[a].split("=");
                    if (g[0].toUpperCase() == d.toUpperCase()) {
                        return decodeURIComponent(g[1]);
                    }
                }
                return ""
            };
	    this.requestValueUrl = function (d,url) {
                var b = url;
                var f = b.indexOf("?");
                var e = b.substr(f + 1);
                var c = e.split("&");
                for (var a = 0; a < c.length; a++) {
                    var g = c[a].split("=");
                    if (g[0].toUpperCase() == d.toUpperCase()) {
                        return decodeURIComponent(g[1]);
                    }
                }
                return ""
            };
            /**
             * 获取当前按钮键值,当触发点击事件时调用
             * @param evt window.event
             * @returns {*}
             * @example
             *     documnet.keydown = function(e){
             *          var keyCode = CT.keyCode(e);
             *     }
             */
            this.keyCode = function (evt) {
                evt = evt != null && evt != undefined ? evt : window.event;
                var keyCode = evt.which != null && evt.which != undefined && evt.which != 0 ? evt.which : evt.keyCode;
                return keyCode;
            };
            /**
             * 判断对象中是否含有该key值
             * @param obj
             * @param key
             * @returns {boolean}
             * @example
             *      var obj = {"a":1,"b":2,"d":3};
             *      CT.hasOwnProperty(obj,"a")    //true
             *      CT.hasOwnProperty(obj,"b")    //true
             *      CT.hasOwnProperty(obj,"c")    //false
             */
            this.hasOwnProperty = function (obj, key) {
                obj = obj || {};
                if (!obj instanceof Object) return false;
                if (key in obj) {
                    return true;
                }
                return false;

            };
            /**
             * 改变图片地址
             *
             * @method CT.changeImg
             * @param id 图片的id
             * @param imgurl  图片的地址
             * @example
             *      CT.changeImg("id","../img/vip.png");
             *
             */
            this.changeImg = function (id, imgurl) {
                if (id) {
                    id.src = imgurl;
                }
            };

            /**
             * 判断 是否为空
             * @method CT.isnull
             * @param obj  判断的参数
             * @returns {boolean}
             * @example
             *      CT.isNull("0");
             */
            this.isnull = function (obj) {
                var l_ = '' + obj;
                var ll_ = '' + 0;
                if (l_ == ll_) {
                    return false;
                }
                if (typeof (obj) == 'object' && obj == '') {
                    return true;
                }
                if (typeof (obj) == 'undefined' || obj == undefined || obj == null || obj == '') {
                    return true;
                }
                return false;
            };
            /**
             * 判断 是否不为空
             * @method CT.isNotNull
             * @param obj  判断的参数
             * @returns {boolean}
             * @example
             *      CT.isNotNull("0");
             */
            this.isNotNull = function (obj) {
                //0也判断为有效值
                var l_ = '' + obj;
                var ll_ = '' + 0;
                if (l_ == ll_) {
                    return true;
                }
                if (typeof (obj) == 'object' && obj == '') {
                    return true;
                }
                if (typeof (obj) == 'undefined' || obj == undefined || obj == null || obj == '') {
                    return false;
                }
                return true;
            };
            /**
             * 错误提示
             * @method CT.isNullErrorMsg
             * @param obj  判断的参数
             * @param msg_  提示信息
             * @returns {boolean}
             * @example
             *      CT.isNullErrorMsg("0","当前数据为空")
             */
            this.isNullErrorMsg = function (obj, msg_) {
                if (this.isnull(obj)) {
                    try {
                        if (this.debug == true) {
                            this.alertInfo("text", msg_);
                            console.log(msg_);
                        }
                    } catch (e) {}
                    return true;
                }
                return false;
            }
            /**
             * 获取元素的文本内容
             * @method CT.getText
             * @param id
             * @returns {string}
             * @example
             *   var val = CT.getText(id)
             */
            this.getText = function (dom) {
                var text = "";
                if (dom) {
                    if (!this.isNull(dom.textContent)) {
                        text = dom.textContent;
                    } else {
                        text = dom.innerText;
                    }
                }
                return text;
            };
            /**
             * 设置元素的文本内容
             * @method  CT.setText
             * @param id  dom元素id
             * @param text  文本内容
             * @example
             *    CT.itext(id,'文本内容')；
             */
            this.setText = function (dom, text) {
                if (dom) {
                    if (!this.isNull(text)) {
                        if (!this.isNull(dom.innerText)) {
                            dom.innerText = text;
                        } else {
                            dom.textContent = text;
                        }
                    }
                }

            };
            /**
             * 获取这个dom的信息
             */
            this.getDomInfo = function (dom, key) {
                var _this = this;
                if (dom) {
                    var val = dom.style[key];
                    if (val.indexOf("px") > -1) {
                        return Number(val.match(/[\d]+/g)[0]);
                    }
                    return val;
                } else {
                    alert("dom 不存在");
                }
            };
            //获取这个dom的信息
            this.getCurClassObjInfo = function (dom) {
                var _this = this;
                var obj = {};
                if (dom) {
                    var w = _this.getDomInfo(dom, "width");
                    var h = _this.getDomInfo(dom, "height");
                    var top = _this.getDomInfo(dom, "top");
                    var left = _this.getDomInfo(dom, 'left');
                    var zIndex = (_this.getDomInfo(dom, 'z-index') == -1) ? 99 : 0; //光标图
                    var selectedImg = _this.getDomInfo(dom.childNodes[0], 'background-image'); //光标图
                    return {
                        width: w,
                        height: h,
                        top: top,
                        left: left,
                        zIndex: zIndex,
                        selectedImg: selectedImg
                    }
                }
            };
            /**
             * 定制化弹框
             * @param msg
             * @param args
             * @example
             *  CT.alertTip("我在干嘛！",{
             *
             *  })
             *
             *
             */
            this.alertTip = function (msg, args) { //提示信息
                var _this = this;
                args = args || {};
                var str = "";
                args.time = args.time || 1000;
                args.fontSize = args.fontSize || "30px";
                args.color = args.color || "red";
                args.background = args.background || "#ddd";
                if (_this.checkClickValid(1000)) {
                    return;
                };
                for (var key in args) {
                    str += key + ":" + args[key] + ";";
                }
                var elm = document.createElement("div");
                elm.style.cssText = "position:absolute;top:360px;left:640px;-webkit-transform:translate(-50%,-50%);padding:20px;text-align:center;font-weight:bold; -webkit-border-radius:10px;border-radius: 10px;" + str;
                elm.id = "alertTip";
                elm.innerHTML = msg;
                document.body.appendChild(elm);
                setTimeout(function () {
                    elm.parentNode.removeChild(elm);
                }, args.time)
            };
            /**
             * 继承
             * @param fn
             * @param args
             * @returns {*}
             *  CT.call(CT,[AjaxFun]);
             *  CT.init({
             *      url : "",
             *
             *  })
             *
             *
             */
            this.call = function (fn, args) {
                if (typeof (fn) == 'string') {
                    return eval("(" + fn + ")");
                } else if (typeof (fn) == 'function') {
                    if (!this.isArray(args)) {
                        var arr = [];
                        for (var i = 1; i < arguments.length; i++) {
                            arr.push(arguments[i]);
                        }
                        args = arr;
                    }
                    return fn.apply(window, args);
                }
            };
            /**
             * 判断是否为数组
             * @method CT.isArray
             * @param obj
             * @returns {boolean}
             * @example
             *   CT.isArray(obj)//判断是否为数组
             */
            this.isArray = function (obj) {
                return (obj instanceof Array);
            };
            /**
             * 隐藏元素
             * @method  CT.hide
             * @param id  dom元素id
             * @example
             *    CT.hide(dom);//隐藏元素
             */
            this.hide = function (dom) {
                if (dom) {
                    //  dom.style.display = "none";
                    dom.style.visibility = "hidden";
                }
            };
            /**
             * 显示元素
             * @method CT.show
             * @param id dom元素id
             * @example
             *   CT.show(dom);//元素显示
             */
            this.show = function (dom) {
                if (dom) {
                    //  dom.style.display = "block"; 
                    dom.style.visibility = "visible";
                }
            }
            /**
             * 获取当前web项目根目录
             * @returns {string}
             *@example
             *      var contextPath = CT.getContextPath
             */
            this.getContextPath = function () {
                //http://192.168.2.42:8082/act/html/zadan/tishi_order.html?userId=15651036277
                var a = window.location.href;
                if (a.indexOf("http://") != -1) {
                    a = a.replace("http://", ""); //192.168.2.42:8082/act/html/zadan/tishi_order.html?userId=15651036277";
                    var s1 = a.indexOf(":");
                    a = a.substring(s1 + 1, a.length); //    act/html/zadan/tishi_order.html?userId=15651036277
                    var intLength = (parseInt(a, 10) + "").length;
                    a = a.substring(intLength + 1, a.length);
                    a = a.substring(0, a.indexOf("/"));
                } else {
                    a = "";
                }

                if (a.length > 0) {
                    a = a + "/";
                }
                return a;
            };
            /**
             * 获取当前web项目的IP地址与端口
             * @returns {string}
             * @example
             *      var hostPath = CT.getHostPath();
             */
            this.getHostPath = function () {
                var href = location.href;
                var pathname = location.pathname;
                return href.substr(0, href.lastIndexOf(pathname));
            };
            this.hostPath = this.getHostPath();
            /**
             * 获取当前web项目的IP地址与端口
             * @returns {string}
             * @example
             *      var rootPath = CT.getHostPath();
             */
            this.getRootPath = function () {
                var result = this.hostPath;
                var pathname = location.pathname;
                if (pathname.indexOf("/") > -1) {
                    var paths = pathname.split("/");
                    var temps = new Array();
                    for (var i = 0; i < paths.length; i++) {
                        if (paths[i].length > 0) {
                            temps.push(paths[i]);
                        }
                    }
                    for (var i = 0; i < 0 && i < temps.length; i++) {
                        result += "/" + temps[i];
                    }
                }
                return result;
            };
            this.rootPath = this.getRootPath();
            /**
             *获取当前项目的返回地址
             * @returns {string}
             * @example
             *      var path = CT.getPath();
             */
            this.getPath = function () {
                var pathname = location.pathname;
                var t1 = pathname.indexOf("/", 0);
                var sname = "";
                if (pathname.indexOf("/", t1 + 1) > -1) {
                    sname = pathname.substring(t1 + 1, pathname.indexOf("/", t1 + 1));
                    sname = this.hostPath + "/" + sname + "/";
                }
                return sname;
            };
            this.path = this.getPath();
            /**
             * 获取或者设置DOM元素内容
             * @method CT.html
             * @param dom  dom元素
             * @param html 需要设的内容
             * @returns {*}
             * @example
             *    CT.html(dom,html);//设置内容
             *    var inner = CT.html(dom);获取内容
             */
            this.html = function (dom, html) {
                if (html && html != "" && html != null) {
                    dom.innerHTML = html;
                } else {
                    return dom.innerHTML;
                }
            };
            /**
             * 拼接地址栏数据
             * @method CT.params
             * @param data  要拼接的参数对象
             * @returns {*}
             * @example
             *  var data =  {userId:1233213,name:"ads"};
             *  var str  = CT.params(data);
             *  console.log(str)//userId=1233213&name=ads
             *
             */
            this.params = function (data, encode) { //拼接地址栏携带的参数
                if (this.isnull(data)) {
                    return "";
                }
                var arr = [];
                for (var i in data) {
                    if (encode == true) {
                        arr.push(encodeURIComponent(i) + "=" + encodeURIComponent(data[i]));
                    } else {
                        arr.push(i + "=" + data[i]);
                    }

                }
                return arr.join("&");
            };
            /**
             * 给元素添加绑定事件
             * @method CT.addEvent
             * @param obj dom元素
             * @param type  事件类型
             * @param func  执行回调方法
             * @example
             *    CT.addEvent(dom,load,function(){
             *            //回调方法
             *            CT.alertInfo('我被调用了')
             *    })
             *
             */
            this.addEvent = function (obj, type, func) { //追加绑定事件
                if (obj.addEventListener) {
                    obj.addEventListener(type, func, false);
                } else if (obj.attachEvent) {
                    obj.attachEvent('on' + type, func);
                }
            };
            /**
             * 该模式开发时开启为true   上线时关闭设为false  调试开关
             * @member CT.isDebug
             * @type {boolean}
             * @example
             *   CT.isDebug = false;//
             */
            this.isDebug = true; //开启调试模式
            /**
             *  该模式开发时开启为true   上线时关闭设为false  调试开关
             * @member CT.isMsg
             * @type {boolean}
             * @example
             *   CT.isMsg = false;
             */
            this.isMsg = true; //多次输出
            /**
             * 页面打印调试页面信息
             * @method CT.writeInfo
             * @param msg  打印的提示信息
             * @example
             *   CT.isDebug = false;关闭页面打印，
             *   CT.isMsg = false; 关闭多次打印，
             *   CT.writeInfo('页面打印日日志，可以多次打印')
             */
            this.writeInfo = function (msg) {
                var _this = this;
                if (_this.isDebug) {
                    if (_this.isMsg) {
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
                        el.id = "msg";
                        document.body.appendChild(el);
                        _this.isMsg = false;
                        return;
                    }
                    var el = document.getElementById("msg");
                    el.innerHTML = el.innerHTML + "；" + msg;
                }
            };

            /**
             * 页面调试时使用，alert弹框提示
             *  @method CT.alertInfo
             * @param msg 提示信息
             * @example
             *   该方法如果CT.isDebug = false;弹框就不会出现了
             *   CT.alertInfo('提示信息')
             */
            this.alertInfo = function (msg) { //弹框信息
                var _this = this;
                if (!msg) {
                    return;
                }
                if (_this.isDebug) {
                    alert(msg);
                }
            };
            /**
             * 判断元素属否含有指定的class元素
             * @method CT.hasClass
             * @param obj  dom元素
             * @param cls  是否存在className
             * @returns {boolean}
             * @example
             *   if(CT.hasClass(obj,'classname')){
             *
             *   }
             *
             */
            this.hasClass = function (obj, cls) { //是否含有该class
                return obj.className.match(new RegExp('(\\s+|^)' + cls + '(\\s+|$)'));
            };
            /**
             * 给元素添加class
             * @method CT.addClass
             * @param obj  dom元素
             * @param cls   要添加的classname
             * @example
             *   var div = CT.$('id');
             *   CT.addClass(div,'classname')
             */
            this.addClass = function (obj, cls) { //添加class
                if (!this.hasClass(obj, cls)) obj.className += " " + cls;
            };
            /**
             * 删除元素class属性
             * @method CT.removeClass
             * @param obj  dom元素
             * @param cls  要删除的classname
             * @example
             *   var div = CT.$('id');
             *   CT.removeClass(div,'classname')
             */
            this.removeClass = function (obj, cls) { //删除class
                if (this.hasClass(obj, cls)) obj.className = obj.className.replace(new RegExp('(\\s+|^)' + cls + '(\\s+|$)'), ' ');
            };
            /**
             * json格式转成string
             * @method CT.jsonToString
             * @param obj json对象
             * @returns {*}
             * @example
             *   CT.jsonToString(obj);
             */
            this.jsonToString = function (obj) { //json转字符串
                switch (typeof (obj)) {
                    case 'string':
                        return '"' + obj.replace(/(["\\])/g, '\\$1') + '"';
                    case 'array':
                        return '[' + obj.map(CT.jsonToString).join(',') + ']';
                    case 'object':
                        if (obj instanceof Array) {
                            var strArr = [];
                            var len = obj.length;
                            for (var i = 0; i < len; i++) {
                                strArr.push(CT.jsonToString(obj[i]));
                            }
                            return '[' + strArr.join(',') + ']';
                        } else if (obj == null) {
                            return 'null';

                        } else {
                            var string = [];
                            for (var property in obj) {
                                string.push(CT.jsonToString(property) + ':' + CT.jsonToString(obj[property]));
                            }
                            return '{' + string.join(',') + '}';
                        }
                        case 'number':
                            return obj;
                        case "boolean":
                            return obj;
                }
            };
            /**
             * string 转成 json格式
             * @method CT.stringToJson
             * @param data  string类型的json
             * @returns {{}}
             * @example
             *      CT.stringToJson(data);
             */
            this.stringToJson = function (data) { //string 转成 json格式
                var json = {};
                if (typeof (data) === "string" && data.indexOf("{") > -1) {
                    json = eval('(' + data + ')');
                } else if (typeof (data) === "object") {
                    json = eval(data);
                } else {
                    json = data;
                }
                return json;
            };
            /**
             * string 转成 json格式2
             * @method CT.strToJson
             * @param data  string类型的json
             * @returns {{}}
             * @example
             *      CT.strToJson(data);
             */
            this.strToJson = function (data) { //string 转成 json格式
                var json = {};
                if (typeof (data) === "string") {
                    var arr = data.split("&");
                    for (var i = 0, len = arr.length; i < len; i++) {
                        var array = arr[i].split("=");
                        //json[array[0]] = eval('(' + array[1] + ')');
                        json[array[0]] = array[1];
                    }
                }
                return json;
            };
            /**
             * 批量设置样式
             * @method CT.setStyle
             * @param elm  元素
             * @param obj  样式对象
             * @example
             *      var div = CT.$("id");
             *     CT.setStyle(div,{
             *          fontSize:'12px',
             *          position:'absolute'
             *     })
             */
            this.setStyle = function (elm, obj) { //批量设置元素的样式
                if (obj && typeof obj == "object") {
                    for (var key in obj) {
                        elm.style[key] = obj[key];
                    }
                } else {
                    CT.writeInfo("对象写法错误或不存在")
                }
            };
            /**
             * 上传日志通用方法
             * @method CT.setLogger
             * @param logUrl   接口地址
             * @param params   上传的参数对象
             * @example
             *     CT.setLogger(logUrl,{
             *          userId:12324,
             *          pid :1
             *     })
             */
            this.setLogger = function (logUrl, params) {
                if (params instanceof Object) {
                    var args = '';
                    for (var i in params) {

                        if (args != '') {
                            args += '&';
                        }
                        args += i + '=' + encodeURIComponent(params[i]);
                    }
                    /*var script = document.createElement("script");
                    script.src = logUrl + '?' + args;
                     document.body.appendChild(script);*/
                    var img = new Image(0, 0);
                    img.src = logUrl + '?' + args;
                } else {
                    //console.log("上传参数格式错误");
                }
            };
            /**
             * 外部全局对象，可用于项目中添加全局变量
             * @method CT.outObj
             * @type {{}}
             */
            this.outObj = {};
            /**
             * 实现跑马灯
             * @param str 超出指定字节长度实现跑马灯，必填
             * @param len  字节长度，必填
             * @param time  跑动时间速度,数字越大，跑动速度越快 ,默认为2
             * @returns {*}
             * @example
             *      CT.setMarquee("这是一个跑马灯效果",4,2)
             */
            this.setMarquee = function (str, len, time) {
                var _this = this;
                if (typeof (str) == "string" && typeof (len) == "number") {
                    if (!time) {
                        time = 2
                    }
                    if (_this.getStrLen(str) > len) {
                        return '<marquee scrollamount=' + time + '>' + str + '</marquee>';
                    } else {
                        return str;
                    }
                } else {
                    // CT.writeInfo('跑马灯参数有误');
                }

            };
            /**
             * 获取字符串长度,可区分英文和中文的字节长度
             * @param str 字符串
             * @returns {number} 长度
             * @example
             *      CT.getStrLen("aa")   // 2
             *      CT.getStrLen("a唉")  // 3
             */
            this.getStrLen = function (str) {
                if (typeof str != "string") {
                    return -1;
                }
                var len = 0;
                for (var i = 0; i < str.length; i++) {
                    if (str.charCodeAt(i) > 127 || str.charCodeAt(i) == 94) {
                        len += 2;
                    } else {
                        len++;
                    }
                }
                return len;
            };
            /**
             * 获取给定的url,中key的value值
             * @param url
             * @param name
             * @returns {*}
             * @example
             *      var action = CT.querySearchUrlKey(window.location.href,action);
             */
            this.querySearchUrlKey = function (url, name) {
                var _this = this;
                var search, reg, value;
                if (url) {
                    //获取问号后面的字符串
                    search = url.substring(url.indexOf("?") + 1);
                } else {
                    _this.writeInfo('querySearchUrlKey 中URL 地址错误');
                }
                if (name) {
                    //获取正则表达式
                    reg = new RegExp('(^|&)' + name + '=([^&]*)($|&)');
                    try {
                        value = search.match(reg)[2];
                    } catch (e) {
                        value = null;
                        _this.writeInfo('querySearchUrlKey 中未查询到该key值');
                    }

                } else {
                    _this.writeInfo('querySearchUrlKey 中name 为空')
                }
                return value;
            };
            this.isLoading = true; //是否为加载页
            /**
             * 设置页面加载图
             * @param imgsrc 图片地址
             * @example
             *      CT.setLoading("./loadingImg.gif")
             */
            this.setLoading = function (imgsrc) {
                if (imgsrc) {
                    this.outObj.loadNumber = 0;
                    var loadingImg = imgsrc;
                    if (this.isLoading) {
                        var el = document.createElement('div');
                        el.id = 'loadImg';

                        var childDiv = document.createElement('div');
                        var img = new Image();
                        img.src = loadingImg;
                        childDiv.appendChild(img);
                        el.appendChild(childDiv);
                        document.body.appendChild(el);
                        var loadImg = this.$("loadImg");
                        var childBox = loadImg.firstElementChild;
                        var childImg = childBox.firstElementChild;
                        this.setStyle(loadImg, {
                            width: "1280px",
                            height: "720px",
                            background: "#000",
                            position: "absolute",
                            top: "0",
                            left: "0",
                            zIndex: 10
                        });
                        this.setStyle(childBox, {
                            width: "1280px",
                            height: "720px",
                            backgroundColor: "#000000",
                            position: "relative"
                        });
                        this.setStyle(childImg, {
                            display: "block",
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            webkitTransform: "translate(-50%,-50%)"
                        })

                        this.isLoading = false;
                    } else {
                        try {
                            var loadImg = CT.$('loadImg');
                            loadImg.parentNode.removeChild(loadImg);
                        } catch (e) {

                        }
                    }
                }
            };
            /**
             * 添加焦点模块
             * @param obj
             * obj {
             *      width: 图片长度
             *      height : 图片宽度
             *      name : 模块名称
             *  }
             */
            this.setLabelFun = function (obj) {
                var elem = "<!--" + obj.name + "-->";
                var emptyUrl = "";
                for (var i = 0; i < obj.len; i++) {
                    var index = i;
                    var el = ' <div class="post" style="width:' + obj.width + 'px;height:' + obj.height + 'px;">' +
                        '  <img id = "' + obj.name + 'FocusPic' + index + '" src="' + emptyUrl + '" alt="' + obj.name + '图片"/>' +
                        ' </div>' +
                        ' <div id="hands_x0_y0_' + obj.name + 'Focus' + index + '_" class="post" style="width:' + obj.width + 'px;height:' + obj.height + 'px;">' +
                        ' <img src="' + emptyUrl + '" id = "' + obj.name + 'Focus' + index + '" style="width:' + obj.width + 'px;height:' + obj.height + 'px;visibility: hidden;" alt="' + obj.name + '选框"/>' +
                        ' </div>';
                    elem += el;

                }

                var label = document.createElement('div');
                label.innerHTML += elem;
                label.id = obj.name;
                if (obj.parentId) {
                    document.getElementById(obj.parentId).appendChild(label);
                    return;
                }
                document.body.appendChild(label); //将标签插入到元素dom元素中
            };
            /**
             *设置焦点模块
             * @param elemsObj {
             *          top:  //第一光标的top值
             *          left： //第一光标的；left值
             *          step : //光标之间的间距
             *          len ： //几个光标
             *          width: //光标的宽度
             *          height: 光标的高度
             *          name : 光标分类名称
             *          parentId : 父元素Id
             *          vartical : 竖向排版
             *          startIndex ： 光标起始index
             *          otherObj : 需要传递的信息对象
             *          isSetbtn :false,//是否自动设置button  默认为true
             * }
             * @param option button位置切换位置数组
             * @param labelArray 当前数据的参数
             * @example
             *
             */
            this.setLabel = function (elemsObj, option, labelArray) {
                var len = labelArray.length; //当前组数据长度
                elemsObj.len = len || 0;
                this.setLabelFun(elemsObj);
                labelArray = labelArray; //当前组数据
                var startIndex = elemsObj.startIndex || 0; //起始下标
                var isVertical = elemsObj.vertical || false; //是否属于竖向排版

                for (var i = 0; i < len; i++) {
                    var index = i;
                    var labelImg = CT.$(elemsObj.name + 'FocusPic' + (index + startIndex)); //当前数据的图片
                    var labelChoose = CT.$(elemsObj.name + 'Focus' + (index + startIndex)); //当前数据的光标
                    if (labelArray[index].recommendPic) {
                        labelImg.src = imgUrl + labelArray[index].recommendPic;
                    } else {
                        alert(elemsObj.name + ">>>recommendPic不存在");
                    }
                    if (labelArray[index].recommendLabelpic) {
                        labelChoose.src = imgUrl + labelArray[index].recommendLabelpic;
                    } else {
                        alert(elemsObj.name + ">>>recommendLabelpic不存在");
                    }
                    if (!isVertical) {
                        CT.setStyle(labelImg.parentNode, {
                            left: index * elemsObj.step + elemsObj.left + 'px',
                            top: elemsObj.top + "px"
                        });
                        CT.setStyle(labelChoose.parentNode, {
                            left: index * elemsObj.step + elemsObj.left + 'px',
                            top: elemsObj.top + "px"
                        });
                    } else {
                        CT.setStyle(labelImg.parentNode, {
                            left: elemsObj.left + 'px',
                            top: elemsObj.top + index * elemsObj.step + "px"
                        });
                        CT.setStyle(labelChoose.parentNode, {
                            left: elemsObj.left + 'px',
                            top: elemsObj.top + index * elemsObj.step + "px"
                        });
                    }

                    var curIndex2 = elemsObj.otherObj ? elemsObj.otherObj[index].index2 : "-1";

                    if (option && option.length > 0) {
                        var button = {
                            id: 'hands_x0_y0_' + elemsObj.name + 'Focus' + (index + startIndex) + '_',
                            clickHandler: 'javascript:toJumpUrl(' + JSON.stringify(labelArray[index]) + ',"' + elemsObj.name + '",' + curIndex2 + ')',
                            left: 'hands_x0_y0_' + elemsObj.name + 'Focus' + (index + startIndex - 1) + '_',
                            right: 'hands_x0_y0_' + elemsObj.name + 'Focus' + (index + startIndex + 1) + '_',
                            up: 'hands_x0_y0_' + elemsObj.name + 'Focus' + (index + startIndex - 1) + '_',
                            down: 'hands_x0_y0_' + elemsObj.name + 'Focus' + (index + startIndex + 1) + '_',
                            focusType: 7
                        }
                        if (index == 0) {
                            button.left = 'disable';
                        } else if (index === len - 1) {
                            button.right = 'disable';
                        }
                        if (option && option[index] && option instanceof Array) { //
                            button = checkObj(button, option[index]);
                        }


                        buttons.push(button);
                    }
                }
            };

            /**
             * 根据页码和长度获取数组
             *
             * @param pageNo
             *            页码 大于0
             * @param pageSize
             *            长度
             * @param array
             *            源数据数组
             * @param needCover
             *            是否需要补全到指定长度
             * @returns {Array}
             */
            this.getPageArrayByPageNo = function (pageNo, pageSize, array, needCover) {
                var result = new Array();
                var start = (pageNo - 1) * pageSize;
                var end = start + pageSize;
                if (start > array.length && start < 0) {
                    return result;
                }
                if (end >= array.length) {
                    end = array.length;
                }
                for (var i = start; i < end; i++) {
                    result[i - start] = array[i];
                }
                if (needCover && result.length < pageSize) {
                    for (var i = result.length; i < pageSize; i++) {
                        result[i] = null;
                    }
                }
                return result;
            };
            /** 根据起始索引和长度获取数组
             *
             * @param startIndex
             *            开始索引
             * @param pageSize
             *            长度
             * @param array
             *            源数据数组
             * @param needCover
             *            是否需要补全到指定长度
             * @returns {Array}
             */
            this.getPageArrayByIndex = function (startIndex, pageSize, array, needCover) {
                var result = new Array();
                var end = startIndex + pageSize;
                if (end >= array.length) {
                    end = array.length;
                }
                for (var i = startIndex; i < end; i++) {
                    result[i - startIndex] = array[i];
                }
                if (needCover && result.length < pageSize) {
                    for (var i = result.length; i < pageSize; i++) {
                        result[i] = null;
                    }
                }
                return result;
            };
            /**
             * copy并替换 对象信息
             * @param targetObj 目标对象
             * @param modelObj  源对象
             * @returns {targetObj} 返回出替换后的对象
             * @example
             *      var modelObj = CT.checkObj(targetObj,modelObj)
             */
            this.checkObj = function (targetObj, modelObj) {
                if (modelObj != null && modelObj != undefined) {
                    for (var p in modelObj) {
                        targetObj[p] = modelObj[p];
                    }
                }

                return targetObj;


            };
            /**
             * 当时间间隔小于100毫秒时，就认为是操作无效
             * @returns {boolean}
             *@example
             *      CT.checkClickValid(1000);
             */
            this.checkClickValid = function (distanceTime) {
                var _this = this;
                //间隔时间毫秒数
                distanceTime = distanceTime || 100;
                var lastTime = _this.getCookie('lastTime');
                //当前时间
                var currentTime = new Date();
                var dt = currentTime.getTime();
                //时间差的毫秒数
                var diffTime = dt - lastTime;
                if (diffTime < distanceTime || !lastTime) {
                    _this.setCookie('lastTime', dt);
                    return true;
                }
                return false;
            };
            /**
             * 页面跳转公共方法
             * @param obj
             *  obj  可以为 string类型参数  也可以是对象参数
             *
             * @method
             *          1、CT.commonJumpUrl("http://www.baidu.com");
             *          2、CT.commonJumpUrl({action : "gameDetail" ,gameId : "125" ,userId : "123455"});
             */
            this.commonJumpUrl = function (obj) {
                var _this = this;
                //间隔60s内不准向下操作
                if (!_this.checkClickValid(6000)) {
                    return;
                }
                try {
                    //上传页面日志
                    //xjDataLog.uploadLogPage();
                } catch (e) {}
                var defaultFocus = curFocus.FocusID + "";
                if (typeof obj == "string") {

                    if (obj.indexOf("?") > -1) {
                        obj += "&v=" + new Date().getTime();
                    } else {
                        obj += "?v=" + new Date().getTime();
                    }
                    //地址中 '//' 拼接的地址
                    obj = obj.replace(/(:?\/\/)/g, function (str) {
                        if (str == "//") {
                            return str.replace(str, "/")
                        } else {
                            return str;
                        }
                    });

                    window.location.href = obj + "&defaultFocus=" + defaultFocus + "&isback=1";
                } else {
                    obj = obj || {};
                    var urlData = "1=1";
                    for (var key in obj) {
                        urlData += "&" + key + "=" + obj[key];
                    }
                    window.location.href = "page.action?" + urlData + "&v=" + new Date().getTime() + "&defaultFocus=" + defaultFocus;
                }

            };
            /**
             * 记录当前页面,是调用CT.backPage()做返回方法时,能返回至此页面
             * 页面在跳转的时候如果想保存一个值在url里，可以在页面跳转前使用PAGE.otherPageParam存储
             * @example
             *      CT.goPage();
             */
            this.goPage = function () {
                //取地址
                var currentUrl = this.getCurrentUrl(); //url + 当前焦点id
                //首页删除cookie
                var mainPathname = this.getColumnCode(AjaxConfig.defaultMainUrl);
                //删除原地跳转的重复的地址
                currentUrl.indexOf(mainPathname) > -1 ? CT.delCookie('backUrlList') : "";
                //添加页面参数
                if (PAGE.otherPageParam !== "" && PAGE.otherPageParam !== "null" && PAGE.otherPageParam !== null && PAGE.otherPageParam !== undefined && PAGE.otherPageParam !== "undefined") {
                    currentUrl += PAGE.otherPageParam;
                }
                //去除cookie中的地址转成数据
                var backUrlList = CT.getCookie('backUrlList');
                backUrlList = decodeURIComponent(backUrlList);
                backUrlList = eval("(" + backUrlList + ")") || []; //获取cookie中的返回地址解码转字数组
                //存信息
                var jStr = "";

                var length = backUrlList.length;
                //当前url如果和最后一个url相同则不存储
                //获取当前页面的 XX.html

                var pathname = location.pathname;

                if (backUrlList[length - 1] && backUrlList[length - 1].indexOf(this.getColumnCode(pathname)) > -1) {

                    backUrlList.pop();
                }

                backUrlList.push(currentUrl);

                length = backUrlList.length;

                for (var i = 0; i < length; i++) {

                    jStr += '"' + backUrlList[i] + '",';
                }

                jStr = "[" + jStr.slice(0, -1) + "]";

                jStr = encodeURIComponent(jStr);
                CT.delCookie('backUrlList');
                CT.setCookie('backUrlList', jStr);

            };


		this.AJAX_OBJ = function(url,postData,success,typeName,fail){
					var _this = this;
					try{
					　　oAjax = new XMLHttpRequest();
					}catch(e){
					　　oAjax = new ActiveXObject("Microsoft.XMLHTTP");
					};
					
					typeName = typeName || "POST";
					oAjax.open(typeName,url,true);
					oAjax.withCredentials = true; 
					oAjax.send(JSON.stringify(postData));
					oAjax.onreadystatechange = function(){
					　　if(oAjax.readyState == 4){
							if(oAjax.status == 200){
								success && success(oAjax.responseText);
							} else {
								fail && fail(status);
								
							}
					　　};
					};
				 
			 };
			
			 this.uploadYXVideoLog = function(userId,verifycode,playId){
				var _this = this;
				var doURL = "http://slave.jscnwx.com:13160/collect";
				playId = "" + playId;
				try{
					var postUrl = "\n<?><[0104,"+Date.parse(new Date())+","+userId+","+iPanel.ioctlRead('persist.sys.coship.region_id')+","+verifycode+"]><|><(T,'demand')><&><(ID,"+playId.replace(/\"/g,'')+")><&><(P,'rtsp')><&><(IP,1)><&><(A,1)>\n";
				}catch(e){
					var postUrl = "\n<?><[0104,"+Date.parse(new Date())+","+userId+",'test',"+verifycode+"]><|><(T,'demand')><&><(ID,"+playId.replace(/\"/g,'')+")><&><(P,'rtsp')><&><(IP,1)><&><(A,1)>\n";
				}
						
				_this.AJAX_OBJ(doURL ,postUrl,function(xmlRequest){
				
				},"POST",function(e){
					
				});	
				_this.uploadYXVideoHeartLog(userId,verifycode,playId);
				 
			 };
			
			 this.uploadYXVideoHeartLog = function(userId,verifycode,playId){
				 var _this = this;
				
				 var doURL = "http://slave.jscnwx.com:13160/collect"; 
				 var curTime = Date.parse(new Date());
				 playId = "" + playId;
				 try{
					  var postUrl = "\n<?><[0701,"+ curTime +","+userId+","+iPanel.ioctlRead('persist.sys.coship.region_id')+","+verifycode+"]><|><(S,4)><&><(I,"+playId.replace(/\"/g,'')+")>\n";
				 }catch(e){
					  var postUrl = "\n<?><[0701,"+ curTime +","+userId+",'test',"+verifycode+"]><|><(S,4)><&><(I,"+playId.replace(/\"/g,'')+")>\n";
				 }
				
				 
				_this.AJAX_OBJ(doURL ,postUrl,function(xmlRequest){
				
				},"POST",function(e){
					
				});
				
				setTimeout(function(){
					_this.uploadYXVideoHeartLog(userId,verifycode,playId);
				},60*1000)
				
				
			 };

            /**
             *获取当前页面路径
             *@example
             *      CT.getCurrentUrl();
             *      http://xx.xx.xx.xx:xxxx/XuanLi_Cartoon/HD/html/column/columnTest/index.html
             *      得到
             *      /HD/html/column/columnTest/index.html
             */
            this.getCurrentUrl = function () {
                var url = window.location.href;
                var end = url.indexOf("?") > -1 ? url.indexOf("?") : url.length;
                var arr = url.substr(0, end).split("/");
                var currentUrl = "/" + arr.slice(4, arr.length).join("/");
                //alert('getCurrentUrl  =>>>>>>>>>>>>> '+currentUrl)
                var times = new Date();
                return currentUrl + (currentUrl.indexOf('?') > 0 ? '' : '?1=' + times.getTime());
            };
            /**
             *返回到 前一个页面
             *@example
             *      返回至上一页(在上一页调用了CT.goPage保存页面信息的情况下)
             */
            this.backPage = function () {
                var _this = this;
                //interface.loggerInfo("wyy >>>>>>>>>>>CT  backfunc wyy00 >>>>>>>","post");
                var backUrlStr = CT.getCookie('backUrlList');
                backUrlStr = decodeURIComponent(backUrlStr);
                // interface.loggerInfo("wyy >>>>>>>>>>>CT  backfunc wyy555 >>>>>>>"+backUrlStr,"post");
                if (backUrlStr) {
                    var backUrlList = eval("(" + backUrlStr + ")"); //获取cookie中的返回地址解码转字数组
                } else {
                    var backUrlList = [];

                }
                //先判断cookies最后一个url是不会死当前页面，如果是后退去数组的倒数第二个
                var pathname = location.pathname;
                //返回去最后一个url
                var backUrl = backUrlList.pop() || AjaxConfig.defaultMainUrl;

                var jStr = "";
                var length = backUrlList.length;
                for (var i = 0; i < length; i++) {
                    jStr += '"' + backUrlList[i] + '",';
                }
                jStr = "[" + jStr.slice(0, -1) + "]";
                jStr = encodeURIComponent(jStr);
                CT.setCookie('backUrlList', jStr);
                backUrl = backUrl.substring(1);
                //interface.loggerInfo("wyy >>>>>>>>>>>CT  backfunc wyy3333 >>>>>>>"+backUrl,"post"); 	
                _this.commonJumpUrl(AjaxConfig.projectUrl + backUrl);
            };
            /**
             * 删除记录记忆页面的上一个地址但不跳转该地址。
             * @example
             *      CT.delPreMemoryPage();
             */
            this.delPreMemoryPage = function () {
                var backUrlStr = CT.getCookie('backUrlList');
                backUrlStr = decodeURIComponent(backUrlStr);
                if (backUrlStr) {
                    var backUrlList = eval("(" + backUrlStr + ")"); //获取cookie中的返回地址解码转字数组
                } else {
                    var backUrlList = [];

                }
                //删除并返回最后一个地址
                var lastBackUrl = backUrlList.pop();

                //存储删除过的数组
                var jStr = "";
                var length = backUrlList.length;
                for (var i = 0; i < length; i++) {
                    jStr += '"' + backUrlList[i] + '",';
                }
                jStr = "[" + jStr.slice(0, -1) + "]";
                jStr = encodeURIComponent(jStr);
                CT.setCookie('backUrlList', jStr);

                return lastBackUrl;
            };
            /**
             *获取页面名称
             * @example
             * CT.getColumnCode(window.location.href)
             *main.html-> /main  "/"防止curFocusID和页面名称相同
             */
            this.getColumnCode = function (pathname) {
                var filename = pathname.substr(pathname.lastIndexOf('/') + 0).replace(/\..*$/g, '');
                return filename;
            };
            /**
             * 跳转至推荐页面
             * @param outJson 页面配置信息
             * @param recommend    需跳转页面的推荐类型名称
             * @param index    需跳转页面的的推荐详情编号
             * @example
             *      CT.toAnterRecommendUrl(outJson,"recommend_1",0);
             */
            this.toAnterRecommendUrl = function (outJson, recommend, index) {
                var _this = this;
                if (recommend && outJson[recommend]) {
                    var recommendmap = outJson[recommend][index];
                } else {
                    var recommendmap = outJson;
                }
                var recommendDisplayType = recommendmap.recommendDisplayType;
                var actionUrl = "";
                //推荐详表显示的类型 0 游戏 1 卡通 2视频 3 跳转指定地址 4 通用页面id 5 活动id 6专题 7分类内容 8卡通需要鉴权 88其它
                //涉及到COMM_PAGE_ENAME（页面action）查表`njxj_page_comm_tab`
                //recommendmap.commpageId需要手动修改
                switch (recommendDisplayType) {
                    case 0:
                        var params = {
                            contentId: recommendmap.commpageId || 14,
                            gameId: recommendmap.recommendDisplayValue,
                            contentType: "game"
                        };
                        CT.getAnterByIdOrAction(params);
                        break;
                    case 1:
                        var params = {
                            contentId: recommendmap.commpageId || 3,
                            cartoonId: recommendmap.recommendDisplayValue,
                            contentType: "page"
                        };
                        CT.getAnterByIdOrAction(params);
                        break;
                    case 2:
                        var params = {
                            contentId: 15,
                            cartoonId: recommendmap.cartoonId,
                            videoId: recommendmap.id,
                            contentType: "video"
                        }
                        CT.getAnterByIdOrAction(params);
                        break;
                    case 3:
                        _this.commonJumpUrl(recommendmap.recommendDisplayValue);
                        break;
                    case 4:
                        var prePageFocusID = CT.getCookie("prePageFocusID"); //对专题的特殊返回做的处理,实现来哪去哪
                        if (prePageFocusID) {
                            CT.delCookie("prePageFocusID")
                        }
                        var params = {
                            contentId: recommendmap.commpageId,
                            curFocusId: prePageFocusID,
                            contentType: "page"
                        };
                        CT.getAnterByIdOrAction(params);
                        break;
                    case 5:
                        var activityId = recommendmap.recommendDisplayValue;
                        CT.getActivityUrl(activityId);
                        break;
                    case 6:
                        var params = {
                            contentId: recommendmap.commpageId,
                            action: recommendmap.commpageName,
                            contentType: "column"
                        }
                        CT.getAnterByIdOrAction(params);
                        break;
                    case 7:
                        var params = {
                            contentId: recommendmap.commpageId,
                            parentId: recommendmap.recommendDisplayValue,
                            contentType: "page"
                        };
                        CT.getAnterByIdOrAction(params);
                        break;
                    case 8:

                        break;
                    case 88:
                        CT.backPage();
                        break;
                    default:
                        this.BackPortalMainPage();
                }
            };
            /**
             * 通过页面ID或action请求到下一个页面的url，并进行页面跳转
             * @param params.contentId ： 每个坑对对应的commPageId或者是commPageEname
             * @example
             *      CT.getAnterUrl({contentId : 4,cartoonId :1});
             */
            this.getAnterByIdOrAction = function (params) {
                var _this = this;
                var paramsObj = {};
                if (params.contentId) {
                    paramsObj.contentId = params.contentId;
                } else if (params.contentName == params.contentName) {
                    paramsObj.contentName = params.contentName;
                }
                interface.findTemplateInfo(paramsObj, function (e) {
                    //页面跳转地址
                    //var url = e.data.templateUrl;
                    var url = document.URL.match(/(https?:\/\/)([\w\d\.:_\-]*\/){2}/)[0] + e.data.templateUrl;
                    url += "?contentId=" + e.data.pageId; //页面Id
                    url += "&contentEName=" + e.data.commPageEname; //页面的英文名称
                    url += "&contentCName=" + e.data.commPageCname; //页面的中文名称
                    url += params.contentType ? ("&contentType=" + params.contentType) : ''; //页面类型
                    url += params.cartoonId ? ("&cartoonId=" + params.cartoonId) : ''; //卡通id
                    url += params.parentId ? ("&parentId=" + params.parentId) : ''; //页面分类id
                    url += params.gameId ? ("&gameId=" + params.gameId) : ''; //游戏id
                    url += params.videoId ? ("&videoId=" + params.videoId) : ''; //视频id
                    url += params.action ? ("&action=" + params.action) : ''; //专题或活动action
                    url += params.curFocusId ? ("&curFocusId=" + params.curFocusId) : ''; //上一个页面的焦点defaultFocus
                    // interface.loggerInfo(' wyy ======>>>>>>>commonJumpUrl>>>>>>> '+url,'post');
                    //跳转
                    _this.commonJumpUrl(url);
                });
            };
            /**
             * 通过activityId跳转对应的活动页面
             * @param activityId 活动ID
             * @example
             *      CT.getActivityUrl(13);
             */
            this.getActivityUrl = function (activityId) {
                var _this = this;
                interface.findActivityDetailById({
                    contentId: activityId
                }, function (e) {
                    var url = e.data.activityUrl;
                    var userId = xjDataLog.getUserId("userId");
                    var pid = xjDataLog.getFromPortal("pid");
                    url += "?userId=" + userId + "&pid=" + pid + "&activityId=" + activityId + "&contentId=" + activityId + "&contentCName=" + e.data.activityCname + "&contentEName=activity";
                    _this.commonJumpUrl(url);
                });
            };

            /*推荐位上下架*/
            this.isBooleanUp = function (booleanUp, focusID, parentId) {
                var _this = this;
                if (booleanUp == 0) {
                    CT.$(focusID).style.background = 'url("../../../images/vip.png")';
                    var curFocusDiv = CT.$(focusID);
                    //获取当前焦点的信息
                    var curClassDomInfo = _this.getCurClassObjInfo(curFocusDiv);
                    var booleanUpEle = document.createElement("div");
                    booleanUpEle.style.position = "absolute";
                    booleanUpEle.style.top = (curClassDomInfo.top + 5) + 'px';
                    booleanUpEle.style.left = (curClassDomInfo.left + 5) + 'px';
                    booleanUpEle.style.width = (curClassDomInfo.width - 10) + 'px';
                    booleanUpEle.style.height = (curClassDomInfo.height - 10) + 'px';
                    booleanUpEle.style.backgroundColor = 'black';
                    booleanUpEle.style.color = 'white';
                    booleanUpEle.style.fontSize = '24px';
                    booleanUpEle.style.lineHeight = (curClassDomInfo.height - 10) + 'px';
                    booleanUpEle.style.textAlign = 'center';
                    booleanUpEle.innerHTML = '已下线';
                    document.getElementById(parentId).appendChild(booleanUpEle);
                }
            };
            /**
             * 退出平台
             * @param pageName 当前从哪个页面退出，退出拦截页或其他页面
             * 例：从退出拦截页退出 ，CT.exitPlatform('interceptePage.html');
             */
            this.exitPlatform = function (pageName) {
                /**
                 * 埋点
                 * */

                //退出平台日志
                xjDataLog.uploadLoginOut({
                    "pageCname": "拦截页面",
                    "pageEname": pageName,
                    "loginType": "loginout"
                });
                //退出
                try {
                    var backMain = CT.getCookie("mainBackUrl");
                    CT.delCookie("mainBackUrl");
                    if (backMain) {
                        window.parent.location.href = backMain;
                    } else {
                        try {
                            window.parent.location.href = Authentication.CUGetConfig("EPGDomain")
                        } catch (e) {
                            window.parent.location.href = iPanel.eventFrame.portalUrl;
                        }

                    }
                } catch (e) {}

            };
            /*******************************************/
            /**
             * 小视频播放
             *
             * CT.smallVideoFun(option)
             * @param option{
             *          url : 给定的播放地址
             *
             *          programCode：，
             *          movieCode：    播放id播放
             * }   传参对象
             * @example
             *      CT.smallVideoFun(｛
             *                  left:0,
             *                  top:0,
             *                  width:0,
             *                  height:0,
             *                  url : "http://183.207.249.71:80/xuanjia/vod/xjkt_p_20170425092253149/xjkt_m_201704250922537388"
             *                  ｝)
             *      CT.smallVideoFun({
             *              programCode : 'xjkt_p_20170425092253149',
             *              movieCode : 'xjkt_m_201704250922537388'
             *      })
             */
            this.getUserInfo = function (callBackFn) {
                var _this = this;
                //在请求userId之前先获取到sn
                var sn = "";
                try {
                    sn = iPanel.ioctlRead("ro.di.stb_sn");
                } catch (e) {
                    sn = "sn_test";
                }
                if (!sn) {

                    try {
                        sn = hardware.STB.serialNumber;
                    } catch (e) {
                        sn = "sn_test";
                    }
                }
                var userId = xjDataLog.getUserId(sn);


                _this.getTokenInfo(userId, sn, callBackFn);

            };
            this.getVideoDeviceId = function (callBackFn) {
                var _this = this;
                //在请求userId之前先获取到sn
                var sn = "";
                try {
                    sn = iPanel.ioctlRead("ro.di.stb_sn");
                    //interface.loggerInfo("wyy >>>>>>getVideoDeviceId>>>>>>>>sn>>>" + sn, "post");
                } catch (e) {
                    sn = "sn_test";
                }
                if (!sn) {

                    try {
                        sn = hardware.STB.serialNumber;
                    } catch (e) {}
                }
                ajax.init({
                    url: "http://access.jscnwx.com/account/user/get_list",
                    method: "get",
                    params: {
                        "deviceno": sn,
                        "devicetype": 1,
                        "pageidx": 1,
                        "pagenum": 6
                    },
                    ContentType: "json",
                    async: false,
                    success: function (res) {
                        if (res.ret == 0) {
                            callBackFn && callBackFn(res.device_id);
                        }
                    },
                    fail: function (status) {
                        loggerInfo("请求userId的ajax失败");
                    }
                });
            }
            this.getTokenInfo = function (userId, sn, callBackFn) {
                //获取accessToken，deviceId
                var accessToken = "";
                var deviceId = "";
                var pid = "xldm";
                /*try{
						accessToken = iPanel.ioctlRead("sys.homed.token");
				}catch(e){
						accessToken = "accessToken_test";
			    }*/
                if (!accessToken) {
                    ajax.init({
                        url: "http://access.jscnwx.com/account/login",
                        method: "get",
                        params: {
                            "deviceno": sn,
                            "devicetype": 1,
                            "accounttype": 1,
                            "account": userId,
                            "accesstoken": "",
                            "pwd": "96e79218965eb72c92a549dd5a330112"
                        },
                        ContentType: "json",
                        async: false,
                        success: function (res) {
                            if (res.ret == 0) {
                                accessToken = res.access_token;
                                deviceId = res.device_id;
                                // loggerInfo("在index通过ajax方法获取accessToken》》》》》》》》》》》》》》》》》》》》》"+accessToken);
                                CT.delCookie("userPidToken");
                                CT.setCookie("userPidToken", "userId=" + userId + "&pid=" + pid + "&tokenStr=" + accessToken + "&deviceId=" + deviceId + "&sn=" + sn);
                                callBackFn && callBackFn();
                            }
                        },
                        fail: function (status) {
                            loggerInfo("------------------------------userId-失败ergergerggggggggggggggg---");
                        }
                    });
                } else {
                    // loggerInfo("在index通过else获取accessToken》》》》》》》》》》》》》》》》》》》》》"+accessToken);
                    CT.delCookie("userPidToken");
                    CT.setCookie("userPidToken", "userId=" + userId + "&pid=" + pid + "&tokenStr=" + accessToken + "&deviceId=" + deviceId + "&sn=" + sn);
                }


            };
            //如果播放串不存在，就生成播放串
            this.getPlayUrlByType = function (_urlArr, _keyWords, _nokeyWords) { //_nokeyWords为不能包含的关键字
                var num = Math.random();
                var tempPos = Math.floor(num * 5);

                var tempSerIP = ["172.16.224.33", "172.16.224.34", "172.16.224.35", "172.16.224.36", "172.16.224.37"];
                var tempType = _keyWords;
                if (tempPos >= tempSerIP.length) tempPos = 1;
                if (_keyWords == "rtsp://") {
                    return tempType + tempSerIP[tempPos++] + ":554/playurl";
                } else if (tempType == "http://") {
                    return tempType + tempSerIP[tempPos++] + ":13164/playurl";
                }
            };
            this.smallVideoFun = function (programid, top, left, width, height) {
                var _this = this;
                var userPidToken = CT.getCookie("userPidToken"); //"userId="+userId+"&pid="+pid+"&tokenStr="+tokenStr);
                //如果取不到cookie就重新请求
                if (!userPidToken || (userPidToken + "").length < 20) {
                    _this.getUserInfo(function () {
                        var userPidToken = CT.getCookie("userPidToken"); //"userId="+userId+"&pid="+pid+"&tokenStr="+tokenStr);
                    });
                }
                //interface.loggerInfo("wyy>>>>>>>>>>>>smallVideoFun>>>>>userPidToken>>" + userPidToken, "post");
                //取token，有一定的时效性
                this.getVideoDeviceId(function (deviceId) {
                    CT.setCookie("videoDeviceId", deviceId);
                    var accesstoken = CT.getValueByName(userPidToken, "tokenStr");
                    var userId = CT.getValueByName(userPidToken, "userId");
                    var sn = CT.getValueByName(userPidToken, "sn");
                   // interface.loggerInfo("wyy>>>>>>>>>>>>smallVideoFun>>>> request param >>sn>>" + sn + ">>>> accesstoken>> " + accesstoken + ">>>>>>> deviceId >" + deviceId + " >>>>>> programid " + programid, "post");
                    var playtoken = "";
                    ajax.init({
                        url: "http://slave.jscnwx.com/media/video/get_info",
                        method: "get",
                        params: {
                            "accesstoken": accesstoken,
                            "videoid": programid
                        },
                        ContentType: "json",
                        success: function (res) {
                           // interface.loggerInfo("wyy>>>>>>>>>>>>smallVideoF response >>>>>" + ajax.jsonToString(res), "post");
                            if (res.ret == 0) { //获取到正确的数据
                                try {
                                    playtoken = res.play_token || "ABCDEFGH";
                                    var demand_url = res.demand_url[1] || "rtsp://stream.slave.jscnwx.com:14312/playurl";
                                    var playUrl = "";
                                    var qamname = "";
                                    var deviceId = CT.getCookie("videoDeviceId");
                                    try {
                                        VOD.server.controlHeartbeatCycle = 30;
                                        VOD.server.heartbeatCycle = 25;
                                        VOD.server.heartbeatTimeout = 120;
                                        VOD.server.mode = "IP";
                                        VOD.changeServer("isma_v2", "ip");
                                        playUrl = demand_url + "?protocol=rtsp&playtype=demand&accesstoken=" + accesstoken + "&playtoken=" + playtoken + "&programid=" + programid + "&verifycode=" + deviceId;
                                       // interface.loggerInfo("wyy >>>>>>>>>smallVideo play >>media>>" + media, +">>playUrl:" + playUrl , "post");
                                        media.video.setPosition(left, top, width, height);
                                        media.AV.open(playUrl, "rtsp");
                                        media.AV.play();
                                        //interface.loggerInfo("wyy >>>>>>>>>smallVideo lookback.mode "+iPanel.ioctlRead("persist.sys.lookback.mode"),"post")
                                        // if (iPanel.ioctlRead("persist.sys.lookback.mode") == "IPQAM") {
                                        //     VOD.changeServer("cisco_dmx", "dvb");
                                        //     playUrl = "";
                                        //     qamname = iPanel.ioctlRead("persist.sys.coship.region_id")
                                        //     playUrl = demand_url + "?playtype=demand&protocol=rtsp&accesstoken=" + accesstoken + "&programid=" + programid + "&playtoken=" + playtoken + "&auth=no&verifycode=" + deviceId + "&ipqam=1&qam_name=" + qamname + "&relocateme=true";
                                        // } else {
                                        //     VOD.server.mode = "IP";
                                        //     VOD.changeServer("isma_v2", "ip");
                                        //     playUrl = demand_url + "?protocol=http&playtype=demand&accesstoken=" + accesstoken + "&playtoken=" + playtoken + "&programid=" + programid + "&verifycode=" + deviceId;
                                        // }

                                    } catch (e) {
                                        interface.loggerInfo("wyy >>>>>>>>>smallVideo catche>>" + ajax.jsonToString(e));
                                    }
                                    try {
                                        var deviceId = CT.getValueByName(userPidToken, "deviceId"); //设备号
                                        _this.uploadYXVideoLog(userId, deviceId, programid);
                                    } catch (e) {

                                    }


                                    //更新用户targetId到userTab表
                                    orderJs.getTargetId(accesstoken, programid);
                                } catch (e) {}
                            } else { //需要先有正确的token,继续请求播放
                              //  interface.loggerInfo("wyy >>>>>>>>>smallVideo fail");
                                _this.getAccessToken(userId);
                                _this.smallVideoFun(programid, top, left, width, height);
                            }
                        },
                        fail: function (status) {
                            loggerInfo("------------------------------accesstoken11111-失败---" + accesstoken);
                        }
                    });

                });
            };
            this.getAccessToken = function (userId) {
                var userPidToken = CT.getCookie("userPidToken"); //"userId="+userId+"&pid="+pid+"&tokenStr="+tokenStr);
                //取token，有一定的时效性
                var pid = CT.getValueByName(userPidToken, "pid");

                var sn = CT.getValueByName(userPidToken, "sn");

                var accessToken = "";
                var deviceId = "";

                if (!accessToken) {
                    ajax.init({
                        url: "http://access.jscnwx.com/account/login",
                        method: "get",
                        params: {
                            "deviceno": sn,
                            "devicetype": 1,
                            "accounttype": 1,
                            "account": userId,
                            "accesstoken": "",
                            "pwd": "96e79218965eb72c92a549dd5a330112"
                        },
                        ContentType: "json",
                        async: false,
                        success: function (res) {
                            if (res.ret == 0) {
                                accessToken = res.access_token;
                                deviceId = res.device_id;
                                CT.delCookie("userPidToken");
                                CT.setCookie("userPidToken", "userId=" + userId + "&pid=" + pid + "&tokenStr=" + accessToken + "&deviceId=" + deviceId + "&sn=" + sn);
                            }
                        },
                        fail: function (status) {
                            loggerInfo("------------------------------userId-失败ergergerggggggggggggggg---");
                        }
                    });
                } else {
                    CT.delCookie("userPidToken");
                    CT.setCookie("userPidToken", "userId=" + userId + "&pid=" + pid + "&tokenStr=" + accessToken + "&deviceId=" + deviceId + "&sn=" + sn);
                }

            };
            /**
             * 返回到平台首页
             * 'web/HD/web/mainPage/html/mainPage.html'
             */
            this.BackPortalMainPage = function () {
                var _this = this;
                _this.commonJumpUrl(AjaxConfig.projectUrl + AjaxConfig.defaultMainUrl);
            };
            /**
             * 河北联通频道跳转
             *
             */
            //跳转到直播定时器
            this.flagChannel = null;
            //频道号
            this.channelNum = "";
            //跳转方法
            this.changeNum = function (num) {
                var _this = this;

                clearTimeout(_this.flagChannel);
                if (_this.channelNum == '') {

                    if (num == "0") {

                        return;
                    }
                }
                _this.channelNum += num;
                _this.showChannelNum();
                _this.flagChannel = setTimeout(function () {
                    _this.jumpChannelHtml(_this.channelNum);
                }, 2000)
            };
            //展示频道数字
            this.showChannelNum = function () {
                var _this = this;
                var channelNumDiv = _this.$("channelNum");
                if (channelNumDiv) {
                    if (_this.channelNum.length < 4) {
                        channelNumDiv.innerHTML = _this.channelNum;
                    }
                    return;
                }
                var div = document.createElement("div");
                //<div id='"+divName+"' style='position:absolute; left:1110px; top:"+ top +"; width:60px; height:30px; font-size:"+ size +"; color:#00FF00; text-align:right;'></div>
                div.style.cssText = "position:absolute; left:1110px; top:50px; width:60px; height:30px; font-size:36px; color:#00FF00; text-align:right;";
                div.id = "channelNum";
                div.innerHTML = _this.channelNum;
                //document.body.appendChild(div);
            };
            //停止直播跳转
            this.stopJump = function () {
                var _this = this;
                clearTimeout(_this.flagChannel);
                _this.channelNum = "";
                try {
                    var channelNumDiv = _this.$("channelNum");
                    if (channelNumDiv) {
                        document.body.removeChild(channelNumDiv);
                    }
                } catch (e) {}
            };
            //跳转到直播页面  setLoggerInfo
            this.jumpChannelHtml = function (num) {
                var _this = this;
                return;

            };

            /**
             * 更换主题
             * */
            this.changeTheme = function (e, type) {
                if (!e) {
                    return;
                } else {
                    var pageInfo = e.data.pageInfo;
                    var commPageEname = pageInfo.commPageEname.split('_')[0]; // 页面英文名
                    var bgPic; // 背景图片
                    var imgUrl = document.URL.match(/(http|https)(:\/\/)[\w\.:]+/g)[0] || "http://180.96.20.178:28080/";
                }
                var keys = {
                    'main': 'THEME_INDEX_BIGPIC', // 首页背景
                    'category': 'THEME_CATEGORY_BIGPIC', // 全部内容页
                    'personal': 'THEME_HISTORY_BIGPIC', // 记录页
                    'search': 'THEME_SEARCH_BIGPIC', // 搜索页
                    'cartoon': 'THEME_DETAIL_BIGPIC', // 详情页
                    'interceptePage': 'THEME_INTERCEPTE_BIGPIC', // 退出拦截
                    'main_patch': 'THEME_PATCH', // 首页补洞
                    'nav': 'THEME_HEAD_PIC_', // 导航
                    'navRight': 'THEME_HEAD_RIGHT_PIC_', // 导航右图
                    'logo': 'THEME_LOGO', // logo图
                    'train': 'THEME_INDEX_TRAIN', // 火车
                    'apk': 'THEME_APK_BOOT_IMAGE' // 开机图
                };
                // 如果不在已知页面就返回
                if (!keys[commPageEname]) {
                    return;
                }
                /******************************** 设置导航 **************************/
                if (type == 1 && ((pageInfo.themeInfo + '') != 'null') && pageInfo.themeInfo.themeAttrMap) {
                    var navMid = {},
                        navRight = {},
                        navMidArr = [],
                        navRightArr = [];
                    // 获取导航
                    for (var key in pageInfo.themeInfo.themeAttrMap) {
                        var keyArr = key.split('_');
                        if (key.indexOf('THEME_HEAD_PIC') > -1) {
                            navMid[keyArr[3]] = pageInfo.themeInfo.themeAttrMap[key]
                            navMidArr.push(pageInfo.themeInfo.themeAttrMap[key])
                        } else if (key.indexOf('THEME_HEAD_RIGHT') > -1) {
                            navRight[keyArr[4]] = pageInfo.themeInfo.themeAttrMap[key]
                            navRightArr.push(pageInfo.themeInfo.themeAttrMap[key])
                        }
                    }
                    if (navMidArr.length > 0) {
                        for (var i in navMid) {
                            navMidArr[i - 1] = navMid[i]
                        }
                    }
                    if (navRightArr.length > 0) {
                        for (var i in navRight) {
                            navRightArr[i - 1] = navRight[i]
                        }
                    }
                    if (navMidArr.length > 0 && pageInfo.commonPageInfo && pageInfo.commonPageInfo.recommend_2 && pageInfo.commonPageInfo.recommend_2.length > 0) {
                        for (var i = 0; i < navMidArr.length; i++) {
                            var pics = navMidArr[i].split(',');
                            // 推荐位图片
                            pageInfo.commonPageInfo.recommend_2[i].recommendPic.picPath = pics[0];
                            // 选中图
                            pageInfo.commonPageInfo.recommend_2[i].recommendFocuspic.picPath = pics[1];
                            // 焦点图
                            pageInfo.commonPageInfo.recommend_2[i].recommendLabelpic.picPath = pics[2];
                        }
                    }
                    if (navRightArr.length > 0 && pageInfo.commonPageInfo && pageInfo.commonPageInfo.recommend_3 && pageInfo.commonPageInfo.recommend_3.length > 0) {
                        for (var i = 0; i < navRightArr.length; i++) {
                            var picArr = navRightArr[i].split(',');
                            // 推荐位图片
                            pageInfo.commonPageInfo.recommend_3[i].recommendPic.picPath = picArr[0];
                            // 焦点图
                            pageInfo.commonPageInfo.recommend_3[i].recommendLabelpic.picPath = picArr[1];
                        }
                    }
                    if (((pageInfo.themeInfo + '') != 'null') && pageInfo.themeInfo.themeAttrMap && pageInfo.themeInfo.themeAttrMap[keys['logo']] && pageInfo.commonPageInfo && pageInfo.commonPageInfo.recommend_1) {
                        var logoPics = pageInfo.themeInfo.themeAttrMap[keys['logo']].split(',');
                        pageInfo.commonPageInfo.recommend_1[0].recommendPic.picPath = logoPics[0];
                    }
                    AjaxConfig.commonPageInfo.pageInfo = pageInfo;
                }
                /********************************** 设置导航 **************************/

                switch (type) {
                    case 1: // 背景
                        try {
                            if (pageInfo.themeInfo && pageInfo.themeInfo.themeAttrMap && pageInfo.themeInfo.themeAttrMap[keys[commPageEname]]) {
                                bgPic = pageInfo.themeInfo.themeAttrMap[keys[commPageEname]].split(',')[0];
                            } else {
                                bgPic = pageInfo.pageTemplateBgpic.picPath;
                            }
                        } catch (e) {
                            bgPic = pageInfo.pageTemplateBgpic.picPath;
                        }
                        CT.$('BJ').src = imgUrl + bgPic;
                        if (commPageEname == 'main') {
                            // 补洞
                            try {
                                if (((pageInfo.themeInfo + '') != 'null') && pageInfo.themeInfo.themeAttrMap && pageInfo.themeInfo.themeAttrMap[keys['main_patch']]) {
                                    bgPic = pageInfo.themeInfo.themeAttrMap[keys['main_patch']].split(',')[0];
                                } else {
                                    bgPic = pageInfo.pageTemplatePic.picPath;
                                }
                            } catch (e) {
                                bgPic = pageInfo.pageTemplatePic.picPath;
                            }
                            CT.$('videoImg').src = AjaxConfig.imgUrl + bgPic;
                        }
                        break;
                    case 4:
                        try {
                            var trainPic;
                            if (((pageInfo.themeInfo + '') != 'null') && pageInfo.themeInfo.themeAttrMap && pageInfo.themeInfo.themeAttrMap[keys['train']]) {
                                trainPic = pageInfo.themeInfo.themeAttrMap[keys['train']].split(',')[0]
                            } else {
                                trainPic = e.data.recommend_1[e.trainId].recommendLabelpic.picPath;
                            }

                        } catch (err) {
                            trainPic = e.data.recommend_1[e.trainId].recommendLabelpic.picPath;
                        }
                        CT.$('addContent' + e.trainId).src = imgUrl + trainPic;
                        CT.$('addContent' + e.trainId).style.visibility = 'visible';
                        break;
                    default:
                        break;
                }
            }
        }

        CT = new b2();
    })();
} catch (es) {
    CT = null
}

function C() {
    if (CT == null || CT == undefined || typeof (CT) == 'undefined') return false;
    return true;
}
CT.delCookie('lastTime');



/**
 * 页面错误提示
 */
var errorTip = {

    isError: false,
    isDebug: false,
    writeErrorInfo: function (msg) {
        var _this = this;
        if (_this.isDebug) {
            if (_this.isError) {
                var elm = document.createElement("div");
                elm.id = "errorText";
                elm.style.cssText = "position: absolute;top:100px;left:100px;z-index:100;background-color:rgba(0,0,0,0.8);color:red;font-size:24px;";
                elm.innerHTML = msg + "<br>";
                document.body.appendChild(elm);
                this.isError = false;
                return;
            } else {
                var elm = document.getElementById("errorText");
                elm.innerHTML += msg + "<br>";
            }
        }

    },
    init: function () {
        var _this = this;
        window.onerror = errorFun;

        function errorFun(msg, url, line) {
            //没有URL不上报！上报也不知道错误

            var txt = "";
            txt += "msg:" + msg + ":Line:" + line;

            _this.writeErrorInfo(txt);
            return false;
        };
    }

};





! function (window) {
    var errorTipTest = {
        isError: true,
        isDebug: true,
        errUrl: "http://192.168.2.41:8081/insert",
        writeErrorInfo: function (data) {
            var _this = this;
            data = data || {};
            _this.sendAjaxPost(_this.errUrl, {
                userId: data.userId,
                errUrl: data.errUrl,
                errLine: data.errLine,
                errReason: data.errReason,
                errStatus: data.errStatus,
                errType: data.errType
            }, function (data1) {
                console.log(data1);
            }, function (err) {
                console.log(err);
            })

        },
        init: function () {
            var _this = this;
            window.addEventListener('error', function (err) {
                _this.writeErrorInfo({
                    userId: xjDataLog.getUserId(),
                    errUrl: err.filename,
                    errLine: err.lineno,
                    errReason: err.message,
                    errType: err.type,
                    errStatus: "页面报错"

                })
            }, true);

        },
        sendAjaxPost: function (url, postData, success, fail) {
            var _this = this;
            try {
                oAjax = new XMLHttpRequest();
            } catch (e) {
                oAjax = new ActiveXObject("Microsoft.XMLHTTP");
            };
            //post方式打开文件
            oAjax.open("POST", url, true);
            //post相比get方式提交多了个这个
            oAjax.setRequestHeader("Content-type", "application/json;charset=utf-8");
            oAjax.send(JSON.stringify(postData));
            oAjax.onreadystatechange = function () {
                //当状态为4的时候，执行以下操作
                if (oAjax.readyState == 4) {
                    if (oAjax.status == 200) {
                        success && success(oAjax.responseText);
                    } else {
                        fail && fail(status);
                    }
                };
            };
        }

    };
    //window.errorTipTest = errorTipTest;
    //  window.errorTipTest.init();
}(window)






/**
 * My namespace.
 * @namespace  NCT
 */

var NCT = {
    /**
     * NCT.getVal cookie值
     * @param str  主key值
     * @param key  参数key值
     * @param val  参数val值
     * @returns {string}
     */
    getVal: function (str, key, val) {
        var newArr = [];
        var arr = str.split("&");
        for (var i = 0, len = arr.length; i < len; i++) {
            var array = arr[i].split("=");
            if (key == array[0]) {
                array[1] = val;
            }
            var str = array.join("=");
            newArr.push(str);
        }
        return newArr.join("&");
    },
    /**
     *   设置cookie值  NCT.setCookie(name,key,val)
     * @param str 主key值
     * @param key  参数key值
     * @param val  参数val值
     * @returns {string}
     */
    setCookie: function (name, key, val) {
        var _this = this;
        var test = CT.getCookie(name) + "";
        if (test != null && test != "" && test != "null") {
            var value = _this.getCookie(name, key);
            if (value) {
                test = _this.getVal(test, key, val);
            } else {
                var arr = test.split("&");
                arr.push(key + "=" + val);
                test = arr.join("&");
            }
        } else {
            test = "";
            test += key + "=" + val
        }

        CT.setCookie(name, test)
    },
    /**
     * 获取Cookie值  NCT.getCookie(name,key)

     * @param name  主key值
     * @param key   key值
     * @returns {string}
     */
    getCookie: function (name, key) {
        var test = CT.getCookie(name);
        var arr = test.split("&");
        var obj = {};
        for (var i = 0, len = arr.length; i < len; i++) {
            var a = arr[i];
            var index = a.indexOf("=");
            if (index > -1) {
                obj[a.substr(0, index)] = a.substr(index + 1)

            }
        }
        return obj[key]
    }
};
