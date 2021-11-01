addEvent.on("pageEvent", function (e) {


    var transferObj = basePageInfo.transferObj;
    var reqQuery = basePageInfo.reqQuery;
    var personalCenter = {
        //用户id
        userId: xjDataLog.getUserId(),
        //性别
        babySex: null,
        //昵称
        babyRname: "猪猪侠",
        //年龄区间
        ageRegion: null,
        //电话
        userPhoneNum: "",
        //头像昵称的索引
        babyIndex: 8,
        //用户信息主键id
        id: null,
        //页面id
        contentId: basePageInfo.personalCenterPageInfo.pageInfo.commonPageId || 1,
        //返回事件标识符
        pageIndex: 0,
        //是否订购标识符 订购 1 未订购 0
        isOrder: null,
        //年龄标识符
        ageMark: null,
        //具体年龄
        userAge: null,
        //初始化展示爱好数组
        likeMarkArr: [],
        //上传信息 爱好字符串
        likeMarkStr: "",
        //是否注册完整标识符 完整 1 不完整 0  more2
        registerSuc: null,
        //是否第一次注册 第一次注册 1  不是第一次 0
        newRegister: null,
        babyNameArr: ['贝乐虎', '冰公主', '驰小飞', '炽焰队长', '萌可', '巨神战击队', '恐龙阿贡', '奶龙', '猪猪侠', '小麦奇','彩虹'],
        //头像数组
        avatarArr: basePageInfo.commonPageInfo.recommend_5,

        //页面离开上传信息
        navBtnOtherFocusEvent: function (idx) {
            personalCenter.userList(function(){
                generalLeftNavObj.navBtnOtherFocusEvent(idx);
            });
        },

        //初始化
        init: function () {
            var _this = this;
            //重写左侧第二个按钮的获焦事件
            for (var i = 0; i < buttons.length; i++) {
                if (buttons[i].id.indexOf("hands_x0_y0_DMEJleftceterbutton") >= 0) {
                    var idx = buttons[i].id.replace("hands_x0_y0_DMEJleftceterbutton", "").replace("_", "");
                    idx -= 0;
                    if (idx > 0) {
                        buttons[i].otherFocusEvent = "JavaScript:personalCenter.navBtnOtherFocusEvent(" + idx + ")"
                    } else if(idx == 0) {
                        buttons[i].otherFocusEvent = "";
                        CT.$('leftNavBtnLabel0').style.visibility = "visible";
                    }
                }
            }
            // try{
            //     if(window.navigator.userAgent.toUpperCase().indexOf("WIN64") > 0) {
            //         orderJs.auth_cache_info = {
            //             //缓存标识
            //             cacheId: null,
            //             //鉴权返回值: result: -1 未鉴权,1: 鉴权已订购,其他:鉴权未通过;
            //             result: 1,
            //             //authTime: 当前缓存的鉴权时间;
            //             authTime: new Date().getTime(),
            //             //data,鉴权返回信息;
            //             data: [],
            //             //time_out:鉴权有效时间(毫秒) 0:长期有效
            //             time_out: 0,
            //             // cache_strategy:鉴权策略:默认(0或没有) 只缓存已订购用户; 1 只缓存未订购用户, 2 缓存所有;
            //             cache_strategy: 2
            //         };
            //     xjDataLog.getUserId = function(){return "04440714190000050"};
            //     }
            // }catch(e){}
            personalCenter.insertPoints();
            personalCenter.initUserInfo();
            PAGE.focusInit();
            PAGE.changeFocus("hands_x0_y0_DMEJleftceterbutton0_");
            personalCenter.getUserInfoList();
            personalCenter.getUserSumPoints();
        },

        //用户进入上传默认信息
        initUserInfo: function () {
            interface.getUserInfoList({
                params: {
                    userid: xjDataLog.getUserId() 
                } 
            }, function (data) {
                //是否有数据
                if (!data || !data.data || data.data.length == 0) {
                    interface.addUserInfo(
                        {
                            params: {
                                nickName: "猪猪侠",
                                age: 1,
                                userid: xjDataLog.getUserId(),
                                more1: 8,
                            }
                        },
                        function (res) {
                            console.log(res);
                        }
                    );
                }
                console.log("a" + data);
            });
            
        },

        //进入首页加签到积分
        insertPoints: function () {
            var _this = this;
            var isOrder = null;
            // CT.alertTip("进入首页加签到积分",{time:1000});
            var authObj = {
                successCallback: function () {
                    isOrder = true;
                    //已订购
                    CT.$('vipMark').style.visibility = "visible";
                    interface.insertPoints({
                        params:{
                            userid:xjDataLog.getUserId(),
                            activityId: 1,
                            taskid: 1,
                            prizeid: 7,
                            points: 30
                        },
                    },function(res){
                        console.log(res);
                    });
                    setTimeout(function(){
                        interface.insertPoints({
                            params:{
                                userid: xjDataLog.getUserId(),
                                activityId: 1,
                                taskid: 2,
                                prizeid: 4,
                                points: 3
                            },
                        },function(res){
                            console.log(res);
                        });
                    },100)
                },failCallback:function() {
                    isOrder = false;
                    //未订购
                    CT.$('vipMark').style.visibility = "hidden";
                    interface.insertPoints({
                        params:{
                            userid: xjDataLog.getUserId(),
                            activityId: 1,
                            taskid: 2,
                            prizeid: 3,
                            points: 2
                        },
                    },function(res){
                        console.log(res);
                    });
                }
            }
            setTimeout(function(){
                orderJs.getAuth(authObj);
            },0)
        },

        /* 根据所传userId和activityId获取用户总积分 */
        getUserSumPoints: function () {
            var _this = this
            interface.getUserSumPoints({
                params:{
                    userId: xjDataLog.getUserId(),
                    activityId: 1,
                }
            }, function (res) {
                CT.$("points").innerHTML = res.data.sumPoints;
            })
        },
        /* 获取用户信息 */
        getUserInfoList: function () {
            var _this = this
            interface.getUserInfoList({ params: { userid: xjDataLog.getUserId() } }, function (res) {
                //是否有数据
                if (!res || !res.data || res.data.length == 0) {
                    _this.newRegister = 1;
                    CT.$("babyNameSpan").innerHTML = "未设置";
                    CT.$("phoneNum").innerText = "请输入电话号码";
                    CT.$("ageNum").innerText = "请输入年龄";
                } else {
                    //获取的用户信息同步到本地
                    if (res.data[0].id != null) {
                        _this.id = res.data[0].id;
                    }
                    //初始化性别
                    _this.babySex = res.data[0].sex;
                    _this.putSex(_this.babySex);
                    //初始化年龄区间
                    _this.ageRegion = res.data[0].ageRegion;
                    // _this.toSetAge(_this.ageRegion);
                    if (_this.ageRegion && _this.ageRegion.length > 0 && _this.ageRegion != null) {
                        CT.$("ageNum").innerText = _this.ageRegion;
                    }
                    //初始化年龄
                    _this.userAge = res.data[0].age;
                    // _this.toSetAge(_this.ageRegion);
                    if (_this.userAge && _this.userAge.length > 0 && _this.userAge != null) {
                        CT.$("ageNum").innerText = _this.userAge;
                    }
                    //初始化爱好
                    if (res.data[0].hobby == null || res.data[0].hobby.length < 1) {
                        _this.likeMarkArr = [];
                    } else if (res.data[0].hobby.length == 1) {
                        _this.likeMarkArr.push( parseInt(res.data[0].hobby) );
                    } else if (res.data[0].hobby.length > 2) {
                        if (res.data[0].hobby[0] == ",") {
                            res.data[0].hobby = res.data[0].hobby.slice(1);
                        }
                        _this.likeMarkArr = res.data[0].hobby.split(",");
                    }
                    
                    //头像昵称关联的id
                    _this.babyIndex = Number(res.data[0].more1);
                    //页面初始化头像
                    CT.$("avatar").src = AjaxConfig.imgUrl + _this.avatarArr[_this.babyIndex].recommendPic.picPath;
                    _this.babyRname = _this.babyNameArr[_this.babyIndex];
                    CT.$("babyNameSpan").innerHTML = _this.babyRname;
                    //电话
                    _this.userPhoneNum = res.data[0].phone;
                    if (_this.userPhoneNum.length != 0 && _this.userPhoneNum != null) {
                        CT.$("phoneNum").innerText = _this.userPhoneNum;
                    }
                    _this.showHobbyMark()
                }
            })
        },

        /**
         * 随机生产昵称和头像
         */
        randomName: function () {
            var _this = this
            var babyIndex = Math.floor((Math.random() * _this.babyNameArr.length));
            _this.babyIndex = babyIndex;
            _this.babyRname = _this.babyNameArr[babyIndex];
            CT.$("babyNameSpan").innerHTML = _this.babyRname;
            CT.$("avatar").src = AjaxConfig.imgUrl + _this.avatarArr[babyIndex].recommendPic.picPath;
        },

        
        //设置性别 男 1  女 0
        putSex: function (sex) {
            var _this = this;
            if (sex == 0) {
                CT.$("boyMark").style.visibility = "hidden";
                CT.$("girlMark").style.visibility = "visible";
                _this.babySex = 0;
            } else if (sex == 1) {
                CT.$("boyMark").style.visibility = "visible";
                CT.$("girlMark").style.visibility = "hidden";
                _this.babySex = 1;
            }
            _this.pageIndex = 0;
        },

        //设置年龄
        toSetAge: function (num) {
            var _this = this;
            _this.pageIndex = 2;
            CT.$("baby_info").style.visibility = "hidden";
            CT.$("changePhoneNum").style.visibility = "visible";
            // CT.$("ageNum").innerHTML = CT.$("phoneNum").innerHTML;
            // CT.$("hands_x0_y0_inputAgeNum_").style.visibility = 'hidden';
            CT.$("inputAgeNum").style.visibility = 'hidden';
            CT.$('vipMark').style.visibility = "hidden";
            CT.$('girlMark').style.visibility = "hidden";
            CT.$('boyMark').style.visibility = "hidden";
            CT.$('h2title').innerText = "年龄修改";
            CT.$('inputTips').innerText = "请使用遥控器输入年龄";
            // _this.hiddenAgeMark();
            _this.hiddenHobbyMark();
            PAGE.changeFocus('hands_x0_y0_num1_');
            // CT.$("ageNum").innerText = num;
        },

        //上传爱好字符串封装的方法
        uploadLikeStr: function () {
            var _this = this;
            _this.likeMarkStr = "";
            for(var i = 1; i < 10; i++) {
                if (CT.$("likeMark" + i).style.visibility == "visible") {
                    _this.likeMarkStr += ",";
                    _this.likeMarkStr += i;
                }
            }
            if (_this.likeMarkStr.length != 0 && _this.likeMarkStr.indexOf(",") == 0) {
                _this.likeMarkStr = _this.likeMarkStr.substr(1);
            }
        },

        /* 离开页面上传或者更新用户信息 */
        userList: function (cb) {
            var _this = this;
            _this.uploadLikeStr();
            _this.uploadAgeRegion();
            clearTimeout(_this.cbTimer);
            _this.cbTimer = setTimeout(function(){
                cb&&cb()
            },500)
            //进入首页已注册，直接更新信息
            interface.pointsUpdateUserInfo({
                params: {
                    nickName: CT.$("babyNameSpan").innerHTML,
                    sex: _this.babySex,
                    id:_this.id,
                    age: _this.userAge,
                    ageRegion: _this.ageRegion,
                    phone:  CT.$("phoneNum").innerText,
                    userid: _this.userId,
                    hobby: _this.likeMarkStr,
                    more1: _this.babyIndex,
                }
            },function(res) {
                if (res.errorCode == "1000" || res.errorMsg == "操作成功") {
                    console.log(res);
                }
                clearTimeout(_this.cbTimer);
                cb&&cb()
            })
            //填写完整就调用注册接口
            if (_this.babySex != null && _this.userAge.length > 0 && _this.userPhoneNum.length != 0 && _this.likeMarkArr.length != 0){
                interface.insertPoints({
                    params:{
                        userid: xjDataLog.getUserId(),
                        activityId: 1,
                        prizeid: 2,
                        taskid: 3,
                        points: 30
                    }
                },function(res){
                    console.log("insertPoints",res)
                });
            }
        },

        //隐藏年龄选中状态
        hiddenAgeMark: function () {
            // CT.$("ageNum").innerText = "";
        },

        //隐藏爱好选中状态
        hiddenHobbyMark: function () {
            for (var i = 1; i <= 9; i++) {
                if (CT.$("likeMark" + i)) {
                    CT.$("likeMark" + i).style.visibility = "hidden";
                }
            }
        },

        //展示爱好选中状态
        showHobbyMark: function () {
            var _this = this;
            if (_this.likeMarkArr.length > 0) {
                _this.likeMarkArr.forEach(function (num) {
                    CT.$("likeMark" + num).style.visibility = "visible";
                })
            }
        },

        //选择喜好
        setHobby: function (num) {
            var _this = this;
            if (CT.$("likeMark" + num) && CT.$("likeMark" + num).style.visibility == "hidden") {
                CT.$("likeMark" + num).style.visibility = "visible";
                _this.likeMarkArr.push(num);
            } else {
                CT.$("likeMark" + num).style.visibility = "hidden";
                _this.likeMarkArr.pop();
            }
        },

        //键盘输入
        inputNum: function (key) {
            var _this = this;
            if (CT.$("baby_info").style.visibility == 'hidden') {
                //输入电话
                if (_this.pageIndex == 1) {
                    if (typeof key == 'number' && CT.$("phoneNumText").innerText.length < 11) {
                        CT.$("phoneNumText").innerText += key;
                        if (CT.$("phoneNumText").innerText.length == 11) {
                            PAGE.changeFocus("hands_x0_y0_numConfirm_");
                        }
                    } else if (key == 'del') {
                        var numStr = CT.$("phoneNumText").innerText;
                        CT.$("phoneNumText").innerText = numStr.slice(0, numStr.length - 1);
                    }
                } else if (_this.pageIndex == 2) {
                    if (CT.$("phoneNumText").innerText == "请输入年龄") {
                        CT.$("phoneNumText").innerText = "";
                    }
                    //输入年龄
                    if (typeof key == 'number' && CT.$("phoneNumText").innerText.length < 2) {
                        CT.$("phoneNumText").innerText += key;
                        if (CT.$("phoneNumText").innerText.length == 2) {
                            PAGE.changeFocus("hands_x0_y0_numConfirm_");
                        }
                    } else if (key == 'del') {
                        var numStr = CT.$("phoneNumText").innerText;
                        CT.$("phoneNumText").innerText = numStr.slice(0, numStr.length - 1);
                    }
                }
                //删除全部数字就提示
                if (CT.$("phoneNumText").innerText.length == 0) {
                    if (_this.pageIndex == 1) {
                        CT.$("phoneNumText").innerText = "请输入电话号码";
                    } else {
                        CT.$("phoneNumText").innerText = "请输入年龄";
                    }
                }
            }
        },

        //设置电话号码
        toSetPhoneNum: function () {
            var _this = this;
            _this.pageIndex = 1;
            CT.$("baby_info").style.visibility = "hidden";
            CT.$("changePhoneNum").style.visibility = "visible";
            CT.$("phoneNumText").innerHTML = CT.$("phoneNum").innerHTML;
            CT.$("inputPhoneNum").style.visibility = 'hidden';
            CT.$('vipMark').style.visibility = "hidden";
            CT.$('girlMark').style.visibility = "hidden";
            CT.$('boyMark').style.visibility = "hidden";
            CT.$('h2title').innerText = "电话号码修改";
            CT.$('inputTips').innerText = "请使用遥控器输入11位数字";
            _this.hiddenAgeMark();
            _this.hiddenHobbyMark();
            PAGE.changeFocus('hands_x0_y0_num1_');
        },

        //上传年龄区间
        uploadAgeRegion: function () {
            var _this = this;
            if (parseInt(CT.$('ageNum').innerText) != NaN) {
                _this.userAge = parseInt(CT.$('ageNum').innerText);
                if (_this.userAge < 4) {
                    _this.ageRegion = 0;
                } else if (_this.userAge < 7) {
                    _this.ageRegion = 4;
                } else if (_this.userAge < 13) {
                    _this.ageRegion = 7;
                } else if (_this.userAge < 18) {
                    _this.ageRegion = 13;
                }    
            }
        },

        //提交电话号码或者年龄
        confirmNum: function () {
            var _this = this;
            switch (_this.pageIndex) {
                case 0:
                    break;
                case 1:
                    if (CT.$("phoneNumText").innerText.length == 11) {
                        var numStr = CT.$("phoneNumText").innerText;
                        CT.$("phoneNum").innerText = numStr;
                        CT.$("baby_info").style.visibility = "visible";
                        CT.$("changePhoneNum").style.visibility = "hidden";
                        CT.$("inputAgeNum").style.visibility = "hidden";
                        PAGE.changeFocus("hands_x0_y0_inputPhoneNum_");
                        CT.$('girlMark').style.visibility = "hidden";
                        CT.$('boyMark').style.visibility = "hidden";
                        if (_this.babySex != null) {
                            _this.putSex(_this.babySex);
                        }
            
                        _this.hiddenAgeMark();
                        if (_this.ageMark) {
                            CT.$("ageMark" + _this.ageMark).style.visibility = "visible";
                        }
                        _this.hiddenHobbyMark();
                        _this.showHobbyMark();
            
                        personalCenter.pageIndex = 0;
                    } else {
                        CT.alertTip("请填写正确的电话",{time:1500});
                    }
                    break;
                case 2:
                    if (CT.$("phoneNumText").innerText.length >= 1) {
                        var numStr = CT.$("phoneNumText").innerText;
                        CT.$("ageNum").innerText = numStr;
                        CT.$("baby_info").style.visibility = "visible";
                        CT.$("changePhoneNum").style.visibility = "hidden";
                        CT.$("inputAgeNum").style.visibility = "hidden";
                        PAGE.changeFocus("hands_x0_y0_inputAgeNum_");
                        CT.$('girlMark').style.visibility = "hidden";
                        CT.$('boyMark').style.visibility = "hidden";
                        if (_this.babySex != null) {
                            _this.putSex(_this.babySex);
                        }
                        _this.hiddenAgeMark();
                        if (_this.ageMark) {
                            CT.$("ageMark" + _this.ageMark).style.visibility = "visible";
                        }
                        _this.hiddenHobbyMark();
                        _this.showHobbyMark();
                        personalCenter.pageIndex = 0;
                    } else if (CT.$("phoneNumText").innerText.substr(0,1) == "0" || parseInt(CT.$("ageText").innerHTML) > 18) {
                        CT.$("phoneNumText").innerText = "请输入年龄";
                        CT.alertTip("请填写正确的年龄",{time:1500});
                    }
					break;
            }
            // document.getElementsByClassName("mark").style.visibility = "hidden";
            // setTimeout(function(){
            //     window.location.reload();
            // },500)
        },

        alertTip: function (msg) {
            var tipDom = CT.$("tip");
            if (tipDom) {
                tipDom.innerHTML = "<span id='msg'>" + msg + "</span>";
                setTimeout(function () {
                    tipDom.innerHTML = "";
                }, 1000)
            }
        },
    }

    personalCenter.init();

    window.reqQuery = reqQuery;
    window.personalCenter = personalCenter;
    window.transferObj = transferObj;

})


// 遥控器输入数字
changeNumObj.changeNum = function (num) {
    var phoneNum = "";

    var size = phoneNum.length;
    if (!size && personalCenter.pageIndex == 1) {
        if (CT.$("phoneNumText").innerText.length < 11) {
            phoneNum += num;
            CT.$("phoneNumText").innerHTML += phoneNum;
        }
    } else if (!size && personalCenter.pageIndex == 2) {
        if (CT.$("phoneNumText").innerText.length < 2) {
            phoneNum += num;
            CT.$("phoneNumText").innerHTML += phoneNum;
        }
    }
}

//返回
function backFunc() {
    if (personalCenter && personalCenter.pageIndex == 1) {
        //保存电话号码
        personalCenter.confirmNum();
        personalCenter.pageIndex = 0;
    } else if (personalCenter && personalCenter.pageIndex == 2) {
        //保存年龄
        personalCenter.confirmNum();
        personalCenter.pageIndex = 0;
    } else {
        //离开页面上传数据
        personalCenter.userList();
        CT.backPage();
    }
}