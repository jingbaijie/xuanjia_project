
/**
 * *******************************************按键 **********************************
 */
//键值对
//以按键值为key,指定action为值,会相应触发actionEvent
//
var xjKeyCodes = {
   '269': 'up',
   '94': 'up',
   '87': 'up',
   '38': 'up',
   '28': 'up',
   '1': 'up',
   '270': 'down',
   '95': 'down',
   '83': 'down',
   '40': 'down',
   '31': 'down',
   '2': 'down',
   '271': 'left',
   '96': 'left',
   '65': 'left',
   '37': 'left',
   '29': 'left',
   '3': 'left',
   '272': 'right',
   '97': 'right',
   '68': 'right',
   '39': 'right',
   '30': 'right',
   '4': 'right',
   '399': 'back',
   '340': 'back',
   '283': 'back',
   '126': 'back',
   '122': 'back',
   '27': 'back',
   '8': 'back',
   '273': 'ok',
   '62': 'ok',
   '13': 'ok',
   '640': 'back',
   '33': 'back',
   '373': 'pagedown',
   '302': 'pagedown',
   '121': 'pagedown',
   '34': 'pagedown',
   '45': 'volumndown',
   '110': '0',
   '48': '0',
   '111': '1',
   '49': '1',
   '70': '2',
   '50': '2',
   '71': '3',
   '51': '3',
   '72': '4',
   '52': '4',
   '73': '5',
   '53': '5',
   '74': '6',
   '54': '6',
   '75': '7',
   '55': '7',
   '76': '8',
   '56': '8',
   '77': '9',
   '57': '9',
   '61': 'volumnup',
   '67': 'volume',
   '99': 'f4',
   '520': 'home_page',
   '512': 'home_page',
   '113': 'home_page',
   '514': 'out_page',
   '114': 'out_page',
   '372': 'pageup',
   '301': 'pageup',
   '120': 'pageup',
   '259': 'volumeup',
   '260': 'volumedown',
   '261': 'volumequiet',
   '339': 'exit',
   '513': 'backmain',
   '1025': 'stop',
   '1131': 'del'
};

var buttons = [];//兼容老版本,老版本buttons是数组结构,本版本使用{id:button}结构,id和元素id对应
beforeBackFunc = undefined;//backFunc
//默认的返回键操作.与老版兼容,使用同样的函数名
backFunc = function (evt) {
   var _res = beforeBackFunc && beforeBackFunc(evt);//beforeBackFunc预留函数(全局),如果函数执行返回true,不执行backPage()操作
   if (!_res) {
      CT && CT.backPage();
   }
   return false;
};
//当前焦点对象
var xjCurFocus = {
   FocusID: "root",
   lastFocusId: "root"
};
//兼容老式焦点对象
window["curFocus"] = xjCurFocus;
/**
 * 处理按键事件对象,
 * 
 */
$keyCode = {
   /**
    * 光标定时器
    */
   gbInterval: null,
   /**
       * 焦点显示样式显示样式
       * @example
       *
       * 对应focusType 类型
       *  focusType = 4;   焦点旋转 360度
       *  focusType = 5;   焦点显示隐藏动画
       *  focusType = 6    焦点及图片变大
       *  focusType = 7    焦点正常
       *  focusType = 8    焦点及图片变大缩小动画
       *  focusType = 9    焦点图显示，展示图隐藏
       *   {
          rotate360 : "rotate360",//旋转360度
         fadeIn : "focusFadeIn",//显示隐藏,
         sacleBig : "sacleBig",//变大
         sacleBigToSmall : "sacleBigToSmall",//变大变小切换  focusType = 8
      },
      当焦点移动上去会把相应对象的样式属性修改,同时会把修改前的相应属性记录到beBlur中
      这样可以更多元化的焦点控制.可以更方便地以更多形式的焦点展现形式
      */
   styleCssList: {
      0: {"focusImg":{"visibility":"visible"}},//默认
      4: {"ele":{"css":"rotate360"},"focusImg":{"visibility":"visible"}},//旋转360度  focusType=4
      5: {"focusImg":{"css":"focusFadeIn","visibility":"visible"}},//显示隐藏,   focusType=5
      6: {"showImg":{"css":"sacleBig"},"ele":{"css":"sacleBig"}},//变大         focusType=6
      7: {"gb":{"clearTimeout":this.gbInterval,"visibility":"hidden","display":"none"},"focusImg":{"visibility":"visible"}}, //
      8: {"ele":{"css":"sacleBigToSmall"},"focusImg":{"visibility":"hidden"}},//变大变小切换  focusType=8
      9: {"gb":{"clearTimeout":this.gbInterval,"visibility":"hidden","display":"none"},"focusImg":{"visibility":"visible"},"showImg":{"visibility":"hidden"},"ele": {"css":"sacleBig"}},
   },
   /**
    * 注册列表1::
    * 元素数据(树型结构)
    * 根元素为root,默认dom为body
    * 
    * 单位元为相应元素对应的数据结构
    * id:相应的元素id或相应元素在父元素下的下标
    * xjId: 目前是以父节点的xjId + . + 本节点的id组成 用来表示该节点在元素结构下的位置,在实际应用中,判断元素位置使用
    * parentNode: 当前节点父节点
    * children: 元素下的子元素相应对象,数据结构为本数据结构
    * button: 当前节点button,相应存放相应的事件函数和相应焦点移动的焦点id
    * 
    * TempData: 临时数据
    */
   buttonTree: {
      "root": {
         id: "root",
         xjId: "body",
         button: {
            backEvent: backFunc,
            backEventObj:null,
            backEventParam: [],
            back_pageEvent: backFunc,
            back_pageEventObj:null,
            back_pageEventParam: [],
         },
         dom: document.getElementById("body") || document.getElementsByTagName("body")[0],
         children: [],
      }
   },
   /**
    * 注册列表2::
    * button注册初始列表,以相应的id :相应的按键事件集合
    * example:
    * buttonJson = {
    *    //eventObj为默认事件对应函数的使用对象
    *    eventObj:PAGE,
    *    video:{
    *       //节点内的eventObj为该节点下的函数默认使用对象
    *       eventObj:Page,
    *       //相应 按键名+Event为该按键action触发的函数
    *       okEvent: Page.stopOrPlay,
    *       //事件触发函数参数
    *       okEventParam: ['pause'],
    *       leftEvent: videoPlayer.forwardOrBackward,
    *       // 按键action + EventObj为指定该按键触发函数的指定函数对象
    *       leftEventObj: videoPlayer,
    *       leftEventParam: ['backward'],
    *       rightEvent: Page.forwardOrBackward,
    *       rightEventParam: ['forward'],
    *       backEvent: Page.showExitUI
    *    },
    *    hands_x0_y0_collectBtn_:{
    *        okEvent:Page.toggleCollectState,
    *     },
    *     hands_x0_y0_preSetBtn_:{
    *        okEvent: Page.preEpisode,
    *     },
    *     hands_x0_y0_pauseBtn_:{
    *        okEvent:Page.stopOrPlay,
    *        onFocusEvent:function(){
    *              this.btnGetFocus("pauseBtn");
    *        },
    *        onBlurEvent:function(){
    *              this.btnBlurFocus("pauseBtn");
    *              return true;
    *        },
    *     }
    * }
    * 1.eventObj: 函数触发对象是以就近原则,优先指定按键事件action+EventObj指定对象>对象内指定eventObj对象 > 全局buttonJson指定eventObj对象
    * 2.actionEvent: 事件触发函数,优先以本节点函数的为指定触发函数 > 父节点的触发函数.   事件发起节点为触发节点,而挂载函数的节点为真实函数节点
    *   函数返回为true或相应节点无声名函数或指定disable,则会继续执行相应在父元素相应节点中的相应函数
    * 3.eventParam: 事件触发需要配置参数.优先选择触发节点配置参数,如果没有,则选择真实挂载函数节点的参数.
    * 4: action: 会优先获取指定id.若添加前缀appoint:无论该id是否可以获焦,将中止父节点相应action事件,执行否则将执行父节点的action
    * ps: 本节点下,action优先执行actionEvent事件.执行完actionEvent将不会自动执行action的获取操作
    */
   buttonJson: {},
   /**
    * 注册列表3::
    * 元素数据(Map结构),里面存放的是所有带id的页面元素的相应数据,值为相应的树型结构数据
    */
   buttonPosition: { "root": this.buttonTree },
   /**
    * 注册列表4::
    * 焦点移动注册对象
    * 1. offset: 表示将执行的焦点位置计算函数的数组actions的下标
    * 2. actions: 表示自动焦点计算对象的集合
    * 3. cache: 表示是否启动缓存,把相应焦点移动的结果缓存下来,减少计算次数.   ps: 由于对缓存新增元素不太友好,所以在元素变化页面不推荐使用.默认为关
    * 4. autoFocus: 表示是否开启自动焦点
    * 5. actionFunc: 自动焦点计算核心计算.返回为数组,默认优先下标靠前的,取最小值.如果相同,则比较下一个.
    */
   buttonAction:{
      offset: 0,
      cache:{},
      cacheMap:{},
      actions: [{
         cache: false,  //缓存带来的问题过多.暂时不使用
         // returnType:0,
         autoFocus: true,
         actionFunc: function(curEle,nextEle,action) {
            var number1 ;
            var number2 ;
            var number3 ;
            var number4 ;
            var number5 ;
            var number6 ;
            switch (action) {
               case "left":
                  number1 = curEle.left,
                  number2 = nextEle.right,
                  number3 = curEle.top,
                  number4 = curEle.bottom,
                  number5 = nextEle.top, 
                  number6 = nextEle.bottom;
                  break
               case "right":
                  number1 = nextEle.left,
                  number2 = curEle.right,
                  number3 = curEle.top,
                  number4 = curEle.bottom,
                  number5 = nextEle.top, 
                  number6 = nextEle.bottom;
                  break;
               case "up":
                  number1 = curEle.top,
                  number2 = nextEle.bottom,
                  number3 = curEle.left,
                  number4 = curEle.right,
                  number5 = nextEle.left, 
                  number6 = nextEle.right;
                  break;
               case "down":
                  number1 = nextEle.top,
                  number2 = curEle.bottom,
                  number3 = curEle.left,
                  number4 = curEle.right,
                  number5 = nextEle.left, 
                  number6 = nextEle.right;
                  break;
            }
            if(number1 >= number2) {
               /**
                * 自动焦点算法: 优先取两最近线的距离(线与线的距离),再取两线之间重合距离,最后取两线之间中心点距离.
                */
               var res3 = (number1 - number2) * (number1 - number2) + (number3 + number4 - number5 - number6) * (number3 + number4 - number5 - number6) / 4;
               var res2 =  Math.max(number3,number5) - Math.min(number4,number6);
               var _min_des = res2 <= 0 ? 0 : res2;
               var res1 =   (number1 - number2) * (number1 - number2)   + _min_des * _min_des;
               return [res1,res2,res3];
            }
            return null; 
         }
      }],
   },
   /**
    * 设置焦点移动缓存
    * 把相应缓存结果存入相应buttonAction中的cache中,(id.action = nextId)为形式记录
    * 同时将相应下个焦点的nextId为key存入cacheMap,以 (nextId = [id + '.' + action])形式记录
    * 
    * @param {*} curFocusId 当前焦点id
    * @param {*} nextFocus 下个焦点
    * @param {*} action 行为动作
    */
   setActionCache:function(curFocusId,nextFocus,action){ var _this = this;
      if(!_this.buttonAction.actions[_this.buttonAction.offset].cache) {
         return;
      }
      if(!curFocusId) return null;
      if(typeof(curFocusId) == "object") {
         curFocusId = curFocusId.id;
      }
      if(typeof(nextFocus) == "string" && nextFocus != 'disable') {
         nextFocus = _this.getEle(nextFocus);
      }
      if(!curFocusId) return null;
      

      _this.buttonAction.cache[curFocusId] = _this.buttonAction.cache[curFocusId] || {};
      _this.buttonAction.cache[curFocusId][action] = nextFocus;

      _this.buttonAction.cacheMap[nextFocus.id] = _this.buttonAction.cacheMap[nextFocus.id] || [];
      if(_this.buttonAction.cacheMap[nextFocus.id].indexOf(curFocusId + "." + action) < 0){
         _this.buttonAction.cacheMap[nextFocus.id].push(curFocusId + "." + action);
      }
      return nextFocus;

   },
   /**
    * 获取焦点移动缓存,获取相应元素对象
    * 如果返回为null或undefined为未缓存元素
    * @param {*} curFocusId 当前焦点id
    * @param {*} action 行为动作
    */
   getActionCache(curFocusId,action) {
      var _this = this;
      if(!curFocusId) return null;
      if(typeof(curFocusId) == "object") {
         curFocusId = curFocusId.id;
      }
      if(!curFocusId || !_this.buttonAction.cache || !_this.buttonAction.cache[curFocusId] || !_this.buttonAction.cache[curFocusId][action]) return null;
      return _this.buttonAction.cache[curFocusId][action];
   },
  /**
   * 核心初始化过程,此过程用于遍历节点下指定子节点元素注册到相应的父节点children中,并把相应拥有id的元素的节点数据以id为吸注册到buttonPosition中
   * 
   * @param {*} _parentNode 父节点,默认为buttonTree的根节点root
   * @param {*} appendId 注册的子节点,空为所有相应子节点
   * ele_node: 挂载到buttonTree的节点数据
   * ele_node :{
   *     id: 元素id或在父节点下的下标
   *     xjId: 父节点xjId + '.' + 本节点id
   *     button: buttonJson注册的按键事件
   *     dom: 节点对应的html元素
   *     parentNode:父节点
   *     children: 子节点map集合,key为相应的id
   *     enFocus: 当前节点及子节点是否有可获焦元素,true: 存在可获焦元素,false || 空: 没有可获焦
   * }
   */
   focus_init: function (_parentNode, appendId) {
      var _this = this;
      //获取父节点
      var parentNode = _parentNode || _this.buttonTree["root"];
      //获取html子元素
      var eles = parentNode.dom.children;
      if (!parentNode.children) parentNode.children = {};
      // var result = {};
      for (var i = 0; i < eles.length; i++) {
         (function (_i) {
            var id = eles[_i].id || _i + "";
            if (!appendId || appendId == id) {
               var xjId = parentNode.xjId + "." + id;
               var ele_node = {
                  id: id,
                  xjId: xjId,
                  button: _this.buttonJson[id] || _this.buttonJson[xjId],
                  dom: eles[_i],
                  parentNode: parentNode
               }
               /**
                * 此逻辑用来纪录节点及其子节点中是否存在有可获焦节点
                * 1. 当父节点的enFocus为false时,所有子节点都要改为false
                * 2. 如果子节点为true时则更新所有父节点为true
                * 先执行1,再执行2.
                */
               if (parentNode.enFocus == false || (ele_node.button && ele_node.button.enFocus == false) ||
                   _this.getStyle(ele_node.dom, 'visibility') == 'hidden' || _this.getStyle(ele_node.dom, 'display') == 'none') {
                  ele_node.enFocus = false;
               } else if (id.indexOf("hands") >= 0) {
                  _this.flushFocusAble(ele_node);
               }
               //递归执行,获取相应子元素节点数据
               _this.focus_init(ele_node);
               //生成子节点数据挂载到父节点children下
               parentNode.children[id] = ele_node;
               if (eles[_i].id) {
                  // 装配好的节点数据注册到buttonPosition;
                  _this.buttonPosition[id] = ele_node;
               }
            }
         })(i)
      }
      return parentNode;
   },
   /**
    * 刷新节点及其父节点的enfocus为true
    * @param {*} ele 相应节点
    */
   flushFocusAble: function (ele) {
      var _this = this;
      ele.enFocus = true;
      if (ele.parentNode && ele.parentNode.enFocus != true) {
         _this.flushFocusAble(ele.parentNode);
      }
   },

   /**
    * 根据元素id获取相应的节点数据
    * @param {*} id 元素id
    * @returns 元素节点数据 
    */
   getEle: function (id) {
      var _this = this;
      return _this.buttonPosition[id] || null;
   },
   /**
    * 相应节点设置button
    * @param {*} id 元素id
    * @param {*} button button对象
    */
   setEleButton:function(id,button){
      if(_this.buttonPosition[id]) {
         _this.buttonPosition[id].button = button;
      }
   },
   /**
    * 把相应的元素节点数据添加到父节点中去
    * 此函数用途极少, 删除
    * @param {*} id 元素id
    * @param {*} parentEle 父节点
    * @param {*} button 元素相应button
    */
   appendEle: function (id, parentEle,button) {
      var _this = this;
      if (!CT.$(id)) return;
      parentEle = parentEle || _this.buttonTree["root"];
      if (typeof (parentEle) == 'string') {
         parentEle = _this.getEle(parentEle);
      }
      if(button) {
         _this.buttonJson[id] = button;
      }
      if (!parentEle) return;
      _this.focus_init(parentEle, id);

   },
   /**
    * 删除注册好的相应的节点元素
    * @param {*} id 元素id
    */
   delEle: function (id) {
      var _this = this;
      if (!_this.buttonPosition[id]) return null;
      var result = _this.getEle(id);
      if(result.children) {
         for(var key in result.children) {
            //递归删除所有子节点
            _this.delEle(key);
         }
         result.children = undefined;
      }
      result = undefined;
      _this.buttonPosition[id] = null;
      //删除缓存
      if(_this.buttonAction.cacheMap && _this.buttonAction.cacheMap[id]) {
         var curFocusIdActions = _this.buttonAction.cacheMap[id];
         if( CT.isArray(curFocusIdActions)) {
            for(var k in curFocusIdActions) {
               curFocusIdAction = curFocusIdActions[k];
               if(!curFocusIdAction || curFocusIdAction.indexOf(".") < 0) continue;
               var curFocusId = curFocusIdAction.split('.')[0];
               var action = curFocusIdAction.split('.')[1];
               if(_this.buttonAction.cache && _this.buttonAction.cache[curFocusId]){
                  _this.buttonAction.cache[curFocusId][action] = null;
               }
            }
         }
      }
   },
   /**
    * 更新已注册好的节点或节点下的指定子元素,重新挂载到注册列表中
    * @param {*} id 元素id,事先已注册过的id
    * @param {*} childId 指定更新子元素id,如果为空,则只更新元素id的节点
    *  @returns {object} 已更新的id节点数据
    */
   updateEle: function (id,childId) {
      var _this = this;
      if (!id) return null;
      var result = _this.getEle(id);
      if (!result) {
         _this.buttonPosition[id] = undefined;
         return null;
      }
      result.enFocus = undefined;
      if (childId) {
         if (result["children"][childId]) {
            _this.delEle(childId);
         }
         _this.focus_init(result, childId);
      } else {
         _this.delEle(id);
         var parentNode = result.parentNode || _this.buttonTree.root;
         _this.focus_init(parentNode,id);
      }
      return _this.getEle(childId||id);
   },
   
   lock: false,
   /**
    * 按键锁定,同时返回是否已锁定成功
    * 如未锁定成功并需要强行锁定,建议先解锁再锁定
    * @param {*} time 超时时间
    *  @returns {boolean} 是否锁定成功.true:成功,false:失败
    */
   lockKey: function (time) {
      var _this = this;
      if (_this.lock) return false;
      clearTimeout(_this.lockTimer);
      time = time || 1000;
      _this.lockTimer = setTimeout(function () {
         _this.unLockKey();
      }, time);
      _this.lock = true;
      return true;
   },
   /**
    * 按键解锁
    */
   unLockKey: function () {
      var _this = this;
      clearTimeout(_this.lockTimer);
      _this.lock = false;
      return true;
   },
   /**
    * 获取键值code
    * @param evt  键盘事件响应值
    * @returns {any}
    */
   keyCode: function (evt) {
      evt = evt != null && evt != undefined ? evt : window.event;
      var keyCode = evt.which != null && evt.which != undefined && evt.which != 0 ? evt.which : evt.keyCode;
      return keyCode;
   },
   /**
    * 按键触发事件,兼容原来版本函数
    * @param {*} action 按键事件
    * @param {*} focusId 触发元素id
    */
   focusHand: function (action, focusId) {
      var _this = this;
      var result = _this.doKeyEvent(_this.getEle(focusId || xjCurFocus.FocusID), action);
   },
   /**
    * 执行节点事件触发函数
    * @param {*} buttonEle 函数挂载节点
    * @param {*} action 触发事件
    * @param {*} curEle 触发节点
    * @returns {object} 是否继续父节点事件
    */
   doEvent: function (buttonEle, action,curEle) {
      if (!buttonEle) return false;
      if (!buttonEle.button) return true;
      var _this = this;
      if (buttonEle.button[action + "Event"]) {
         if (buttonEle.button[action + "Event"] == 'disable') return false;
         if (typeof (buttonEle.button[action + "Event"]) === "function") {
            var params = [];
            curEle = curEle || {button:{}};
            var eventParam = curEle.button[action + "EventParam"] || curEle.button["eventParam"] || buttonEle.button[action + "EventParam"] ||  buttonEle.button["eventParam"] ;
            if(CT.isArray(eventParam)) {
               params = params.concat(eventParam);
            } else if(eventParam) {
               params.push(eventParam);
            }
            params.push(curEle || buttonEle);
            var eventObj = buttonEle.button[action + "EventObj"] || buttonEle.button[ "eventObj"] || curEle.button[action + "EventObj"] || curEle.button[ "eventObj"] || (_this.buttonJson && _this.buttonJson.eventObj);
            return buttonEle.button[action + "Event"].apply(eventObj, params);
         } else {
            return _this.exeCode(buttonEle.button[action + "Event"]);
         }
      }
      var actionId = buttonEle.button[action]
      if (actionId) {
         //此处为注册好的获焦,将拦截自动获焦事件.但是如果获焦失败,现是会继续执行下个获焦事件 当你指定appoint:,如果不存在,将中止父节点相应事件函数执行
         if(buttonEle.button[action] == 'disable' || actionId.indexOf("appoint:") >= 0 && _this.changeFocus(actionId.replace("appoint:",""))) {
            return false;
         }
         return !_this.changeFocus(actionId);
      }
      return true;
   },

   /**
    * 触发javascript事件,把以字符注册的函数执行并返回结果
    * @param {*} _code 
    */
   exeCode: function (_code) {
      var _this = this;
      if (!_code) return;
      var code = _code;
      try {
         if (code.indexOf("javascript:") > -1) {
            code = code.replace("javascript:", "");
         }
         return eval('(' + code + ')');
      } catch (e) {
      }
   },

   /**
    * 将焦点切换到 id为 focusId 的dom上
    * @param {*} focusId 
    */
   changeFocus: function (focusId) {
      var _this = this;
      if (xjCurFocus.FocusID != focusId && _this.buttonPosition[focusId]) {
         if (_this.buttonPosition[focusId].enFocus == true) {
            xjCurFocus.lastFocusId = xjCurFocus.FocusID;
            xjCurFocus.FocusID = focusId;
            var lastFocus = _this.getEle(xjCurFocus.lastFocusId);
            var curFocus = _this.getEle(xjCurFocus.FocusID);
            xjCurFocus.lastEle = lastFocus;
            xjCurFocus.curEle = curFocus;
            if(curFocus.button) {
               xjCurFocus.TempData = curFocus.button.TempData;
            }
            if (lastFocus) {
               _this.doBlur(lastFocus);
            }
            _this.doFocus(curFocus);

            return xjCurFocus;
         }
      }
      return null;
      // PAGE.changeFocus(focusId);
   },
   /**
    * 寻找最近焦点(当前焦点被删除后)
    * @param {*} id 当前焦点id
    */
   // findNearyByFocus:function(curEle) {
   //    var _this = this;
   //    if(!id){
   //       if(_this.getEle(curFocus.id)) {
   //          return findNearyByFocus(curFocus.id);
   //       }
   //    } 
   // },
   /**
    * 失去焦点Blur事件
    * 同时触发onBlurEvent事件
    * @param {*} lastFocus 失去焦点的节点
    */
   doBlur: function (lastFocus) {
      var _this = this;
      if(lastFocus.button && lastFocus.button.beBlur) {
         var ImgID = lastFocus.id.split("_")[3];
         var __focus = {}
         __focus.ele = lastFocus.dom;
         __focus.focusImg = CT.$(ImgID);
         __focus.showImg = CT.$(ImgID + "Img");
         __focus.gb = CT.$("gb");
         for(var key in lastFocus.button.beBlur) {
            if(__focus[key]) {
               for(var _k in lastFocus.button.beBlur[key]) {
                  if(_k == 'css') {
                     __focus[key].className = lastFocus.button.beBlur[key]["css"];
                  } else {
                     switch(_k) {
                        case 'visibility' :
                           __focus[key].style.visibility = lastFocus.button.beBlur[key][_k];
                           break;
                        case "display" :
                           __focus[key].style.display = lastFocus.button.beBlur[key][_k];
                           break;
                        default:
                           __focus[key].style[_k] = lastFocus.button.beBlur[key][_k];
                     }
                  }
               }
            }
         }
         _this.doKeyEvent(lastFocus, "onBlur");
      }
   },
   /**
    * 获取焦点focus事件
    * 同时触发该节点的onFocus事件
    * @param {*} curFocus 
    */
   doFocus: function (curFocus) {
      var _this = this;
      var _focusStyle = _this.styleCssList[_this.getFocusType(curFocus)];
      var ImgID = curFocus.id.split("_")[3];
      var __focus = {}
      __focus.ele = curFocus.dom;
      __focus.focusImg = CT.$(ImgID);
      __focus.showImg = CT.$(ImgID + "Img");
      __focus.gb = CT.$("gb");
      curFocus.button = curFocus.button || {};
      curFocus.button.beBlur={}
      if(_focusStyle) {
         for(var key in _focusStyle) {
            if(__focus[key]){
               curFocus.button.beBlur[key] = {};
               for(var _k in _focusStyle[key]) {
                  if(_k == 'css') {
                     var focusCss = _focusStyle[key]["css"];
                     if (focusCss) {
                        var reg = new RegExp("(\\s*)" + focusCss + "(\\s*)");
                        __focus[key].className = __focus[key].className.replace(reg, " ");
                        curFocus.button.beBlur[key]["css"] = __focus[key].className;
                        __focus[key].className += " " + focusCss;
                     } 
                  } else if(_k == 'clearTimeout'){
                     var timer = _focusStyle[key][_k];
                     if(timer) {
                        clearTimeout(_focusStyle[key][_k]);
                        _focusStyle[key][_k] = null;
                     }
                  } else {
                     curFocus.button.beBlur[key][_k] = __focus[key].style[_k];
                     if(_k == 'visibility' ) {
                        __focus[key].style.visibility = _focusStyle[key][_k];
                     } if(_k == "display") {
                        __focus[key].style.visibility = _focusStyle[key][_k];
                     }
                  }
               }
            }
         }
      }
      _this.doKeyEvent(curFocus, "onFocus");
   },
   /**
    * 获取节点焦点类型
    * @param {*} focusEvt 
    */
   getFocusType: function (focusEvt) {
      if(focusEvt.button && !isNaN(focusEvt.button.focusType)) {
         return focusEvt.button.focusType;
      }
      if (focusEvt && focusEvt.id && focusEvt.id.indexOf("hands") == 0) {
         return 0;
      }
      return false;
   },

   /***********************自动焦点************************************/
   /**
    * 获取int值
    * @param {string} val 原值
    * @param {int} defval 如果转换失败的默认值
    */
   getInt: function (val, defval) {
      var _this = this;
      try {
         var res = parseInt(val);
         if (isNaN(res)) {
            if (defval) {
               return _this.getInt(defval);
            }
         } else {
            return res;
         }
      } catch (e) {

      }
      return 0;
   },
   /**
    * 获取节点el1在el2公共最小父节点元素中的坐标
    * @param {*} ele 需要知道位置坐标的节点
    * @param {*} ele2 共同父节点下的另一个节点
    * @returns{*} 返回第el1节点位置坐标
    */
   getPosition: function (el1, el2){
      return this._getPosition1(el1,el2);
   },
   /**
    * 计算坐标真实执行函数
    * @param {*} ele 
    * @param {*} ele2 
    * @param {*} res 
    */
   _getPosition1:function(ele,ele2, res) {
      var _this = this;
      if (typeof(ele) === 'string') {
         ele = _this.getEle(ele);
      }
      if (typeof(ele2) === 'string') {
         ele2 = _this.getEle(ele2);
      }
      ele2 = ele2 || _this.buttonTree.root || {};
      if (!res) {
         res = {
            top: 0,
            left: 0,
            width: _this.getInt(_this.getStyle(ele.dom, "width"), 2),
            height: _this.getInt(_this.getStyle(ele.dom, "height"), 2)
         }
      }
      if ((ele.xjId && ele2.xjId.indexOf(ele.xjId) == 0 ) || !ele.parentNode) {
         return res;
      }
      if(_this.getStyle(ele.dom, "position") == 'absolute') {
         res.top += _this.getInt(_this.getStyle(ele.dom, "top"));
         res.left += _this.getInt(_this.getStyle(ele.dom, "left"));
      }
      if (isNaN(res.width) || isNaN(res.height)) { //如果当前焦点元素没有width,或height,从父节点获取
         res.width = _this.getInt(_this.getStyle(ele.dom, "width"), 2);
         res.height = _this.getInt(_this.getStyle(ele.dom, "height"), 2);
      }
      return _this._getPosition1(ele.parentNode, ele2, res);
   },
   /**
    * 获取元素使用的样式值
    * @param {*} obj 元素id或元素本身
    * @param {*} attr 样式
    */
   getStyle: function (obj, attr) {
      if (typeof (obj) === 'string') {
         obj = CT.$(obj)
      }
      if (!obj) return "";
      if (obj.currentStyle) {
         obj.currentStyle[attr];
         return obj.currentStyle[attr];
      } else if (window.getComputedStyle) {
         //非IE，
         return window.getComputedStyle(obj, null)[attr];
      } else {
         return obj.style[attr];
      }
   },
   /**
    *  事件执行,包含自动获焦事件
    *  执行的相应节点注册函数,或不存在或返回为true,则会执行父类相应事件
    * @param {*} ele 方法节点元素
    * @param {*} action 动作
    */
   doKeyEvent: function(ele,action) {
      if(!ele || ! action ) return false;
      return this._doKeyEvent1(ele, action);
   },
   /**
    *
    * 事件执行,包含自动获焦事件
    * @param {*} ele 当前元素
    * @param {*} action 行为
    * @param {*} _ele 触发事件的当前元素
    * @param {*} contains 已寻最大父容器
    * @param {*} state end为向下寻找相应节点.作用于自动寻焦
    */
   _doKeyEvent1: function (ele, action, _ele, contains, state) {
      var _this = this;
      _ele = _ele || ele;
      if(state != "end" && !_this.doEvent(ele, action,_ele)) {
         return false;
      };
      if (!ele.parentNode) return false;
      //已寻最大容器
      contains = contains || ele.parentNode;
      var nearby = { ele: _ele, value: [] };
      switch (action) {
         case "left":
         case "right":
         case "up":
         case "down":
         var buttonAction = _this.buttonAction.actions[_this.buttonAction.offset];
         if(!buttonAction.autoFocus || typeof(buttonAction.actionFunc) !== 'function') {
            return;
         }
         if(buttonAction.cache) {
            var resEle = _this.getActionCache(_ele,action);
            if(resEle) {
               if(resEle == "disable") return null;
               return resEle;
            }
         }
         var eles = ele.parentNode.children;
         var eleP = _this.getPosition(_ele, contains);   //当前元素在父节目点的位置
         var _curEle = {
            id:_ele.id,
            xjId:_ele.xjId,
            left: eleP.left,
            top: eleP.top,
            right: eleP.left + eleP.width,
            bottom: eleP.top + eleP.height
         };
         for (var __ele in eles) {
            if (!eles[__ele] || !eles[__ele].enFocus) continue;
            if (eles[__ele].xjId != ele.xjId || state == "end") {
               var p = _this.getPosition(eles[__ele], contains);
               //获取两个元素在当前父节点下的四边位置
               var _nextEle = {
                  id: eles[__ele].id,
                  xjId: eles[__ele].xjId,
                  left: p.left,
                  top: p.top,
                  right: p.left + p.width,
                  bottom: p.top + p.height,
               };
               var resPosition = buttonAction.actionFunc(_curEle,_nextEle,action);
               if(resPosition) {
                  if(! CT.isArray(resPosition)) {
                     resPosition = [resPosition];
                  }
                  for(var i = 0 ;i < resPosition.length;i++) {
                     if(nearby.value.length < i || nearby.value[i] > resPosition[i]) {
                        nearby = { ele: eles[__ele], value: resPosition };
                        break;
                     } else if(nearby.value[i]  < resPosition[i]){
                        break;
                     }
                  }
               }
            }
         }
      }
      //本层无适合,非顶级容器,向上找(end为向下标识)
      if (state != "end" && (nearby.value.length == 0 || nearby.value == -1) && ele.parentNode) {
         contains = ele.parentNode.parentNode;
         return _this._doKeyEvent1(ele.parentNode, action, _ele);
      } else {
         if ( (nearby.value.length > 0 || nearby.value != -1) && nearby.ele && nearby.ele.id && nearby.ele.id.indexOf("hands") >= 0) { //满足条件,返回结果
            _this.setActionCache(_ele,nearby.ele,action);
            return _this.changeFocus(nearby.ele.id);
         } else if (nearby.value.length > 0  || nearby.value != -1) { //满足条件的组件元素为父节点,向下找
            for (var _k in nearby.ele.children) {
               return _this._doKeyEvent1(nearby.ele.children[_k], action, _ele, contains, "end")
            }
         } else {
            _this.setActionCache(_ele,'disable',action);
            return null;
         }
      }
   },

   /***********************自动焦点 end************************************/
   /**
    * 显示元素 这是个测试函数.本意是把该节点元素及所有父元素设置为显示状态. 还有一定的优化空间.
    */
   showElement: function(curEle){
      var _this = this;
      if(typeof(curEle) === 'string') {
         curEle = _this.getEle(curEle);
      }
      if(!curEle) return null;
      while(curEle && curEle.dom) {
         try{
            _this.getStyle(curEle.dom, 'display') == 'none' && (curEle.dom.style.display = '');
            _this.getStyle(curEle.dom, 'visibility') == 'hidden' && (curEle.dom.style.visibility = '');
         }catch(e){}
         curEle = curEle.parentNode;
      }
   },
   // 兼容key3_4,getModelByFocusId,getFocusModel6,focusInit
   getModelByFocusId:function(focusId) {
      var _this = this;
      if(_this.buttonPosition[focusId]) {
         return _this.buttonPosition[focusId]["button"];
      }
      return {};
   },
   getFocusModel6:function(focusId) {
      var _this = this;
      if(_this.buttonPosition[focusId]) {
         return _this.buttonPosition[focusId]["button"];
      }
      return {};
   },
   focusInit:function(){
      var _this = this;
      for(var i = 0 ;i < buttons.length;i ++) {
         if($keyCode.buttonJson[buttons[i].id]) continue;
          $keyCode.buttonJson[buttons[i].id] = buttons[i];
          if(buttons[i]) {
            if(!buttons[i]["okEvent"] && buttons[i]["clickHandler"]) {
               buttons[i]["okEvent"] = buttons[i]["clickHandler"];
            }
            if(!buttons[i]["onFocusEvent"] && buttons[i]["otherFocusEvent"]) {
               buttons[i]["onFocusEvent"] = buttons[i]["otherFocusEvent"];
            }
            if(!buttons[i]["onBlurEvent"] && buttons[i]["otherBlurEvent"]) {
               buttons[i]["onBlurEvent"] = buttons[i]["otherBlurEvent"];
            }
          }
      }
      _this.focus_init();
   }
}

var xjOnkeypress = function (evt) {
   console.time("testkey");
   try {
        evt.preventDefault();
        evt.canceBubble = true; //解决冒泡事件，兼容所有浏览器，但是不符合W3c标准
        evt.stopPropagation();//不兼容IE8及其以下，符合W3c标准
   } catch (e) { }
   if (!$keyCode.lockKey()) return;
   var keyCode1 = $keyCode.keyCode(evt);
   var keyName = xjKeyCodes[keyCode1 + ""] || keyCode1;
   keyDownEventName = keyName;
   CT.stopJump();
   console.time("testkey1");
   $keyCode.focusHand(keyName)
   console.timeEnd("testkey1");
   window['page'] && window['page'].keyDown && window['page'].keyDown(keyName);
   $keyCode.unLockKey();
   console.timeEnd("testkey");
}
document.onkeydown = xjOnkeypress;
//兼容key3_4.js
window["PAGE"] = $keyCode;
window["curFocus"] = xjCurFocus;