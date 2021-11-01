<template>
  <div>
    <keySearch
      @searchData="getSearchVal"
      plecegilder="请输入元件名"
    ></keySearch>
    <el-button
      v-if="isAuth('system:componentElement:insert')"
      :style="{ float: 'right', margin: '0 70px 0 0' }"
      size="mini"
      type="primary"
      plain
      @click="handleCreate()"
      >添加元件</el-button
    >
    <el-table
      v-if="isAuth('system:componentElement:list')"
      v-loading="loading"
      :data="modelList"
      style="width: 100%"
      ref="multipleTable"
      :height="tableHeight"
    >
      <el-table-column label="元件规格"
        ><template slot-scope="scope">
          {{ scope.row.width }}×{{ scope.row.height }}</template
        ></el-table-column
      >
      <el-table-column prop="width" label="宽度"></el-table-column>
      <el-table-column prop="height" label="高度"></el-table-column>
      <el-table-column align="center" label="操作" width="160">
        <template slot-scope="scope">
          <el-button
            v-if="isAuth('system:componentElement:insert')"
            plain
            size="mini"
            type="warning"
            @click="handleEdit(modelList[scope.$index])"
            >编 辑</el-button
          >

          <!-- <el-button
            v-if="isAuth('system:recommend:update')"
            plain
            size="mini"
            type="warning"
            @click="handleEdit(scope.$index, tempData)"
            >删 除</el-button
          > -->
        </template>
      </el-table-column>
    </el-table>
    <addElementForm ref="addElementForm" />
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
import addElementForm from "./addElementForm";
import keySearch from "@/components/widget/keySearch";
import Pagination from "@/components/widget/Pagination";

export default {
  name: "modelList",
  inject: ["getMenuId"],
  components: {
    addElementForm,
    Pagination,
    keySearch
  },
  data() {
    return {
      imagesBaseUrl: window.configs.static_IMAGES_BASEURL,
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
          picW: this.searchVal,
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
      this.$refs.addElementForm.addElement();
    },
    handleEdit(rows) {
      this.$refs.addElementForm.editElement(rows);
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
