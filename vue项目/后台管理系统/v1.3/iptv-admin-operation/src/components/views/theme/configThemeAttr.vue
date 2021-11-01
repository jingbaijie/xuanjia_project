<template>
  <div>
    <el-dialog width="30vw" title="主题属性详情设置" :visible.sync="dialogSetTheme">
      <el-form ref="attrConfigForm" :model="attrConfigForm" :rules="rules">
        <el-form-item label="主题" :label-width="formLabelWidth">
          <el-input :disabled="true" v-model="attrConfigForm.themeName.name" style="width:50%"></el-input>
        </el-form-item>
        <!-- <el-form-item label="页面选择" :label-width="formLabelWidth">
          <el-radio v-model="attrConfigForm.themeFlag" label="1">系统默认</el-radio>
          <el-radio v-model="attrConfigForm.themeFlag" label="2">当前主题</el-radio>
        </el-form-item>-->

        <el-form-item label="属性名称" prop="attrName" :label-width="formLabelWidth">
          <el-select
            v-model="attrConfigForm.attributeExplain"
            @change="selectChange"
            filterable
            allow-create
            default-first-option
            placeholder="请选择"
            value-key="attrConfigForm.attributeExplain"
          >
            <el-option
              v-for="item in DetailDataList"
              :key="item.id"
              :label="item.remark"
              :value="item.remark"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="背景图片" :label-width="formLabelWidth">
          <el-popover placement="right" width="535" trigger="hover">
            <el-input v-model="attrConfigForm.BGM1" :style="{display:'none'}" autocomplete="off"></el-input>
            <img class="flagImage" slot="reference" :src="imagesBaseUrl+curBgImg1" />
            <image_choice @getSelectImage="img => setImg(img,1)"></image_choice>
          </el-popover>
        </el-form-item>
        <el-form-item label="标签图片" :label-width="formLabelWidth">
          <el-popover placement="right" width="535" trigger="hover">
            <el-input v-model="attrConfigForm.BGM2" :style="{display:'none'}" autocomplete="off"></el-input>
            <img class="flagImage" slot="reference" :src="imagesBaseUrl+curBgImg2" />
            <image_choice @getSelectImage="img => setImg(img,2)"></image_choice>
          </el-popover>
        </el-form-item>
        <el-form-item label="焦点图片" :label-width="formLabelWidth">
          <el-popover placement="right" width="535" trigger="hover">
            <el-input v-model="attrConfigForm.BGM3" :style="{display:'none'}" autocomplete="off"></el-input>
            <img class="flagImage" slot="reference" :src="imagesBaseUrl+curBgImg3" />
            <image_choice @getSelectImage="img => setImg(img,3)"></image_choice>
          </el-popover>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" :style="{'text-align':'center'}">
        <el-button type="primary" @click="onSubmit('attrConfigForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { Message, Loading } from "element-ui";
import { eventBus } from "@/common/eventBus";
import image_choice from "@/components/widget/ImageChoiceWidget";
import defaultFocus from "@/assets/images/1038275mi7nbetip71bf81.jpg";
export default {
  name: "",
  inject: ["getThemeData"],
  data() {
    return {
      id: "",
      imagesBaseUrl: window.configs.static_IMAGES_BASEURL,
      attrConfigForm: {
        BGM1: "",
        BGM3: "",
        BGM2: "",
        bgimg: {
          id: "",
          picPath: ""
        },
        attributeExplain: "",
        themeFlag: "",
        themeId: "",
        themeName: this.getThemeData(),
        DetailName: ""
      },
      ImgList: "",
      imgList: [],
      attrId: "",
      attrName: "",
      dictLabel: "",
      curBgImg1: defaultFocus,
      curBgImg2: defaultFocus,
      curBgImg3: defaultFocus,
      // themeData: {},
      // aa:this.getThemeData(),
      formLabelWidth: "120px",
      themeDataList: [],
      DetailDataList: [],
      dialogSetTheme: false,
      rules: {
        // attrName: [{ required: true, message: "必填项", trigger: "blur" }]
      }
    };
  },
  // watch: {
  //   "attrConfigForm.attributeExplain":{
  //     handler(){
  //       this.selectChange(val);
  //     },
  //   }
  // },
  components: { image_choice },
  mounted() {
    this.getTheme();
    this.getDetail();
  },
  created() {
    console.log(this.getThemeData());
    eventBus.$on("addThemeAttr", () => {
      this.addThemeAttr();
    });
    eventBus.$on("editThemeAttr", v => {
      this.editThemeAttr(v);
    });
  },
  methods: {
    setImg(item, type) {
      this.dialogFormVisible = true;
      this.attrConfigForm.bgimg = item;
      // this.attrConfigForm.curBgImg2 = this.imagesBaseUrl + item.picPath;
      let imgList = [];

      if (type == 1) {
        this.curBgImg1 = item.picPath;
      }
      if (type == 2) {
        this.curBgImg2 = item.picPath;
      }
      if (type == 3) {
        this.curBgImg3 = item.picPath;
      }
    },

    selectChange(val) {
      this.attrId = val;
      // this.dictLabel = val.dictLabel;
      console.log(this.attrId);
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
          console.log(this.DetailDataList);
        })
        .catch();
    },
    addThemeAttr() {
      this.dialogSetTheme = true;
      this.attrConfigForm.attributeExplain = "";
      this.curBgImg1 = "";
      this.curBgImg2 = "";
      this.curBgImg3 = "";
      this.attrConfigForm.themeId = this.getThemeData().id;
    },
    editThemeAttr(v) {
      let imgList = [];
      let arr = v.attributeValue;
      imgList = arr.split(",");
      console.log("编辑前带过来的---------" + imgList);
      console.log(imgList[0]);
      this.dialogSetTheme = true;
      this.attrConfigForm.id = v.id;
      this.curBgImg1 = imgList[0];
      this.curBgImg2 = imgList[1];
      this.curBgImg3 = imgList[2];
      console.log("curBgImg1-----" + this.curBgImg1);
      console.log("curBgImg2-----" + this.curBgImg2);
      console.log("curBgImg3-----" + this.curBgImg3);
      // (this.curBgImg1=="undefined"||this.curBgImg1==undefined)&&(this.curBgImg1=defaultFocus)
      // (this.curBgImg2=="undefined"||this.curBgImg2==undefined)&&(this.curBgImg2=defaultFocus)
      // (this.curBgImg3=="undefined"||this.curBgImg3==undefined)&&(this.curBgImg3=defaultFocus)

      this.attrConfigForm.attributeExplain = v.attributeExplain;
      this.attrConfigForm.themeId = this.getThemeData().id;
      this.selectChange(this.attrConfigForm.attributeExplain);
    },

    onSubmit(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          //判断图片选择
          let imgList = [];
          imgList.push(this.curBgImg1);
          imgList.push(this.curBgImg2);
          imgList.push(this.curBgImg3);
          this.ImgList = imgList.join(",");
          console.log(this.ImgList);
          let actionUrl;
          this.attrConfigForm.id
            ? (actionUrl = "axios_update_themeDetail")
            : (actionUrl = "axios_add_themeDetail");
          for (var i = 0; i < this.DetailDataList.length; i++) {
            if (this.DetailDataList[i].remark == this.attrId) {
              this.attrName = this.DetailDataList[i].remark;
              this.dictLabel = this.DetailDataList[i].dictLabel;
              console.log(this.attrName);
            }
          }
          this.$store
            .dispatch(actionUrl, {
              id: this.attrConfigForm.id || undefined,
              attributeExplain: this.attrName,
              // attributeExplain:this.attrConfigForm.attributeExplain,
              attributeKey: this.dictLabel,
              attributeValue: this.ImgList,
              themeId: this.attrConfigForm.themeId
            })
            .then(res => {
              if (res.data.errorCode == "1000") {
                this.$emit("refreshAttrList");
                this.dialogSetTheme = false;
                this.attrConfigForm.id = null;
                this.ImgList = "";
                Message({ message: res.data.errorMsg, type: "success" });
              } else {
                Message({ message: res.data.errorMsg, type: "error" });
              }
            })
            .catch(err => {
              this.$message.error("操作失败");
            });
        } else {
          return false;
        }
      });
    }
  },
  beforeDestroy() {
    eventBus.$off("addThemeAttr", "editThemeAttr", "refreshAttrList");
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