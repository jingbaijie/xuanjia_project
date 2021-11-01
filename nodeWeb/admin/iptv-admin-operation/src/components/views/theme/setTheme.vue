<template>
  <div>
    <el-dialog width="35vw" title="主题属性详情设置" :visible.sync="dialogSetTheme">
      <el-form ref="themeForm" :model="themeForm" :rules="rules">
        <el-form-item label="主题" prop="themeName" :label-width="formLabelWidth">
          <el-select v-model="themeForm.themeName" filterable placeholder="请选择">
            <el-option
              v-for="item in themeDataList"
              :key="item.id"
              :label="item.themeCname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="页面选择" :label-width="formLabelWidth">
          <el-radio v-model="themeForm.themeFlag" label="1">系统默认</el-radio>
          <el-radio v-model="themeForm.themeFlag" label="2">当前主题</el-radio>
        </el-form-item>
        <el-form-item label="属性名称" :label-width="formLabelWidth">
          <el-select v-model="themeForm.DetailName" filterable placeholder="请选择">
            <el-option
              v-for="item in DetailDataList"
              :key="item.id"
              :label="item.remark"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="背景图片" :label-width="formLabelWidth">
          <el-popover placement="right" width="535" trigger="hover">
            <el-input
              v-model="themeForm.backgroundImage"
              :style="{display:'none'}"
              autocomplete="off"
            ></el-input>
            <img class="flagImage" slot="reference" :src="curBgImg" />
            <image_choice @getSelectImage="img => setImg(img)"></image_choice>
          </el-popover>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" :style="{'text-align':'center'}">
        <el-button type="primary" @click="onSubmit('themeForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { eventBus } from "@/common/eventBus";
import image_choice from "@/components/widget/ImageChoiceWidget";
import defaultFocus from "@/assets/images/1038275mi7nbetip71bf81.jpg";
export default {
  name: "",
  data() {
    return {
      id: "",
       imagesBaseUrl: window.configs.static_IMAGES_BASEURL,
      themeForm: {
        backgroundImage: "",
        bgimg: {
          id: "",
          picPath: ""
        },
        themeFlag: "",
        themeName: "",
        DetailName: ""
      },
      curBgImg: defaultFocus,
      themeData: {},
      formLabelWidth: "120px",
      themeDataList: [],
      DetailDataList: [],
      dialogSetTheme: false,
      rules: {
        themeName: [{ required: true, message: "必填项", trigger: "blur" }]
      }
    };
  },
  components: { image_choice },
  mounted() {
    this.getTheme();
    this.getDetail();
  },
  created() {
    eventBus.$on("setTheme", v => {
      this.dialogSetTheme = true;
      //   this.setTheme(v);
      this.id = v.id;
    });
    // this.curBgImg = this.imagesBaseUrl + temp.bgimg.picPath;
  },
  methods: {
    setImg(item) {
      this.dialogFormVisible = true;
      this.curBgImg = this.imagesBaseUrl + item.picPath;
      this.themeForm.bgimg = item;
      this.themeForm.backgroundImage = this.imagesBaseUrl + item.picPath;
    },
    //获取主题
    getTheme() {
      this.$store
        .dispatch("axios_get_themeList", {
          searchValue: "",
          pageNum: 1,
          pageSize: 10
        })
        .then(res => {
          console.log(res);
          this.themeDataList = res.data.data.records;
        })
        .catch();
    },
    //获取属性名

    getDetail() {
      this.$store
        .dispatch("axios_get_selectDictDataByType", {
          dictType: "SYS_THEME_CONFIG"
        })
        .then(res => {
          console.log(res);
          this.DetailDataList = res.data.data;
        })
        .catch();
    },
    // getDetail() {
    //   this.$store
    //     .dispatch("axios_get_themeDetail", {
    //       dictType: 'SYS_THEME_CONFIG'
    //     })
    //     .then(res => {
    //       console.log(res);
    //       this.DetailDataList = res.data.data;
    //     })
    //     .catch();
    // },
    onSubmit(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          
        } else {
        }
      });
    },
  },

  beforeDestroy() {
    eventBus.$off("setTheme");
  }
};
</script>
<style scoped>
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
</style>