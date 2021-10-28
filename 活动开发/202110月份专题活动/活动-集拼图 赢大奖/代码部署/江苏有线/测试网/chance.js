function AjaxFun(option) {
  this.option = null;
  this.url = null; //请求地址
  this.Async = null; //是否异步请求；
  this.method = null; //请求方式
  this.formatParams = function (data) {
    //对传参进行编码
    var arr = [];
    for (var name in data) {
      arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
    }
    return arr.join("&");
  };
  this.params = null;
  this.paramsStr = null;
  this.contentType = null;
  this.data = null; //请求获取到的信息
  this.init = function (option) {
    //初始化
    this.option = option || {};
    this.url = this.option.url; //请求地址
    this.Async = this.option.async || true; //是否异步请求；
    this.method = this.option.method.toUpperCase(); //请求方式
    this.params = this.formatParams(this.option.params);
    this.paramsStr = this.option.paramsStr;
    this.contentType = this.option.ContentType || "";
    this.data = null; //请求获取到的信息

    //创建对象
    //console.log(this.formatParams)
    var xhr;
    if (window.XMLHttpRequest) {
      // code for IE7+, Firefox, Chrome, Opera, Safari
      xhr = new XMLHttpRequest();
    } else {
      // code for IE6, IE5
      xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }

    //接收请求
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          //xhr.responseText.indexOf("{") > -1 ? option.success && option.success(eval("("+xhr.responseText+")")) : option.success && option.success(xhr.responseText);
          option.success && option.success(eval("(" + xhr.responseText + ")"));
        } else {
          option.fail && option.fail(status);
          //window.location.href="404.html";
        }
      }
    };

    //判断请求方式
    if (this.method == "POST") {
      xhr.open(this.method, this.url, this.Async);
      //设置提交时的内容类型
      if (this.contentType == "") {
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      } else {
        xhr.setRequestHeader("Content-type", this.contentType);
      }
      xhr.send(this.params);
    } else if (this.method == "GET") {
      xhr.open(this.method, this.url + "?" + this.params, this.Async);
      xhr.send(null);
    } else if (this.method == "POSTSTR") {
      xhr.open("POST", this.url, this.Async);
      //设置提交时的内容类型
      if (this.contentType == "") {
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      } else {
        xhr.setRequestHeader("Content-type", this.contentType);
      }
      xhr.send(this.paramsStr);
    } else if (this.method == "GETSTR") {
      xhr.open("GET", this.url, this.Async);
      xhr.send(null);
    }
  };
}
var actiAjax = new AjaxFun();
var chance = {
  getChancePath: ajaxConf.webApiUrl + "activity/getUsedChanceForToday",
  setChancePath: ajaxConf.webApiUrl + "activity/saveActivityChance",
  getAjaxResult: function (option) {
    var _this = this;
    option.params.vTime = new Date().getTime();
    actiAjax.init({
      url: option.requestUrl,
      method: option.type || "get",
      params: option.params,
      async: true,
      ContentType: "application/x-www-form-urlencoded",
      success: function (data) {
        option.success && option.success(data);
      },
      fail: function (status) {
        option.fail && option.fail();
      },
    });
  },
  getChance: function (specialUserId, activityId, fn) {
    var _this = this;
    this.getAjaxResult({
      requestUrl: _this.getChancePath,
      params: {
        userId: specialUserId,
        activityId: activityId
      },
      success: function (data) {
        fn && fn(data);
      },
      fail: function () {
        fn && fn(false);
      }
    });
  },
  setChance: function (specialUserId, activityId, fn) {
    var _this = this;
    this.getAjaxResult({
      requestUrl: _this.setChancePath,
      params: {
        userId: specialUserId,
        activityId: activityId
      },
      success: function (data) {
        fn && fn(data);
      },
      fail: function () {
        fn && fn(false);
      }
    });
  }
};

