var isOrder = 1; //鉴权
var changeImgUrl = "HD/web/column/gameFlyingBattle";
//  小飞机
function Plane() {
  this.left = 70;
  this.width = 150;
  this.height = 90;
  this.top = 220;
}
Plane.prototype = {
  constructor: Plane,
  getPlanePos: function () {
    return {
      left: this.left,
      top: this.top,
      width: this.width,
      height: this.height,
      PRight: this.left + this.width,
      PBottom: this.top + this.height,
    };
  },
  //  小飞机上移
  planeUp: function () {
    var _this = this;
    var plane = document.getElementById("hands_x0_y0_planeContainer_");
    _this.top = plane.offsetTop - 15;
    plane.style.top = plane.offsetTop - 15 + "px";
    if (plane.offsetTop <= 0) {
      plane.style.top = 0;
      _this.top = 0;
    }
  },
  // 小飞机下移
  planeDown: function () {
    var _this = this;
    var plane = document.getElementById("hands_x0_y0_planeContainer_");
    _this.top = plane.offsetTop + 15;
    plane.style.top = plane.offsetTop + 15 + "px";
    if (plane.offsetTop >= 455) {
      plane.style.top = 455 + "px";
      _this.top = 455;
    }
  },
};
var plane = new Plane();

// 背景障碍物往左移动
function Barrier() {
  this.left = 890;
  this.width = 132;
  this.height = 472;
  this.top = 0;
  this.start = "";
}
Barrier.prototype = {
  constructor: Barrier,
  // 初始化
  init: function (opt) {
    var _this = this;
    _this.start = opt.start;
    _this.create(opt);
    _this.move();
  },
  // 创建障碍物/传了一个参数
  create: function (opt) {
    var _this = this;
    //将上下两张图片放在数组中并赋值给了pivArr这个变量
    var picArr = [changeImgUrl+"/img/down.png", changeImgUrl+"/img/up.png"];
    // 获取Id名为centerContent的这个id并将这个元素赋值给了centerContent这个变量
    var centerContent = document.getElementById("centerContent");
    //在页面上创建一个img的元素 并将img的元素赋值给了barriers这个变量
    var barriers = document.createElement("img");
    //将元素barriers的className定义为barriers
    barriers.className = "barriers";
    //将图片数组中的图片下标赋值给了barriers.src
    barriers.src = picArr[opt.start];
    //
    barriers.style.top = opt.top - 200 + "px";
    _this.top = opt.top - 200;
    centerContent.appendChild(barriers);
    _this.barriers = barriers;
  },
  // 背景墙移动
  move: function () {
    var _this = this;
    // 设置障碍物移动的定时器
    _this.moveTimer = setInterval(function () {
      //调用碰撞检测方法
      _this.collisionDetection();
      // 变量取反
      if (!collision) {
        // 障碍物移动距离
        // 如果障碍物的left大于本身的宽度的话
        if (_this.barriers.offsetLeft > -_this.width) {
          // 障碍物往左走30px
          _this.barriers.style.left = _this.barriers.offsetLeft - 30 + "px";
          _this.left = _this.barriers.offsetLeft - 30;
        }
        // 如果障碍物在左侧消失的话
        if (_this.barriers.offsetLeft <= -_this.width) {
          // 清除定时器
          clearInterval(_this.moveTimer);
          // 删除消失的障碍物
          _this.barriers.parentNode.removeChild(_this.barriers);
          // 设置一个计时的定时器
          setTimeout(function () {
            // 把0-7的索引赋值给index
            var index = Math.floor(Math.random() * 1000) % 8;
            // 构造函数实例化
            var barrier = new Barrier();
            // 调用障碍物的init方法
            barrier.init(barrierOptions[index]);
            // 将障碍物push进数组中
            barriersArr.push(barrier);
          }, 4000);
        }
      }
    }, 80);
  },
  //获取墙位置
  getBarrierPos: function () {
    return {
      left: this.left,
      top: this.top,
      width: this.width,
      height: this.height,
      PRight: this.left + this.width,
      PTop: this.top + 116,
      PBottom: this.top + 116 + this.height,
    };
  },
  //碰撞检测
  collisionDetection: function () {
    var _this = this;
    //飞机当前位置
    var planePos = plane.getPlanePos();
    //墙当前位置
    var barrierPos = _this.getBarrierPos();
    if (barrierPos.left < 100 && barrierPos.left > 70) {
      if (barrierPos.top < 0) {
        if (planePos.top < barrierPos.top + 472) {
          explosion(planePos.top);
          barriersArr.forEach(function (barrier) {
            barrier.stop();
            stop();
            setTimeout(function () {
              document.getElementById("over").style.visibility = "visible";
              PAGE.changeFocus("hands_x0_y0_gameOver_");
            }, 4000);
          });
          collision = true;
        }
      } else {
        if (barrierPos.top < planePos.top + 90) {
          explosion(planePos.top);
          barriersArr.forEach(function (barrier) {
            barrier.stop();
            stop();
            setTimeout(function () {
              document.getElementById("over").style.visibility = "visible";
              PAGE.changeFocus("hands_x0_y0_gameOver_");
            }, 2000);
          });
          collision = true;
        }
      }
    }
  },
  stop: function () {
    clearInterval(this.moveTimer);
  },
};
// var barrier = new Barrier();
var barrierOptions = [
  {
    top: -10,
    start: 0,
  },
  {
    top: 550,
    start: 1,
  },
  {
    top: -10,
    start: 0,
  },
  {
    top: 500,
    start: 1,
  },
  {
    top: -120,
    start: 0,
  },
  {
    top: 520,
    start: 1,
  },
  {
    top: -100,
    start: 0,
  },
  {
    top: 515,
    start: 1,
  },
];
var barriersArr = []; //所有的障碍物
var collision = false; //是否碰撞
// 开始游戏
var bombMoveTimer = null;
var bomb;
function startGame() {
  for (var i = 0; i < 7; i++) {
    !(function (m) {
      setTimeout(function () {
        // var index = Math.floor(Math.random() * 1000) % 8;
        var barrier = new Barrier();
        barrier.init(barrierOptions[m]);
        barriersArr.push(barrier);
      }, m * 1000);
    })(i);
  }
  setTimeout(function () {
    if (collision == false) {
      bomb = new Bomb();
      bomb.init();
      bombLocation();
    }
  }, 4000);

  PAGE.focusInit();
  if (curFocus) {
    PAGE.changeFocus("hands_x0_y0_planeContainer_");
  }
}
// 炸弹移动
function bombLocation() {
  var randomBombContainer = document.getElementById("randomBombContainer");
  bombMoveTimer = setInterval(function () {
    bomb.detectionBomb();
    if (randomBombContainer.style.visibility == "visible") {
      randomBombContainer.style.left = randomBombContainer.offsetLeft - 30 + "px";
      bomb.left = randomBombContainer.offsetLeft - 30;
      if (document.getElementById("randomBombContainer").style.left.split("px")[0] * 1 < -149) {
        var randomTime = Math.floor(Math.random() * 5 + 3) * 1000;
        setTimeout(function () {
          document.getElementById("randomBombContainer").style.left = "980px";
        }, randomTime);
      }
    }
  }, 80);
}
function stop() {
  clearInterval(bombMoveTimer);
}
// 炸弹随机出现页面中
function Bomb() {
  this.left = 1050;
  this.width = 149;
  this.height = 138;
  this.top = 297;
  this.bombMoveTimer = null;
}
Bomb.prototype = {
  constructor: Bomb,
  //获取炸弹位置
  getBombPos: function () {
    return {
      left: this.left,
      top: this.top,
      width: this.width,
      height: this.height,
    };
  },
  // 初始化
  init: function () {
    var _this = this;
    setTimeout(function () {
      var bombArr = [
        { src: changeImgUrl+"/img/agong.png", left: 300 },
        { src: changeImgUrl+"/img/iron.png", left: 700 },
        { src: changeImgUrl+"/img/super.png", left: 650 },
        { src: changeImgUrl+"/img/universe.png", left: 530 },
        { src: changeImgUrl+"/img/traman.png", left: 800 },
      ];
      // 取IP炸弹的随机数
      var randomBombContainer = document.getElementById("randomBombContainer");
      var bombIndex = Math.floor(Math.random() * bombArr.length); //[0,4]
      var randomBombLeft = Math.floor(Math.random() * bombArr.length);
      document.getElementById("randomBomb").src = bombArr[bombIndex].src;
      randomBombContainer.style.left = bombArr[randomBombLeft].left + "px";
      _this.left = randomBombContainer.style.left;
      _this.move();
      _this.detectionBomb();
    }, 100);
  },
  // 炸弹移动
  move: function () {
    // var randomBombContainer = document.getElementById("randomBombContainer");
    // this.bombMoveTimer = setInterval(function () {
    //   if (randomBombContainer.style.visibility == "visible") {
    //     randomBombContainer.style.left = randomBombContainer.offsetLeft - 10 + "px";
    //     this.left = randomBombContainer.offsetLeft - 10;
    //     if (document.getElementById("randomBombContainer").style.left.split("px")[0] * 1 < -149) {
    //       document.getElementById("randomBombContainer").style.left = "980px";
    //     }
    //   }
    // }, 200);
  },
  // 检测炸弹
  detectionBomb: function () {
    var _this = this;
    var randomBombContainer = document.getElementById("randomBombContainer");
    var planePos = plane.getPlanePos();
    var bombPos = _this.getBombPos();
    //计算概率
    var bombProbability = Math.ceil(Math.random() * 100);
    if (randomBombContainer.style.left == "visibility") {
      randomBombContainer.style.left == "hidden";
    } else {
      randomBombContainer.style.left == "visibility";
      if (bombPos.left < 100 && bombPos.left > 70) {
        if (planePos.left + planePos.width > bombPos.left) {
          if (planePos.top + 90 < bombPos.top + 138) {
            explosion(planePos.top);
            barriersArr.forEach(function (barrier) {
              barrier.stop();
              _this.stop();
              setTimeout(function () {
                document.getElementById("ToCartoon").style.visibility = "visible";
                PAGE.changeFocus("hands_x0_y0_jumpToDetails_");
              }, 2000);
              document.getElementById("randomBombContainer").style.visibility = "hidden";
            });
            collision = true;
          }
        }
      }
    }
  },
  stop: function () {
    clearInterval(bombMoveTimer);
  },
};

// 爆炸动画
var a = 0;
function explosion(top) {
  document.getElementById("bootContainer").style.top = top + "px";
  var bootImg = document.getElementById("boot");
  var bootTimer = setInterval(function () {
    console.log(a);
    if (a > 4) {
      clearInterval(bootTimer);
      bootImg.src = "";
    } else {
      bootImg.src = changeImgUrl+"/img" + "/boot" + "/" + (a + 1) + ".png";
      a++;
    }
  }, 500);
}

// 撞到炸弹后再来一局
function reset() {
  // 鉴权
  orderJs.columnGetAuth(function (data) {
    if (data == 0) {
      isOrder = 0;
      window.location.reload();
    } else {
      isOrder = 1;
      orderJs.columnToOrderPage("flyingBattle");
      toOrder();
    }
  });
}
// 游戏结束
function gameFailed() {
  // 鉴权
  orderJs.columnGetAuth(function (data) {
    if (data == 0) {
      isOrder = 0;
      reset();
    } else {
      isOrder = 1;
      orderJs.columnToOrderPage("flyingBattle");
      toOrder();
    }
  });
}
// 跳卡通详情
function jumpCartoon() {
  // 加入鉴权  已订购用户跳详情  未订购用户跳订购
  var randomBomb = document.getElementById("randomBomb");
  orderJs.columnGetAuth(function (data) {
    if (data == 0) {
      isOrder = 0;
      if (randomBomb.src.indexOf("/img/agong.png") != -1) {
        cartoonId = "2538";
      } else if (randomBomb.src.indexOf("/img/iron.png") != -1) {
        cartoonId = "1891";
      } else if (randomBomb.src.indexOf("/img/super.png") != -1) {
        cartoonId = "2647";
      } else if (randomBomb.src.indexOf("/img/universe.png") != -1) {
        cartoonId = "2432";
      }
    } else {
      isOrder = 1;
      orderJs.columnToOrderPage("flyingBattle");
      toOrder();
    }
  });
}
// 发送请求
function sendInfo() {
  ajax.init({
    url: AjaxConfig.interfaceUrl + "findRecCommonPageInfo",
    method: "get",
    params: {
      contentName: CT.querySearchUrlKey(window.location.href, "contentName"),
    },
    async: true,
    ContentType: "json",
    success: function (data) {
      // 通用日志
      setLoggerInfo.pageInfoLog = data;
      if (data.successFlg == "1") {
        OutJson = data.data;
      } else {
        OutJson = [];
      }
    },
    fail: function (status) {},
  });
}
sendInfo();
// 跳转订购
function toOrder() {
  PAGE.otherPageParam =
    "&contentId=" +
    CT.requestValue("contentId") +
    "&contentEName=" +
    CT.requestValue("contentEName") +
    "&contentCName=" +
    CT.requestValue("contentCName") +
    "&action" +
    CT.requestValue("action") +
    "&curFocusId=" +
    curFocus.FocusID;
  CT.goPage();
}
// 返回
function backFunc() {
  CT.backPage();
}
