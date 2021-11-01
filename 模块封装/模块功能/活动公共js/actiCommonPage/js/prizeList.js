function getPrize() {
    this.prizeListJson = function (option) {
        var prizeListJson = {
            "titleInfo": {
                "fontSize": "24px",
                "fontWeight": "bold",
                "color": "#fff",
                "left": "370px",
                "top": "210px",
                "title": [
                    {
                        "name": "账号",
                        "marginRight": "350px"
                    },
                    {
                        "name": "奖品",
                        "marginRight": "0px"
                    }
                ],
            },
            "rankLines": 10,
            "prizeListBox": {
                "width": "780px",
                "height": "300px",
                "left": "200px",
                "top": "250px"
            },
            "prizeListBoxLi": {
                "height": "25px",
                "fontSize": "20px",
                "color": "#fff"
            }
        }
        prizeListJson = this.deepCopy(prizeListJson, option);
        return prizeListJson;
    };
    this.getPrizeList = [];//中奖名单列表
    this.listHTML = "";
    this.rankInterval = null;
    this.maxUp = 0;
}
getPrize.prototype = {
    constructor: getPrize,
    /**
     * 
     * @param {*} main 奖品列表外部元素ID名称
     * @param {*} option 传入的参数
     * @param {*} callback 奖品列表初始化完成的回调
     */
    init: function (main, option, callback) {
        var _this = this;
        var outerBox = document.getElementById(main);
        //创建页面元素
        outerBox.innerHTML += this.actiPrizeListModule(this.prizeListJson(option));
        //获奖列表
        this.getNameList(this.prizeListJson(option));
    },
    /**
     * 
     * @param {*} prizeListJson  默认参数
     * @param {*} option 用户
     */
    /**
     * 将传入对象与默认对象合并
     */
    deepCopy: function (prizeListJson, option) {
        for (var key in option) {
            if (option.hasOwnProperty(key)) {
                if (typeof option[key] == "object" && option[key] != null) {
                    prizeListJson[key] = this.deepCopy(prizeListJson[key], option[key]);//递归复制
                } else {
                    prizeListJson[key] = option[key];
                }
            }
        }
        return prizeListJson;
    },
    /**
     * 
     * @param {*} prizeListJson 创建列表的数据
     */
    actiPrizeListModule: function (prizeListJson) {
        var returnHTML = "";
        returnHTML += "<!-- 奖品列表 --><div id='prizeListTitle' style='position: absolute;left: " + prizeListJson.titleInfo.left + ";top: " + prizeListJson.titleInfo.top + ";font-size: " + prizeListJson.titleInfo.fontSize + ";font-weight: " + prizeListJson.titleInfo.fontWeight + ";color: " + prizeListJson.titleInfo.color + ";'><span style='margin-right: " + prizeListJson.titleInfo.title[0].marginRight + ";'>" + prizeListJson.titleInfo.title[0].name + "</span><span>" + prizeListJson.titleInfo.title[1].name + "</span></div>";
        returnHTML += "<div id='prizeListBox' style='width: " + prizeListJson.prizeListBox.width + ";height: " + prizeListJson.prizeListBox.height + ";position: absolute;left: " + prizeListJson.prizeListBox.left + ";top: " + prizeListJson.prizeListBox.top + ";overflow: hidden;'><ul id='prizeListUL' style='position: absolute;left: 0px;top: 0px;width: " + prizeListJson.prizeListBox.width + ";'></ul></div>";
        return returnHTML;
    },
    /*
	 * 设置奖品榜，超过8人开始向下滚动
	 */
    getNameList: function (prizeListJson) {
        var _this = this;
        if (this.rankInterval) {
            clearInterval(this.rankInterval);
        }
        actiObj.getPrizeUserInfo(function (getPrizeData) {
            CT.$("prizeListUL").innerHTML = "";
            _this.getPrizeList = getPrizeData.data.records;
            if (getPrizeData && getPrizeData.successFlg == 1 && _this.getPrizeList.length > 0) {
                for (var i = 0; i < _this.getPrizeList.length; i++) {
                    for (var i = 0; i < _this.getPrizeList.length; i++) {
                        _this.listHTML += "<li style='height: " + prizeListJson.prizeListBoxLi.height + ";font-size: " + prizeListJson.prizeListBoxLi.fontSize + ";color: " + prizeListJson.prizeListBoxLi.color + ";'><span style='display: block;width: 50%;text-align: center;float: left;'>" + _this.getPrizeList[i].userId + "</span><span style='display: block;width: 50%;text-align: center;float: left;'>" + _this.getPrizeList[i].prizeCname + "</span></li>";
                    }
                    CT.$("prizeListUL").innerHTML = _this.listHTML;
                }
            } else {
                _this.listHTML = "<li><span>19087675567</span><span>贝乐虎拼图</span></li>"
                CT.$("prizeListUL").innerHTML = _this.listHTML;
            }
            if (_this.getPrizeList.length >= prizeListJson.rankLines) {
                _this.listHTML += _this.listHTML;
                CT.$("prizeListUL").innerHTML = _this.listHTML;
                _this.setRankUp(prizeListJson);
            } else {
                CT.$("prizeListUL").innerHTML = _this.listHTML;
            }
        });
    },
    /*
	 * 奖品榜滚动
	 */
    setRankUp: function (prizeListJson) {
        var _this = this;
        var rankLines = CT.$("prizeListUL").getElementsByTagName("li");
        if (rankLines && rankLines.length >= prizeListJson.rankLines) {
            this.maxUp = 0 - ((rankLines.length / 2) * parseInt(prizeListJson.prizeListBoxLi.height) + parseInt(prizeListJson.prizeListBoxLi.height) * 2);
            this.rankInterval = setInterval(function () {
                if (parseInt(CT.$("prizeListUL").style.top) > _this.maxUp) {
                    CT.$("prizeListUL").style.top = parseInt(CT.$("prizeListUL").style.top) - 10 + "px";
                } else {
                    CT.$("prizeListUL").style.top = "0px";
                }
                document.querySelector('#prizeListUL>li:nth-child(' + rankLines.length / 2 + ')').style.marginBottom = parseInt(prizeListJson.prizeListBoxLi.height) * 2 + "px";
                document.querySelector('#prizeListUL>li:nth-child(' + rankLines.length + ')').style.marginBottom = parseInt(prizeListJson.prizeListBoxLi.height) * 2 + "px";
            }, 200);
        }
    }
}
var getPrizePage = new getPrize();