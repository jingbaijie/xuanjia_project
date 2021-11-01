<template>
  <el-popover placement="top" width="170" trigger="click">
    <el-button
      :style="{'float':'right','margin':'0 10px 0 0'}"
      size="mini"
      type="info"
      plain
      @click="batchIsFree(0)"
    >免费</el-button>
    <el-button
      :style="{'float':'right','margin':'0 10px 0 0'}"
      size="mini"
      type="primary"
      plain
      @click="batchIsFree(1)"
    >收费</el-button>
    <el-button
      slot="reference"
      :style="{'float':'right','margin':'0 10px 0 0'}"
      size="mini"
      type="primary"
      plain
    >批量免费</el-button>
  </el-popover>
</template>

<script>
import { scrollTo } from "@/utils/scroll-to";
export default {
  name: "Pagination",
  methods: {
    batchIsFree(action) {
      this.$confirm("确定全部修改吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$emit("batchIsFree", action);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    }
  }
};
</script>

