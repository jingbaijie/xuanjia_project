<template>
  <div>
    <!-- 
        actiPageId: 1, //页面 ID
        actiPageCname: "首页", //页面中文名
        actiPageEname: "main", //页面英文名
        isMainPage: true, //是否为一级页面(首页)
        prePage: null, //上一级页面
        pageBigpicUrl: "背景图.png", //页面背景
        fn:{

        }
    -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span v-show="!actionType">新建活动页面</span>
        <el-button
          v-show="!actionType"
          style="float: right; padding: 3px 0"
          type="text"
          @click="onSubmit('form')"
          >提 交</el-button
        >

        <span v-show="actionType">编辑活动页面</span>
        <el-button
          v-show="actionType"
          style="float: right; padding: 3px 0"
          type="text"
          @click="addFunction('form')"
          >增加功能</el-button
        >
        <!-- <div v-show="actionType" style="float: right; " type="text">&nbsp|&nbsp</div>
        <el-button v-show='actionType' style="float: right; padding: 3px 0" type="text" @click="removePage('form')">删除页面</el-button>-->
      </div>
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item
          v-if="form.id"
          label="页面ID"
          prop="id"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="form.id"
            :disabled="true"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="一级页面"
          prop="pageFlag"
          :label-width="formLabelWidth"
        >
          <!-- :disabled="hasParentPage" -->
          <el-switch
            v-model="form.pageFlag"
            active-color="#13ce66"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </el-form-item>
        <el-form-item
          label="页面中文名"
          prop="pageCname"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.pageCname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="页面英文名"
          prop="pageEname"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.pageEname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="上一级页面"
          prop="prePage"
          :label-width="formLabelWidth"
        >
          <el-select v-model="form.prePageId" clearable placeholder="请选择">
            <el-option
              v-for="item in pageOptions"
              :key="item.pageEname"
              :label="item.pageCname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="页面背景图"
          prop="pageBigpicUrl"
          :label-width="formLabelWidth"
        >
          <el-popover placement="right" width="535" trigger="hover">
            <el-input
              v-model="form.pageBigpicUrl"
              :style="{ display: 'none' }"
              autocomplete="off"
            ></el-input>
            <el-button slot="reference" @click="clearImg" type="warning" plain
              >选 择</el-button
            >
            <image_choice @getSelectImage="img => setImg(img)"></image_choice>
          </el-popover>
          <img
            v-if="form.pageBigpicUrl"
            :style="{ width: '178px', 'margin-top': '20px' }"
            :src="imagesBaseUrl + form.pageBigpicUrl"
          />
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import image_choice from "@/components/widget/ImageChoiceWidget";
import { eventBus } from "@/common/eventBus";
export default {
  name: "activePageInfo",
  props: ["actionType"],
  inject: [
    "getPageInfo",
    "setTabView",
    "getPageInfoList",
    "checkUniquPageParent",
    "setUniquPageParent",
    "setActionType",
    "setEditData"
  ],
  components: { image_choice },
  data() {
    return {
      form: {
        activityId: "",
        pageCname: "",
        pageEname: "",
        pageFlag: 0,
        prePageId: "",
        pageBigpicUrl: "",
        fn: {
          list: undefined,
          inputPhone: undefined,
          focus: [],
          exChange: []
        }
      },
      hasParentPage: false,
      pageOptions: [],
      imagesBaseUrl: window.configs.static_IMAGES_BASEURL,
      formLabelWidth: "120px",
      rules: {
        pageCname: [{ required: true, message: "请输入名称", trigger: "blur" }],
        pageEname: [{ required: true, message: "请输入名称", trigger: "blur" }]
      }
    };
  },
  created() {
    if (this.actionType) {
      this.form = this.getPageInfo();
      console.log("编辑页面信息 ===>>>>  " + JSON.stringify(this.form));
    }
    this.$nextTick(function() {
      this.pageOptions = this.getPageInfoList();
    });
    this.hasParentPage = this.checkUniquPageParent();
  },
  methods: {
    clearImg() {
      this.form.pageBigpicUrl = "";
    },
    setImg(item) {
      this.form.pageBigpicUrl = item.picPath;
      this.form.pageBigpicId = item.id;
    },
    addFunction() {
      this.actionType = false;
      this.setTabView("activePageFn");
      this.setEditData(undefined);
    },

    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$message.success(this.form.pageCname + "页面已添加");
          this.$emit("addActivePage", this.form);
        } else {
          this.$message.warning("信息未填写完整！");
        }
      });
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
</style>
