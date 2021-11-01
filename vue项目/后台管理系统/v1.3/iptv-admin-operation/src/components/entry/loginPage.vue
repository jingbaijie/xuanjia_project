<template>
  <div class="login">
    <el-select
      v-model="value"
      @change="languge"
      placeholder="请选择"
      style="width: 90px; margin: 10px; float: right"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <el-form
      :model="loginForm"
      status-icon
      :rules="rules"
      ref="loginForm"
      label-width="100px"
      class="demo-ruleForm"
      :element-loading-text="$t('login.loading')"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <div class="login_title">{{ $t("login.title") }}</div>
      <el-form-item :label="$t('login.username')" prop="username">
        <el-input
          class="header-search-select"
          type="input"
          v-model="loginForm.username"
          autocomplete="off"
          @keyup.enter.native="submitForm('loginForm')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('login.password')" prop="password">
        <el-input
          class="header-search-select"
          type="password"
          v-model="loginForm.password"
          autocomplete="off"
          show-password
          @keyup.enter.native="submitForm('loginForm')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('login.validateCode')" prop="validateCode">
        <div class="email_input">
          <el-input
           :disabled="true"
            v-model="loginForm.validateCode"
            autocomplete="off"
            @keyup.enter.native="submitForm('loginForm')"
          ></el-input>
        </div>
        <div class="email_btn">
          <el-button :disabled="true" type="success" size="small" @click="sendEmail()">{{
            $t("login.email")
          }}</el-button>
        </div>
      </el-form-item>
      <div class="login_bgn">
        <el-button
          type="primary"
          style="width:100%"
          @keyup.enter.native="submitForm('loginForm')"
          @click="submitForm('loginForm')"
          >{{ $t("login.button") }}</el-button
        >
      </div>
      <div style="text-align:right;margin-top:5px">
        <el-checkbox
          v-model="remember"
          true-label="梁朝伟"
          false-label="郭富城"
          >{{ $t("login.remember") }}</el-checkbox
        >
      </div>
    </el-form>
  </div>
</template>

<script type="es6">
import { Message, Loading } from "element-ui";
import axios from "@/common/axios";
import { _ } from "vue-underscore";
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/utils/jsencrypt";
export default {
  data() {
    return {
      value: localStorage.getItem("language") || "中文", //初始化时候获取上次存的值，并在处于选中状态。 默认中文
      options: [
        {
          value: "en",
          label: "英文"
        },
        {
          value: "zh",
          label: "中文"
        }
      ],
      remember: "郭富城",
      htmlTitle: "hahaha",
      loginForm: {
        username: "",
        password: "",
        validateCode:"",
        sub: "提交"
      },
      rules: {
        //表单验证规则
        // validateCode:[{
        //     required: true,
        //     message: this.$t("login.validatecode_tip"),
        //     trigger: "blur"
        // }],
        username: [
          {
            required: true,
            message: this.$t("login.username_tip"),
            trigger: "blur"
          },
          // { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        password: [
          {
            required: true,
            message: this.$t("login.password_tip"),
            trigger: "blur"
          },
          {
            min: 5,
            max: 18,
            message: this.$t("login.password_tip2"),
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    remember: function(val) {
        Cookies.set("remember", val, { expires: 30 });
    }
  },
  mounted() {
    this.remember = Cookies.get("remember");
    if (this.remember == "梁朝伟") {
      this.getCookie();
    }
  },
  methods: {
    sendEmail(){
      axios.get('/emailCode/sendEmail?username='+this.loginForm.username).then(res => {
      })
    },
    languge() {
      this.$i18n.locale = this.value; //在main.js里设置的i180我们在这里调用，并赋值
      localStorage.setItem("language", this.value); //每次切换语言，本地存一下，防止刷新丢失。
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var self = this;
          let text=this.$t("login.loading");
          const loadOption = {
            text:text,
            fullscreen: true,
            lock: true,
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          };
          let loadingInstance1 = Loading.service(loadOption);
           if (this.remember == "梁朝伟") {
            Cookies.set("username", this.loginForm.username, { expires: 30 });
            Cookies.set("password", encrypt(this.loginForm.password), {
              expires: 30
            });
          }else{
               Cookies.set("remember", "郭富城", { expires: 30 });
          }
          axios
            .post("login", {
              uname: this.loginForm.username,
              pwd: this.loginForm.password,
              validateCode:this.loginForm.validateCode
            })
            .then(response => {
              localStorage.setItem("token", response.data.data.token);
              if (response.data.errorCode == "1000") {
                loadingInstance1 = Loading.service({ fullscreen: true });
                self.$router.push({ path: "/homePage" });
                Message({
                  message: this.$t("login.success"),
                  type: "success"
                });
              } else {
                Message({
                  message: this.$t("login.fail"),
                  type: "error"
                });
              }
              loadingInstance1.close();
            })
            .catch(error => {
              loadingInstance1.close();
              Message({ message: "登录失败，服务器暂无响应！", type: "error" });
            });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");

      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password:
          password === undefined ? this.loginForm.password : decrypt(password)
      };
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.email_input {
  float: left;
  margin-left: 10px;
  width: 100px;
}
.email_btn {
  margin-right: 50px;
  float: right;
}
.login_bgn {
  margin: 0 auto;
  width: 55%;
}
.login {
  width: 100%;
  background-image: url(../../assets/images/1038275mi7nbetip71bf81.jpg);
  background-attachment: fixed;
  background-repeat: no-repeat;
  background-size: cover;
  // display: flex;
  // justify-content: center;
  // align-items: center;
  // position: absolute;
  // top: 40%;
  // left:10%;
  // overflow: hidden;
}

.el-form {
  box-shadow: 10px 10px 5px #888888;
  color: #000;
  position: absolute;
  top: 32%;
  left: 10%;
  height: 420px;
  width: 500px;
  border: 1px solid rgb(27, 27, 27);
  border-radius: 4px;
  padding: 40px 20px;
  // background-color: rgba(0, 0, 0, 0.5) !important;

  *background: #f2f2f2;
  *filter: alpha(opacity = 0.1); /*黑色透明背景结束*/
  bottom: 0px;
  right: 0px;
  border: 2px solid #f2f2f2;
}
/deep/ .el-form-item__label {
  // color: #fff;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, SimSun, sans-serif;
}
.login_title {
  color: #000;
  font-size: 30px;
  text-align: center;
  width: 100%;
  height: 50px;
  margin-bottom: 20px;
}
.el-form-item {
  margin: 32px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}

.header-search-select {
  font-size: 18px;
  transition: width 0.2s;
  overflow: hidden;
  background: transparent;
  border-radius: 0;
  vertical-align: middle;
  width: 210px;
  line-height: 40px;
  margin-left: 10px;

  /deep/ .el-input__inner {
    border-radius: 0;
    border: 0;
    padding-left: 0;
    padding-right: 0;
    box-shadow: none !important;
    border-bottom: 1px solid #d9d9d9;
    vertical-align: middle;
  }
}
</style>
