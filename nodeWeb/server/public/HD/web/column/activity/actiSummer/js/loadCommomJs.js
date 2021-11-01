
//页面全局参数
var basePageInfo = {};
//页面日志打印
function loggerInfo(args, method) {
    // var url =   document.URL.match(/(https?\:\/\/)([0-9a-zA-Z\_\.\:\-]*\/){2}/g)[0] + "log?" 
    // if (method && method.toLocaleUpperCase() == "POST") {
    //     var params = { "log": (typeof args == "object" ? JSON.stringify(args) : args) };
    //     if (!args) {
           
    //         return;
    //     }
    //     try {
    //         oAjax = new XMLHttpRequest();
    //     } catch (e) {
    //         oAjax = new ActiveXObject("Microsoft.XMLHTTP");
    //     };
    //     oAjax.open("POST", url, true);
    //     /*/post相比get方式提交多了个这个*/
    //     oAjax.setRequestHeader("Content-type", "application/json;charset=utf-8");
    //     /*//post发送数据*/
    //     oAjax.withCredentials = true;
    //     oAjax.send(JSON.stringify(params));
    //     oAjax.onreadystatechange = function () {
    //         /*/当状态为4的时候，执行以下操作*/
    //         if (oAjax.readyState == 4) {
    //             if (oAjax.status == 200) {
    //                 // success && success(eval("(" + oAjax.responseText + ")"));
    //             } else {
    //                 // fail && fail(status);
    //             }
    //         };
    //     };
    // }else{
    //     var img = new Image();
    //     img.src = url + "log=" + args + "&v=" + new Date().getTime();
    // }

}


/*
 * 加载js到页面的方法
 * */
function loadingJS(url, jsObj) {
    var jsObjType = typeof jsObj;
    if (jsObjType == 'string') {
        var oScript = document.createElement('script');
        oScript.type = 'text/javascript';
        oScript.async = true;
        oScript.src = url + jsObj + '.js?v=' + new Date().getTime();
        document.getElementsByTagName('body')[0].appendChild(oScript);
    } else if (jsObjType == 'object') {
        for (var i = 0; i < jsObj.length; i++) {
            var oScript = document.createElement('script');
            oScript.type = 'text/javascript';
            oScript.async = true;
            oScript.src = url + jsObj[i] + '.js?v=' + new Date().getTime();
            document.getElementsByTagName('body')[0].appendChild(oScript);
        }
    }
}
//加载公共js
! function () {
    function loadingJS0(url, jsObj) {
        var jsObjType = typeof jsObj;
        if (jsObjType == 'string') {
            var jsUrl = url + jsObj + '.js?v=' + new Date().getTime();
            document.write('<script type="text/javascript" src=' + jsUrl + '>' + '</script>');
        } else if (jsObjType == 'object') {
            var jsUrl = "";
            for (var i = 0; i < jsObj.length; i++) {
                jsUrl += '<script type="text/javascript" src=' + url + jsObj[i] + '.js?v=' + new Date().getTime() /* 112 */ + '>' + '</script>';

            }
            document.write(jsUrl);
        }
    }
    // var commomJsArr = ["config", 'common3_4', 'ajax', 'key3_4', 'interface', 'logData', 'orderJs', 'videoPlayer'];
    var commomJsArr = ["config"];
    var projectUrl = document.URL.match(/(https?:\/\/)([a-zA-Z0-9\._\-:]*(\/)){2}/g)[0] || "http://10.69.52.56:28080"; //IP + 项目端口
    loadingJS0(projectUrl + 'HD/js/', commomJsArr);
    loadingJS0(projectUrl + 'HD/commonJs/', ["main"]);
    

}();

! function () {
    var loadingImg = new Image();
    var imgBox = document.createElement("div");
    imgBox.id = 'loadingImgBox';
    imgBox.style.cssText = "postion:absolute;top:0px;left:0px;z-index:100000;width:1280px;height:720px";
    loadingImg.src = document.URL.match(/(https?:\/\/)([a-zA-Z0-9\._\:\-]*(\/)){2}/g)[0] + "HD/images/loading.gif";
    loadingImg.style.cssText = "position:absolute;top:298px;left:578px;";
    imgBox.appendChild(loadingImg);
    document.body && document.body.appendChild(imgBox);

    window.addEventListener("load", function () {
        try {
            var dom = document.getElementById('loadingImgBox');
            dom && dom.parentNode.removeChild(dom);
        } catch (error) {

        }
    })
}()


var errorTip = {
    isError: false,
    isDebug: false,
    writeErrorInfo: function (msg) {
        /*debugger*/
        var _this = this;
        if (_this.isDebug) {
            if (_this.isError) {
                var elm = document.createElement("div");
                elm.id = "errorText";
                elm.style.cssText = "position: absolute;top:100px;left:100px;z-index:100000;background-color:rgba(0,0,0,0.8);color:pink;font-size:24px;";
                elm.innerHTML = msg + "<br>";
                document.body && document.body.appendChild(elm);
                this.isError = false;
                return;
            } else {
                var elm = document.getElementById("errorText");
                elm && elm.append(elm.innerHTML + msg + "<br>");
            }
        }

    },
    init: function () {
        var _this = this;
        window.onerror = errorFun;
        function errorFun(msg, url, line) {
            var txt = "";
            txt += "msg:" + msg + ":Line:" + line + ";>>url>>" + url + ";>>>curUrl>>" + window.location.href;
            _this.writeErrorInfo(txt);
            loggerInfo(txt);
            return false;
        };
    }

};
errorTip.init();