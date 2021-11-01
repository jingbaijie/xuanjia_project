<template>
  <div class = "footerContent">
    <!-- <el-row>
      <el-col :span="24">
        <a class = "footerLink" target="blank" :href="jumpToOfficeUrl">公司介绍</a>
        <a class = "footerLink" target="blank" :href="jumpToOfficeUrl">新闻动态</a>
        <a class = "footerLink" target="blank" :href="jumpToOfficeUrl">联系方式</a>
        <a class = "footerLink" target="blank" :href="jumpToOfficeUrl">社会招聘</a>
        <a class = "footerLink" target="blank" :href="jumpToOfficeUrl">内容合作</a>
        <a class = "footerLink" target="blank" :href="jumpToOfficeUrl">帮助与反馈</a>
        <a class = "footerLink" target="blank" :href="jumpToOfficeUrl">侵权举报与投诉</a>
      </el-col>
    </el-row> -->
    <el-row>
      <el-col :span="24">
        <div class = "footerLine"></div>
      </el-col>
    </el-row>
    <el-row class="footerCompany">
      <el-col :span="24">
        <div class = "footerText">南京炫佳网络科技有限公司 版权所有 <span @click="jumpToOther()" class="suBei">苏ICP备14000009号-1</span></div>
        <div class = "footerText"><img class="footerBan" src="../../assets/images/footer/banquan.jpg" alt=""><span class="footerBanText">苏网文【2016】3402-074号</span></div>
        <div class = "footerText"><span class="jumpToJianGuang" @click="jumpToJianGuang()">江苏省网络视听违规节目举报窗口</span><span>2021 小海贝 All Rights Reserved</span></div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default{
  name: 'footerBot',
  components: {},
  data () {
    return {
      jumpToOfficeUrl: 'http://www.xjkid.cn'
    }
  },
  methods: {
    jumpToOther(){
      window.location.href = 'https://beian.miit.gov.cn/';
    },
    jumpToJianGuang(){
      window.location.href = 'https://221.226.219.130:80/login';
    }
  }
}
</script>
<style>
  .footerContent{
    height: 1920px;
    height: 201px;
    font-size: 16px;
    color: #111111;
    font-family: Source Han Sans CN;
  }
  .footerContent .el-row:nth-child(1){
    width: 1920px;
    height: 2px;
  }
  .footerContent .el-row:nth-child(2){
    width: 1920px;
    height: 24px;
    color: #999999;
    font-size: 14px;
  }
  .footerContent .footerLink{
    width: 118px;
    height: 16px;
    line-height: 16px;
    font-weight: 400;
    display: inline-block;
    color: #111111;
    text-decoration: none;
    border-right: 1px solid;
  }
  .footerContent .footerLink:last-child{
    border: none;
  }
  .footerContent .footerLine{
    margin: 0 auto;
    width: 1440px;
    height: 1px;
    border-bottom: #E5E5E5 solid 1px;
  }
  .footerContent .footerCompany{
    margin-top: 32px;
  }
  .footerContent .footerText{
    width: 1920px;
    height: 24px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #999999;
    line-height: 24px;
  }
  .footerContent .footerText .footerBan{
    width: 24px;
    height: 24px;
    float: left;
    margin-left: 855px;
  }
  .footerContent .footerText .footerBanText{
    display: inline-block;
    float: left;
  }
  .footerContent .footerText .suBei{
    color: #333;
  }
  .footerContent .footerText .suBei:hover{
    color: blue;
  }
  .jumpToJianGuang{
    margin-right: 18px;
  }
  .jumpToJianGuang:hover{
    color: blue;
  }
</style>
