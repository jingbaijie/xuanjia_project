/**
 * Created by Duan on 2016/5/25.
 */
/**
 * Created by Duan on 2016/5/23.
 */
//var ceshinum = null;
var CT = null;
var HW = {
    OK: 13,
    ZERO: 48,
    ONE: 49,
    TWO: 50,
    THREE: 51,
    FOUR: 52,
    FIVE: 53,
    SIX: 54,
    SEVEN: 55,
    EIGHT: 56,
    NINE: 57,
    PAGEUP: 33,
    PAGEDOWN: 34,
    BACK: 8,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    DEL: 1131
};
var ZTE = {
    OK: 13,
    ZERO: 48,
    ONE: 49,
    TWO: 50,
    THREE: 51,
    FOUR: 52,
    FIVE: 53,
    SIX: 54,
    SEVEN: 55,
    EIGHT: 56,
    NINE: 57,
    PAGEUP: 301,
    PAGEDOWN: 302,
    BACK: 126,
    LEFT: 271,
    UP: 269,
    RIGHT: 272,
    DOWN: 270,
    VolumeQuiet: 261,
    VolumeUp: 259,
    VolumeDown: 260
};
var YX = {
    OK: 273,
    ZERO: 48,
    ONE: 49,
    TWO: 50,
    THREE: 51,
    FOUR: 52,
    FIVE: 53,
    SIX: 54,
    SEVEN: 55,
    EIGHT: 56,
    NINE: 57,
    PAGEUP: 120,
    PAGEDOWN: 121,
    BACK: 122,
    LEFT: 29,
    UP: 28,
    RIGHT: 30,
    DOWN: 31,
    F4: 99,
    EXIT: 114
};
var DaHua = {
    OK: 273,
    ZERO: 48,
    ONE: 49,
    TWO: 50,
    THREE: 51,
    FOUR: 52,
    FIVE: 53,
    SIX: 54,
    SEVEN: 55,
    EIGHT: 56,
    NINE: 57,
    PAGEUP: 372,
    PAGEDOWN: 373,
    BACK: 340,
    LEFT: 3,
    UP: 1,
    RIGHT: 4,
    DOWN: 2,
    EXIT: 339
};
var JiuZhou = {
    OK: 13,
    ZERO: 48,
    ONE: 49,
    TWO: 50,
    THREE: 51,
    FOUR: 52,
    FIVE: 53,
    SIX: 54,
    SEVEN: 55,
    EIGHT: 56,
    NINE: 57,
    BACK: 283,
    BACKMAIN: 513,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
};
var ChangHong = {
    OK: 13,
    ZERO: 48,
    ONE: 49,
    TWO: 50,
    THREE: 51,
    FOUR: 52,
    FIVE: 53,
    SIX: 54,
    SEVEN: 55,
    EIGHT: 56,
    NINE: 57,
    BACK: 27,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    PAGEUP: 33,
    PAGEDOWN: 34
};
var GzAndroid = {
    OK: 13,
    ZERO: 48,
    ONE: 49,
    TWO: 50,
    THREE: 51,
    FOUR: 52,
    FIVE: 53,
    SIX: 54,
    SEVEN: 55,
    EIGHT: 56,
    NINE: 57,
    BACK: 8,
    RETURN: 640,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    PAGEUP: 33,
    PAGEDOWN: 34
};
var GZGD = {
    BACK: 640,//南京广电返回按键
    RETURN: 113,
    BACKMAIN: 114
};
var XMBC = {
    BACK: 340,
    RETURN_1: 270,
    RETURN_2: 283,
    RETURN_3: 8,
    BACKMAIN: 513
};
//根据键值，获得按键名称
function getKeyCodeName(keyCode) {
    for (var key in HW) {
        if (HW[key] == keyCode) {
            return key;
        }
    }
    for (var key in ZTE) {
        if (ZTE[key] == keyCode) {
            return key;
        }
    }
    for (var key in YX) {
        if (YX[key] == keyCode) {
            return key;
        }
    }
    for (var key in DaHua) {
        if (DaHua[key] == keyCode) {
            return key;
        }
    }
    for (var key in JiuZhou) {
        if (JiuZhou[key] == keyCode) {
            return key;
        }
    }
    for (var key in ChangHong) {
        if (ChangHong[key] == keyCode) {
            return key;
        }
    }
    for (var key in GzAndroid) {
        if (GzAndroid[key] == keyCode) {
            return key;
        }
    }
    for (var key in GZGD) {
        if (GZGD[key] == keyCode) {
            return key;
        }
    }
    for (var item in XMBC) {
        if (XMBC[item] == keyCode) {
            return item;
        }
    }
    return "";
}
function b2() {
    this.keyCode = function (evt) {
        evt = evt != null && evt != undefined ? evt : window.event;
        var keyCode = evt.which != null && evt.which != undefined && evt.which != 0 ? evt.which : evt.keyCode;
        return keyCode;
    };
}
CT = new b2();
document.onkeydown = keyDownEvent;
function keyDownEvent(evt) {
    var keyCode = CT.keyCode(evt);
    var keyName = getKeyCodeName(keyCode);

    switch (keyName) {
  
        case "UP" :
        	//upfunc();
            pole.topMove();
            break;
        case "DOWN" :
        	//downfunc()
           pole.bottomMove();
            break;
        case "LEFT" :
        	pole.leftMove();
            break;
        case "RIGHT":
        	pole.rightMove();
            break;
        case "OK" :
            gotoStartAgain();
            break;
        case "BACK" :
            
            backfunc();
            break;
        case "RETURN" :
            backfunc();
            break;
        case "BACKMAIN" :
            backfunc();
            break;
        case "RETURN_1":
            backfunc();
            break;
        case "RETURN_2":
            backfunc();
            break;
        case "RETURN_3":
            backfunc();
            break;
//	case "quit":
//		backfunc();
        //模拟误点返回键
        //goWrongPage();
        //break;
        default :
            //var keyObj = document.getElementById("hands_episodesEnterButton_");
            //if(keyObj && keyObj.isFocus){
            switch (keyName) {
                case "ZERO":
                    //changeNum("0");
                    break;
                case "ONE":
                    //changeNum("1");
                    break;
                case "TWO":
                    //changeNum("2");
                    break;
                case "THREE":
                    //changeNum("3");
                    break;
                case "FOUR":
                    //changeNum("4");
                    break;
                case "FIVE":
                    //changeNum("5");
                    break;
                case "SIX":
                    //changeNum("6");
                    break;
                case "SEVEN":
                    //changeNum("7");
                    break;
                case "EIGHT":
                    //changeNum("8");
                    break;
                case "NINE":
                    //changeNum("9");
                    //backfunc();
                    break;
                default:
                    break;
                //}
            }
    }
 }