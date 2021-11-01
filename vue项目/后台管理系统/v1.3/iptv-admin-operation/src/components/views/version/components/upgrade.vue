<template>
  <div>
    <el-page-header @back="goBack" content="升级计划"> </el-page-header>
    <el-row type="flex" justify="end">
      <el-button size="mini" type="primary" @click="addDevice"
        >添加设备</el-button
      >
      <el-button size="mini" type="primary">导入设备</el-button>
    </el-row>
    <el-row>
      <el-table :data="$store.state.upgradeTable" :max-height="410">
        <el-table-column prop="id" label="设备ID"></el-table-column>
        <el-table-column prop="sn_num" label="SN-编号"></el-table-column>
        <el-table-column
          prop="factory_cname"
          label="厂商名称"
        ></el-table-column>
        <el-table-column
          prop="firmware_version"
          label="硬件版本"
        ></el-table-column>
        <el-table-column
          prop="software_version"
          label="软件版本"
        ></el-table-column>
        <el-table-column
          prop="system_version"
          label="盒子类型"
        ></el-table-column>
        <el-table-column prop="midVersion" label="在线状态"></el-table-column>
        <el-table-column prop="operation" label="操作">
          <template v-slot="scope">
            <el-button
              plain
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index)"
              >移除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row type="flex" justify="end">
      <el-button size="mini" type="primary" @click="confirmUpdate"
        >升级</el-button
      >
    </el-row>
  </div>
</template>

<script>
import { eventBus } from "@/common/eventBus";
export default {
  name: "addDevice",
  data() {
    return {};
  },
  created() {

  },
  methods: {
    // 升级
    confirmUpdate() {
      if (this.$store.state.upgradeTable.length < 1) {
        this.$message("请先添加设备");
        return;
      }
      let device_ids = "";
      this.$store.state.upgradeTable.forEach((item, i) => {
        if (i == 0) {
          device_ids += item.id;
        } else {
          device_ids += "_" + item.id;
        }
      });
      let params = {
        device_ids: device_ids,
        update_type: this.$route.params.updateType,
        version_id: this.$route.params.id
      };
      // //console.log("升级-----",params);
      this.$store
        .dispatch("axios_add_apkUpdateInfo", params)
        .then(res => {
          if (res.data.errorCode == "1000") {
            this.$message.success("添加升级计划成功!");
            // 改变状态接口 如果未改变状态调用此方法
            if (this.$route.params.isActive == 0) {
              this.$store
                .dispatch("axios_update_updateIsActive", {
                  id: this.$route.params.id
                })
                .then(res => {})
                .catch(err => {});
            }
            this.goBack();
          } else {
            this.$message.error("添加升级计划失败!");
          }
        })
        .catch(err => {
          this.$message.error("添加升级计划失败!");
        });
    },
    /** 表格 */
    // 删除
    handleDelete(index) {
      this.$store.state.upgradeTable.splice(index, 1);
    },
    /** 跳转 */
    // 跳转添加设备
    addDevice() {
      eventBus.$emit("initAddDevice");
      this.$store.state.isComponent = "addDevice";
    },
    // 返回
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss" scoped>
.el-row {
  margin: 0 0 20px 0;
}
</style>
