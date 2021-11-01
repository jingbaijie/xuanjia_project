<template>
  <div class="versionWrap">
    <el-row :style="{ marginLeft: '10px' }">
      <el-form ref="form" :inline="true" :model="form" label-width="100px" label-position="left">
        <el-form-item label="版本名称:" prop="versionName">
          <el-input v-model="form.versionName" placeholder="请输入搜索条件" size="small"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm('form')" size="small">重置</el-button>
          <el-button type="primary" @click="search" size="small">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row type="flex" justify="end">
      <el-button type="primary" @click="handleAdd" size="small">添加</el-button>
    </el-row>
    <el-row>
      <el-table :data="tableData" :height="tableHeight" ref="multipleTable">
        <el-table-column prop="createDate" label="创建时间" width="180"></el-table-column>
        <el-table-column prop="updateType" label="升级类型" width="120">
          <template slot-scope="scope">{{ scope.row.updateType == 0 ? "固件升级" : "软件升级" }}</template>
        </el-table-column>
        <el-table-column prop="versionName" label="升级策略" width="120">
          <template slot-scope="scope">{{ scope.row.updateStrategy == 0 ? "全部升级" : "部分升级" }}</template>
        </el-table-column>

        <el-table-column prop="versionName" label="版本名称" width="120"></el-table-column>
        <el-table-column prop="softVersionCname" label="软件版本" width="120"></el-table-column>
        <el-table-column prop="firmVersionCname" label="固件版本" width="120"></el-table-column>
        <el-table-column prop="midVersionCname" label="中间件版本" width="120"></el-table-column>
        <el-table-column prop="createDate" label="上传时间" width="120"></el-table-column>
        <el-table-column prop="updateDescription" label="升级说明" width="120"></el-table-column>
        <el-table-column prop="updateAddress" label="升级地址" width="120"></el-table-column>
        <el-table-column prop="startTime" label="启用时间" width="150"></el-table-column>
        <el-table-column prop="endTime" label="结束时间" width="120"></el-table-column>
        <el-table-column prop="versionStatusCname" label="版本状态" width="120"></el-table-column>
        <el-table-column prop="operation" fixed="right" label="操作" width="330" align="center">
          <template v-slot="scope">
            <el-button
              plain
              size="mini"
              type="success"
              @click="handleStart(scope.row)"
              :disabled="
                scope.row.isActive == '1' && scope.row.updateStrategy == '0'
              "
            >{{ scope.row.isActive == "0" ? "启用" : "已启用" }}</el-button>
            <el-button
              plain
              size="mini"
              type="warning"
              @click="handleEdit(scope.$index, tableData)"
              :disabled="scope.row.isActive == '1'"
            >编辑</el-button>
            <el-button
              plain
              size="mini"
              type="danger"
              :disabled="scope.row.isActive == '1'"
              @click="handleDelete(scope.$index, tableData)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="currentPage"
      :limit.sync="pageSize"
      @pagination="getVersionList"
    />
    <addModal />
  </div>
</template>
<script>
import { eventBus } from "@/common/eventBus";
import addModal from "./components/addModal";
import pagination from "@/components/widget/Pagination";
export default {
  components: {
    addModal,
    pagination
  },
  data() {
    return {
      tableHeight: undefined,
      pageName: "版本管理",
      /** 表单 */
      form: {
        versionName: "" // 查询终端型号
      },
      /** 表格 */
      tableData: [],
      /** 分页 */
      currentPage: 1, //分页当前页码
      pageSize: 10,
      total: 1,
      deviceData: [] // 设备数据
    };
  },
  created() {
    this.$nextTick(function() {
      this.getVersionList();
    });

    eventBus.$on("getVersionList", () => {
      this.getVersionList();
    });
  },
  beforeDestroy() {
    eventBus.$off(["getVersionList", "addVersion", "editVersion"]);
  },
  mounted() {
    this.tableHeight =
      window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 300;
  },
  methods: {
    /** 表单 */
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.getVersionList();
    },
    // 搜索
    search() {
      // condition
      this.currentPage = 1;
      this.getVersionList();
    },

    /** 表格 */
    // 模拟表格数据
    getVersionList: function(params = {}) {
      this.$store
        .dispatch("axios_query_versionList", {
          versionName: this.form.versionName ? this.form.versionName : "",
          pageNum: this.currentPage,
          pageSize: this.pageSize
        })
        .then(res => {
          this.tableData = res.data.data.records || [];
          this.total = res.data.data.total;
        });
    },
    /** 弹框操作 */
    // 新增
    handleAdd() {
      eventBus.$emit("addVersion");
    },
    // 编辑
    handleEdit: function(index, rows) {
      eventBus.$emit("editVersion", rows[index]);
    },
    // 启用
    handleStart(row) {
      let _this = this;
      var now = new Date().getTime(); //this.$moment(_this.form.startTime).isBefore(value)
      if (this.$moment(new Date()).isBefore(row.startTime)) {
        this.$message.warning("还未到启用时间!");
        return;
      }
      if (row.isActive == "0") {
        // 未启用
        if (row.updateStrategy == 0) {
          /** 全部升级 调用升级接口 改变状态接口 */
          // 获取参数
          let pageSize = 100000,
            pageNum = 1;
          this.getDeviceList({ pageSize, pageNum }, () => {
            let device_ids = "";
            this.deviceData.forEach((item, i) => {
              if (i == 0) {
                device_ids += item.id;
              } else {
                device_ids += "_" + item.id;
              }
            });
            let params = {
              device_ids: device_ids,
              update_type: row.updateType,
              version_id: row.id
            };
            //console.log("升级-----", params);
            this.$store
              .dispatch("axios_add_apkUpdateInfo", params)
              .then(res => {
                if (res.data.errorCode == "1000") {
                  this.$message.success("添加升级计划成功!");
                  // 改变状态接口 如果未改变状态调用此方法
                  this.$store
                    .dispatch("axios_update_updateIsActive", {
                      id: row.id
                    })
                    .then(res => {
                      _this.getVersionList();
                    })
                    .catch(err => {});
                } else {
                  this.$message.error("添加升级计划失败!");
                }
              })
              .catch(err => {
                this.$message.error("添加升级计划失败!");
              });
          });
          // } else if (row.updateType == 1) {
        } else if (row.updateStrategy == 1) {
          this.$store.state.isComponent = "upgrade";
          this.$store.state.upgradeTable = [];
          // 部分升级
          this.$router.push({
            name: "startUpgrade",
            params: row
          });
        }
      } else if (row.isActive == "1") {
        // 已启用
        // if (row.updateType == 1) {hhhh
        // 部分升级
        this.$store.state.isComponent = "upgrade";
        this.$store.state.upgradeTable = [];
        this.$router.push({
          name: "startUpgrade",
          params: row
        });
        // }hhhhh
      }
      // else{//row.isActive == "0"

      // }
    },
    // 获取设备
    getDeviceList(params, callback) {
      this.$store
        .dispatch("axios_get_device", Object.assign(params, {}))
        .then(res => {
          this.deviceData = res.data.data;
          //console.log("获取设备----", this.deviceData);
          callback && callback();
        });
    },
    // 删除
    handleDelete: function(index, rows) {
      let _this = this;
      this.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store
            .dispatch("axios_delete_versionList", { ids: rows[index].id })
            .then(res => {
              if (res.data.errorCode == "1000") {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                _this.getVersionList();
              } else if (res.data.errorCode == "1005") {
                this.$message({
                  type: "error",
                  message: "删除失败!"
                });
              }
            })
            .catch(() => {
              this.$message({
                type: "error",
                message: "删除失败!"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>
<style lang="scss" scoped></style>
<!--<el-table-column
          prop="factoryCname"
          label="终端品牌"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="terminalType"
          label="终端型号"
          width="120"
        ></el-table-column>-->
