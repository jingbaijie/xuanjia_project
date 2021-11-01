<template>
  <div>
    <div style="btn_tab">
      <!-- <el-input class="searchInput" style placeholder="卡号查询" v-model="cardSearch"></el-input> -->
      <!-- <el-input class="searchInput" style placeholder="用户账号查询" v-model="accountSearch"></el-input> -->
      <el-input
        class="searchInput"
        style
        placeholder="根据用户名或卡号查询"
        v-model="searchValue"
      ></el-input>
      <el-button
        :style="{ float: 'right', margin: '0 10px 0 0' }"
        type="warning"
        plain
        @click="handleCreate"
        >新增</el-button
      >
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column fixed prop="id" label="ID"></el-table-column>
      <el-table-column prop="cardNo" label="卡号"></el-table-column>
      <el-table-column prop="cardPassword" label="密码"></el-table-column>
      <el-table-column
        fixed
        prop="totalDay"
        label="有效期（天）"
      ></el-table-column>
      <el-table-column prop="useFlag" label="限制使用一张">
        <template slot-scope="scope">{{ onFlag[scope.row.useFlag] }}</template>
      </el-table-column>
      <el-table-column prop="userId" label="用户账号"></el-table-column>

      <el-table-column label="状态">
        <template slot-scope="scope">{{ online[scope.row.status] }}</template>
      </el-table-column>
      <el-table-column fixed prop="activeDate" label="激活时间">
        <template slot-scope="scope">{{
          spileDate(scope.row.activeDate)
        }}</template>
      </el-table-column>
      <el-table-column prop="createTime" label="激活开始时间">
        <template slot-scope="scope">{{
          spileDate(scope.row.createTime)
        }}</template>
      </el-table-column>
      <el-table-column prop="endTime" label="激活结束时间">
        <template slot-scope="scope">{{
          spileDate(scope.row.endTime)
        }}</template>
      </el-table-column>
      <el-table-column prop="effectiveStartTime" label="有效期开始时间">
        <template slot-scope="scope">{{
          spileDate(scope.row.effectiveStartTime)
        }}</template>
      </el-table-column>
      <el-table-column prop="effectiveEndTime" label="有效期结束时间">
        <template slot-scope="scope">{{
          spileDate(scope.row.effectiveEndTime)
        }}</template>
      </el-table-column>
      <el-table-column prop="ip" label="IP地址"></el-table-column>
      <el-table-column prop="mac" label="mac地址"></el-table-column>

      <el-table-column prop="more1" label="线上/线下">
        <template slot-scope="scope">{{ moreType[scope.row.more1] }}</template>
      </el-table-column>
      <el-table-column prop="more2" label="活动id"></el-table-column>
    </el-table>
    <pagination
      v-if="isAuth('system:pic:list')"
      v-show="total > 0"
      :total="total"
      :page.sync="currentPage"
      :limit.sync="pageSize"
      @pagination="getVoucher"
    />
    <!-- @pagination="getImages" -->
    <configVoucher @refreshList="getVoucher"></configVoucher>
  </div>
</template>

<script>
import { Message, Loading } from "element-ui";
import { eventBus } from "@/common/eventBus";
import pagination from "@/components/widget/Pagination";
import configVoucher from "./configVoucher";
// 节流函数
const delay = (function() {
  let timer = 0;
  return function(callback, ms) {
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
})();

export default {
  name: "",
  components: {
    pagination,
    configVoucher
  },
  data() {
    return {
      moreType: {
        "0": "线下",
        "1": "线上"
      },
      tableData: [],
      cardSearch: "",
      accountSearch: "",
      searchValue: "",
      currentPage: 1, //分页当前页码
      pageSize: 10,
      total: 1,
      online: {
        "0": "未激活",
        "2": "激活"
      },
      onFlag: {
        "0": "不限制",
        "1": "限制"
      }
    };
  },
  mounted() {
    this.getVoucher();
  },
  watch: {
    searchValue() {
      delay(() => {
        this.getVoucher();
      }, 300);
    }
  },
  methods: {
    //分割时间hh
    spileDate(date) {
      let time;
      if (date) {
        time = date.split(" ");
        return time[0];
      }
    },
    /**
     * 获取体验劵信息
     */
    getVoucher() {
      this.$store
        .dispatch("axios_get_saleCard", {
          // searchValue: JSON.stringify       ([this.cardSearch,this.accountSearch]),
          searchValue: this.searchValue,
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
    handleCreate() {
      eventBus.$emit("addVoucher");
    }
  }
};
</script>

<style lang='scss' scoped>
.searchInput {
  width: 200px;
  float: left;
  border-radius: 30px;
  margin: 0px 10px 10px;

  // border: 1px solid #e3e3e3;
}
</style>
