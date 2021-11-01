<template>
  <div>
    <el-dialog
      width="30vw"
      v-dialogDrag
      ref="dialog__wrapper"
      :title="this.form.id ? '编辑皮肤' : '添加皮肤'"
      :visible.sync="dialogFormVisible"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item
          label="中文名称"
          :label-width="formLabelWidth"
          prop="cname"
        >
          <el-input v-model="form.cname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="英文名称"
          :label-width="formLabelWidth"
          prop="ename"
        >
          <el-input v-model="form.ename" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="归属主题"
          :label-width="formLabelWidth"
          prop="themeId"
        >
          <el-select v-model="form.themeId" placeholder="请选择">
            <el-option
              v-for="item in themeList"
              :key="item.id"
              :label="item.cname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="样式文件" :label-width="formLabelWidth">
          <el-input v-model="form.nick" autocomplete="off"></el-input>
        </el-form-item> -->
        <el-form-item label="背景图片" :label-width="formLabelWidth">
          <el-popover placement="right" width="535" trigger="hover">
            <img class="flagImage" slot="reference" :src="skinBigimgUrl" alt />
            <image_choice @getSelectImage="(img) => setImg(img)"></image_choice>
          </el-popover>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="onSubmit('form')"
          style="margin-right: 20px"
          >确 定</el-button
        >
        <el-button type="primary" @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { eventBus } from "@/common/eventBus";
import defaultFocus from "@/assets/images/add2.jpg";
import image_choice from "@/components/widget/ImageChoiceWidget";
export default {
  name: "editColumn",
  props: ["themeList"],
  data() {
    return {
      formLabelWidth: "100px",
      skinBigimgUrl: defaultFocus,
      imagesBaseUrl: window.configs.static_IMAGES_BASEURL,
      form: {
        id: "",
        cname: "",
        ename: "",
        skinBigimg: "",
      },
      rules: {
        cname: [{ required: true, message: "必填项", trigger: "blur" }],
        ename: [{ required: true, message: "必填项", trigger: "blur" }],
        themeId: [{ required: true, message: "必填项", trigger: "blur" }],
      },
      parentData: [],
      dialogFormVisible: false,
    };
  },
  components: { image_choice },
  created() {
    eventBus.$on("addSkin", () => {
      this.addSkin();
    });
    eventBus.$on("editSkin", (v) => {
      this.editSkin(v);
    });
  },
  beforeDestroy() {
    eventBus.$off(["addSkin"]);
  },
  methods: {
    cancel() {
      this.dialogFormVisible = false;
      this.form = {};
      this.$refs.form.resetFields();
    },
    setImg(item) {
      this.skinBigimgUrl = this.imagesBaseUrl + item.picPath;
      this.form.skinBigimg = item.id;
    },
    addSkin() {
      this.dialogFormVisible = true;
      this.skinBigimgUrl = defaultFocus;
      this.form = {};
    },
    editSkin(v) {
      this.dialogFormVisible = true;
      this.form = v;
      if (v.themeSkinBackPic) {
        this.skinBigimgUrl = this.imagesBaseUrl + v.themeSkinBackPic.picPath;
      } else {
        this.skinBigimgUrl = defaultFocus;
      }
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let actionUrl;
          this.form.id
            ? (actionUrl = "axios_update_themeskin")
            : (actionUrl = "axios_add_themeskin");
          this.$store
            .dispatch(actionUrl, this.form)
            .then((response) => {
              if (response.data.errorCode == "1000") {
                this.$message.success("操作成功");
                eventBus.$emit("refreshSkin");
                this.dialogFormVisible = false;
              } else {
                this.$message.error(response.data.errorMsg);
              }
            })
            .catch((err) => {
              this.$message.error("操作失败");
            });          
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style scoped>
.el-input {
  width: 90%;
}
.flagImage {
  width: 50px;
}
.dialog-footer {
  text-align: center;
}
</style>