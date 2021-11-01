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
        <el-form-item label="中文名称" prop="cname">
          <el-input
            v-model="queryParams.cname"
            placeholder="请输入"
            clearable
            size="small"
            style="width: 200px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="英文名称" prop="ename">
          <el-input
            v-model="queryParams.ename"
            placeholder="请输入"
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
      border
      v-loading="loading"
      :data="columnData"
      style="width: 100%"
      ref="multipleTable"
      :height="tableHeight"
      tooltip-effect="dark"
      row-key="id"
      :tree-props="{ children: 'subMenus', hasChildren: 'hasChildren' }"
    >
      <el-table-column
        prop="cname"
        align="center"
        label="栏目名称"
      ></el-table-column>
      <el-table-column
        prop="ename"
        align="center"
        label="英文名称"
      ></el-table-column>
      <el-table-column prop="displayType" align="center" label="跳转类型">
        <template slot-scope="scope">{{
          displayType[scope.row.displayType]
        }}</template>
      </el-table-column>
      <el-table-column
        align="center"
        label="跳转类型值"
      >
        <template slot-scope="scope">
          {{
            scope.row.displayType == 3 ||
            scope.row.displayType == 8 ||
            scope.row.displayType == 88
              ? scope.row.displayValue
              : scope.row.displayName
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop="rankId"
        align="center"
        label="排序"
      ></el-table-column>
      <el-table-column
        prop="trackName"
        align="center"
        label="埋点名称"
      ></el-table-column>
      <el-table-column align="center" label="操作" width="160">
        <template slot-scope="scope">
          <el-button
            plain
            size="mini"
            type="warning"
            @click="handleEdit(scope.$index, formatData)"
            >编 辑</el-button
          >
          <el-button
            plain
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, formatData)"
            >删 除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- <div v-if="!isAuth('system:user:list')" class="msg">暂无权限</div> -->
    <pagination
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getColumnList"
    />
    <editColumn :parentData="columnData" />
  </div>
</template>

<script>
import { eventBus } from "@/common/eventBus";
import Pagination from "@/components/widget/Pagination";
import editColumn from "./editColumn";
export default {
  name: "columnManage",
  data() {
    return {
      loading: false,
      tableHeight: undefined,
      // 显示搜索条件
      showSearch: true,
      form: {},
      rules: {},
      columnData: [],
      formatData: [],
      displayType: {
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
      total: 1,
      queryParams: {
        pageNum: 1, //分页当前页码
        pageSize: 10,
        cname: "",
        ename: "",
      },
    };
  },
  components: { editColumn, Pagination },
  created() {
    this.getColumnList();
    eventBus.$on("refreshColumn", () => {
      this.getColumnList();
    });
  },
  methods: {
    /** 搜索按钮操作 */
    handleQuery() {
      this.getColumnList();
    },
    /** 重置按钮操作 */
    resetQuery(formName) {
      this.$refs[formName].resetFields();
      this.handleQuery();
    },
    getColumnList() {
      this.$store
        .dispatch("axios_get_column", this.queryParams)
        .then((res) => {
          if (res != "undefined") {
            this.columnData = res.data.data.records;
            this.formatData = this.formatTreeData(this.columnData);
            this.total = res.data.data.total;
          }
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    formatTreeData(d) {
      var nn = [];
      d.map(function (i) {
        nn.push(i);
        if (i.subMenus.length > 0) {
          i.subMenus.map(function (x) {
            nn.push(x);
            if (x.subMenus.length > 0) {
              x.subMenus.map(function (k) {
                nn.push(k);
              });
            }
          });
        }
      });
      return nn;
    },
    handleCreate() {
      eventBus.$emit("addColumn");
    },
    handleEdit(index, rows) {
      eventBus.$emit("editColumn", rows[index]);
    },
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          if(row[index].subMenus.length == 0){
            this.$store
              .dispatch("axios_delete_column", { id: row[index].id })
              .then((res) => {
                if (res.data.errorCode == "1000") {
                  this.$message.success("删除操作成功！");
                  this.getColumnList();
                } else {
                  this.$message.error(res.data.errorMsg);
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }else{
            this.$message.error("请先将此数据下栏目删除或更改父级栏目后进行删除！");
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    destroyed() {
      eventBus.$off(["refreshColumn"]);
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
