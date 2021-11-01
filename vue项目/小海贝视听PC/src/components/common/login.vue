<!--
 * @Author: your name
 * @Date: 2021-09-03 13:48:23
 * @LastEditTime: 2021-09-15 16:03:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \tvjoy-web\src\components\common\login.vue
-->
<template>
    <div class="mask" v-show="isLogin">
        <div class="loginAlert" :style="{background:'url('+ loginBg +')','background-repeat':'no-repeat','background-size':'100%,100%'}">
            <div class="loginContent">
                <img src="@/assets/images/login/close.png" class="close" @click="closeLogin()" alt="">
                <h3 class="title">未登陆过的账号将自动完成注册</h3>
                <p class="alert">请先同意用户协议跟隐私政策</p>
                <el-form ref="loginForm" :model="loginData" :rules="rules">
                    <el-form-item prop="username">
                        <el-input
                        v-model="loginData.username"
                        placeholder="请输入账号"
                        maxlength="11"
                        >
                        </el-input>
                        <img class="input-icon" src="@/assets/images/login/username.png" alt="">
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input placeholder="请输入密码"
                        v-model="loginData.password"
                        type="password"
                        maxlength="16"
                        ></el-input>
                        <img class="input-icon" src="@/assets/images/login/password.png" alt="">
                    </el-form-item>
                    <el-form-item>
                        <el-checkbox v-model="jzPassword" label="记住密码" @change="allJz"></el-checkbox>
                        <el-checkbox v-model="jzUsername" label="记住账号"></el-checkbox>
                    </el-form-item>
                    <el-form-item class="checkRadio">
                        <el-checkbox v-model="radio"><span>我已认真阅读、理解并同意<a class="xieyi" @click.prevent="jump('agreement')">《用户服务协议》</a>及<a class="xieyi" @click.prevent="jump('privacy')">《隐私政策》</a>全文内容</span></el-checkbox>
                    </el-form-item>
                    <el-form-item>
                        <div class="submitBtn" @click="sublogin()">
                            <img class="login" src="@/assets/images/login/submit.png" alt="">
                        </div>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
var Reg1 = (rule,value,cb) => {
    const regPhone = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;//手机号格式
    if(regPhone.test(value)){
        return cb()
    }else{
        cb(new Error('请输入正确的手机号'))
    }
}
var Reg2 = (rule,value,cb) => {
    const regPhone = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,16}$/;//最低8，最高16，必须包括大小写和数字
    if(regPhone.test(value)){
        return cb()
    }else{
        cb(new Error('8~16位字符，包含大小写和数字'))
    }
}
    export default {
        name:'login',
        data() {
            return {
                jzPassword:false,
                jzUsername:false,
                rules: {
                    username:[{validator:Reg1,trigger:'blur'},{required:true,message:'请输入用户名',trigger:'blur'}],
                    password:[{validator:Reg2,trigger:'blur'},{required:true,message:'请输入密码',trigger:'blur'}],
                },
                loginData:{
                    username:'',
                    password:''
                },
                radio:true,
                loginBg: require('../../assets/images/login/login.png')
            }
        },
        props:['isLogin'],
        methods: {
            closeLogin(){
                this.$emit('closeLogin');
                this.$refs.loginForm.resetFields();
            },
            jump(type){
                if(type=='agreement'){
                    this.$router.push({name:'agreement'})
                }
                else if(type=='privacy'){
                    this.$router.push({name:'private'})
                    
                }
            },
            sublogin() {
                var _this = this;
                if(this.radio==false){
                    this.$message({
                        type:"error",
                        message:"请先同意用户协议跟隐私政策"
                    })
                }else{
                    this.$refs.loginForm.validate(valid=>{
                        if(valid){
                            this.$store.dispatch('registOrLogin',{userId:this.loginData.username,passWord:this.loginData.password}).then(res=>{
                                if(res.data.errorCode==3000){
                                    this.$message({
                                        type:'success',
                                        message:res.data.errorMsg
                                    });
                                    if(this.jzUsername){
                                        localStorage.setItem('username',this.loginData.username);
                                    };
                                    if(this.jzUsername&&this.jzPassword){
                                        localStorage.setItem('alljz',JSON.stringify(this.loginData));
                                    }
                                    // this.isLogin=false;
                                    this.$emit('closeLogin');
                                    this.$store.commit('changeLogin',false);
                                    this.$store.dispatch('getUserInfo',{userId:this.loginData.username}).then(res=>{
                                        if(res.data.errorCode==1000){
                                            this.$store.commit('changeUserInfo',res.data.data);
                                        }
                                        _this.loginData.username='';
                                        _this.loginData.password='';
                                        _this.jzUsername = false;
                                        _this.jzPassword = false;
                                    })
                                }else{
                                    this.$message({
                                        message:res.data.errorMsg,
                                        type:'error'
                                    })
                                }
                            })
                        }
                    })
                }

            },
            //记住密码必须记住账号
            allJz(){
                if(this.jzPassword){
                    this.jzUsername=true
                };
            }
        },
        created () {
             // this.$router.push('./mainPage')
            // console.log(1);
            // this.isLogin=sessionStorage.getItem('isLogin');
            // // console.log(this.isLogin)
            // this.isLogin=this.isLogin=='false'?false:true;
            // console.log(this.isLogin);
            //判断是否记住密码
            if(localStorage.getItem('alljz')){
                this.loginData=JSON.parse(localStorage.getItem('alljz'));
                this.jzPassword=true;
                this.jzUsername=true;
            }else if(localStorage.getItem('username')){
                {
                    this.jzUsername=true;
                    this.loginData.username=localStorage.getItem('username');
                }
            }
        },
    }
</script>

<style>
.mask .xieyi{
    color: #24A5FF;
}
.mask{
    background: rgba(0, 0, 0, .5);
    width: 100vw;
    height: 100vh;
    position: fixed;
    z-index: 999;
}
.title{
    margin-top: 35px;
    margin-bottom: 15px;
    font-size: 18px;
}
.alert{
    font-size: 16px;
    color: red;
    margin-top: 0;
    margin-bottom: 15px;
}
.bgImg{
    height: 534px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
}
.loginAlert{
    height: 534px;
    width: 845px;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
}
.loginContent{
    margin-left: 234px;
    width: auto;
    height: 100px;
    text-align: center;
    /* background: red; */
    margin-right: 99px;
}
.mask .el-input__inner{
    border-radius: 30px;
    width: 483px;
    height: 60px;
    padding-left: 60px;
    text-align: center;
    text-indent: -45px;
}
.mask .el-input__inner{
    background-color: #EEEEEE !important;

}
.input-icon{
    width: 17px;
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 41px;
    margin: auto;
}
.mask .el-form-item__content{
    position: relative;

}
.mask .checkRadio .el-checkbox__label{
    width: 371px;
}
.mask .checkRadio .el-checkbox__label{
    white-space: normal;
    text-align: left;
    display: inline-flex;
    font-size: 16px;
    line-height: 28px;
}
.mask .el-checkbox:first-child{
    margin-right: 97px;
}
.mask .el-checkbox:last-child{
    margin-right: 56px;
}
.mask .el-checkbox__inner{
    width: 24px;
    height: 24px;
}
.mask .el-radio__inner{
    width: 24px;
    height: 24px;
}
.mask .el-checkbox__label{
    font-size: 18px;
}
.mask .input::-webkit-input-placeholder {
    font-size: 18px;
  }
  .mask .input::-moz-input-placeholder {
    font-size: 18px;
  }
  .mask .input::-ms-input-placeholder {
    font-size: 18px;
  }
  .mask .el-checkbox__input.is-checked .el-checkbox__inner::after{
      height: 15px;
    width: 5px;
    margin-left: 5px;
  }
  .mask .el-checkbox__inner::after{
      transition:none
  }
  .mask .el-form-item__error{
      left: 15%;
  }
.checkRadio .el-checkbox__inner{
      border-radius: 50%;
  }
  .checkRadio .el-checkbox:first-child{
      margin-right: 0;
      margin-left: 30px;
  }
  .mask .close{
      position: absolute;
      top: 38px;
      width: 35px;
      height: 35px;
      right: 26px;
      cursor: pointer;
  }
  .login{
      width: 530px;
      height: 95px;
  }
</style>
