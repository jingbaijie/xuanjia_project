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
import modelIndex from "./modelList";
import addModelForm from "./addModelForm";

export default {
  name: "recommModel",
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
    addModelForm,
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
    eventBus.$on("addModel", () => {
      this.actionType.action = "add";
      this.actionType.modelData = [];
      this.currentTabComponent = "addModelForm";
    });
    eventBus.$on("editModel", v => {
      this.actionType.action = "edit";
      this.actionType.modelData = v;
      this.currentTabComponent = "addModelForm";
    });
    eventBus.$on("modelList", () => {
      this.currentTabComponent = "modelIndex";
    });
  },
  destroyed() {
    eventBus.$off(["addModel", "editModel", "modelList"]);
  },
  methods: {}
};
</script>

<style scoped>
</style>
