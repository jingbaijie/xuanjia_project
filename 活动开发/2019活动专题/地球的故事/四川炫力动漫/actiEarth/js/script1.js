function ScrollImg(scrollObj) {
    this.pre = scrollObj.pre;
    this.nex = scrollObj.nex;
    this.wrap = scrollObj.box;
    this.list = scrollObj.list;
    this.len = scrollObj.imgNum;                                    
    this.imgWidth = scrollObj.imgWidth;                             
    this.rate = 15;                                                 // 速率
    this.gap = 2000;                                                // 自由切换间隙
    this.picN = 1;                                                  // 当前显示图片下标
    this.disable = true;                                            // 判断是否走完了一次动画,true为完成
    this.isAuto = true;                                             // 是否停止自动轮播,false为停止
	this.timer = null;                                              // 自动轮播定时器
    this.rtimer = null;                                             // 右箭头动画定时器
    this.ltimer = null;                                             // 左箭头动画定时器
    this.then = Date.now();                                                 
    this.now = null;                                 
}
ScrollImg.prototype = {
    constructor: ScrollImg,
    // 自动轮播
    _autoplay: function () {
        var _this = this;
        this.timer = setInterval(function() {
			_this.now = Date.now();
            var t = _this.now - _this.then;
            if(t >= _this.gap){
                _this.disable = false;
                if(_this._roll(-(_this.picN + 1) * _this.imgWidth, "right")){
					_this.then = Date.now();
                    _this.picN++;
                    _this.disable = true;   // 切换完一张图片 
                }
				if(!_this.isAuto && _this.disable) {
                    clearInterval(_this.timer);
                    _this.timer = null;
                }
            }
        },20)
    },
	// 后一张
    _clickRight: function(){
		var _this = this;
        if(this.disable){
            this.disable = false;
            this.rtimer = setInterval(function () {
                if(_this._roll(-(_this.picN+1) * _this.imgWidth, "right")){
                    clearInterval(_this.rtimer);
					_this.rtimer = null;
                    _this.picN++;
					if(_this.isAuto){
					    _this._autoplay();
						_this.then = Date.now();
					}
                    return;
                }
            },20)
        }
    },
	// 前一张
    _clickLeft: function () {
		var _this = this;
        if(this.disable) {
            this.disable = false;
            this.ltimer = setInterval(function () {
                if(_this._roll(-(_this.picN-1) * _this.imgWidth, "left")){
                    clearInterval(_this.ltimer);
					_this.ltimer = null;
                    _this.picN--;
					if(_this.isAuto){
					    _this._autoplay();
						_this.then = Date.now();
					}
                    return;
                }
            }, 20)
        }
    },
    // 切换图片
    _roll: function (distance, type) {
        var speed = this.list.offsetLeft < distance ? this.rate:(0-this.rate);
            this.list.style.left = parseInt(this.list.style.left) + speed + "px";
            var leave = distance - parseInt(this.list.style.left);
            if(Math.abs(leave) <= Math.abs(speed)){
                this.list.style.left = distance+"px";
                if(this.picN === 3 && type === "right") {
                    this.list.style.left = -this.imgWidth +"px";
                    this.picN = 0;
                }
                if(this.picN === 1 && type === "left") {
                    this.list.style.left = -this.imgWidth * (this.len - 2) +"px";
                    this.picN = this.len - 1;
                }
                if(!this.isAuto && this.disable) {
                    clearInterval(this.timer);
                    this.timer = null;
                }
				this.disable = true;
                return 1; //切换完一张图片
            }
        return 0;
    },
    // 停止自动轮播
    _quitAutoplay: function() {
        this.isAuto = false;
        if(this.disable){
            clearInterval(this.timer);
            this.timer = null;
        }
    },
    // 开始自动轮播
     _beginAutoplay: function () {
		this.isAuto = true;
		clearInterval(this.timer);
		this.timer = null;
		if(!this.ltimer && !this.rtimer) {
		    this._autoplay();
		}
    }
}    