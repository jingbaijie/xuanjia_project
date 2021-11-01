<template>
  <div>
    <keySearch
      @searchData="getSearchVal"
      plecegilder="请输入推荐名"
    ></keySearch>
    <el-button
      v-if="isAuth('system:component:insert')"
      :style="{ float: 'right', margin: '0 70px 0 0' }"
      size="mini"
      type="primary"
      plain
      @click="handleCreate()"
      >添加组件</el-button
    >
    <!-- <keep-alive> -->
      <el-table
        v-if="isAuth('system:component:list')"
        v-loading="loading"
        :data="modelList"
        style="width: 100%"
        ref="multipleTable"
        :height="tableHeight"
      >
        <el-table-column label="推荐名称" align="center">
          <template slot-scope="scope">
            {{ scope.row.cname }}
          </template>
        </el-table-column>
        <el-table-column prop="prizeCname" label="推荐样式" align="center">
          <template slot-scope="scope">
            <img
              :style="{ width: '50px' }"
              v-if="scope.row.previewPic"
              :src="imagesBaseUrl + scope.row.previewPic.picPath"
              alt
            />
          </template>
        </el-table-column>
        <el-table-column prop="componentType" label="组件类型" align="center">
          <template slot-scope="scope">
            {{ componentsType[scope.row.componentType] }}
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
              plain
              size="mini"
              type="warning"
              @click="handleEdit(scope.row)"
              >设 置</el-button
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
    <!-- </keep-alive> -->
  </div>
</template>

<script>
import { eventBus } from "@/common/eventBus";
import keySearch from "@/components/widget/keySearch";
import Pagination from "@/components/widget/Pagination";

export default {
  name: "modelList",
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
      modelList: [],
      searchVal: "",
      loading: true,
      tableHeight: undefined,
      componentsType: {
        "1": "默认",
        "2": "观看记录",
        "3": "智能推荐",
        "4": "纯文字标题",
        "5": "焦点-纯文本",
        "6": "焦点-常规",
        "7": "专题",
        "8": "通用组件",
        "9": "顶部隐藏组件",
        "10": "全屏暂停退出弹窗",
        "11": "全屏播放结束弹窗"
      }
    };
  },

  created() {
    this.getModelList();
    this.getComponentsType();
  },
  mounted() {},
  methods: {
    getSearchVal(val) {
      this.searchVal = val;
      this.getModelList();
    },
    getComponentsType() {
      this.$store
      .dispatch("axios_get_selectDictDataByType", {
        dictType: "componentType",
      })
      .then((res) => {
        let dataArr = res.data.data || [];
        dataArr.forEach(ele=>{
          this.componentsType[`${ele.dictValue}`] = ele.dictLabel
        })
        this.loading = false;
      })
      .catch((err) => {
        this.loading = false;
      });
    },
    getModelList(val) {
      this.$store
        .dispatch("axios_get_componentList", {
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
      eventBus.$emit("addModel");
    },
    handleEdit(row) {
      eventBus.$emit("editModel", row);
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
