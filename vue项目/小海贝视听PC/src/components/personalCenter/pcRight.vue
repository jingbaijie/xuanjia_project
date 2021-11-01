<!--
 * @Author: your name
 * @Date: 2021-08-31 14:10:28
 * @LastEditTime: 2021-09-15 11:35:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \tvjoy-web\src\components\personalCenter\pcRight.vue
-->
<template>
    <div>
        <div class="pcCard">
            <img class="cardTop" src="@/assets/images/personCenter/pcrHead.png" alt="">
            <div class='userInfo'>
                <img class="userHeader" :src="userInfo.headerImg" alt="">
                <p class="userName">{{userInfo.name}}</p>
            </div>
            <div class="function">
                <div class="functionBtn" :class="{'activeFun':isActive==1?true:false}" @click="changeFun(1)">
                    <img class="pcIcon" src="@/assets/images/personCenter/video.png" alt="">
                    <span>播放记录</span>
                </div>
                <div class="functionBtn" :class="{'activeFun':isActive==2?true:false}" @click="changeFun(2)">
                    <img class="pcIcon" src="@/assets/images/personCenter/setting.png" alt="">
                    <span>个人设置</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name:'pcRight',
        data(){
            return {
                // isActive:1,
            }
        },
        props:['isActive'],
        inject:['userInfo'],
        watch: {
            userInfo(newValue, oldValue) {
                this.userInfo=newValue;
            },
            // isActive(newValue, oldValue){
            //     this.isActive=newValue
            // }
        },
        methods:{
            changeFun(num){
                // this.isActive=num;
                this.$emit('changeType',num);
            }
        },
    }
    
</script>

<style scoped>
.pcCard{
    /* width: 320px; */
    height: 670px;
    position: relative;
    background-color: #F8F8F8;
}
.cardTop{
    width: 100%;
}
.userInfo{
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    text-align: center;
}
.userHeader{
    margin-top: 41px;
    width: 90px;
    height: 90px;
    border-radius: 50%;
}
.userName{
    font-size: 18px;
    color: #333;
    line-height: 18px;
}
.function{
    width: 100%;
}
.functionBtn{
    width: 100%;
    height: 63px;
    text-align: center;
    line-height: 63px;
    font-size: 16px;
    border-bottom: solid 1px #E2E2E2;
    color: #333333;
    box-sizing: border-box;
    cursor: pointer;
}
.functionBtn img{
    float: left;
    margin-top: 21px;
    margin-left: 30px;
}
.functionBtn span{
    float: left;
    line-height: 63px;
    margin-left: 13px;
}
.activeFun{
    border-right: solid 3px #26C3DD;
}
.pcIcon{
    width: 20px;
    height: 20px;
}
</style>