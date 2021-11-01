<template>
  <div class="login">
    <el-form
      :model="loginForm"
      status-icon
      :rules="rules"
      ref="loginForm"
      label-width="100px"
      class="demo-ruleForm"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <div class="login_title">{{"炫佳管理后台系统"}}</div>
      <el-form-item label="用户名" prop="username">
        <el-input type="input" v-model="loginForm.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          v-model="loginForm.password"
          autocomplete="off"
          show-password
          @keyup.enter.native="submitForm('loginForm')"
        ></el-input>
      </el-form-item>
      <el-form-item :style="{'text-align':'center'}">
        <el-button type="primary" size="medium" @click="submitForm('loginForm')">{{'提 交'}}</el-button>
        <el-button size="medium" @click="resetForm('loginForm')">{{'重 置'}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="es6">
import { Message, Loading } from "element-ui";
import axios from "../../utils/axios";
import { _ } from "vue-underscore";
export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
        sub: "提交"
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 5, max: 18, message: "长度在5-18位字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 5, max: 18, message: "长度在5-18位字符", trigger: "blur" }
        ]
      }
    };
  },
  created() {},
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var self = this;
          const loadOption = {
            text: "登录中",
            fullscreen: true,
            lock: true,
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          };
          let loadingInstance1 = Loading.service(loadOption);
          axios
            .post("login", {
              uname: this.loginForm.username,
              pwd: this.loginForm.password
            })
            .then(response => {
              localStorage.setItem("token", response.data.data.token);
              if (response.data.errorCode == "1000") {
                loadingInstance1 = Loading.service({ fullscreen: true });
                self.$router.push({ path: "/homePage" });
                Message({
                  message: "登录成功！" + response.data.errorMsg,
                  type: "success"
                });
              } else {
                // self.$router.push({ path: "/homePage" });
                Message({
                  message: "登录失败！" + response.data.errorMsg,
                  type: "error"
                });
              }
              loadingInstance1.close();
            })
            .catch(error => {
              // self.$router.push({ path: "/homePage" })
              loadingInstance1.close();
              Message({ message: response.data.errorMsg, type: "error" });
            });

          // this.$router.push({ path: "/homePage" })
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
<style scoped>
.login {
  width: 100%;
  background-image: url(../../assets/images/1038275mi7nbetip71bf81.jpg);
  background-attachment: fixed;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.el-form {
  width: 400px;
  border: 1px solid #cccccc;
  border-radius: 4px;
  padding: 20px 45px 10px 10px;
  background-color: rgba(0, 0, 0, 0.5) !important;
  background: #000;
  filter: alpha(opacity = 50);
  *background: #000;
  *filter: alpha(opacity = 50); /*黑色透明背景结束*/
  color: #fff;
  bottom: 0px;
  right: 0px;
  border: 1px solid #000;
}
.el-form-item__label {
  color: #cccccc;
}
.login_title {
  text-align: center;
  width: 100%;
  height: 50px;
}
</style>