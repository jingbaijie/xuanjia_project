/**
 * Created by Administrator on 2016/10/20.jin
 *
 */
var canMove=true;
var arrDiv=[];
var result=[];
var successArr=[0,1,2,3,4,5,6,7,8];
var canLoopTime=false;
//随机生成0-9
function RandomArry(){
    var arr=[0,1,2,3,4,5,6,7,8];
    while(arrDiv.length<9){
        var index=Math.floor(Math.random()*arr.length);
        arrDiv.push(arr.splice(index,1).toString()-0);
    }
    //根据随机数字改变位置
    PositionDiv(arrDiv);
}
//方格位置
function  PositionDiv(arr){
    var cl=document.getElementById("game1");
    var divs=cl.getElementsByTagName("div");
    for(var i=0;i<arr.length;i++){
        divs[i].style.left=(184*(arr[i]%3))+"px";
        divs[i].style.top=(184*Math.floor(arr[i]/3))+"px";
        divs[i].setAttribute("nowIndex",arr[i]);
        divs[i].setAttribute("canChange","false");
    }
};

//遍历canChange
function checkCanChange(){
    var cl=document.getElementById("game1");
    var divArrys=cl.getElementsByTagName("div");
    //var divArrys=$(".game>div");
    for(var j=0;j<divArrys.length;j++){
        if(divArrys[j].getAttribute("canChange")=="true"){
            return true;
        }
    }
    return false;
}

function getAttributeCanChange(){
    var cl=document.getElementById("game1");
    var divs=cl.getElementsByTagName("div");
    for(var i=0;i<divs.length;i++){
        if(divs[i].getAttribute("canchange")=="true"){
            return divs[i];
        }
    }
}
//getAttributeCanChange();

function Pythagoras(x1,y1,x2,y2,me){
    var xPrecent=(x1-x2)/20;
    var yPrecent=(y1-y2)/20;
    var i=0;
    var timer=setInterval(function(){
        i++;
        if(i<=20){
            getAttributeCanChange().style.left=x1-i*xPrecent+"px";
            getAttributeCanChange().style.top=y1-i*yPrecent+"px";
            me.style.left=x2+i*xPrecent+"px";
            me.style.top=y2+i*yPrecent+"px";
            canMove=false;

        }else{
            var cc=getAttributeCanChange();
            if(!cc)return;
            var oldIndex=cc.getAttribute("nowindex");
            var nowIndex=me.getAttribute("nowindex");
            me.setAttribute("nowindex",oldIndex);
            cc.setAttribute("nowindex",nowIndex);
            cc.setAttribute("canChange","false");
            me.id= "border2";
            cc.id='';
            canMove=true;
            checkSuccess();
            clearInterval(timer);
            i=0;
        }
    },42);
}
//检查是否运行结束
function checkSuccess(){
    var cl=document.getElementById("game1");
    var resultDiv=cl.getElementsByTagName("div");
    //var resultDiv= $(".game>div");
    result=[];
    for(var i=0;i<resultDiv.length;i++){
        result.push(parseFloat(resultDiv[i].getAttribute("nowindex")));
    }
    if(result.toString()==successArr.toString()){
        //alert("success");
        document.getElementById("timer-t").setAttribute("canstop","true");
        document.getElementById("lock_mask").innerHTML="";
        setTimeout(function(){
        	window.location.href='success';
        },2000);
        
        //调用运行成功后的页面跳转
    }
}
function commentFunc(index){
    var cl=document.getElementById("game1");
    var nowIndexDiv=cl.getElementsByTagName("div");
    // var nowIndexDiv=$(".game>div");
    for(var i=0;i<nowIndexDiv.length;i++ ){
        if(nowIndexDiv[i].getAttribute("nowindex")==index){
            return nowIndexDiv[i];
        }
    }
}
function enterFunc(){
    var startGame=document.getElementById("startGame");
    var canstart=startGame.getAttribute("canstart");
    if(canstart=="true"){
        if(!document.getElementById("border2"))return;
        var index=document.getElementById("border2").getAttribute("nowindex");
        var borderId=document.getElementById("border");
        if(borderId){
            var oldLeft=parseFloat(getAttributeCanChange().style.left);
            var oldTop=parseFloat(getAttributeCanChange().style.top);
            var nowLeft=parseFloat(commentFunc(index).style.left);
            var nowTop=parseFloat(commentFunc(index).style.top);
            var me=commentFunc(index);
            //添加移动效果
            if(canMove){
                Pythagoras(oldLeft,oldTop,nowLeft,nowTop,me);
            }
        }else{
            commentFunc(index).id="border";
            commentFunc(index).setAttribute("canChange","true");
        }
    }else{
        //startGame.style.border="none";
        startGame.setAttribute("canstart","true");
        RandomArry();
        document.getElementById("game1").getElementsByTagName("div")[0].id="border2";
        canLoopTime=true;
        var btnRed=document.getElementById("startGame");
        btnRed.innerHTML="<img src='image/starGame/btnStart1.png' alt=''/>";
        document.getElementById("btnStartborder").style.visibility="hidden";
        document.getElementById("timer-t").style.visibility="visible";
        //timer();
    }
}

//向左
function MoveLeft(){

    var index=0;
    if(document.getElementById("border2")){
        index=document.getElementById("border2").getAttribute("nowindex");
    }else{
        index=document.getElementById("border").getAttribute("nowindex");
    }
    if(index%3>0){
        if( document.getElementById("border2")){
            document.getElementById("border2").id='';
        }
        index--;
        if(commentFunc(index).id!="border"){
            commentFunc(index).id="border2";
        }else{
            commentFunc(index).id="border";
        }
    }
}
function MoveRight(){
    var index=0;
    if(document.getElementById("border2")){
        index=document.getElementById("border2").getAttribute("nowindex");
    }else{
        index=document.getElementById("border").getAttribute("nowindex");
    }
    if(index%3<2){
        if( document.getElementById("border2")){
            document.getElementById("border2").id='';
        }
        index++;
        if(commentFunc(index).id!="border"){
            commentFunc(index).id="border2";
        }else{
            commentFunc(index).id="border";
        }
    }
}
function moveDown(){
    var index=0;
    if(document.getElementById("border2")){
        index=document.getElementById("border2").getAttribute("nowindex");
    }else{
        index=document.getElementById("border").getAttribute("nowindex");
    }
    if(Math.floor(index/3)<2){
        if( document.getElementById("border2")){
            document.getElementById("border2").id='';
        }
        index/=1;
        index+=3;
        if(commentFunc(index).id!="border"){
            commentFunc(index).id="border2";
        }else{
            commentFunc(index).id="border";
        }
    }
}
function moveUp(){
    var index=0;
    if(document.getElementById("border2")){
        index=document.getElementById("border2").getAttribute("nowindex");
    }else{
        index=document.getElementById("border").getAttribute("nowindex");
    }
    if(Math.floor(index/3)>0){
        if( document.getElementById("border2")){
            document.getElementById("border2").id='';
        }
        index-=3;
        if(commentFunc(index).id!="border"){
            commentFunc(index).id="border2";
        }else{
            commentFunc(index).id="border";
        }
    }
}
//enter 键盘事件
//时间定时器