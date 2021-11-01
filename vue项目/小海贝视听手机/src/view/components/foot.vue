<template>
    <!--底部-->
    <div class="foot">
        <!--<div class="foot-nav">
            <div @click="toXjkid('http://www.xjkid.cn')">公司介绍 </div>
            <div class="foot-nav-split"></div>
            <div  @click="toXjkid('http://www.xjkid.cn')">新闻动态 </div>
            <div class="foot-nav-split"></div>
            <div  @click="toXjkid('http://www.xjkid.cn')">联系方式 </div>
            <div class="foot-nav-split"></div>
            <div  @click="toXjkid('http://www.xjkid.cn')">社会招聘 </div>
            <div class="foot-nav-split"></div>
            <div  @click="toXjkid('http://www.xjkid.cn')">内容合作 </div>

        </div>
        <div class="foot-nav">
            <div  @click="toXjkid('http://www.xjkid.cn')">帮助与反馈</div>
            <div class="foot-nav-split"></div>
            <div  @click="toXjkid('http://www.xjkid.cn')">侵权举报与投诉 </div>
        </div>
       -->
        <div class="foot-title">
            南京炫佳网络科技有限公司 版权所有
            <span class="foot-title-link" @click="toXjkid('https://beian.miit.gov.cn/')">
                苏ICP备14000009号-1
            </span>
        </div>
        <div class="foot-sww">
            <template>
                <van-image class="foot-title-logo" :src="require('./../../images/wlwhjydw.jpg')"/>
            </template>
            苏网文【2016】3402-074号
        </div>
        <div class="foot-titles">
            Copyright 2021 小海贝 All Rights Reserved
        </div>
    </div>

</template>

<script>
    export default {
        name: "foot",
        methods:{
            toXjkid(url){
                window.location.href = url;
            }

        }
    }
</script>

<style lang="less">
    /*底部*/

    .foot{
        width: 750px;
        height: 160px;
        background-color: #F8FFFFFF;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        padding-top: 35px;
        &-nav{
             width: 658px;
             font-size: 20px;
             font-weight: 400;
             color: #111111;
             display: flex;
             justify-content: space-around;
             align-items: center;
            &-split{
                width: 1px;
                height: 20px;
                border-right: 1px solid #111111;
            }
         }
        &-title{
             width: 700px;
             font-size: 20px;
             font-weight: 400;
             color: #999999;
            text-align: center;
            line-height: 40px;
            &-logo{
                width: 40px;
                height: 40px;
            }
            &-link{
                color: #333333;
            }
         }
        &-titles{
            width: 750px;
            height: 80px;
            color: #999999;
            font-size: 20px;
            text-align: center;
        }
        &-sww{
            width: 700px;
            font-size: 20px;
            font-weight: 400;
            color: #999999;
            text-align: center;
            line-height: 40px;
            display: flex;
            justify-content: center;
        }
    }

</style>