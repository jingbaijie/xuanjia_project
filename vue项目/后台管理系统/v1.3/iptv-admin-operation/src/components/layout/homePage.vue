<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-04-10 09:54:25
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-04-10 17:37:07
 -->
<template lang='pug'>
  .main
    el-container
      el-header(:style="{height:'50px','width':'100%'}") 
        headerBar
      el-container
        el-aside(width="auto" :style="{'padding-top':'11px'}") 
          navBar
        el-main(:style="{padding:'11px 11px','min-width':'1200px'}" id='area')
          router-view
</template>

<script>
import side from "./navBar";
import header from "./headerBar";

export default {
  name: "mainPage",
  data() {
    return {
      msg: "this is Home page"
    };
  },
  created(){
    this.$router.push('/masterPage');
  },
  methods: {
  },
  components: {
    navBar: side,
    headerBar: header
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main {
  width: 100%;
}
</style>
