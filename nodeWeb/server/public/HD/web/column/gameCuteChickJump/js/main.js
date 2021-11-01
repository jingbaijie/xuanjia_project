function Animator(duration, progress) {
    this.duration = duration;
    this.progress = progress;
    this.next = true;
}

/*循环执行动画*/
Animator.prototype = {
    constructor: Animator,
    start: function (finished) {
        var startTime = new Date().getTime();
        var duration = this.duration, self = this, timeOut = 0;
        var vendors = ["webkit", "moz"];
        //for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
          //  window.requestAnimationFrame = window[vendors[i] + "RequestAnimationFrame"];
        //}
        //if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function (callback, element) {
                var start = 0, finish = 0;
                window.setTimeout(function () {
                    start = +new Date();
                    callback(start);
                    finish = +new Date();
                    timeOut = 1000 / 300 - (finish - start);
                }, 300);
            };
        //}
        window.requestAnimationFrame(function step() {

            var p = (new Date().getTime() - startTime) / duration;//转成百分比
            self.progress(p);//进行显示隐藏的方法
            if (p >= 1.0) {
                self.progress(1.0);
                startTime = new Date().getTime();
                ;
            }
            if (self.next) window.requestAnimationFrame(step); else finished();
        });
    },
    start1Time: function (finished) {
        var startTime = new Date().getTime();
        var duration = this.duration, self = this, timeOut = 0;
        var vendors = ["webkit", "moz"];
        for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
            window.requestAnimationFrame = window[vendors[i] + "RequestAnimationFrame"];
        }
        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function (callback, element) {
                var start = 0, finish = 0;
                window.setTimeout(function () {
                    start = +new Date();
                    callback(start);
                    finish = +new Date();
                    timeOut = 1000 / 300 - (finish - start);
                }, timeOut);
            };
        }
        window.requestAnimationFrame(function step() {

            var p = (new Date().getTime() - startTime) / duration;//转成百分比
            self.progress(p);//进行显示隐藏的方法

            if (p >= 1.0) {
                self.progress(1.0);
                self.next = false;
                finished();
            }
            if (self.next) window.requestAnimationFrame(step);

        });
    },
    start2Time: function (finished) {
        var startTime = new Date().getTime();
        var duration = this.duration, self = this, timeOut = 0;
        var vendors = ["webkit", "moz"];
        for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
            window.requestAnimationFrame = window[vendors[i] + "RequestAnimationFrame"];
        }
        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function (callback) {

                window.setTimeout(function () {

                    callback();

                }, 100);
            };
        }
        window.requestAnimationFrame(function step() {

            var p = (new Date().getTime() - startTime) / duration;//转成百分比
            self.progress(p);//进行显示隐藏的方法

            if (p >= 1.0) {
                self.progress(1.0);
                self.next = false;
                finished();
            }
            if (self.next) window.requestAnimationFrame(step);

        });
    }
}


/*heroJump 的动画*/
var heroConfiger = {animNum: 9, failNum: 4};//个数
var heroJumpAnimator;
var cookieIn=0;
var HeroJumpAnimatorStart = function () {
    hero.state = 1;
    // 动画方法
    var index = 0;
    heroJumpAnimator = new Animator(70 * heroConfiger.animNum, function (p) {
        index = Math.floor(p * heroConfiger.animNum);

        if (index >= heroConfiger.animNum) {
            index = 0;
        }
        var indexB = 8;
        indexB = index == 0 ? indexB : (index - 1);
        document.getElementById("heroJump").getElementsByTagName("img")[cookieIn].style.visibility = "hidden";
        document.getElementById("heroJump").getElementsByTagName("img")[indexB].style.visibility = "hidden";
        document.getElementById("heroJump").getElementsByTagName("img")[index].style.visibility = "visible";
        cookieIn=index;
        if (p > 0.5) {
            var pp = p > 1 ? 1 : p;
            hero.moveBG(hero.BGMove * (pp));

        }

        if (hero.currentP == hero.targetP) {

        } else if (hero.currentP != 0) {//当前不在左边
            if (hero.targetP == 0) {//目标左边
                var pindex = p > 1 ? 1 : p;
                hero.left(hero.rightP.left - hero.diffDistance * pindex);

            }
        } else {//主角在左边
            if (hero.targetP == 1) {//目标右边
                var pindex = p > 1 ? 1 : p;
                hero.left(hero.leftP.left + hero.diffDistance * pindex);
            }

        }


    });
    heroJumpAnimator.start1Time(//调用方法开始循环
        function () {
            hero.state = 0,
                hero.BG0Rank += 1;
            hero.BG1Rank += 1;
            hero.currentP = hero.targetP;


            //  flowerArrs.removeChild(flowerArrs[flowerArrs.length-1]);
            for (var i = 0; i < flowerArrs.length; i++) {
                hero.flowerArrs[i][1] = hero.flowerArrs[i][1] + 1;
            }


            hero.flowerArrs.unshift([-140, 0]);
            hero.flowerArrs.pop();
            var a = Math.floor(Math.random() * 2);
            randomFlowerArr.unshift(a);
            randomFlowerArr.pop();

            var node = flowerArrs[flowerArrs.length - 1];

            node = document.createElement("img");
            node.src = "./HD/web/column/gameCuteChickJump/image/flower/flower0.png";
            var b=Math.floor(Math.random()*2);
            if(b==0){
                node.src = "./HD/web/column/gameCuteChickJump/image/flower/flower0.png";
            }else{
                node.src = "./HD/web/column/gameCuteChickJump/image/mushroom/mushroom0.png";
            }


            node.style.width = "196px";
            node.style.height = "261px";
            node.style.position = "absolute";
            node.style.top = "-140px";
            node.style.left = flowerLR[randomFlowerArr[0]] + "px";


            flowerArrs[0].parentNode.insertBefore(node, flowerArrs[0]);

            flowerArrs[flowerArrs.length - 1].parentNode.removeChild(flowerArrs[flowerArrs.length - 1])

            if (hero.BG0Move + hero.BG0Rank * 150 > 720) {
                hero.BG0Move = hero.BG1Move + hero.BG1Rank * 150 - 1440;
                hero.BG0Rank = 0;
            }
            if (hero.BG1Move + hero.BG1Rank * 150 > 720) {
                hero.BG1Move = hero.BG0Move + hero.BG0Rank * 150 - 1440;
                hero.BG1Rank = 0;
            }

            if (hero.currentP != randomFlowerArr[4]) {

                hidJumpfunc();


                document.getElementById("heroFail").style.left = (hero.currentP == 0 ? hero.leftP.left : hero.rightP.left) + "px"
                hero.state=2;
                HeroFailAnimatorStart();

                    showWindow();

            }else {
                scores+=5;
                scoreEle.innerHTML=scores;

            }
        }
    );
};

function hidJumpfunc() {
    for (var i = 0; i < document.getElementById("heroJump").getElementsByTagName("img").length; i++) {
        document.getElementById("heroJump").getElementsByTagName("img")[i].style.visibility = "hidden";

    }

}

function hidFailfunc() {
    for (var i = 0; i < document.getElementById("heroFail").getElementsByTagName("img").length; i++) {
        document.getElementById("heroFail").getElementsByTagName("img")[i].style.visibility = "hidden";

    }

}


//HeroJumpAnimatorStart();

/*heroFail 的动画*/

var heroFailAnimator = {};
var HeroFailAnimatorStart = function () {							// 动画方法
    var index = 0;
    heroFailAnimator = new Animator(200 * heroConfiger.failNum, function (p) {
        index = Math.floor(p * heroConfiger.failNum);

        if (index >= heroConfiger.failNum) {
            index = 0;
        }
        var indexB = 3;
        indexB = index == 0 ? indexB : (index - 1);
        document.getElementById("heroFail").getElementsByTagName("img")[indexB].style.visibility = "hidden";
        document.getElementById("heroFail").getElementsByTagName("img")[index].style.visibility = "visible";
    });
    heroFailAnimator.start(//调用方法开始循环
        function () {
            hidFailfunc();
            scores=0;
        }
    );
};

//HeroFailAnimatorStart();





