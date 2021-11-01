<template>
  <div>
    <div class="btn_area">
      <keySearch @searchData="getSearchVal"></keySearch>
    </div>
    <el-table
      v-loading="loading"
      :data="cpData"
      style="width: 100%"
      ref="multipleTable"
      :height="tableHeight"
    >
      <el-table-column align="center" prop="cpCname" label="名称"></el-table-column>
      <el-table-column align="center" prop="cpType" label="类型">
        <template slot-scope="scope">{{cpType[scope.row.cpType]}}</template>
      </el-table-column>
      <el-table-column align="center" prop="cpCode" label="CPCODE"></el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="currentPage"
      :limit.sync="pageSize"
      @pagination="getCpList"
    />
  </div>
</template>

<script>
import Pagination from "@/components/widget/Pagination";
import keySearch from "@/components/widget/keySearch";
export default {
  name: "cpDetailList",
  inject: ["getMenuId"],
  components: { Pagination, keySearch },
  data() {
    return {
      cpType: { "0": "CP", "1": "SP" },
      currentPage: 1, //分页当前页码
      pageSize: 10,
      total: 1,
      menuId: this.getMenuId(),
      cpData: [],
      loading: true,
      tableHeight: undefined,
      searchVal: ""
    };
  },
  created() {
    this.getCpList();
  },
  mounted() {
    this.tableHeight =
      window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 200;
  },
  methods: {
    getSearchVal(val) {
      this.searchVal = val;
      this.getCpList();
    },
    getCpList() {
      this.$store
        .dispatch("axios_get_cp", {
          searchValue: this.searchVal,
          menuId: this.menuId,
          pageNum: this.currentPage,
          pageSize: this.pageSize
        })
        .then(res => {
          if (res != "undefined") {
            this.cpData = res.data.data.list.records;
            this.total = res.data.data.list.total;
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    }
  }
};
</script>
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
</style>
