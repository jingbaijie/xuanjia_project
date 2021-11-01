<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-04-10 09:54:25
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-04-10 12:18:40
 -->
<template>
  <div>
    <transition name="fade-transform" mode="out-in">
      <keep-alive include="templateList">
        <component :is="currentTabComponent"></component>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
import { eventBus } from "@/common/eventBus";
import createFrame from "./createFrame";
import templateList from "./templateList";
export default {
  name: "specialParent",
  inject: ["getMenuId"],
  data() {
    return {
      loading: true,
      actionType: {
        contentId: "",
        action: ""
      },
      curimg:
        "https://ss1.bdstatic.com/5eN1bjq8AAUYm2zgoY3K/r/www/cache/static/protocol/https/home/img/qrcode/zbios_efde696.png",
      imgData: [],
      tabView: "",
      currentTabComponent: "templateList",
      editableTabsValue: "0",
      editableTabs: [],
      tabIndex: 0,
      already: false,
      menuId: this.getMenuId(),
      testD: "1"
    };
  },
  provide() {
    return {
      setA: value => (this.testD = value),
      getA: () => {
        return this.testD;
      },
      setContentId: value => (this.actionType = value),
      getContentId: () => {
        return this.actionType;
      }
    };
  },
  computed: {},
  watch: {
    $route: function(x, a) {}
  },

  created() {},
  mounted() {
    eventBus.$on("createFrame", v => {
      this.tabView = "createFrame";
      this.actionType.action = "new";
      this.currentTabComponent = "createFrame";
    });
    eventBus.$on("editFrame", v => {
      this.actionType.action = "edit";
      this.actionType.contentId = v;
      this.currentTabComponent = "createFrame";
    });
    eventBus.$on("templateList", v => {
      this.currentTabComponent = "templateList";
    });
  },
  components: {
    createFrame,
    templateList
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
