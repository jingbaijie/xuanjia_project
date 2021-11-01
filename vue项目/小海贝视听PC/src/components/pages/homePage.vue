<!--
 * @Author: your name
 * @Date: 2021-09-06 10:22:15
 * @LastEditTime: 2021-09-08 11:24:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \tvjoy-web\src\components\pages\homePage.vue
-->
<template>
 <div class='pageContent'>
    <login :isLogin='isLoginShow' @closeLogin='closeLogin'></login>
    <div class="headBar" style="z-index:1;">
      <headerBar @headerclick='loginClick'></headerBar>
    </div>
    <div class = "mainContent" style='z-index:0;'>
      <router-view></router-view>
    </div>
    <div class="footerBar">
      <footerBot></footerBot>
    </div>
  </div>
</template>
<script>
import headerBar from '../header/header'
import footerBot from '../footer/footer'
import login from '@/components/common/login.vue'
export default {
  name: 'homePage',
  components: {
    headerBar: headerBar,
    footerBot: footerBot,
    login
  },
  data () {
    return {
      isLoginShow:false
    }
  },
  methods: {
    loginClick(){
      this.isLoginShow=true;
    },
    closeLogin(){
      this.isLoginShow=false;
    }
  },
  created () {
    this.$router.push('./mainPage')
  }
}
</script>
<style>
  .pageContent{
    width: 1920px;
  }
  .pageContent .headBar{
    width: 1920px;
    height: 80px;
    color: #333;
    text-align: center;
    padding: 0;
    box-shadow: 0px 3px 7px 0px #DADADA;
    background: #FFFFFF;
  }
  /* container容器 */
  .pageContent .footerBar{
    width: 1920px;
    height: 201px;
    color: #333;
    text-align: center;
    line-height: 80px;
    padding: 0;
    background: #F8F8F8;
    margin-top: 37px;
  }
  .pageContent .mainContent{
    width: 100vw;
    padding: 0;
    overflow: inherit;
  }
</style>
