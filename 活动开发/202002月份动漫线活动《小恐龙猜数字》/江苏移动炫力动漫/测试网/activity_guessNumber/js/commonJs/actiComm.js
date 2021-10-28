/**
 *url :请求接口地址
 *xhr:对象
 *Async:是否是异步请求（true：异步；false：同步）
 *method:请求方式（POST或GET）
 *params:请求传送的参数
 *Content-Type:请求头格式要求
 *data:请求获取到的信息
 *
 *
 ***调用方法：actiAjax.init({
						url:"http://r.qzone.qq.com/cgi-bin/user/cgi_personal_card",
						method:"get",
						params:{"format":"json","ip":"218.4.255.255"},
						async:true,
						ContentType:"application/x-www-form-urlencoded",
						success:function(data){
							aa.innerHTML=data;
						},
						fail:function(status){

						}
				});
 */
function AjaxFun(option) {
	this.option = null;
	this.url = null; //请求地址
	this.Async = null; //是否异步请求；
	this.method = null; //请求方式
	this.formatParams = function(data) { //对传参进行编码
		var arr = [];
		for(var name in data) {
			arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
		}
		return arr.join("&");
	};
	this.params = null;
	this.paramsStr = null;
	this.contentType = null;
	this.data = null; //请求获取到的信息
	this.init = function(option) { //初始化
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
		if(window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
			xhr = new XMLHttpRequest();
		} else { // code for IE6, IE5
			xhr = new ActiveXObject("Microsoft.XMLHTTP");
		}

		//接收请求
		xhr.onreadystatechange = function() {
			if(xhr.readyState == 4) {
				if(xhr.status == 200) {
					//xhr.responseText.indexOf("{") > -1 ? option.success && option.success(eval("("+xhr.responseText+")")) : option.success && option.success(xhr.responseText);
					option.success && option.success(eval("(" + xhr.responseText + ")"));
				} else {
					option.fail && option.fail(status);
					//window.location.href="404.html";
				}
			}
		}

		//判断请求方式
		if(this.method == "POST") {
			xhr.open(this.method, this.url, this.Async);
			//设置提交时的内容类型
			if(this.contentType == "") {
				xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			} else {
				xhr.setRequestHeader("Content-type", this.contentType);
			}
			xhr.send(this.params);
		} else if(this.method == "GET") {
			xhr.open(this.method, this.url + "?" + this.params, this.Async);
			xhr.send(null);
		} else if(this.method == "POSTSTR") {
			xhr.open("POST", this.url, this.Async);
			//设置提交时的内容类型
			if(this.contentType == "") {
				xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			} else {
				xhr.setRequestHeader("Content-type", this.contentType);
			}
			xhr.send(this.paramsStr);
		} else if(this.method == "GETSTR") {
			xhr.open("GET", this.url, this.Async);
			xhr.send(null);
		}
	};
}
var actiAjax = new AjaxFun();

/*****************************活动需要的基本数据**************************/
//用户名
var actiUserId = CT.getCookie("actiUserId") + "";
//userTooken
var actiUserToken = CT.getCookie("userToken") + "";
//carrierId
var actiCarrierId = CT.getCookie("carrierId") + "";

// 贵州有线
var nns_device_id = CT.getCookie("nns_device_id") + "";
var nns_version = CT.getCookie("nns_version") + "";

//活动ID
var actiActivityId = CT.getCookie("activityId") + "";
//pid
var actiPid = CT.getCookie("pid") + "";
if(actiPid.indexOf("activity") === -1) {
	actiPid = actiPid + "_activityId" + actiActivityId;
}

//活动接口项目名
var actiActionUrl = "http://112.25.69.5:8192/xjcartoon_activity_BtopInterface";
var actiObj = (function() {
	function Acti() {

	};
	/**
	 * 活动接口
	 * @type {{getAuthResultUrl: string, toActiOrderUrl: string, getUserPhoneUrl: string, getChanceUrl: string, setChanceUrl: string, getUserCreditUrl: string, setUserCreditUrl: string, getUserRankListUrl: string, getActivityRankListUrl: string, setUserPhoneUrl: string, getActivityPrizeUrl: string, setPrizeUrl: string, getUserPrizeInfoUrl: string, getPrizeUserInfoUrl: string, getUserDataListUrl: string, setUserDataListUrl: string, setActivityLogUrl: string, TJgetAuthUrl: string, TJOutOrderUrl: string, TJNeiOrderUrl: string}}
	 */
	Acti.prototype = {
		/**
		 *
		 * JSP项目鉴权地址  请求参数: userId  userToken pid  carrierId
		 * 返回结果为json字符串: "OK": 鉴权通过(用户已订购), "ORDER" : 鉴权未通过(用户未订购)
		 */
		getAuthResultUrl: actiActionUrl + "/orderInterface/getActivityAAAResult",

		/**
		 * JSP项目订购地址 请求参数: userId  activityId   userToken   pid   carrierId
		 * 直接进行页面跳转去实现订购跳转
		 */
		toActiOrderUrl: actiActionUrl + "/orderInterface/activityOrder",

		/**
		 * xjcartoon_user_tab
		 * 获取当前用户信息(包含手机号)  请求参数: userId
		 * 返回信息
		 * {
		        id: 1110,
		        userId: "15251461721",//userId
		        userPhone: "15251461721",//userPhone
		        userCredits: 200,//用户积分,平台兑换奖品用
		        userBalance: 0,
		        userIconId: 13,
		        stbId: null,
		        userSex: 0,
		        userOrderstatus: 0,//用户订购状态,不可参考,已鉴权接口请求结果为准
		        createTime: "2017-05-09 20:48:59",//数据创建时间
		        filemTime: "2018-01-04 17:17:17",//上次修改填入数据库时间
		        lastLoginTime: "2018-01-04 17:17:17"//上次登陆时间
		   }
		 *
		 */
		getUserPhoneUrl: actiActionUrl + "/ActivityUserInterface/getUserInfo",

		/**
		 * xjcartoon_activity_chance_tab
		 * 获取用户今日已使用机会  请求参数: activityId  userId
		 *返回信息
		 * {
		        id: null,
		        userId: "15519050028",//用户id
		        activityId: 13,//活动id
		        activityChance: 0,//已使用机会次数
		        loginTime: "2019-03-07 09:56:49",
		        createTime: "2019-03-07 09:56:49"
		    }
		 *
		 */
		getChanceUrl: actiActionUrl + "/ActivityBtopInterface/getActivityChance",

		/**
		 * xjcartoon_activity_chance_tab
		 * 上传用户机会  请求参数: activityId   userId
		 * 返回信息
		 *  true: 上传成功
		 *  false: 上传失败
		 */
		setChanceUrl: actiActionUrl + "/ActivityBtopInterface/saveActivityChance",

		/**
		 * xjcartoon_activity_credit_tab
		 * 获取当前用户积分  请求参数: userId   activityId
		 * 返回信息
		 *该用户在当前活动未有积分信息
		 * {
		        resultMsg: "fail",
		        ACTIVITY_ID: "13",
		        USERID: "15519050028"
		    }
		 *
		 * 该用户在当前活动有积分信息
		 * {
		        resultMsg: "success",
		        creditNum: 280,//用户积分
		        ACTIVITY_ID: "14",
		        USERID: "13092502839"
		    }
		 */
		getUserCreditUrl: actiActionUrl + "/ActivityCreditInterface/getActivityUserCredit",

		/**
		 * xjcartoon_activity_credit_tab
		 * 设置用户积分  请求参数: userId  activityId  creditNum
		 * 返回信息
		 * 积分设置成功
		 * {
		        resultMsg: "success"
		    }
		 *
		 * 积分设置失败
		 * {
		        resultMsg: "fail"
		    }
		 */
		setUserCreditUrl: actiActionUrl + "/ActivityCreditInterface/saveActivityCredit",

		/**
		 * xjcartoon_activity_credit_tab
		 * 获取当前用户积分排行  请求参数: activityId   userId
		 * (该接口使用非正常用户时会返回错误信息,但仍然算是请求成功,只是排行依然为1,谨慎使用)
		 * 返回信息
		 * {
		        resultMsg: "success",
		        rankID: 99,//排行
		        ACTIVITY_ID: "14",
		        USERID: "13092502839"
		    }
		 */
		getUserRankListUrl: actiActionUrl + "/ActivityCreditInterface/getActivityUserCreditRankID",

		/**
		 * xjcartoon_activity_credit_tab
		 * 获取当前活动积分排行榜
		 * 请求参数: activityId pageNo=1(页数)  pageSize=10(该页数内包含几条内容) orderbyType=0(0为升序1为降序)
		 * 返回信息
		 * 有排行信息
		 * {
		        resultMsg: "success",
		        pageNo: 0,
		        pageSize: "1",
		        ACTIVITY_ID: "14",
		        list: [
		            {
		                id: null,
		                userId: "13814885693",
		                activity_Id: 14,
		                activity_credit_num: 2840,//积分
		                loginTime: "2017-07-14 04:53:54",
		                createTime: "2017-07-06 10:39:15",
		                userPhone: "13814885693"//用户手机号
		            }
		        ],
		        orderby: " order by ACTIVITY_CREDIT_NUM desc "
		    }
		 *
		 * 无排行信息
		 * {
		        resultMsg: "fail",
		        pageNo: 0,
		        pageSize: "1",
		        ACTIVITY_ID: "104",
		        orderby: " order by ACTIVITY_CREDIT_NUM desc "
		    }
		 */
		getActivityRankListUrl: actiActionUrl + "/ActivityCreditInterface/getActivityCreditTopList",

		/**
		 * xjcartoon_user_tab
		 * 保存用户电话号码  请求参数: userId  userPhone
		 * 返回信息
		 * true: 保存成功
		 * false: 保存失败
		 */
		setUserPhoneUrl: actiActionUrl + "/ActivityUserInterface/saveUserPhone",

		/**
		 * xjcartoon_prize_tab
		 * 获取本活动的所有奖品 请求参数: activityId  pageNo=1   pageSize=10
		 * 返回信息
		 * 获取奖品成功
		 * {
		        resultMsg: "success",
		        pageNo: 0,
		        pageSize: "10",
		        list: [//奖品列表
		            {
		                prize_id: 99,//奖品ID
		                prize_cname: "话费直充500元",//奖品名称
		                prize_num: 1,/奖品剩余数量
		                prize_pic: null,//奖品图片
		                prize_price: "1",//奖品排行(一等奖,二等奖 . . . .)
		                prize_from: 1,
		                prize_type: "38",//奖品归属活动(归属与活动ID为38的活动)
		                prize_percentage: 1,//中奖概率(可填精确到小数点后两位的数据,该内容只提供数据,具体如何操纵概率自己把握)
		                create_time: "2019-01-07 16:00:27"//活动创建时间
		            }
		        ],
		        PRIZE_TYPE: "38"
		   }
		 */
		getActivityPrizeUrl: actiActionUrl + "/ActivityPrizeInterface/getActivityPrizeList",

		/**
		 * xjcartoon_user_getprize_tab
		 * 保存用户兑换奖品 请求参数: activityId    prizeId(奖品ID)      userId
		 * 返回信息
		 *保存成功(一个用户在一个活动中只允许保存一个奖品)
		 * {
		        resultMsg: "success"
		    }
		 *
		 * 保存失败
		 * {
		        resultMsg: "fail"
		    }
		 */
		setPrizeUrl: actiActionUrl + "/ActivityPrizeInterface/setUserPrize",

		/**
		 * xjcartoon_user_getprize_tab
		 * 获取当前用户获奖信息  请求参数: userId  activityId
		 * 返回信息
		 * 该用户在当前活动拥有奖品(一个用户在一个活动中只允许拥有一个奖品)
		 * {
		        resultMsg: "success",
		        ACTIVITY_ID: "37",
		        list: {
		            PRIZE_FROM: 1,
		            PRIZE_PRICE: "3",
		            GETPRIZE_TYPE: 0,
		            USER_PHONE: "13813809384",
		            CREATE_TIME: "2019-03-07 11:21:44",
		            ACTIVITY_ID: 37,
		            PRIZE_CNAME: "强化版陀螺",
		            USERID: "13813809384"
		        },
		        USERID: "13813809384"
		    }
		 *
		 * 该用户在当前活动未拥有奖品
		 * {
		        resultMsg: "fail",
		        ACTIVITY_ID: "38",
		        USERID: "13813809384"
		    }
		 */
		getUserPrizeInfoUrl: actiActionUrl + "/ActivityPrizeInterface/getActivityUserPrize",

		/**
		 * xjcartoon_user_getprize_tab
		 * 获取所有获奖用户列表  activityId  pageNo=1   pageSize=10
		 * 返回信息
		 * 存在获奖用户
		 * {
		        resultMsg: "success",
		        pageNo: 0,
		        pageSize: "10",
		        ACTIVITY_ID: "37",
		        list: [//获奖用户列表
		            {
		                PRIZE_FROM: 1,
		                PRIZE_PRICE: "1",
		                GETPRIZE_TYPE: 0,
		                CREATE_TIME: "2019-01-29 12:30:58",
		                ACTIVITY_ID: 37,
		                PRIZE_CNAME: "电子读书器",
		                USERID: "18851928349"
		            }
		        ]
		    }
		 *
		 * 不存在获奖用户
		 * {
		        resultMsg: "fail",
		        pageNo: 0,
		        pageSize: "10",
		        ACTIVITY_ID: "38"
		    }
		 */
		getPrizeUserInfoUrl: actiActionUrl + "/ActivityPrizeInterface/getActivityUserPrizeList",

		/**
		 * xjcartoon_activity_userdata
		 *获取当前用户存储信息(可存取任意长度为255内的字符串)   activityId   userId
		 * 返回信息
		 * 在当前活动有存储数据
		 * {
		        resultMsg: "success",
		        ACTIVITY_ID: "37",
		        list: [
		            {
		            userId: "13813809384",
		            activity_Id: 37,
		            user_acti_data: "_a_a_a_a_a_a_a_a_a_a_a_a_a_a_a",
		            login_time: "2019-01-08 09:25:24"
		            }
		        ],
		        USERID: "13813809384"
		    }
		 *
		 * 在当前活动无存储信息
		 * {
		        resultMsg: "fail",
		        ACTIVITY_ID: "37",
		        USERID: "138138093684"
		    }
		 */
		getUserDataListUrl: actiActionUrl + "/ActivityUserDataInterface/getActivityUserDataList",

		/**
		 * xjcartoon_activity_userdata
		 * 设置当前用户存储信息(可存取任意字符串)
		 * 请求参数: activityId   userId    user_acti_data(任意的需存储的字符串信息)
		 * 返回信息
		 * 请求成功
		 * {
		        resultMsg: "success"
		    }
		 *
		 * 请求失败
		 * {
		        resultMsg: "fail"
		    }
		 *
		 */
		setUserDataListUrl: actiActionUrl + "/ActivityUserDataInterface/setActivityUserData",

		/**
		 * xjcartoon_log_activity_tab
		 * 活动存入日志接口
		 * 请求参数: userId(用户名) activityId(活动ID) prePage(上一级页面) nextPage(下一级页面) from_pid(pid) userIp(客户端IP,可为空)
		 *返回信息
		 *
		 * {
		    resultMsg: "success"
		    }
		 */
		setActivityLogUrl: actiActionUrl + "/ActivityLogInterface/setlog_activity",

		/***************** 天津联合活动鉴权订购接口 **************************/
		/**
		 *鉴权接口
		 * 请求参数
		 *  "userId": 用户ID,
		 " pid": pid(入口标识,需拼接上活动ID.例: 1_activityId35),
		 "userToken": 平台进入活动时传递,拼接在眉头,鉴权与订购必要参数,
		 "carrierId": 地方标识,平台进入活动时传递,拼接在眉头,鉴权与订购必要参数,
		 "productId": 厂商productId,厂商提供,鉴权与订购必要参数
		 "contentID": 厂商contentID,厂商提供,鉴权与订购必要参数
		 "serviceID": serviceID,厂商提供,鉴权与订购必要参数
		 "epgType": "GQ"
		 *
		 *
		 */
		TJgetAuthUrl: "http://202.99.114.74:58906/xjcartoon_FrontEndWeb/activityOtherAuth",

		/**
		 * 天津联通统一订购地址
		 *请求参数
		 *  "userId": 用户ID,
		 " pid": pid(入口标识,需拼接上活动ID.例: 1_activityId35),
		 "userToken": 平台进入活动时传递,拼接在眉头,鉴权与订购必要参数,
		 "carrierId": 地方标识,平台进入活动时传递,拼接在眉头,鉴权与订购必要参数,
		 "productId": 厂商productId,厂商提供,鉴权与订购必要参数
		 "contentID": 厂商contentID,厂商提供,鉴权与订购必要参数
		 "serviceID": serviceID,厂商提供,鉴权与订购必要参数
		 "epgType": "GQ"
		 *
		 *
		 */
		TJOutOrderUrl: "http://202.99.114.74:58906/xjcartoon_FrontEndWeb/page.action?action=activityOutOrder",
		/**
		 *天津联通自家订购地址
		 * 请求参数
		 *   "userId": 用户ID,
		 " pid": pid(入口标识,需拼接上活动ID.例: 1_activityId35),
		 "userToken": 平台进入活动时传递,拼接在眉头,鉴权与订购必要参数,
		 "carrierId": 地方标识,平台进入活动时传递,拼接在眉头,鉴权与订购必要参数,
		 "productId": 厂商productId,厂商提供,鉴权与订购必要参数
		 "contentID": 厂商contentID,厂商提供,鉴权与订购必要参数
		 "serviceID": serviceID,厂商提供,鉴权与订购必要参数
		 "epgType": "GQ"
		 *
		 *
		 */
		TJNeiOrderUrl: "http://202.99.114.74:58906/xjcartoon_FrontEndWeb/activityNeiOrder",
		option: null,
		/**
		 * 将对象转(params)换成用&符号拼接的字符串,并返回用&符号拼接的字符串
		 * @param params
		 * @returns {string}
		 */
		trimArgs: function(params) {
			var args = '';
			for(var i in params) {
				if(args !== '') {
					args += '&';
				}
				//args += i + '=' + encodeURIComponent(params[i]);
				args += i + '=' + params[i];
			}
			return args;
		},
		/**
		 * 获取当前Url地址的中name的值,并返回该值
		 * @param name
		 * @returns {null}
		 * @constructor
		 */
		GetQueryString: function(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
			var r = window.location.search.substr(1).match(reg);
			if(r != null) return unescape(r[2]);
			return null;
		},
		/**
		 * 在url中筛选name的值,并返回该值
		 * @param url
		 * @param name
		 * @returns {*}
		 */
		querySearchUrlKey: function(url, name) {
			var search, reg, value;
			if(url) {
				search = url.substring(url.indexOf("?") + 1); //获取问号后面的字符串
			}
			if(name) {
				reg = new RegExp('(^|&)' + name + '=([^&]*)($|&)'); //获取正则表达式
				try {
					value = search.match(reg)[2];
				} catch(e) {
					value = "null";
				}

			} else {
				value = "null"
			}
			return value;
		},
		/**
		 * 获取页面名称,埋点用
		 * @param url
		 * @returns {string}
		 */
		getPageName: function(url) {
			var pageName = '';
			pageName = this.querySearchUrlKey(url, 'action');
			if(pageName != "null") {
				pageName = this.querySearchUrlKey(url, 'action');
			} else {
				try {
					pageName = url.substring(url.lastIndexOf("/") + 1, (url.indexOf("?") == -1 ? url.length : url.indexOf("?")));
				} catch(e) {}

			}
			return pageName;
		},
		/**
		 * 上传页面日志,上传至活动日志表中,如果平台有自己的埋点,则使用平台的埋点方法
		 * @param prePage 上一页
		 * @param nextPage 下一页
		 */
		setLogForActivity: function(prePage, nextPage) {
			var prePageUrl = document.referrer;
			var prePageName = prePage || CT.getCookie("prePageName") + "";
			var nextPageName = nextPage || this.getPageName(window.location.href);
			if(prePageName === "null") {
				prePageName = this.getPageName(prePageUrl);
			}
			CT.setCookie("prePageName", nextPageName);
			var logerOption = {
				"userId": actiUserId,
				"activityId": actiActivityId,
				"prePage": prePageName,
				"nextPage": nextPageName,
				"from_pid": actiPid,
				"userIp": ""
			};
			var logerArgs = this.trimArgs(logerOption);
			var img = new Image();
			img.src = this.setActivityLogUrl + "?" + logerArgs;
		},
		/**
		 * 手动上传日志
		 * @param nextPage 下一页(即当前页)
		 */
		setLogForActivityBySelf: function(nextPage) {
			var prePageUrl = document.referrer;
			var prePageName = CT.getCookie("prePageName") + "";
			var nextPageName = nextPage || this.getPageName(window.location.href);
			if(prePageName === "null") {
				prePageName = this.getPageName(prePageUrl);
			}
			CT.setCookie("prePageName", nextPageName);
			var logerOption = {
				"userId": actiUserId,
				"activityId": actiActivityId,
				"prePage": prePageName,
				"nextPage": nextPageName,
				"from_pid": actiPid,
				"userIp": ""
			};
			var logerArgs = this.trimArgs(logerOption);
			var img = new Image();
			img.src = this.setActivityLogUrl + "?" + logerArgs;
		},
		/**
		 * 获取ajax请求结果
		 * option = {
		 *      "requestUrl": 请求地址
		 *      "type": 请求类型(post/get)
		 *      "success": function(data){}请求成功后的回调方法
		 *      "fail": function(data){}请求失败后的回调方法
		 *  }
		 * @param option
		 */
		getAjaxResult: function(option) {
			option.params.vTime = new Date().getTime();
			actiAjax.init({
				url: option.requestUrl,
				method: option.type || "get",
				params: option.params,
				async: true,
				ContentType: "application/x-www-form-urlencoded",
				success: function(data) {
					option.success && option.success(data);
				},
				fail: function(status) {
					option.fail && option.fail();
				}
			});
		},
		/**
		 * 获取鉴权请求结果
		 * 
		 **/
		getAuthResult: function(fn) {
			var _this = this;
			var actiTime = new Date().getTime();
			this.getAjaxResult({
				requestUrl: _this.getAuthResultUrl,
				params: {
					userId: actiUserId,
					activityId: actiActivityId,
					userToken: actiUserToken,
					carrierId: actiCarrierId,
					nns_device_id: nns_device_id,
					nns_version: nns_version,
					actiTime: actiTime
				},
				success: function(data) {
					fn && fn(data);
				},
				fail: function() {
					fn && fn(false);
				}
			})
		},
		/**
		 * 获取用户手机号
		 * @param fn 回调方法
		 */
		getUserPhone: function(fn) {
			var _this = this;
			this.getAjaxResult({
				requestUrl: _this.getUserPhoneUrl,
				params: {
					userId: actiUserId
				},
				success: function(data) {
					fn && fn(data);
				},
				fail: function() {
					fn && fn(false);
				}
			});
		},
		/**
		 *获取用户已使用机会次数
		 * @param fn 回调方法
		 */
		getChance: function(fn) {
			var _this = this;
			this.getAjaxResult({
				requestUrl: _this.getChanceUrl,
				params: {
					userId: actiUserId,
					activityId: actiActivityId
				},
				success: function(data) {
					fn && fn(data);
				},
				fail: function() {
					fn && fn(false);
				}
			});
		},
		/**
		 * 上传用户此次使用机会
		 * @param fn 回调方法
		 */
		setChance: function(fn) {
			var _this = this;
			this.getAjaxResult({
				requestUrl: _this.setChanceUrl,
				params: {
					userId: actiUserId,
					activityId: actiActivityId
				},
				success: function(data) {
					fn && fn(data);
				},
				fail: function() {
					fn && fn(false);
				}
			});
		},
		/**
		 * 获取用户积分
		 * @param fn 回调函数
		 */
		getUserCredit: function(fn) {
			var _this = this;
			this.getAjaxResult({
				requestUrl: _this.getUserCreditUrl,
				params: {
					userId: actiUserId,
					activityId: actiActivityId
				},
				success: function(data) {
					if(data && data.resultMsg == "success") {
						_this.credit = parseInt(data.creditNum, 10);
					} else {
						_this.credit = 0;
					}
					fn && fn(data);
				},
				fail: function() {
					fn && fn(false);
				}
			});
		},
		/**
		 * 设置用户积分
		 * @param creditNum 需要被设置的积分
		 * @param fn 回调函数
		 */
		setUserCredit: function(creditNum, fn) {
			var _this = this;
			this.getAjaxResult({
				requestUrl: _this.setUserCreditUrl,
				params: {
					userId: actiUserId,
					activityId: actiActivityId,
					creditNum: creditNum
				},
				success: function(data) {
					fn && fn(data);
				},
				fail: function() {
					fn && fn(false);
				}
			});
		},
		/**
		 * 获取当前用户在整体排行版中的情况
		 * @param fn 回调函数
		 */
		getUserRankList: function(fn) {
			var _this = this;
			this.getAjaxResult({
				requestUrl: _this.getUserRankListUrl,
				params: {
					userId: actiUserId,
					activityId: actiActivityId
				},
				success: function(data) {
					fn && fn(data);
				},
				fail: function() {
					fn && fn(false);
				}
			});
		},
		/**
		 * 获取当前活动的整体积分排行,取前十
		 * @param fn 回调函数
		 */
		getActivityRankList: function(fn) {
			var _this = this;
			this.getAjaxResult({
				requestUrl: _this.getActivityRankListUrl,
				params: {
					activityId: actiActivityId,
					pageNo: 1,
					pageSize: 10,
					orderbyType: 1
				},
				success: function(data) {
					fn && fn(data);
				},
				fail: function() {
					fn && fn(false);
				}
			});
		},
		/**
		 * 设置当前用户手机号
		 * @param userPhone  被设置的手机号
		 * @param fn 回调函数
		 */
		setUserPhone: function(userPhone, fn) {
			var _this = this;
			this.getAjaxResult({
				requestUrl: _this.setUserPhoneUrl,
				params: {
					userId: actiUserId,
					userPhone: userPhone
				},
				success: function(data) {
					fn && fn(data);
				},
				fail: function() {
					fn && fn(false);
				}
			});
		},
		/**
		 * 获取当前活动的奖品信息
		 * @param fn 回调函数
		 */
		getActivityPrize: function(fn) {
			var _this = this;
			this.getAjaxResult({
				requestUrl: _this.getActivityPrizeUrl,
				params: {
					activityId: actiActivityId,
					pageNo: 1,
					pageSize: 10
				},
				success: function(data) {
					fn && fn(data);
				},
				fail: function() {
					fn && fn(false);
				}
			});
		},
		/**
		 * 设置当前用户拥有哪个奖品
		 * @param prizeId 被设置的奖品对应的奖品ID
		 * @param fn 回调函数
		 */
		setPrize: function(prizeId, fn) {
			var _this = this;
			this.getAjaxResult({
				requestUrl: _this.setPrizeUrl,
				params: {
					activityId: actiActivityId,
					userId: actiUserId,
					prizeId: prizeId
				},
				success: function(data) {
					fn && fn(data);
				},
				fail: function() {
					fn && fn(false);
				}
			});
		},
		/**
		 * 获取当前用户的中奖信息,一名用户在一个活动中只能拥有一个奖品
		 * @param fn 回调函数
		 */
		getUserPrizeInfo: function(fn) {
			var _this = this;
			this.getAjaxResult({
				requestUrl: _this.getUserPrizeInfoUrl,
				params: {
					activityId: actiActivityId,
					userId: actiUserId
				},
				success: function(data) {
					fn && fn(data);
				},
				fail: function() {
					fn && fn(false);
				}
			});
		},
		/**
		 * 获取当前活动中的中奖用户,取前十
		 * @param fn 回调函数
		 */
		getPrizeUserInfo: function(fn) {
			var _this = this;
			this.getAjaxResult({
				requestUrl: _this.getPrizeUserInfoUrl,
				params: {
					activityId: actiActivityId,
					pageNo: 1,
					pageSize: 10
				},
				success: function(data) {
					fn && fn(data);
				},
				fail: function() {
					fn && fn(false);
				}
			});
		},
		/**
		 * 获取当前用户在当前活动中存储的信息
		 * @param fn 回调函数
		 */
		getUserDataList: function(fn) {
			var _this = this;
			this.getAjaxResult({
				requestUrl: _this.getUserDataListUrl,
				params: {
					activityId: actiActivityId,
					userId: actiUserId
				},
				success: function(data) {
					if(data.resultMsg == "success") {
						_this.userData = data.list[0].user_acti_data;
					} else {
						_this.userData = "";
					}
					fn && fn(data);
				},
				fail: function() {
					_this.userData = "";
					fn && fn(false);
				}
			});
		},
		/**
		 * 设置当前用户需存储的信息
		 * @param userData 需设置的信息
		 * @param fn 回调函数
		 */
		setUserDataList: function(userData, fn) {
			var _this = this;
			this.getAjaxResult({
				requestUrl: _this.setUserDataListUrl,
				params: {
					activityId: actiActivityId,
					userId: actiUserId,
					user_acti_data: userData || _this.userData
				},
				success: function(data) {
					_this.userData = userData;
					fn && fn(data);
				},
				fail: function() {
					fn && fn(false);
				}
			});
		},
		/**
		 * 查看当前页面是否存在选中框focusName
		 * @param focusName
		 * @returns {boolean}
		 */
		checkFocusAble: function(focusName) {
			if(focusName && focusName.indexOf("hands_x0_y0") != -1 && document.getElementById(focusName)) {
				return true;
			} else {
				return false;
			}
		},
		/**
		 * 切换焦点
		 * @param focusName
		 */
		changeFocus: function(focusName) {
			if(this.checkFocusAble(focusName) === true) {
				curFocus.defaultBlur();
				curFocus = getFocusModel6(focusName);
				curFocus.defaultFocus();
			}
		},
		/**
		 *判断当前DOM（objDom）元素是否拥有cls类
		 *
		 * objDom: 查询元素
		 * cls类名
		 * */
		hasClass: function(objDom, cls) {
			return objDom.className.match(new RegExp('(\\s+|^)' + cls + '(\\s+|$)'));
		},
		/**
		 *为当前DOM（objDom）元素添加cls类
		 *
		 * objDom: 查询元素
		 * cls类名
		 * */
		addClass: function(objDom, cls) {
			if(!this.hasClass(objDom, cls)) objDom.className += " " + cls;
		},
		/**
		 *为当前DOM（objDom）元素移除cls类
		 *
		 * objDom: 查询元素
		 * cls类名
		 * */
		removeClass: function(objDom, cls) {
			if(this.hasClass(objDom, cls)) objDom.className = objDom.className.replace(new RegExp('(\\s+|^)' + cls + '(\\s+|$)'), '');
		},
		/**
		 * 跳转页面的时候自动添加时间戳
		 */
		timeStamp: function(url) {
			var getTimestamp = new Date().getTime();
			if(url.indexOf("?") > -1) {
				url = url + "&timeStamp=" + getTimestamp;
			} else {
				url = url + "?timeStamp=" + getTimestamp;
			}
			return url;
		},
		/**
		 * 活动页面之间的跳转方法
		 * @param jumpUrl 要跳转的页面地址，限定于当前活动项目层级下
		 * @param addParam  跳转时需要携带的参数
		 */
		toJumpUrl: function(jumpUrl, addParam) {
			if(jumpUrl) {
				var strArr = [];
				var actiLocalHref = window.location.origin + window.location.pathname.substr(0, window.location.pathname.lastIndexOf("/") + 1);
				strArr["userId"] = this.GetQueryString("userId");
				strArr["pid"] = this.GetQueryString("pid");
				strArr["activityId"] = this.GetQueryString("activityId");
				strArr["vTime"] = new Date().getTime();
				var str = this.trimArgs(strArr);
				if(typeof addParam == "object") {
					addParam = this.trimArgs(addParam);
				}
				if(jumpUrl.indexOf("?") != -1) {
					window.location.href = actiLocalHref + jumpUrl + "&" + str + "&" + addParam;
				} else {
					window.location.href = actiLocalHref + jumpUrl + "?" + str + "&" + addParam;
				}

			}
		}
	};
	return new Acti();
})();

/**
 * 贵州有线工具函数
 **/

var ActiComm = {
	option: null,
	//将对象转换成用&符号拼接的字符串
	trimArgs: function(params) {
		var args = '';
		for(var i in params) {
			if(args !== '') {
				args += '&';
			}
			//args += i + '=' + encodeURIComponent(params[i]);
			args += i + '=' + params[i];
		}
		return args;
	},
	//获取当前Url地址的name的值
	GetQueryString: function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r != null) return unescape(r[2]);
		return null;
	},
	//在url中筛选name的值
	querySearchUrlKey: function(url, name) {
		var search, reg, value;
		if(url) {
			search = url.substring(url.indexOf("?") + 1); //获取问号后面的字符串
		}
		if(name) {
			reg = new RegExp('(^|&)' + name + '=([^&]*)($|&)'); //获取正则表达式
			try {
				value = search.match(reg)[2];
			} catch(e) {
				value = "null";
			}

		} else {
			value = "null"
		}
		return value;
	},
	//获取页面名称,埋点用
	getPageName: function(url) {
		var pageName = '';
		pageName = this.querySearchUrlKey(url, 'action');
		if(pageName != "null") {
			pageName = this.querySearchUrlKey(url, 'action');
		} else {
			try {
				pageName = url.substring(url.lastIndexOf("/") + 1, (url.indexOf("?") == -1 ? url.length : url.indexOf("?")));
			} catch(e) {}

		}
		return pageName;
	},
	//上传页面日志,上传至活动日志表中,如果平台有自己的埋点,则使用平台的埋点方法
	setLogForActivity: function(prePage, nextPage) {
		var prePageUrl = document.referrer;
		var prePageName = prePage || CT.getCookie("prePageName") + "";
		var nextPageName = nextPage || this.getPageName(window.location.href);
		if(prePageName === "null") {
			prePageName = this.getPageName(prePageUrl);
		}
		CT.setCookie("prePageName", nextPageName);
		var logerOption = {
			"userId": actiUserId,
			"activityId": actiActivityId,
			"prePageName": prePageName,
			"nextPageName": nextPageName,
			"from_pid": actiPid,
			"userIp": ""
		};
		var logerArgs = this.trimArgs(logerOption);
		var img = new Image();
		img.src = setActivityLogUrl + "?" + logerArgs;
	},
	//手动添加埋点
	setLogForActivitySelf: function(nextPage) {
		var prePageName = CT.getCookie("prePageName") + "";
		var nextPageName = nextPage;
		CT.setCookie("prePageName", nextPageName);
		var logerOption = {
			"userId": actiUserId,
			"activityId": actiActivityId,
			"prePage": prePageName,
			"nextPage": nextPageName,
			"from_pid": actiPid,
			"userIp": ""
		};
		var logerArgs = this.trimArgs(logerOption);
		var img = new Image();
		img.src = setActivityLogUrl + "?" + logerArgs;
	}
};