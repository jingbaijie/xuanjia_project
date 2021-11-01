<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-02-18 17:38:39
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-02-19 17:35:27
 -->

<template>
  <el-table
    v-loading="loading"
    :data="deviceData"
    style="width: 100%"
    ref="multipleTable"
    :height="tableHeight"
  >
    <el-table-column prop="id" label="设备ID"></el-table-column>
    <el-table-column prop="sn_num" label="SN-编号"></el-table-column>
    <el-table-column prop="factory_cname" label="厂商名称"></el-table-column>
    <el-table-column prop="user_id" label="用户编号"></el-table-column>
    <el-table-column prop="production_date" label="生产日期"></el-table-column>
    <el-table-column prop="system_version" label="盒子类型"></el-table-column>
    <el-table-column prop="repair_time" label="维修时间"></el-table-column>
    <el-table-column prop="repair_reason" label="备注"></el-table-column>
    <el-table-column prop="device_username" label="操作人"></el-table-column>
  </el-table>
</template>

<script>
import { Message, Loading } from "element-ui";

export default {
  name: "firmware",
  data() {
    return {
      showVlaue: { "0": "禁用", "1": "启用" },
      deviceData: [],
      loading: true,
      tableHeight: undefined
    };
  },
  props: ["update_type", "device_id"],
  created() {
    this.getDataList();
  },
  mounted() {
    if (this.isAuth("system:user:list")) {
      this.tableHeight =
        window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 200;
    }
  },
  methods: {
    refresh(){
      this.getDataList();
    },
    /**
     * getDataList  获取固件升级软件升级信息
     * device_id    设备id
     * update_type  升级类型0表示硬件部分升级1表示软件部分升级2表示硬件全部升级3表示软件全部升级（o）
     */
    getDataList() {
      this.$store
        .dispatch("axios_query_repairList", {
          device_id: this.device_id
        })
        .then(res => {
          if (res && res != "undefined" && res.data.data) {
            this.deviceData = res.data.data;
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    }
  }
};
</script>

<style scoped>
.btn_area {
  height: 8vh;
  padding: 15px 10px 10px 5px;
}
.add_btn {
  margin: 10px 0 0 10px;
  width: 100%;
  min-width: 950px;
  float: left;
}

.el-input--mini .el-input__inner {
  width: 100px;
}
</style>
