<template>
  <div class="bg">
    <p class="login-title">密码登录</p>
    <p class="login-title2">未登录过的账号将完成自动注册</p>
    <van-form class="login" @submit="onSubmit">
      <van-cell-group>
        <van-field
          class="input11"
          v-model="userId"
          name="用户名"
          type="tel"
          placeholder="请输入账号"
          autocomplete="off"
          maxlength="11"
          :rules="[
              { required: true, message: '请填写您的手机号码！' },
              { pattern: /^1[3456789]\d{9}$/, message: '手机号码格式错误！'}
            ]"
        />
        <van-icon class="user-icon" name="user-circle-o" />

        <van-field
          class="input12"
          v-model="passWord"
          type="password"
          name="密码"
          placeholder="请输入密码"
          autocomplete="off"
          maxlength="16"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <van-icon class="pwd-icon" name="bag-o" />

        <van-checkbox v-model="remember" class="checked">记住密码</van-checkbox>
      </van-cell-group>
      <div>
        <van-button
          style="foot"
          round
          block
          type="primary"
          native-type="submit"
          :disabled="disabledBtn"
        >提交</van-button>
      </div>
      <div class="tip">
        <van-radio-group v-model="pwd">
          <van-radio name="1" class="text"></van-radio>
          <span>
            我已认真阅读、理解并同意
            <a @click="openPro2">《用户服务协议》</a>及
            <a @click="openPro1">《隐私政策》</a>全文内容
          </span>
        </van-radio-group>
      </div>
    </van-form>
    <protocol1 ref="pro1"></protocol1>
    <protocol2 ref="pro2"></protocol2>
  </div>
</template>

<script >
import { userLogin, userInfo } from "@/api/api";
import defImg from "@/images/defaultAvatar.png";
import Cookie from "js-cookie"; //引入
import { Checkbox } from "vant";
import protocol1 from "./protocol1"; //隐私
import protocol2 from "./protocol2"; //服务协议

export default {
  components: {
    "van-checkbox": Checkbox,
    protocol1: protocol1,
    protocol2: protocol2
  },
  data() {
    return {
      userId: "",
      passWord: "",
      pwd: "",
      action: null,
      defImg: defImg,
      remember: false,
      imagesBaseUrl: window.configs.static_IMAGES_BASEURL,
      disabledBtn: true,
      isShow: true
    };
  },
  watch: {
    pwd(val) {
      val == 1 ? (this.disabledBtn = false) : (this.disabledBtn = true);
    }
  },
  created() {
    if (Cookie.get("passWord")) {
      this.userId = Cookie.get("userId");
      this.getUserIcon();
    }
  },

  methods: {
    handleRemember() {},
    getUserIcon() {
      userInfo({
        userId: this.userId
      }).then(response => {
        Cookie.set(
          "userIcon",
          this.imagesBaseUrl + response.data.data.userIcon,
          { expires: 7 }
        );
        this.$router.go(-1);
      });
    },
    openPro1() {
      this.$refs.pro1.show = true;
    },
    openPro2() {
      this.$refs.pro2.show = true;
    },
    onSubmit() {
      if (!this.userId || !this.passWord) {
        this.$toast.fail("请填写用户名或密码");
        return;
      }
      userInfo({
        userId: this.userId
      }).then(response => {
        let param = {
          userId: this.userId,
          passWord: this.passWord
        };
        if (response.data.errorCode == "3003") {
          param.userName = this.userId;
        }
        if (response.data.errorCode == "1002") {
          this.$toast.fail("参数不合法");
        }
        Cookie.set("userId", this.userId, { expires: 7 });
        if (this.remember == true) {
          Cookie.set("passWord", this.passWord, { expires: 7 });
        } else {
          Cookie.remove("passWord");
        }
        userLogin(param).then(res => {
          if (res.data.errorCode == "3000") {
            this.$toast.success(res.data.errorMsg);
            this.getUserIcon();
          } else if (
            res.data.errorCode == "3001" ||
            res.data.errorCode == "3002" ||
            res.data.errorCode == "3003" ||
            res.data.errorCode == "3004"
          ) {
            this.$toast.fail(res.data.errorMsg);
          } else {
            this.$toast.fail(res.data.errorMsg);
          }
        });
      });
    }
  }
};
</script>
<style lang="less" scoped>
.bg {
  padding: 0;
  margin: 0;
  width: 750px;
  height: 1331px;
  background: #ffffff url("./../../images/login-bg.jpg") no-repeat;
  background-size: 750px 1331px;
}
.login-title {
  padding: 0;
  margin: 0;
  position: absolute;
  left: 95px;
  top: 184px;
  font-size: 59.96px;
  width: 245px;
  height: 57px;
}
.login-title2 {
  padding: 0;
  margin: 0;
  position: absolute;
  left: 94px;
  top: 284px;
  font-size: 30px;
  color: #999999;
}
.login {
  padding: 0;
  margin: 0;
  position: absolute;
  left: 65px;
  top: 422px;
  height: 800px;
}
.input11 {
  width: 640px;
  height: 100px;
  border: 2px solid #e5e5e5;
  border-radius: 50px;
}
.input12 {
  position: absolute;
  top: 135px;
  width: 640px;
  height: 100px;
  border: 2px solid #e5e5e5;
  border-radius: 50px;
}
.input12 /deep/ .van-field__control,
.input11 /deep/ .van-field__control {
  padding-left: 60px;
  font-size: 35px;

  height: 57px;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: #cccccc;
}
.checked {
  position: absolute;
  margin-left: 420px;
  top: 273px;
  height: 60px;
  font-size: 28px;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: #555555;
}
.login /deep/ .van-radio__label {
  margin-left: 20px;
}

.login .user-icon {
  position: absolute;
  top: 0px;
  margin: 26px;
  color: #cccccc;
  font-size: 48px;
}
.login .pwd-icon {
  position: absolute;
  top: 135px;
  margin: 26px;
  color: #cccccc;
  font-size: 48px;
}
.tip /deep/ .van-radio__icon .van-icon {
  padding: 0;
  margin-left: 20px;
  margin-top: 10px;
  width: 25px;
  height: 25px;
}
.tip /deep/ .van-radio__label {
  margin-left: 20px;
  line-height: 36px;
  color: #999999;
}

.van-button {
  position: absolute;
  top: 374px;
  width: 640px;
  height: 90px;
  background: #22b3c8;
  border: 1px solid #22b3c8;
  border-radius: 45px;
  font-size: 36px;
}
.tip {
  position: absolute;
  top: 506px;

  font-family: Source Han Sans CN;
  font-weight: 400;
  color: #999999;
  line-height: 36px;
}
.tip {
  /deep/ .van-radio__icon--checked .van-icon {
    color: #1989fa;
    font-size: 3px;
  }
  /deep/ .van-radio-group {
    display: flex;
    span {
      position: absolute;
      left: 58px;
      width: 591px;
      height: 60px;
      font-size: 24px;
      a {
        color: #24a5ff;
      }
    }
  }
}

.login /deep/ ::-webkit-input-placeholder {
  position: absolute;
  width: 144px;
  height: 57px;
  line-height: 57px;
  font-size: 28px;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: #cccccc;
}

.login /deep/ ::-moz-placeholder {
  position: absolute;
  left: 88px;

  width: 640px;
  height: 100px;
  border: 2px solid #e5e5e5;
  border-radius: 50px;
}
.login /deep/ :-ms-input-placeholder {
  position: absolute;
  left: 88px;
  width: 640px;
  height: 100px;
}
.login /deep/ .van-field__error-message {
  position: absolute;
  left: 300px;
  top: 5px;
}

//姓名输入框虚线
.van-hairline--top-bottom::after,
.van-hairline-unset--top-bottom::after {
  border-width: 0;
}
</style>
