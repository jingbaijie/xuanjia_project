
<template>
  <div>
    <el-button
      :style="{'float':'right','margin':'0 30px 0 0'}"
      icon="el-icon-search"
      size="mini"
      @click="clickSearch"
      circle
    ></el-button>
    <el-input
      :style="{'float':'right'}"
      v-model="searchConfig.searchValue"
      @keyup.enter.native="onSubmitSearch"
      placeholder="搜索节目名"
      class="header-search-select"
    ></el-input>
    <el-drawer size="50%" :visible.sync="dialog" direction="ttb">
      <div class="dialog-footer">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-search"
              @click="onSubmitSearch()"
            >搜 索</el-button>
          </div>
      <div class="filterDiv">
        <el-form :model="searchConfig" :inline="true">
          <el-form-item label="版权开始时间" label-width="120px">
            <el-date-picker
              v-model="searchConfig.startTime"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="版权结束时间" label-width="120px">
            <el-date-picker
              v-model="searchConfig.endTime"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="支持中文名，英文名" label-width="160px">
            <el-input
              v-model="searchConfig.searchValue"
              @keyup.enter.native="onSubmitSearch"
              placeholder="输入关键字"
            />
          </el-form-item>
          <el-form-item label="是否免费" label-width="120px">
            <!-- <el-switch v-model="searchConfig.booleanFree" :active-value="1" :inactive-value="0"></el-switch> -->
            <el-select v-model="searchConfig.booleanFree" placeholder="请选择">
              <el-option
                v-for="item in booleanFree"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否上架" label-width="120px">
            <!-- <el-switch
              v-model="searchConfig.booleanUp"
              :active-value="2"
              :inactive-value="0"
              active-color="#13ce66"
            ></el-switch>-->
            <el-select v-model="searchConfig.booleanUp" placeholder="请选择">
              <el-option
                v-for="item in booleanUp"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      searchConfig: {
        searchValue: "",
        booleanUp: "",
        booleanFree: "",
        startTime: "",
        endTime: ""
      },
      booleanFree: [
        {
          name: "无",
          id: ''
        },
        {
          name: "免费",
          id: 0
        },
        { name: "收费", id: 1 }
      ],
      booleanUp: [{ name: "无", id: '' },{ name: "下架", id: 0 }, { name: "上架", id: 2 }],
     
    };
  },
  methods: {
    clickSearch() {
      this.dialog = true;
    },
    onSubmitSearch() {
      this.dialog = false;
      this.$emit("getTypeInfo", this.searchConfig);
    }
  },
  computed: {
    getSearchValue() {
      return this.searchConfig.searchValue;
    }
  },
  watch: {
    dialog(val) {
      if (!val) {
        this.searchConfig.booleanFree = "";
        this.searchConfig.booleanUp = "";
        this.searchConfig.startTime = "";
        this.searchConfig.endTime = "";
      } else {
        this.searchConfig.booleanFree = "";
        this.searchConfig.booleanUp = "";
      }
    },
    getSearchValue(val) {
      this.searchConfig.searchValue = val;
      this.$emit("getTypeInfo", this.searchConfig);
    }
  }
};
</script>

<style scoped lang = 'scss'>
.header-search-select {
  font-size: 18px;
  transition: width 0.2s;
  overflow: hidden;
  background: transparent;
  border-radius: 0;
  vertical-align: middle;
  width: 210px;
  line-height: 40px;
  margin-left: 10px;

  /deep/ .el-input__inner {
    border-radius: 0;
    border: 0;
    padding-left: 0;
    padding-right: 0;
    box-shadow: none !important;
    border-bottom: 1px solid #d9d9d9;
    vertical-align: middle;
  }
}
.filterDiv {
  margin: 0 auto;
  width: 80%;
  min-width: 723px;
}
.dialog-footer{
  margin-left:10%;
  line-height: 50px;
}
</style>
