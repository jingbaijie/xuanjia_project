<template>
  <div>
    <div style="btn_tab">
      <!-- <el-input class="searchInput" style placeholder="卡号查询" v-model="cardSearch"></el-input> -->
      <!-- <el-input class="searchInput" style placeholder="用户账号查询" v-model="accountSearch"></el-input> -->
      <el-input class="searchInput" style placeholder="根据名称或者id" v-model="searchValue"></el-input>
      <el-button
        :style="{'float':'right','margin':'0 10px 0 0'}"
        type="warning"
        plain
        @click="handleCreate"
      >新增</el-button>
    </div>

    <el-table
      v-loading="loading"
      :data="cpData"
      style="width: 100%"
      ref="multipleTable"
      :height="tableHeight"
    >
      <el-table-column align="center" prop="cpCname" label="名称"></el-table-column>
      <el-table-column align="center" prop="cpType" label="类型">
        <template slot-scope="scope">{{cpType[scope.row.cpType]}}</template>
      </el-table-column>
      <el-table-column align="center" prop="cpCode" label="CPCODE"></el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
      <el-table-column align="center" label="操作" width="160">
        <template slot-scope="scope">
          <el-button type="text" @click="handleDel(scope.$index,cpData)">删除</el-button>
          <el-button type="text" @click="handleEdit(scope.$index,cpData)">设 置</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="currentPage"
      :limit.sync="pageSize"
      @pagination="getCpList"
    />
    <configcpspInfo @refreshList="getCpList"></configcpspInfo>
  </div>
</template>

<script>
import { Message, Loading } from "element-ui";
import { eventBus } from "@/common/eventBus";
import Pagination from "@/components/widget/Pagination";
import configcpspInfo from "./configcpspInfo";
// 节流函数
const delay = (function() {
  let timer = 0;
  return function(callback, ms) {
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
})();
export default {
  name: "cpDetailList",
  inject: ["getMenuId"],
  components: { Pagination, configcpspInfo },
  data() {
    return {
      searchValue: "",
      cpType: { "0": "CP", "1": "SP" },
      currentPage: 1, //分页当前页码
      pageSize: 10,
      total: 1,
      menuId: this.getMenuId(),
      cpData: [],
      loading: true,
      tableHeight: undefined
    };
  },
  watch: {
    searchValue() {
      delay(() => {
        this.getCpList();
      }, 300);
    }
  },
  created() {
    this.getCpList();
  },
  mounted() {
    this.tableHeight =
      window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 200;
  },
  methods: {
    getCpList() {
      this.$store
        .dispatch("axios_get_cpDetail", {
          searchValue: this.searchValue,
          menuId: this.menuId,
          pageNum: this.currentPage,
          pageSize: this.pageSize
        })
        .then(res => {
          if (res != "undefined") {
            this.cpData = res.data.data.list.records;
            this.total = res.data.data.list.total;
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    handleDel(index, row) {
      console.log(row);
      this.$confirm("确定删除吗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store
            .dispatch("axios_del_cpDetail", { ids: row[index].id })
            .then(response => {
              if (response.data.errorCode == "1000") {
                this.getCpList();
                this.$message.success("删除操作成功！");
              } else {
                this.$message.error("删除操作失败，请联系管理员");
              }
            })
            .catch(err => {
              this.$message.error("批量操作失败，请联系管理员");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消该操作！"
          });
        });
    },
    handleCreate() {
      eventBus.$emit("addcpsp");
    },
    handleEdit(index, row) {
      eventBus.$emit("editcpsp", row[index]);
    }
  }
};
</script>
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
.searchInput {
  width: 200px;
  float: left;
  border-radius: 30px;
  margin: 0px 10px 10px;
}
</style>
