<template>
  <el-input class="searchInput" :placeholder="plecegilder" v-model="searchKey"></el-input>
</template>
<script>
const delay = (function() {
  let timer = 0;
  return function(callback, ms) {
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
})();
export default {
  name: "keySearch",
  props: {
    plecegilder: {
      type: String,
      default: "请输入查询关键字"
    }
  },
  data() {
    return {
      searchKey: ""
    };
  },
  watch: {
    searchKey() {
      delay(() => {
        this.$parent.currentPage = 1;
        this.$emit("searchData", this.searchKey);
      }, 800);
    }
  },
  methods: {
    // onInput() {
    //   this.$forceUpdate();
    // }
  }
};
</script>
<style scoped>
.searchInput {
  width: 200px;
  float: left;
  border-radius: 30px;
  margin: 3px 20px 0 0;
}
</style>