<!--
 * @Author: your name
 * @Date: 2021-08-31 17:12:11
 * @LastEditTime: 2021-09-15 18:05:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \tvjoy-web\src\components\personalCenter\changeHeader.vue
-->
<template>
  <div>
    <el-dialog
      :append-to-body='true'
      :title="changeData.msg"
      :visible.sync="isShow"
      center
      width="20%"
      :before-close="close"
    >
    <el-form ref="changeData" :model="changeForm">
      <el-form-item v-if="dchangeData.type=='img'">
        <el-upload
          ref="upload"
          class="avatar-uploader"
          :data="uploadData"
          :action="webApi +'web/user/uploadIcon'"
          :auto-upload="false"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
          :on-change="handleAvatarChangeIcon"
          :on-preview="handlePictureCardPreview"
          :on-success='uploadSuccess'
        >
        <img v-if="true" :src="changeForm.headerImg" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      </el-form-item>
      <el-form-item label="昵称" label-width="80px" v-if="dchangeData.type=='span'" prop="name" :rules="rules">
        <el-input maxlength="8" v-model="changeForm.name"></el-input>
      </el-form-item>
      <el-form-item class="buttongroup">
        <el-button type="primary" @click='submitData(dchangeData.type)'>提交</el-button>
        <el-button @click='close()'>取消</el-button>
      </el-form-item>
    </el-form>
     
    </el-dialog>
  </div>
</template>

<script>
var Reg1 = (rule,value,cb) => {
    if(value.length<=20){
        return cb()
    }else{
        cb(new Error('请输入20位以下的昵称'))
    }
}
export default {
  props: ["isShow",'changeData'],
  data() {
    return {
      show: false,
      webApi: window.configs.axios_BASEURL,
      dchangeData:{},
      changeForm:{
        headerImg:''
      },
      fileList1:[],
      uploadData:{
        userId:17835208083,
        width:90,
        height:90
      },
      rules:{
        name:[{validator:Reg1,trigger:'blur'},{required:true,message:'请输入用户名',trigger:'blur'}],
      }
    };
  },
  inject:['userInfo'],
  watch: {
    changeData(newValue, oldValue) {
      this.dchangeData=newValue;
      this.changeForm=JSON.parse(JSON.stringify(this.userInfo));
      // console.log(this.dchangeData)
    }
  },
  methods: {
    uploadSuccess(res){
      if(res.errorCode==1000){
        this.$message({
          type:'success',
          message:"修改成功"
        });
        this.$store.commit('changeUserHeader',{headerImg:this.changeForm.headerImg});
        this.close();
      }
    },
    handlePictureCardPreview(file){
      // console.log(file)
    },
    handleAvatarChangeIcon(file){
      // console.log(FileReader.readAsDataURL(file.raw))
      var filereader=new FileReader();
      filereader.readAsDataURL(file.raw);
      filereader.onload=()=>{
        // filereader.result
        this.changeForm.headerImg=filereader.result;
      }
      // console.log(file.raw);
    },
    close() {
      // console.log(this.$refs.changeData);
      // this.$refs.changeData.resetFields();
      // console.log(this.userInfo)
      this.changeForm=JSON.parse(JSON.stringify(this.userInfo));
      this.$emit("closeDialog");
    },
    //上传限制
    beforeAvatarUpload(file) {
        var fileArr = ['image/jpeg','image/jpg','image/png','image/bmp','image/gif'];
        var isJPG;
        // console.log(file.type );
        if(fileArr.indexOf(file.type)>=0){
          isJPG=true;
        }else{
          isJPG=false;
        }
        // const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 1;
        if (!isJPG) {
          this.$message.error('上传头像图片格式不符!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 1MB!');
        }
        return isJPG && isLt2M;
    },
    submitData(type){
      if(type=='span'){
        this.$store.dispatch('updateNickName',{userId:this.changeForm.id,userName:this.changeForm.name}).then(res=>{
          if(res.data.errorCode=1000){
            this.$store.commit('changeUserName',{username:this.changeForm.name});
            this.$message({
              type:'success',
              message:res.data.errorMsg
            });
            this.close();
          }
        })
      }else if(type=='img'){
        this.$refs.upload.submit()
      }
    },
  },
  created(){
    this.uploadData.userId = this.$store.state.userInfo.id;
  }
};
</script>

<style scoped>
 .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .avatar-uploader{
    text-align: center;
  }
.buttongroup{
  width: 100%;
  /* display: flex; */
  /* justify-content: space-around; */
  margin-left: 20%;
  margin-top: 3%;
}
.el-button+.el-button{
  margin-left: 60px;
}
</style>
