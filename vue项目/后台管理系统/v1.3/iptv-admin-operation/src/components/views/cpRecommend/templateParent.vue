<template>
  <div>
    <transition name="fade-transform" mode="out-in">
      <component :is="currentTabComponent"></component>
    </transition>
  </div>
</template>

<script>
import { eventBus } from "@/common/eventBus";
import createFrame from "./createFrame";
import templateList from "./templateList";

export default {
  name: "templateParent2",
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

  created() {},
  mounted() {
    eventBus.$on("createFrame3", v => {
      this.actionType.action = "new";
      this.currentTabComponent = "createFrame";
    });
    eventBus.$on("editFrame3", v => {
      this.actionType.action = "edit";
      this.actionType.contentId = v;
      this.currentTabComponent = "createFrame";
    });
    eventBus.$on("templateList3", v => {
      this.currentTabComponent = "templateList";
    });
  },
  destroyed() {
    eventBus.$off(['createFrame3','editFrame3','templateList3']);
  },
  methods: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
