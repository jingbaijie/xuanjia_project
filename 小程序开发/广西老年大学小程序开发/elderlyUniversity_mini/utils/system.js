/**
 * @name system
 * Created by sky014 on 2019/3/15
 * marknum
 *  */

export default {
  attachInfo() {
    let res = wx.getSystemInfoSync()

    wx.WIN_WIDTH = res.screenWidth
    wx.WIN_HEIGHT = res.screenHeight
    wx.IS_IOS = /ios/i.test(res.system)
    wx.IS_ANDROID = /android/i.test(res.system)
    wx.STATUS_BAR_HEIGHT = res.statusBarHeight
    // wx.TITLE_BAR_HEIGHT = res.titleBarHeight
    wx.DEFAULT_HEADER_HEIGHT = 46 // res.screenHeight - res.windowHeight - res.statusBarHeight
    wx.DEFAULT_CONTENT_HEIGHT = res.screenHeight - res.statusBarHeight - wx.DEFAULT_HEADER_HEIGHT
    wx.IS_APP = true

    // bar高度
    wx.TOTAL_TOP_HEIGHT = 68
    if (res.model.indexOf('iPhone X') !== -1) {
      wx.TOTAL_TOP_HEIGHT = 88
    } else if (res.model.indexOf('iPhone') !== -1) {
      wx.TOTAL_TOP_HEIGHT = 64
    }
    wx.TITLE_BAR_HEIGHT = wx.TOTAL_TOP_HEIGHT - res.statusBarHeight

    // 显示加载中loading
    wx.$loading = () => {
      wx.showLoading({
        title: '加载中...'
      })
    }

    // 显示提示信息
    wx.$toast = (message) => {
      wx.showToast({
        title: message,
        icon: 'none'
      })
    }

    // 显示icon为空的消息提示框
    wx.ShowToastNone = (message) => {
      wx.showToast({
        title: message,
        icon: 'none'
      })
    }

    // 返回上一级菜单
    wx.navigateBack1 = () => {
      wx.navigateBack({
        delta: 1
      })
    }

    // 添加多个缓存 
    wx.setStorageAll = (arr) => {
      for (let obj of arr) {
        wx.setStorage({ key: obj.key, data: obj.value })
      }
    }

    /**
     ** 加法函数，用来得到精确的加法结果
     ** 调用：wx.accAdd(arg1,arg2)
     ** 返回值：arg1加上arg2的精确结果
     **/
    wx.accAdd = (arg1, arg2) => {
      let r1, r2, m, c;
      try {
        r1 = arg1.toString().split(".")[1].length;
      }
      catch (e) {
        r1 = 0;
      }
      try {
        r2 = arg2.toString().split(".")[1].length;
      }
      catch (e) {
        r2 = 0;
      }
      c = Math.abs(r1 - r2);
      m = Math.pow(10, Math.max(r1, r2));
      if (c > 0) {
        let cm = Math.pow(10, c);
        if (r1 > r2) {
          arg1 = Number(arg1.toString().replace(".", ""));
          arg2 = Number(arg2.toString().replace(".", "")) * cm;
        } else {
          arg1 = Number(arg1.toString().replace(".", "")) * cm;
          arg2 = Number(arg2.toString().replace(".", ""));
        }
      } else {
        arg1 = Number(arg1.toString().replace(".", ""));
        arg2 = Number(arg2.toString().replace(".", ""));
      }
      return (arg1 + arg2) / m;
    }

    /**
     ** 减法函数，用来得到精确的减法结果
     ** 调用：wx.accSub(arg1,arg2)
     ** 返回值：arg1减去arg2的精确结果
     **/
    wx.accSub = (arg1, arg2) => {
      var r1, r2, m, n;
      try {
        r1 = arg1.toString().split(".")[1].length;
      }
      catch (e) {
        r1 = 0;
      }
      try {
        r2 = arg2.toString().split(".")[1].length;
      }
      catch (e) {
        r2 = 0;
      }
      m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
      n = (r1 >= r2) ? r1 : r2;
      return ((arg1 * m - arg2 * m) / m).toFixed(n);
    }


    /**
     ** 乘法函数，用来得到精确的乘法结果
     ** 调用：wx.accMul(arg1,arg2)
     ** 返回值：arg1乘以 arg2的精确结果
     **/
    wx.accMul = (arg1, arg2) => {
      var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
      try {
        m += s1.split(".")[1].length;
      }
      catch (e) {
      }
      try {
        m += s2.split(".")[1].length;
      }
      catch (e) {
      }
      return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
    }

    /** 
     ** 除法函数，用来得到精确的除法结果
     ** 调用：wx.accDiv(arg1,arg2)
     ** 返回值：arg1除以arg2的精确结果
     **/
    wx.accDiv = (arg1, arg2) => {
      var t1 = 0, t2 = 0, r1, r2;
      try {
        t1 = arg1.toString().split(".")[1].length;
      }
      catch (e) {
      }
      try {
        t2 = arg2.toString().split(".")[1].length;
      }
      catch (e) {
      }
      r1 = Number(arg1.toString().replace(".", ""));
      r2 = Number(arg2.toString().replace(".", ""));
      return (r1 / r2) * Math.pow(10, t2 - t1);
    }

    /**
     ** 价格格式函数，保留2位小数
     ** 调用：wx.moneyFormat(s,n)
     ** 返回值：s保留n位小数的精确结果
     **/
    wx.moneyFormat = (s, n) => {
      n = n > 0 && n <= 20 ? n : 2;
      s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
      let l = s.split(".")[0].split("").reverse(),
        r = s.split(".")[1];
      let t = "";
      for (let i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
      }
      return t.split("").reverse().join("") + "." + r;
    }

  }
}
