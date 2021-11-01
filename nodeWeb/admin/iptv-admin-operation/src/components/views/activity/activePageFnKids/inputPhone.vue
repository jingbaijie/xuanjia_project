<template>
  <div>
    <!-- 
    输入手机号功能
    inputPhone: {
        phone: {//手机输入框
          width: "",
          height: "",
          top: "",
          left: "",
          color: "red",
          fontSize: "12px"
        },
        tip: {//输入提示框号                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
          width: "",
          height: "",
          top: "",
          left: "",
          color: "red",
          fontSize: "12px"
        }
    }
    -->
    <!--
          手机功能
    -->
    <el-form :model="form" ref="form">
      <el-form-item :label-width="formLabelWidth">输入框</el-form-item>
      <el-form-item label="宽" :label-width="formLabelWidth">
        <el-input-number size="mini" v-model="form.phone.width"></el-input-number>
      </el-form-item>
      <el-form-item label="高" :label-width="formLabelWidth">
        <el-input-number size="mini" v-model="form.phone.height"></el-input-number>
      </el-form-item>
      <el-form-item label="Y" :label-width="formLabelWidth">
        <el-input-number size="mini" v-model="form.phone.top"></el-input-number>
      </el-form-item>
      <el-form-item label="X" :label-width="formLabelWidth">
        <el-input-number size="mini" v-model="form.phone.left"></el-input-number>
      </el-form-item>
      <el-form-item label="字体颜色" :label-width="formLabelWidth">
        <div class="block">
          <el-color-picker v-model="form.phone.color" show-alpha :predefine="predefineColors"></el-color-picker>
        </div>
      </el-form-item>
      <el-form-item label="字体大小" :label-width="formLabelWidth">
        <el-input v-model="form.phone.fontSize" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth">提示框</el-form-item>
      <el-form-item label="宽" :label-width="formLabelWidth">
        <el-input-number size="mini" v-model="form.tip.width"></el-input-number>
      </el-form-item>
      <el-form-item label="高" :label-width="formLabelWidth">
        <el-input-number size="mini" v-model="form.tip.height"></el-input-number>
      </el-form-item>
      <el-form-item label="Y" :label-width="formLabelWidth">
        <el-input-number size="mini" v-model="form.tip.top"></el-input-number>
      </el-form-item>
      <el-form-item label="X" :label-width="formLabelWidth">
        <el-input-number size="mini" v-model="form.tip.left"></el-input-number>
      </el-form-item>
      <el-form-item label="字体颜色" :label-width="formLabelWidth">
        <div class="block">
          <el-color-picker v-model="form.tip.color" show-alpha :predefine="predefineColors"></el-color-picker>
        </div>
      </el-form-item>
      <el-form-item label="字体大小" :label-width="formLabelWidth">
        <el-input v-model="form.tip.fontSize" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import num from "@/assets/images/phone_num.png";
export default {
  name: "inputPhone",
  props: ["actionType"],
  inject: ["getPageInfo", "setTabView", "setInputPhone", "getEditData"],
  data() {
    return {
      formLabelWidth: "120px",
      predefineColors: [
        "#ff4500",
        "#ff8c00",
        "#ffd700",
        "#90ee90",
        "#00ced1",
        "#1e90ff",
        "#c71585",
        "rgba(255, 69, 0, 0.68)",
        "rgb(255, 120, 0)",
        "hsv(51, 100, 98)",
        "hsva(120, 40, 94, 0.5)",
        "hsl(181, 100%, 37%)",
        "hsla(209, 100%, 56%, 0.73)",
        "#c7158577"
      ],
      form: {
        phone: {
          width: "", //宽度
          height: "", //高度
          top: "", //top 值
          left: "", //left 值
          color: "", //字体颜色
          fontSize: "" //字体大小
        },
        tip: {
          width: "", //宽度
          height: "", //高度
          top: "", //top 值
          left: "", //left 值
          color: "", //字体颜色
          fontSize: "" //字体大小
        }
      }
    };
  },
  created() {
    if (this.getEditData()) {
      this.form = this.getEditData();
    }
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.form.tip["checked"] = false;
          this.form.tip["id"] = parseInt(Math.random() * 10000);
          this.form.tip["uid"] = "tip_" + parseInt(Math.random() * 10000);
          this.form.tip["url"] = num;
          this.form.tip["picW"] = this.form.tip.width;
          this.form.tip["picH"] = this.form.tip.height;
          this.form.tip["xValue"] = this.form.tip.top;
          this.form.tip["yValue"] = this.form.tip.left;

          this.form.phone["checked"] = false;
          this.form.phone["id"] = parseInt(Math.random() * 10000);
          this.form.phone["uid"] = "phone_" + parseInt(Math.random() * 10000);
          this.form.phone["url"] = num;
          this.form.phone["picW"] = this.form.phone.width;
          this.form.phone["picH"] = this.form.phone.height;
          this.form.phone["xValue"] = this.form.phone.top;
          this.form.phone["yValue"] = this.form.phone.left;

          this.setInputPhone(JSON.parse(JSON.stringify(this.form)));
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
