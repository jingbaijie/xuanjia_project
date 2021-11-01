<template>
  <div>
    <!-- 
       榜单功能
        list: {
            type: "1/2",//榜单类型，积分榜/排行版
            width: "",//宽度
            height: "",//高度
            top: "",//top 值
            left: "",//left 值
            color: "red",//字体颜色
            fontSize: "12px"//字体大小
        }
    -->
    <el-form :model="form" ref="form">
      <el-form-item label="类型" prop="type" :label-width="formLabelWidth">
        <el-select v-model="form.type" clearable placeholder="请选择">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="宽" prop="width" :label-width="formLabelWidth">
        <el-input-number size="mini" v-model="form.width"></el-input-number>
      </el-form-item>
      <el-form-item label="高" prop="height" :label-width="formLabelWidth">
        <el-input-number size="mini" v-model="form.height"></el-input-number>
      </el-form-item>
      <el-form-item label="Y" prop="top" :label-width="formLabelWidth">
        <el-input-number size="mini" v-model="form.top"></el-input-number>
      </el-form-item>
      <el-form-item label="X" prop="left" :label-width="formLabelWidth">
        <el-input-number size="mini" v-model="form.left"></el-input-number>
      </el-form-item>
      <el-form-item label="字体颜色" prop="color" :label-width="formLabelWidth">
        <div class="block">
          <el-color-picker v-model="form.color" show-alpha :predefine="predefineColors"></el-color-picker>
        </div>
      </el-form-item>
      <el-form-item label="字体大小" prop="fontSize" :label-width="formLabelWidth">
        <el-input v-model="form.fontSize" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import num from "@/assets/images/phone_num.png";
export default {
  name: "list",
  props: ["actionType"],
  inject: ["getPageInfo", "setTabView", "setList", "getEditData"],
  data() {
    return {
      typeOptions: [
        {
          value: "1",
          label: "积分榜"
        },
        {
          value: "2",
          label: "排行榜"
        }
      ],
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
        type: "", //榜单类型，积分榜/排行版
        width: "", //宽度
        height: "", //高度
        top: "", //top 值
        left: "", //left 值
        color: "", //字体颜色
        fontSize: "" //字体大小
      },
      formLabelWidth: "120px"
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
          this.form["checked"] = false;
          this.form["id"] = parseInt(Math.random() * 10000);
          this.form["uid"] = "list_" + parseInt(Math.random() * 10000);
          this.form["url"] = num;
          this.form["picW"] = this.form.width;
          this.form["picH"] = this.form.height;
          this.form["xValue"] = this.form.top;
          this.form["yValue"] = this.form.left;

          this.setList(JSON.parse(JSON.stringify(this.form)));
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
