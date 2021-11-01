<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>新建主题模板</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="onSubmit('form')">提 交</el-button>
      </div>
      <el-form :model="form" :rules="rules" ref="form" style="max-height:700px;overflow-y:auto">
        <el-form-item label="归属类型" prop="levelId" :label-width="formLabelWidth">
          <el-select v-model="form.pageType" placeholder="请选择">
            <el-option
              v-for="item in typeList"
              :key="'pageType_' + item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="form.pageType == 10"
          label="归属模板"
          :label-width="formLabelWidth"
          prop="commonPageId"
        >
          <el-select
            v-selectScroll="loadScrollData"
            :filter-method="bySearchValue"
            v-model="form.templateInfo.id"
            @change="changeT()"
            filterable
          >
            <el-option
              v-for="(item, index) in recommendDisplayPage"
              :key="'template' + index"
              :label="item.recommendDisplayName"
              :value="item.recommendDisplayValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专题中文名" prop="commPageCname" :label-width="formLabelWidth">
          <el-input v-model="form.commPageCname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="专题英文名" prop="commPageEname" :label-width="formLabelWidth">
          <el-input v-model="form.commPageEname" :disabled="eidtTrue" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="埋点名称" prop="pageTrackName" :label-width="formLabelWidth">
          <el-input v-model="form.pageTrackName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否免费" :label-width="formLabelWidth">
          <el-switch
            v-model="form.isFree"
            :active-value="0"
            :inactive-value="1"
            @change="changeIsFree()"
          ></el-switch>
        </el-form-item>
        <el-form-item label="more1" prop="more1" :label-width="formLabelWidth">
          <el-input v-model="_more1" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="more2" prop="more2" :label-width="formLabelWidth">
          <el-input v-model="_more2" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="more3" prop="more3" :label-width="formLabelWidth">
          <el-input v-model="_more3" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="more4" prop="more4" :label-width="formLabelWidth">
          <el-input v-model="_more4" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="背景图片" prop="backgroundImage" :label-width="formLabelWidth">
          <el-popover placement="right" width="535" trigger="hover">
            <el-input
              v-model="form.backgroundImage"
              :style="{ display: 'none' }"
              autocomplete="off"
            ></el-input>
            <img class="flagImage" slot="reference" :src="curBgImg" />
            <image_choice @getSelectImage="img => setImg(img)"></image_choice>
          </el-popover>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { eventBus } from "@/common/eventBus";
import image_choice from "@/components/widget/ImageChoiceWidget";
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
        { id: 6, name: "通用专题页面" },
        { id: 10, name: "其它专题页面" }
      ],
      pageTrackName: "", //埋点名称
      eidtTrue: false,
      dialogFormVisible: true,
      imagesBaseUrl: window.configs.static_IMAGES_BASEURL,
      recommendDisplayPage: [],
      form: {
        backgroundImage: "",
        commonPageId: "",
        commPageCname: "",
        commPageEname: "",
        pageTrackName: "", //埋点名称
        isFree: 1,
        more1: "",
        more2: "",
        more3: "",
        more4: "",
        levelId: "4",
        pageType: 10, //页面类型
        templateUrl: "",
        templateInfo: {},
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
      imgData: [],
      formLabelWidth: "120px",
      data: [],
      currentPage: 1,
      value: [1, 4]
    };
  },
  inject: [
    "setTemplateData",
    "getTemplateData",
    "getContentId",
    "setContentId",
    "setTemplateActionType",
    "getTemplateActionType"
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
    //动态添加推荐类型
    selectPageType(val) {
      let obj = {};
      obj = this.typeList.find(item => {
        return item.id === val;
      });
      this.form.pageType = Number(obj.id);
    },
    changeIsFree() {},
    changeT() {},
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.form.templateInfo.id || this.form.pageType == 6) {
            this.form.templateInfo.id = 17;
          }
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
      if (
        temp.templateUrl &&
        temp.templateUrl.indexOf("columnGeneral.html") > -1
      ) {
        temp.pageType = 6;
        this.form.pageType = 6;
      } else {
        this.form.pageType = 10;
        temp.pageType = 10;
      }
      for (var key in temp) {
        this.form[key] = temp[key];
      }
      this.form.isFree = temp.isFree;
      this.form.backgroundImage = temp.bgimg.picPath;
      this.curBgImg = this.imagesBaseUrl + temp.bgimg.picPath;
    }
  },
  computed: {
    _pageTrackName: {
      set: function(val) {
        this.form.pageTrackName = val;
      },
      get: function(val) {
        return this.form.pageTrackName;
      }
    },

    _more1: {
      set: function(val) {
        this.form.more1 = val;
      },
      get: function(val) {
        return this.form.more1;
      }
    },
    _more2: {
      set: function(val) {
        this.form.more2 = val;
      },
      get: function(val) {
        return this.form.more2;
      }
    },
    _more3: {
      set: function(val) {
        this.form.more3 = val;
      },
      get: function(val) {
        return this.form.more3;
      }
    },
    _more4: {
      set: function(val) {
        this.form.more4 = val;
      },
      get: function(val) {
        return this.form.more4;
      }
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
