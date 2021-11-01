<template>
  <el-dialog
    width="35vw"
    height="50"
    ref="dialog__wrapper"
    title="导出播放信息"
    :visible.sync="dialogForm"
  >
    <el-form
      :model="form"
      ref="form"
      status-icon
      label-width="100px"
      :rules="rules"
      class="demo-ruleForm"
    >
      <el-form-item label="日期" prop="time">
        <el-date-picker
          v-model="form.time"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">导出</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { eventBus } from "@/common/eventBus";
import { Message, Loading } from "element-ui";
export default {
  name: "exportVideoInfo",
  data() {
    return {
      form: { time: "" },

      dialogForm: false,
      rules: {
        time: {
          required: true,
          message: "请选择日期",
          trigger: "change"
        }
      }
    };
  },
  watch: {},
  created() {},
  mounted() {
    eventBus.$on("exportVideoInfo", () => {
      this.time = "";
      this.dialogForm = true;
      this.parentData = this.filterData;
    });
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const loadOption = {
            text: "导出中",
            fullscreen: true,
            lock: true,
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          };
          let loadingInstance1 = Loading.service(loadOption);
          this.$store
            .dispatch("axios_get_exportVideoInfo", { dateTime: this.form.time })
            .then(res => {
              loadingInstance1 = Loading.service({ fullscreen: true });
              this.$message.success("导出成功");
              this.dialogForm = false;
              loadingInstance1.close();
            })
            .catch(err => {
              this.$message.error("导出失败");
              loadingInstance1.close();
            });
        }
      });
    }
  }
};
</script>