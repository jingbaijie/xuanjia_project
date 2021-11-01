<template>
  <div class="upgrade">
    <el-row :style="{ marginLeft: '10px' }">
      <el-form ref="form" :inline="true" :model="form" label-width="100px" label-position="left">
        <el-form-item label="厂商名称:" prop="factory_name">
          <el-input v-model="form.factory_name" placeholder="请输入搜索条件" size="small"></el-input>
        </el-form-item>
        <el-form-item label="升级版本:" prop="target_version">
          <el-input v-model="form.target_version" placeholder="请输入搜索条件" size="small"></el-input>
        </el-form-item>
        <el-form-item label="升级状态:" prop="update_type">
          <el-select v-model="form.update_type" size="small">
            <el-option
              v-for="item in updateTypes"
              :key="item.update_type"
              :label="item.label"
              :value="item.update_type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm('form')" size="small">重置</el-button>
          <el-button type="primary" @click="search" size="small">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-table :data="tableData" :height="tableHeight" ref="multipleTable">
        <el-table-column prop="id" label="任务ID"></el-table-column>
        <el-table-column prop="device_id" label="设备ID"></el-table-column>
        <el-table-column prop="sn_num" label="SN-编号"></el-table-column>
        <el-table-column prop="factory_name" label="厂商名称"></el-table-column>
        <el-table-column prop="local_version" label="当前版本"></el-table-column>
        <el-table-column prop="target_version" label="升级版本"></el-table-column>
        <el-table-column prop="system_version" label="盒子类型"></el-table-column>
        <el-table-column prop="start_time" label="开始时间"></el-table-column>
        <el-table-column prop="end_time" label="结束时间"></el-table-column>
        <el-table-column prop="update_status" label="升级状态">
          <template v-slot="scope">{{ update_status[scope.row["update_status"]] }}</template>
        </el-table-column>
        <el-table-column prop="softwareName" label="在线状态"></el-table-column>
      </el-table>
    </el-row>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="currentPage"
      :limit.sync="pageSize"
      @pagination="getUpdateList"
    />
  </div>
</template>
<script>
import { eventBus } from "@/common/eventBus";
import pagination from "@/components/widget/Pagination";
export default {
  components: {
    pagination
  },
  data() {
    return {
      tableHeight: undefined,
      pageName: "升级管理",
      changeComponent: "firmware", // 动态组件 升级信息
      activeName: "firmware", // 当前选中
      /** 表单 */
      form: {
        factory_name: "", // 厂商
        target_version: "", // 版本
        update_type: "" // 类型
      },
      // 类型
      updateTypes: [
        {
          update_type: 0, // 硬件
          label: "固件ROOM升级"
        },
        {
          update_type: 1, // 软件
          label: "软件APK升级"
        }
      ],
      /** 表格 */
      tableData: [],
      /** 分页 */
      currentPage: 1, //分页当前页码
      pageSize: 10,
      total: 1,
      // 0升级暂停1待升级2升级中3已升级
      update_status: ["升级暂停", "待升级", "升级中", "已升级"]
    };
  },
  created() {
    this.getUpdateList();
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
      this.getUpdateList();
    },
    // 搜索
    search() {
      let params = {
        factory_name: this.form.factory_name, // 厂商
        target_version: this.form.target_version, // 版本
        update_type: this.form.update_type // 类型
      };
      this.getUpdateList(params);
    },
    /** 分页 */

    // 模拟表格数据
    getUpdateList: function(params) {
      this.$store
        .dispatch(
          "axios_query_boxUpdateList",
          Object.assign(
            {
              pageNum: this.currentPage,
              pageSize: this.pageSize
            },
            params
          )
        )
        .then(res => {
          ////console.log("升级列表", res);
          this.tableData = res.data.data || [];
          // this.total = Number(res.data.dateSize) || 9999;
          this.total = Number(res.data.dateSize);
        });
    }
  }
};
</script>
<style lang="scss" scoped></style>
