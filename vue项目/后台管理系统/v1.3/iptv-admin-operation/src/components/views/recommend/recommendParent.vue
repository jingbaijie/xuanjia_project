<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-04-10 09:54:25
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-04-10 12:19:52
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
  name: "recommendParent",
  inject: ["getMenuId"],
  data() {
    return {
      abc: "",
      loading: true,
      actionType: {
        contentId: "",
        action: ""
      },
      curimg:
        "https://ss1.bdstatic.com/5eN1bjq8AAUYm2zgoY3K/r/www/cache/static/protocol/https/home/img/qrcode/zbios_efde696.png",
      imgData: [],
      currentTabComponent: "templateList",
      editableTabsValue: "0",
      editableTabs: [],
      tabIndex: 0,
      already: false,
      menuId: this.getMenuId(),
      testD: "1"
    };
  },
  components: {
    createFrame,
    templateList
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
  mounted() {
    eventBus.$on("createFrame2", v => {
      this.actionType.action = "new";
      this.currentTabComponent = "createFrame";
    });
    eventBus.$on("editFrame2", v => {
      this.actionType.action = "edit";
      this.actionType.contentId = v;
      this.currentTabComponent = "createFrame";
    });
    eventBus.$on("templateList2", v => {
      this.currentTabComponent = "templateList";
    });
  },
  destroyed() {
    eventBus.$off(["createFrame2", "editFrame2", "templateList2"]);
  },
  methods: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
