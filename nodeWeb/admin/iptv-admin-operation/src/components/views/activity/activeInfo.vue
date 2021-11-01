<template>
  <div>
    <!-- 
        rankId: 12,//活动排行 ID
        activityId: 12,//活动 ID
        activityCname: "小海贝",//活动中文名
        activityEName: "actiLittleHaiBei",//活动英文名
        activityPrePage: "",// 活动上一级页面地址
        activityUrl: "",//活动地址
        activityStartTime: "2018-11-06 15:33:36",//活动开始时间
        activityEndTime: "2022-11-07 15:33:36",//活动结束时间
        createTime: "2018-11-06 15:33:47",
        filemTime: "2018-11-06 15:33:47",
     -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span v-show="!actionType" >新建活动信息</span>
        <span v-show="actionType">编辑活动信息</span>
        <el-button v-show="!actionType" style="float: right; padding: 3px 0" type="text" @click="onSubmit('form')">提 交</el-button>
        <!-- <div v-show="actionType" style="float: right; " type="text">&nbsp|&nbsp</div> -->
        <el-button v-show="actionType" style="float: right; padding: 3px 0" type="text" @click="setActiveData({})">删 除</el-button>
      </div>
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item v-if="form.id" label="活动ID" prop="id" :label-width="formLabelWidth"></el-form-item>
        <el-form-item label="活动中文名" prop="activityCname" :label-width="formLabelWidth">
          <el-input v-model="form.activityCname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动英文名" prop="activityEname" :label-width="formLabelWidth">
          <el-input v-model="form.activityEname" autocomplete="off"></el-input>
        </el-form-item> 
         <el-form-item label="活动地址" prop="activityUrl" :label-width="formLabelWidth">
          <el-input v-model="form.activityUrl" autocomplete="off"></el-input>
        </el-form-item>                       
        <el-form-item label="活动返回地址" prop="activityPrePageUrl" :label-width="formLabelWidth">
          <el-input v-model="form.activityPrePageUrl" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" :label-width="formLabelWidth" prop="activityStartTime">
          <el-date-picker
            v-model="form.activityStartTime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" :label-width="formLabelWidth" prop="activityEndTime">
          <el-date-picker 
            v-model="form.activityEndTime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="是否上架" :label-width="formLabelWidth">
          <el-switch
            v-model="form.booleanUp"
            :active-value="2"
            :inactive-value="0"
            active-color="#13ce66"
          ></el-switch>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
export default {
  name: "activeInfo",
  props: ["actionType"],
  inject: ["getActiveData", "setActiveData"],
  data() {
    return {
      form: {
        activityCname: "",
        activityEname: "",
        activityUrl:"",
        activityPrePageUrl: "",
        activityStartTime: undefined,
        activityEndTime: undefined,
      },
      rules: {
        activityCname: [
          { required: true, message: "必填项", trigger: "blur" },
          { min: 2, max: 18, message: "长度在2-18位字符", trigger: "blur" }
        ],
        activityEname: [
          { required: true, message: "必填项", trigger: "blur" }
          // { min: 5, max: 50, message: "长度在5-50位字符", trigger: "blur" }
        ],
        activityStartTime: [
          { required: true, message: "请选择日期", trigger: "change" }
        ],
        activityEndTime: [
          { required: true, message: "请选择日期", trigger: "change" }
        ]
      },
      formLabelWidth: "120px"
    };
  },
  created() {
    if (this.actionType) {
      this.form = this.getActiveData();
    }
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$message.success("活动："+this.form.activityCname + "已生成");
          this.setActiveData(this.form);
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
