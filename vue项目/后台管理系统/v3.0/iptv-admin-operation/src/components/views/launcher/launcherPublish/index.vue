<template>
  <div>
    <el-table
      v-loading="loading"
      :data="modelList"
      style="width: 100%"
      ref="multipleTable"
      :height="tableHeight"
    >
      <el-table-column prop="width" label="版本号"></el-table-column>

      <el-table-column prop="width" label="审核时间"></el-table-column>
      <el-table-column prop="width" label="审核结果"></el-table-column>

      <el-table-column prop="width" label="变更说明"></el-table-column>
      <el-table-column prop="width" label="提交人"></el-table-column>
      <el-table-column prop="height" label="审核人"></el-table-column>
      <el-table-column align="center" label="操作" width="300">
        <template slot-scope="scope">
          <el-button
            plain
            type="primary"
            size="mini"
            @click="handlePublish(modelList[scope.$index])"
            >发布</el-button
          >

          <!-- <el-button
            plain
            size="mini"
            type="warning"
            @click="handleDel(modelList[scope.$index])"
            >定时发布</el-button
          > -->

          <el-button
            plain
            type="danger"
            size="mini"
            @click="handleDel(modelList[scope.$index])"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="currentPage"
      :limit.sync="pageSize"
      @pagination="getElementList"
    />
  </div>
</template>

<script>
import { Message, Loading } from "element-ui";
import { eventBus } from "@/common/eventBus";
import Pagination from "@/components/widget/Pagination";

export default {
  name: "modelList",
  inject: ["getMenuId"],
  components: {
    Pagination
  },
  data() {
    return {
      currentPage: 1, //分页当前页码
      pageSize: 10,
      total: 1,
      modelList: [],
      searchVal: "",
      loading: true,
      tableHeight: undefined
    };
  },

  created() {
    this.getElementList();
  },
  mounted() {
    this.tableHeight =
      window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 200;
  },
  destroyed() {},
  methods: {
    getSearchVal(val) {
      this.searchVal = val;
      this.getElementList();
    },

    getElementList(val) {
      this.$store
        .dispatch("axios_get_elementList", {
          cname: this.searchVal,
          pageNum: this.currentPage,
          pageSize: this.pageSize
        })
        .then(res => {
          if (res != "undefined") {
            this.modelList = res.data.data.records;
            this.total = res.data.data.total;
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    handleDel() {},
    handlePublish(row) {
      this.$confirm("确定发布吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store
            .dispatch("axios_publish_Launcher", {
              launcherId: row.id
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
    }
  },
  destroyed() {}
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
