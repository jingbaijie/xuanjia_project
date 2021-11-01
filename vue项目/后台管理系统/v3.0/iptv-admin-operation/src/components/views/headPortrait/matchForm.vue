<template>
  <div>
    <el-dialog
      width="45%"
      height="50"
      v-dialogDrag
      ref="dialog__wrapper"
      title="图片匹配"
      :visible.sync="dialogMatchForm"
    >
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item
          label="匹配范围 :"
          prop="isMatchedAll"
          :label-width="formLabelWidth"
        >
          <el-radio-group v-model="form.isMatchedAll">
            <el-radio :label="1">匹配所有</el-radio>
            <el-radio :label="0">匹配为空的</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="匹配图片尺寸 :" :label-width="formLabelWidth">
          <el-input
            v-model="form.avatarPicW"
            placeholder="请输入图片尺寸"
          ></el-input>
        </el-form-item>

        <div style="text-align:right">
          <el-button type="primary" @click="onSubmit('form')">提交</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { eventBus } from "@/common/eventBus";
import defaultFocus from "@/assets/images/add2.jpg";
import image_choice from "@/components/widget/ImageChoiceWidget";

export default {
  name: "programForm",
  data() {
    return {
      dialogMatchForm: false,
      form: {
        isMatchedAll: undefined,
        avatarPicW: ""
      },
      formLabelWidth: "120px",
      rules: {
        isMatchedAll: [
          { required: true, message: "请选择匹配范围", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    configInfo() {
      this.dialogMatchForm = true;
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$store
            .dispatch("axios_edit_userAvatarMatchPic", this.form)
            .then(res => {
              if (res.data.errorCode == "1000") {
                this.$message.success("匹配完成");
                this.$parent.getAvatar();
              } else {
                this.$message.error("匹配失败");
              }
            })
            .catch(err => {
              this.$message.error("匹配失败");
            });
        }
        this.dialogMatchForm = false;
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
p {
  color: red;
}
/deep/ .el-dialog__body {
  padding: 30px 50px;
}
</style>




