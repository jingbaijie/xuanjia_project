<template>
  <div>
    <el-dialog
      width="35vw"
      v-dialogDrag
      ref="dialog__wrapper"
      :title="themeConfigForm.id?'编辑':'新增'"
      :visible.sync="dialogFormTheme"
    >
      <el-form :model="themeConfigForm" ref="themeConfigForm" :rules="rules">
        <el-form-item label="主题中文名称" prop="themeCname" :label-width="formLabelWidth">
          <el-input type="text" v-model="themeConfigForm.themeCname" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="主题英文名称" prop="themeEname" :label-width="formLabelWidth">
          <el-input type="text" v-model="themeConfigForm.themeEname" style="width:50%"></el-input>
        </el-form-item>
        <!-- <el-form-item label="是否上架" :label-width="formLabelWidth">
          <el-switch
            v-model="themeConfigForm.booleanUp"
            :active-value="2"
            :inactive-value="0"
            active-color="#13ce66"
          ></el-switch>
        </el-form-item>-->
        <el-form-item label="开始时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="themeConfigForm.startTime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="themeConfigForm.endTime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit('themeConfigForm')">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { Message, Loading } from "element-ui";
import { eventBus } from "@/common/eventBus";
export default {
  data() {
    return {
      formLabelWidth: "120px",
      themeConfigForm: {
        id: "",
        themeCname: "",
        themeEname: "",
        startTime: "",
        endTime: ""
        // booleanUp: ""
      },
      dialogFormTheme: false, //主题form
      rules: {
        themeCname: [
          { required: true, message: "请输入中文主题名称", trigger: "blur" }
        ],
        themeEname: [
          { required: true, message: "请输入英文主题名称", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    eventBus.$on("addTheme", () => {
      this.addTheme();
    });
    eventBus.$on("editTheme", v => {
      this.editTheme(v);
    });
  },
  methods: {
    addTheme() {
      this.dialogFormTheme = true;
      this.themeConfigForm.themeCname = "";
      this.themeConfigForm.themeEname = "";
      this.themeConfigForm.booleanUp = "";
      this.themeConfigForm.startTime = "";
      this.themeConfigForm.endTime = "";
    },
    editTheme(v) {
      this.dialogFormTheme = true;
      this.themeConfigForm.id = v.id;
      this.themeConfigForm.themeCname = v.themeCname;
      this.themeConfigForm.themeEname = v.themeEname;
      this.themeConfigForm.booleanUp = v.booleanUp;
      this.themeConfigForm.startTime = v.startTime;
      this.themeConfigForm.endTime = v.endTime;
    },
    onSubmit(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          let actionUrl;
          this.themeConfigForm.id
            ? (actionUrl = "axios_update_theme")
            : (actionUrl = "axios_add_theme");

          this.$store
            .dispatch(actionUrl, {
              id: this.themeConfigForm.id || undefined,
              themeCname: this.themeConfigForm.themeCname,
              themeEname: this.themeConfigForm.themeEname,
              booleanUp: this.themeConfigForm.booleanUp,
              startTime: this.themeConfigForm.startTime,
              endTime: this.themeConfigForm.endTime
            })
            .then(res => {
              if (res.data.errorCode == "1000") {
                this.$emit("refreshList");
                Message({ message: res.data.errorMsg, type: "success" });
              } else {
                Message({ message: res.data.errorMsg, type: "error" });
              }
            })
            .catch(err => {
              this.$message.error("操作失败");
            });
          this.dialogFormTheme = false;
        } else {
          return false;
        }
      });
    }
  },

  beforeDestroy() {
    eventBus.$off(["addTheme", "editTheme", "refreshList"]);
  }
};
</script>
<style scoped>
</style>