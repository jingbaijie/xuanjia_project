<template>
  <div>
    <!-- <el-date-picker
      v-model="time"
      :clearable="false"
      type="daterange"
      range-separator="-"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      value-format="yyyy-MM-dd"
      style="border-radius: 4px 0 0 4px;"
    ></el-date-picker>-->
    <el-date-picker
      v-model="start"
      type="date"
      placeholder="开始日期"
      :clearable="false"
      value-format="yyyy-MM-dd"
    ></el-date-picker>
    <el-date-picker
      v-model="end"
      type="date"
      placeholder="结束日期"
      :clearable="false"
      value-format="yyyy-MM-dd"
    ></el-date-picker>

    <el-button
      slot="append"
      icon="el-icon-search"
      @click="search"
      style="margin: 2px -6px;  border-radius: 0px 4px 4px 0;"
    ></el-button>
    <el-button @click="reset">重置</el-button>
  </div>
</template>
<script>
export default {
  name: "dateSearch",
  props: {
    fatherMethod: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      start: "",
      end: ""
    };
  },
  methods: {
    reset() {
      this.start = "";
      this.end = "";
      this.$parent.startTime = "";
      this.$parent.endTime = "";
      // this.$parent.searchVal = "";
      // this.$parent.getTemplateList();
      this.fatherMethod();
    },
    search() {
      let time = [];
      time.push(this.start, this.end);
      this.$emit("searchTime", time);
    }
  }
};
</script>