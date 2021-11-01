<template>
  <div>
    <transition name="fade-transform" mode="out-in">
      <keep-alive include="modelIndex">
        <component :is="currentTabComponent"></component>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
import { eventBus } from "@/common/eventBus";
import modelIndex from "./issueList";
// import addModelForm from "./addModelForm";
import addIssueForm from "./addIssueForm";

export default {
  name: "specialParent",
  data() {
    return {
      actionType: {
        modelData: "",
        action: ""
      },
      currentTabComponent: "modelIndex"
    };
  },
  components: {
    modelIndex,
    // addModelForm,
    addIssueForm
  },
  provide() {
    return {
      setModel: value => (this.actionType = value),
      getModel: () => {
        return this.actionType;
      }
    };
  },
  mounted() {
    eventBus.$on("addIssue", () => {
      this.actionType.action = "add";
      this.actionType.modelData = [];
      this.currentTabComponent = "addIssueForm";
    });
    eventBus.$on("editIssue", v => {
      this.actionType.action = "edit";
      this.actionType.modelData = v;
      this.currentTabComponent = "addIssueForm";
    });
    eventBus.$on("issueList", () => {
      this.currentTabComponent = "modelIndex";
    });
  },
  destroyed() {
    eventBus.$off(["addIssue", "editIssue", "issueList"]);
  },
  methods: {}
};
</script>

<style scoped>
</style>
