<template>
  <div>
    <!-- <el-row type="flex" justify="end">
      <el-button type="primary" @click="isVisible = true"
        >添加升级计划</el-button
      >
    </el-row> -->
    <el-row>
      <el-table :data="tableData" :max-height="410">
        <el-table-column prop="local_version" label="当前版本"></el-table-column>
        <el-table-column prop="target_version" label="升级版本"></el-table-column>
        <el-table-column prop="softwareName" label="在线状态"></el-table-column>
      </el-table>
    </el-row>
    <el-row type="flex" justify="end" :style="{ marginTop: '10px' }">
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
    </el-row>
  </div>
</template>

<script>
export default {
  name: "firmware",
  data() {
    return {
      isVisible: false, // 添加升级计划弹窗
      /** 表格 */
      tableData: [],
      /** 分页 */
      total: 0, // 总条数
      pageSizes: [5, 10, 30, 40], // 分页条数选择器
      pageSize: 5, // 每页数据显示条数
      currentPage: 1 // 分页当前页码
    };
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
          update_type: 0,
          //pageNum: this.currentPage,
          //pageSize: this.pageSize,
          pageNum: this.currentPage,
          pageSize: this.pageSize
        })
        .then(res => {
          this.total = res.data.data.length;
        });
    }
  }
};
</script>

<style></style>
