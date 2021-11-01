var CT = null;
var TE = true;
    (function () {
        function b2() {
            /**
             * 是否是路由控制页面访问。
             */
            this.isRoute = window.location.href.indexOf('.html') > -1 ? false : true;
            /**
             * 获取首页地址
             */
            this.getEpgDomain = function (isAllUrl) {
                var _this = this;
                var mainURL = "";
                // var userId = xjDataLog.getUserId();
                // var BossPlatForm = xjDataLog.getPlatform();//CT.getCookie("BossPlatForm") || "HUAWEI";
                // try {
                //     //获取epg大厅首页方法

                // } catch (e) {

                // }
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
             *   清空cookie值  
             * @param str 主key值
             * @param key  参数key值
             * @param val  参数val值
             * @returns {string}
             */
            this.clearAllCookie = function() {
                var _this = this;
                var date=new Date();
                date.setTime(date.getTime()-10000);
                var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
                if (keys) {
                    for (var i = keys.length; i--;){
                        document.cookie=keys[i]+"=0; expire="+date.toGMTString()+"; path=/";
                    }
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
                }
                else if (str2 == "M") {
                    return str1 * 60 * 1000;
                }
                else if (str2 == "H") {
                    return str1 * 60 * 60 * 1000;
                }
                else if (str2 == "D") {
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
             * @param d  参数key ,url: 传入的地址
             * @returns {*}
             * @example
             *      var action = CT.requestValue("action");
             *
             *
             */
            this.requestValue = function (d, url) {
                var b = url || window.location.href;
                if (d) {
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
                }else{
                    return ""
                }
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
                if (l_ == ll_) { return true; }
                if (typeof (obj) == 'object' && obj == '') { return true; }
                if (typeof (obj) == 'undefined' || obj == undefined || obj == null || obj == '') { return false; }
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
                    } catch (e) {
                    }
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
                        return parseInt(val.match(/[\d]+/g)[0]);
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
                    var zIndex = (_this.getDomInfo(dom, 'z-index') == -1) ? 99 : 0;//光标图
                    var selectedImg = _this.getDomInfo(dom.childNodes[1], 'background-image');//光标图
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
            this.alertTip = function (msg, args) {//提示信息
                var _this = this;
                args = args || {};
                var str = "";
                args.time = args.time || 1000;
                args['font-size'] = args['font-size'] || "25px";
                args.color = args.color || "red";
                args.background = args.background || "#ddd";
                args['z-index'] = args['z-index'] || 1000;
                if (CT.$('alertTip')) {
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
                //     dom.style.display = "none";
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
                  //   dom.style.display = "block"; 
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
                    a = a.replace("http://", "");//192.168.2.42:8082/act/html/zadan/tishi_order.html?userId=15651036277";
                    var s1 = a.indexOf(":");
                    a = a.substring(s1 + 1, a.length);//    act/html/zadan/tishi_order.html?userId=15651036277
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
            this.params = function (data, encode) {//拼接地址栏携带的参数
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
            this.addEvent = function (obj, type, func) {//追加绑定事件
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
            this.isDebug = false;//开启调试模式
            /**
             *  该模式开发时开启为true   上线时关闭设为false  调试开关
             * @member CT.isMsg
             * @type {boolean}
             * @example
             *   CT.isMsg = false;
             */
            this.isMsg = true;//多次输出
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
                    //向后台打印日志
                    interface.loggerInfo(msg, 'post');
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
            this.alertInfo = function (msg) {//弹框信息
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
            this.hasClass = function (obj, cls) {//是否含有该class
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
            this.addClass = function (obj, cls) {//添加class
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
            this.removeClass = function (obj, cls) {//删除class
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
            this.jsonToString = function (obj) {//json转字符串
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
                        }
                        else if (obj == null) {
                            return 'null';

                        }
                        else {
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
            this.stringToJson = function (data) {//string 转成 json格式
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
            this.strToJson = function (data) {//string 转成 json格式
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
            this.setStyle = function (elm, obj) {//批量设置元素的样式
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
            this.isLoading = true;//是否为加载页
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
                document.body.appendChild(label);//将标签插入到元素dom元素中
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
                var len = labelArray.length;//当前组数据长度
                elemsObj.len = len || 0;
                this.setLabelFun(elemsObj);
                labelArray = labelArray;//当前组数据
                var startIndex = elemsObj.startIndex || 0;//起始下标
                var isVertical = elemsObj.vertical || false;//是否属于竖向排版

                for (var i = 0; i < len; i++) {
                    var index = i;
                    var labelImg = CT.$(elemsObj.name + 'FocusPic' + (index + startIndex));//当前数据的图片
                    var labelChoose = CT.$(elemsObj.name + 'Focus' + (index + startIndex));//当前数据的光标
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
                            clickHandler: 'javascript:toJumpUrl(' + CT.jsonToString(labelArray[index]) + ',"' + elemsObj.name + '",' + curIndex2 + ')',
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
                        if (option && option[index] && option instanceof Array) {//
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
            this.commonJumpUrl = function (obj , isBack) {
                var _this = this;
				
				if(_this.commonJumpUrl_flag == true){return;}
				_this.commonJumpUrl_flag = true;
				clearTimeout(_this.commonJumpUrl_flag_timer);
				_this.commonJumpUrl_flag_timer = setTimeout(function(){
					_this.commonJumpUrl_flag = false;
				},6000);
//				location.href="http://172.31.183.147:8090/iptv-nodeweb//commPage?contentId=31&contentEName=newmain&contentCName=新版首页";
//				return;
                /*间隔60s内不准向下操作
                if (!_this.checkClickValid(6000)) {
                    CT.writeInfo('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb');
                    return;
                }*/
                try {
                    //上传页面日志
                    //xjDataLog.uploadLogPage();
                } catch (e) {
                }
                var defaultFocus = "";
				 var userId = "";
                try {
					if(curFocus && curFocus.FocusID) {
						defaultFocus += curFocus.FocusID;
					}
					userId = xjDataLog.getUserId("userId");
                } catch (error) {

                }
				var paramNames2 = [];
				//debugger;
                if (typeof obj == "string") {
                    window.isKey_log = true;
                    
                     window.location.href = obj + "&defaultFocus=" + defaultFocus + "&isback=1" + "&userId=" + userId;

                    return;


					try{
						if(obj.indexOf("?") > 0) {
							var obj1 = obj.split("?") ;
							var obj2 = obj1[1].split("&");
							var obj_r = obj1[0] + "?"
							for(var i = 0;i < obj2.length;i ++ ){
								if(!obj2[i] || obj2[i].indexOf("=") < 0) continue;
								if("contentId=31" == obj2[i]) {
									window.location.href = "http://172.31.183.147:8090/iptv-nodeweb/commPage?contentId=31&contentEName=newmain&ts=" + (new Date().getTime()% 10000);
									return;
								}
								var obj3 = obj2[i].split("=");
								if(obj3.length > 1 && paramNames2.indexOf(obj3[0]) < 0) {
									
									if(obj_r.indexOf("?") < obj_r.length - 1 && obj_r.indexOf("&") < obj_r.length - 1 ) obj_r += "&";
									obj_r +=  obj3[0] +"=" + encodeURIComponent(obj3[1]);
									paramNames2.push(obj3[0]);
								}
							}
							if(obj_r.length.length > 1 && obj_r.subString(obj_r.length -1) == '&') {
								obj_r = obj_r.substring(0,obj_r.length -1);
							}
						}
					} catch(ex) {}
					if(isBack){
							setTimeout(function(){
								if(obj.indexOf("?") > 0 && obj.indexOf("?") < obj.length  - 1 &&  obj.indexOf("&") < obj.length  - 1) {
									window.location.href = obj + "&userId=" + userId;
								} else if(obj.indexOf("?") >= obj.length  - 1 || obj.indexOf("&") >= obj.length  - 1){
									window.location.href = obj + "userId=" + userId;
								} else {
									window.location.href = obj + "?userId=" + userId;
								}
							},200)
						return;
					} else {
						if(obj.indexOf("?") >0  && obj.indexOf("?") < obj.length + 1 && obj.indexOf("&") < obj.length + 1) {
							//window.location.href = obj +"&defaultFocus=" + defaultFocus + "&isback=1" ;
							setTimeout(function(){
								window.location.href = obj + "&defaultFocus=" + defaultFocus + "&isback=1" + "&userId=" + userId;
							},200)
						//	document.location.href =  obj ;
						} else if(obj.indexOf("?") < 0 ){
							//window.location.href = obj + "?defaultFocus=" + defaultFocus + "&isback=1" + "&userId=" + userId;
							setTimeout(function(){
								window.location.href = obj + "?defaultFocus=" + defaultFocus + "&isback=1" + "&userId=" + userId;
							},200)
						} else {
							setTimeout(function(){
								window.location.href = obj + "defaultFocus=" + defaultFocus + "&isback=1" + "&userId=" + userId;
							},200)
						}
					}
                    // if (obj.indexOf("?") > -1) {
                    //     obj += "&v=" + new Date().getTime();
                    // } else {
                    //     obj += "?v=" + new Date().getTime();
                    // }
                    
                    /*地址中 '//' 拼接的地址
                    obj = obj.replace(/(:?\/\/)/g,function(str){
                        if(str == "//"){
                            return str.replace(str,"/")
                       }else{
                            return str;
                            }
                    });*/
                    // CT.writeInfo('即将跳转地址：' + obj + "&defaultFocus=" + defaultFocus + "&isback=1");
					
					
                   // window.location.href = obj + "&defaultFocus=" + defaultFocus + "&isback=1" + "&userId=" + userId;
                 //  window.location.href = obj ;
                } else if(typeof(obj) == "object"){
					return;
                    obj = obj || {};
                    var urlData = "";
                    for (var key in obj) {
						if(key[obj] && key[obj]) {
							urlData += (key + "=" + encodeURIComponent(obj[key])+ "&");
						}
                    }
                    window.location.href = "page.action?" + urlData +  "defaultFocus=" + defaultFocus + "&userId=" + userId;
                }

            };
            /**
             * 记录当前页面,是调用CT.backPage()做返回方法时,能返回至此页面
             * 页面在跳转的时候如果想保存一个值在url里，可以在页面跳转前使用PAGE.otherPageParam存储
             * @example
             *      CT.goPage();
             */
            this.goPage = function () {
                var _this = this;
                //取地址
                var currentUrl = this.getCurrentUrl();//url + 当前焦点id
                //首页删除cookie
                var mainPathname = this.getColumnCode(AjaxConfig.defaultMainUrl);
                //删除原地跳转的重复的地址
                currentUrl.indexOf(mainPathname) > -1 ? CT.delCookie('backUrlList') : "";
                //添加页面参数
                if (PAGE.otherPageParam !== "" && PAGE.otherPageParam !== "null" && PAGE.otherPageParam !== null && PAGE.otherPageParam !== undefined && PAGE.otherPageParam !== "undefined") {
                    if (_this.isRoute) {
                        currentUrl = currentUrl.split('?')[0] + '?';
                    }
					
					if(PAGE.otherPageParam.indexOf("?") == 0 || PAGE.otherPageParam.indexOf("&") == 0) PAGE.otherPageParam= PAGE.otherPageParam.substring(1);
                    currentUrl += PAGE.otherPageParam;
                }
                //去除cookie中的地址转成数据
                var backUrlList = CT.getCookie('backUrlList');
                backUrlList = decodeURIComponent(backUrlList);
                backUrlList = eval("(" + backUrlList + ")") || [];//获取cookie中的返回地址解码转字数组
                //存信息
                var jStr = "";

                var length = backUrlList.length;
                //当前url如果和最后一个url相同则不存储
                //获取当前页面的 XX.html

                var pathname = location.href;
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
            /**
             *获取当前页面路径
             *@example
             *      CT.getCurrentUrl();
             *      http://xx.xx.xx.xx:xxxx/XuanLi_Cartoon/HD/html/column/columnTest/index.html
             *      得到
             *      /HD/html/column/columnTest/index.html
             */
            this.getCurrentUrl = function () {
                var _this = this;
                var url = window.location.href;
                if (_this.isRoute) {
                    // return url.split('iptv-web')[1];
                    return document.URL.replace(/(https?\:\/\/)([0-9a-zA-Z\_\.\:\-]*\/){2}/g,"/");
                } else {
                    var end = url.indexOf("?") > -1 ? url.indexOf("?") : url.length;
                    var arr = url.substr(0, end).split("/");
                    var currentUrl = "/" + arr.slice(4, arr.length).join("/");
                    var times = new Date();
                    return currentUrl + (currentUrl.indexOf('?') > 0 ? '' : '?1=' + times.getTime());
                }
            };
            /**
             *返回到 前一个页面
             *@example
             *      返回至上一页(在上一页调用了CT.goPage保存页面信息的情况下)
             */
            this.backPage = function () {
                var _this = this;
                if(_this.backPageLock) return;
                _this.backPageLock = true;
                _this.backPage_timer = setTimeout(function(){
                    _this.BackPortalMainPage();
                },10000);
                var backUrlStr = CT.getCookie('backUrlList');
                backUrlStr = backUrlStr && decodeURIComponent(backUrlStr);
                if (backUrlStr) {
                    var backUrlList = eval("(" + backUrlStr + ")");//获取cookie中的返回地址解码转字数组
                } else {
                    var backUrlList = [];

                }
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
				
                _this.commonJumpUrl(AjaxConfig.projectUrl + backUrl,true);
            };
            /**
             * 获取记录记忆页面的上一个地址但不跳转该地址。
             * @example
             *      CT.getPreMemoryPage(index);
             *      index：往前数第几个页面的地址，默认1，即前一个页面地址（记忆数组最后一个）。
             */
            this.getPreMemoryPage = function(index) {
                index = index || 1;
                var backUrlStr = CT.getCookie('backUrlList');
                backUrlStr = backUrlStr && decodeURIComponent(backUrlStr);
                if (backUrlStr) {
                    var backUrlList = eval("(" + backUrlStr + ")"); //获取cookie中的返回地址解码转字数组
                } else {
                    var backUrlList = [];

                }
                //获取指定记忆页面地址
                var memoryPageIndex = backUrlList.length - index;
                var lastBackUrl = backUrlList[memoryPageIndex];

                return lastBackUrl;
            };
            /**
             * 删除记录记忆页面的上一个地址但不跳转该地址。
             * @example
             *      CT.delPreMemoryPage();
             */
            this.delPreMemoryPage = function () {
                var backUrlStr = CT.getCookie('backUrlList');
                backUrlStr = backUrlStr && decodeURIComponent(backUrlStr);
                if (backUrlStr) {
                    var backUrlList = eval("(" + backUrlStr + ")");//获取cookie中的返回地址解码转字数组
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
                var _this = this;
                var filename = '';
                if (pathname) {
                    if (_this.isRoute) {
                        var filename = _this.requestValue('contentName', pathname) || _this.requestValue('contentEName', pathname);
                    } else {
                        var filename = pathname.substr(pathname.lastIndexOf('/') + 0).replace(/\..*$/g, '');
                    }
                } else {
                    //判断是否存在node基本页面信息
                    if (basePageInfo && basePageInfo.commonPageInfo && basePageInfo.commonPageInfo.pageInfo && basePageInfo.commonPageInfo.pageInfo.commPageEname) {
                        filename = basePageInfo.commonPageInfo.pageInfo.commPageEname;
                    } else {
                        pathname = window.location.href;
                        if (_this.isRoute) {
                            var filename = _this.requestValue('contentName', pathname) || _this.requestValue('contentEName', pathname);
                        } else {
                            var filename = pathname.substr(pathname.lastIndexOf('/') + 0).replace(/\..*$/g, '');
                        }
                        
                    }
                }
                return filename;
            };
            /**
             *深拷贝值
             * @example
             * CT.deepClone(target)
             */
            this.deepClone = function (target) {
                var _this = this;
                // 定义一个变量
                var result;
                // 如果当前需要深拷贝的是一个对象的话
                if (typeof target === 'object') {
                // 如果是一个数组的话
                    if (Array.isArray(target)) {
                        result = []; // 将result赋值为一个数组，并且执行遍历
                        for (var i in target) {
                            // 递归克隆数组中的每一项
                            result.push(deepClone(target[i]))
                        }
                     // 判断如果当前的值是null的话；直接赋值为null
                    } else if(target===null) {
                        result = null;
                     // 判断如果当前的值是一个RegExp对象的话，直接赋值    
                    } else if(target.constructor===RegExp){
                        result = target;
                    }else {
                     // 否则是普通对象，直接for in循环，递归赋值对象的所有值
                        result = {};
                        for (var i in target) {
                            result[i] = deepClone(target[i]);
                        }
                    }
                 // 如果不是对象的话，就是基本数据类型，那么直接赋值
                } else {
                    result = target;
                }
                 // 返回最终结果
                return result;
            };
             /*
                // 其他数据转换为坑位推荐数据：
                var transInfo = {
                    // 必传：需要被转换的数据
                    transObj: {},
                    // 必传：转换的类型，比如： 1，大数据片单推荐→坑位推荐数据：1；默认
                    transType: 1,
                    
                    // 选传：目标模板数据
                    targetObj: null,
                    // 选传：设定转换类型不能满足的定制化情景，需转换键名对，如：{"a" : "b"}代表被转换对象的b属性的值，赋值到模板对象的a属性上去。
                    transDiffKeys: {},
                    // 选传：设定转换类型不能满足的定制化情景，需写死某属性值。如：{"a" : b}代表值b，赋值到模板对象的a属性上去。
                    transSpecialKeys: {}
                }
                CT.transObjDataToRec(transInfo);
            */
           this.transObjDataToRec = function (transInfo) {
            var _this = this;
            if (_this.dataType(transInfo) != "object" || !transInfo.transObj || !transInfo.transType) {
                return;
            }
            var commPageEname = basePageInfo.commonPageInfo.pageInfo.pageTrackName || basePageInfo.commonPageInfo.pageInfo.commPageEname;
            var recIndex = transInfo.recIndex || "0";
            var recCartoonId = transInfo.transObj.id || "-1";
            var recCartoonCname = transInfo.transObj.recommendDisplayName || "未获取到";
            var defaultData = {
                "animation":null,
                "booleanFree":1,
                "booleanUp":2,
                "commpageId":3,
                "commpageName":"cartoon_detail_2019v1",
                "createTime":"2020-11-19 15:03:08",
                "filemTime":null,
                "id":36545,
                "isFree":1,
                "more1":"",
                "more2":null,
                "more3":null,
                "more4":null,
                "movedown":null,
                "moveleft":null,
                "moveright":null,
                "movetop":null,
                "onfocus":1,
                "pageRecommendConfigTabVos":null,
                "rankId":2,
                "recommendCornerpic":null,
                "recommendDisplayName":null,
                "recommendDisplayType":null,
                "recommendDisplayValue":null,
                "recommendFocuspic":null,
                "recommendLabelpic":null,
                "recommendPic": null,
                // {
                //     "id":5855,
                //     "picCname":"全新一季，持续更新中 220-229",
                //     "picH":"229",
                //     "picPath":"/pic/main/20201119/20201119103419451_bzsfl.png",
                //     "picW":"220"
                // },
                "recommendTrackName":null
            };
            var templateDataObj = transInfo.targetObj || defaultData;
            // 判断转换类型
            var type = transInfo.transType - 0;
            switch (type) {
                case 1:
                    // 大数据片单对象转坑位推荐对象
                    for (var keyName in transInfo.transObj) {
                        if (transInfo.transObj.hasOwnProperty(keyName)) {
                            templateDataObj[keyName] = transInfo.transObj[keyName];
                        }
                    }
                    // 查看是否有不一样的属性名需要转换属性值
                    if (transInfo.transDiffKeys) {
                        for (var keyName in transInfo.transDiffKeys) {
                            if (transInfo.transDiffKeys.hasOwnProperty(keyName)) {
                                var tempKeyName = transInfo.transDiffKeys[keyName];
                                templateDataObj[keyName] = transInfo.transObj[tempKeyName];
                            }
                        }
                    }
                    // 查看是否有需要写死值得特定属性
                    if (transInfo.transSpecialKeys) {
                        for (var keyName in transInfo.transSpecialKeys) {
                            if (transInfo.transSpecialKeys.hasOwnProperty(keyName)) {
                                templateDataObj[keyName] = transInfo.transSpecialKeys[keyName];
                            }
                        }
                    }
                    //intelligent_页面英文名_坑位数字_卡通id_卡通中文名
                    var intelligentParams = [
                        "intelligent",
                        commPageEname,
                        recIndex,
                        recCartoonId,
                        recCartoonCname
                    ];
                    templateDataObj.recommendTrackName = intelligentParams.join("&");//添加智能推荐焦点点击埋点信息
                    break;
            
                default:
                    break;
            }
            return templateDataObj;
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
                var recommendmap = outJson;
                if (recommend && outJson[recommend]) {
                    recommendmap = outJson[recommend][index];
                }
                var recommendDisplayType = recommendmap.recommendDisplayType;
                var actionUrl = "";
                //推荐详表显示的类型 0 游戏 1 卡通 2视频 3 跳转指定地址 4 通用页面id 5 活动id 6专题 7分类内容 8卡通需要鉴权 88其它
                //涉及到COMM_PAGE_ENAME（页面action）查表`njxj_page_comm_tab`
                //recommendmap.commpageId需要手动修改
                
                var params = undefined;
                switch ( +recommendDisplayType) {
                    case 0:
                        params = {
                            contentId: recommendmap.commpageId || 14,
                            gameId: recommendmap.recommendDisplayValue,
                            contentType: "game",
                            action: "gameDetail",
                            contentName: recommendmap.commpageName || recommendmap.commPageEname
                        };
                        // CT.getAnterByIdOrAction(params);
                        break;
                    case 1:
                        params = {
                            contentId: recommendmap.commpageId || 3,
                            cartoonId: recommendmap.recommendDisplayValue,
                            contentType: "page",
                            action: "videoDetail",
                            contentName: recommendmap.commpageName || recommendmap.commPageEname || "cartoon_detail_2019v1"
                        };
                        // CT.getAnterByIdOrAction(params);
                        break;
                    case 2:
                        params = {
                            contentId: 15,
                            cartoonId: recommendmap.cartoonId,
                            // videoId: recommendmap.id,
                            videoId: recommendmap.recommendDisplayValue || recommendmap.id,
                            contentType: "video",
                            action: "playVideo",
                            contentName: recommendmap.commpageName || recommendmap.commPageEname
                        }
                        // CT.getAnterByIdOrAction(params);
                        break;
                    case 3:
                        var aUrl = recommendmap.recommendDisplayValue;
                        // var params = aUrl.split("?")[1];
                        _this.commonJumpUrl(aUrl);
                        break;
                    case 4:
                        var prePageFocusID = CT.getCookie("prePageFocusID");//对专题的特殊返回做的处理,实现来哪去哪
                        if (prePageFocusID) {
                            CT.delCookie("prePageFocusID")
                        }
                        params = {
                            contentId: recommendmap.commpageId,
                            curFocusId: prePageFocusID,
                            contentType: "page",
                            contentName: recommendmap.commpageName || recommendmap.commPageEname
                        };
                        // CT.getAnterByIdOrAction(params);
                        break;
                    case 5:
                        var activityId = recommendmap.recommendDisplayValue;
                        CT.getActivityUrl(activityId);
                        break;
                    case 6:
                        params = {
                            contentId: recommendmap.commpageId,
                            contentName: recommendmap.commpageName || recommendmap.commPageEname,
                            contentType: "column",
                            action: "column"
                        }
                        // CT.getAnterByIdOrAction(params);
                        break;
                    case 7:
                        params = {
                            contentId: recommendmap.commpageId,
                            parentId: recommendmap.recommendDisplayValue,
                            contentType: "page",
                            action: "category",
                            contentName: recommendmap.commpageName || recommendmap.commPageEname
                        };
                        // CT.getAnterByIdOrAction(params);
                        break;
                    case 8:

                        break;
                    case 88:
                        CT.backPage();
                        break;
                    default:
                        this.BackPortalMainPage();
                        break;
                }
                //智能推荐来源
                try{
                    if (params && (params.contentId || params.contentId == 0) && recommendmap.recommendDisplayValue &&
                        recommendmap.recommendTrackName &&
                        (recommendmap.recommendTrackName + "").indexOf(
                            "intelligent"
                        ) > -1
                    ) {
                        var __params = recommendmap.recommendTrackName.split("&");
                        if(__params.length >= 5) {
                            contentId = CT.querySearchUrlKey(window.location.href,"contentId") || (params.contentId + "").split("&")[0] || "";
                            // CT.querySearchUrlKey(window.location.href,"contentId") + "&" + focusLocation + "&" + curFocus.TempData.recommendDisplayValue;
                            CT.setCookie("intelligent",contentId + "&" + __params[2]+"&" + recommendmap.recommendDisplayValue);
                        }
                        //intelligent_页面英文名_坑位数字_卡通id_卡通中文名
                    }
                }catch(err){

                }
                if(params != undefined) {
                    CT.getAnterByIdOrAction(params);
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
                }
                if (params.contentName) {
                    paramsObj.contentName = params.contentName;
                }

                var jumpArr = [];
                for (var key in paramsObj) {
                 //   if (paramsObj.hasOwnProperty(key)) {
                    if (paramsObj[key]) {
                        jumpArr.push(key + "=" + paramsObj[key]);
                    }
                }
                var jumParam = {};
                var url = AjaxConfig.projectUrl + "commPage?" + jumpArr.join("&");
                url += params.contentType ? ("&contentType=" + params.contentType) : '';  //页面类型
                url += params.cartoonId ? ("&cartoonId=" + params.cartoonId) : '';  //卡通id
                url += params.parentId ? ("&parentId=" + params.parentId) : '';//页面分类id
                url += params.gameId ? ("&gameId=" + params.gameId) : '';//游戏id
                url += params.videoId ? ("&videoId=" + params.videoId) : '';//视频id
                url += params.curFocusId ? ("&curFocusId=" + params.curFocusId) : '';//上一个页面的焦点defaultFocus
                url += params.action ? ("&action=" + params.action) : '';
                if(arguments.length > 1 && typeof(arguments[arguments.length - 1]) === 'object') {
                    var _maps = arguments[arguments.length - 1];
                    for(var key in _maps) {
                        var val = _maps[key];
                        if(val) {
                            url += "&" + key + "=" + val;
                        }
                    }
                }
                CT.commonJumpUrl(url);
                return;
            };
            /**
             * 通过activityId跳转对应的活动页面
             * @param activityId 活动ID
             * @example
             *      CT.getActivityUrl(13);
             */
            this.getActivityUrl = function (activityId) {
                var _this = this;
             /*   interface.findActivityDetailById({ contentId: activityId }, function (e) {
                    var url = e.data.activityUrl;
                    var userId = xjDataLog.getUserId("userId");
                    var pid = xjDataLog.getFromPortal("pid");
                     url += "?userId=" + userId + "&pid=" + pid + "&activityId=" + activityId + "&contentId=" + activityId + "&contentCName=" + e.data.activityCname + "&contentEName=" + e.data.activityEname;
                     url = AjaxConfig.projectUrl + url ;
                     _this.commonJumpUrl(url);
                });*/
                var userId = CT.requestValue("userId") || xjDataLog.getUserId("userId");
                var	pid = CT.getCookie("pid") || xjDataLog.getFromPortal("pid");
                var actiLoginUrl = AjaxConfig.projectUrl + "HD/web/column/activity/actiCommonPage/actiCommonLoginPage.html";
                _this.commonJumpUrl(actiLoginUrl + "?userId=" + userId + "&activityId=" + activityId + "&pid=" + pid);
                // window.location.href=actiLoginUrl+"?userId=" + userId + "&activityId=" + activityId + "&pid=" + pid;

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
                    booleanUpEle.style.top = '6px';//(curClassDomInfo.top + 6) + 'px';
                    booleanUpEle.style.left = '6px';//(curClassDomInfo.left + 6) + 'px';
                    booleanUpEle.style.width = (curClassDomInfo.width - 12) + 'px';
                    booleanUpEle.style.height = (curClassDomInfo.height - 12) + 'px';
                    booleanUpEle.style.backgroundColor = 'black';
                    booleanUpEle.style.color = 'white';
                    booleanUpEle.style.fontSize = '24px';
                    booleanUpEle.style.lineHeight = (curClassDomInfo.height - 10) + 'px';
                    booleanUpEle.style.textAlign = 'center';
                    booleanUpEle.innerHTML = '已下线';
                    //document.getElementById(parentId).appendChild(booleanUpEle);
                    curFocusDiv.appendChild(booleanUpEle);
                }
            };
            /**
             * 退出平台准备函数，默认直接调用退出平台方法，如有需要，在页面自己重写该方法
             */
            this.exitPlatformPre = function(obj) {
                obj = obj || {};
                CT.exitPlatform(obj);
            },
            /**
             * 退出平台
             * @param pageName 当前从哪个页面退出，退出拦截页或其他页面
             * 例：从退出拦截页退出 ，CT.exitPlatform('interceptePage.html');
             */
            this.exitPlatform = function(obj) {
                var _this = this;
                /**
                 * 埋点
                 * */
                var exitObj = obj || {};
                //退出平台的回调
                exitObj.callback && exitObj.callback();
                var pageName = exitObj.pageName || ( xjDataLog.getCommPageEname());
                //倒数第二个页面，默认退出拦截页前的一个页面，其他页面直接HOME键则不然
                var loginOutPageUrl = AjaxConfig.defaultMainUrl;
                var loginOutPageNameInfo = -1;
                try {
                    var lastPageUrl = CT.getPreMemoryPage();
                    if (window.document.referrer) {
                        lastPageUrl = window.document.referrer;
                    }
                    lastPageUrl && (loginOutPageUrl = lastPageUrl);
                    loginOutPageNameInfo =  CT.requestValue('contentEName',loginOutPageUrl);
                } catch (error) {
                    
                }
                //退出平台日志
                xjDataLog.uploadLoginOut({
                    "pageCname": "拦截页面",
                    "pageEname": pageName,
                    "loginType": "loginout",
                    "page" : loginOutPageNameInfo,//必传，登陆的页面名称/退出的页面      必填
                    "loginType" : 2//登陆类型1登陆2登出  非必传  
                });
                //恢复为 DVB 端快捷键使用。
                interface.loggerInfo("退出方法，exit method，curURL1：" + encodeURIComponent(window.location.href));
                try {
                    //离开平台大数据日志
                    var p = new logCollParam();
                    p.contentType = "loginOut";
                    xjDataLog.logCollection(p);
                } catch (error) {
                    
                }
                //退出
                try {
                    var backMain = decodeURIComponent(CT.getCookie("mainBackUrl"));
                    CT.delCookie("mainBackUrl");
                    if (false && backMain && backMain != 'undefined' && backMain != 'null') {
                        interface.loggerInfo('exit our item, throw mainBackUrl in cookie.', 'post');
                        //清除所有cookie
		                CT.clearAllCookie();
                        window.parent.location.href = backMain;
                    } else {
                        try {
                            var returnUrl = Utility.getEnv('PORTAL_ADDR');
                            if(returnUrl){
                                interface.loggerInfo('exit our item, throw window.history.go, ' + returnUrl);
                                location.href = returnUrl;
                                return;
                            }else{
                                try {
                                    JSEngine.ioctl('exit');
                                    interface.loggerInfo('exit our item, throw window.history.go222,' );
                                    // return;
                                } catch (error) {
                                    
                                }
                                Utility.ioctlWrite("EnReach", "ExitBrowser");
                                interface.loggerInfo('exit our item, throw window.history.go333,' );
                            }
                            
                        } catch (error) {
                            
                        }
                       


                        try {
                            var platFormStartHisLen = CT.getCookie('platFormStartHisLen');
                            var goHisLen = window.history.length - platFormStartHisLen + 1;
                            //到进入平台前的那个历史页面
                            interface.loggerInfo('exit our item, throw window.history.go, num: ' + goHisLen);
                            //清除所有cookie
                            CT.clearAllCookie();
                            goHisLen = goHisLen > 0 ? goHisLen : -goHisLen;
                            window.history.go(-goHisLen);
                            // window.history.go(platFormStartHisLen -window.history.length - 1);
                        } catch (error) {
                            
                        }

                        var agent = window.navigator.userAgent;
                        if (agent.indexOf("Skyworth") >= 0 || agent.indexOf("advacend webkit")>=0 ){
                                        var returnUrl=Utility.getEnv('PORTAL_ADDR');
                                        window.location.href = returnUrl;
                        }else if(agent.indexOf("compatible:Android Skyworth") >= 0){
                                        Utility.ioctlWrite("EnReach", "ExitBrowser");
                        }else{
                                        // CT.exitPlatform(CT.requestValue("contentEName"));
                        }
                        return;


                        var agent = window.navigator.userAgent;
                        if (agent.indexOf("compatible:Android Skyworth") >= 0){
                            interface.loggerInfo('exit our item, throw Utility.ioctlWrite mothed.', 'post');
                            //清除所有cookie
                            CT.clearAllCookie();
                            Utility.ioctlWrite("EnReach", "ExitBrowser");
                        }else if(agent.indexOf("Skyworth") >= 0 || agent.indexOf("advacend webkit")>=0){
                            interface.loggerInfo('exit our item, throw Utility.getEnv mothed.', 'post');
                            var returnUrl=Utility.getEnv('PORTAL_ADDR');
                            //清除所有cookie
                            CT.clearAllCookie();
                            location.href = returnUrl;
                        }
                    }
                } catch (e) {
                    var returnUrl = Utility.getEnv('PORTAL_ADDR');
                    if(returnUrl){
                        interface.loggerInfo('exit our item, throw window.history.go, ' + returnUrl);
                        location.href = returnUrl;
                        return;
                    }



                    interface.loggerInfo('exit our item, throw history.go mothed(catch).', 'post')
                    var platFormStartHisLen = CT.getCookie('platFormStartHisLen')
                    var goHisLen = window.history.length - platFormStartHisLen + 1
                    //到进入平台前的那个历史页面
                    interface.loggerInfo('exit our item, throw window.history.go(catch), num: ' + goHisLen)
                    // window.history.go(-goHisLen);
                    window.history.go(platFormStartHisLen -window.history.length - 1);
                    // interface.loggerInfo("退出方法，exit method，KPImothed222");
                }
                //清除cookie
		        // CT.clearAllCookie();
                // CT.delCookie("backUrlList");
                // CT.delCookie("backPrePage");
                // CT.delCookie("prePageInfo");
                // CT.delCookie("logCollParam");
                // if (xjDataLog.boolLeanIsNewSTB) {
                //     interface.loggerInfo("退出方法，exit method，KPImothed");
                //     //设置退出浏览器，设置成功，返回 1；失败，返回#。
                //     xjDataLog.setGlobalVar('BROWSER_TO_DVB','1');
                // } else {
                    // //设置退出浏览器，设置成功，返回 1；失败，返回#。
                    // xjDataLog.setGlobalVar('BROWSER_TO_DVB','1');
                // }
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
             /*   var _this = this;
                return;
				
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
                }, 2000);
				*/
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
                document.body.appendChild(div);
            };
            //停止直播跳转
            this.stopJump = function () {
                return;
		            var _this = this;
                clearTimeout(_this.flagChannel);
                _this.channelNum = "";
                try {
                    var channelNumDiv = _this.$("channelNum");
                    if (channelNumDiv) {
                        document.body.removeChild(channelNumDiv);
                    }
                } catch (e) { }
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
                //调用接口获取当前选择的主题，然后更换。
                if (!e) {
                    return;
                } else {
                    interface.getUserTheme({ params: { userId: xjDataLog.getUserId() }, ajaxConfig: { async: true } }, function (res) {
                        if (res.data) {
                            e.pageInfo.themeInfo = res.data;
                        }
                        //更换主题
                        var pageInfo = e.pageInfo;
                        var commPageEname = pageInfo.commPageEname.split('_')[0];           // 页面英文名
                        var bgPic;                                                          // 背景图片
                        var imgUrl = document.URL.match(/(http|https)(:\/\/)[\w\.:]+/g)[0] || "http://180.96.20.178:28080/";
                        var keys = {
                            /************************************************背景键值*************************************************************************/
                            'newmain': 'THEME_INDEX_BIGPIC',                               // 首页背景
                            'main': 'THEME_INDEX_BIGPIC',                                   // 首页背景
                            'category': 'THEME_CATEGORY_BIGPIC',                            // 全部内容页
                            'personalCenter': 'THEME_HISTORY_BIGPIC',                       // 个人中心页面（收藏、记录、业务介绍等五个分页公共主题背景图）
                            'personal': 'THEME_HISTORY_BIGPIC',                             // 记录页
                            'gkjlym': 'THEME_HISTORY_BIGPIC',                               // 记录页（新）
                            'wdscym': 'THEME_HISTORY_BIGPIC',                               // 收藏页
                            'jzzxym': 'THEME_SEARCH_BIGPIC',                                // 家长中心页
                            'search': 'THEME_SEARCH_BIGPIC',                                // 搜索页
                            'cartoon': 'THEME_DETAIL_BIGPIC',                               // 详情页
                            'apk': 'THEME_APK_BOOT_IMAGE',                                  // 开机图
                            'yjzbym': 'THEME_YJBF_BIGPIC',                                 // 一键播放页
                            'hbzbj': 'THEME_HBZBJ_BIGPIC',                                 // 海贝直播间页（一键播放页导航）
                            'xhbknj': 'THEME_XHBKNJ_BIGPIC',                               // 小海贝看南京页（一键播放页导航）
                            'chslym': 'THEME_CHSL_BIGPIC',                                 // 彩虹森林页（一键播放页导航）
                            'sojym': 'THEME_SOJ_BIGPIC',                                   // 手偶剧页（一键播放页导航）
                            'mfxtym': 'THEME_MFXT_BIGPIC',                                 // 魔法学堂页（一键播放页导航）
                            'njdst': 'THEME_NJDST_BIGPIC',                                 // 南京电视台页（一键播放页导航）
                            /************************************************其他（页面背景外需添加到主题的图）键值***************************************************************/
                            //首页
                            'logo': 'THEME_LOGO',                                           // logo图
                            'interceptePage': 'THEME_INTERCEPTE_BIGPIC',                    // 退出拦截
                            'main_patch': 'THEME_PATCH',                                    // 首页补洞
                            'nav': 'THEME_HEAD_PIC_',                                       // 导航
                            'navRight': 'THEME_HEAD_RIGHT_PIC_',                            // 导航右图
                            'navBelow': 'THEME_HEAD_BELOW_PIC',                              // 导航下图
                            'train': 'THEME_INDEX_TRAIN',                                   // 火车
                            //个人中心---家长中心-家长锁
                            'jzzxym_keyboard': 'THEME_personalCenter_keyboardPic',                         // 家长锁键盘图
                        };
                        // 如果不在已知页面就返回
                        if (!keys[commPageEname]) {
                            return;
                        }
                        /******************************** 设置导航 **************************/
                        if (type == 1 && ((pageInfo.themeInfo + '') != 'null') && pageInfo.themeInfo.themeAttrMap) {
                            var navMid = {}, navRight = {}, navMidArr = [], navRightArr = [];
                            // 获取导航
                            //除眉头中部导航外，另一部分导航是放在右侧还是下侧：'right' || 'below'
                            var otherNav = 'below';
                            for (var key in pageInfo.themeInfo.themeAttrMap) {
                                var keyArr = key.split('_');
                                if (key.indexOf('THEME_HEAD_PIC') > -1) {
                                    navMid[keyArr[3]] = pageInfo.themeInfo.themeAttrMap[key]
                                    navMidArr.push(pageInfo.themeInfo.themeAttrMap[key])
                                } else if (key.indexOf('THEME_HEAD_RIGHT') > -1 && otherNav == 'right') {
                                    navRight[keyArr[4]] = pageInfo.themeInfo.themeAttrMap[key]
                                    navRightArr.push(pageInfo.themeInfo.themeAttrMap[key])
                                } else if (key.indexOf('THEME_HEAD_BELOW') > -1 && otherNav == 'below') {
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
                                for (var i = -1,j = 0; j < navMidArr.length; j++) {
                                // for (var i = 0; i < navMidArr.length; i++) {
                               
                                    try {
                                        try{
                                            if(basePageInfo && basePageInfo.findUserCustomByUserId && ajaxConf.navMustExistRankIdArr.indexOf(basePageInfo.commonPageInfo.recommend_2[j].rankId) < 0 &&  basePageInfo.findUserCustomByUserId.indexOf(basePageInfo.commonPageInfo.recommend_2[j].rankId + "") > -1) {
                                                continue;
                                            }
                                        }catch(e){}
                                        var pics = navMidArr[j].split(',');
                                        i++;
                                        // 推荐位图片
                                        pageInfo.commonPageInfo.recommend_2[i].recommendPic.picPath = pics[0];
                                        // 选中图
                                        pageInfo.commonPageInfo.recommend_2[i].recommendLabelpic.picPath = pics[1];
                                        // 焦点图
                                        pageInfo.commonPageInfo.recommend_2[i].recommendFocuspic.picPath = pics[2];
                                        try {
                                            CT.$('DMSYDH' + i + 'Img').src = AjaxConfig.imgUrl + pics[0];
                                            CT.$('DMSYDHSelectedImg' + i).src = AjaxConfig.imgUrl + pics[1];
                                            CT.$('DMSYDH' + i).src = AjaxConfig.imgUrl + pics[2];
                                        } catch (error) {

                                        }
                                    } catch (error) {

                                    }
                                }
                            }
                            if (navRightArr.length > 0 && pageInfo.commonPageInfo && pageInfo.commonPageInfo.recommend_3 && pageInfo.commonPageInfo.recommend_3.length > 0) {
                                var len = navRightArr.length > pageInfo.commonPageInfo.recommend_3.length ? pageInfo.commonPageInfo.recommend_3.length : navRightArr.length;
                                for (var i = 0; i < len; i++) {
                                    var picArr = navRightArr[i].split(',');
                                    // 推荐位图片
                                    pageInfo.commonPageInfo.recommend_3[i].recommendPic.picPath = picArr[0];
                                    // 选中图
                                    pageInfo.commonPageInfo.recommend_3[i].recommendLabelpic && (pageInfo.commonPageInfo.recommend_3[i].recommendLabelpic.picPath = picArr[1]);
                                    // 焦点图
                                    pageInfo.commonPageInfo.recommend_3[i].recommendFocuspic.picPath = picArr[2];
                                    try {
                                        CT.$('DMSYGN' + i + 'Img').src = AjaxConfig.imgUrl + picArr[0];
                                        CT.$('DMSYGNSelectedImg' + i).src = AjaxConfig.imgUrl + picArr[1];
                                        CT.$('DMSYGN' + i).src = AjaxConfig.imgUrl + picArr[2];
                                    } catch (error) {

                                    }
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
                                if (commPageEname == 'main' || commPageEname == 'newmain') {
                                    // 首页视频补洞
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
                                if (commPageEname == 'jzzxym') {
                                    // 个人中心---家长中心-家长锁 键盘背景
                                    try {
                                        if (((pageInfo.themeInfo + '') != 'null') && pageInfo.themeInfo.themeAttrMap && pageInfo.themeInfo.themeAttrMap[keys['jzzxym_keyboard']]) {
                                            CT.$('lockbg').style.background = 'url(' + AjaxConfig.imgUrl + pageInfo.themeInfo.themeAttrMap[keys['jzzxym_keyboard']].split(',')[0] + ') no-repeat';
                                        }
                                    } catch (e) {

                                    }
                                }
                                break;
                            default:
                                break;
                        }
                    });
                }
            };
            //获取more1、more2...等字段配的值，转成对象
            this.getMoresObj = function (moreValueStr) {
                var _this = this;
                if (!moreValueStr) {
                    return {};
                }
                var obj = {};
                var arr = moreValueStr.split('&');
                for (var index = 0; index < arr.length; index++) {
                    var kayValArr = arr[index].split('=');
                    obj[kayValArr[0]] = kayValArr[1];
                }
                return obj;
            };
            /*
                创建dom元素
                initDomObj : {
                    domTag : 'div',//img等等
                    domAttribute : {
                        'id' : '12px',
                        'src' : '',
                        ...
                    },
                    cssStyle : {
                        'top' : '12px',
                        'zIndex' : 1,
                        ...
                    }
                }
            */
            this.createDom = function (initDomObj) {
                var _this = this;
                if (initDomObj) {
                    try {
                        var dom = document.createElement(initDomObj.domTag);
                        initDomObj.domAttribute = initDomObj.domAttribute || {};
                        for (var keyName in initDomObj.domAttribute) {
                            //设置dom属性
                            dom[keyName] = initDomObj.domAttribute[keyName];
                        }
                        initDomObj.cssStyle = initDomObj.cssStyle || {};
                        for (var keyName in initDomObj.cssStyle) {
                            //设置dom样式
                            dom.style[keyName] = initDomObj.cssStyle[keyName];
                        }
                        return dom;
                    } catch (error) {

                    }
                }
            };
            /**
             * 片单下架弹窗
             * @returns 
             */
            this.undercarriageTip = function(){
                var bDElement = CT.$("bDPop");
                if(!bDElement) {
                    var bDElement = document.createElement("div");
                    bDElement.id = "bDPop";
                    bDElement.style.width = "502px";
                    bDElement.style.height = "320px";
                    bDElement.style.position = "absolute";
                    bDElement.style.zIndex = "9999";
                    bDElement.style.left = (1280 - 502) / 2 + "px";
                    bDElement.style.top = "0px";

                    bDElement.innerHTML = "<img src='" + AjaxConfig.projectUrl + "HD/images/booleandownPop.png'>";
                    bDElement.innerHTML += "<div style='position:absolute;left:0px;top:140px;line-height: 42px;height:320px;width:502px; color:red;font-size:24px;text-align:center;font-weight: bold;'>因版权到期，该内容已经下线，</br>小编正在快马加鞭为你替换新内容！</div>";
                    document.getElementsByTagName("body")[0].appendChild(bDElement);
                    // document.getElementsByTagName("body")[0].innerHTML += "<div id=''></div>"
                }
                bDElement.style.display = "block";
                clearTimeout(window["popTimer"]);
                window["popTimer"] = setTimeout(function(){
                    bDElement.style.display = "none";
                },3000);
            };
        }
        CT = new b2();
    })();

try {
    //给CT对象添加md5加密方法
    (function () {
        "use strict";

        function t(t) {
            if (t) d[0] = d[16] = d[1] = d[2] = d[3] = d[4] = d[5] = d[6] = d[7] = d[8] = d[9] = d[10] = d[11] = d[12] = d[13] = d[14] = d[15] = 0, this.blocks = d, this.buffer8 = l; else if (a) {
                var r = new ArrayBuffer(68);
                this.buffer8 = new Uint8Array(r), this.blocks = new Uint32Array(r)
            } else this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            this.h0 = this.h1 = this.h2 = this.h3 = this.start = this.bytes = this.hBytes = 0, this.finalized = this.hashed = !1, this.first = !0
        }

        var r = "input is invalid type", e = "object" == typeof window, i = e ? window : {};
        i.JS_MD5_NO_WINDOW && (e = !1);
        var s = !e && "object" == typeof self,
            h = !i.JS_MD5_NO_NODE_JS && "object" == typeof process && process.versions && process.versions.node;
        h ? i = global : s && (i = self);
        var f = !i.JS_MD5_NO_COMMON_JS && "object" == typeof module && module.exports,
            o = "function" == typeof define && define.amd,
            a = !i.JS_MD5_NO_ARRAY_BUFFER && "undefined" != typeof ArrayBuffer, n = "0123456789abcdef".split(""),
            u = [128, 32768, 8388608, -2147483648], y = [0, 8, 16, 24],
            c = ["hex", "array", "digest", "buffer", "arrayBuffer", "base64"],
            p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split(""), d = [], l;
        if (a) {
            var A = new ArrayBuffer(68);
            l = new Uint8Array(A), d = new Uint32Array(A)
        }
        !i.JS_MD5_NO_NODE_JS && Array.isArray || (Array.isArray = function (t) {
            return "[object Array]" === Object.prototype.toString.call(t)
        }), !a || !i.JS_MD5_NO_ARRAY_BUFFER_IS_VIEW && ArrayBuffer.isView || (ArrayBuffer.isView = function (t) {
            return "object" == typeof t && t.buffer && t.buffer.constructor === ArrayBuffer
        });
        var b = function (r) {
            return function (e) {
                return new t(!0).update(e)[r]()
            }
        }, v = function () {
            var r = b("hex");
            h && (r = w(r)), r.create = function () {
                return new t
            }, r.update = function (t) {
                return r.create().update(t)
            };
            for (var e = 0; e < c.length; ++e) {
                var i = c[e];
                r[i] = b(i)
            }
            return r
        }, w = function (t) {
            var e = eval("require('crypto')"), i = eval("require('buffer').Buffer"), s = function (s) {
                if ("string" == typeof s) return e.createHash("md5").update(s, "utf8").digest("hex");
                if (null === s || void 0 === s) throw r;
                return s.constructor === ArrayBuffer && (s = new Uint8Array(s)), Array.isArray(s) || ArrayBuffer.isView(s) || s.constructor === i ? e.createHash("md5").update(new i(s)).digest("hex") : t(s)
            };
            return s
        };
        t.prototype.update = function (t) {
            if (!this.finalized) {
                var e, i = typeof t;
                if ("string" !== i) {
                    if ("object" !== i) throw r;
                    if (null === t) throw r;
                    if (a && t.constructor === ArrayBuffer) t = new Uint8Array(t); else if (!(Array.isArray(t) || a && ArrayBuffer.isView(t))) throw r;
                    e = !0
                }
                for (var s, h, f = 0, o = t.length, n = this.blocks, u = this.buffer8; f < o;) {
                    if (this.hashed && (this.hashed = !1, n[0] = n[16], n[16] = n[1] = n[2] = n[3] = n[4] = n[5] = n[6] = n[7] = n[8] = n[9] = n[10] = n[11] = n[12] = n[13] = n[14] = n[15] = 0), e) if (a) for (h = this.start; f < o && h < 64; ++f) u[h++] = t[f]; else for (h = this.start; f < o && h < 64; ++f) n[h >> 2] |= t[f] << y[3 & h++]; else if (a) for (h = this.start; f < o && h < 64; ++f) (s = t.charCodeAt(f)) < 128 ? u[h++] = s : s < 2048 ? (u[h++] = 192 | s >> 6, u[h++] = 128 | 63 & s) : s < 55296 || s >= 57344 ? (u[h++] = 224 | s >> 12, u[h++] = 128 | s >> 6 & 63, u[h++] = 128 | 63 & s) : (s = 65536 + ((1023 & s) << 10 | 1023 & t.charCodeAt(++f)), u[h++] = 240 | s >> 18, u[h++] = 128 | s >> 12 & 63, u[h++] = 128 | s >> 6 & 63, u[h++] = 128 | 63 & s); else for (h = this.start; f < o && h < 64; ++f) (s = t.charCodeAt(f)) < 128 ? n[h >> 2] |= s << y[3 & h++] : s < 2048 ? (n[h >> 2] |= (192 | s >> 6) << y[3 & h++], n[h >> 2] |= (128 | 63 & s) << y[3 & h++]) : s < 55296 || s >= 57344 ? (n[h >> 2] |= (224 | s >> 12) << y[3 & h++], n[h >> 2] |= (128 | s >> 6 & 63) << y[3 & h++], n[h >> 2] |= (128 | 63 & s) << y[3 & h++]) : (s = 65536 + ((1023 & s) << 10 | 1023 & t.charCodeAt(++f)), n[h >> 2] |= (240 | s >> 18) << y[3 & h++], n[h >> 2] |= (128 | s >> 12 & 63) << y[3 & h++], n[h >> 2] |= (128 | s >> 6 & 63) << y[3 & h++], n[h >> 2] |= (128 | 63 & s) << y[3 & h++]);
                    this.lastByteIndex = h, this.bytes += h - this.start, h >= 64 ? (this.start = h - 64, this.hash(), this.hashed = !0) : this.start = h
                }
                return this.bytes > 4294967295 && (this.hBytes += this.bytes / 4294967296 << 0, this.bytes = this.bytes % 4294967296), this
            }
        }, t.prototype.finalize = function () {
            if (!this.finalized) {
                this.finalized = !0;
                var t = this.blocks, r = this.lastByteIndex;
                t[r >> 2] |= u[3 & r], r >= 56 && (this.hashed || this.hash(), t[0] = t[16], t[16] = t[1] = t[2] = t[3] = t[4] = t[5] = t[6] = t[7] = t[8] = t[9] = t[10] = t[11] = t[12] = t[13] = t[14] = t[15] = 0), t[14] = this.bytes << 3, t[15] = this.hBytes << 3 | this.bytes >>> 29, this.hash()
            }
        }, t.prototype.hash = function () {
            var t, r, e, i, s, h, f = this.blocks;
            this.first ? r = ((r = ((t = ((t = f[0] - 680876937) << 7 | t >>> 25) - 271733879 << 0) ^ (e = ((e = (-271733879 ^ (i = ((i = (-1732584194 ^ 2004318071 & t) + f[1] - 117830708) << 12 | i >>> 20) + t << 0) & (-271733879 ^ t)) + f[2] - 1126478375) << 17 | e >>> 15) + i << 0) & (i ^ t)) + f[3] - 1316259209) << 22 | r >>> 10) + e << 0 : (t = this.h0, r = this.h1, e = this.h2, r = ((r += ((t = ((t += ((i = this.h3) ^ r & (e ^ i)) + f[0] - 680876936) << 7 | t >>> 25) + r << 0) ^ (e = ((e += (r ^ (i = ((i += (e ^ t & (r ^ e)) + f[1] - 389564586) << 12 | i >>> 20) + t << 0) & (t ^ r)) + f[2] + 606105819) << 17 | e >>> 15) + i << 0) & (i ^ t)) + f[3] - 1044525330) << 22 | r >>> 10) + e << 0), r = ((r += ((t = ((t += (i ^ r & (e ^ i)) + f[4] - 176418897) << 7 | t >>> 25) + r << 0) ^ (e = ((e += (r ^ (i = ((i += (e ^ t & (r ^ e)) + f[5] + 1200080426) << 12 | i >>> 20) + t << 0) & (t ^ r)) + f[6] - 1473231341) << 17 | e >>> 15) + i << 0) & (i ^ t)) + f[7] - 45705983) << 22 | r >>> 10) + e << 0, r = ((r += ((t = ((t += (i ^ r & (e ^ i)) + f[8] + 1770035416) << 7 | t >>> 25) + r << 0) ^ (e = ((e += (r ^ (i = ((i += (e ^ t & (r ^ e)) + f[9] - 1958414417) << 12 | i >>> 20) + t << 0) & (t ^ r)) + f[10] - 42063) << 17 | e >>> 15) + i << 0) & (i ^ t)) + f[11] - 1990404162) << 22 | r >>> 10) + e << 0, r = ((r += ((t = ((t += (i ^ r & (e ^ i)) + f[12] + 1804603682) << 7 | t >>> 25) + r << 0) ^ (e = ((e += (r ^ (i = ((i += (e ^ t & (r ^ e)) + f[13] - 40341101) << 12 | i >>> 20) + t << 0) & (t ^ r)) + f[14] - 1502002290) << 17 | e >>> 15) + i << 0) & (i ^ t)) + f[15] + 1236535329) << 22 | r >>> 10) + e << 0, r = ((r += ((i = ((i += (r ^ e & ((t = ((t += (e ^ i & (r ^ e)) + f[1] - 165796510) << 5 | t >>> 27) + r << 0) ^ r)) + f[6] - 1069501632) << 9 | i >>> 23) + t << 0) ^ t & ((e = ((e += (t ^ r & (i ^ t)) + f[11] + 643717713) << 14 | e >>> 18) + i << 0) ^ i)) + f[0] - 373897302) << 20 | r >>> 12) + e << 0, r = ((r += ((i = ((i += (r ^ e & ((t = ((t += (e ^ i & (r ^ e)) + f[5] - 701558691) << 5 | t >>> 27) + r << 0) ^ r)) + f[10] + 38016083) << 9 | i >>> 23) + t << 0) ^ t & ((e = ((e += (t ^ r & (i ^ t)) + f[15] - 660478335) << 14 | e >>> 18) + i << 0) ^ i)) + f[4] - 405537848) << 20 | r >>> 12) + e << 0, r = ((r += ((i = ((i += (r ^ e & ((t = ((t += (e ^ i & (r ^ e)) + f[9] + 568446438) << 5 | t >>> 27) + r << 0) ^ r)) + f[14] - 1019803690) << 9 | i >>> 23) + t << 0) ^ t & ((e = ((e += (t ^ r & (i ^ t)) + f[3] - 187363961) << 14 | e >>> 18) + i << 0) ^ i)) + f[8] + 1163531501) << 20 | r >>> 12) + e << 0, r = ((r += ((i = ((i += (r ^ e & ((t = ((t += (e ^ i & (r ^ e)) + f[13] - 1444681467) << 5 | t >>> 27) + r << 0) ^ r)) + f[2] - 51403784) << 9 | i >>> 23) + t << 0) ^ t & ((e = ((e += (t ^ r & (i ^ t)) + f[7] + 1735328473) << 14 | e >>> 18) + i << 0) ^ i)) + f[12] - 1926607734) << 20 | r >>> 12) + e << 0, r = ((r += ((h = (i = ((i += ((s = r ^ e) ^ (t = ((t += (s ^ i) + f[5] - 378558) << 4 | t >>> 28) + r << 0)) + f[8] - 2022574463) << 11 | i >>> 21) + t << 0) ^ t) ^ (e = ((e += (h ^ r) + f[11] + 1839030562) << 16 | e >>> 16) + i << 0)) + f[14] - 35309556) << 23 | r >>> 9) + e << 0, r = ((r += ((h = (i = ((i += ((s = r ^ e) ^ (t = ((t += (s ^ i) + f[1] - 1530992060) << 4 | t >>> 28) + r << 0)) + f[4] + 1272893353) << 11 | i >>> 21) + t << 0) ^ t) ^ (e = ((e += (h ^ r) + f[7] - 155497632) << 16 | e >>> 16) + i << 0)) + f[10] - 1094730640) << 23 | r >>> 9) + e << 0, r = ((r += ((h = (i = ((i += ((s = r ^ e) ^ (t = ((t += (s ^ i) + f[13] + 681279174) << 4 | t >>> 28) + r << 0)) + f[0] - 358537222) << 11 | i >>> 21) + t << 0) ^ t) ^ (e = ((e += (h ^ r) + f[3] - 722521979) << 16 | e >>> 16) + i << 0)) + f[6] + 76029189) << 23 | r >>> 9) + e << 0, r = ((r += ((h = (i = ((i += ((s = r ^ e) ^ (t = ((t += (s ^ i) + f[9] - 640364487) << 4 | t >>> 28) + r << 0)) + f[12] - 421815835) << 11 | i >>> 21) + t << 0) ^ t) ^ (e = ((e += (h ^ r) + f[15] + 530742520) << 16 | e >>> 16) + i << 0)) + f[2] - 995338651) << 23 | r >>> 9) + e << 0, r = ((r += ((i = ((i += (r ^ ((t = ((t += (e ^ (r | ~i)) + f[0] - 198630844) << 6 | t >>> 26) + r << 0) | ~e)) + f[7] + 1126891415) << 10 | i >>> 22) + t << 0) ^ ((e = ((e += (t ^ (i | ~r)) + f[14] - 1416354905) << 15 | e >>> 17) + i << 0) | ~t)) + f[5] - 57434055) << 21 | r >>> 11) + e << 0, r = ((r += ((i = ((i += (r ^ ((t = ((t += (e ^ (r | ~i)) + f[12] + 1700485571) << 6 | t >>> 26) + r << 0) | ~e)) + f[3] - 1894986606) << 10 | i >>> 22) + t << 0) ^ ((e = ((e += (t ^ (i | ~r)) + f[10] - 1051523) << 15 | e >>> 17) + i << 0) | ~t)) + f[1] - 2054922799) << 21 | r >>> 11) + e << 0, r = ((r += ((i = ((i += (r ^ ((t = ((t += (e ^ (r | ~i)) + f[8] + 1873313359) << 6 | t >>> 26) + r << 0) | ~e)) + f[15] - 30611744) << 10 | i >>> 22) + t << 0) ^ ((e = ((e += (t ^ (i | ~r)) + f[6] - 1560198380) << 15 | e >>> 17) + i << 0) | ~t)) + f[13] + 1309151649) << 21 | r >>> 11) + e << 0, r = ((r += ((i = ((i += (r ^ ((t = ((t += (e ^ (r | ~i)) + f[4] - 145523070) << 6 | t >>> 26) + r << 0) | ~e)) + f[11] - 1120210379) << 10 | i >>> 22) + t << 0) ^ ((e = ((e += (t ^ (i | ~r)) + f[2] + 718787259) << 15 | e >>> 17) + i << 0) | ~t)) + f[9] - 343485551) << 21 | r >>> 11) + e << 0, this.first ? (this.h0 = t + 1732584193 << 0, this.h1 = r - 271733879 << 0, this.h2 = e - 1732584194 << 0, this.h3 = i + 271733878 << 0, this.first = !1) : (this.h0 = this.h0 + t << 0, this.h1 = this.h1 + r << 0, this.h2 = this.h2 + e << 0, this.h3 = this.h3 + i << 0)
        }, t.prototype.hex = function () {
            this.finalize();
            var t = this.h0, r = this.h1, e = this.h2, i = this.h3;
            return n[t >> 4 & 15] + n[15 & t] + n[t >> 12 & 15] + n[t >> 8 & 15] + n[t >> 20 & 15] + n[t >> 16 & 15] + n[t >> 28 & 15] + n[t >> 24 & 15] + n[r >> 4 & 15] + n[15 & r] + n[r >> 12 & 15] + n[r >> 8 & 15] + n[r >> 20 & 15] + n[r >> 16 & 15] + n[r >> 28 & 15] + n[r >> 24 & 15] + n[e >> 4 & 15] + n[15 & e] + n[e >> 12 & 15] + n[e >> 8 & 15] + n[e >> 20 & 15] + n[e >> 16 & 15] + n[e >> 28 & 15] + n[e >> 24 & 15] + n[i >> 4 & 15] + n[15 & i] + n[i >> 12 & 15] + n[i >> 8 & 15] + n[i >> 20 & 15] + n[i >> 16 & 15] + n[i >> 28 & 15] + n[i >> 24 & 15]
        }, t.prototype.toString = t.prototype.hex, t.prototype.digest = function () {
            this.finalize();
            var t = this.h0, r = this.h1, e = this.h2, i = this.h3;
            return [255 & t, t >> 8 & 255, t >> 16 & 255, t >> 24 & 255, 255 & r, r >> 8 & 255, r >> 16 & 255, r >> 24 & 255, 255 & e, e >> 8 & 255, e >> 16 & 255, e >> 24 & 255, 255 & i, i >> 8 & 255, i >> 16 & 255, i >> 24 & 255]
        }, t.prototype.array = t.prototype.digest, t.prototype.arrayBuffer = function () {
            this.finalize();
            var t = new ArrayBuffer(16), r = new Uint32Array(t);
            return r[0] = this.h0, r[1] = this.h1, r[2] = this.h2, r[3] = this.h3, t
        }, t.prototype.buffer = t.prototype.arrayBuffer, t.prototype.base64 = function () {
            for (var t, r, e, i = "", s = this.array(), h = 0; h < 15;) t = s[h++], r = s[h++], e = s[h++], i += p[t >>> 2] + p[63 & (t << 4 | r >>> 4)] + p[63 & (r << 2 | e >>> 6)] + p[63 & e];
            return t = s[h], i += p[t >>> 2] + p[t << 4 & 63] + "=="
        };
        var _ = v();
        f ? module.exports = _ : (i.md5 = _, o && define(function () {
            return _
        }))
        try {
            CT.md5 = md5;
        } catch (error) {

        }
    })();
} catch (error) {

}

function C() {
    if (CT == null || CT == undefined || typeof (CT) == 'undefined') return false;
    return true;
}
try{
    CT.delCookie('lastTime');
} catch(e) {}












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


function AddEvent(){
    //事件绑定列表
    this.lister = [];
    /**
     * 绑定事件
     * @param {*} name 注册事件名 
     * @param {*} event 注册事件
     * @example
     *  var addEvent = new AndEvent();
     *  addEvent.on("key",function(){
     *  
     *  })
     */
    this.on = function(key,event){
        var _this = this;
        if(!_this.lister.hasOwnProperty(key)){
            _this.lister[key] = [];
        }
        _this.lister[key].push(event) ;
    }
    /**
     * 触发事件
     * @param {*} key 事件名 
     * @param {*} args 参数
     * @example
     * var addEvent = new AndEvent();
     *  addEvent.emit("key",{a:1,b:2})
     * 
     */
    this.emit = function(key,args){
        var _this = this;
        if(!_this.lister.hasOwnProperty(key)){
            console.log( "未注册" + key + "事件")
            return;
        }
        //获取到绑定的事件列表
        var funcArr = _this.lister[key];
        funcArr.forEach(function(func){
            var type = _this.type(func);
            switch(type){
                case "Function" : {
                    func  && func(args);
                    break;
                };
                default : {
                    console.log(func)
                    return func || console.log(key,type,'不存在');
                }
            }       
        });
    }
    //移除绑定事件
    /**
     * 移除绑定事件
     * @param {*} key 事件名
     * @example
     *  var addEvent = new AndEvent();
     *  addEvent.removeEvent("key"); 
     */
    this.removeEvent = function(key){
        var _this = this;
        if(!_this.lister.hasOwnProperty(key)){
            console.log("未注册该事件");
            return;
        }
        delete _this.lister[key];
    }
    
    //判断类型
    /**
     * 判断参数类型
     * @param {*} params 入参
     * @example
     *  var addEvent = new AndEvent();
     *  addEvent.type("name") // String
     *  addEvent.type(1232) // Number
     *  addEvent.type({}) // Object
     *  addEvent.type([]) // Array
     *  addEvent.type(Undefined) // Undefined
     *  addEvent.type(null) // Null
     * 
     *   
     */
    this.type = function(params){
       var paramsStr =  Object.prototype.toString.call(params);
       var reg = new RegExp("(\\s+)(\\w+)(\])");
       var typeArr = paramsStr.match(reg);
       if(typeArr &&  typeArr instanceof Array ){
           return typeArr[2];
       }else{
           return ""
       }
    }

    this.isEmpty = function(params){
        var _this = this;
        var type = _this.type(params);
        switch(type){
            case "Null" : 
            case "Undefined" : 
                return true;
            break;
            case "Object":
            case "Array" :
                for(var key in params){
                    return false
                }
                return true;
            break;
            case "String" :
                if(params) {
                    return false;
                }
                return true;
                break;
            case "Number":
                return false;
        }
    }
    
}


var addEvent = new AddEvent();