<template>
  <div>
    <div class="btn_area">
      <div class="add_btn">
        <el-button
          v-if="isAuth('system:user:insert')"
          :style="{'float':'right','margin':'0 70px 0 0'}"
          size="mini"
          type="primary"
          plain
          @click="handleCreate()"
        >新增</el-button>
      </div>
    </div>
    <el-table
      v-if="isAuth('system:user:list')"
      v-loading="loading"
      :data="userData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      ref="multipleTable"
      :height="tableHeight"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="nick" label="用户名"></el-table-column>
      <el-table-column prop="uname" label="账号"></el-table-column>
      <el-table-column prop="roleName" label="角色"></el-table-column>
      <el-table-column label="账号状态">
        <template slot-scope="scope">{{showVlaue[scope.row.status]}}</template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column align="center" label="操作" width="160">
        <template slot-scope="scope">
          <el-button
            v-if="isAuth('system:user:update')"
            plain
            size="mini"
            type="warning"
            @click="handleEdit(scope.$index, userData)"
          >编 辑</el-button>
          <el-button
            v-if="isAuth('system:user:delete')"
            plain
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, userData)"
          >删 除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="!isAuth('system:user:list')" class="msg">暂无权限</div>
    <pagination
      v-if="isAuth('system:user:list')"
      v-show="total>0"
      :total="total"
      :page.sync="currentPage"
      :limit.sync="pageSize"
      @pagination="getUserList"
    />
    <userForm></userForm>
  </div>
</template>

<script>
import { Message, Loading } from "element-ui";
import { eventBus } from "@/common/eventBus";
import Search from "@/components/widget/HeaderSearch";
import Pagination from "@/components/widget/Pagination";
import userForm from "./userForm";

export default {
  name: "userList",
  inject: ["getMenuId"],
  components: {
    userForm,
    Pagination
  },
  data() {
    return {
      showVlaue: { "0": "禁用", "1": "启用" },
      currentPage: 1, //分页当前页码
      pageSize: 10,
      total: 0,
      userData: [],
      searchValue: "",
      loading: true,
      tableHeight: undefined,
      menuId: this.getMenuId()
    };
  },
  created() {
    console.log("insert : ", this.isAuth("system:user:insert"));
    console.log("edit : ", this.isAuth("system:user:update"));
    console.log("list : ", this.isAuth("system:user:list"));
    console.log("delete : ", this.isAuth("system:user:delete"));
    this.getUserList();
    eventBus.$on("refreshUser", () => {
      this.getUserList();
    });
  },
  mounted() {
    if (this.isAuth("system:user:list")) {
      this.tableHeight =
        window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 200;
    }
  },
  destroyed() {
    eventBus.$off(["refreshUser"]);
  },
  methods: {
    getSearch(keys) {
      this.currentPage = 1;
      this.searchValue = keys;
    },
    getUserList() {
      this.$store
        .dispatch("axios_get_user", {
          menuId: this.menuId,
          pageNum: this.currentPage,
          pageSize: this.pageSize
        })
        .then(res => {
          if (res != "undefined") {
            this.userData = res.data.data.list.records;
            this.total = res.data.data.list.total;
            this.btns = res.data.data.btns;
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    handleCreate() {
      eventBus.$emit("addUser");
    },
    handleEdit(index, rows) {
      eventBus.$emit("editUser", rows[index]);
    },
    handleDelete(index, rows) {
      this.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store
            .dispatch("axios_del_user", {
              ids: rows[index].id
            })
            .then(res => {
              if (res.data.errorCode == "1000") {
                Message({ message: res.data.errorMsg, type: "success" });
                this.getUserList();
              } else {
                Message({ message: res.data.errorMsg, type: "warning" });
              }
            })
            .catch(err => {
              Message({ message: "删除失败，服务器暂无响应！", type: "error" });
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
