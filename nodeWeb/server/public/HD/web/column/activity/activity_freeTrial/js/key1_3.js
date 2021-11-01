

/**
 * 更新日志
 * 150617：按钮确定事件中，添加了判断if (this.enable == true &&  this.enFocus == true) 
 * *150629 :PAGE对象中添加调试对象，控制是否允许调式，一般上线后，需要更改为false
 * *150708:去除焦点获取焦点中的初始化Init方法中，重新为焦点赋值老图片地址
 * *150906：在失去焦点方法里面，去除focetype为7时，切换为原始图片
 * *150916:按键事件方法中添加了屏蔽默认的按键事件，比如按退出，机顶盒如果不屏蔽会自动回到首页，屏蔽了，就不会了
 * *150916:添加南京广电返回按键码
 */
/** *********************************************************************************************************************** */
// 此js插件，不能用在广东项目中
// 需要改变自动寻找焦点位置的数组
var focusDires = new Array();
var btn={
	// model id
	id:'',
	// 描述
	name:'',
	// 是否开启焦点功能,默认开启
	enFocus:true,
	// 切换新图片地址
	focusImage:'',
	// 确定键执行事件方法或URL
	clickHandler:'',
	// 方向左model id
	left:'',
	//方向左其他按钮id
	leftOther:'',
	// 方向右model id
	right:'',
	//方向右其他按钮id
	rightOther:'',
	// 方向上model id
	up:'',
	//方向上其他按钮id
	upOther:'',
	// 方向下model id
	down:'',
	//方向右其他按钮id
	downOther:'',
	// 其他方向
	other:'',
	// 光标宽
	gbWidth:0,
	// 光标高
	gbHeight:0,
	// 切换类型
	focusType:8,
	// 手掌图片
	handImgSrc:'',
	// 手掌div的宽
	handWidth:0,
	// 手掌div的高
	handHeight:0,
	// 焦点上的临时数据
	TempData:null,
	// 方向上执行事件
	upEvent:'',
	// 方向右执行事件
	rightEvent:'',
	// 方向下执行事件
	downEvent:'',
	// 方向左执行事件
	leftEvent:'',
	// 移动到焦点上时，执行的事件
	otherFocusEvent:'',
	// 失去焦点时，执行的事件
	otherBlurEvent:'',
	// 移动边框的指定速度
	tweenSpeed:10,
	// focusType为10的时候需要指定的选中框的id
	selectBorderId:''
};

var PAGE = {
    userid:"",
    gold:"",
    // 金币
    pagenum:1,
    // 当前页码
    path:"http://218.2.101.90:8000/sdmeps/",
    // 服务器ip与端口,http://192.168.1.1:8088/sdmeps/
    pagesize:"",
    // 每页显示数量
    totalnum:"",
    // 总数量
    totalpage:"",
    // 总页数
    appName:CT.getBrowser(),
    // 内核名称
    backurl:"",
    // 返回地址
    handid:"hand",
	// 切换样式
	focusType:3,
    // 手掌id
    handimgid:"handimg",
	// 手掌宽
	handimgwidth:'',
	// 手掌高
	handimgheight:'',
    // 手掌图片id
    handimgsrc1:"",
    // 手掌图片路径1
    handimgsrc2:"",
    // 手掌图片路径1
    focusArr:null,
	// 焦点div集合
	gbInterval:null,
	// 光标方向标记
	gdDire:'down',
	debug:true,
	displayDire:false,
	// 移动边框的最小宽度
	tweenTableMinWidth:67,
	// 移动边框的最小高度
	tweenTableMinHeight:69,
	intervalArr:new Array(),
};
var BOX = {
    OK:"",
    // 确定键
    UP:"",
    // 上
    DOWN:"",
    // 下
    LEFT:"",
    // 左
    RIGHT:"",
    // 右
    PAGEUP:"",
    // 上一页
    PAGEDOWN:"",
    // 下一页
    BACK:"",
    // 返回
    ZERO:"",
    // 0
    ONE:"",
    // 1
    TWO:"",
    // 2
    THREE:"",
    // 3
    FOUR:"",
    // 4
    FIVE:"",
    // 5
    SIX:"",
    // 6
    SEVEN:"",
    // 7
    EIGHT:"",
    // 8
    NINE:""
};


var HW = {OK:13,ZERO:48,ONE:49,TWO:50,THREE:51,FOUR:52,FIVE:53,SIX:54,SEVEN:55,EIGHT:56,NINE:57,PAGEUP:33,PAGEDOWN:34,BACK:8,LEFT:37,UP:38,RIGHT:39,DOWN:40,DEL:1131};
var NJGD = {
	BACK_PAGE:640,// 南京广电返回按键
	HOME_PAGE:113,
	OUT_PAGE:114
};

var ZTE = {
    OK:13,
    ZERO:48,
    ONE:49,
    TWO:50,
    THREE:51,
    FOUR:52,
    FIVE:53,
    SIX:54,
    SEVEN:55,
    EIGHT:56,
    NINE:57,
    PAGEUP:301,
    PAGEDOWN:302,
    BACK:126,
    LEFT:271,
    UP:269,
    RIGHT:272,
    DOWN:270,
    VolumeQuiet:261,
    VolumeUp:259,
    VolumeDown:260
};

var YX = {
    OK:273,
    ZERO:48,
    ONE:49,
    TWO:50,
    THREE:51,
    FOUR:52,
    FIVE:53,
    SIX:54,
    SEVEN:55,
    EIGHT:56,
    NINE:57,
    PAGEUP:120,
    PAGEDOWN:121,
    BACK:122,
    LEFT:29,
    UP:28,
    RIGHT:30,
    DOWN:31,
    F4:99,
    EXIT:114
};

var DaHua = {
    OK:273,
    ZERO:48,
    ONE:49,
    TWO:50,
    THREE:51,
    FOUR:52,
    FIVE:53,
    SIX:54,
    SEVEN:55,
    EIGHT:56,
    NINE:57,
    PAGEUP:372,
    PAGEDOWN:373,
    BACK:340,
    LEFT:3,
    UP:1,
    RIGHT:4,
    DOWN:2,
    EXIT:339
};
// 九州
var JiuZhou = {
		OK:13,
		ZERO:48,
		ONE:49,
		TWO:50,
		THREE:51,
		FOUR:52,
		FIVE:53,
		SIX:54,
		SEVEN:55,
		EIGHT:56,
		NINE:57,
		BACK:283,
		BACKMAIN:513,
		LEFT:37,
		UP:38,
		RIGHT:39,
		DOWN:40	
	};
// 长虹
var ChangHong = {
		OK:13,
		ZERO:48,
		ONE:49,
		TWO:50,
		THREE:51,
		FOUR:52,
		FIVE:53,
		SIX:54,
		SEVEN:55,
		EIGHT:56,
		NINE:57,
		BACK:27,
		LEFT:37,
		UP:38,
		RIGHT:39,
		DOWN:40,
		PAGEUP:33,
	    PAGEDOWN:34
};
var GzAndroid = {
		OK:13,
		ZERO:48,
		ONE:49,
		TWO:50,
		THREE:51,
		FOUR:52,
		FIVE:53,
		SIX:54,
		SEVEN:55,
		EIGHT:56,
		NINE:57,
		BACK:8,
		RETURN:640,
		LEFT:37,
		UP:38,
		RIGHT:39,
		DOWN:40,
		PAGEUP:33,
	    PAGEDOWN:34
};
var GZGD = {
		BACK:640,//南京广电返回按键
		RETURN:113,
		BACKMAIN:114
};
var XMBC = {
		 BACK:340,
		 RETURN_1:270,
		 RETURN_2:283,
		 RETURN_3:8,
		 BACKMAIN:513
};



function changeNum(num){}
document.onkeydown = keyDownEvent1;
function keyDownEvent1(evt)
{
	var keyCode1 = CT.keyCode(evt);
	var keyName = getKeyCodeName(keyCode1);
	 switch (keyName) {
      case "ZERO":
			changeNum("0");
			break;
		case "ONE":
			changeNum("1");
			break;
		case "TWO":
			changeNum("2");
			break;
		case "THREE":
			changeNum("3");
			break;
		case "FOUR":
			changeNum("4");
			break;
		case "FIVE":
			changeNum("5");
			break;
		case "SIX":
			changeNum("6");
			break;
		case "SEVEN":
			changeNum("7");
			break;
		case "EIGHT":
			changeNum("8");
			break;
		case "NINE":
			changeNum("9");
    	  	break;
      case "UP" :
      case "DOWN" :
      case "LEFT" :
      case "RIGHT" :
        focusHand(keyName);
        break;
      case "OK" :
        curFocus.OK();
        break;
	  case "BACK" :
		  	backfunc();
			break;
	  case "HOME_PAGE" :
		  backfunc();
		  break;
	  case "BACKMAIN":
		  backfunc();
		  break;
	  case "RETURN":
		  backfunc();
		  break;
	  case "BACK_PAGE" :
		  	backfunc();
			break;
	  case "OUT_PAGE" :
		  	backfunc();
			break;
	  case "RETURN_1" :
		  	backfunc();
			break;
	  case "RETURN_2" :
		  	backfunc();
			break;
	  case "RETURN_3" :
	  	backfunc();
		break;
      default :
		break;
    }
}

function getKeyCodeName(keyCode){
	for(var item in NJGD){
		if (NJGD[item] == keyCode) {
            return item;
        }
	}
    for (var item in HW) {
        if (HW[item] == keyCode) {
            return item;
        }
    }
	for (var item in JiuZhou ) {
        if (JiuZhou[item] == keyCode) {
            return item;
        }
    }
	for (var item in ChangHong ) {
        if (ChangHong[item] == keyCode) {
            return item;
        }
    }
    for (var item in ZTE) {
        if (ZTE[item] == keyCode) {
            return item;
        }
    }
    for (var item in YX) {
        if (YX[item] == keyCode) {
            return item;
        }
    }
    for (var item in DaHua) {
        if (DaHua[item] == keyCode) {
            return item;
        }
    }
    for (var item in GzAndroid) {
        if (GzAndroid[item] == keyCode) {
            return item;
        }
    }
    for (var item in GZGD) {
        if (GZGD[item] == keyCode) {
            return item;
        }
    }
    for (var item in XMBC) {
        if (XMBC[item] == keyCode) {
            return item;
        }
    }
}

function focusHand(direType) {
	 if(PAGE.displayDire == false )
	 {
		switch (direType) {
		  case "UP" :
				upFocusObj() ;
				break;
		  case "DOWN" :
				downFocusObj() ;
				break;
		  case "LEFT" :
				leftFocusObj() ;
				break;
		  case "RIGHT" :
				rightFocusObj() ;
				break;
		  default :
				 break;
		}
	 }
}
//坐标
function FunCoo(_x, _y) {
    this.x = _x;
    this.y = _y;
}
function distanceCAL(_coo1, _coo2) {
    //获取第一点的X坐标
    var x1 = _coo1.x;
    //获取第一点的Y坐标
    var y1 = _coo1.y;
    //获取第二点的X坐标
    var x2 = _coo2.x;
    //获取第二点的Y坐标
    var y2 = _coo2.y;
    var calX = x2 - x1;
    var calY = y2 - y1;
    return Math.round(Math.pow(calX * calX + calY * calY, 0.5));
}
// 按键向右，找出距离当前焦点最近的焦点
function rightFocusObj() {
	var bl = true;
	for(var it in focusDires)
	{
		if(curFocus.FocusID==it)
		{
			// 获得当前焦点，是否有指定移动的焦点
			var d = focusDires[it];
			// 由于当前方法是用来往右移动的，只需判断是否有右方的focusId
			// 当前焦点，往某方向按键时具有优先执行，如果指定了方向事件，就不会切换当前焦点，而去执行事件
			 if(!CT.isnull(d.rightEvent))
			 {
				 exeCode(d.rightEvent);
				 bl=false;
				return;
			 }else if(!CT.isnull(d.right))
			 {
				// 如果往下移动被赋值了disable说明啥都不操作
				if(d.right == "disable")
				{
					bl=false;
					return;
				}
				// 通过focusID找到焦点对象
				var nextNode =getModelByFocusId(d.right);
				if(nextNode.enFocus == true)
				{
					//
					// 切换新焦点之前，需要执行失去焦点事件
					curFocus.defaultBlur();
					var fid = curFocus.FocusID;
					// 给当前焦点重新赋值
					curFocus = nextNode;
					curFocus.lastFocusId = fid;
					curFocus.defaultFocus();
					bl=false;
					return;
					//如果原本设置的按钮被禁用了，倘若设置了downOther值，就让此按钮获得焦点
				}else if(nextNode.enFocus==false && !CT.isnull(d.rightOther))
					{
						// 通过focusID找到焦点对象
						var otherNode =getModelByFocusId(d.rightOther);
						if(otherNode.enFocus==true)
						{
							// 切换新焦点之前，需要执行失去焦点事件
							curFocus.defaultBlur();
							var fid = curFocus.FocusID;
							// 给当前焦点重新赋值
							curFocus = otherNode;
							curFocus.lastFocusId = fid;
							curFocus.defaultFocus();
							bl=false;
							return;
						}
					}
			}else if(!CT.isnull(d.other))
			{
				if(d.other =="disable")
				{
					bl=false;
					return;
				}
				// 通过focusID找到焦点对象
				var nextNode =getModelByFocusId(d.other);
				if(nextNode.enFocus==true)
				{
					// 切换新焦点之前，需要执行失去焦点事件
					curFocus.defaultBlur();
					var fid = curFocus.FocusID;
					// 给当前焦点重新赋值
					curFocus = nextNode;
					curFocus.lastFocusId = fid;
					curFocus.defaultFocus();
					bl=false;
					return;
				}
			}
		}
	}
	if(bl)
	{
		var curNode = null;
		// ********************获取当前焦点的坐标***********************/
		for (var i = 0; i < PAGE.focusArr.length; i++) {
			if (curFocus.FocusID == PAGE.focusArr[i].id) {
				curNode = PAGE.focusArr[i];
				break;
			}
		}
		var x = parseInt(curNode.style.left);
		var y = parseInt(curNode.style.top);
		// 判断是否有父节点
		var curPar = curFocus.ParentNode;
		if(!CT.isnull(curPar))
		{
				x = x +  parseInt(curPar.style.left);
				y = y +  parseInt(curPar.style.top);
		}
		var curCoo = new FunCoo(x, y);
		/** ****************************************************** */
		var upNodeArr = new Array();
		// 向右，即只要是left值比当前焦点left值大的，都是在左方
		// 找出在当前焦点左方的所有焦点
		for (var i = 0; i < PAGE.focusArr.length; i++) {
			var j = PAGE.focusArr[i];
			// 判断是否有父节点
			var top  =  parseInt(j.style.top);
			var left =  parseInt(j.style.left);
			var npar = j.focusmodel.ParentNode;
			if(!CT.isnull(npar))
			{
					left = left +  parseInt(npar.style.left);
					top = top +  parseInt(npar.style.top);
			}
			// 忽略已经被禁用的焦点
        	if(j.focusmodel.enFocus==true && left > x) {
				upNodeArr.push(j);
			}
		}
		var nextNode = null;
		//var maxNextNode = null;
		var bl = true;
		// 距离当前焦点最小的距离
		var minjl = 0;
		// 距离当前焦点最大的距离
		var maxjl = 0;
		// 如果存在右方的焦点,就计算上方的所有焦点中，距离当前焦点最近的
		if (upNodeArr.length > 0) {
			for (var i = 0; i < upNodeArr.length; i++) {
				// 生成坐标
				var nextCoo = new FunCoo(parseInt(upNodeArr[i].style.left), parseInt(upNodeArr[i].style.top));
				// 计算距离
				var jl = distanceCAL(curCoo, nextCoo);
				// 这么做是首次赋值
				if (bl) {
					minjl = jl;
					maxjl = jl;
					nextNode = upNodeArr[i];
					maxNextNode = upNodeArr[i];
					bl = false;
				}
				// 比较出最小的距离
				if (jl < minjl) {
					nextNode = upNodeArr[i];
					minjl = jl;
				}
				// 比较出最大的距离
				if (jl > maxjl) {
					maxNextNode = upNodeArr[i];
					maxjl = jl;
				}
			}
			// 切换新焦点之前，需要执行失去焦点事件
			curFocus.defaultBlur();
			var fid = curFocus.FocusID;
			// 给当前焦点重新赋值
			curFocus = nextNode.focusmodel;
			curFocus.lastFocusId = fid;
			curFocus.defaultFocus();
		}
	}
}
// 自动寻找焦点
function focusInit() {
	
    var divs = document.getElementsByTagName("div");
    PAGE.focusArr = new Array();
    for (var i = 0; i < divs.length; i++) {
        var cur = divs[i];
        if (cur.id) {
            if (cur.id.indexOf("hands") > -1) {
                var model = new FocusModel();
                model.FocusID = cur.id + "";
                var coo = getCoo(cur.id);
				// 焦点div的手掌坐标
                model.X_Posi = coo.x;
                model.Y_Posi = coo.y;
				if(!CT.isnull(coo.parentNode) && !CT.isnull(CT.$(coo.parentNode)))
				{
					model.ParentNode=CT.$(coo.parentNode);
				}
				// 焦点图片的ID
				model.ImgID = coo.imgsrc;
               
               // 焦点图片原先图片地址
				if(!CT.isnull(CT.$(model.ImgID)))
				{
					model.oldSwap = CT.$(model.ImgID).src;
					
				}
				// 默认焦点的手掌图片地址
				if(!CT.isnull(PAGE.handimgsrc1))
				{
					model.handImgSrc = PAGE.handimgsrc1;
				}
				// ***************************加载用户手动初始化的值*********************/
				var b = null;
				for(var bt in buttons)
				{
					if(!CT.isnull(buttons[bt]))
					{
						var bb = buttons[bt];
						if(bb.id == cur.id)
						{
							b = bb;
							break;
						}
					}
				}
				if(!CT.isnull(b))
				{
					if(!CT.isnull(b.id))
					{
						 if((b.enFocus+'') == 'true' || (b.enFocus+'') == 'false')
						 {
							 model.enFocus = b.enFocus;
						 }
						// 执行事件
						 if(!CT.isnull(b.clickHandler))
						{
							model.EventUrl = b.clickHandler;
						}
						// 按钮，用于切换新图片的地址
						 if(!CT.isnull(b.focusImage))
						{
							model.ImgSwap = b.focusImage;
						}
						// 如果是光标，需要有光标的宽高
						if( b.gbHeight > 0 && b.gbWidth > 0 && isNaN(b.gbWidth) == false && isNaN(b.gbHeight) == false)
						{
							model.gbHeight = b.gbHeight;
							model.gbWidth = b.gbWidth;
						}
						// 手动指定手掌图片地址
						if(!CT.isnull(b.handImgSrc))
						{
							model.handImgSrc = b.handImgSrc;
						}
						// 指定手掌div宽度
						if(!CT.isnull(b.handWidth)  && isNaN(b.handWidth) == false)
						{
							model.handWidth = b.handWidth;
						}
						// 指定手掌div高度
						if(!CT.isnull(b.handHeight) && isNaN(b.handHeight) == false)
						{
							model.handHeight = b.handHeight;
						}
						// 存储的临时数据
						if(!CT.isnull(b.TempData))
						{
							model.TempData = b.TempData;
						}
						// 切换类型
						if(!CT.isnull(b.focusType) && isNaN(b.focusType) == false)
						{
							model.FocusType= b.focusType;
						}
						
						
						// ****************************方向初始化**********************/
						var diredemp = new Dire();
						if(!CT.isnull(b.other))
						{
						 diredemp.other = b.other;
						}
						if(!CT.isnull(b.left))
						{
						 diredemp.left = b.left;
						}
						if(!CT.isnull(b.right))
						{
						 diredemp.right = b.right;
						}
						if(!CT.isnull(b.up))
						{
						 diredemp.up = b.up;
						}
						if(!CT.isnull(b.down))
						{
						 diredemp.down = b.down;
						}
						if(!CT.isnull(b.upEvent))
						{
						 diredemp.upEvent = b.upEvent;
						}
						if(!CT.isnull(b.downEvent))
						{
						 diredemp.downEvent = b.downEvent;
						}
						if(!CT.isnull(b.leftEvent))
						{
						 diredemp.leftEvent = b.leftEvent;
						}
						if(!CT.isnull(b.rightEvent))
						{
						 diredemp.rightEvent = b.rightEvent;
						}
						if(!CT.isnull(b.upOther))
						{
						 diredemp.upOther = b.upOther;
						}
						if(!CT.isnull(b.downOther))
						{
						 diredemp.downOther = b.downOther;
						}
						if(!CT.isnull(b.leftOther))
						{
						 diredemp.leftOther = b.leftOther;
						}
						if(!CT.isnull(b.rightOther))
						{
						 diredemp.rightOther = b.rightOther;
						}
						// 判断是否添加了方向控制
						if(!CT.isnull(diredemp.down) || !CT.isnull(diredemp.up) || !CT.isnull(diredemp.right) || !CT.isnull(diredemp.left) || !CT.isnull(diredemp.other) || !CT.isnull(diredemp.upEvent)  || !CT.isnull(diredemp.downEvent)  || !CT.isnull(diredemp.leftEvent) || !CT.isnull(diredemp.rightEvent) || !CT.isnull(diredemp.upOther) || !CT.isnull(diredemp.downOther) || !CT.isnull(diredemp.leftOther) || !CT.isnull(diredemp.rightOther))
						{
						  focusDires[b.id+""] = diredemp;
						}
						// 名称
						if(!CT.isnull(b.name))
						{
						model.name = b.name;
						} 
						
						// 指定移动到焦点上时，执行的事件
						if(!CT.isnull(b.otherFocusEvent))
						{
						model.otherFocusEvent = b.otherFocusEvent;
						}
						
						// 指定失去焦点时，执行的事件
						if(!CT.isnull(b.otherBlurEvent))
						{
						model.otherBlurEvent = b.otherBlurEvent;
						}
						
						// 指定移动边框的速度
						if(!CT.isnull(b.tweenSpeed))
						{
							model.tweenSpeed = b.tweenSpeed;
						}
						
						// focusType为10的时候需要的选中框id
						if(!CT.isnull(b.selectBorderId))
						{
							model.selectBorderId = b.selectBorderId;
						}
					}
				}
				 model.nodeObj = cur;
                cur.focusmodel = model;
                PAGE.focusArr.push(cur);
            }
        }
    }
    // 初始化第一个焦点
    if(!CT.isnull(PAGE.focusArr) && PAGE.focusArr.length >= 1 && !CT.isnull(PAGE.focusArr[0].focusmodel))
    	{
    		curFocus=PAGE.focusArr[0].focusmodel;
    	}
   
	var version = CT.version();
//	if(version.toUpperCase()=='B700V2A'.toUpperCase() || version.toUpperCase() == 'B600V4A'.toUpperCase()){
//		PAGE.handimgsrc1=PAGE.handimgsrc2;
//	}
//	 curHand = new HandModel(PAGE.handid, 0, 0);
}

// 为DIV节点赋值的FocusModel对象
function getDivNodeByFocusId(_focusId) {
    if (CT.isnull(_focusId)) return null;
    for (var i = 0; i < PAGE.focusArr.length; i++) {
        if (PAGE.focusArr[i].id == _focusId) {
            return PAGE.focusArr[i];
        }
    }
}

// 根据focusID获取对应node
function getModelByFocusId(_focuId) {
    if (CT.isnull(_focuId) || CT.isnull(PAGE.focusArr)) return null;
    for (var i = 0; i < PAGE.focusArr.length; i++) {
        if (PAGE.focusArr[i].id == _focuId) {
            return PAGE.focusArr[i].focusmodel;
        }
    }
    return null;
}
function getFocusModel6(_focuId) {
	if (CT.isnull(_focuId)) return null;
    var modelObj = getModelByFocusId(_focuId);
    return modelObj;
}
var buttons=[];


// 当前焦点对象
var curFocus = new FocusModel();

// 当前手掌
//var curHand = null;

function FocusModel() {
	// 焦点描述名称
	this.name='';
    // 是否开启按ok键
    this.enable = true;
    // 是否允许此焦点对象获得焦点
    this.enFocus = true;
    // 焦点编号，判断是否同一个焦点,非空
    this.FocusID = "";
    // 将自己的对象赋给此属性
    this.own = this;
	// 父节点，用来得到距离页面最边缘的距离
	this.ParentNode=null;
    // 手势坐标
    this.X_Posi = 0;
    this.Y_Posi = 0;
    // 手势使用，显示手势坐标
    // 按确定的跳转地址
    this.EventUrl = "";
	// 光标宽
	this.gbWidth = 0;
	// 光标高
	this.gbHeight = 0;
    // 1手势，
	// 2图片切换,
	// 3,手势与图片切换 ,
	// 4,图片轮播切换并且手掌移动，
	// 5,图片轮播切换，
	// 0不需要变化;
	// 6:利用发光外圈，不停闪烁,
	// 7：利用发光外圈，获取焦点，显示发光外圈，不会闪烁
    this.FocusType = 2;
	// 如果手掌在当前焦点处，切换类型为：1,3,4,如果默认可以不用指定handImgSrc值
	// 如果特殊情况，手掌图片不同，需要指定此数值
	this.handImgSrc='';
	// 如果在切换手掌图片的时候，图片宽高有所不同，就需要进行指定
	// 不需要加”px"，做单位，默认整数值
	this.handWidth='';
	this.handHeight='';
    // 图片切换使用，新图片地址
    this.ImgSwap = "";
    // 原始图片
    this.oldSwap = "";
    this.ImgID = "";
	// 当前焦点上下左右，四个方向应该走的focusId数组
	this.dieArr = null;
    // 对应的DOM对象
    this.nodeObj = null;
    // 接下来焦点获得焦点之前，处理前一个焦点的某些事件
    this.init = function() {

        this.own = getModelByFocusId(this.FocusID);
        if (this.ImgID) {
          // this.oldSwap = CT.$(this.ImgID).src;
			if(!CT.isnull(curFocus.interval))
			{
					clearInterval(curFocus.interval);
					curFocus.interval=null;
			}
			
        }
    };
    // 临时数据储存
    this.TempData = null;
	// 在默认获得焦点事件上添加其他执行事件
	this.otherFocusEvent = "";
	// 在默认失去焦点事件上添加额外的执行事件
	this.otherBlurEvent = "";
    // 默认获得焦点事件
    this.defaultFocus = function() {
        if (this.enFocus) {
            this.init();
            // 获得焦点之前，先让之前的焦点是失去焦点
            curFocus.defaultBlur();
            curFocus = this.own;
            if (this.FocusType == 1) {
				if(!CT.isnull(CT.$("gb")))
				 {
					 if(PAGE.gbInterval != null)
					 {
						 clearInterval(PAGE.gbInterval);
						 PAGE.gbInterval=null;
					 }
					CT.$("gb").style.display = "none";
					CT.$("gb").style.visibility = "hidden";
				 }
                // 移动手掌
                moveHand(this.X_Posi, this.Y_Posi); 
            } else if (this.FocusType == 2) {
				if(!CT.isnull(CT.$("gb")))
				 {
					  if(PAGE.gbInterval != null)
					 {
						 clearInterval(PAGE.gbInterval);
						 PAGE.gbInterval=null;
					 }
					CT.$("gb").style.display = "none";
					CT.$("gb").style.visibility = "hidden";
				 }
                	// 因为只需要切换图片，所以需要隐藏当前手掌
    				//curHand.handObj.style.display="none";
                    // 改变焦点对应图片
                    CT.changeImg(this.ImgID, this.ImgSwap);
            } else if (this.FocusType == 3) {
				if(!CT.isnull(CT.$("gb")))
				 {
					  if(PAGE.gbInterval != null)
					 {
						 clearInterval(PAGE.gbInterval);
						 PAGE.gbInterval=null;
					 }
					CT.$("gb").style.display = "none";
					CT.$("gb").style.visibility = "hidden";
				 }
                // 移动手掌
                moveHand(this.X_Posi, this.Y_Posi);
                // 改变焦点对应图片
                CT.changeImg(this.ImgID, this.ImgSwap);
            }else if (this.FocusType == 4) {
				if(!CT.isnull(CT.$("gb")))
				 {
					  if(PAGE.gbInterval != null)
					 {
						 clearInterval(PAGE.gbInterval);
						 PAGE.gbInterval=null;
					 }
					CT.$("gb").style.display = "none";
					CT.$("gb").style.visibility = "hidden";
				 }
                // 移动手掌
                moveHand(this.X_Posi, this.Y_Posi);
                // 改变焦点对应图片
               shangshuo();
            }else if (this.FocusType == 5) {
				if(!CT.isnull(CT.$("gb")))
				 {
					  if(PAGE.gbInterval != null)
					 {
						 clearInterval(PAGE.gbInterval);
						 PAGE.gbInterval=null;
					 }
					CT.$("gb").style.display = "none";
					CT.$("gb").style.visibility = "hidden";
				 }
            	// 因为只需要切换图片，所以需要隐藏当前手掌
				//curHand.handObj.style.display="none";
                // 改变焦点对应图片
               shangshuo();
            }else if (this.FocusType == 6) {
				if(!CT.isnull(CT.$("gb")))
				 {
					  if(PAGE.gbInterval != null)
					 {
						 clearInterval(PAGE.gbInterval);
						 PAGE.gbInterval=null;
					 }
					CT.$("gb").style.display = "none";
					CT.$("gb").style.visibility = "hidden";
				 }
            	// 隐藏图片来切换效果
				//curHand.handObj.style.display="none";
                // 改变焦点对应图片
               shangshuo2();
            }else if (this.FocusType == 7) {
				if(!CT.isnull(CT.$("gb")))
				 {
					  if(PAGE.gbInterval != null)
					 {
						 clearInterval(PAGE.gbInterval);
						 PAGE.gbInterval=null;
					 }
					CT.$("gb").style.display = "none";
					CT.$("gb").style.visibility = "hidden";
				 }
            	// 隐藏图片来切换效果
				/*if(curHand.handObj.style.display != "none")
				{
					curHand.handObj.style.display="none";
				}*/
                // 改变焦点对应图片
				  if(!CT.isnull(curFocus.ImgID))
					{
							CT.$(curFocus.ImgID).style.visibility="visible";
					}
            }else if (this.FocusType == 8) {
				// 利用光标来切换
            	// 隐藏手掌
				//curHand.handObj.style.display="none";
				// 显示光标
				CT.$("gb").style.display = "block";
				CT.$("gb").style.visibility = "visible";
                // 开启光标内部四个角闪动效果
			    if(!CT.isnull(curFocus.ImgID))
				{
					if(PAGE.gbInterval == null)
					{
						gbshangshuo();
					}
				}
				gbMove();
				
            }else if (this.FocusType == 9) {
				if(!CT.isnull(CT.$("gb")))
				 {
					  if(PAGE.gbInterval != null)
					 {
						 clearInterval(PAGE.gbInterval);
						 PAGE.gbInterval=null;
					 }
					CT.$("gb").style.display = "none";
					CT.$("gb").style.visibility = "hidden";
				 }
			    if(this.tweenMoveInterval !=null)
		    	{
			    	clearInterval(this.tweenMoveInterval);
			    	this.tweenMoveInterval = null;
			    	PAGE.displayDire = false;
		    	}
				 tweenMove();
             }else if (this.FocusType == 10) {
				if(!CT.isnull(CT.$("gb")))
				 {
					  if(PAGE.gbInterval != null)
					 {
						 clearInterval(PAGE.gbInterval);
						 PAGE.gbInterval=null;
					 }
					CT.$("gb").style.display = "none";
					CT.$("gb").style.visibility = "hidden";
				 }
			    if(this.tweenMoveInterval !=null)
		    	{
			    	clearInterval(this.tweenMoveInterval);
			    	this.tweenMoveInterval = null;
			    	PAGE.displayDire = false;
		    	}
				 tweenMove();
            }
			
			if(!CT.isnull(this.otherFocusEvent))
			{
					 exeCode(this.otherFocusEvent);
			}
			
        }
    };
	
    // 默认失去焦点事件
    this.defaultBlur = function() {
        if (this.enFocus) {
            if (this.FocusType == 2 || this.FocusType == 3 || this.FocusType == 4 || this.FocusType == 5 || this.FocusType == 6 || this.FocusType == 7|| this.FocusType == 8 || this.FocusType == 9 || this.FocusType == 10 ) {
                	if(this.FocusType == 4 || this.FocusType == 5 || this.FocusType == 6)
                	{
                		if(!CT.isnull(curFocus.interval))
            			{
                			clearInterval(curFocus.interval);
        					curFocus.interval=null;
            			}
						// 隐藏发光圈圈
						if(this.FocusType == 6)
						{
							CT.$(curFocus.ImgID).style.visibility="hidden";
						}
    	            	
                	}
					// 隐藏发光圈圈
					if(this.FocusType == 7)
					{
						CT.$(curFocus.ImgID).style.visibility="hidden";
					}
					// 只有一下几种获取焦点类型，不需要切换为原始图片
					if(this.FocusType != 8 && this.FocusType != 7 && this.FocusType != 9)
					{
						if(!CT.isnull(this.ImgID) && !CT.isnull(this.oldSwap))
						{
							// 改变焦点对应图片
							CT.changeImg(this.ImgID, this.oldSwap);
						}
					}
					if(this.FocusType == 9)
					{
						if(!CT.isnull(CT.$("tweenTable")) && !CT.isnull(CT.$("tweenTableWidth")) && !CT.isnull(CT.$("tweenTableHeight")) )
							{
								var tweenTableObj = CT.$("tweenTable").style;
								tweenTableObj.visibility = "hidden";
								
							}else
							{
								console.log("主人发现错误，移动边框未找到！！");
								return;
							}
					}
					
					if(this.FocusType == 10)
					{
						if(CT.isnull(curFocus.selectBorderId))
						{
							console.log("发生错误，focuType等于10的时候，需要指定selectBorderId选中框的id!");
							return;
						}
						var curSelectObj = CT.$(curFocus.selectBorderId);
						if(CT.isnull(curSelectObj))
						{
							console.log("发生错误，未找到【"+curFocus.selectBorderId+"】选中框对象！");	
							return;
						}
						curSelectObj.style.visibility = "hidden";
					}
                		
            }
			if(!CT.isnull(this.otherBlurEvent))
			{
				exeCode(this.otherBlurEvent);
			}
        }
    };
    // 按键确认事件
    this.OK = function() {
    	if (this.enable == true &&  this.enFocus == true) {
            exeCode(this.EventUrl);
        }
    };
	this.interval=null;
	this.tweenMoveInterval = null;
	this.tweenNums = 0;
	// 默认执行速度
	this.tweenSpeed = 20;
	
	this.tweenTableWidth  = null;
	this.tweenTableWidthOk = false;
	
	this.tweenTableHeight = null;
	this.tweenTableHeightOk = false;
	
	this.tweenTableWWidth  = null;
	this.tweenTableWWidthOk = false;
	
	this.tweenTableHHeight = null;
	this.tweenTableHHeightOk = false;
	
	this.tweenTableTop = null;
	this.tweenTableTopOk = false;
	
	this.tweenTableLeft = null;
	this.tweenTableLeftOk = false;
	
	this.tweenTop = null;
	this.tweenTopOk = false;
	
	this.tweenLeft = null;
	this.tweenLeftOk = false;
	
	this.lastFocusId = '';
	this.selectBorderId = '';
}

// 按规律得到的id值，获取id中写的坐标值
function getCoo(_id) {
    if (CT.isnull(_id)) return null;
    var d1 = _id;
    var x1 = d1.indexOf("_", 0);
    var x2 = d1.indexOf("_", x1 + 1);
    var x3 = d1.indexOf("_", x2 + 1);
	var x4 = d1.indexOf("_", x3 + 1);
	var x5 = d1.indexOf("_", x4 + 1);
	
    var x = d1.substring(x1 + 2, x2);
    var y = d1.substring(x2 + 2, x3);
	var imgsrc ="";
	if(x4!=-1)
	{
		 imgsrc = d1.substring(x3 + 1, x4);
	}
	var par="";
	if(x5!=-1)
	{
		par = d1.substring(x4 + 1, x5);
	}
    return new idList(x, y,imgsrc,par);
}

function idList(_x,_y,_imgsrc,_parentNode)
{
this.x=_x;
this.y=_y;
this.imgsrc=_imgsrc;	
this.parentNode=_parentNode;
}

// 方向指定focusid与某一方向执行事件
function Dire()
{
	this.up='';
	this.upOther='';
	this.right='';
	this.rightOther='';
	this.down='';
	this.downOther='';
	this.left='';	
	this.leftOther='';
	this.other = '';
	// 某方向执行事件，字符串
	this.upEvent = '';
	this.rightEvent = '';
	this.downEvent = '';
	this.leftEvent = '';
}


function HandModel(_id, _x, _y, _u) {
	// 包裹手掌外的div node对象
    this.handObj = CT.$(_id);
    // 初始化位置
    this.x = _x;
    this.y = _y;
    // 移动速度
    // true为开启焦点为最远距离时，是否从相反方向最远的焦点开始
    this.enMaxMove = false;
    // 手掌IMG node对象
	this.handImg=CT.$(PAGE.handimgid);
	PAGE.handimgheight = parseInt(this.handObj.style.height);
	PAGE.handimgwidth = parseInt(this.handObj.style.width);
	this.handImg.src=PAGE.handimgsrc1;
}

function tweenMove()
{
	
	// 备注
	// focusType9 与 10 之间的切换效果
	// 10 与 10 之间的切换效果
		if(!CT.isnull(curFocus))
		{

			var styleObj = CT.$(curFocus.FocusID).style;	
			// 当前焦点的Left值
			var curLeft = parseInt(styleObj.left);
			// 当前焦点的Top值
			var curTop = parseInt(styleObj.top);
			// 当前焦点的width值
			var curWidth = parseInt(styleObj.width);
			// 当前焦点的Height值
			var curHeight = parseInt(styleObj.height);
						if(curFocus.FocusType == 9){
							if(!CT.isnull(curFocus.lastFocusId))
							{
								if(curWidth < PAGE.tweenTableMinWidth || curHeight < PAGE.tweenTableMinHeight)
								{
									console.log("发现错误，foceType为9时宽高必须要大于等于67*69");
								}
								// 获取当前焦点，上一个焦点的焦点类型
								var lastNode =getModelByFocusId(curFocus.lastFocusId);
								var lastFocusTypeId = parseInt(lastNode.FocusType);
								// 当上一个焦点的类型和当前的焦点类型不统一，不做缓冲效果
								if(lastFocusTypeId !=9 && lastFocusTypeId !=10)
								{
									// 如果没有上一个焦点，就自动显示移动边框
									if(!CT.isnull(CT.$("tweenTable")) && !CT.isnull(CT.$("tweenTableWidth")) && !CT.isnull(CT.$("tweenTableHeight")) )
									{
										var tweenTableObj = CT.$("tweenTable").style;
										tweenTableObj.visibility = "visible";
										tweenTableObj.width = curWidth +"px";
										tweenTableObj.height = curHeight +"px";
										tweenTableObj.top = curTop + "px";
										tweenTableObj.left = curLeft + "px";
										var tweenTableWidthObj = CT.$("tweenTableWidth").style;
										tweenTableWidthObj.width = (curWidth - PAGE.tweenTableMinWidth) +"px";
										var tweenTableHeightObj = CT.$("tweenTableHeight").style;
										tweenTableHeightObj.height = (curHeight -PAGE.tweenTableMinHeight) + "px";
									}else
									{
										console.log("主人发现错误，移动边框未找到！！");
										return;
									}
								
									// //////////////////////////
								}else if(lastFocusTypeId == 9)
								{
									
									// 讲移动边框显示
									var tweenTableObjs = CT.$("tweenTable").style;
									tweenTableObjs.visibility = "visible";
									// 获得上一个焦点的DOM对象
									var lastNodeObj = CT.$(lastNode.FocusID).style;
									// 上一个焦点的Top值
									var lastNodeTop = parseInt(lastNodeObj.top);
									// 上一个焦点的Left值
									var lastNodeLeft = parseInt(lastNodeObj.left);
									// 上一个焦点的宽度
									var lastNodeWidth = parseInt(lastNodeObj.width);
									// 上一个焦点的高度
									var lastNodeHeight = parseInt(lastNodeObj.height) ;
									
									// 上一个焦点内部TD的宽度
									var lastNodeWWidth = lastNodeWidth - PAGE.tweenTableMinWidth;
									var lastNodeHHeight = lastNodeHeight -PAGE.tweenTableMinHeight;
									
									// 移动边框Top值需要变化的数值
									var topbl = curTop-lastNodeTop;
									// 移动边框Left值需要变化的数值
									var leftbl = curLeft-lastNodeLeft;
									// 移动边框width需要变化的数值
									var widthbl = curWidth - lastNodeWidth;
									// 移动边框height需要变化的数值
									var heightbl = curHeight - lastNodeHeight;
									// 内部TD宽度的变化量即等于外部移动边框的变化量，两者相等
									var widthwbl = widthbl;
									// 同上
									var heighthbl = heightbl;
									
									curFocus.tweenTableTop = new TweenModel(0,lastNodeTop,topbl,curFocus.tweenSpeed);
									curFocus.tweenTableLeft = new TweenModel(0,lastNodeLeft,leftbl,curFocus.tweenSpeed);
									
									curFocus.tweenTableWidth = new TweenModel(0,lastNodeWidth,widthbl,curFocus.tweenSpeed);
									curFocus.tweenTableHeight = new TweenModel(0,lastNodeHeight,heightbl,curFocus.tweenSpeed);
									
									curFocus.tweenTableWWidth = new TweenModel(0,lastNodeWWidth,widthwbl,curFocus.tweenSpeed);
									curFocus.tweenTableHHeight = new TweenModel(0,lastNodeHHeight,heighthbl,curFocus.tweenSpeed);
									curFocus.tweenMoveInterval = setInterval(function(){
										var nu = parseInt(curFocus.tweenMoveInterval);
										if(!isNaN(nu))
												{
												var curFocus_ = PAGE.intervalArr[nu+""];
												if(CT.isnull(curFocus_))
												{
													PAGE.intervalArr[nu+""]=curFocus;
												}
												curFocus_ = PAGE.intervalArr[nu+""];
												// 由于需要时间缓冲，需要禁用用户使用方向键盘
												PAGE.displayDire = true;
												// 移动边框对象
												var tweenTableObj = CT.$("tweenTable").style;
												// 移动边框left值增长量
												tweenTableObj.left =  Math.ceil(Tween(curFocus_.tweenTableLeft.nums,curFocus_.tweenTableLeft.initalValue,curFocus_.tweenTableLeft.finishValue,curFocus_.tweenTableLeft.countValue)) + "px";
												// 移动边框top值增长量
												tweenTableObj.top =  Math.ceil(Tween(curFocus_.tweenTableTop.nums,curFocus_.tweenTableTop.initalValue,curFocus_.tweenTableTop.finishValue,curFocus_.tweenTableTop.countValue)) + "px";
												// 移动边框width值增长量
												tweenTableObj.width = Math.ceil(Tween(curFocus_.tweenTableWidth.nums,curFocus_.tweenTableWidth.initalValue,curFocus_.tweenTableWidth.finishValue,curFocus_.tweenTableWidth.countValue)) + "px";
												// 移动边框height值增长量
												tweenTableObj.height = Math.ceil(Tween(curFocus_.tweenTableHeight.nums,curFocus_.tweenTableHeight.initalValue,curFocus_.tweenTableHeight.finishValue,curFocus_.tweenTableHeight.countValue)) + "px";
												// 内部td的width值增长量
												CT.$("tweenTableWidth").style.width = Math.ceil(Tween(curFocus_.tweenTableWWidth.nums,curFocus_.tweenTableWWidth.initalValue,curFocus_.tweenTableWWidth.finishValue,curFocus_.tweenTableWWidth.countValue)) + "px";
												// 内部td的height值增长量
												CT.$("tweenTableHeight").style.height = Math.ceil(Tween(curFocus_.tweenTableHHeight.nums,curFocus_.tweenTableHHeight.initalValue,curFocus_.tweenTableHHeight.finishValue,curFocus_.tweenTableHHeight.countValue)) + "px";
												//document.getElementById('testDiv2').innerHTML = "---curLeft---" + tweenTableObj.left;
												//document.getElementById('testDiv3').innerHTML = "---curTop---" + tweenTableObj.top;
												//document.getElementById('testDiv4').innerHTML = "---curWidth---" + tweenTableObj.width;
												//document.getElementById('testDiv5').innerHTML = "---curHeight---" + tweenTableObj.height;
												
												if(curFocus_.tweenTableLeft.nums < curFocus_.tweenTableLeft.countValue)
												{
													curFocus_.tweenTableLeft.nums ++;
													curFocus_.tweenTableLeftOk = false;
												}else
												{
													curFocus_.tweenTableLeftOk = true;
												}
												
												if(curFocus_.tweenTableTop.nums < curFocus_.tweenTableTop.countValue)
												{
													curFocus_.tweenTableTop.nums ++;
													curFocus_.tweenTableTopOk = false;
												}else
												{
													curFocus_.tweenTableTopOk = true;
												}
												
												if(curFocus_.tweenTableWidth.nums < curFocus_.tweenTableWidth.countValue)
												{
													curFocus_.tweenTableWidth.nums ++;
													curFocus_.tweenTableWidthOk = false;
												}else
												{
													curFocus_.tweenTableWidthOk = true;
												}
												
												if(curFocus_.tweenTableHeight.nums < curFocus_.tweenTableHeight.countValue)
												{
													curFocus_.tweenTableHeight.nums ++;
													curFocus_.tweenTableHeightOk = false;
												}else
												{
													curFocus_.tweenTableHeightOk = true;
												}
												
												if(curFocus_.tweenTableWWidth.nums < curFocus_.tweenTableWWidth.countValue)
												{
													curFocus_.tweenTableWWidth.nums ++;
													curFocus_.tweenTableWWidthOk = false;
												}else
												{
													curFocus_.tweenTableWWidthOk = true;
												}
												
												if(curFocus_.tweenTableHHeight.nums < curFocus_.tweenTableHHeight.countValue)
												{
													curFocus_.tweenTableHHeight.nums ++;
													curFocus_.tweenTableHHeightOk = false;
												}else
												{
													curFocus_.tweenTableHHeightOk = true;
												}
												
												if(curFocus_.tweenTableTopOk == true && curFocus_.tweenTableLeftOk == true && curFocus_.tweenTableWidthOk == true && curFocus_.tweenTableHeightOk == true && curFocus_.tweenTableWWidthOk == true && curFocus_.tweenTableHHeightOk == true )
												{
															clearInterval(curFocus_.tweenMoveInterval);
															curFocus_.tweenMoveInterval = null;
															// 开启方向键权限
															PAGE.displayDire = false;
												}
											}else{
												clearInterval(curFocus.tweenMoveInterval);
												curFocus.tweenMoveInterval = null;
												// 开启方向键权限
												PAGE.displayDire = false;
											}
											
									},10);

								}else if(lastFocusTypeId == 10)
								{
									// 获取上一个焦点的坐标
									
									// 由于当前焦点的移动选中框是规则的图形，所以可以讲图形变化方式改为从小到达
									// 将移动选中框的大小设置为最小值
									
									var tweenTableObj_ = CT.$("tweenTable").style;
									tweenTableObj_.visibility = "visible";
									tweenTableObj_.width = PAGE.tweenTableMinWidth +50+ "px";
									tweenTableObj_.height = PAGE.tweenTableMinHeight +50+ "px";
									CT.$("tweenTableWidth").style.width = "50" + "px";
									CT.$("tweenTableHeight").style.height = "50" + "px";
									// 将移动选中框的位置设置为在上一个焦点的位置
									 // 获取上一个移动边框焦点的坐标
									var lastDom = CT.$(lastNode.FocusID).style;
									var lastTop = parseInt(lastDom.top);
									var lastLeft = parseInt(lastDom.left);
									tweenTableObj_.top = lastTop + "px";
									tweenTableObj_.left = lastLeft + "px";
									// 获取变化量
						
									var topbl = curTop - lastTop;
									var leftbl = curLeft - lastLeft;
									
									// 移动边框width需要变化的数值
									var widthbl = curWidth - PAGE.tweenTableMinWidth - 50;
									// 移动边框height需要变化的数值
									var heightbl = curHeight - PAGE.tweenTableMinHeight - 50;
									
									// 内部TD宽度的变化量即等于外部移动边框的变化量，两者相等
									var widthwbl = widthbl;
									// 同上
									var heighthbl = heightbl;
									
									curFocus.tweenTableTop = new TweenModel(0,lastTop,topbl,curFocus.tweenSpeed);
									curFocus.tweenTableLeft = new TweenModel(0,lastLeft,leftbl,curFocus.tweenSpeed);
									
									curFocus.tweenTableWidth = new TweenModel(0,PAGE.tweenTableMinWidth+50,widthbl,curFocus.tweenSpeed);
									curFocus.tweenTableHeight = new TweenModel(0,PAGE.tweenTableMinHeight+50,heightbl,curFocus.tweenSpeed);
									
									curFocus.tweenTableWWidth = new TweenModel(0,50,widthwbl,curFocus.tweenSpeed);
									curFocus.tweenTableHHeight = new TweenModel(0,50,heighthbl,curFocus.tweenSpeed);
									
									curFocus.tweenMoveInterval = setInterval(function(){
												var nu = parseInt(curFocus.tweenMoveInterval);
												if(!isNaN(nu))
												{
												var curFocus_ = PAGE.intervalArr[nu+""];
												if(CT.isnull(curFocus_))
												{
													PAGE.intervalArr[nu+""]=curFocus;
												}
												curFocus_ = PAGE.intervalArr[nu+""];
												// 由于需要时间缓冲，需要禁用用户使用方向键盘
												PAGE.displayDire = true;
												
												// 移动边框对象
												var tweenTableObj = CT.$("tweenTable").style;
												// 移动边框left值增长量
												tweenTableObj.left =  Math.ceil(Tween(curFocus_.tweenTableLeft.nums,curFocus_.tweenTableLeft.initalValue,curFocus_.tweenTableLeft.finishValue,curFocus_.tweenTableLeft.countValue)) + "px";
												// 移动边框top值增长量
												tweenTableObj.top =  Math.ceil(Tween(curFocus_.tweenTableTop.nums,curFocus_.tweenTableTop.initalValue,curFocus_.tweenTableTop.finishValue,curFocus_.tweenTableTop.countValue)) + "px";
												// 移动边框width值增长量
												tweenTableObj.width = Math.ceil(Tween(curFocus_.tweenTableWidth.nums,curFocus_.tweenTableWidth.initalValue,curFocus_.tweenTableWidth.finishValue,curFocus_.tweenTableWidth.countValue)) + "px";
												// 移动边框height值增长量
												tweenTableObj.height = Math.ceil(Tween(curFocus_.tweenTableHeight.nums,curFocus_.tweenTableHeight.initalValue,curFocus_.tweenTableHeight.finishValue,curFocus_.tweenTableHeight.countValue)) + "px";
												// 内部td的width值增长量
												CT.$("tweenTableWidth").style.width = Math.ceil(Tween(curFocus_.tweenTableWWidth.nums,curFocus_.tweenTableWWidth.initalValue,curFocus_.tweenTableWWidth.finishValue,curFocus_.tweenTableWWidth.countValue)) + "px";
												// 内部td的height值增长量
												CT.$("tweenTableHeight").style.height = Math.ceil(Tween(curFocus_.tweenTableHHeight.nums,curFocus_.tweenTableHHeight.initalValue,curFocus_.tweenTableHHeight.finishValue,curFocus_.tweenTableHHeight.countValue)) + "px";
												
												if(curFocus_.tweenTableLeft.nums < curFocus_.tweenTableLeft.countValue)
												{
													curFocus_.tweenTableLeft.nums ++;
													curFocus_.tweenTableLeftOk = false;
												}else
												{
													curFocus_.tweenTableLeftOk = true;
												}
												
												if(curFocus_.tweenTableTop.nums < curFocus_.tweenTableTop.countValue)
												{
													curFocus_.tweenTableTop.nums ++;
													curFocus_.tweenTableTopOk = false;
												}else
												{
													curFocus_.tweenTableTopOk = true;
												}
												
												if(curFocus_.tweenTableWidth.nums < curFocus_.tweenTableWidth.countValue)
												{
													curFocus_.tweenTableWidth.nums ++;
													curFocus_.tweenTableWidthOk = false;
												}else
												{
													curFocus_.tweenTableWidthOk = true;
												}
												
												if(curFocus_.tweenTableHeight.nums < curFocus_.tweenTableHeight.countValue)
												{
													curFocus_.tweenTableHeight.nums ++;
													curFocus_.tweenTableHeightOk = false;
												}else
												{
													curFocus_.tweenTableHeightOk = true;
												}
												
												if(curFocus_.tweenTableWWidth.nums < curFocus_.tweenTableWWidth.countValue)
												{
													curFocus_.tweenTableWWidth.nums ++;
													curFocus_.tweenTableWWidthOk = false;
												}else
												{
													curFocus_.tweenTableWWidthOk = true;
												}
												
												if(curFocus_.tweenTableHHeight.nums < curFocus_.tweenTableHHeight.countValue)
												{
													curFocus_.tweenTableHHeight.nums ++;
													curFocus_.tweenTableHHeightOk = false;
												}else
												{
													curFocus_.tweenTableHHeightOk = true;
												}
												
												if(curFocus_.tweenTableTopOk == true && curFocus_.tweenTableLeftOk == true && curFocus_.tweenTableWidthOk == true && curFocus_.tweenTableHeightOk == true && curFocus_.tweenTableWWidthOk == true && curFocus_.tweenTableHHeightOk == true )
												{
															clearInterval(curFocus_.tweenMoveInterval);
															curFocus_.tweenMoveInterval = null;
															// 开启方向键权限
															PAGE.displayDire = false;
															
												}
											}else{
												clearInterval(curFocus.tweenMoveInterval);
												curFocus.tweenMoveInterval = null;
												// 开启方向键权限
												PAGE.displayDire = false;
											}
									},10);
								}
							}else{
								// 如果没有上一个焦点，就自动显示移动边框
								if(!CT.isnull(CT.$("tweenTable")) && !CT.isnull(CT.$("tweenTableWidth")) && !CT.isnull(CT.$("tweenTableHeight")) )
								{
									
									var tweenTableObj = CT.$("tweenTable").style;
									tweenTableObj.visibility = "visible";
									tweenTableObj.width = curWidth +"px";
									tweenTableObj.height = curHeight +"px";
									tweenTableObj.top = curTop + "px";
									tweenTableObj.left = curLeft + "px";
									var tweenTableWidthObj = CT.$("tweenTableWidth").style;
									tweenTableWidthObj.width = (curWidth - PAGE.tweenTableMinWidth) +"px";
									var tweenTableHeightObj = CT.$("tweenTableHeight").style;
									tweenTableHeightObj.height = (curHeight - PAGE.tweenTableMinHeight) + "px";
								}else{
									console.log("发现错误，移动边框未找到！！");
									return;
								}
							}
						}else if(curFocus.FocusType == 10){
							
							if(CT.isnull(curFocus.selectBorderId))
							{
								console.log("发生错误，focuType等于10的时候，需要指定selectBorderId选中框的id!");
								return;
							}
							var curSelectObj = CT.$(curFocus.selectBorderId);
							if(CT.isnull(curSelectObj))
							{
								console.log("发生错误，未找到【"+curFocus.selectBorderId+"】选中框对象！");	
								return;
							}
							// 显示当前用来焦点选中框的div
							curSelectObj.style.visibility = "visible";
							// 判断是否有上一个焦点
							if(!CT.isnull(curFocus.lastFocusId))
							{
								// 获取当前焦点，上一个焦点的焦点类型
								var lastNode =getModelByFocusId(curFocus.lastFocusId);
								var lastFocusTypeId = parseInt(lastNode.FocusType);
								if(lastFocusTypeId ==10 )
								 {
									// 获取当前焦点selectBorderId
									var curSelectBorderId = curFocus.selectBorderId;
									// 获取上一个焦点selectBorderId
									var lastSelectBorderId = lastNode.selectBorderId;
									
									if(curSelectBorderId != lastSelectBorderId)
									{
													// 将当前选中框往下移动
													// 将当前选中框的位置设置为上一个焦点的位置
													// 获取当前选中框
													// 获取上一个焦点的位置
													// 获得上一个焦点的DOM对象
													var lastNodeObj = CT.$(lastNode.FocusID).style;
													// 上一个焦点的Top值
													var lastNodeTop = parseInt(lastNodeObj.top);
													// 上一个焦点的Left值
													var lastNodeLeft = parseInt(lastNodeObj.left);
													curSelectObj.style.top = lastNodeTop + "px";
													curSelectObj.style.left = lastNodeLeft + "px";
													// 计算变量值
													// 当前焦点选中框top值需要变化的量
													var topbh = curTop - lastNodeTop;
													var leftbh = curLeft - lastNodeLeft;
													curFocus.tweenTop = new TweenModel(0,lastNodeTop,topbh,curFocus.tweenSpeed);
													curFocus.tweenLeft = new TweenModel(0,lastNodeLeft,leftbh,curFocus.tweenSpeed);
													curFocus.tweenMoveInterval = setInterval(function(){
														var nu = parseInt(curFocus.tweenMoveInterval);
														if(!isNaN(nu))
														{
														var curFocus_ = PAGE.intervalArr[nu+""];
														if(CT.isnull(curFocus_))
														{
															PAGE.intervalArr[nu+""]=curFocus;
														}
														curFocus_ = PAGE.intervalArr[nu+""];
														// 由于需要时间缓冲，需要禁用用户使用方向键盘
														PAGE.displayDire = true;
														var sele = CT.$(curFocus_.selectBorderId).style;
														sele.top =   Math.ceil(Tween(curFocus_.tweenTop.nums,curFocus_.tweenTop.initalValue,curFocus_.tweenTop.finishValue,curFocus_.tweenTop.countValue)) + "px";
														sele.left =   Math.ceil(Tween(curFocus_.tweenLeft.nums,curFocus_.tweenLeft.initalValue,curFocus_.tweenLeft.finishValue,curFocus_.tweenLeft.countValue)) + "px";
														
														if(curFocus_.tweenTop.nums < curFocus_.tweenTop.countValue)
														{
															curFocus_.tweenTop.nums ++;
															curFocus_.tweenTopOk = false;
														}else
														{
															curFocus_.tweenTopOk = true;
														}
														
														if(curFocus_.tweenLeft.nums < curFocus_.tweenLeft.countValue)
														{
															curFocus_.tweenLeft.nums ++;
															curFocus_.tweenLeftOk = false;
														}else
														{
															curFocus_.tweenLeftOk = true;
														}
														
														if(curFocus_.tweenLeftOk == true && curFocus_.tweenTopOk == true )
														{
																	clearInterval(curFocus_.tweenMoveInterval);
																	curFocus_.tweenMoveInterval = null;
																	// 开启方向键权限
																	PAGE.displayDire = false;
														}
													}else{
														clearInterval(curFocus.tweenMoveInterval);
														curFocus.tweenMoveInterval = null;
														// 开启方向键权限
														PAGE.displayDire = false;
													}
											},10);
									}else{
									
											// 获得上一个焦点的DOM对象
											var lastNodeObj = CT.$(lastNode.FocusID).style;
											// 上一个焦点的Top值
											var lastNodeTop = parseInt(lastNodeObj.top);
											// 上一个焦点的Left值
											var lastNodeLeft = parseInt(lastNodeObj.left);
											
											// 当前焦点选中框top值需要变化的量
											var topbh = curTop - lastNodeTop;
											var leftbh = curLeft - lastNodeLeft;
											
											curFocus.tweenTop = new TweenModel(0,lastNodeTop,topbh,curFocus.tweenSpeed);
											curFocus.tweenLeft = new TweenModel(0,lastNodeLeft,leftbh,curFocus.tweenSpeed);
											curFocus.tweenMoveInterval = setInterval(function(){
														var nu = parseInt(curFocus.tweenMoveInterval);
														if(!isNaN(nu))
														{
														var curFocus_ = PAGE.intervalArr[nu+""];
														if(CT.isnull(curFocus_))
														{
															PAGE.intervalArr[nu+""]=curFocus;
														}
														curFocus_ = PAGE.intervalArr[nu+""];
														// 由于需要时间缓冲，需要禁用用户使用方向键盘
														PAGE.displayDire = true;
														var sele = CT.$(curFocus_.selectBorderId).style;
														sele.top =   Math.ceil(Tween(curFocus_.tweenTop.nums,curFocus_.tweenTop.initalValue,curFocus_.tweenTop.finishValue,curFocus_.tweenTop.countValue)) + "px";
														sele.left =   Math.ceil(Tween(curFocus_.tweenLeft.nums,curFocus_.tweenLeft.initalValue,curFocus_.tweenLeft.finishValue,curFocus_.tweenLeft.countValue)) + "px";
														
														if(curFocus_.tweenTop.nums < curFocus_.tweenTop.countValue)
														{
															curFocus_.tweenTop.nums ++;
															curFocus_.tweenTopOk = false;
														}else
														{
															curFocus_.tweenTopOk = true;
														}
														
														if(curFocus_.tweenLeft.nums < curFocus_.tweenLeft.countValue)
														{
															curFocus_.tweenLeft.nums ++;
															curFocus_.tweenLeftOk = false;
														}else
														{
															curFocus_.tweenLeftOk = true;
														}
														
														if(curFocus_.tweenLeftOk == true && curFocus_.tweenTopOk == true )
														{
																	clearInterval(curFocus_.tweenMoveInterval);
																	curFocus_.tweenMoveInterval = null;
																	// 开启方向键权限
																	PAGE.displayDire = false;
														}
													}else{
														clearInterval(curFocus.tweenMoveInterval);
														curFocus.tweenMoveInterval = null;
														// 开启方向键权限
														PAGE.displayDire = false;
													}
											},10);
									}
								 }else if(lastFocusTypeId !=10 && lastFocusTypeId != 9)
								 {
									 	curSelectObj.style.top = curTop + "px";
										curSelectObj.style.left = curLeft + "px";
								 }else if(lastFocusTypeId == 9)
								 {
									 // 获取上一个移动边框焦点的坐标
									 var lastDom = CT.$(lastNode.FocusID).style;
									 var lastTop = parseInt(lastDom.top);
									 var lastLeft = parseInt(lastDom.left);
									 curSelectObj.style.left = lastLeft +"px";
									 curSelectObj.style.top = lastTop +"px";
									 // 获取需要的变量值
									 var leftbl = curLeft - lastLeft;
									 var topbl = curTop - lastTop;
									 curFocus.tweenTop = new TweenModel(0,lastTop,topbl,curFocus.tweenSpeed);
									 curFocus.tweenLeft = new TweenModel(0,lastLeft,leftbl,curFocus.tweenSpeed);
									 
									 curFocus.tweenMoveInterval = setInterval(function(){
														var nu = parseInt(curFocus.tweenMoveInterval);
														if(!isNaN(nu))
														{
														var curFocus_ = PAGE.intervalArr[nu+""];
														if(CT.isnull(curFocus_))
														{
															PAGE.intervalArr[nu+""]=curFocus;
														}
														curFocus_ = PAGE.intervalArr[nu+""];
														// 由于需要时间缓冲，需要禁用用户使用方向键盘
														PAGE.displayDire = true;
														var sele = CT.$(curFocus_.selectBorderId).style;
														sele.top =   Math.ceil(Tween(curFocus_.tweenTop.nums,curFocus_.tweenTop.initalValue,curFocus_.tweenTop.finishValue,curFocus_.tweenTop.countValue)) + "px";
														sele.left =   Math.ceil(Tween(curFocus_.tweenLeft.nums,curFocus_.tweenLeft.initalValue,curFocus_.tweenLeft.finishValue,curFocus_.tweenLeft.countValue)) + "px";
														
														if(curFocus_.tweenTop.nums < curFocus_.tweenTop.countValue)
														{
															curFocus_.tweenTop.nums ++;
															curFocus_.tweenTopOk = false;
														}else
														{
															curFocus_.tweenTopOk = true;
														}
														
														if(curFocus_.tweenLeft.nums < curFocus_.tweenLeft.countValue)
														{
															curFocus_.tweenLeft.nums ++;
															curFocus_.tweenLeftOk = false;
														}else
														{
															curFocus_.tweenLeftOk = true;
														}
														
														if(curFocus_.tweenLeftOk == true && curFocus_.tweenTopOk == true )
														{
																	clearInterval(curFocus_.tweenMoveInterval);
																	curFocus_.tweenMoveInterval = null;
																	// 开启方向键权限
																	PAGE.displayDire = false;
														}
													}else{
														clearInterval(curFocus.tweenMoveInterval);
														curFocus.tweenMoveInterval = null;
														// 开启方向键权限
														PAGE.displayDire = false;
													}
												 },10);
								 }
							}else{
								curSelectObj.style.top = curTop + "px";
								curSelectObj.style.left = curLeft + "px";
							}
							
						}
			}

}

function TweenModel(t_,b_,c_,d_)
{
	// 当前计量单位，默认从0开始计数
	this.nums  = t_;
	// 当前变化的初始位置大小
	this.initalValue = b_;
	// 最终需要变化的大小
	this.finishValue = c_;
	// 速度，要求多少步骤走完，默认10
	this.countValue = d_;
	
}
function Tween(t,b,c,d){
			//var s = 1.70158;
			/*var tempB = t;
			tempB = tempB/(d/2);
			s = s * 1.525;
			var tempS1 = tempB*tempB;
			var tempS2 = (s+1)*tempB - s;
			var tempS = tempS1*tempS2;
			var tempC = c/2*tempS;
			if (tempB < 1) return tempC + b;
			return c/2*((tempB-=2)*tempB*((s+1)*tempB + s) + 2) + b;*/
			/*var tempB = t;
			tempB = tempB/d;
			var aa = -c;
			var bb = aa*tempB;
			var cc = tempB-2;
			 //return -c *tempB*(tempB-2) + b;
			 return bb*cc + b;*/
			return t * c / d + b;
			/*if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
			return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;*/
}
// 按键向上，找出距离当前焦点最近的焦点
function upFocusObj() {
	var bl = true;
	for(var it in focusDires)
	{
		if(curFocus.FocusID==it)
		{
			// 获得当前焦点，是否有指定移动的焦点
			var d = focusDires[it];
			// 由于当前方法是用来往上移动的，只需判断是否有上方的focusId
			 // 当前焦点，往某方向按键时具有优先执行，如果指定了方向事件，就不会切换当前焦点，而去执行事件
			 if(!CT.isnull(d.upEvent))
			 {
				 exeCode(d.upEvent);
				 bl=false;
				 return;
			 }else if(!CT.isnull(d.up))
			 {
				// 如果往上移动被赋值了disable说明啥都不操作
				if(d.up =="disable")
				{
					bl=false;
					return;
				}
				// 通过focusID找到焦点对象
				var nextNode =getModelByFocusId(d.up);
				if(nextNode.enFocus==true)
				{
					// 切换新焦点之前，需要执行失去焦点事件
					curFocus.defaultBlur();
					var fid = curFocus.FocusID;
					// 给当前焦点重新赋值
					curFocus = nextNode;
					curFocus.lastFocusId = fid;
					curFocus.defaultFocus();
					
					bl=false;
					return;
					//如果原本设置的按钮被禁用了，倘若设置了downOther值，就让此按钮获得焦点
				}else if(nextNode.enFocus==false && !CT.isnull(d.upOther))
					{
						// 通过focusID找到焦点对象
						var otherNode =getModelByFocusId(d.upOther);
						if(otherNode.enFocus==true)
						{
							// 切换新焦点之前，需要执行失去焦点事件
							curFocus.defaultBlur();
							var fid = curFocus.FocusID;
							// 给当前焦点重新赋值
							curFocus = otherNode;
							curFocus.lastFocusId = fid;
							curFocus.defaultFocus();
							bl=false;
							return;
						}
					}
				// 方向共四个方向，如果其中那个方向没有指定focusid，但却指定了d.other的focusid,就切换焦点到d.other
				// d.other使用的场景为：如果某焦点超过四个方向，超过两个方向都指向了同一个焦点，这时是可以指定这个值的
			}else if(!CT.isnull(d.other))
			{
				if(d.other =="disable")
				{
					bl=false;
					return;
				}
				// 通过focusID找到焦点对象
				var nextNode =getModelByFocusId(d.other);
				if(nextNode.enFocus==true)
				{
					// 切换新焦点之前，需要执行失去焦点事件
					curFocus.defaultBlur();
					var fid = curFocus.FocusID;
					// 给当前焦点重新赋值
					curFocus = nextNode;
					curFocus.lastFocusId = fid;
					curFocus.defaultFocus();
					bl=false;
					return;
				}
			}
		}
	}
		if(bl)
		{
		
		var curNode = null;
		// ********************获取当前焦点的坐标***********************/
		for (var i = 0; i < PAGE.focusArr.length; i++) {
			if (curFocus.FocusID == PAGE.focusArr[i].id) {
				curNode = PAGE.focusArr[i];
				break;
			}
		}
		var x = parseInt(curNode.style.left);
		var y = parseInt(curNode.style.top);
		// 判断是否有父节点
		var curPar = curFocus.ParentNode;
		if(!CT.isnull(curPar))
		{
				x = x +  parseInt(curPar.style.left);
				y = y +  parseInt(curPar.style.top);
		}
		
		var curCoo = new FunCoo(x, y);
		/** ****************************************************** */
		var upNodeArr = new Array();
		// 向上，即只要是top值比当前焦点top值小的，都是在上方
		// 找出在当前焦点上方的所有焦点
		for (var i = 0; i < PAGE.focusArr.length; i++) {
			var j = PAGE.focusArr[i];
			// 判断是否有父节点
			var top  =  parseInt(j.style.top);
			var left =  parseInt(j.style.left);
			var npar = j.focusmodel.ParentNode;
			if(!CT.isnull(npar))
			{
					left = left +  parseInt(npar.style.left);
					top = top +  parseInt(npar.style.top);
			}
			
			// 忽略已经被禁用的焦点
			if(j.focusmodel.enFocus==true && top < y)
			{
				upNodeArr.push(j);
			}
		}
		
		var nextNode = null;
		//var maxNextNode = null;
		var bl = true;
		// 距离当前焦点最小的距离
		var minjl = 0;
		// 距离当前焦点最大的距离
		var maxjl = 0;
		// 如果存在上方的焦点,就计算上方的所有焦点中，距离当前焦点最近的
		if (upNodeArr.length > 0) {
			for (var i = 0; i < upNodeArr.length; i++) {
				// 生成坐标
				var nextCoo = new FunCoo(parseInt(upNodeArr[i].style.left), parseInt(upNodeArr[i].style.top));
				// 计算距离
				var jl = distanceCAL(curCoo, nextCoo);
				// 这么做是首次赋值
				if (bl) {
					minjl = jl;
					maxjl = jl;
					nextNode = upNodeArr[i];
					maxNextNode = upNodeArr[i];
					bl = false;
				}
				// 比较出最小的距离
				if (jl < minjl) {
					nextNode = upNodeArr[i];
					minjl = jl;
				}
				// 比较出最大的距离
				if (jl > maxjl) {
					maxNextNode = upNodeArr[i];
					maxjl = jl;
				}
			}
			// 切换新焦点之前，需要执行失去焦点事件
			curFocus.defaultBlur();
			var fid = curFocus.FocusID;
			// 给当前焦点重新赋值
			curFocus = nextNode.focusmodel;
			curFocus.lastFocusId = fid;
			curFocus.defaultFocus();
			
		} 
	}
		 
}

// 按键向下，找出距离当前焦点最近的焦点
function downFocusObj() {
		var bl = true;
	for(var it in focusDires)
	{
		if(curFocus.FocusID==it)
		{
			// 获得当前焦点，是否有指定移动的焦点
			var d = focusDires[it];
			// 由于当前方法是用来往下移动的，只需判断是否有下方的focusId
			// 当前焦点，往某方向按键时具有优先执行，如果指定了方向事件，就不会切换当前焦点，而去执行事件
			 if(!CT.isnull(d.downEvent))
			 {
				 exeCode(d.downEvent);
				 bl=false;
				 return;
			 }else if(!CT.isnull(d.down))
			 {
				// 如果往下移动被赋值了disable说明啥都不操作
				if(d.down == "disable")
				{
					bl=false;
					return;
				}
				// 通过focusID找到焦点对象
				var nextNode =getModelByFocusId(d.down);
				if(nextNode.enFocus==true)
				{
					//
					// 切换新焦点之前，需要执行失去焦点事件
					curFocus.defaultBlur();
					var fid = curFocus.FocusID;
					// 给当前焦点重新赋值
					curFocus = nextNode;
					curFocus.lastFocusId = fid;
					curFocus.defaultFocus();
					bl=false;
					return;
					//如果原本设置的按钮被禁用了，倘若设置了downOther值，就让此按钮获得焦点
				}else if(nextNode.enFocus==false && !CT.isnull(d.downOther))
					{
						// 通过focusID找到焦点对象
						var otherNode =getModelByFocusId(d.downOther);
						if(otherNode.enFocus==true)
						{
							// 切换新焦点之前，需要执行失去焦点事件
							curFocus.defaultBlur();
							var fid = curFocus.FocusID;
							// 给当前焦点重新赋值
							curFocus = otherNode;
							curFocus.lastFocusId = fid;
							curFocus.defaultFocus();
							bl=false;
							return;
						}
					}
			}else if(!CT.isnull(d.other))
			{
				if(d.other =="disable")
				{
					bl=false;
					return;
				}
				// 通过focusID找到焦点对象
				var nextNode =getModelByFocusId(d.other);
				if(nextNode.enFocus==true)
				{
					// 切换新焦点之前，需要执行失去焦点事件
					curFocus.defaultBlur();
					var fid = curFocus.FocusID;
					// 给当前焦点重新赋值
					curFocus = nextNode;
					curFocus.lastFocusId = fid;
					curFocus.defaultFocus();
					bl=false;
					return;
				}
			}
		}
	}
	if(bl)
	{
    var curNode = null;
    // ********************获取当前焦点的坐标***********************/
    for (var i = 0; i < PAGE.focusArr.length; i++) {
        if (curFocus.FocusID == PAGE.focusArr[i].id) {
            curNode = PAGE.focusArr[i];
            break;
        }
    }
	var x = parseInt(curNode.style.left);
	var y = parseInt(curNode.style.top);
	// 判断是否有父节点
	var curPar = curFocus.ParentNode;
	if(!CT.isnull(curPar))
	{
			x = x +  parseInt(curPar.style.left);
			y = y +  parseInt(curPar.style.top);
	}
		
		
    var curCoo = new FunCoo(x, y);
    /** ****************************************************** */
    var upNodeArr = new Array();
    // 向下，即只要是top值比当前焦点top值大的，都是在下方
    // 找出在当前焦点上方的所有焦点
    for (var i = 0; i < PAGE.focusArr.length; i++) {
        var j = PAGE.focusArr[i];
		// 判断是否有父节点
		var top  =  parseInt(j.style.top);
		var left =  parseInt(j.style.left);
		var npar = j.focusmodel.ParentNode;
		if(!CT.isnull(npar))
		{
				left = left +  parseInt(npar.style.left);
				top = top +  parseInt(npar.style.top);
		}
		
		// 忽略已经被禁用的焦点
        if (j.focusmodel.enFocus==true && top > y) {
            upNodeArr.push(j);
        }
    }
    var nextNode = null;
    //var maxNextNode = null;
    var bl = true;
    // 距离当前焦点最小的距离
    var minjl = 0;
    // 距离当前焦点最大的距离
    var maxjl = 0;
    // 如果存在上方的焦点,就计算上方的所有焦点中，距离当前焦点最近的
    if (upNodeArr.length > 0) {
        for (var i = 0; i < upNodeArr.length; i++) {
            // 生成坐标
            var nextCoo = new FunCoo(parseInt(upNodeArr[i].style.left), parseInt(upNodeArr[i].style.top));
            // 计算距离
            var jl = distanceCAL(curCoo, nextCoo);
            // 这么做是首次赋值
            if (bl) {
                minjl = jl;
                maxjl = jl;
                nextNode = upNodeArr[i];
                maxNextNode = upNodeArr[i];
                bl = false;
            }
            // 比较出最小的距离
            if (jl < minjl) {
                nextNode = upNodeArr[i];
                minjl = jl;
            }
            // 比较出最大的距离
            if (jl > maxjl) {
                maxNextNode = upNodeArr[i];
                maxjl = jl;
            }
        }
        // 切换新焦点之前，需要执行失去焦点事件
        curFocus.defaultBlur();
		var fid = curFocus.FocusID;
        // 给当前焦点重新赋值
        curFocus = nextNode.focusmodel;
		curFocus.lastFocusId = fid;
        curFocus.defaultFocus();
    }
	}
}

// 按键向左，找出距离当前焦点最近的焦点
function leftFocusObj() {
	var bl = true;
	for(var it in focusDires)
	{
		if(curFocus.FocusID==it)
		{
			// 获得当前焦点，是否有指定移动的焦点
			var d = focusDires[it];
			// 由于当前方法是用来往左移动的，只需判断是否有左方的focusId
			// 当前焦点，往某方向按键时具有优先执行，如果指定了方向事件，就不会切换当前焦点，而去执行事件
			 if(!CT.isnull(d.leftEvent))
			 {
				 exeCode(d.leftEvent);
				 bl=false;
				 return;
			 }else if(!CT.isnull(d.left))
			 {
				// 如果往下移动被赋值了disable说明啥都不操作
				if(d.left == "disable")
				{
					bl=false;
					return;
				}
				// 通过focusID找到焦点对象
				var nextNode =getModelByFocusId(d.left);
				if(nextNode.enFocus==true)
				{
					//
					// 切换新焦点之前，需要执行失去焦点事件
					curFocus.defaultBlur();
					var fid = curFocus.FocusID;
					// 给当前焦点重新赋值
					curFocus = nextNode;
					curFocus.lastFocusId = fid;
					curFocus.defaultFocus();
					bl=false;
					return;
					//如果原本设置的按钮被禁用了，倘若设置了downOther值，就让此按钮获得焦点
				}else if(nextNode.enFocus==false && !CT.isnull(d.leftOther))
					{
						// 切换新焦点之前，需要执行失去焦点事件
						curFocus.defaultBlur();
						// 通过focusID找到焦点对象
						var otherNode =getModelByFocusId(d.leftOther);
						if(otherNode.enFocus==true)
						{
							var fid = curFocus.FocusID;
							// 给当前焦点重新赋值
							curFocus = otherNode;
							curFocus.lastFocusId = fid;
							curFocus.defaultFocus();
							bl=false;
							return;
						}
					}
			}else if(!CT.isnull(d.other))
			{
				if(d.other =="disable")
				{
					bl=false;
					return;
				}
				// 通过focusID找到焦点对象
				var nextNode =getModelByFocusId(d.other);
				if(nextNode.enFocus==true)
				{
					// 切换新焦点之前，需要执行失去焦点事件
					curFocus.defaultBlur();
					var fid = curFocus.FocusID;
					// 给当前焦点重新赋值
					curFocus = nextNode;
					curFocus.lastFocusId = fid;
					curFocus.defaultFocus();
					bl=false;
					return;
				}
			}
		}
	}
	if(bl)
	{
    var curNode = null;
    // ********************获取当前焦点的坐标***********************/
    for (var i = 0; i < PAGE.focusArr.length; i++) {
        if (curFocus.FocusID == PAGE.focusArr[i].id) {
            curNode = PAGE.focusArr[i];
            break;
        }
    }
   var x = parseInt(curNode.style.left);
	var y = parseInt(curNode.style.top);
	// 判断是否有父节点
	var curPar = curFocus.ParentNode;
	if(!CT.isnull(curPar))
	{
			x = x +  parseInt(curPar.style.left);
			y = y +  parseInt(curPar.style.top);
	}
    var curCoo = new FunCoo(x, y);
    /** ****************************************************** */
    var upNodeArr = new Array();
    // 向左，即只要是left值比当前焦点left值小的，都是在左方
    // 找出在当前焦点左方的所有焦点
    for (var i = 0; i < PAGE.focusArr.length; i++) {
        var j = PAGE.focusArr[i];
		// 判断是否有父节点
		var top  =  parseInt(j.style.top);
		var left =  parseInt(j.style.left);
		var npar = j.focusmodel.ParentNode;
		if(!CT.isnull(npar))
		{
				left = left +  parseInt(npar.style.left);
				top = top +  parseInt(npar.style.top);
		}
		
       // 忽略已经被禁用的焦点
        if (j.focusmodel.enFocus==true && left < x) {
            upNodeArr.push(j);
        }
    }
    var nextNode = null;
    //var maxNextNode = null;
    var bl = true;
    // 距离当前焦点最小的距离
    var minjl = 0;
    // 距离当前焦点最大的距离
    var maxjl = 0;
    // 如果存在左方的焦点,就计算上方的所有焦点中，距离当前焦点最近的
    if (upNodeArr.length > 0) {
        for (var i = 0; i < upNodeArr.length; i++) {
            // 生成坐标
            var nextCoo = new FunCoo(parseInt(upNodeArr[i].style.left), parseInt(upNodeArr[i].style.top));
            // 计算距离
            var jl = distanceCAL(curCoo, nextCoo);
            // 这么做是首次赋值
            if (bl) {
                minjl = jl;
                maxjl = jl;
                nextNode = upNodeArr[i];
                maxNextNode = upNodeArr[i];
                bl = false;
            }
            // 比较出最小的距离
            if (jl < minjl) {
                nextNode = upNodeArr[i];
                minjl = jl;
            }
            // 比较出最大的距离
            if (jl > maxjl) {
                maxNextNode = upNodeArr[i];
                maxjl = jl;
            }
        }
        // 切换新焦点之前，需要执行失去焦点事件
        curFocus.defaultBlur();
		var fid = curFocus.FocusID;
        // 给当前焦点重新赋值
        curFocus = nextNode.focusmodel;
		curFocus.lastFocusId = fid;
        curFocus.defaultFocus();
    } 
	}
}

// 移动手掌
function moveHand(x, y) {
	/*if(curHand.handObj.style.display=="none")
	{
		curHand.handObj.style.display="block";
	}*/
   	curHand.x = x;
    curHand.y = y;
    curHand.handObj.style.top = curHand.y + "px";
    curHand.handObj.style.left = curHand.x + "px";
    curHand.handImg.src=PAGE.handimgsrc1;
	// 默认情况下，手掌外包裹div的宽高为初始化时的宽高
	if(!CT.getBrowVersion("EIS iPanel 2.0"))
	{
		curHand.handObj.style.height = PAGE.handimgheight + "px";								
		curHand.handObj.style.width = PAGE.handimgwidth + "px";
	}
	// 如果当前移动手掌需要切换其他手掌图片
	if(!CT.isnull(curFocus.handImgSrc))
	{
		 curHand.handImg.src=curFocus.handImgSrc;
		 // 只有切换手掌图片时，才会有改变包裹外div的宽高变化
		 if(!CT.isnull(curFocus.handHeight))
		{
			if(!CT.getBrowVersion("EIS iPanel 2.0"))
			{
				curHand.handObj.style.height=curFocus.handHeight + "px";
				curHand.handImg.height = curFocus.handHeight ;
			}
		}
		 if(!CT.isnull(curFocus.handWidth))
		{
			if(!CT.getBrowVersion("EIS iPanel 2.0"))
			{
				curHand.handObj.style.width=curFocus.handWidth + "px";
				curHand.handImg.width=curFocus.handWidth;
			}
		}
	}
    return curHand;
	
}

// 通过隐藏图片，来做切换效果
function shangshuo2(){
		curFocus.interval=setInterval(function(){
			if(!CT.isnull(curFocus.ImgID))
			{
				if(CT.$(curFocus.ImgID).style.visibility =="visible")
				{
					CT.$(curFocus.ImgID).style.visibility="hidden";
				}else if(CT.$(curFocus.ImgID).style.visibility =="hidden"){
					CT.$(curFocus.ImgID).style.visibility="visible";
				}else{
					CT.$(curFocus.ImgID).style.visibility="visible";
				}
			}
		},800);
}
function shangshuo(){
		curFocus.interval=setInterval(function(){
			if(!CT.isnull(curFocus.ImgSwap))
			{
				if(CT.$(curFocus.ImgID).src==curFocus.oldSwap)
				{
					CT.$(curFocus.ImgID).src=curFocus.ImgSwap;
				}else{
					CT.$(curFocus.ImgID).src=curFocus.oldSwap;
				}
			}
		},10);
}
function exeCode(_code)
{
    if (CT.isnull(_code)) return;
    var code = _code;
    try {
        if (code.indexOf("javascript:") > -1) {
            code = code.replace("javascript:", "");
            setTimeout(code,0);
        } else {
            redirect(code);
        }
    } catch (e) {
        console.log("执行代码出错！");
    }
}

/**
 * 订购跳转方法
 * @param url
 */
function pageRedirect(url){
	if (CT.isnull(url)) return;
    // 如果禁用了按键，就不执行
    if (curFocus.enable == true) {
        // 如果执行了页面跳转，就禁止再次点击跳转
        curFocus.enable = false;
        window.location.href = url;
        return;
    }
}
