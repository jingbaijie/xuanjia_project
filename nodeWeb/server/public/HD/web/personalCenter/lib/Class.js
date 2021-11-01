/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-03-10 12:06:48
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-03-10 19:40:58
 */
 
function Class(o) {
    if (Util.isFunction(o)) {
        return classify(o);
    }
    if (!(this instanceof Class) && arguments.length) {
        return Class.extend.apply(Class, arguments);
    }
}

function classify(cls) {
    cls.extend = Class.extend;
    cls.implement = Class.implement;
    cls.statics = Class.statics;
    return cls;
}


function Ctor() {}

var createProto = Object.__proto__ ?
    function(proto) {
        return {
            __proto__: proto
        };
} : function(proto) {
    Ctor.prototype = proto;
    return new Ctor();
};

var fnTest = /peter/.test(function() {
    peter;
}) ? /\b_super\b/ : /.*/;

var inheritProps = function(newProps, oldProps, addTo) {
    addTo = addTo || newProps;
    for (var name in newProps) {
        addTo[name] = typeof newProps[name] === "function" && typeof oldProps[name] === "function" && fnTest.test(newProps[name]) ? (function(name, fn) {
            return function() {
                var tmp = this._super,
                    ret;
                this._super = oldProps[name];
                ret = fn.apply(this, arguments);
                this._super = tmp;
                return ret;
            };
        })(name, newProps[name]) : newProps[name];
    }
};

Class.extend = function(proto) {
    proto = proto || {};
    var _super = this.prototype;
    var prototype = createProto(_super);
    inheritProps(proto, _super, prototype);
    function SubClass() {
        if (this.constructor === SubClass && this.init) {
            this.init.apply(this, arguments);
        }
    }
    prototype.constructor = SubClass;
    SubClass.prototype = prototype;
    return classify(SubClass);
};

Class.implement = function(items) {
    Util.isArray(items) || (items = [items]);
    var proto = this.prototype,
        item;
    while ((item = items.shift()) !== undefined) {
        Util.mix(proto, item.prototype || item);
    }
    return this;
};

Class.statics = function(staticProperties) {
    Util.mix(this, staticProperties);
    return this;
};