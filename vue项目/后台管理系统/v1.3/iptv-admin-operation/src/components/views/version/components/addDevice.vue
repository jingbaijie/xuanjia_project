<template>
  <div>
    <el-page-header @back="goBack" content="添加设备"> </el-page-header>
    <el-row :style="{ margin: '20px 0 0 10px' }">
      <el-form
        ref="form"
        :inline="true"
        :model="form"
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="SN编号:" prop="sn_num">
          <el-input
            v-model="form.sn_num"
            placeholder="请输入搜索条件"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="厂商名称:" prop="factory_name">
          <el-input
            v-model="form.factory_name"
            placeholder="请输入搜索条件"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="盒子版本:" prop="system_version">
          <el-input
            v-model="form.system_version"
            placeholder="请输入搜索条件"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm('form')" size="small">重置</el-button>
          <el-button type="primary" @click="search" size="small"
            >搜索</el-button
          >
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-table
        :data="tableData"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection"></el-table-column>
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
      </el-table>
    </el-row>
    <!-- <el-row type="flex" justify="end" :style="{ marginTop: '10px' }">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        v-show="total > 5"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        :current-page.sync="currentPage"
      >
      </el-pagination>
    </el-row> -->
    <el-row type="flex" justify="end" :style="{ marginTop: '10px' }">
      <el-button type="primary" @click="handleConfirm" size="mini"
        >添加设备</el-button
      >
    </el-row>
  </div>
</template>

<script>
import { eventBus } from "@/common/eventBus";
export default {
  name: "upgrade",
  data() {
    return {
      /** 表单 */
      form: {
        sn_num: "", // 设备
        factory_name: "", // 厂商
        system_version: "" // 版本
      },
      /** 表格 */
      tableData: [],
      upgradeTable: [], // 选中表格数据
      /** 分页 */
      // total: 0, // 总条数
      // pageSizes: [5, 10, 30, 40], // 分页条数选择器
      // pageSize: 5, // 每页数据显示条数
      // currentPage: 1 // 分页当前页码
    };
  },
  created() {
    this.getTableList({});
    eventBus.$on("initAddDevice", () => {
      this.tableData.forEach(row => {
        this.$refs.multipleTable.toggleRowSelection(row, false);
      });
    });
  },
  beforeDestroy() {
    eventBus.$off("initAddDevice");
  },
  methods: {
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.getTableList({});
    },
    // 搜索
    search() {
      let params = {
        sn_num: this.form.sn_num, // sn编号
        factory_name: this.form.factory_name, // 厂商名称
        system_version: this.form.system_version, // 盒子版本
         pageSize:100000,
         pageNum:1
      };
      this.getTableList(params);
    },
    // 添加设备
    handleConfirm() {
      this.$store.state.upgradeTable = this.upgradeTable;
      this.$store.state.isComponent = "upgrade";
    },
    /** 表格 */
    // 设备信息
    getTableList(params) {
      this.$store
        .dispatch("axios_get_device", Object.assign(params, { pageSize:100000,
         pageNum:1}))
        .then(res => {
          //console.log("设备信息", res);
          this.tableData = res.data.data;
          this.total = Number(res.data.dateSize) || 9999;
        });
    },
    // 多选
    handleSelectionChange(val) {
      this.upgradeTable = val;
      //console.log("多选表格", val);
    },
    // 返回
    goBack() {
      this.$store.state.isComponent = "upgrade";
    },

  }
};
</script>

<style></style>
