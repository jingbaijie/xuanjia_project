<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>新建推荐页面</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="onSubmit('form')">提 交</el-button>
      </div>
      <el-form :model="form" :rules="rules" ref="form" style="max-height:700px;overflow-y:auto">
        <el-form-item label="推荐中文名" prop="commPageCname" :label-width="formLabelWidth">
          <el-input v-model="form.commPageCname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="推荐英文名" prop="commPageEname" :label-width="formLabelWidth">
          <el-input v-model="form.commPageEname" :disabled="eidtTrue" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="埋点名称" prop="pageTrackName" :label-width="formLabelWidth">
          <el-input v-model="form.pageTrackName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="选择模板" :label-width="formLabelWidth">
          <el-select
            v-selectScroll="loadScrollData"
            :filter-method="bySearchValue"
            v-model="form.commonPageId"
            filterable
          >
            <el-option
              v-for="(item,index) in recommendDisplayPage"
              :key="index"
              :label="item.recommendDisplayName"
              :value="item.recommendDisplayValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="背景图片" prop="backgroundImage" :label-width="formLabelWidth">
          <el-popover placement="right" width="535" trigger="hover">
            <el-input v-model="form.backgroundImage" :style="{display:'none'}" autocomplete="off"></el-input>
            <img class="flagImage" slot="reference" :src="curBgImg" />
            <image_choice @getSelectImage="img => setImg(img)"></image_choice>
          </el-popover>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import image_choice from "@/components/widget/ImageChoiceWidget";
import { eventBus } from "@/common/eventBus";
import defaultFocus from "@/assets/images/1038275mi7nbetip71bf81.jpg";

export default {
  name: "templateThemeInfo",
  data() {
    const validateBackground = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请选择背景图片"));
      } else {
        callback();
      }
    };
    const validatorEname = (rule, value, callback) => {
      if (this.getContentId().action == "edit") {
        callback();
      } else {
        this.$store
          .dispatch("axios_check_templatename", {
            name: value
          })
          .then(res => {
            if (res.data.data.isExisted) {
              callback(new Error("已存在"));
            } else {
              callback();
            }
          })
          .catch(err => {});
      }
    };
    return {
      typeList: [
        { id: 1, name: "首页推荐页面" },
        { id: 2, name: "分类推荐页面" },
        { id: 3, name: "详情推荐页面" },
        { id: 5, name: "活动推荐页面" },
        { id: 6, name: "专项推荐页面" },
        { id: 7, name: "通用头部推荐" },
        { id: 8, name: "系统固定页面" },
        { id: 10, name: "其它推荐页面" }
      ],
      eidtTrue: false,
      dialogFormVisible: true,
      imagesBaseUrl: window.configs.static_IMAGES_BASEURL,
      form: {
        backgroundImage: "",
        commonPageId: "",
        commPageCname: "",
        commPageEname: "",
        pageTrackName: "",
        levelId: "9",
        templateUrl: false,
        bgimg: {
          id: "",
          picPath: ""
        }
      },
      curBgImg: defaultFocus,
      rules: {
        commPageCname: [
          { required: true, message: "必填项", trigger: "blur" },
          { min: 2, max: 18, message: "长度在2-18位字符", trigger: "blur" }
        ],
        commPageEname: [
          { required: true, message: "必填项", trigger: "blur" },
          { min: 5, max: 50, message: "长度在5-50位字符", trigger: "blur" },
          { validator: validatorEname, trigger: "blur" }
        ],
        backgroundImage: [
          { required: true, validator: validateBackground, trigger: "change" }
        ]
      },
      formLabelWidth: "120px",
      value: [1, 4],
      searchValues: "",
      currentPage: 1,
      recommendDisplayPage: []
    };
  },
  inject: [
    "getTemplateData",
    "getContentId",
    "getTemplateActionType",
    "setTemplateActionType"
  ],
  watch: {
    "form.backgroundImage": {
      handler(newValue, oldValue) {},
      deep: true,
      immediate: true
    },
    curBgImg(newValue, oldValue) {},
    searchValues(newValue, oldValue) {
      this.getTemplateOption();
    }
  },
  components: { image_choice },
  methods: {
    loadScrollData(scrollDown) {
      if (scrollDown) {
        this.$store
          .dispatch("axios_get_contentInfo", {
            contentType: 10,
            pageNum: ++this.currentPage,
            searchValue: this.searchValues
          })
          .then(res => {
            if (res != "undefined") {
              this.recommendDisplayPage = this.recommendDisplayPage.concat(
                res.data.data.records
              );
            }
          });
      }
    },
    bySearchValue(val) {
      this.currentPage = 1;
      this.searchValues = val;
    },
    getTemplateOption() {
      this.$store
        .dispatch("axios_get_contentInfo", {
          contentType: 10,
          pageNum: this.currentPage,
          searchValue: this.searchValues
        })
        .then(res => {
          if (res != "undefined") {
            this.recommendDisplayPage = res.data.data.records;
          }
        })
        .catch(err => {});
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          eventBus.$emit("setBgImg", this.form);
          this.setTemplateActionType("edit");
        } else {
          this.$message.warning("信息未填写完整！");
        }
      });
    },
    setImg(item) {
      this.dialogFormVisible = true;
      this.curBgImg = this.imagesBaseUrl + item.picPath;
      this.form.bgimg = item;
      this.form.backgroundImage = this.imagesBaseUrl + item.picPath;
    }
  },
  created() {
    this.getTemplateOption();
    if (
      this.getContentId().action == "edit" ||
      this.getTemplateActionType() == "edit"
    ) {
      this.eidtTrue = true;
      let temp = this.getTemplateData();
      for (var key in temp) {
        this.form[key] = temp[key];
      }
      this.form.commonPageId = temp.templateInfo.id;
      this.curBgImg = this.imagesBaseUrl + temp.bgimg.picPath;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-input {
  width: 80%;
}

.flagImage {
  width: 50px;
}

ul li img {
  width: 128px;
  height: 72px;
  list-style-type: none;
  float: left;
  margin-left: 10px;
  margin-top: 10px;
}
.selectImg {
  width: 100%;
  height: 400px;
  white-space: nowrap;
}
.selectImg ul li {
  list-style-type: none;
  float: left;
  margin-left: 10px;
  margin-top: 10px;
}
.dialog-footer {
  text-align: center;
}
</style>
