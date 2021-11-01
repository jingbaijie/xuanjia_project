<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-04-10 09:54:25
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-06-16 12:00:31
 * 缓存路由
 -->
<template>
  <div class="master_tabs">
    <transition name="fade-transform" mode="out-in">
      <!-- <keep-alive :include="cachedViews"> -->
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
import { eventBus } from "@/common/eventBus";
import routers from "@/router/routers";
export default {
  name: "keepPage",
  data() {
    return {
    };
  },
  watch: {
  },
  computed: {
    cachedViews() {
      return this.$store.state.cachedViews;
    }
  },
  created() {
    
  },
  mounted() {
    
  },
  deactivated() {
    this.$destroy(true);//销毁
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.master_tabs {
  width: 98%;
  max-height: 85vh;
  margin-top: 20px;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
