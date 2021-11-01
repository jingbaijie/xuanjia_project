/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-03-10 12:07:01
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-03-10 13:22:12
 */
/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-03-10 11:32:56
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-03-10 12:06:20
 */
var toString = Object.prototype.toString,
    month_days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    uid = ['0', '0', '0'];

function later(fn, ms, context, args) {
    if (typeof fn === 'string') {
        fn = context[fn];
    }
    var finish = false,
        wrapFn = function () {
            fn.apply(context, args);
            finish = true;
        },
        timer = setTimeout(wrapFn, ms);
    return {
        id: timer,
        cancel: function () {
            clearTimeout(timer);
        }
    };
}

var Util = {
    jsonToString: function (val) {
        if (val === null || val === undefined) {
            return '""';
        }
        switch (val.constructor) {
            case Number:
                return val;
            case String:
                return '"' + val + '"';
            case Date:
                return '"' + val.toUTCString() + '"';
            case Object:
                var arr = [];
                for (var x in val) {
                    if (val.hasOwnProperty(x) && (!this.isNull(val[x]))) {
                        arr[arr.length] = '"' + x + '":' + this.jsonToString(val[x]);
                    }
                }
                return '{' + arr.join(',') + '}';
            default:
                return null;
        }
    },
    isNull: function (val) {
        return val === undefined || val === null;
    },
    isString: function (val) {
        return typeof val === 'string';
    },
    isObject: function (val) {
        return Object(val) === val;
    },
    isFunction: function (val) {
        return toString.call(val) === '[object Function]';
    },
    isArray: Array.isArray || function (val) {
        return toString.call(val) === '[object Array]';
    },
    mix: function (r, s, wl) {
        for (var p in s) {
            if (s.hasOwnProperty(p)) {
                if (wl && $.indexOf(wl, p) === -1) {
                    continue;
                }
                if (p !== 'prototype') {
                    r[p] = s[p];
                }
            }
        }
    },
    nextUid: function () {
        var index = uid.length;
        var digit;

        while (index) {
            index--;
            digit = uid[index].charCodeAt(0);
            if (digit === 57 /*'9'*/ ) {
                uid[index] = 'A';
                return uid.join('');
            }
            if (digit === 90 /*'Z'*/ ) {
                uid[index] = '0';
            } else {
                uid[index] = String.fromCharCode(digit + 1);
                return uid.join('');
            }
        }
        uid.unshift('0');
        return uid.join('');
    },
    later: later,
    buffer: function (fn, ms, context) {
        ms = ms || 150;
        if (ms === -1) {
            return function () {
                fn.apply(context || this, arguments);
            };
        }
        var bufferTimer = null;

        function f() {
            f.stop();
            bufferTimer = later(fn, ms, context || this, arguments);
        }

        f.stop = function () {
            if (bufferTimer) {
                bufferTimer.cancel();
                bufferTimer = 0;
            }
        };
        return f;
    },
    strRepeat: function (str, qty) {
        if (qty < 1) {
            return '';
        }
        var result = '';
        while (qty > 0) {
            if (qty & 1) {
                result += str;
            }
            qty >>= 1, str += str;
        }
        return result;
    },
    pad: function (str, length, padStr) {
        var padlen = length - str.length;

        if (!padStr) {
            padStr = ' ';
        } else if (padStr.length > 1) {
            padStr = padStr.charAt(0);
        }

        return this.strRepeat(padStr, padlen) + str;
    },
    price: function (fee) {
        fee = (Number(fee) / eBase.session.get('currencyRate')).toFixed(2);
        return $.i18n.text(eBase.session.get('currencyAlphCode')) + ' ' + fee;
    },

    priceFormart: function (fee) {
        fee = (Number(fee) / eBase.session.get('currencyRate')).toFixed(2);
        return fee + ' ' + $.i18n.text(eBase.session.get('currencyAlphCode'));
    },

    addMarquee: function (el) {
        var $el = $(el);
        if ($el[0].scrollWidth > $el.width()) {
            $el.addClass('marquee');
        }
    },

    removeMarquee: function (el) {
        var $el = $(el);
        $el.removeClass('marquee');
        $el.hide();
        _.defer(function () {
            $el.show();
        });
    },

    getTimeString: function (ms) {
        ms = Math.ceil(ms / 60 / 1000);
        var hour = Math.floor(ms / 60);
        var minute = ms % 60;
        var ret = '';
        if (hour) {
            ret += hour + $.i18n.text('hours');
        }
        if (minute) {
            ret += minute + $.i18n.text('minutes');
        }
        return ret;
    },
    isNeedCheckPIN: function () { //@author:zhangjieliang @date:2015/9/2 16:00 @comment:设置默认pinSession时间为20分钟
        return ((new Date()).getTime() - (eBase.app.authenticateApp.configurations.PIN_session || 0) * 60 * 1000) >= (eBase.session.get('lastTimeOfPINValidation') || 0);
    },
    timeStr2Number: function (timeStr) {
        var year, month, day, hour, minute, days = 0,
            offset = 0;
        if (timeStr.length > 14) {
            year = Number(timeStr.substr(0, 4)) - 1;
            month = Number(timeStr.substr(5, 2)) - 1;
            day = Number(timeStr.substr(8, 2)) - 1;
            hour = Number(timeStr.substr(11, 2));
            minute = Number(timeStr.substr(14, 2));
        } else {
            year = Number(timeStr.substr(0, 4)) - 1;
            month = Number(timeStr.substr(4, 2)) - 1;
            day = Number(timeStr.substr(6, 2)) - 1;
            hour = Number(timeStr.substr(8, 2));
            minute = Number(timeStr.substr(10, 2));
            if ('1' === eBase.config.utcEnable) {
                offset = (new Date()).getTimezoneOffset();
            }
        }
        days += Math.floor(year / 4) - Math.floor(year / 100) + Math.floor(year / 400) + year * 365;
        for (var i = 0; i < month; i++) {
            days += month_days[i];
        }
        year++;
        if (month > 1 && year % 4 === 0 && (year % 400 === 0 || year % 100 !== 0)) {
            days++;
        }
        days += day;
        return days * 24 * 60 + hour * 60 + minute - offset;
    }
};