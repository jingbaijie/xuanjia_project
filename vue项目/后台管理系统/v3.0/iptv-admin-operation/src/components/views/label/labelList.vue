<template>
  <div>
    <div class="btn_area">
      <div class="add_btn">
        <keySearch @searchData="getSearchVal" plecegilder="请输入标签名"></keySearch>
        <el-button
          v-if="isAuth('system:tag:insert')"
          :style="{ float: 'right', margin: '0 70px 0 0' }"
          size="mini"
          type="primary"
          plain
          @click="handleCreate()"
        >新增</el-button>
        <el-popover
          v-if="isAuth('system:series:addTag')"
          placement="top"
          width="250"
          trigger="click"
        >
          <el-button
            v-if="isAuth('system:series:addTag')"
            size="mini"
            type="warning"
            plain
            @click="handleExport(1)"
          >标签导出</el-button>
          <el-button
            v-if="isAuth('system:series:coverTag')"
            size="mini"
            type="warning"
            plain
            @click="handleExport(2)"
          >标签内容导出</el-button>
          <el-button
            v-if="isAuth('system:tag:export')"
            slot="reference"
            :style="{ float: 'right', margin: '0 10px 0 0' }"
            size="mini"
            type="success"
            plain
          >导出</el-button>
        </el-popover>
      </div>
    </div>
    <div class="table_area">
      <!-- v-show="userPermission.select" -->
      <el-table
        v-if="isAuth('system:menu:list')"
        v-loading="loading"
        :data="labelData"
        ref="multipleTable"
        row-key="id"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
        :height="tableHeight"
      >
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column prop="typeCname" label="标签名"></el-table-column>
        <el-table-column prop="typeEname" label="英文名"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="more1" label="更新时间"></el-table-column>

        <el-table-column align="center" label="操作" width="160">
          <template slot-scope="scope">
            <!-- v-show="userPermission.update"
            v-show="userPermission.delete"-->
            <el-button
              v-if="isAuth('system:tag:update')"
              plain
              size="mini"
              type="warning"
              @click="handleEdit(scope.$index, scope.row)"
            >编 辑</el-button>
            <el-button
              v-if="isAuth('system:tag:delete')"
              plain
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <labelForm ref="addlabelForm"></labelForm>
      <div v-if="!isAuth('system:tag:list')" class="msg">暂无权限</div>
      <pagination
        v-if="isAuth('system:prize:list')"
        v-show="total > 0"
        :total="total"
        :page.sync="currentPage"
        :limit.sync="pageSize"
        @pagination="getlabelList"
      />
    </div>
  </div>
</template>

<script>
import labelForm from "./labelForm";
import keySearch from "@/components/widget/keySearch";
import { eventBus } from "@/common/eventBus";
import { Message, Loading } from "element-ui";
import Pagination from "@/components/widget/Pagination";
export default {
  name: "labelList",
  components: {
    labelForm,
    keySearch,
    Pagination
  },
  data() {
    return {
      tableHeight: undefined,
      searchVal: "",
      currentPage: 1, //分页当前页码
      pageSize: 10,
      total: 1,
      labelData: [],
      loading: true,
      selectedIDs: ""
    };
  },
  methods: {
    getSearchVal(val) {
      this.searchVal = val;
      this.getlabelList();
    },
    handleSelectionChange(val) {
      let ids = [];
      val.map(item => {
        ids.push(item.id);
      });
      this.selectedIDs = ids.join(",");
    },
    getlabelList() {
      this.$store
        .dispatch("axios_get_tagList", {
          searchValue: this.searchVal,
          pageNum: this.currentPage,
          pageSize: this.pageSize
        })
        .then(res => {
          this.labelData = res.data.data.list.records;
          this.total = res.data.data.list.total;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },

    handleCreate() {
      this.$refs.addlabelForm.addlabel();
    },
    handleEdit(index, labelData) {
      this.$refs.addlabelForm.editlabel(labelData);
    },
    handleDelete(index, data) {
      this.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store
            .dispatch("axios_del_tagList", {
              ids: this.selectedIDs || data.id
            })
            .then(res => {
              if (res.data.errorCode == "1000") {
                Message({ message: res.data.errorMsg, type: "success" });
                this.getlabelList();
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
    handleExport(type) {
      if (!this.selectedIDs) {
        this.$message.error("请勾选标签！");
        return;
      }
      const loadOption = {
        text: "导出中",
        fullscreen: true,
        lock: true,
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      };
      let loadingInstance1 = Loading.service(loadOption);
      this.$store
        .dispatch(
          "axios_export_tagList",
          Object.assign({
            ids: this.selectedIDs,
            exportType: type
          })
        )
        .then(res => {
          loadingInstance1 = Loading.service({ fullscreen: true });
          this.$message.success("导出成功");
          loadingInstance1.close();
        })
        .catch(err => {
          this.$message.error("导出失败");
          loadingInstance1.close();
        });
    }
  },
  mounted() {
    this.getlabelList();
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
