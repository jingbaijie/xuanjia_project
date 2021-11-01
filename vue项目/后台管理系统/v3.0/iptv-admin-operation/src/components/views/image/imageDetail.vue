<template>
  <div>
    <el-dialog
      v-dialogDrag
      ref="dialog__wrapper"
      title="图片详情"
      width="500px"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="imgData">
        <el-form-item label="图片分类 :" :label-width="formLabelWidth">{{
          imgTypes[imgData.levelId]
        }}</el-form-item>
        <el-form-item label="图片名称 :" :label-width="formLabelWidth">
          <el-input v-model="imgData.picCname"></el-input>
        </el-form-item>
        <el-form-item label="图片MD5 :" :label-width="formLabelWidth">{{
          imgData.md5
        }}</el-form-item>
        <el-form-item label="上传时间 :" :label-width="formLabelWidth">{{
          imgData.createTime
        }}</el-form-item>
        <el-form-item label="图片路径 :" :label-width="formLabelWidth">{{
          imgData.picPath
        }}</el-form-item>
        <el-form-item label="图片尺寸 :" :label-width="formLabelWidth">{{
          imgData.picW + " x " + imgData.picH
        }}</el-form-item>
        <el-form-item label :label-width="formLabelWidth">
           <!-- <el-upload
            class="avatar-uploader"
            :auto-upload="false"
            action
            :show-file-list="false"
            :on-change="handleAvatarSuccess"
          > -->
            <img v-if="imageUrl" :src="imageUrl" :style="{ width: '200px' }" />
          <!--  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <!-- </el-upload> -->
          <!-- <img :src="imagesBaseUrl+imgData.picPath" :style="{'width':'200px'}"> -->
          <!-- <el-dialog :visible.sync="dialogVisible"> --> 
            <!-- <img width="100%" :src="dialogImageUrl" alt /> -->
          <!-- </el-dialog> -->
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          <el-button type="primary" size="small" @click="onSubmit(imgData.id)"
            >确认修改</el-button
          >
          <el-button
            type="danger"
            :style="{ 'margin-left': '100px' }"
            size="small"
            @click="goBack(imgData.id)"
            >取消修改</el-button
          >
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer"></div>
    </el-dialog>
  </div>
</template>

<script>
import { eventBus } from "@/common/eventBus";
export default {
  name: "imageDetail",
  props: ["imagesBaseUrl"],
  data() {
    return {
      imageUrl: {},
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      dialogFormVisible: false,
      imgData: {},
      formLabelWidth: "120px",
      value: "",
      imgTypes: [
        "所有",
        "首页",
        "分类",
        "详情",
        "活动",
        "专题",
        "其他",
        "其他2",
        "其他3",
        "其他4"
      ]
    };
  },
  methods: {
    handleAvatarSuccess(file, fileList) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },

    //替换图片
    handleReplace(file) {
      console.log(file);
    },

    showDetail(img) {
      this.dialogFormVisible = true;
      this.imgData = img;
      this.imageUrl = this.imagesBaseUrl + img.picPath;
    },
    onSubmit(id) {

      this.$store
        .dispatch("axios_editFileName_images", {
          id: id,
          picCname: this.imgData.picCname
        })
        .then(rs => {
          if (rs.data.errorCode == "1000") {
            this.$message.success("修改图片成功");
          } else {
            this.$message.error(rs.data.errorMsg);
          }
          this.dialogFormVisible = false;
          eventBus.$emit("refreshImageList", this.imgData.levelId);
        })
        .catch(err => {
          this.$message.error("修改图片失败");
        });
      this.dialogFormVisible = false;
    },
    goBack(id) {
      this.dialogFormVisible = false;
    }
  },

  mounted() {
    eventBus.$on("showDetail", v => {
      this.showDetail(v);
    });
  },
  beforeDestroy() {
    eventBus.$off("showDetail");
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
.el-form-item {
  margin-bottom: 5px;
  font-weight: bold;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
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
</style>
