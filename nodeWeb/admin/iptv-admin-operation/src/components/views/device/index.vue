<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-02-17 09:10:53
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-04-17 09:34:47
 -->
<template>
  <div>
    <div class="btn_area">
      <div class="add_btn">
        <el-form
          ref="form"
          :inline="true"
          :model="form"
          label-width="100px"
          label-position="left"
        >
          <el-form-item label="厂商名称:" prop="factory_name">
            <el-input
              v-model="form.factory_name"
              placeholder="请输入搜索条件"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item label="SN-编号:" prop="sn_num">
            <el-input
              v-model="form.sn_num"
              placeholder="请输入搜索条件"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item label="生产日期:" prop="production_date">
            <el-date-picker
              v-model="form.production_date"
              value-format="yyyy-MM-dd"
              size="small"
              type="date"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="出库状态:" prop="device_status">
            <el-select
              size="small"
              v-model="form.device_status"
              placeholder="请选择"
            >
              <el-option
                v-for="item in deviceStatusList"
                :key="item.name"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备状态:" prop="is_effective">
            <el-select
              size="small"
              v-model="form.is_effective"
              placeholder="请选择"
            >
              <el-option
                v-for="item in effectiveList"
                :key="item.name"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="resetForm('form')" size="small">重置</el-button>
            <el-button type="primary" @click="search" size="small"
              >搜索</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button
              v-if="isAuth('system:user:insert')"
              size="mini"
              type="primary"
              plain
              @click="handleCreate()"
              >新增</el-button
            >
          </el-form-item>
            <el-button
          :style="{ float: 'right', margin: '0 20px 0 0' }"
          size="mini"
          type="primary"
          plain
          @click="handleCreateNo()"
          >生成编号</el-button
        > 
        </el-form>

        <!-- <el-button
          v-if="isAuth('system:user:insert')"
          :style="{ float: 'right', margin: '0 20px 0 0' }"
          size="mini"
          type="success"
          plain
          @click="handleCreate()"
          >设备导出</el-button
        >
        <el-button
          v-if="isAuth('system:user:insert')"
          :style="{ float: 'right', margin: '0 20px 0 0' }"
          size="mini"
          type="warning"
          plain
          @click="handleCreate()"
          >设备导入</el-button
        >
        <el-button
          v-if="isAuth('system:user:insert')"
          :style="{ float: 'right', margin: '0 20px 0 0' }"
          size="mini"
          type="info"
          plain
          @click="handleCreate()"
          >设备出库</el-button
        >
        <el-button
          v-if="isAuth('system:user:insert')"
          :style="{ float: 'right', margin: '0 20px 0 0' }"
          size="mini"
          type="danger"
          plain
          @click="handleCreate()"
          >下发指令</el-button
        > -->
       
      </div>
    </div>
    <!--   v-if="isAuth('system:factory:list')" -->
    <el-table
      v-loading="loading"
      :data="deviceData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      ref="multipleTable"
      :height="tableHeight"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="设备ID"></el-table-column>
      <el-table-column prop="sn_num" label="SN-编号"></el-table-column>
      <el-table-column prop="factory_cname" label="厂商名称"></el-table-column>
      <el-table-column prop="user_id" label="用户编号"></el-table-column>
      <el-table-column
        prop="production_date"
        label="生产日期"
      ></el-table-column>
      <el-table-column
        prop="activation_date"
        label="激活日期"
      ></el-table-column>
      <el-table-column
        prop="software_version"
        label="软件版本"
      ></el-table-column>
      <el-table-column
        prop="firmware_version"
        label="硬件版本"
      ></el-table-column>
      <el-table-column prop="system_version" label="盒子类型"></el-table-column>
      <el-table-column prop="is_effective" label="设备状态">
        <template slot-scope="scope">
          {{ effective[scope.row.is_effective] }}
        </template>
      </el-table-column>
      <el-table-column prop="device_status" label="出库状态">
        <template slot-scope="scope">
          {{ deviceStatus[scope.row.device_status] }}
        </template>
      </el-table-column>
      <!-- <el-table-column prop="is_effective" label="在线状态"></el-table-column>
      <el-table-column
        prop="sn_num"
        label="最后在线日期"
        width="120"
      ></el-table-column> -->
      <el-table-column align="center" label="操作" width="250">
        <template slot-scope="scope">
          <!--   v-if="isAuth('system:factory:update')" -->
          <el-button
            plain
            size="mini"
            type="success"
            @click="handleView(scope.$index, deviceData)"
            >查 看</el-button
          >
          <el-button
            plain
            size="mini"
            type="warning"
            @click="handleEdit(scope.$index, deviceData)"
            >编 辑</el-button
          >
          <!--  v-if="isAuth('system:factory:delete')" -->
          <el-button
            plain
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, deviceData)"
            >删 除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- <div v-if="!isAuth('system:user:list')" class="msg">暂无权限</div> -->
    <addDevice ref="deviceForm" @refresh="getDeviceList" />
    <addDeviceNo ref="deviceNoForm" @refresh="getDeviceList" />
    <deviceDetail ref="detailPop" />
     <pagination
      v-show="total>0"
      :total="total"
      :page.sync="currentPage"
      :limit.sync="pageSize"
      @pagination="getDeviceList"
    />
  </div>
</template>

<script>
import { Message, Loading } from "element-ui";
import addDevice from "./addDevice";
import addDeviceNo from "./addDeviceNo";
import deviceDetail from "./showDetail";
import pagination from "@/components/widget/Pagination";
export default {
  name: "deviceData",
  inject: ["getMenuId"],
  components: {
    addDevice,
    addDeviceNo,
    deviceDetail,
    pagination
  },
  data() {
    return {
      deviceStatusList: [
       
        {
          name: "未出库",
          value: "0"
        },
        {
          name: "已出库",
          value: "1"
        }
      ],
      deviceStatus: {
        "0": "未出库",
        "1": "已出库"
      },
      effectiveList: [
        {
          name: "有效",
          value: "0"
        },
        {
          name: "无效",
          value: "1"
        }
      ],
      effective: {
        "0": "有效",
        "1": "无效"
      },
      showVlaue: { "0": "禁用", "1": "启用" },
      deviceData: [],
      form: {},
      searchValue: "",
      loading: true,
      tableHeight: undefined,
      menuId: this.getMenuId(),
       /** 分页 */
      currentPage: 1, //分页当前页码
      pageSize: 10,
      total: 1
    };
  },
  created() {
    this.getDeviceList();
  },
  mounted() {
      this.tableHeight =
        window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 220;
  },
  methods: {
    // 搜索
    search() {
      // condition
      this.getDeviceList(this.form);
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.getDeviceList();
    },
    getDeviceList(form = {}) {
      this.$store
        .dispatch("axios_get_device",Object.assign(
            {
              pageNum: this.currentPage,
              pageSize: this.pageSize
            },
            form
          ) )
        .then(res => {
          if (res && res != "undefined" && res.data.data) {
            this.deviceData = res.data.data;
            this.total = Number(res.data.dateSize);
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    handleView(index, rows) {
      this.$refs.detailPop.show(rows[index]);
    },
    handleCreate() {
      this.$refs.deviceForm.addMenu();
    },
    //生成编号
    handleCreateNo() {
      this.$refs.deviceNoForm.show();
    },
    handleEdit(index, rows) {
      this.$refs.deviceForm.editMenu(rows[index]);
    },
    handleDelete(index, rows) {
      this.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store
            .dispatch("axios_del_device", {
              ids: rows[index].id
            })
            .then(res => {
              if (res.data.errorCode == "1000") {
                Message({ message: res.data.errorMsg, type: "success" });
                this.getDeviceList();
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
  }
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
  min-width: 950px;
  float: left;
}

.el-input--mini .el-input__inner {
  width: 100px;
}
</style>
