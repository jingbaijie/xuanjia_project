<template>
  <div>
    <transition name="fade-transform" mode="out-in">
      <keep-alive include="allThemeManage">
        <component :is="currentTabComponent"></component>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
import { eventBus } from "@/common/eventBus";
import allThemeManage from "./allThemeManage";
import pageManage from "../page/pageManage";

export default {
  name: "themeParent",
  data() {
    return {
      actionType: {
        themeId: "",
        action: ""
      },
      currentTabComponent: "allThemeManage",
    };
  },
  components: {
    allThemeManage,
    pageManage
  },
  provide() {
    return {
      setThemeId: value => (this.actionType = value),
      getThemeId: () => {
        return this.actionType;
      }
    };
  },
  mounted() {
    eventBus.$on("createPage", () => {
      this.actionType.action = "add";
      this.currentTabComponent = "pageManage";
    });
    eventBus.$on("editPage", v => {
      this.actionType.action = "edit";
      this.actionType.themeId = v;
      this.currentTabComponent = "pageManage";
    });
    eventBus.$on("allThemeManage", ()=>{
      this.currentTabComponent = "allThemeManage";
    });
  },
  destroyed() {
    eventBus.$off(["createPage", "editPage", "allThemeManage"]);
  },
  methods: {}
};
</script>

<style scoped>
</style>
