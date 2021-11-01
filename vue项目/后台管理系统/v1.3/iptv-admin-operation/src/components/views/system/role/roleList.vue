<template>
  <div>
    <div class="btn_area">
      <div class="add_btn">
        <div class="searchBtn"></div>
        <el-button
          v-if="isAuth('system:role:insert')"
          :style="{'float':'right','margin':'0 70px 0 0'}"
          size="mini"
          type="primary"
          plain
          @click="handleCreate()"
        >新增</el-button>
      </div>
    </div>
    <el-table
      v-if="isAuth('system:role:list')"
      v-loading="loading"
      :data="roleData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      ref="multipleTable"
      :height="tableHeight"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="角色名称" prop="rname"></el-table-column>
      <el-table-column label="权限" prop="rval"></el-table-column>
      <el-table-column label="角色描述" prop="rdesc"></el-table-column>
      <el-table-column label="创建时间" prop="createTime"></el-table-column>
      <el-table-column align="center" label="操作" width="160">
        <template slot-scope="scope">
          <el-button
            v-if="isAuth('system:role:update')"
            plain
            size="mini"
            type="warning"
            @click="handleEdit(scope.$index, roleData)"
          >编 辑</el-button>
          <el-button
            v-if="isAuth('system:role:delete')"
            plain
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index,roleData)"
          >删 除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="!isAuth('system:role:list')" class="msg">
      暂无权限
    </div>
    <pagination
     v-if="isAuth('system:role:list')"
      v-show="total>0"
      :total="total"
      :page.sync="currentPage"
      :limit.sync="pageSize"
      @pagination="getRoleList"
    />
    <roleForm></roleForm>
  </div>
</template>

<script>
import { eventBus } from "@/common/eventBus";
import { Message } from "element-ui";
import roleForm from "./roleForm";
import Pagination from "@/components/widget/Pagination";

export default {
  name: "roleList",
  inject: ["getMenuId"],
  data() {
    return {
     
      currentPage: 1, //分页当前页码
      pageSize: 10,
      total: 1,
      roleData: [],
      search: "",
      tableHeight: undefined,
      menuId: this.getMenuId(),
      loading: true
    };
  },
  components: {
    roleForm,
    Pagination
  },
  created() {
    this.getRoleList();
    eventBus.$on("refreshRole", () => {
      this.getRoleList();
    });
  },
  mounted() {
    console.log("role insert : ", this.isAuth("system:role:insert"));
    console.log("role edit : ", this.isAuth("system:role:update"));
    console.log("role list : ", this.isAuth("system:role:list"));
    console.log("role delete : ", this.isAuth("system:role:delete"));

    if (this.isAuth("system:role:list")) {
      this.tableHeight =
        window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 200;
    }
  },
  destroyed() {
    eventBus.$off(["refreshRole"]);
  },
  methods: {
    checkPermission(btnPermission) {
      this.userPermission.select = btnPermission.find(item => {
        return item.perms === "system:role:list";
      });
      this.userPermission.delete = btnPermission.find(item => {
        return item.perms === "system:role:delete";
      });
      this.userPermission.update = btnPermission.find(item => {
        return item.perms === "system:role:update";
      });
      this.userPermission.insert = btnPermission.find(item => {
        return item.perms === "system:role:insert";
      });
    },
    getRoleList() {
      this.$store
        .dispatch("axios_get_role", {
          menuId: this.menuId,
          pageNum: this.currentPage,
          pageSize: this.pageSize
        })
        .then(res => {
          this.roleData = res.data.data.list.records;
          this.total = res.data.data.list.total;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    handleCreate() {
      eventBus.$emit("addRole");
    },
    handleEdit(index, rows) {
      eventBus.$emit("editRole", rows[index]);
    },
    handleDelete(index, rows) {
      this.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store
            .dispatch("axios_del_role", {
              roleIds: rows[index].id
            })
            .then(res => {
              if (res.data.errorCode == "1000") {
                Message({ message: res.data.errorMsg, type: "success" });
                this.getRoleList();
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

