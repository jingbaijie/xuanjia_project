/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-03-10 11:32:56
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-03-10 19:58:55
 */


var root = {
    $el: document.body,
    children: []
}
var View = Class.extend({
    template: '<div id="app"></div>',
    init: function (container, option) {
        option = option || {};
        this.option = option;
        this.container = container || root;
        if (!option.unbindEvent) {
            this.container.children.push(this);
        } else {
            this.container = root;
        }
        this.id = option.id;
        this.children = [];

        if (option.$el) {
            this.$el = option.$el;
        } else {
            this.$el = this.makeElement();
            this.attach();
        }
        this.onInit(option);
        option.hidden ? this.hide() : this.show();
    },
    onInit: function (option) {
        CT.writeInfo(option);
    },
    $$$: function (selector) {
        return this.$el.find(selector);
    },
    makeElement: function () {
        return this.$$$(juicer(this.template, this.option));
    },
    attach: function() {
        if (!$.contains(this.container.$el[0], this.$el[0])) {
            this.container.$el.append(this.$el);
        }
    },
    detach: function() {
        this.deactive();
        this.$el.remove();
    },
    show: function() {
        this.$el.show();
        this.active();
    },
    hide: function() {
        this.$el.hide();
        this.deactive();
    },
    active: function() {
        if (!this.isActive) {
            this.isActive = true;
            this.onActive && this.onActive.apply(this, arguments);
        }
    },
    deactive: function() {
        if (this.isActive) {
            this.isActive = false;
            this.onDeactive && this.onDeactive.apply(this, arguments);
        }
        this.$el.find('.ui-test-focused').removeClass('ui-test-focused');
    },
})




function windowManage(option) {
    this.ele = option.ele;
    this.dom = option.dom;
    this.init = option.init;

    this.show = function () {

    };

    this.hide = function () {

    };

    this.active = function () {

    }

    this.deactive = function () {

    }
}