<template>
  <div>
    <keySearch
      @searchData="getSearchVal"
      plecegilder="请输入专辑名"
    ></keySearch>
    <el-button
      v-if="isAuth('system:component:insert')"
      :style="{ float: 'right', margin: '0 70px 0 0' }"
      size="mini"
      type="primary"
      plain
      @click="handleCreateS()"
      >添加专辑</el-button
    >
    <el-table
      v-if="isAuth('system:component:list')"
      v-loading="loading"
      :data="issueList"
      style="width: 100%"
      ref="multipleTable"
      :height="tableHeight"
    >
      <el-table-column label="专辑名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.cname }}
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        align="center"
      ></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="isAuth('system:component:update')"
            plain
            size="mini"
            type="warning"
            @click="handleEditS(scope.row)"
            >设 置 专 题</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div v-if="!isAuth('system:component:list')" class="msg">暂无权限</div>
    <pagination
      v-if="isAuth('system:component:list')"
      v-show="total > 0"
      :total="total"
      :page.sync="currentPage"
      :limit.sync="pageSize"
      @pagination="getModelList"
    />
  </div>
</template>

<script>
import { eventBus } from "@/common/eventBus";
import keySearch from "@/components/widget/keySearch";
import Pagination from "@/components/widget/Pagination";

export default {
  name: "issueList",
  components: {
    Pagination,
    keySearch
  },
  data() {
    return {
      activeData: [],
      imagesBaseUrl: window.configs.static_IMAGES_BASEURL,
      currentPage: 1, //分页当前页码
      pageSize: 10,
      total: 1,
      issueList: [],
      searchVal: "",
      loading: true,
      tableHeight: undefined,
      componentsType: {
        "7": "专辑"
      }
    };
  },

  created() {
    this.getModelList();
  },
  mounted() {
    this.tableHeight =
      window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 200;
  },
  methods: {
    getSearchVal(val) {
      this.searchVal = val;
      this.getModelList();
    },
    getModelList(val) {
      this.$store
        .dispatch("axios_get_pages", {
          pageType: 2,
          pageNum: this.currentPage,
          pageSize: this.pageSize
        })
        .then(res => {
          if (res != "undefined") {
            this.issueList = res.data.data.records;
            this.total = res.data.data.total;
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },

    handleCreateS() {
      eventBus.$emit("addIssue");
    },
    handleEditS(row) {
      eventBus.$emit("editIssue", row);
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
