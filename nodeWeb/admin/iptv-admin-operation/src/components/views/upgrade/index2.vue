<template>
  <div class="upgrade">
    <el-row :style="{ marginLeft: '10px' }">
      <el-form
        ref="form"
        :inline="true"
        :model="form"
        label-width="45px"
        label-position="left"
      >
        <!-- <el-form-item label="条件:" prop="condition">
          <el-input
            v-model="form.condition"
            placeholder="请输入搜索条件"
            size="small"
          ></el-input>
        </el-form-item> -->
        <el-form-item label="厂商:" prop="factory_name">
          <el-input
            v-model="form.factory_name"
            placeholder="请输入搜索条件"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="版本:" prop="target_version">
          <el-input
            v-model="form.target_version"
            placeholder="请输入搜索条件"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="类型:" prop="update_type">
          <el-input
            v-model="form.update_type"
            placeholder="请输入搜索条件"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm('form')" size="small">重置</el-button>
          <el-button type="primary" @click="search" size="small"
            >搜索</el-button
          >
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-tabs type="border-card" @tab-click="tabChange" v-model="activeName">
        <el-tab-pane label="固件升级系统" name="firmware"></el-tab-pane>
        <el-tab-pane label="软件升级系统" name="software"></el-tab-pane>
        <transition name="fade-transform" mode="out-in">
          <keep-alive>
            <component :is="changeComponent"></component>
          </keep-alive>
        </transition>
      </el-tabs>
    </el-row>
  </div>
</template>
<script>
import { eventBus } from "@/common/eventBus";
import firmware from "./components/firmware";
import software from "./components/software";
export default {
  components: {
    firmware,
    software
  },
  data() {
    return {
      pageName: "升级管理",
      changeComponent: "firmware", // 动态组件 升级信息
      activeName: "firmware", // 当前选中
      /** 表单 */
      form: {
        condition: "", // 条件
        firm: "", // 厂商
        version: "" // 版本
      },
      /** 分页 */
      total: 0, // 总条数
      pageSizes: [5, 10, 30, 40], // 分页条数选择器
      pageSize: 5, // 每页数据显示条数
      currentPage: 1 // 分页当前页码
    };
  },
  methods: {
    // 切换表格
    tabChange(tab) {
      //console.log(tab);
      this.changeComponent = tab.name;
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 搜索
    search() {}
  }
};
</script>
<style lang="scss" scoped></style>
