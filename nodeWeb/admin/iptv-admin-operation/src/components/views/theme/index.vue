<template>
  <div>
    <div style="btn_tab">
      <!-- <el-input class="searchInput" style placeholder="卡号查询" v-model="cardSearch"></el-input> -->
      <!-- <el-input class="searchInput" style placeholder="用户账号查询" v-model="accountSearch"></el-input> -->
      <!-- <el-input class="searchInput" style placeholder="根据主题查询" v-model="searchValue"></el-input> -->
      <keySearch @searchData="getSearchVal" ></keySearch>
      <!-- <el-button type="primary" @click="handleCreate" plain :style="{'margin-left':'20px'}">添加</el-button> -->
      <el-button
        :style="{'float':'right','margin':'0 10px 0 0'}"
        type="warning"
        plain
        @click="handleCreate"
      >新增</el-button>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column fixed prop="id" label="主题ID"></el-table-column>
      <el-table-column prop="themeCname" label="主题中文名"></el-table-column>
      <el-table-column prop="themeEname" label="主题英文名"></el-table-column>

      <el-table-column prop="themeFlag" label="主题状态">
        <template slot-scope="scope">{{Flag[scope.row.themeFlag]}}</template>
      </el-table-column>
      <el-table-column prop="startTime" label="开始时间">
        <template slot-scope="scope">{{spileDate(scope.row.startTime)}}</template>
      </el-table-column>
      <el-table-column prop="endTime" label="结束时间">
        <template slot-scope="scope">{{spileDate(scope.row.endTime)}}</template>
      </el-table-column>
      <el-table-column prop="booleanUp" label="是否上架">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.booleanUp"
            :active-value="2"
            :inactive-value="0"
            active-color="#13ce66"
            @change="booleanUp=>handleSwitch(booleanUp,scope.row)"
            inactive-color="#ff4949"
          ></el-switch>
          {{online[scope.row.booleanUp]}}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="handleCheck(scope.row)" type="text" size="small">查看</el-button>
          <el-button @click="handleUpdataTheme(scope.row)" type="text" size="small">更新</el-button>
          <el-button @click="handleDel(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="currentPage"
      :limit.sync="pageSize"
      @pagination="getTheme"
    />

    <el-dialog v-dialogDrag width="60vw" title="主题详情设置" :visible.sync="dialogTheme">
      <div :style="{'line-height':'50px','height':'50px','margin':'20px 0 0 0'}">
        <el-button
          :style="{'float':'right','margin':'0 10px 0 0'}"
          type="warning"
          size="mini"
          plain
          @click="handleAttrCreate()"
        >新增</el-button>
      </div>
      <el-table :data="tableDataDetail" border style="width: 100%;">
        <el-table-column fixed prop="attributeExplain" label="背景类型"></el-table-column>
        <el-table-column prop="attributeValue" label="背景图片">
          <template slot-scope="scope">
            <el-image
              :key="index"
              v-for="(image,index) in scope.row.attributeValue.split(',')"
              style="width: 60px; height: 60px; "
              :src="imagesBaseUrl+image"
            ></el-image>
            <!-- <img :style="{'width':'50px'}" :src="scope.row.attributeValue" /> -->
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button @click="handleEditAttr(scope.row)" type="text" size="small">设置</el-button>
            <el-button @click="handleDetailDel(scope.row)" type="text" size="small">删除</el-button>
            <!-- <el-button @click="handleDetailUpdate(scope.row)" type="text" size="small">更新</el-button> -->
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="totalAttr>0"
        :total="totalAttr"
        :page.sync="currentPageAttr"
        :limit.sync="pageSizeAttr"
        @pagination="getThemeAttr"
      />
    </el-dialog>

    <!-- <setTheme></setTheme> -->
    <configThemeAttr @refreshAttrList="getThemeAttr(themeData)"></configThemeAttr>
    <configTheme @refreshList="getTheme"></configTheme>
  </div>
</template>
<script>
import { Message, Loading } from "element-ui";
import { eventBus } from "@/common/eventBus";
import Pagination from "@/components/widget/Pagination";
import keySearch from "@/components/widget/keySearch";
// import setTheme from "./setTheme"; //主题信息
import configTheme from "./configTheme"; //新增修改主题
import configThemeAttr from "./configThemeAttr"; //新增修改主题属性

export default {
  provide() {
    return {
      getThemeData: () => {
        return this.themeData;
      }
    };
  },
  data() {
    return {
      imagesBaseUrl: window.configs.static_IMAGES_BASEURL,
      switchValue: true, //切换开关按钮
      currentPage: 1, //分页当前页码
      pageSize: 10,
      currentPageAttr: 1, //分页当前页码
      pageSizeAttr: 10,
      total: 1,
      totalAttr: 1,
      attrDelId: "",
      themeId: "",
      themeDate: [],
      tableData: [],
      tableDataDetail: [],
      themeData: [],
      searchVal:"",
      dialogTheme: false,
      online: {
        "0": "下架",
        "2": "上架"
      },
      Flag: {
        "0": "默认主题",
        "1": "当前主题",
        "2": "预设主题",
        "3": "普通主题"
      }
    };
  },
  components: {
    keySearch,
    Pagination,
    // setTheme,
    configTheme,
    configThemeAttr
  },
  mounted() {
    this.getTheme();
  },
  methods: {
     getSearchVal(val) {
      this.searchVal = val;
      this.getTheme();
    },
    //分割时间hh
    spileDate(date) {
      let time;
      if (date) {
        time = date.split(" ");
        return time[0];
      }
    },
    //拆分字符串
    splitImg(data) {
      var arr = data.split(",");
    },
    //获取主题信息
    getTheme() {
      this.$store
        .dispatch("axios_get_themeList", {
          searchValue:  this.searchVal,
          pageNum: this.currentPage,
          pageSize: this.pageSize
        })
        .then(res => {
          console.log(res);
          this.tableData = res.data.data.records;
          this.total = res.data.data.total;
        })
        .catch();
    },
    //新增主题
    handleCreate() {
      eventBus.$emit("addTheme");
    },
    //修改
    handleUpdataTheme(row) {
      console.log(row);
      eventBus.$emit("editTheme", row);
    },

    //主题删除
    handleDel(row) {
      this.$confirm("确定删除吗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // this.$store.dispatch({},{});异步
          // this.$store.commit();同步
          // this.$store.state.userInfo();
          this.$store
            .dispatch("axios_del_theme", { ids: row.id })
            .then(res => {
              if (res.data.errorCode == "1000") {
                this.getTheme();
                Message({ message: res.data.errorMsg, type: "success" });
              } else {
                Message({ message: res.data.errorMsg, type: "error" });
              }
            })
            .catch(err => {
              this.$message.error("批量操作失败，请联系管理员");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消该操作！"
          });
        });
    },

    //获取主题属性data
    handleCheck(row) {
      this.dialogTheme = true;
      console.log("获取主题属性-----id" + JSON.stringify(row));
      this.themeData.id = row.id;
      this.themeData.name = row.themeCname;
      console.log(this.themeData);
      this.getThemeAttr(row);
    },
    getThemeAttr(row) {
      this.$store
        .dispatch("axios_get_themeDetail", {
          themeId: this.themeData.id,
          pageNum: this.currentPageAttr,
          pageSize: this.pageSizeAttr
        })
        .then(res => {
          console.log(res);
          // let imgList= res.data.data.records[row].attributeValue
          // console.log(imgList)
          this.tableDataDetail = res.data.data.records;
          this.totalAttr = res.data.data.total;
        })
        .catch();
    },
    //新增主题属性
    handleAttrCreate() {
      eventBus.$emit("addThemeAttr");
    },
    //修改主题属性
    handleEditAttr(row) {
      eventBus.$emit("editThemeAttr", row);
    },
    handleSwitch(booleanUp, row) {
      this.$store
        .dispatch("axios_update_themeChange", {
          themeId: row.id,
          status: booleanUp
        })
        .then(res => {
          if (res.data.errorCode == "1000") {
            Message({ message: res.data.errorMsg, type: "success" });
            this.getTheme();
          } else {
            // row.booleanUp=!booleanUp;
            booleanUp == 2 ? (row.booleanUp = 0) : (row.booleanUp = 2); //不允许切换
            Message({ message: res.data.errorMsg, type: "error" });
          }
        })
        .catch(err => {
          booleanUp == 2 ? (row.booleanUp = 0) : (row.booleanUp = 2); //不允许切换
          this.$message.error("批量操作失败，请联系管理员");
        });
    },
    //主题属性删除
    handleDetailDel(row) {
      this.$confirm("确定删除吗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store
            .dispatch("axios_del_themeDetail", {
              ids: row.id
            })
            .then(res => {
              if (res.data.errorCode == "1000") {
                this.getThemeAttr(this.themeData);
                Message({ message: res.data.errorMsg, type: "success" });
              } else {
                Message({ message: res.data.errorMsg, type: "error" });
              }
            })
            .catch(err => {
              this.$message.error("批量操作失败，请联系管理员");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消该操作！"
          });
        });
    },
    //主题属性更新
    handleDetailUpdate(row) {
      console.log(row);
    }
  }
};
</script>
<style scoped>
.searchInput {
  width: 200px;
  float: left;
  border-radius: 30px;
  margin: 0px 10px 10px;
}
</style>