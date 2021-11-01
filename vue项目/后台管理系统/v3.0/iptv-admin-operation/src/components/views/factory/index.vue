<template>
  <div>
    <div class="btn_area">
      <el-button size="mini" :style="{'float':'right','margin-right':'70px'}" type="primary" plain @click="handleCreate()"
        >新增</el-button
      >
    </div>
    <el-table
      v-loading="loading"
      :data="factoryData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      ref="multipleTable"
      :height="tableHeight"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="factoryCname" label="厂商名称"></el-table-column>
      <el-table-column prop="contractNum" label="合同编号"></el-table-column>
      <el-table-column prop="signDate" label="签约时间"></el-table-column>
      <el-table-column prop="systemVersion" label="盒子类型"></el-table-column>
      <el-table-column prop="deviceNum" label="设备数量"></el-table-column>
      <el-table-column align="center" label="操作" width="260">
        <template slot-scope="scope">
          <el-button
            plain
            size="mini"
            type="warning"
            @click="handleEdit(scope.$index, factoryData)"
            >编 辑</el-button
          >
          <el-button
            plain
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, factoryData)"
            >删 除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <addFactory ref="factoryForm" @refresh="getFactoryList" />
     <pagination
      v-show="total>0"
      :total="total"
      :page.sync="currentPage"
      :limit.sync="pageSize"
      @pagination="getFactoryList"
    />
  </div>
</template>

<script>
import { Message, Loading } from "element-ui";
import addFactory from "./addFactory";
import pagination from "@/components/widget/Pagination";

export default {
  name: "factoryData2",
  inject: ["getMenuId"],
  components: {
    addFactory,
    pagination
  },
  data() {
    return {
      showVlaue: { "0": "禁用", "1": "启用" },
      factoryData: [],
      searchValue: "",
      loading: true,
      tableHeight: undefined,
      menuId: this.getMenuId(),
        /** 分页 */
      currentPage: 1, //分页当前页码
      pageSize: 10,
      total: 1,
    };
  },
  created() {
    this.getFactoryList();
  },
  mounted() {
    if (this.isAuth("system:user:list")) {
      this.tableHeight =
        window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 200;
    }
  },
  methods: {
    getFactoryList() {
      this.$store
        .dispatch("axios_get_factoryList", {
              pageNum: this.currentPage,
              pageSize: this.pageSize}
           )
        .then(res => {
          if (
            res &&
            res.data &&
            res.data.data &&
            res.data.data.records.constructor === Array
          ) {
            this.factoryData = res.data.data.records;
            this.total = res.data.data.total;
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    handleCreate() {
      this.$refs.factoryForm.addMenu();
    },
    handleEdit(index, rows) {
      this.$refs.factoryForm.editMenu(rows[index]);
    },
    handleDelete(index, rows) {
      this.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store
            .dispatch("axios_del_factory", {
              ids: rows[index].id
            })
            .then(res => {
              if (res.data.errorCode == "1000") {
                Message({ message: res.data.errorMsg, type: "success" });
                this.getFactoryList();
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
