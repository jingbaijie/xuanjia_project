<template>
  <div>
    <!-- 
     奖品兑换功能
    exChange: [{  //兑换奖品
        limit: "",//兑换限制
        belongFocus: "focusId"  //归属活动 ID
      }]
    -->
    <el-form :model="form" ref="form">
      <el-form-item label="归属焦点" prop="belongFocus" :label-width="formLabelWidth">
        <el-select v-model="form.belongFocus" clearable placeholder="请选择">
          <el-option
            v-for="item in focusOption"
            :key="item.focusId"
            :label="item.focusCName"
            :value="item.focusId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="兑换限制" prop="limit" :label-width="formLabelWidth">
        <el-input-number size="mini" v-model="form.limit"></el-input-number>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "exChange",
  props: ["actionType"],
  inject: [
    "getPageInfo",
    "setTabView",
    "setExChange",
    "getPageFocus",
    "getEditData"
  ],
  data() {
    return {
      form: {},
      focusOption: [],
      formLabelWidth: "120px"
    };
  },
  created() {
    this.focusOption = this.getPageFocus();
    if (this.getEditData()) {
      this.form = this.getEditData();
    }
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.setExChange(this.form);
        } else {
          this.$message.warning("信息未填写完整！");
        }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-input {
  width: 80%;
}
.dialog-footer {
  text-align: center;
}
</style>
