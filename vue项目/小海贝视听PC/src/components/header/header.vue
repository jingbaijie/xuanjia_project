<template>
  <div class = 'headerContent'>
    <el-row>
      <el-col :span="24">
        <img @click="backMain()" class = 'logoPng' src = '../../assets/images/header/logo.png' alt="">
        <div class = "homeCon" @click="backMain()">
          <img class = "homePic" src="../../assets/images/header/main.png" alt="">
          <span class = "homeText">首页</span>
        </div>
        <div class="searchCon">
          <div class="searchBorder">
            <input class="searchInput" v-model="searchValue" type="text" placeholder="" @keyup.enter='handlerQuery'>
            <div class="searchSub">
              <img @click="handlerQuery" src="../../assets/images/header/search.png" alt="">
              <span @click="handlerQuery" >搜索</span>
            </div>
            <div class="searchHot" @click="jumpToHot()">
              <img src="../../assets/images/header/hot.png" alt="">
              <span>热搜榜</span>
            </div>
          </div>
        </div>
        <div class = "youngIcon" @click="underAge()">
          <img class = "youngPic" src="../../assets/images/header/young.png" alt="">
          <span class = "youngText">未成年人监护工程</span>
        </div>
        <img class = "historyPic" @click="login('history')" src="../../assets/images/header/history.png" alt="">
        <div @click="login('personal')" class = "loginIcon" v-if="$store.state.isLogin">
          <img class = "loginIconPic" src="../../assets/images/header/notLogin.png" alt="">
          <span class = "loginIconText">登录</span>
        </div>
        <div @click="login('personal')" class = "loginIcon" v-if="!$store.state.isLogin" @mouseenter="showQuit(true)" @mouseleave="showQuit(false)">
          <img  class = "loginIconPic" :src="userInfo.headerImg" alt="">
          <span class = "loginIconText">{{userInfo.name}}</span>
        </div>
        <div class="quitLogin" v-if="quitLoginHover&&!$store.state.isLogin" @mouseenter="showQuit(true)" @mouseleave="showQuit(false)">
          <img class="quitLoginImg" src="../../assets/images/loginOut/outBG.png" alt="">
          <img class="quitLoginIcon" :src="userInfo.headerImg" alt="">
          <div class="quitLoginName">{{userInfo.name}}</div>
          <img class="quitLoginBtn" @click="loginOut()" src="../../assets/images/loginOut/outBtn.png" alt="">
        </div>
    </el-col>
    </el-row>
  </div>
</template>
<script>
export default{
  name: 'headerBar',
  components: {},
  inject: ['reload'],
  data () {
    return {
      quitLoginHover: false,//退出是否显示
      quitLoginHoverTime: null,//退出显示定时器
      showHotList: false,
      hotList: ['热搜一','热搜二','热搜三','热搜四','热搜五','热搜六','热搜七'],
      searchValue:'',
      userInfo:{
        headerImg:'',
        name:'',
      },
      isLoginShow:true,
    }
  },
  methods: {
    handlerQuery(e){
      if(this.searchValue.length > 0){
        this.$router.push({name:'white',params:{searchValue:this.searchValue,type:'search'}});
        this.$store.commit('changeSearchKey',{params:this.searchValue});
      }
    },
    underAge(){
      this.inputClear();
      this.$router.push({name:'underAge'})
    },
    login(type){
      let loginState = sessionStorage.getItem('isLogin');
      if(loginState=='false'){
        if(type&&type=='history'){
          this.$router.push({name:'white',params:{comp:'playHistory',type:'person'}})
        }else{
          this.$router.push({name:'white',params:{comp:'userInfo',type:'person'}})
        }
      }else{
        this.$emit('headerclick')
      }
    },
    loginOut(){
      sessionStorage.setItem('isLogin','true');
      localStorage.setItem('isLogin','true');
      localStorage.setItem('username','');
      localStorage.setItem('alljz','');
      this.$store.commit('changeLogin',true);
      this.$store.commit('loginOut','');
      if(this.$route.name == 'personalCenter'){
        this.backMain();
      }
    },
    showQuit(state){
      var _this = this;
      if(!state){
        _this.quitLoginHoverTime = setTimeout(function(){
          _this.quitLoginHover = state;
        },500);
      }else{
        clearTimeout(this.quitLoginHoverTime)
        this.quitLoginHover = state;
      }
    },
    jumpToHot(){
      this.inputClear();
      this.$router.push({name: 'white',params: {type: "allConToHot"}});
    },
    inputClear(){
      this.searchValue='';
    },
    backMain(){
      if(this.$route.name == 'mainPage'){
       this.reload();
      }else{
        this.inputClear();
        this.$router.push({name:'mainPage'});
      }
    }
  },
  watch: {
    userInfo(newValue, oldValue) {
        this.userInfo=newValue;
    }
  },
  created () {
    this.userInfo=this.$store.state.userInfo;
  },
}
</script>
<style>
  div{
    cursor: pointer;
  }
  .el-row {
    height: 100%;
  }
  
  .loginIcon{
    cursor: pointer;
  }
  .headerContent{
    width: 1920px;
    height: 80px;
    font-size: 16px;
    font-family: Source Han Sans CN;
  }
  .headerContent .el-row{
    padding-left: 145px;
    padding-right: 146px;
  }
  .headerContent .el-row .el-col{
    position: relative;
  }
  .headerContent .youngIcon{
    cursor: pointer;
  }
  .headerContent .logoPng{
    width: 130px;
    height: 62px;
    position: absolute;
    top: 0;
    left: 0;
    margin-top: 10px;
  }
  .headerContent .homeCon{
    width: 57px;
    height: 21px;
    position: absolute;
    top: 0;
    left: 0;
    margin-left: 200px;
  }
  .headerContent .homeCon .homePic{
    float: left;
    margin-top: 30px;
    width: 22px;
    height: 21px;
  }
  .headerContent .homeCon .homePic:hover{
    content: url("../../assets/images/header/mainHover.png");
  }
  .headerContent .homeCon .homeText{
    width: 34px;
    height: 80px;
    margin-top: 4px;
    float: left;
    line-height: 80px;
  }
  .headerContent .homeCon:hover{
    color: #00BBBF;
  }
  .headerContent .searchCon{
    width: 500px;
    height: 40px;
    position: absolute;
    top: 0;
    left: 0;
    margin-left: 565px;
    margin-top: 20px;
    background: #FFFFFF;
  }
  .headerContent .searchCon .searchBorder{
    overflow: hidden;
    height: 40px;
    line-height: 40px;
    border: none;
    border: 1px solid #26C3DD;
    border-radius: 20px;
  }
  .searchCon .searchBorder .searchInput{
    width: 305px;
    height: 40px;
    float: left;
    border-radius: 20px 0 0 20px;
    font-weight: 400;
    color: #999999;
    font-size: 16px;
    text-indent: 15px;
  }
  .searchCon .searchBorder .searchInput:focus {
    outline: none;
  }
  .searchCon .searchBorder .searchHot{
    float: left;
    width: 74px;
    height: 40px;
    font-weight: 400;
    color: #FE5E5B;
  }
  .searchCon .searchBorder .searchSub{
    float: right;
    width: 100px;
    height: 40px;
    background: #26C3DD;
    text-align: center;
  }
  .searchCon .searchBorder span{
    float: left;
    display: inline-block;
    height: 100%;
  }
  .searchCon .searchBorder .searchHot img{
    float: left;
    width: 22px;
    margin-top: 7px;
  }
  .searchCon .searchBorder .searchHot span{
    font-size: 16px;
    font-weight: 400;
    color: #FE5E5B;
  }
  .searchCon .searchBorder .searchSub img{
    float: left;
    width: 20px;
    margin-top: 10px;
    margin-left: 18px;
  }
  .searchCon .searchBorder .searchSub span{
    font-size: 18px;
    font-weight: 400;
    color: #FFFFFF;
  }
  .headerContent .youngIcon{
    margin-top: 0px;
    width: 150px;
    height: 80px;
    line-height: 20px;
    position: absolute;
    top: 0;
    left: 0;
    margin-left: 1316px;
  }
  .headerContent .youngIcon .youngPic{
    float: left;
    margin-top: 33px;
    width: 18px;
    height: 15px;
  }
  .headerContent .youngIcon .youngText{
    display: inline-block;
    margin-top: 31px;
    width: 130px;
    height: 20px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .headerContent .youngIcon:hover{
    color: #00BBBF;
  }
  .historyPic{
    width: 24px;
    height: 24px;
    position: absolute;
    top: 0;
    left: 0;
    margin-top: 28px;
    margin-left: 1495px;
  }
  .loginIcon{
    width: 100px;
    height: 80px;
    position: absolute;
    top: 0;
    left: 0;
    margin-left: 1550px;
  }
  .loginIcon .loginIconPic{
    float: left;
    margin-top: 25px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
  .loginIcon .loginIconText{
    float: left;
    width: 50px;
    height: 80px;
    margin-left: 5px;
    color: #D5D6D9;
    line-height: 80px;
    font-weight: 400;
    font-size: 16px;
    color: #999999;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .historyPic:hover{
    content: url("../../assets/images/header/historyHover.png");
  }
  .youngPic:hover{
    content: url("../../assets/images/header/youngHover.png");
  }
  .headerContent .quitLogin{
    width: 360px;
    height: 340px;
    position: absolute;
    top: 72px;
    left: 1305px;
    z-index: 3;
  }
  .headerContent .quitLogin .quitLoginIcon{
    width: 80px;
    height: 80px;
    position: absolute;
    top: 24px;
    left: 140px;
  }
  .headerContent .quitLogin .quitLoginImg{
    width: 360px;
    height: 340px;
  }
  .headerContent .quitLogin .quitLoginName{
    width: 360px;
    height: 20px;
    position: absolute;
    top: 120px;
    left: 0;
    line-height: 20px;
    font-weight: 400;
    color: #333333;
    text-align: center;
  }
  .headerContent .quitLogin .quitLoginBtn{
    width: 150px;
    height: 46px;
    position: absolute;
    top: 191px;
    left: 115px;
  }
</style>
