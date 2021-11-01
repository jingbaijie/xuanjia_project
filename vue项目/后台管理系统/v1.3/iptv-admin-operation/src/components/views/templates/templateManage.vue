<template>
  <div>
    <div class="btn_area">
      <div class="add_btn">
        <keySearch @searchData="getSearchVal"></keySearch>
        <dateSearch @searchTime="getSearchTime"  :fatherMethod="getTemplateList" ></dateSearch>
        <el-button
          v-if="isAuth('system:template:insert')"
          :style="{'float':'right','margin':'0 70px 0 0'}"
          size="mini"
          type="primary"
          plain
          @click="handleCreate()"
        >新增</el-button>
      </div>
    </div>
    <el-table
      v-if="isAuth('system:template:list')"
      v-loading="loading"
      :data="templateList"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      ref="multipleTable"
      :height="tableHeight"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="模板ID"></el-table-column>
      <el-table-column prop="templateCname" label="中文名称"></el-table-column>
      <!-- <el-table-column prop="prizeTotalNum" label="英文名称"></el-table-column> -->
      <el-table-column prop="templateUrl" label="模板地址"></el-table-column>
      <el-table-column prop="pageTemplatePic" label="背景图片">
        <template slot-scope="scope">
          <img
            :style="{'width':'50px'}"
            v-if="scope.row.pageTemplatePic"
            :src="imagesBaseUrl+scope.row.pageTemplatePic.picPath"
          />
        </template>
      </el-table-column>
      <el-table-column prop="levelId" label="归属分类">
        <template slot-scope="scope">{{templateClassify[scope.row.levelId]}}</template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="160">
        <template slot-scope="scope">
          <el-button
            v-if="isAuth('system:template:update')"
            size="mini"
            plain
            type="warning"
            @click="handleEdit(scope.$index, templateList)"
          >编 辑</el-button>
          <el-button
            v-if="isAuth('system:template:delete')"
            plain
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, templateList)"
          >删 除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <templateForm></templateForm>
    <div v-if="!isAuth('system:template:list')" class="msg">暂无权限</div>
    <pagination
      v-if="isAuth('system:template:list')"
      v-show="total>0"
      :total="total"
      :page.sync="currentPage"
      :limit.sync="pageSize"
      @pagination="getTemplateList()"
    />
  </div>
</template>

<script>
import { Message, Loading } from "element-ui";
import { eventBus } from "@/common/eventBus";
import templateForm from "./templateForm";
import dateSearch from "@/components/widget/DateSearch";
import keySearch from "@/components/widget/keySearch";
import Pagination from "@/components/widget/Pagination";

export default {
  name: "templateList",
  inject: ["getMenuId"],
  components: {
    templateForm,
    Pagination,
    keySearch,
    dateSearch
  },
  data() {
    return {
      startTime: "",
      endTime: "",
      activeData: [],
      templateClassifyData: [],
      templateClassify: {},
      imagesBaseUrl: window.configs.static_IMAGES_BASEURL,
      currentPage: 1, //分页当前页码
      pageSize: 10,
      total: 1,
      menuId: this.getMenuId(),
      templateList: [],
      search: "",
      loading: true,
      tableHeight: undefined,
      searchValue: "",
      prizeFrom: ["活动", "平台"]
    };
  },
  provide() {
    return {
      getTemplateClassify: () => {
        return this.templateClassifyData;
      }
    };
  },
  created() {
    console.log("template insert : ", this.isAuth("system:template:insert"));
    console.log("template edit : ", this.isAuth("system:template:update"));
    console.log("template list : ", this.isAuth("system:template:list"));
    console.log("template delete : ", this.isAuth("system:template:delete"));

    this.getTemplateList();
    eventBus.$on("refreshTemp", () => {
      this.getTemplateList();
    });
    this.getLevelType();
  },
  mounted() {
    if (this.isAuth("system:template:list")) {
      this.tableHeight =
        window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 200;
    }
  },
  destroyed() {
    eventBus.$off("refreshTemp");
  },
  methods: {
    getSearchTime(val) {
      this.startTime = val[0];
      this.endTime = val[1];
      this.getTemplateList();
    },
    getSearchVal(val) {
      this.searchValue = val;
      this.getTemplateList();
    },
    getLevelType() {
      this.$store
        .dispatch("axios_get_levelType")
        .then(rs => {
          this.templateClassifyData = rs.data.data.records;
          if (
            this.templateClassifyData &&
            this.templateClassifyData.length > 0
          ) {
            this.templateClassifyData.forEach(item => {
              this.templateClassify[item.id] = item.levelPageCname;
            });
          }
        })
        .catch(err => {});
    },
    getTemplateList(val) {
      var parms = {
        startTime: this.startTime,
        endTime: this.endTime,
        searchValue: this.searchValue,
        menuId: this.menuId,
        pageNum: this.currentPage,
        pageSize: this.pageSize
      };
      for (let key in parms) {
        if (parms[key] === "") {
          delete parms[key];
        }
      }
      this.$store
        .dispatch("axios_get_pageTemplateWareHouseList", parms)
        .then(res => {
          if (res != "undefined") {
            this.templateList = res.data.data.list.records;
            this.total = res.data.data.list.total;
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
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
            .dispatch("axios_del_pageTemplateWareHouseList", {
              ids: rows[index].id
            })
            .then(res => {
              if (res.data.errorCode == "1000") {
                Message({ message: res.data.errorMsg, type: "success" });
                rows.splice(index, 1);
                this.getTemplateList();
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
</style>
