<template>
  <div>
    <div class="btn_area">
      <div class="add_btn">
        <keySearch @searchData="getSearchVal"></keySearch>
        <dateSearch @searchTime="getSearchTime" :fatherMethod="getTemplate"></dateSearch>
        <el-button
          v-if="isAuth('system:recommend:insert')"
          :style="{'float':'right','margin':'0 70px 0 0'}"
          size="mini"
          type="primary"
          plain
          @click="handleCreate()"
        >新增</el-button>

        <!-- <el-button size="mini" type="success" plain @click="toggleSelection()">一键还原</el-button> -->
      </div>
    </div>
    <el-table
      v-if="isAuth('system:recommend:list')"
      :data="tempData"
      v-loading="loading"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      ref="multipleTable"
      :height="tableHeight"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="ID" width="65"></el-table-column>
      <el-table-column prop="commPageCname" label="中文名"></el-table-column>
      <el-table-column prop="commPageEname" label="英文名"></el-table-column>
      <el-table-column prop="pageTrackName" label="埋点名称"></el-table-column>
      <el-table-column prop="commSpecialEname" label="专项链接"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <!-- v-show="userPermission.update"
      v-show="userPermission.delete"-->
      <el-table-column align="center" label="操作" width="160">
        <template slot-scope="scope">
          <el-button
            v-if="isAuth('system:recommend:update')"
            plain
            size="mini"
            type="warning"
            @click="handleEdit(scope.$index, tempData)"
          >编 辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="!isAuth('system:recommend:list')" class="msg">暂无权限</div>
    <pagination
      v-if="isAuth('system:recommend:list')"
      v-show="total>0"
      :total="total"
      :page.sync="currentPage"
      :limit.sync="pageSize"
      @pagination="getTemplate"
    />
  </div>
</template>

<script>
import { Message, Loading } from "element-ui";
import { eventBus } from "@/common/eventBus";
import dateSearch from "@/components/widget/DateSearch";
import keySearch from "@/components/widget/keySearch";
import Pagination from "@/components/widget/Pagination";

export default {
  name: "templateList",
  inject: ["getMenuId"],
  components: {
    keySearch,
    Pagination,
    dateSearch
  },
  data() {
    return {
      searchVal: "",
      currentPage: 1, //分页当前页码
      pageSize: 10,
      total: 1,
      menuId: this.getMenuId(),
      tempData: [],
      search: "",
      tableHeight: undefined,
      loading: true
    };
  },
  created() {
    console.log("recommend insert : ", this.isAuth("system:recommend:insert"));
    console.log("recommend edit : ", this.isAuth("system:recommend:update"));
    console.log("recommend list : ", this.isAuth("system:recommend:list"));
    console.log("recommend delete : ", this.isAuth("system:recommend:delete"));

    this.getTemplate();
    eventBus.$on("refreshTemplate", () => {
      this.getTemplate();
    });
  },
  mounted() {
    if (this.isAuth("system:recommend:list")) {
      this.tableHeight =
        window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 200;
    }
  },
  destroyed() {
    eventBus.$off(["refreshTemplate"]);
  },
  methods: {
    getSearchVal(val) {
      this.searchVal = val;
      this.getTemplate();
    },
    getSearchTime(val) {
      this.startTime = val[0];
      this.endTime = val[1];
      this.getTemplate();
    },
    getTemplate() {
      this.$store
        .dispatch("axios_get_template", {
          startTime: this.startTime,
          endTime: this.endTime,
          searchValue: this.searchVal,
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          containSpecial: -1
        })
        .then(rs => {
          this.tempData = rs.data.data.records;
          this.total = rs.data.data.total;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    handleCreate() {
      eventBus.$emit("createFrame2");
    },
    handleEdit(index, rows) {
      eventBus.$emit("editFrame2", rows[index].id);
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
