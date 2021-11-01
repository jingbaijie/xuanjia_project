<template lang="pug">
  .modifyPassword
    .content
      .title(v-text="$t('user.modify_password')")
      el-form(class="form" ref="form" :model="form" :rules="rules" @submit.native.prevent="submit" status-icon)
        el-form-item(prop="password" class="formItem" :show-message="false")
          el-input(class="input" type="password" v-model="form.password" :placeholder="$t('user.password_new_required')")
            span(slot="prepend")
              img(src="../../assets/images/icon/Lock-FFFFFF.svg")
        el-form-item(prop="rePassword" class="formItem" :show-message="false")
          el-input(class="input" type="password" v-model="form.rePassword" :placeholder="$t('user.rePassword_required')")
            span(slot="prepend")
              img(src="../../assets/images/icon/Lock-FFFFFF.svg")
        el-form-item(class="formItem submit")
          el-button(class="submitButton" type='primary' @click="submit") {{$t('public.complete')}}
</template>
<script type="es6">
import {Button, Form, FormItem, Input} from 'element-ui'
import Vue from 'vue'
import {VALI_PASSWORD_NUMBER} from '../../utils/validator'

Vue.component(Button.name, Button)
Vue.component(Form.name, Form)
Vue.component(FormItem.name, FormItem)
Vue.component(Input.name, Input)

export default {
  data () {
    const validatePassword = (rule, value, callback) => {
      if (!/[^\d].*[\d]|[\d].*[^\d]/.test(value)) {
        callback(new Error(this.$t('validate.password_range', {'0': VALI_PASSWORD_NUMBER.min, '1': VALI_PASSWORD_NUMBER.max})))
      } else {
        callback()
      }
    }
    const validateRePassword = (rule, value, callback) => {
      if (value !== this.form.password) {
        callback(new Error(this.$t('user.password_different')))
      } else {
        callback()
      }
    }
    return {
      form: {
        password: '',
        rePassword: ''
      },
      rules: {
        password: [
          {
            required: true,
            message: this.$t('user.password_required')
          },
          {
            min: VALI_PASSWORD_NUMBER.min,
            max: VALI_PASSWORD_NUMBER.max,
            message: this.$t('validate.password_range', {'0': VALI_PASSWORD_NUMBER.min, '1': VALI_PASSWORD_NUMBER.max})
          },
          {
            validator: validatePassword
          }
        ],
        rePassword: [
          {
            required: true,
            message: this.$t('user.rePassword_required')
          },
          {
            validator: validateRePassword
          }
        ]
      },
      token: ''
    }
  },
  watch: {
    $route: function (val) {
      this.doInit()
    }
  },
  methods: {
    submit () {
      this.$refs['form'].validate((valid, message) => {
        if (valid) {
          this.$loading.open()
          this.$store.dispatch('axios_forget_password', {
            token: this.token,
            password: this.form.password
          }).then(res => {
            this.loading = false
            if (res.data && +res.data.error === 0) {
              this.$message.success(this.$t('user.password_modify_success'))
              this.router.push('/login')
            }
          })
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
    },
    initToken () {
      if (this.$route.query && this.$route.query.token) {
        this.token = this.$route.query.token
        // 先判断 token valid
        this.$store.dispatch('axios_verified_token', {
          token: this.token
        }).then(res => {
          if (!res.data || +res.data.error !== 0) {
            this.$router.push('/login')
          }
        }).catch(() => {
          this.$router.push('/login')
        })
      }
    },
    doInit () {
      this.initToken()
    }
  },
  mounted () {
    this.doInit()
  }
}
</script>
<style lang='stylus' scoped>
</style>
