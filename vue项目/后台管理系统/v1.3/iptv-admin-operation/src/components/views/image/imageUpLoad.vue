<template>
  <div>
    <el-dialog
      v-dialogDrag
      ref="dialog__wrapper"
      title="图片上传"
      width="500px"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="form" :rules="rules" ref="arg">
        <el-form-item label="图片分类" prop="arg.levelId" :label-width="formLabelWidth">
          <el-select v-model="form.arg.levelId" placeholder="请选择">
            <el-option
              v-for="item in Imagestypes"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图片名称" prop="arg.picCname" :label-width="formLabelWidth">
          <el-input v-model="form.arg.picCname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="选择图片" prop="fileList" :label-width="formLabelWidth">
          <!-- <el-upload
            class="upload-demo"
            :action='imagesBaseUrl+"/sysadmin/content/image/add"
            :http-request="uploadSectionFile"
            :on-success="recomUploadSuccess"
            :on-remove="handleRemove"
            :headers="head"
            :data="arg"
            :on-change="addPic"
            :file-list="form.fileList"
            list-type="picture"
            ref="upload"
            :auto-upload="false"
            show-file-list
            multiple
          >
            <el-button v-if="!dis" plain icon="el-icon-upload" size="small" type="primary">点击上传</el-button>
          </el-upload>-->

          <!--:on-success="recomUploadSuccess"-->
          <!--:on-remove="handleRemove"-->
          <el-upload
            class="upload-demo"
            :auto-upload="false"
            action
            :on-change="addPic"
            :file-list="form.fileList"
            list-type="picture"
            ref="upload"
            show-file-list
            multiple
          >
            <el-button plain icon="el-icon-upload" size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          :loading="saveing"
          icon="el-icon-upload2"
          @click="submitUpload('arg')"
        >Save</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { eventBus } from "@/common/eventBus";
import axios from "@/common/axios";
import $ from "jquery";
export default {
  name: "imageUpLoad",
  data() {
    return {
      curLength: 0,
      multiple: true,
      formDate: "",
      dialogFormVisible: false,
      formLabelWidth: "120px",
      dis: false,
      imagesBaseUrl: window.configs.axios_BASEURL,
      head: {
        "x-a-t": localStorage.getItem("token")
      },
      saveing: false,
      form: {
        arg: {
          levelId: "",
          picCname: ""
        },
        fileList: []
      },
      Imagestypes: [
        {
          id: "0",
          title: "所有"
        },
        {
          id: "1",
          title: "首页"
        },
        {
          id: "2",
          title: "分类"
        },
        {
          id: "3",
          title: "详情"
        },
        {
          id: "4",
          title: "活动"
        },
        {
          id: "5",
          title: "专题"
        },
        {
          id: "6",
          title: "其他"
        },
        {
          id: "7",
          title: "标签图"
        },
        {
          id: "8",
          title: "详情卡通图"
        }
      ],
      rules: {
        levelId: [
          { required: true, message: "请选择图片分类", trigger: "change" }
        ],
        fileList: [{ required: true, message: "请选择图片", trigger: "change" }]
        // picCname: [
        //   { required: true, message: '请输入图片名称', trigger: 'blur' },
        //   { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        // ]
      },
      value: ""
    };
  },
  watch: {
    form(val) {}
  },
  methods: {
    showUpLoad() {
      this.dialogFormVisible = true;
      this.dis = false;
      this.form = {
        arg: {
          levelId: "",
          picCname: ""
        },
        fileList: []
      };
    },
    addPic(file, fileList) {
      this.dis = true;
      this.curLength = fileList.length;
      this.form.fileList = fileList;
    },
    //确认上传
    submitUpload(formName) {
      //校验表单
      this.$refs[formName].validate(valid => {
        var _self = this;
        if (valid) {
          let config = {
            headers: {
              "Content-Type": "multipart/form-data",
              ...this.head
            }
          };
          let formData = new FormData();
          this.form.fileList.forEach(function(value, i) {
            //[file]为后台接口定义中的文件字段，根据后台接口自行
            //ready表示选择了还未上传的图片
            if ("ready" == value.status) {
              formData.append("file", value.raw);
            }
          });
          //补充额外参数
          for (let key in this.form.arg) {
            formData.append(key, this.form.arg[key]);
          }
          this.saveing = true;

          //发起请求
          axios
            .post(
              this.imagesBaseUrl + "/sysadmin/content/image/add",
              formData,
              config
            )
            .then(response => {
              console.log("图片上传" + response.data.errorCode);
              this.saveing = false;
              if (response.data.errorCode == "1000") {
                this.$message.success("上传成功！");
                eventBus.$emit("refreshImageList", this.form.arg.levelId);
                this.dialogFormVisible = false;
              } else if (response.data.errorCode == "1019") {
                let pic = eval(response.data.errorMsg);
                // _self.form.fileList.forEach(function(file, i) {
                //   pic.forEach(function(value, j) {
                //     if (value == file.name) {
                //       _self.form.fileList[i].status = "fail";
                //     }
                //   });
                // });
                this.$message.warning("资源已存在！" + pic);
              } else if (response.data.errorCode == "1002") {
                this.$message.warning("参数错误，请重新上传！");
              } else {
                this.$message.error("上传失败！");
              }
            })
            .catch(error => {
              // this.saveing = false;
              console.log(error);
            });
        } else {
          return false;
        }
      });
    },
    handleRemove(file, fileList) {
      this.dis = false;
      this.form.fileList = fileList;
    }
  },
  mounted() {
    eventBus.$on("showUpLoad", () => {
      this.showUpLoad();
    });
  },
  beforeDestroy() {
    eventBus.$off("showUpLoad");
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
.is-fail {
  border: 1px solid red !important;
}
</style>
