<template>
  <div>
    <div class="btn_area">
      <div class="add_btn">
        <keySearch @searchData="getSearchVal"></keySearch>
        <el-button
          v-if="isAuth('system:prize:insert')"
          :style="{'float':'right','margin':'0 70px 0 0'}"
          size="mini"
          type="primary"
          plain
          @click="handleCreate()"
        >新增</el-button>
      </div>
    </div>
    <el-table
      v-if="isAuth('system:prize:list')"
      v-loading="loading"
      :data="giftList"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      ref="multipleTable"
      :height="tableHeight"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="activityCname" label="活动名称"></el-table-column>
      <el-table-column prop="prizeCname" label="奖品名称"></el-table-column>
      <el-table-column prop="prizeTotalNum" label="奖品数量"></el-table-column>
      <el-table-column prop="prizePrice" label="奖品价格"></el-table-column>

      <el-table-column prop="picUrl" label="奖品图片">
        <template slot-scope="scope">
          <img :style="{'width':'50px'}" :src="imagesBaseUrl+scope.row.picUrl" />
        </template>
      </el-table-column>
      <el-table-column prop="prizeFrom" label="奖品来源">
        <template slot-scope="scope">{{prizeFrom[scope.row.prizeFrom]}}</template>
      </el-table-column>
      <el-table-column prop="prizePercentage" label="奖品百分比"></el-table-column>
      <el-table-column align="center" label="操作" width="160">
        <template slot-scope="scope">
          <el-button
            v-if="isAuth('system:prize:update')"
            plain
            size="mini"
            type="warning"
            @click="handleEdit(scope.$index, giftList)"
          >编 辑</el-button>
          <el-button
            v-if="isAuth('system:prize:delete')"
            plain
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, giftList)"
          >删 除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <giftForm />
    <div v-if="!isAuth('system:prize:list')" class="msg">暂无权限</div>
    <pagination
      v-if="isAuth('system:prize:list')"
      v-show="total>0"
      :total="total"
      :page.sync="currentPage"
      :limit.sync="pageSize"
      @pagination="getGiftList"
    />
  </div>
</template>

<script>
import { Message, Loading } from "element-ui";
import { eventBus } from "@/common/eventBus";
import giftForm from "./giftForm";
import keySearch from "@/components/widget/keySearch";
import Pagination from "@/components/widget/Pagination";

export default {
  name: "giftList",
  inject: ["getMenuId"],
  components: {
    giftForm,
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
      menuId: this.getMenuId(),
      giftList: [],
      searchVal: "",
      loading: true,
      tableHeight: undefined,
      prizeFrom: ["活动", "平台"]
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
    console.log("prize insert : ", this.isAuth("system:prize:insert"));
    console.log("prize edit : ", this.isAuth("system:prize:update"));
    console.log("prize list : ", this.isAuth("system:prize:list"));
    console.log("prize delete : ", this.isAuth("system:prize:delete"));
    this.getGiftList();
    eventBus.$on("refreshGift", () => {
      this.getGiftList();
    });
    this.getActiveList();
  },
  mounted() {
    this.tableHeight =
      window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 200;
  },
  destroyed() {
    eventBus.$off("refreshGift");
  },
  methods: {
    getSearchVal(val){
      this.searchVal=val;
      this.getGiftList();
    },
    getPicResouce() {
      this.$store
        .dispatch("axios_get_pic_resouce")
        .then(rs => {})
        .catch(err => {});
    },
    getGiftList(val) {
      this.$store
        .dispatch("axios_get_prize", {
          prizeCname: this.searchVal,
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
            .dispatch("axios_del_prize", {
              ids: rows[index].id
            })
            .then(res => {
              if (res.data.errorCode == "1000") {
                Message({ message: res.data.errorMsg, type: "success" });
                this.getGiftList(this.currentPage, this.pageSize);
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
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getGiftList(this.currentPage, val);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getGiftList(val, this.pageSize);
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
