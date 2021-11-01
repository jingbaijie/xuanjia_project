/*
 * @LastEditors: jwzx
 * @LastEditTime: 2020-10-16 16:20:27
 */
var commonPageInfo = basePageInfo.commonPageInfo;
var business = {
    //用户id
    userId: xjDataLog.getUserId(),
    isOrder: false,
    orderImg: "",
    noOrderImg: "",
    //页面id
    contentId: commonPageInfo.pageInfo.commonPageId || 1,
    // 默认焦点，先取眉头
    defaultFocus: CT.requestValue("curFocusId") || "hands_x0_y0_left" + (CT.requestValue("typeNum") || 0) + "_",
    /**
     * 初始化页面
     * 显示眉头
     * 显示个人中心数据
     */
    init: function () {
        var _this = this;
        // 禁止再次渲染主题
        // interface.changeThemeSwitch = false;
        PAGE.focusInit();
        var start = PAGE.getFocusModel6('hands_x0_y0_DMEJleftceterbutton1_');
        start.defaultFocus();
        //鉴权
        // var authObj = {
        //     callback: function () {
        //         _this.isOrder = true;
        //         //已订购
        //         CT.$('hands_x0_y0_DMEJodernow_').style.background = "url('" + AjaxConfig.imgUrl + commonPageInfo.recommend_1[1].recommendLabelpic.picPath + "')";
        //         // PAGE.changeFocus('hands_x0_y0_DMEJleftceterbutton1_');
        //     },
        //     failCallback: function () {
        //         _this.isOrder = false;
        //         //立即订购
        //         CT.$('hands_x0_y0_DMEJodernow_').style.background = "url('" + AjaxConfig.imgUrl + commonPageInfo.recommend_1[1].recommendPic.picPath + "')";
        //         // PAGE.changeFocus('hands_x0_y0_DMEJodernow_');
        //     }
        // }
        orderJs.getAuth( function () {
            _this.isOrder = true;
            //已订购
            CT.$('hands_x0_y0_DMEJodernow_').style.background = "url('" + AjaxConfig.imgUrl + commonPageInfo.recommend_1[1].recommendLabelpic.picPath + "')";
            // PAGE.changeFocus('hands_x0_y0_DMEJleftceterbutton1_');
        },
        function () {
            _this.isOrder = false;
            //立即订购
            CT.$('hands_x0_y0_DMEJodernow_').style.background = "url('" + AjaxConfig.imgUrl + commonPageInfo.recommend_1[1].recommendPic.picPath + "')";
            // PAGE.changeFocus('hands_x0_y0_DMEJodernow_');
        });
    },
    toOrder: function () {
        var _this = this;
        if (_this.isOrder) {
            //已订购
            CT.alertTip('您已经订购过啦！');
        } else {
            //未订购，去订购页
            orderJs.toOrderPage();
        }
    },
    toChildPage: function (index) {
        switch (index) {
            case 0:
                CT.commonJumpUrl('./personalCenter')
                break;
            case 1:
                CT.commonJumpUrl('./business')
                break;
            case 2:
                CT.commonJumpUrl('./historyaction=history')
                break;
            case 3:
                CT.commonJumpUrl('./historyaction=favorite')
                break;
            case 4:
                CT.commonJumpUrl('./parent')
                break;
        }
    },

}
addEvent.on("pageEvent",function(e){

business.init();
})

//重定义左侧导航按钮向右事件:  curBtnIndex：当前焦点下标
generalLeftNavObj.navBtnRighEvent = function (curBtnIndex) {
    PAGE.changeFocus("hands_x0_y0_DMEJodernow_")
};

//重定义左侧列表按钮获焦事件
generalLeftNavObj.navBtnOtherFocusEventCallBack = function (curBtnIndex) {
    var _this = this;
    //根据页面需求重写，重写需求写到这里
    //以下为当前页面重写逻辑
    try {
        CT.$('rightContent').style.top = '0px';
        // business.changeArrowStatus(business.curPageDataIndex);
    } catch (error) {

    }
}
//返回
function backFunc() {
    CT.backPage();
}