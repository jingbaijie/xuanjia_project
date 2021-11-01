<template>
  <div>
    <el-dialog
      v-dialogDrag
      width="800px"
      ref="dialog__wrapper"
      :title="titleE[action]"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="form" :inline="true" ref="form" :rules="rules" class="demo-form-inline">
        <el-form-item label="中文名称:" :label-width="formLabelWidth">
          <el-input v-model="form.cname"></el-input>
        </el-form-item>
        <el-form-item label="英文名称:" :label-width="formLabelWidth">
          <el-input v-model="form.ename"></el-input>
        </el-form-item>
        <el-form-item label="屏幕宽度:" :label-width="formLabelWidth">
          <el-input v-model="form.width"></el-input>
        </el-form-item>
        <el-form-item label="屏幕高度:" :label-width="formLabelWidth">
          <el-input v-model="form.height"></el-input>
        </el-form-item>
        <el-form-item label="描述:" :label-width="formLabelWidth">
          <el-input v-model="form.statusDesc"></el-input>
        </el-form-item>
        <!-- <el-form-item label="是否需要审核发布:" :label-width="formLabelWidth">
          <el-radio-group v-model="form.resource">
            <el-radio label="是"></el-radio>
            <el-radio label="否"></el-radio>
          </el-radio-group>
        </el-form-item> -->
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
      titleE: {
        New: "新增",
        Edit: "编辑"
      },
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
            .dispatch("axios_add_launcher", this.form)
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
