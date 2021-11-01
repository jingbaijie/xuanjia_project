<template>
  <div>
    <!-- 
      坑位功能
      focus: [{
        focusId: "2",
        focusCName: "保存手机号焦点 ",
        focusType: "0/1/2/3",
        jumpPage: "actiPageId",
        freeType: "0/1/2",
        recomendPic: [{
          url:"",
          xValue:"",
          yValue:""
        }],
        recomendLabelPic: [{
          url:"",
          xValue:"",
          yValue:""
        }],
        recommendShowPic: [{
          url:"",
          xValue:"",
          yValue:""
        }]
      }]
    -->
    <el-form :model="form" ref="form">
      <el-form-item label="焦点名称" prop="focusCName" :label-width="formLabelWidth">
        <el-input v-model="form.focusCName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="点击：" prop="focusType" :label-width="formLabelWidth">
        <el-select v-model="form.focusType" clearable placeholder="请选择">
          <el-option
            v-for="item in focusTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-if="form.focusType=='0'" label="跳转页面" prop="jumpPage" :label-width="formLabelWidth">
        <el-select v-model="form.jumpPage" clearable placeholder="请选择">
          <el-option
            v-for="item in pageOptions"
            :key="item.pageEname"
            :label="item.pageCname"
            :value="item.actiPageId"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="付费" prop="freeType" :label-width="formLabelWidth">
        <el-select v-model="form.freeType" clearable placeholder="请选择">
          <el-option
            v-for="item in freeTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="未选中图" prop="recomendPic" :label-width="formLabelWidth">
        <el-upload
          class="upload-demo"
          action
          :file-list="form.recomendPic"
          :on-remove="(file,fllelist)=>removeRecome(file,fllelist,0)"
          list-type="picture"
        >
          <el-popover slot="tip" placement="right" width="535" trigger="hover">
            <el-button slot="reference" size="small" type="primary" plain>添 加</el-button>
            <transition name="fade-transform" mode="out-in">
              <div class="balnce">
                <image_choice @getSelectImage="img => recomUploadSuccess(img,0)"></image_choice>
              </div>
            </transition>
          </el-popover>
        </el-upload>
      </el-form-item>

      <el-form-item label="选中图" prop="recomendLabelPic" :label-width="formLabelWidth">
        <el-upload
          class="upload-demo"
          action
          :file-list="form.recomendLabelPic"
          :on-remove="(file,fllelist)=>removeRecome(file,fllelist,1)"
          list-type="picture"
        >
          <el-popover slot="tip" placement="right" width="535" trigger="hover">
            <el-button slot="reference" size="small" type="primary" plain>添 加</el-button>
            <transition name="fade-transform" mode="out-in">
              <div class="balnce">
                <image_choice @getSelectImage="img => recomUploadSuccess(img,1)"></image_choice>
              </div>
            </transition>
          </el-popover>
        </el-upload>
      </el-form-item>
      <el-form-item label="选中显示" prop="recommendShowPic" :label-width="formLabelWidth">
        <el-upload
          class="upload-demo"
          action
          :file-list="form.recommendShowPic"
          :on-remove="(file,fllelist)=>removeRecome(file,fllelist,2)"
          list-type="picture"
        >
          <el-popover slot="tip" placement="right" width="535" trigger="hover">
            <el-button slot="reference" size="small" type="primary" plain>添 加</el-button>
            <transition name="fade-transform" mode="out-in">
              <div class="balnce">
                <image_choice @getSelectImage="img => recomUploadSuccess(img,2)"></image_choice>
              </div>
            </transition>
          </el-popover>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import image_choice from "@/components/widget/ImageChoiceWidget";

export default {
  name: "focus",
  props: ["actionType"],
  components: { image_choice },
  inject: ["getPageInfoList", "setFocus", "getEditData"],
  data() {
    return {
      imagesBaseUrl: window.configs.static_IMAGES_BASEURL,
      focusTypeOptions: [
        { label: "跳转", value: "0" },
        { label: "兑换", value: "1" },
        { label: "保存手机", value: "2" },
        { label: "清除手机", value: "3" }
      ],
      freeTypeOptions: [
        { label: "收费", value: "0" },
        { label: "免费", value: "1" },
        { label: "试玩", value: "2" }
      ],
      pageOptions: [],
      freeTypeValue: "",
      focusTypeValue: "",
      formLabelWidth: "120px",
      form: {
        focusCName: "",
        recomendPic: [],
        recomendLabelPic: [],
        recommendShowPic: [],
        focusType:""

      }
    };
  },
  created() {
    if (this.getEditData()) {
      this.form = this.getEditData();
    }
    this.$nextTick(function() {
      this.pageOptions = this.getPageInfoList();
      console.log("focusCreated");
    });
  },
  methods: {
    
    //删除图片
    removeRecome(f, fl, type) {
      switch (type) {
        case 0:
          this.form.recomendPic.forEach((item, index) => {
            item.id == f.id ? this.form.recomendPic.splice(index, 1) : "";
          });
          break;
        case 1:
          this.form.recomendLabelPic.forEach((item, index) => {
            item.id == f.id ? this.form.recomendLabelPic.splice(index, 1) : "";
          });
          break;
        case 2:
          this.form.recommendShowPic.forEach((item, index) => {
            item.id == f.id ? this.form.recommendShowPic.splice(index, 1) : "";
          });
          break;
        default:
        //console.log("defalut");
      }
    },
    recomUploadSuccess(file, type) {
      file.url = this.imagesBaseUrl + file.picPath;
      file.checked = false;
      switch (type) {
        case 0:
          this.form.recomendPic.push(file);
          break;
        case 1:
          this.form.recomendLabelPic.push(file);
          break;
        case 2:
          this.form.recommendShowPic.push(file);
          break;
        default:
        //console.log("defalut");
      }
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.form["focusId"] = Math.floor(Math.random() * 100000 + 1);
          this.setFocus(JSON.parse(JSON.stringify(this.form)));
        } else {
          this.$message.warning("信息未填写完整！");
        }
      });
      return this.form;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-input {
  width: 80%;
}
.dialog-footer {
  text-align: center;
}
.balnce ul li {
  list-style-type: none;
  float: left;
  margin-left: 10px;
  margin-top: 10px;
}
</style>
