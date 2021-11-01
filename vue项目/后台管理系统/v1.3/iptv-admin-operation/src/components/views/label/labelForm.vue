<template>
  <div>
    <el-dialog
      width="35vw"
      v-dialogDrag
      ref="dialog__wrapper"
      title="添加标签"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="标签名称" prop="typeCname" :label-width="formLabelWidth">
          <el-input type="text" v-model="form.typeCname"></el-input>
        </el-form-item>
        <el-form-item label="产品名称" :label-width="formLabelWidth" :style="{'width':'60%'}">
          <div class="block">
            <el-select v-model="form.parentId" placeholder="请选择">
              <el-option
                v-for="item in parentData"
                :key="item.id"
                :label="item.typeCname"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="标签图片" :label-width="formLabelWidth">
          <el-popover placement="right" width="535" trigger="hover">
            <img class="flagImage" slot="reference" :src="labelPicUrl" />
            <image_choice @getSelectImage="img => setImg(img,0)"></image_choice>
          </el-popover>
        </el-form-item>
        <el-form-item label="详情图片" :label-width="formLabelWidth">
          <el-popover placement="right" width="535" trigger="hover">
            <img class="flagImage" slot="reference" :src="detailPicUrl" />
            <image_choice @getSelectImage="img => setImg(img,1)"></image_choice>
          </el-popover>
        </el-form-item>
        <el-form-item label="图标" :label-width="formLabelWidth">
          <el-popover placement="right" width="535" trigger="hover">
            <img class="flagImage" slot="reference" :src="iconPicUrl" />
            <image_choice @getSelectImage="img => setImg(img,2)"></image_choice>
          </el-popover>
        </el-form-item>
        <el-form-item label="排行ID" :label-width="formLabelWidth">
          <el-input-number v-model="form.rankId" :min="0" controls-position="right"></el-input-number>
        </el-form-item>
      </el-form>
      <slot :bbbbb="lists"></slot>
      <div slot="footer">
        <el-button type="primary" @click="onSubmit('form')">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import image_choice from "@/components/widget/ImageChoiceWidget";
import defaultFocus from "@/assets/images/add2.jpg";
import { eventBus } from "@/common/eventBus";

export default {
  name: "classifyForm",
  props: ["lists"],
  data() {
    return {
      iconView: false,
      dialogFormVisible: false,
      mtBtn: "-根目录-",
      action: "",
      menuId: "",
      detailPicUrl: defaultFocus,
      labelPicUrl: defaultFocus,
      iconPicUrl: defaultFocus,
      form: {},
      formLabelWidth: "120px",
      value: [1, 4],
      parentData: [],
      preBtn: true,
      nextBtn: false,
      pageTotle: 0,
      currentPage: 1,
      dialogFormVisible: false,
      imagesBaseUrl: window.configs.static_IMAGES_BASEURL,
      action: "",
      imgData: [],
      rules: {
        typeCname: [{ required: true, message: "必填项", trigger: "blur" }]
      }
    };
  },
  inject: ["getClassifyData"],
  components: { image_choice },
  methods: {
    addClassify() {
      this.dialogFormVisible = true;
      this.parentData = this.getClassifyData();
      this.form = {};
      this.detailPicUrl = defaultFocus;
      this.labelPicUrl = defaultFocus;
      this.iconPicUrl = defaultFocus;
    },
    editClassify(Classify) {
      this.dialogFormVisible = true;
      this.parentData = this.getClassifyData();
      this.form = Classify;
      this.form.parentId = Classify.parent.id;
      Classify.detailPic
        ? (this.detailPicUrl = this.imagesBaseUrl + Classify.detailPic.picPath)
        : (this.detailPicUrl = defaultFocus);
      Classify.labelPic
        ? (this.labelPicUrl = this.imagesBaseUrl + Classify.labelPic.picPath)
        : (this.labelPicUrl = defaultFocus);
      Classify.iconPic
        ? (this.iconPicUrl = this.imagesBaseUrl + Classify.iconPic.picPath)
        : (this.iconPicUrl = defaultFocus);
    },
    setImg(item, type) {
      if (type == 0) {
        this.labelPicUrl = this.imagesBaseUrl + item.picPath;
        this.form.labelPic = item;
      } else if (type == 1) {
        this.detailPicUrl = this.imagesBaseUrl + item.picPath;
        this.form.detailPic = item;
      } else {
        this.iconPicUrl = this.imagesBaseUrl + item.picPath;
        this.form.iconPic = item;
      }
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.action == "add") {
            this.form["parent"] = {};
            this.form["parent"].id = this.form.parentId;
            this.$store
              .dispatch("axios_add_labelContent", this.form)
              .then(res => {
                if (res.data.errorCode == "1000") {
                  this.$message.success("添加成功");
                  this.$emit("refreshLabel");
                } else {
                  this.$message.error(res.data.errorMsg);
                }
              })
              .catch(err => {
                this.$message.error("添加失败");
              });
          } else {
            this.$store
              .dispatch("axios_edit_labelContent", this.form)
              .then(res => {
                if (res.data.errorCode == "1000") {
                  this.$message.success("修改成功");
                  this.$emit("refreshLabel");
                } else {
                  this.$message.error(res.data.errorMsg);
                }
              })
              .catch(err => {
                this.$message.error("修改失败");
              });
          }
          this.dialogFormVisible = false;
        } else {
          return false;
        }
      });
    }
  },
  mounted() {
    eventBus.$on("addLabel", () => {
      this.action = "add";
      this.addClassify();
    });
    eventBus.$on("editLabel", v => {
      this.action = "edit";
      this.editClassify(v);
    });
  },
  beforeDestroy() {
    eventBus.$off(["addLabel", "editLabel"]);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  scoped>
.el-input {
  width: 80%;
}
.el-checkbox {
  margin-left: 25px;
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
.flagImage {
  width: 50px;
}
ul li img {
  width: 128px;
  height: 72px;
}
.selectImg {
  width: 100%;
  height: 400px;
  white-space: nowrap;
}
.selectImg li {
  list-style-type: none;
  float: left;
  margin-left: 10px;
  margin-top: 10px;
}
</style>
