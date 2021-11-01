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
// import addModelForm from "./addModelForm";
import addSpecialForm from "./addSpecialForm";

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
    addSpecialForm
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
    eventBus.$on("addSpecial", () => {
      this.actionType.action = "add";
      this.actionType.modelData = [];
      this.currentTabComponent = "addSpecialForm";
    });
    eventBus.$on("editSpecial", v => {
      this.actionType.action = "edit";
      this.actionType.modelData = v;
      this.currentTabComponent = "addSpecialForm";
    });
    eventBus.$on("modelList", () => {
      this.currentTabComponent = "modelIndex";
    });
  },
  destroyed() {
    eventBus.$off(["addSpecial", "editSpecial", "modelList"]);
  },
  methods: {}
};
</script>

<style scoped>
</style>
