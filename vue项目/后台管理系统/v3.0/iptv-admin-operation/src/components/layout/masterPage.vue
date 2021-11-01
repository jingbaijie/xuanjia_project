<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-04-10 09:54:25
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-06-16 12:00:31
 * 备份
 -->
<template>
  <div class="master_tabs">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
import { eventBus } from "@/common/eventBus";
import routers from "@/router/routers";
export default {
  name: "masterPage",
  data() {
    return {
      imgData: [],
      tabView: "",
      already: false,
      menuId: "",
      testD: "1",
      cacheMenuArr: []
    };
  },
  provide() {
    return {
      setMenuId: value => (this.menuId = value),
      getMenuId: () => {
        return this.menuId;
      }
    };
  },
  watch: {
    $route() {
      // 监听需缓存路由组件
      if (this.$route.meta.cache) {
        this.$store.commit("add_cached_view", this.$route.name);
      }
    }
  },
  computed: {
    cachedViews() { 
      return this.$store.state.cachedViews;
    }
  },
  created() {
    this.cacheMenuArr = JSON.parse(sessionStorage.getItem("cacheMenuArr"));
    if (this.cacheMenuArr && this.cacheMenuArr.length > 0) {
      if (
        JSON.stringify(routers).indexOf(
          JSON.parse(sessionStorage.getItem("cacheTabView"))
        ) == -1
      ) {
        this.$router.push("/indexPage");
      } else {
        this.$router.push(
          "/" + JSON.parse(sessionStorage.getItem("cacheTabView"))
        );
      }
    } else {
      this.$router.push("/indexPage");
    }
  },
  mounted() {
    eventBus.$on("showView", tab => {
      this.menuId = tab.menuId;
      this.$router.push(tab.view);
    
    });
  },
  destroyed() {
    eventBus.$off(["showView"]);
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
