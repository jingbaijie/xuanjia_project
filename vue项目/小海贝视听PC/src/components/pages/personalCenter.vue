<!--
 * @Author: your name
 * @Date: 2021-08-31 14:00:45
 * @LastEditTime: 2021-09-15 11:30:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \tvjoy-web\src\components\pages\personalCenter.vue
-->
<template>
  <div class="bg">
    <pc-right
      class="pcright"
      @changeType="changeType"
      :isActive='curClickBtn' 
    ></pc-right>
    <component class="comp" :userInfo="userInfo" :is="currentView"></component>
  </div>
</template>
<script>
import pcRight from '@/components/personalCenter/pcRight.vue';
import userInfo from '@/components/personalCenter/userInfo.vue';
import playHistory from '@/components/personalCenter/playHistory.vue';
export default{
  name: 'personalCenter',
  components: {
    pcRight,
    userInfo,
    playHistory
  },
  data () {
    return {
      curClickBtn:1,
      currentView:'playHistory',
      userInfo:{}
    }
  },
  provide(){
    this.userInfo=this.$store.state.userInfo;
    // console.log(this.userInfo);
    return {
      userInfo:this.userInfo
    }
  },
  methods: {
    changeType(num){
      this.curClickBtn=num;
      if(num==2){
        this.currentView='userInfo'
      }else{
        this.currentView='playHistory'
      }
    },
  },
  created(){
    var isLogin=sessionStorage.getItem('isLogin');
    if(isLogin=='false'){

    }else{
      this.$router.replace({name:'mainPage'})
    }
  },
  mounted(){
    if(this.$route.params!={}&&this.$route.params.comp){
      this.currentView=this.$route.params.comp;
      if(this.currentView=='userInfo'){
        this.curClickBtn=2
      }else{
        this.curClickBtn=1
      };
    }
    
  }
}
</script>
<style scoped>
.bg {
  height: 760px;
  background: url("../../assets/images/personCenter/BJ.jpg");
  overflow: hidden;
  background-size: 100%,100%;
  background-repeat: no-repeat;
}
.pcright {
  margin-left: 7.5%;
  float: left;
  width: 17%;
  margin-top: 40px;
}
.comp {
  float: left;
  margin-left: 38px;
  margin-top: 40px;
}
</style>
