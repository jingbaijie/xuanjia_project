<template>
  <div>
    <div class="btn_area">
      <div class="add_btn">
        <keySearch @searchData="getSearchVal"></keySearch>
        <el-button
          v-if="isAuth('system:dict:insert')"
          :style="{ float: 'right', margin: '0 70px 0 0' }"
          type="warning"
          plain
          @click="handleCreate()"
          >新增</el-button
        >
      </div>
    </div>
    <el-table
      v-if="isAuth('system:dict:list')"
      v-loading="loading"
      :data="dictTypeList"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      ref="multipleTable"
      :height="tableHeight"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="主键"></el-table-column>
      <el-table-column prop="dictName" label="字典名称"></el-table-column>
      <el-table-column prop="dictType" label="字典类型"></el-table-column>
      <!-- <el-table-column prop="status" label="状态"></el-table-column> -->
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">{{
          dictionaryState[scope.row.status]
        }}</template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column align="center" label="操作" width="260">
        <template slot-scope="scope">
          <el-button
            v-if="isAuth('system:dict:list')"
            plain
            size="mini"
            type="primary"
            @click="showDetail(scope.$index, dictTypeList)"
            >查 看</el-button
          >
          <el-button
            v-if="isAuth('system:dict:update')"
            plain
            size="mini"
            type="warning"
            @click="handleEdit(scope.$index, dictTypeList)"
            >编 辑</el-button
          >
          <el-button
            v-if="isAuth('system:dict:delete')"
            plain
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, dictTypeList)"
            >删 除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <dictionaryForm></dictionaryForm>
    <dictionaryDataForm></dictionaryDataForm>
    <div v-if="!isAuth('system:dict:list')" class="msg">暂无权限</div>
    <pagination
      v-if="isAuth('system:dict:list')"
      v-show="total > 0"
      :total="total"
      :page.sync="currentPage"
      :limit.sync="pageSize"
      @pagination="getDictList()"
    />

    <el-dialog
      v-dialogDrag
      title="字典数据"
      :visible.sync="dialogVisible"
      width="80%"
    >
      <el-button
        v-if="isAuth('system:dict:insert')"
        :style="{ float: 'right', margin: '0 70px 0 0' }"
        type="warning"
        plain
        @click="handleCreate2()"
        >新增</el-button
      >

      <el-table
        v-if="isAuth('system:dict:list')"
        v-loading="loading"
        :data="dictDataList"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        ref="multipleTable"
        :height="tableHeight"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="字典主键"></el-table-column>
        <el-table-column prop="dictLabel" label="字典键名"></el-table-column>
        <el-table-column prop="dictValue" label="字典键值"></el-table-column>
        <el-table-column prop="dictSort" label="字典排序"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">{{
            dictionaryState[scope.row.status]
          }}</template>
        </el-table-column>
        <!-- <el-table-column prop="status" label="状态"></el-table-column> -->
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column align="center" label="操作" width="260">
          <template slot-scope="scope">
            <el-button
              v-if="isAuth('system:dict:update')"
              plain
              size="mini"
              type="warning"
              @click="handleEdit2(scope.$index, dictDataList)"
              >编 辑</el-button
            >
            <el-button
              v-if="isAuth('system:dict:delete')"
              plain
              size="mini"
              type="danger"
              @click="handleDelete2(scope.$index, dictDataList)"
              >删 除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { Message, Loading } from "element-ui";
import { eventBus } from "@/common/eventBus";
import keySearch from "@/components/widget/keySearch";
import dictionaryForm from "./dictionaryForm";
import dictionaryDataForm from "./dictionaryDataForm";
import Pagination from "@/components/widget/Pagination";

export default {
  name: "dictList",
  inject: ["getMenuId"],
  components: {
    dictionaryForm,
    dictionaryDataForm,
    Pagination,
    keySearch
  },
  data() {
    return {
      total: 0,
      currentPage: 1,
      pageSize: 10,
      menuId: this.getMenuId(),
      dialogVisible: false,
      dictTypeList: [],
      dictDataList: [],
      curDictType: "",
      searchVal: "",
      loading: true,
      tableHeight: undefined,
      curIndex: "",
      curData: "",
      dictionaryState: {
        0: "不可用",
        1: "可用"
      }
    };
  },
  provide() {
    return {};
  },

  created() {
    console.log("dict insert : ", this.isAuth("system:dict:insert"));
    console.log("dict edit : ", this.isAuth("system:dict:update"));
    console.log("dict list : ", this.isAuth("system:dict:list"));
    console.log("dict delete : ", this.isAuth("system:dict:delete"));
    this.getDictList();
    eventBus.$on("refreshDict", () => {
      this.getDictList();
    });
    eventBus.$on("refreshDetail", () => {
      this.showDetail(this.curIndex, this.curData);
    });
  },
  mounted() {
    if (this.isAuth("system:dict:insert")) {
      this.tableHeight =
        window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 200;
    }
  },
  methods: {
    getSearchVal(val) {
      this.searchVal = val;
      this.getDictList();
    },
    showDetail(index, data) {
      this.curIndex = index;
      this.curData = data;
      this.$store
        .dispatch("axios_get_dictDataList", {
          menuId: this.menuId,
          pageSize: 100,
          dictType: data[index].dictType
        })
        .then(res => {
          this.curDictType = data[index].dictType;
          this.dictDataList = res.data.data.list.records;
        })
        .catch(err => {});
      this.dialogVisible = true;
    },
    getDictList() {
      this.$store
        .dispatch("axios_get_dictTypeList", {
          searchValue: this.searchVal,
          menuId: this.menuId,
          pageNum: this.currentPage,
          pageSize: this.pageSize
        })
        .then(res => {
          if (res != "undefined") {
            this.dictTypeList = res.data.data.list.records;
            this.$store.commit("dictionaryList_setter", this.dictTypeList);
            this.total = res.data.data.list.total;
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    handleCreate() {
      eventBus.$emit("addDictType");
    },
    handleCreate2() {
      eventBus.$emit("addDictData", this.curDictType);
    },
    handleEdit(index, rows) {
      eventBus.$emit("editDictType", rows[index]);
    },
    handleEdit2(index, rows) {
      rows[index].dictType = this.curDictType;
      eventBus.$emit("editDictData", rows[index]);
    },
    handleDelete(index, rows) {
      this.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store
            .dispatch("axios_del_dictTypeList", {
              ids: rows[index].id
            })
            .then(res => {
              if (res.data.errorCode == "1000") {
                Message({ message: res.data.errorMsg, type: "success" });
                rows.splice(index, 1);
                this.getDictList();
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
    handleDelete2(index, rows) {
      this.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store
            .dispatch("axios_del_dictDataList", {
              ids: rows[index].id
            })
            .then(res => {
              if (res.data.errorCode == "1000") {
                Message({ message: res.data.errorMsg, type: "success" });
                this.showDetail(index, rows);
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
    eventBus.$off([
      "addDictType",
      "addDictData",
      "editDictType",
      "editDictData"
    ]);
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
