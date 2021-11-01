<template>
  <div>
    <el-dialog
     width="35vw"
      v-dialogDrag
      ref="dialog__wrapper"
      :title="titleAction[action]"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="归属分类" :label-width="formLabelWidth">
          <el-select v-model="form.levelId" placeholder="请选择">
            <el-option
              v-for="item in templateClassifyData"
              :key="item.id"
              :label="item.levelPageCname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模板名称" prop="templateCname" :label-width="formLabelWidth">
          <el-input v-model="form.templateCname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="模板地址" :label-width="formLabelWidth">
          <el-input v-model="form.templateUrl"></el-input>
        </el-form-item>
        <el-form-item label="背景图片" :label-width="formLabelWidth">
          <el-popover placement="right" width="535" trigger="hover">
            <img class="flagImage" slot="reference" :src="bgimg" />
            <image_choice @getSelectImage="img => setImg(img,0)"></image_choice>
          </el-popover>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { eventBus } from "@/common/eventBus";
import defaultFocus from "@/assets/images/add2.jpg";
import image_choice from "@/components/widget/ImageChoiceWidget";
export default {
  name: "giftForm",
  inject: ["getTemplateClassify", "getMenuId"],
  data() {
    return {
      menuId: this.getMenuId(),
      bgimg: defaultFocus,
      currentPage: 1,
      dialogFormVisible: false,
      imagesBaseUrl: window.configs.static_IMAGES_BASEURL,
      action: "",
      templateClassifyData: [],
      form: {},
      formLabelWidth: "120px",
      titleAction: {
        New: "新建模板",
        Edit: "编辑模板"
      },
      rules: {
        templateCname: [{ required: true, message: "必填项", trigger: "blur" }]
      }
    };
  },
  created() {},
  methods: {
    setImg(item) {
      this.bgimg = this.imagesBaseUrl + item.picPath;
      this.form.pageTemplatePic = item;
    },
    addGift() {
      this.templateClassifyData = this.getTemplateClassify();
      this.action = "New";
      this.dialogFormVisible = true;
      this.form = {};
      this.bgimg = defaultFocus;
    },
    editGift(v) {
      this.templateClassifyData = this.getTemplateClassify();
      this.form = v;
      this.action = "Edit";
      this.dialogFormVisible = true;
      if (v.pageTemplatePic) {
        this.bgimg = this.imagesBaseUrl + v.pageTemplatePic.picPath;
      } else {
        this.bgimg = defaultFocus;
      }
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.action == "New") {
            this.$store
              .dispatch("axios_add_pageTemplateWareHouseList", this.form)
              .then(res => {
                if (res.data.errorCode == "1000") {
                  this.$message.success("添加成功");
                  eventBus.$emit("refreshTemp");
                } else {
                  this.$message.error(res.data.errorMsg);
                }
              })
              .catch(err => {
                this.$message.error("添加失败");
              });
          } else if (this.action == "Edit") {
            this.$store
              .dispatch("axios_edit_pageTemplateWareHouseList", this.form)
              .then(res => {
                if (res.data.errorCode == "1000") {
                  this.$message.success("修改成功");
                  eventBus.$emit("refreshTemp");
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
    eventBus.$on("addGift", v => {
      this.activeData = v;
      this.addGift();
    });
    eventBus.$on("editGift", (v, a) => {
      this.activeData = a;
      this.editGift(v, a);
    });
  },
  components: { image_choice },
  beforeDestroy() {
    eventBus.$off("addGift");
    eventBus.$off("editGift");
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-select {
  width: 40%;
}
.el-input {
  width: 80%;
}
.el-checkbox {
  padding-left: 10px;
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
.prize_pic ul li {
  list-style-type: none;
  float: left;
  margin-left: 10px;
  margin-top: 10px;
}
</style>
