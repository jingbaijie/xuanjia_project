<template>
  <div>
    <el-dialog
      width="25vw"
      v-dialogDrag
      ref="dialog__wrapper"
      title="组件属性设置"
      :visible.sync="dialogVisible"
    >
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="标题图片" :label-width="formLabelWidth">
          <el-popover placement="right" width="535" trigger="hover">
            <img class="flagImage" slot="reference" :src="titlePic" alt />
            <image_choice @getSelectImage="(img) => setImg(img)"></image_choice>
          </el-popover>
        </el-form-item>
        <el-form-item label="标题" :label-width="formLabelWidth">
          <el-input v-model="form.cname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="模板url" :label-width="formLabelWidth">
          <el-select
            v-model="form.templateUrl"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in templateUrlData"
              :key="item.id"
              :label="item.dictLabel"
              :value="item.dictLabel"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="X坐标" :label-width="formLabelWidth">
          <el-input v-model="form.xValue" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Y坐标" :label-width="formLabelWidth">
          <el-input v-model="form.yValue" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          size="mini"
          @click="onSubmit('form')"
          style="margin-right: 20px"
          >保 存</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { eventBus } from "@/common/eventBus";
import defaultFocus from "@/assets/images/add2.jpg";
import image_choice from "@/components/widget/ImageChoiceWidget";
export default {
  name: "editComponent",
  components: { image_choice },
  data() {
    return {
      dialogVisible: false,
      formLabelWidth: "120px",
      titlePic: defaultFocus,
      templateUrlData: [],
      form: {
        cname: "",
        templateUrl:"",
        xValue: "",
        yValue: "",
        titlePicId: "",
      },
      imagesBaseUrl: window.configs.static_IMAGES_BASEURL,
      rules: {},
    };
  },
  methods: {
    init(v) {
      this.dialogVisible = true;
      this.getTemplateUrl();
      this.form = v;
      this.$set(this.form, "cname", v.cname);
      this.$set(this.form, "xValue", v.xValue);
      this.$set(this.form, "yValue", v.yValue);
      this.$set(this.form, "templateUrl", v.templateUrl);
      if (this.form["titlePic"]) {
        this.titlePic = this.imagesBaseUrl + this.form["titlePic"].picPath;
      } else if (v.titlePic) {
        this.titlePic = this.imagesBaseUrl + v.titlePic.picPath;
      } else {
        this.titlePic = defaultFocus;
      }
    },
    // 获取模板url下拉框
    getTemplateUrl() {
      this.$store
        .dispatch("axios_get_selectDictDataByType", {
          dictType: "templateUrl",
        })
        .then((res) => {
          this.templateUrlData = res.data.data;
          this.loading = false;
        })
        .catch(err=>{
          this.loading = false;
        });
    },
    setImg(item) {
      this.titlePic = this.imagesBaseUrl + item.picPath;
      this.form["titlePic"] = {};
      this.form["titlePic"].id = item.id;
      this.form["titlePic"].picPath = item.picPath;
      this.form.titlePicId = item.id;
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          eventBus.$emit("editComponent", this.form);
          this.dialogVisible = false;
        }
      });
    },
  },
};
</script>

<style scoped>
.el-input {
  width: 80%;
}
.dialog-footer {
  text-align: center;
}
.flagImage {
  width: 50px;
}
</style>