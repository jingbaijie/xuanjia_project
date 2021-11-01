<template>
  <div>
    <div class="btn_area">
      <!-- 条件查询 -->
      <el-form
        :model="queryParams"
        ref="queryForm"
        :inline="true"
        v-show="showSearch"
        label-width="120px"
      >
        <el-form-item prop="cname">
          <el-input
            v-model="queryParams.cname"
            placeholder="请输入名称或外部名称"
            clearable
            size="small"
            style="width: 200px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item style="margin-left: 20px">
          <el-button
            icon="el-icon-refresh"
            size="mini"
            @click="resetQuery('queryForm')"
            >重 置</el-button
          >
          <el-button
            style="margin-left: 20px"
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
            >搜 索</el-button
          >
        </el-form-item>
      </el-form>
      <div class="add_btn">
        <el-button
          :style="{ float: 'right', margin: '-50px 70px 20px 0' }"
          size="mini"
          type="primary"
          plain
          @click="handleCreate()"
          >新增</el-button
        >
      </div>
    </div>
    <el-table
      v-loading="loading"
      :data="LinkData"
      style="width: 100%"
      ref="multipleTable"
      :height="tableHeight"
    >
      <el-table-column prop="id" align="center" label="ID"></el-table-column>
      <el-table-column
        prop="ename"
        align="center"
        label="外部名称"
      ></el-table-column>
      <el-table-column
        prop="cname"
        align="center"
        label="名称"
      ></el-table-column>
      <el-table-column
        prop="recommendDisplayType"
        align="center"
        label="跳转类型"
      >
        <template slot-scope="scope">{{
          linkType[scope.row.recommendDisplayType]
        }}</template>
      </el-table-column>
      <el-table-column
        align="center"
        label="跳转名称"
      >
        <template slot-scope="scope">
          {{
            scope.row.recommendDisplayType == 3 ||
            scope.row.recommendDisplayType == 8 ||
            scope.row.recommendDisplayType == 88
              ? scope.row.recommendDisplayValue
              : scope.row.recommendDisplayName
          }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="开机图">
        <template slot-scope="scope">
          <img
            :style="{ width: '50px' }"
            v-if="scope.row.waitingPic"
            :src="imagesBaseUrl + scope.row.waitingPic.picPath"
            alt
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="onlineTime"
        align="center"
        label="上线时间"
      ></el-table-column>
      <el-table-column
        prop="offlineTime"
        align="center"
        label="下线时间"
      ></el-table-column>
      <el-table-column
        prop="createTime"
        align="center"
        label="创建时间"
      ></el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            plain
            size="mini"
            type="warning"
            @click="handleEdit(scope.$index, LinkData)"
            >编辑</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- <div v-if="!isAuth('system:user:list')" class="msg">暂无权限</div> -->
    <pagination
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getSpecialLinks"
    />
    <editLink ref="editLink" />
  </div>
</template>

<script>
import { eventBus } from "@/common/eventBus";
import Pagination from "@/components/widget/Pagination";
import editLink from "./editLink";
export default {
  name: "specialLinkManage",
  data() {
    return {
      imagesBaseUrl: window.configs.static_IMAGES_BASEURL,
      loading: false,
      tableHeight: undefined,
      // 显示搜索条件
      showSearch: true,
      form: {},
      rules: {},
      LinkData: [],
      linkType: {
        0: "游戏",
        1: "卡通",
        2: "视频",
        3: "跳转指定地址",
        4: "通用页面id",
        5: "活动id",
        6: "专题",
        7: "分类内容",
        8: "收藏",
        9: "历史记录",
        88: "其它",
        11: "专辑" 
      },
      total: 0,
      queryParams: {
        pageNum: 1, //分页当前页码
        pageSize: 10,
        cname: "",
      },
    };
  },
  components: { Pagination, editLink },
  created() {
    this.getSpecialLinks();
    eventBus.$on("refreshSpecialLinks", () => {
      this.getSpecialLinks();
    });
  },
  methods: {
    /** 搜索按钮操作 */
    handleQuery() {
      this.getSpecialLinks();
    },
    /** 重置按钮操作 */
    resetQuery(formName) {
      this.$refs[formName].resetFields();
      this.handleQuery();
    },
    getSpecialLinks() {
      this.$store
        .dispatch("axios_get_pageLinkList", this.queryParams)
        .then((res) => {
          if (res != "undefined") {
            this.LinkData = res.data.data.records;
            this.total = res.data.data.total;
          }
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    handleCreate() {
      this.$refs.editLink.init("add");
    },
    handleEdit(index, row) {
      this.$refs.editLink.init("edit", row[index]);
    },
    destroyed() {
      eventBus.$off(["refreshSpecialLinks"]);
    },
  },
};
</script>
<style scoped>
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
