<template v-dialogDrag>
  <div>
    <transition name="fade-transform" mode="out-in">
      <keep-alive>
        <component :is="$store.state.isComponent"></component>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
import addDevice from "./components/addDevice";
import upgrade from "./components/upgrade";
import { eventBus } from "@/common/eventBus";
export default {
  components: {
    addDevice,
    upgrade
  },
  data() {
    return {
      isComponent: "upgrade",
      /** 表格 */
      tableData: []
    };
  },
  created() {
    eventBus.$on("startVersion", () => {
      this.isShowModal = true;
    });
  },
  methods: {
    handleDelete() {}
  }
};
</script>

<style lang="scss" scoped>
.el-row {
  margin: 0 0 20px 0;
}
.dialog {
  /deep/ .el-dialog {
    min-height: 400px;
  }
}
</style>
