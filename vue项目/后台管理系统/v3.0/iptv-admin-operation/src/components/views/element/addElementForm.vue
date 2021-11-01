<template>
  <div>
    <el-dialog
      v-dialogDrag
      width="35vw"
      ref="dialog__wrapper"
      :title="titleE[action]"
      :visible.sync="dialogFormVisible"
      :before-close="handleClose"
    >
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="宽度" prop="width" :label-width="formLabelWidth">
          <el-input v-model.number="form.width"></el-input>
        </el-form-item>
        <el-form-item label="高度" prop="height" :label-width="formLabelWidth">
          <el-input v-model.number="form.height"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="onSubmit('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { eventBus } from "@/common/eventBus";
export default {
  name: "elementForm",
  data() {
    return {
      dialogFormVisible: false,
      action: "",
      form: {
        width: "",
        height: ""
      },
      formLabelWidth: "120px",
      titleE: {
        New: "新增",
        Edit: "编辑"
      },
      rules: {
        width: [{ type: "number", message: "不能为空且只能输入数字", trigger: "blur" }],
        height: [{ type: "number", message: "不能为空且只能输入数字", trigger: "blur" }]
      }
    };
  },

  methods: {
    handleClose(form) {
      this.clearForm();
      this.dialogFormVisible = false;
    },
    clearForm() {
      this.$refs["form"].clearValidate();
    },
    addElement() {
      this.action = "New";
      this.dialogFormVisible = true;
      this.form = {
        width: "",
        height: ""
      };
    },
    editElement(v) {
      this.form = {
        id: v.id,
        width: v.width,
        height: v.height
      };
      this.action = "Edit";
      this.dialogFormVisible = true;
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$store
            .dispatch("axios_add_elementList", this.form)
            .then(res => {
              if (res.data.errorCode == "1000") {
                this.$message.success("操作成功");
                this.$parent.getElementList();
              } else {
                this.$message.error(res.data.errorMsg);
              }
              this.dialogFormVisible = false;
            })
            .catch(err => {
              this.$message.error(res.data.errorMsg);
            });
        } else {
          return false;
        }
      });
    }
  },
  mounted() {},
  beforeDestroy() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
