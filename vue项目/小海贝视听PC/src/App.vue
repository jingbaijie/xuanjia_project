<!--
 * @Author: your name
 * @Date: 2021-08-31 14:00:45
 * @LastEditTime: 2021-09-02 11:11:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \tvjoy-web\src\App.vue
-->
<template>
  <div id="app">
    <router-view v-if="isShow" />
  </div>
</template>

<script>
export default {
  name: 'App',
  provide(){
    return {
      reload: this.reload
    }
  },
  data() {
    return{
      isShow: true
    }
  },
  methods: {
    reload(){
      this.isShow = false;
      this.$nextTick(function(){
        this.isShow = true;
      })
    }
  },
  created(){
    let haveJiZhu =  localStorage.getItem('alljz');
    if(haveJiZhu && (haveJiZhu+'').indexOf('{') > -1){
      let saveUserInfo = sessionStorage.getItem('userInfo');
      if(saveUserInfo && (saveUserInfo+'').indexOf('{') > -1){
        saveUserInfo = JSON.parse(saveUserInfo);
        this.$store.commit('noLoginSetState',{userId: saveUserInfo.id,});
      }
    }
  }
}
</script>
  
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  /* margin-top: 60px; */
}
*{
  list-style: none;
  border: 0;
  /* line-height: 0; */
}
body{
  margin: 0;
  box-sizing: border-box;
}
</style>
