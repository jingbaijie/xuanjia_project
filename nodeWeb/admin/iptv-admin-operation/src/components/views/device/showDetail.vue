<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-02-19 17:47:30
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-02-28 16:55:23
 -->
<template>
  <div>
    <el-dialog
      v-dialogDrag
      title="当前设备"
      :visible.sync="centerDialogVisible"
      width="80%"
      center
    >
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="基本信息" name="first">
          <div :style="{'width':'600px','margin':'0 auto'}">
          <el-form label-position="left" inline>
            <el-form-item label="项目"  :label-width="formLabelWidth">
              <span>{{ "说明" }}</span>
            </el-form-item>
            <el-form-item label="设备ID" :label-width="formLabelWidth">
              <span>{{ deviceDetail.id }}</span>
            </el-form-item>
            <el-form-item label="SN-编号" :label-width="formLabelWidth">
              <span>{{ deviceDetail.sn_num }}</span>
            </el-form-item>
            <el-form-item label="厂商名称" :label-width="formLabelWidth">
              <span>{{ deviceDetail.factory_id }}</span>
            </el-form-item>
            <el-form-item label="合同编号" :label-width="formLabelWidth">
              <span>{{ deviceDetail.factory_id }}</span>
            </el-form-item>
            <el-form-item label="生产日期" :label-width="formLabelWidth">
              <span>{{ deviceDetail.production_date }}</span>
            </el-form-item>
            <el-form-item label="软件版本" :label-width="formLabelWidth">
              <span>{{ deviceDetail.software_version }}</span>
            </el-form-item>
            <el-form-item label="盒子类型" :label-width="formLabelWidth">
              <span>{{ deviceDetail.system_version }}</span>
            </el-form-item>
            <el-form-item label="在线状态" :label-width="formLabelWidth">
              <span>{{ deviceDetail.device_status }}</span>
            </el-form-item>
            <el-form-item label="MAC地址" :label-width="formLabelWidth">
              <span>{{ deviceDetail.mac_address }}</span>
            </el-form-item>
            <el-form-item label="CPU" :label-width="formLabelWidth">
              <span>{{ deviceDetail.cpu }}</span>
            </el-form-item>
            <el-form-item label="内存" :label-width="formLabelWidth">
              <span>{{ deviceDetail.internal_memory }}</span>
            </el-form-item>
          </el-form></div>
        </el-tab-pane>
        <el-tab-pane label="固件升级信息" name="second"
          ><firmware  ref="firmwareCom" :update_type="0"
        /></el-tab-pane>
        <el-tab-pane label="软件升级信息" name="third"
          ><firmware ref="versionCom" :update_type="1" 
        /></el-tab-pane>
        <el-tab-pane label="维修记录" name="fourth"
          ><repair  ref="repairCom"
        /></el-tab-pane>
      </el-tabs>

      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">升 级</el-button>
        <el-button type="primary" @click="centerDialogVisible = false"
          >编 辑</el-button
        >
      </span> -->
    </el-dialog>
  </div>
</template>

<script>
import firmware from "./table/firmware";
import repair from "./table/repair";
export default {
  name: "showDetail",
  components: { firmware, repair },
  data() {
    return {
      centerDialogVisible: false,
      device_id: "",
      formLabelWidth:"",
      deviceDetail: {},
      formLabelWidth: "320px",
      activeName: "first"
    };
  },
  methods: {
    show(params) {
      this.deviceDetail = params;
      this.device_id = params["id"];
      this.centerDialogVisible = true;
      this.$refs.firmwareCom.refresh(this.device_id)
      this.$refs.versionCom.refresh(this.device_id)
      this.$refs.repairCom.refresh()
    }
  }
};
</script>

<style scoped></style>
