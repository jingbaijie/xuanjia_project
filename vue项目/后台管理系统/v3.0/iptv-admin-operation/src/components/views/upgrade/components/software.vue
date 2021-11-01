<template>
  <div>
    <!-- <el-row type="flex" justify="end">
      <el-button type="primary" @click="isVisible = true"
        >添加升级计划</el-button
      >
    </el-row>-->
    <el-row>
      <el-table :data="tableData" :max-height="410">
        <el-table-column prop="id" label="任务ID"></el-table-column>
        <el-table-column prop="device_id" label="设备ID"></el-table-column>
        <el-table-column prop="sn_num" label="SN-编号"></el-table-column>
        <el-table-column prop="factory_name" label="厂商名称"></el-table-column>
        <el-table-column prop="local_version" label="当前版本"></el-table-column>
        <el-table-column prop="target_version" label="升级版本"></el-table-column>
        <el-table-column prop="system_version" label="盒子类型"></el-table-column>
        <el-table-column prop="start_time" label="开始时间"></el-table-column>
        <el-table-column prop="end_time" label="结束时间"></el-table-column>
        <el-table-column prop="update_status" label="升级状态"></el-table-column>
        <el-table-column prop="softwareName" label="在线状态"></el-table-column>
      </el-table>
        <pagination
      v-show="total>0"
      :total="total"
      :page.sync="currentPage"
      :limit.sync="pageSize"
      @pagination="getFirmList"
    />
    </el-row>
  </div>
</template>

<script>
import pagination from "@/components/widget/Pagination";
export default {
  name: "firmware",
  data() {
    return {
      isVisible: false, // 添加升级计划弹窗
      /** 表格 */
      tableData: [],
      /** 分页 */
      currentPage: 1, //分页当前页码
      pageSize: 10,
      total: 1,
    };
  },
   components: {
    pagination
  },
  created() {
    this.getFirmList();
  },
  methods: {
    // 新增
    addPlan() {},
    /** 分页 */
    // 改变表格每页条数
    handleSizeChange: function(val) {
      if (val != this.pageSize) {
        this.pageSize = val;
        this.getFirmList();
      }
    },
    // 改变表格页数
    handleCurrentChange: function(val) {
      this.currentPage = val;
      this.getUserList();
    },
    // 模拟表格数据
    getFirmList: function() {
      this.$store
        .dispatch("axios_query_boxUpdateList", {
          update_type: 1
          //pageNum: this.currentPage,
          //pageSize: this.pageSize,
        })
        .then(res => {
          //console.log("升级列表", res);
          this.tableData = res.data.data || [];
          this.total = res.data.data.pages;
        });
    }
  }
};
</script>

<style></style>
