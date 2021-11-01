<template lang="pug">
  .forgetPassword
    .content
      .title(v-text="$t('user.password_forget')")
      el-form(class="form" ref="form" :model="form" :rules="rules" @submit.native.prevent="submit" status-icon)
        el-form-item(prop="email" class="formItem" :show-message="false")
          el-input(class="input" v-model="form.email" :placeholder="$t('user.email_required')")
            span(slot="prepend")
              img(src="../../assets/images/icon/Email-FFFFFF.svg")
        el-form-item(class="formItem submit")
          el-button(class="submitButton" type='primary' @click="submit" :disabled="captchaStatus === 'loading'")
            slot(v-if="captchaStatus === 'loading'")
              .imageLoading
            slot(v-else-if="captchaStatus === 'error'") {{$t('public.reload')}}
            slot(v-else) {{$t('user.auth_email_send')}}
      .goDiv
        .empty
        .goButton(v-text="$t('user.back_login')" @click="$router.push('/login')")
    #captcha
</template>
<script type="es6">
import {Button, Form, FormItem, Input} from 'element-ui'
import Vue from 'vue'
import '../../utils/gt'

Vue.component(Button.name, Button)
Vue.component(Form.name, Form)
Vue.component(FormItem.name, FormItem)
Vue.component(Input.name, Input)

export default {
  data () {
    const validateEmailNotValid = (rule, value, callback) => {
      if (this.emailNotValidList && this.emailNotValidList.length) {
        if (this.emailNotValidList.indexOf(value) > -1) {
          callback(new Error(this.$t('request.100040')))
        }
      } else {
        callback()
      }
    }
    return {
      form: {
        email: ''
      },
      rules: {
        email: [
          {
            required: true,
            message: this.$t('user.email_required')
          },
          {
            type: 'email',
            message: this.$t('user.email_notValid')
          },
          {
            validator: validateEmailNotValid
          }
        ]
      },
      captchaStatus: '',
      captchaObj: '',
      emailNotValidList: []
    }
  },
  watch: {
    $route: function (val) {
      this.doInit()
    }
  },
  methods: {
    submit () {
      if (this.captchaStatus === 'success') {
        this.$refs['form'].validate((valid, message) => {
          if (valid) {
            this.captchaObj.verify()
          } else {
            for (let i = 0; i < Object.keys(this.form).length; i++) {
              let item = Object.keys(this.form)[i]
              if (message && message['' + item] && message['' + item].length) {
                this.$message.error(message['' + item][0]['message'])
                break
              }
            }
          }
        })
      } else if (this.captchaStatus === 'error') {
        this.initCaptcha()
      }
    },
    initCaptcha () {
      this.captchaStatus = 'loading'
      this.$store.dispatch('axios_captcha_server').then(res => {
        if (res.data && +res.data.error === 0) {
          if (window.initGeetest) {
            window.initGeetest({
              gt: res.data.gt,
              challenge: res.data.challenge,
              offline: false,
              new_captcha: res.data.new_captcha,
              product: 'bind', // 产品形式，包括：float，popup, custom
              width: '292px',
              lang: localStorage.getItem('language') === 'zh-CN' ? 'zh-cn' : 'en'
            },
            captchaObj => {
              captchaObj.appendTo(document.getElementById('captcha'))
              this.captchaObj = captchaObj
              this.captchaStatus = 'success'
              captchaObj.onSuccess(() => {
                let result = this.captchaObj.getValidate()
                this.$loading.open()
                this.$store.dispatch('axios_send_forget_mail', {
                  email: this.form.email,
                  geetest_challenge: result.geetest_challenge,
                  geetest_validate: result.geetest_validate,
                  geetest_seccode: result.geetest_seccode,
                  check_captcha: 1
                }).then(result => {
                  if (result.data && +result.data.error === 0) {
                    this.$message.success(this.$t('user.auth_email_send_success'))
                  } else if (result.data && +result.data.error === 100040) {
                    this.emailNotValidList.push(this.form.email)
                  }
                }).catch(() => {
                  // this.$message.error(this.$t('public.url_request_fail'))
                })
              })
            })
          } else {
            this.captchaStatus = 'error'
          }
        } else {
          this.captchaStatus = 'error'
          this.$message.error(this.$t('user.captcha_request_fail'))
        }
      }).catch(() => {
        this.captchaStatus = 'error'
        // this.$message.error(this.$t('user.captcha_request_fail'))
      })
    },
    doInit () {
      this.$loading.close()
      this.initCaptcha()
    }
  },
  mounted () {
    this.doInit()
  }
}
</script>
<style lang='stylus' scoped>
</style>
