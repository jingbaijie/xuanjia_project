/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-03-10 16:01:30
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-03-12 21:15:11
 */


// 面板
var Panel = View.extend({
    init: function (container, name) {
        this._super(container, {
            id: name,
            hidden: true
        });
    },
    getTopPage: function () {
        return this.children[this.children.length - 1];
    },
    pushPage: function (pageName, option) {
        option = option || {};
        option.pageName = pageName;
        var panel = this;
        // seajs.use('page/' + pageName, function (PageClass) {
            var previousPage = panel.children[panel.children.length - 1];
          
            var page = new PageClass(panel, option);
            if (previousPage) {
                if (option.isDialog) {
                    previousPage.deactive();
                } else {
                    previousPage.$el[0].style.display = "none";
                    previousPage.isActive = false;
                }
            }
            panel.show();
            if (page && typeof page.initCallback === "function") {
                page.initCallback();
            }
        // });
    },
    active: function () {
        this._super();
        var topPage = this.getTopPage();
        topPage && topPage.active();
    },
    deactive: function () {
        this._super();
        var topPage = this.getTopPage();
        topPage && topPage.deactive();
    },
   
});

// AppView
var AppView = View.extend({
    init: function ($el) {
        this._super(null, {
            $el: $el,
            'id': 'app-view'
        });
        this._event = false;
        this.bindEvent();
        this.show();
    },
    // 绑定事件
    bindEvent: function () {
        if (!this._event) {
            this._event = true;
        }
    },
    // 屏蔽事件
    disbindEvent: function () {
        this._event = false;
    },
    getPanel: function (panelName) {
        var map = this.__panelMap__ || (this.__panelMap__ = {}),
            panel = map[panelName],
            i = 0,
            len = this.children.length;

        if (!panel) {
            for (; i < len; i++) {
                if (this.children[i].id === panelName) {
                    panel = map[panelName] = this.children[i];
                    break;
                }
            }
        }
        return panel;
    },
    getTopPanel: function () {
        for (var i = 0,
                len = this.children.length; i < len - 1; i++) {
            if (this.children[i].isActive) {
                return this.children[i];
            }
        }
    },
    onDestory: function () {
    }
});

windowManage = View.extend({

})