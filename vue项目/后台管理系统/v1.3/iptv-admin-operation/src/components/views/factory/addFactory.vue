<template>
  <div>
    <el-dialog
      width="35vw"
      v-dialogDrag
      ref="dialog__wrapper"
      :title="this.form.id?'编辑':'新增'"
      :visible.sync="dialogFormVisible"
      
    >
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="厂商名称" :label-width="formLabelWidth" prop="factoryCname">
          <el-input v-model="form.factoryCname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="合同编号" :label-width="formLabelWidth">
          <el-input v-model="form.contractNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="签约时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="form.signDate"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="盒子类型" :label-width="formLabelWidth" prop="systemVersion">
          <el-input v-model="form.systemVersion" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="设备数量" :label-width="formLabelWidth" prop="deviceNum">
          <el-input v-model="form.deviceNum" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" >
        <el-button type="primary" @click="onSubmit('form')">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "addFactory",
  data() {
    return {
      dialogFormVisible: false,
      form: {
        factoryCname:"",
        contractNum:"",
        signDate:"",
        systemVersion:"",
        deviceNum:""
      },
      editUrl: "axios_edit_factory",
      addUrl: "axios_add_factory",
      formLabelWidth: "120px",
      rules: {
        factoryCname: [{ required: true, message: "必填项", trigger: "blur" }],
        systemVersion: [{ required: true, message: "必填项", trigger: "blur" }],
        deviceNum: [{ required: true, message: "必填项", trigger: "blur" }]
      }
    };
  },
  methods: {
    addMenu() {
      this.form = {};
      this.dialogFormVisible = true;
    },
    editMenu(menu) {
      this.form = menu;
      this.dialogFormVisible = true;
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$store
            .dispatch(this.form.id ? this.editUrl : this.addUrl, this.form)
            .then(response => {
              if (response.data.errorCode == "1000") {
                this.$emit("refresh");
                this.$message.success("操作成功");
                resetForm(formName);
              } else {
                this.$message.error(response.data.errorMsg);
              }
            })
            .catch(err => {
              this.$message.error("操作失败");
            });
          this.dialogFormVisible = false;
        } else {
          return false;
        }
      });
    },
     resetForm(formName) {
        this.$refs[formName].resetFields();
      }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  scoped>
.el-input {
  width: 80%;
}
.el-checkbox {
  margin-left: 25px;
}

.dialog-footer {
  text-align: center;
}

.el-dropdown {
  vertical-align: top;
  width: 100px;
}
.el-dropdown + .el-dropdown {
  margin-left: 15px;
}
.el-icon-arrow-down {
  width: 50x;
  font-size: 12px;
}
</style>
