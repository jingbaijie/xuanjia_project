<template>
  <div>
    <el-dialog
      height="50"
      v-dialogDrag
      ref="dialog__wrapper"
      title="内容导入"
      :visible.sync="dialogProgramManageForm"
    >
      <!-- <el-form-item label="导入类型 :" prop="matchRule" :label-width="formLabelWidth"></el-form-item> -->
      <div>
        <el-upload
          :auto-upload="false"
          action
          :on-change="addPic"
          :file-list="form.fileList"
          :on-remove="handleRemove"
          accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          ref="upload"
          :limit="2"
          show-file-list
          multiple
          :on-exceed="handleExceed"
        >
          <el-button plain icon="el-icon-upload" size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件</div>
        </el-upload>
        <div>
          <a :href="downloadSeriesUrl">下载节目集模版</a>
          <a :href="downloadProgramUrl">下载节目模版</a>
        </div>
        <p>导入说明：</p>
        <p>1.请先下载模版，请严格按模版要求填充数据；</p>
        <p>2.不要使用自己的模版或者更改模版的格式。</p>
        <p>3.最多只能上传2个文件。</p>

        <el-progress type="circle" v-show="process" :percentage="percentage"></el-progress>
        <span v-show="process">{{this.taskName}}</span>
        <el-button type="primary" @click="submitUpload()">提交</el-button>
      </div>
      <div style="position:absolute; top:30px; left:50%;">
        <div style="font-size:18px">提示</div>
        <div style="overflow:auto; height:350px;margin:5px 10px 20px 0px">
          <ul>
            <li>节目集:</li>
            <li v-for="item in tipProgramInfo" :key="item+Math.random()">{{item}}</li>
          </ul>
          <ul>
            <li>节目子集:</li>
            <li v-for="item in tipSeriesInfo" :key="item+Math.random()">{{item}}</li>
          </ul>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { eventBus } from "@/common/eventBus";
import defaultFocus from "@/assets/images/add2.jpg";
import image_choice from "@/components/widget/ImageChoiceWidget";
import axios from "@/common/axios";
import $ from "jquery";

export default {
  name: "ProgramManageForm",
  data() {
    return {
      downloadSeriesUrl: window.configs.downloadSeriesUrl,  //下载节目集模版地址
      downloadProgramUrl: window.configs.downloadProgramUrl,//下载节目模版地址
      downloadProgressUrl: window.configs.downloadProgressUrl, //下载进度
      dialogProgramManageForm: false,                          //弹窗
      imagesBaseUrl: window.configs.axios_BASEURL,            //图片地址
      tipProgramInfo: [],  //节目子集
      tipSeriesInfo: [],   //节目集
      process: false,      //进度显示  上传时true
      form: {
        fileList: []            //上传文件
      },
      formLabelWidth: "120px",  //字符宽度
      props: {},
      percentage: 0,           //上传进度
      taskName: ""             //接口返回的提示信息
    };
  },
  //   inject: ["getClassifyData", "getMenuId", "getTagsData"],
  beforeCreate() {},
  //初始化
  created() {
    this.initWebSocket();
  },
  //销毁
  destroyed() {
    this.websocketclose();
  },
  //组件挂载
  components: { image_choice },

  methods: {
    //初始化socket
    initWebSocket: function() {
      this.websock = new WebSocket(this.downloadProgressUrl);
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onclose = this.websocketclose;
    },
    //socket连接
    websocketonopen: function() {
      console.log("WebSocket连接成功");
    },
    //socket连接失败
    websocketonerror: function(e) {
      console.log("WebSocket连接发生错误");
    },
    //socket返回
    websocketonmessage: function(e) {
      var da = JSON.parse(e.data);
      this.percentage = da.percentage;
      this.taskName = da.msg;
      if(da.status==0){
        this.tipProgramInfo.push(da.msg);
      }
      if (this.percentage == 100) {
        this.process = false;
      }
      console.log(da);
    },
    //关闭socket
    websocketclose: function(e) {
      console.log(e);
      // console.log("connection closed (" + e.code + ")");
    },

    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 2 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    submitUpload() {
      if (this.form.fileList.length == 0) {
        this.$message.warning("请添加上传文件");
        return;
      }
      //校验表单
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

      this.saveing = true;
      this.process = true;
      //发起请求
      axios
        .post(
          this.imagesBaseUrl + "content/series/importExcelMedia",
          formData,
          config
        ).then(response => {
          if (response.data.errorCode == "1000") {
            this.$message.success("上传成功！");
            this.dialogProgramManageForm = false;
          } else if (response.data.errorCode == "1019") {
            this.$message.warning("资源已存在！");
            this.dialogProgramManageForm = false;
          } else if (response.data.errorCode == "1001") {
            this.$message.error(response.data.errorMsg);
           
            console.log(this.tipProgramInfo);
          } else {
            this.$message.error(response.data.errorMsg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    addPic(file, fileList) {
      this.curLength = fileList.length;
      this.form.fileList = fileList;
    },
    programManage() {
      this.tipProgramInfo = [];
      this.dialogProgramManageForm = true;
      this.form = {
        fileList: []
      };
    },
    handleRemove(file, fileList) {
      this.form.fileList = fileList;
    }
  },
  mounted() {
    eventBus.$on("programManage", v => {
      this.programManage();
    });
  },
  beforeDestroy() {
    eventBus.$off(["programManage"]);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="scss" scoped>
p {
  color: red;
}
a {
  padding-left: 30px;
  color: rgb(0, 102, 255);
}
/deep/ .el-dialog__body {
  padding: 30px 50px;
  width: 400px;
}

/deep/ .el-upload-list--picture .el-upload-list__item {
  width: 28 0px;
  padding: 10px 0px 10px 10px;
}
/deep/ .el-dialog {
  width: 800px;
}
</style>




