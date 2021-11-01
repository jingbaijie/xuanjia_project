<template>
  <div>
    <div class="btn_area">
      <div class="add_btn">
        <div class="searchBtn">
          <!-- <el-input v-model="search" size="mini" width="50" placeholder="输入账号"/> -->
          <!-- v-show="userPermission.insert" -->
        </div>
        <el-button
          v-if="isAuth('system:menu:insert')"
          :style="{'float':'right','margin':'0 70px 0 0'}"
          size="mini"
          type="primary"
          plain
          @click="handleCreate()"
        >新增</el-button>
        <!-- <el-button size="mini" type="success" plain @click="toggleSelection()">一键还原</el-button> -->
      </div>
    </div>
    <div class="table_area">
      <!-- v-show="userPermission.select" -->
      <el-table
        v-if="isAuth('system:menu:list')"
        v-loading="loading"
        :data="menuData"
        ref="multipleTable"
        row-key="id"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        :height="tableHeight"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column fixed prop="menuName" label="菜单名称"></el-table-column>
        <el-table-column prop="menuType" label="菜单类型"></el-table-column>
        <el-table-column prop="url" label="URL地址" width="300"></el-table-column>
        <el-table-column label="是否隐藏">
          <template slot-scope="scope">{{showVlaue[scope.row.visible]}}</template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="160">
          <template slot-scope="scope">
            <!-- v-show="userPermission.update"
            v-show="userPermission.delete"-->
            <el-button
              v-if="isAuth('system:menu:update')"
              plain
              size="mini"
              type="warning"
              @click="handleEdit(scope.$index, formatData)"
            >编 辑</el-button>
            <el-button
              v-if="isAuth('system:menu:delete')"
              plain
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, formatData)"
            >删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <menuForm></menuForm>
      <div v-if="!isAuth('system:menu:list')" class="msg">
      暂无权限
    </div>
    </div>
  </div>
</template>

<script>
import menuForm from "./menuForm";
import { eventBus } from "@/common/eventBus";
import { Message } from "element-ui";

export default {
  name: "menuList",
  inject: ["getMenuId"],
  components: {
    menuForm: menuForm
  },
  data() {
    return {
      tableHeight: undefined,
      showVlaue: { "0": "否", "1": "是" },
      userPermission: {
        select: false,
        delete: false,
        insert: false,
        update: false
      },
      menuId: this.getMenuId(),
      showIcon: false,
      editMenu: true,
      addForm: true,
      currentPage: 4, //分页当前页码
      totalcount: 400,
      menuData: [],
      formatData: [],
      search: "",
      loading: true
    };
  },
  methods: {
    getMenuList() {
      this.$store
        .dispatch("axios_get_menu", {
          menuId: this.menuId
        })
        .then(res => {
          this.menuData = res.data.data.list;
          // this.checkPermission(res.data.data.btns);
          this.formatData = this.formatTreeData(this.menuData);
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    formatTreeData(d) {
      var nn = [];
      d.map(function(i) {
        nn.push(i);
        if (i.children.length > 0) {
          i.children.map(function(x) {
            nn.push(x);
            if (x.children.length > 0) {
              x.children.map(function(k) {
                nn.push(k);
              });
            }
          });
        }
      });
      return nn;
    },
    handleCreate() {
      eventBus.$emit("addMenu");
    },
    handleEdit(index, menudata) {
      eventBus.$emit("editMenuXXXXX", menudata[index]);
    },
    handleDelete(index, data) {
      this.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store
            .dispatch("axios_del_menu", {
              menuId: data[index].id
            })
            .then(res => {
              if (res.data.errorCode == "1000") {
                Message({ message: res.data.errorMsg, type: "success" });
                this.getMenuList();
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
    },
    handleSizeChange(val) {},
    handleCurrentChange(val) {}
  },
  mounted() {
    console.log("menu insert : ", this.isAuth("system:menu:insert"));
    console.log("menu edit : ", this.isAuth("system:menu:update"));
    console.log("menu list : ", this.isAuth("system:menu:list"));
    console.log("menu delete : ", this.isAuth("system:menu:delete"));
    this.getMenuList();

    if (this.isAuth("system:menu:list")) {
      this.tableHeight =
        window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 140;
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
.el-pagination {
  text-align: center;
}
.el-input--mini .el-input__inner {
  width: 100px;
}
</style>
