<template>
  <div>
    <el-dialog
      v-dialogDrag
      width="800px"
      ref="dialog__wrapper"
      title="审核"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        :model="form"
        :inline="true"
        ref="form"
        :rules="rules"
        class="demo-form-inline"
      >
        <el-form-item label="是否审核通过:" :label-width="formLabelWidth">
          <el-radio-group v-model="form.resource">
            <el-radio label="是"></el-radio>
            <el-radio label="否"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="理由:" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.width"></el-input>
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
      formLabelWidth: "150px",
      rules: {
        dictName: [{ required: true, message: "必填项", trigger: "blur" }]
      }
    };
  },

  methods: {
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
