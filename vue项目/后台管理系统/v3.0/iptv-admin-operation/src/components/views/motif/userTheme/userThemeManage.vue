<template>
  <div>
    <div class="btn_area">
      <!-- 条件查询 -->
      <el-form
        :model="queryParams"
        ref="queryForm"
        :inline="true"
        v-show="showSearch"
        label-width="120px"
      >
        <el-form-item label="搜索条件" prop="cartoonCname">
          <el-input
            v-model="queryParams.userId"
            placeholder="请输入用户ID"
            clearable
            size="small"
            style="width: 200px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item style="margin-left: 20px">
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
            >重 置</el-button
          >
          <el-button
            style="margin-left: 20px"
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
            >搜 索</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <el-table
      v-loading="loading"
      :data="usertData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      ref="multipleTable"
      :height="tableHeight"
    >
      <el-table-column
        prop="userId"
        align="center"
        label="用户ID"
      ></el-table-column>
      <el-table-column
        prop="themeType"
        align="center"
        label="使用频道"
      ></el-table-column>
      <el-table-column
        prop="themeCname"
        align="center"
        label="使用主题"
      ></el-table-column>
      <el-table-column
        prop="skinCname"
        align="center"
        label="使用皮肤"
      ></el-table-column>
      <el-table-column
        prop="startTime"
        align="center"
        label="使用时间"
      ></el-table-column>
      <el-table-column align="center" label="操作" width="160">
        <template slot-scope="scope">
          <el-button
            plain
            size="mini"
            type="warning"
            @click="handleReset(scope.row)"
            >重 置</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- <div v-if="!isAuth('system:user:list')" class="msg">暂无权限</div> -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getUserList"
    />
  </div>
</template>

<script>
import Pagination from "@/components/widget/Pagination";
export default {
  name: "userThemeManage",
  components: {
    Pagination,
  },
  data() {
    return {
      // 显示搜索条件
      showSearch: true,
      searchVal: "",
      total: 0,
      usertData: [],
      loading: true,
      queryParams: {
        pageNum: 1, //分页当前页码
        pageSize: 10,
        userId: "",
      },
      tableHeight: undefined,
    };
  },
  created() {
    this.getUserList();
  },
  mounted() {
    // if (this.isAuth("system:user:list")) {
      this.tableHeight =
        window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 200;
    // }
  },
  methods: {
    getUserList() {
      this.$store
        .dispatch("axios_get_userSkin", this.queryParams)
        .then((res) => {
          if (res != "undefined") {
            this.usertData = res.data.data.records;
            this.usertData.forEach(e => {
              e.themeType = "少儿频道";
            });
            this.total = res.data.data.total;
          }
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getUserList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.userId = "";
      this.handleQuery();
    },
    handleReset(row) {
      this.$confirm("确定重置该条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$store
            .dispatch("axios_reset_userSkin", {
              userId: row.userId,
            })
            .then((res) => {
              if (res.data.errorCode == "1000") {
                this.$message.success("操作成功！");
                this.getUserList();
              } else {
                this.$message.error(res.data.errorMsg);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.btn_area {
  height: 8vh;
  padding: 15px 10px 10px 5px;
}
.el-input--mini .el-input__inner {
  width: 100px;
}
</style>
