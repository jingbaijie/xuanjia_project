<template>
  <div>
    <el-dialog
      v-dialogDrag
      ref="revisePwd"
      title="修改密码"
      :visible.sync="dialogRevisePwdForm"
      width="40%"
    >
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="旧密码" prop="oldPwd" :label-width="formLabelWidth">
          <el-input v-model="form.oldPwd"  type="password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass" :label-width="formLabelWidth">
          <el-input type="password" v-model="form.pass"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass" :label-width="formLabelWidth">
          <el-input type="password" v-model="form.checkPass" autocomplete="off"></el-input>
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
  name: "RevisePwdForm",
  props: ["userName"],
  data() {
    // const validatorEname = (rule, value, callback) => {
    //   if (this.form.id && this.editCurUname == this.form.uname) {
    //     callback();
    //   } else {
    //     this.$store
    //       .dispatch("axios_get_revisePwd", {
    //         uname: value
    //       })
    //       .then(res => {

    //       });
    //   }
    // };

    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value == this.form.oldPwd) {
        callback(new Error("新密码不能与旧密码相同!"));
      } else {
        if (this.form.checkPass !== "") {
          this.$refs.form.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      dialogRevisePwdForm: false,
      form: {
        pass: "",
        checkPass: "",
        oldPwd: ""
      },
      rules: {
        oldPwd: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
        ],
        pass: [{ required: true, validator: validatePass, trigger: "blur" }],
        checkPass: [
          { required: true, validator: validatePass2, trigger: "blur" }
        ]
      },
      formLabelWidth: "120px",
      roleData: [{ id: "", rname: "" }]
    };
  },
  beforeDestroy() {
    eventBus.$off(["showRevisePwdForm"]);
  },
  mounted() {
    eventBus.$on("showRevisePwdForm", d => {
      this.dialogRevisePwdForm = true;
    });
  },

  methods: {
    onSubmit(formName) {
      console.log(this.userName);
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$store
            .dispatch("axios_get_revisePwd", {
              uname: this.userName,
              pwd: this.form.pass,
              oldPwd: this.form.oldPwd
            })
            .then(res => {
              if (res.data.errorCode == "1000") {
                this.$message.success("修改成功");
                // this.$route.push({'name':'login'})
                this.$router.push("/login");
              } else {
                this.$message.error("修改失败");
              }
            })
            .catch(err => {
              this.$message.error("修改失败");
            });
          this.dialogRevisePwdForm = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-select {
  width: 40%;
}
.el-input {
  width: 80%;
}
.el-checkbox {
  padding-left: 10px;
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
