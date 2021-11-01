<template>
  <div>
    <div class="btn_area">
      <div class="add_btn">
        <keySearch @searchData="getSearchVal"></keySearch>
        <el-button
          v-if="isAuth('system:black:insert')"
          :style="{'float':'right','margin':'0 70px 0 0'}"
          size="mini"
          type="primary"
          plain
          @click="handleCreate()"
        >新增</el-button>
      </div>
    </div>
    <el-table
      v-if="isAuth('system:black:list')"
      v-loading="loading"
      :data="giftList"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      ref="multipleTable"
      :height="tableHeight"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="主键"></el-table-column>
      <el-table-column prop="userId" label="用户编号"></el-table-column>
      <el-table-column prop="codeType" label="内容类型">
        <template slot-scope="scope">{{contentType[scope.row.codeType]}}</template>
      </el-table-column>
      <el-table-column prop="userType" label="名单类型">
        <template slot-scope="scope">{{listType[scope.row.userType]}}</template>
      </el-table-column>
      <el-table-column prop="startTime" label="生效时间"></el-table-column>
      <el-table-column prop="endTime" label="失效时间"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column prop="filemTime" label="修改时间"></el-table-column>
      <el-table-column align="center" label="操作" width="160">
        <template slot-scope="scope">
          <el-button
            v-if="isAuth('system:black:update')"
            plain
            size="mini"
            type="warning"
            @click="handleEdit(scope.$index, giftList)"
          >编 辑</el-button>
          <el-button
            v-if="isAuth('system:black:delete')"
            plain
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, giftList)"
          >删 除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <blackForm @refreshBlack="getBlackList"></blackForm>
    <div v-if="!isAuth('system:black:list')" class="msg">暂无权限</div>
    <pagination
      v-if="isAuth('system:black:list')"
      v-show="total>0"
      :total="total"
      :page.sync="currentPage"
      :limit.sync="pageSize"
      @pagination="getBlackList()"
    />
  </div>
</template>

<script>
import { Loading } from "element-ui";
import { eventBus } from "@/common/eventBus";
import blackForm from "./blackForm";
import keySearch from "@/components/widget/keySearch";
import Pagination from "@/components/widget/Pagination";

export default {
  name: "giftList",
  inject: ["getMenuId"],
  components: {
    blackForm,
    Pagination,
    keySearch
  },
  data() {
    return {
      contentType: { "0": "全部", "1": "卡通", "2": "游戏" },
      listType: { "1": "黑名单", "0": "白名单" },
      imagesBaseUrl: window.configs.static_IMAGES_BASEURL,
      currentPage: 1, //分页当前页码
      pageSize: 10,
      total: 1,
      menuId: this.getMenuId(),
      giftList: [],
      activeData: [],
      searchVal: "",
      loading: true,
      tableHeight: undefined,
      prizeFrom: ["活动", "平台"]
    };
  },
  provide() {
    return {
      setActioveData: val => {
        this.activeData = val;
      },
      getActiveData: () => {
        return this.activeData;
      }
    };
  },
  created() {
    console.log("black insert : ", this.isAuth("system:black:insert"));
    console.log("black edit : ", this.isAuth("system:black:update"));
    console.log("black list : ", this.isAuth("system:black:list"));
    console.log("black delete : ", this.isAuth("system:black:delete"));
    this.getBlackList();
  },
  mounted() {
    if (this.isAuth("system:black:insert")) {
      this.tableHeight =
        window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 200;
    }
  },
  methods: {
    getSearchVal(val) {
      this.searchVal = val;
      this.getBlackList();
    },
    refreshBlack() {
      this.getBlackList();
    },
    getBlackList() {
      this.$store
        .dispatch("axios_get_blackList", {
          searchValue: this.searchVal,
          menuId: this.menuId,
          pageNum: this.currentPage,
          pageSize: this.pageSize
        })
        .then(res => {
          if (res != "undefined") {
            this.giftList = res.data.data.list.records;
            this.total = res.data.data.list.total;
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    handleCreate() {
      eventBus.$emit("addBlackList");
    },
    handleEdit(index, rows) {
      eventBus.$emit("editBlackList", rows[index], this.giftList);
    },
    handleDelete(index, rows) {
      this.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store
            .dispatch("axios_del_blackList", {
              ids: rows[index].id
            })
            .then(res => {
              if (res.data.errorCode == "1000") {
                this.refreshBlack();
                this.$message({ message: res.data.errorMsg, type: "success" });
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
  },

  destroyed() {
    eventBus.$off(["editGift", "addGift"]);
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
