<template>
  <div>
    <div class="btn_area">
      <div class="add_btn">
        <keySearch @searchData="getSearchVal"></keySearch>
        <dateSearch
          @searchTime="getSearchTime"
          :fatherMethod="getActiveList"
        ></dateSearch>
        <el-button
          v-if="isAuth('system:special:insert')"
          :style="{ float: 'right', margin: '0 70px 0 0' }"
          size="mini"
          type="primary"
          plain
          @click="handleCreate()"
          >新增</el-button
        >
        <!-- <el-button size="mini" type="success" plain @click="toggleSelection()">一键还原</el-button> -->
      </div>
    </div>
    <el-table
      v-if="isAuth('system:activity:list')"
      :data="activeData"
      v-loading="loading"
      @selection-change="handleSelectionChange"
      ref="multipleTable"
      :height="tableHeight"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="ID" width="65"></el-table-column>
      <el-table-column prop="activityCname" label="活动名称"></el-table-column>
      <el-table-column prop="activityUrl" label="活动地址"></el-table-column>
      <el-table-column
        prop="activityStartTime"
        label="开始时间"
      ></el-table-column>
      <el-table-column
        prop="activityEndTime"
        label="结束时间"
      ></el-table-column>
      <el-table-column
        prop="commSpecialEname"
        label="专项链接"
      ></el-table-column>
      <el-table-column prop="booleanUp" label="状态" width="100">
        <template slot-scope="scope">{{
          booleanUp[scope.row.booleanUp]
        }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="300">
        <template slot-scope="scope">
          <el-button
            plain
            size="mini"
            type="success"
            @click="createUrl(scope.$index, activeData)"
            >创建专项链接</el-button
          >
          <el-button
            v-if="isAuth('system:activity:update')"
            plain
            size="mini"
            type="warning"
            @click="handleEdit(scope.$index, activeData)"
            >编 辑</el-button
          >
          <el-button
            v-if="isAuth('system:activity:delete')"
            plain
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, activeData)"
            >删 除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <activeForm @refreshActive="refreshActive" />
    <div v-if="!isAuth('system:activity:list')" class="msg">暂无权限</div>
    <pagination
      v-if="isAuth('system:activity:list')"
      v-show="total > 0"
      :total="total"
      :page.sync="currentPage"
      :limit.sync="pageSize"
      @pagination="getActiveList"
    />
  </div>
</template>

<script>
import { Loading } from "element-ui";
import { eventBus } from "@/common/eventBus";
import activeForm from "./activeForm";
import keySearch from "@/components/widget/keySearch";
import dateSearch from "@/components/widget/DateSearch";
import Pagination from "@/components/widget/Pagination";

export default {
  name: "activeList",
  inject: ["getMenuId"],
  components: {
    activeForm,
    Pagination,
    keySearch,
    dateSearch,
    startTime: "",
    endTime: ""
  },
  data() {
    return {
      menuId: this.getMenuId(),
      booleanUp: {
        "0": "未上线",
        "1": "测试",
        "2": "上线"
      },
      currentPage: 1, //分页当前页码
      pageSize: 10,
      total: 1,
      userData: [],
      searchVal: "",
      activeData: [],
      tableHeight: undefined,
      loading: true
    };
  },
  created() {
    this.getActiveList();
  },
  mounted() {
    this.tableHeight =
      window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 200;
  },

  methods: {
    getSearchVal(val) {
      this.searchVal = val;
      this.getActiveList();
    },
    refreshActive() {
      this.getActiveList();
    },
    getSearchTime(val) {
      this.startTime = val[0];
      this.endTime = val[1];
      this.getActiveList();
    },
    createUrl(index, rows) {
      this.$store
        .dispatch("axios_get_createSpecialUrl", {
          contentId: rows[index].id,
          type: "5" // 专题的type 6
        })
        .then(rs => {
          if (rs.data.errorCode == "1000") {
            this.refreshActive();
            this.$message.success("已创建专项链接！");
          } else if (rs.data.errorCode == "1002") {
            this.$message.success("创建专项链接失败!" + rs.data.errorMsg);
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    getActiveList() {
      this.$store
        .dispatch("axios_get_active", {
          searchValue: this.searchVal,
          startTime: this.startTime,
          endTime: this.endTime,
          pageNum: this.currentPage,
          pageSize: this.pageSize
        })
        .then(rs => {
          this.activeData = rs.data.data.list.records;
          this.total = rs.data.data.list.total;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    handleCreate() {
      this.$emit("changeView", "createActive", {});
    },
    handleEdit(index, rows) {
      this.$emit("changeView", "createActive", rows[index]);
      eventBus.$emit("editActive", rows[index]);
    },
    handleDelete(index, rows) {
      this.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store
            .dispatch("axios_del_active", {
              ids: rows[index].id
            })
            .then(res => {
              if (res.data.errorCode == "1000") {
                this.$message({ message: res.data.errorMsg, type: "success" });
                this.refreshActive();
              } else {
                this.$message({ message: res.data.errorMsg, type: "warning" });
              }
            })
            .catch(err => {
              this.$message({
                message: "删除失败，服务器暂无响应！",
                type: "error"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.searchBtn {
  width: 20vh;
  float: left;
  margin-right: 10px;
}
.btn_area {
  height: 8vh;
  padding: 15px 10px 10px 5px;
}
.add_btn {
  margin: 10px 0 0 10px;
  width: 100%;
  float: left;
}

.el-input--mini .el-input__inner {
  width: 100px;
}
</style>
