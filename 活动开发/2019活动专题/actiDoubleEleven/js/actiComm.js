//活动需要的基本数据
//用户名
var actiUserId = CT.getCookie("userId")+"";
//userTooken
var actiUserToken = CT.getCookie("userToken") + "";
//carrierId
var actiCarrierId = CT.getCookie("carrierId") + "";

//活动ID
var actiActivityId = CT.getCookie("activityId") + "";
//pid
var actiPid = CT.getCookie("pid") + "";
if(actiPid.indexOf("activity") === -1){
    actiPid = actiPid + "_activityId" + actiActivityId;
}

//活动接口
//活动接口项目名
var actiActionUrl = "http://112.25.69.22:28080/xjcartoon_activity_BtopInterface/";

//鉴权地址  userId  userToken pid  carrierId
var getAuthResultUrl = actiActionUrl + "orderInterface/getActivityAAAResult";
//订购地址  userId  activityId   userToken   pid   carrierId
var toActiOrderUrl = actiActionUrl + "orderInterface/activityOrder";

//获取当前用户信息(包含手机号)  userId
var getUserPhoneUrl = actiActionUrl + "/ActivityUserInterface/getUserInfo";

//机会接口
//获取用户机会  activityId  userId
var getChanceUrl = actiActionUrl + "/ActivityBtopInterface/getActivityChance";
//上传用户机会  activityId   userId
var setChanceUrl =  actiActionUrl + "/ActivityBtopInterface/saveActivityChance";
//积分接口
//获取当前用户积分  userId   activityId
var getUserCreditUrl = actiActionUrl + "/ActivityCreditInterface/getActivityUserCredit";
//设置用户积分  userId  activityId  creditNum
var setUserCreditUrl = actiActionUrl + "/ActivityCreditInterface/saveActivityCredit";
//获取当前用户积分排行  activityId   userId
var getUserRankListUrl = actiActionUrl + "/ActivityCreditInterface/getActivityUserCreditRankID";
//获取当前活动积分排行榜   activityId pageNo=1  pageSize=10    orderbyType=0(0为升序1为降序)
var getActivityRankListUrl = actiActionUrl + "/ActivityCreditInterface/getActivityCreditTopList";

//保存用户电话号码  userId&userPhone
var setUserPhoneUrl = actiActionUrl + "/ActivityUserInterface/saveUserPhone";
//奖品接口
//保存用户兑换奖品 activityId    prizeId      userId
var setPrizeUrl = actiActionUrl + "/ActivityPrizeInterface/setUserPrize";
//获取本活动的所有奖品 activityId  pageNo=1   pageSize=10
var getActivityPrizeUrl = actiActionUrl + "/ActivityPrizeInterface/getActivityPrizeList";
//获取当前用户获奖信息  userId&activityId
var getUserPrizeInfoUrl = actiActionUrl + "/ActivityPrizeInterface/getActivityUserPrize";
//获取所有获奖用户列表  activityId  pageNo=1   pageSize=10
var getPrizeUserInfoUrl = actiActionUrl + "/ActivityPrizeInterface/getActivityUserPrizeList";

//获取当前用户存储信息(可存取任意字符串)   activityId   userId
var getUserDataListUrl = actiActionUrl + "/ActivityUserDataInterface/getActivityUserDataList";
//设置当前用户存储信息(可存取任意字符串)   activityId   userId    user_acti_data(任意的需存储的字符串信息)
var setUserDataListUrl = actiActionUrl + "/ActivityUserDataInterface/setActivityUserData";

//活动存入日志接口
//userId(用户名) activityId(活动ID) prePage(上一级页面) nextPage(下一级页面) from_pid(pid) userIp(客户端IP,可为空)
var setActivityLogUrl = actiActionUrl + "/ActivityLogInterface/setlog_activity";

//投票接口
//上传用户投票
//userId activityId freeNum(免费投票数) addNum(额外投票数)
//（freeNum为免费投票数，addNum为额外获得投票数，每次指投一票，addNum为1时freeNum 为0，不传两个参数默认传freeNum）
var setActivityVoteUrl = actiActionUrl + "/ActivityVoteInterFace/setUserVote";
//获取用户投票信息  activityId=activityId&pageNo=1&pageSize=100
var getActivityVoteInfoUrl = actiActionUrl + "/ActivityVoteInterFace/getActivityVoteList";
//查询用户投票机会  userId   activityId
var getUserVoteChanceUrl = actiActionUrl + "ActivityVoteInterFace/getActivityUserVoteChancesList";
//增加用户投票次数  userId   activityId
var addUserVoteChanceUrl = actiActionUrl + "ActivityVoteInterFace/getActivityUserVoteChancesList";
//减少用户投票次数  userId   activityId
var reduceUserVoteChanceUrl = actiActionUrl + "ActivityVoteInterFace/setActivityUserVoteReduce";
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
function AjaxFun(option){
    this.option=null;
    this.url=null;//请求地址
    this.Async=null;//是否异步请求；
    this.method=null;//请求方式
    this.formatParams=function(data){//对传参进行编码
        var arr=[];
        for(var name in data){
            arr.push(encodeURIComponent(name)+"="+encodeURIComponent(data[name]));
        }
        return arr.join("&");
    };
    this.params=null;
    this.paramsStr=null;
    this.contentType=null;
    this.data=null;//请求获取到的信息
    this.init=function(option){//初始化
        this.option=option||{};
        this.url=this.option.url;//请求地址
        this.Async=this.option.async||true;//是否异步请求；
        this.method=this.option.method.toUpperCase();//请求方式
        this.params=this.formatParams(this.option.params);
        this.paramsStr = this.option.paramsStr;
        this.contentType=this.option.ContentType||"";
        this.data=null;//请求获取到的信息

        //创建对象
        //console.log(this.formatParams)
        var xhr;
        if (window.XMLHttpRequest)
        {// code for IE7+, Firefox, Chrome, Opera, Safari
            xhr=new XMLHttpRequest();
        }
        else
        {// code for IE6, IE5
            xhr=new ActiveXObject("Microsoft.XMLHTTP");
        }

        //接收请求
        xhr.onreadystatechange=function(){
            if(xhr.readyState == 4 ){
                if(xhr.status == 200){
                    option.success && option.success(eval("("+xhr.responseText+")"));
                } else {
                    option.fail && option.fail(status);
                    //window.location.href="404.html";
                }
            }
        }

        //判断请求方式
        if(this.method=="POST"){
            xhr.open(this.method,this.url,this.Async);
            //设置提交时的内容类型
            if(this.contentType==""){
                xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            }else{
                xhr.setRequestHeader("Content-type",this.contentType);
            }
            xhr.send(this.params);
        }else if(this.method=="GET"){
            xhr.open(this.method,this.url+"?"+this.params,this.Async);
            xhr.send(null);
        }else if(this.method=="POSTSTR"){
            xhr.open("POST",this.url,this.Async);
            //设置提交时的内容类型
            if(this.contentType==""){
                xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            }else{
                xhr.setRequestHeader("Content-type",this.contentType);
            }
            xhr.send(this.paramsStr);
        }else if(this.method=="GETSTR"){
            xhr.open("GET",this.url,this.Async);
            xhr.send(null);
        }
    };
}
var actiAjax = new AjaxFun();



var ActiComm = {
    option: null,
    //将对象转换成用&符号拼接的字符串
    trimArgs: function(params){
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
    GetQueryString: function(name){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    },
    //在url中筛选name的值
    querySearchUrlKey: function(url,name){
        var search,reg,value;
        if(url){
            search = url.substring(url.indexOf("?")+1);//获取问号后面的字符串
        }
        if(name){
            reg = new RegExp('(^|&)' + name + '=([^&]*)($|&)');//获取正则表达式
            try{
                value = search.match(reg)[2];
            }catch(e){
                value = "null";
            }

        }else{
            value = "null"
        }
        return value;
    },
    //获取页面名称,埋点用
    getPageName: function(url){
        var pageName = '';
        pageName = querySearchUrlKey(url,'action');
        if(pageName != "null"){
            pageName = querySearchUrlKey(url,'action');
        }else{
            try{
                pageName = url.substring(url.lastIndexOf("/")+1,(url.indexOf("?")==-1?url.length:url.indexOf("?")));
            }catch(e){
            }

        }
        return pageName;
    },
    //上传页面日志,上传至活动日志表中,如果平台有自己的埋点,则使用平台的埋点方法
    setLogForActivity: function(prePage,nextPage){
        var prePageUrl = document.referrer;
        var prePageName = prePage || CT.getCookie("prePageName") + "";
        var nextPageName = nextPage || getPageName(window.location.href);
        if(prePageName === "null"){
            prePageName = getPageName(prePageUrl);
        }
        CT.setCookie("prePageName",nextPageName);
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
    }
};


