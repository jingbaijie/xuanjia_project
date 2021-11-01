<template>
  <div>
    <!-- <keySearch
      @searchData="getSearchVal"
      plecegilder="请输入元件名"
    ></keySearch> -->
    <el-button
      :style="{ float: 'right', margin: '0 70px 0 0' }"
      size="mini"
      type="primary"
      plain
      @click="handleCreate()"
      >创建Launcher</el-button
    >
    <el-table
      v-loading="loading"
      :data="modelList"
      style="width: 100%"
      ref="multipleTable"
      :height="tableHeight"
    >
      <el-table-column prop="cname" label="launcher名称"></el-table-column>
      <el-table-column prop="ename" label="英文名称"></el-table-column>
      <el-table-column prop="statusDesc" label="描述"></el-table-column>
      <el-table-column prop="height" label="创建时间"></el-table-column>
      <el-table-column align="center" label="操作" width="300">
        <template slot-scope="scope">
          <el-button
            plain
            size="mini"
            type="primary"
            @click="handleEdit(modelList[scope.$index])"
            >修改</el-button
          >

          <el-button
            plain
            size="mini"
            type="warning"
            @click="handleManage(modelList[scope.$index])"
            >管理</el-button
          >

          <el-button
            plain
            size="mini"
            type="danger"
            @click="handleDel(modelList[scope.$index])"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <configForm ref="configForm" />
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="currentPage"
      :limit.sync="pageSize"
      @pagination="getLauncherList"
    />
  </div>
</template>

<script>
import { Message, Loading } from "element-ui";
import { eventBus } from "@/common/eventBus";
import configForm from "./configForm";
import Pagination from "@/components/widget/Pagination";

export default {
  name: "modelList",
  inject: ["getMenuId"],
  components: {
    configForm,
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
    this.getLauncherList();
  },
  mounted() {
    this.tableHeight =
      window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 200;
  },
  destroyed() {},
  methods: {
    getSearchVal(val) {
      this.searchVal = val;
      this.getLauncherList();
    },

    getLauncherList(val) {
      this.$store
        .dispatch("axios_get_launcher", {
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

    handleCreate() {
      this.$refs.configForm.addElement();
    },
    handleEdit(rows) {
      this.$refs.configForm.editElement(rows);
    },
    handleManage(row) {
      this.$router.push({
        name: "launcherManage",
        query: { id: row.id }
      });
    },
    handleDel() {}
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
