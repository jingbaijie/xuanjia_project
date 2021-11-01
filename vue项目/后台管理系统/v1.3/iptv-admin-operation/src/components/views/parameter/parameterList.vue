<template>
  <div>
    <div class="btn_area">
      <div class="add_btn">
        <keySearch @searchData="getSearchVal"></keySearch>
        <el-button
          v-if="isAuth('system:config:insert')"
          :style="{'float':'right','margin':'0 70px 0 0'}"
          size="mini"
          type="primary"
          plain
          @click="handleCreate()"
        >新增</el-button>
      </div>
    </div>
    <el-table
      v-if="isAuth('system:config:list')"
      v-loading="loading"
      :data="giftList"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      ref="multipleTable"
      :height="tableHeight"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="模板ID"></el-table-column>
      <el-table-column prop="configName" label="参数名称"></el-table-column>
      <el-table-column prop="configKey" label="参数键名"></el-table-column>
      <el-table-column prop="configValue" label="参数键值"></el-table-column>
      <el-table-column prop="configType" label="是否系统内置">
        <template slot-scope="scope">{{configType[scope.row.configType]}}</template>
      </el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column align="center" label="操作" width="160">
        <template slot-scope="scope">
          <el-button
            v-if="isAuth('system:config:update')"
            plain
            size="mini"
            type="warning"
            @click="handleEdit(scope.$index, giftList)"
          >编 辑</el-button>
          <el-button
            v-if="isAuth('system:config:delete')"
            plain
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, giftList)"
          >删 除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <paramterForm></paramterForm>
    <div v-if="!isAuth('system:config:list')" class="msg">暂无权限</div>
    <pagination
      v-if="isAuth('system:config:list')"
      v-show="total>0"
      :total="total"
      :page.sync="currentPage"
      :limit.sync="pageSize"
      @pagination="getParamList()"
    />
  </div>
</template>
<script>
import { Message, Loading } from "element-ui";
import { eventBus } from "@/common/eventBus";
import Pagination from "@/components/widget/Pagination";
import keySearch from "@/components/widget/keySearch";
import paramterForm from "./paramterForm";
export default {
  name: "giftList",
  inject: ["getMenuId"],
  components: {
    paramterForm,
    Pagination,
    keySearch
  },
  data() {
    return {
      menuId: this.getMenuId(),
      activeData: [],
      imagesBaseUrl: window.configs.static_IMAGES_BASEURL,
      currentPage: 1, //分页当前页码
      pageSize: 10,
      total: 1,
      giftList: [],
      searchVal: "",
      loading: true,
      tableHeight: undefined,
      prizeFrom: ["活动", "平台"],
      configType: {
        0: "否",
        1: "是"
      }
    };
  },
  provide() {
    return {
      getActiveData: () => {
        return this.activeData;
      }
    };
  },
  created() {
    console.log("config insert : ", this.isAuth("system:config:insert"));
    console.log("config edit : ", this.isAuth("system:config:update"));
    console.log("config list : ", this.isAuth("system:config:list"));
    console.log("config delete : ", this.isAuth("system:config:delete"));

    this.getParamList();
    eventBus.$on("refreshParamList", () => {
      this.getParamList();
    });
  },
  mounted() {
    if (this.isAuth("system:config:list")) {
      this.tableHeight =
        window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 200;
    }
  },
  destroyed() {
    eventBus.$off("refreshParamList");
  },
  methods: {
    getSearchVal(val) {
      this.searchVal = val;
      this.getParamList();
    },
    getParamList() {
      this.$store
        .dispatch("axios_get_configList", {
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
    getActiveList() {
      this.$store
        .dispatch("axios_get_active", {
          pageSize: 200
        })
        .then(rs => {
          this.activeData = rs.data.data.list.records;
        })
        .catch(err => {});
    },
    handleCreate() {
      eventBus.$emit("addGift", this.activeData);
    },
    handleEdit(index, rows) {
      eventBus.$emit("editGift", rows[index], this.activeData);
    },
    handleDelete(index, rows) {
      this.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store
            .dispatch("axios_del_configList", {
              ids: rows[index].id
            })
            .then(res => {
              if (res.data.errorCode == "1000") {
                Message({ message: res.data.errorMsg, type: "success" });
                this.getParamList();
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
.el-pagination {
  text-align: center;
}
.pading_area {
  margin-top: 25px;
}
</style>
