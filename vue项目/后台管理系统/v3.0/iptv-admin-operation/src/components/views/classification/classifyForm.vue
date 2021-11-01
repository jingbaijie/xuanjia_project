<template>
  <div>
    <el-dialog
      width="35vw"
      v-dialogDrag
      ref="dialog__wrapper"
      :title="titleE[action]"
      :visible.sync="dialogFormVisible"
      :before-close="handleClose"
    >
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item
          label="分类名称"
          prop="typeCname"
          :label-width="formLabelWidth"
        >
          <el-input type="text" v-model="form.typeCname"></el-input>
        </el-form-item>
        <el-form-item label="英文名称" :label-width="formLabelWidth">
          <el-input type="text" v-model="form.typeEname"></el-input>
        </el-form-item>
        <el-form-item
          label="父级分类"
          :label-width="formLabelWidth"
          :style="{ 'text-align': 'center', width: '60%' }"
        >
          <div class="block">
            <el-cascader
              :options="parentData"
              :props="defaultProps"
              v-model="form.parent.id"
              :show-all-levels="false"
              clearable
            ></el-cascader>
          </div>
        </el-form-item>
        <el-form-item label="分类图片" :label-width="formLabelWidth">
          <el-popover placement="right" width="535" trigger="hover">
            <img class="flagImage" slot="reference" :src="labelPicUrl" />
            <image_choice
              @getSelectImage="img => setImg(img, 0)"
            ></image_choice>
          </el-popover>
        </el-form-item>
        <el-form-item label="详情图片" :label-width="formLabelWidth">
          <el-popover placement="right" width="535" trigger="hover">
            <img class="flagImage" slot="reference" :src="detailPicUrl" />
            <image_choice
              @getSelectImage="img => setImg(img, 1)"
            ></image_choice>
          </el-popover>
        </el-form-item>
        <el-form-item label="缩略图" :label-width="formLabelWidth">
          <el-popover placement="right" width="535" trigger="hover">
            <img class="flagImage" slot="reference" :src="iconPicUrl" />
            <image_choice
              @getSelectImage="img => setImg(img, 2)"
            ></image_choice>
          </el-popover>
        </el-form-item>
        <el-form-item label="排行ID" :label-width="formLabelWidth">
          <el-input-number
            v-model="form.rankId"
            :min="0"
            controls-position="right"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="onSubmit('form')">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { eventBus } from "@/common/eventBus";
import { mapGetters } from "vuex";
import defaultFocus from "@/assets/images/add2.jpg";
import image_choice from "@/components/widget/ImageChoiceWidget";

export default {
  name: "classifyForm",
  data() {
    return {
      iconView: false,
      dialogFormVisible: false,
      titleE: {
        add: "新建",
        edit: "编辑"
      },
      action: "",
      detailPicUrl: defaultFocus,
      labelPicUrl: defaultFocus,
      iconPicUrl: defaultFocus,
      form: {
        parent: {},
        typeCname: "",
        typeEname: "",
        detailpicId: "",
        labelpicId: "",
        iconId: "",
        rankId: "",
        type: "1"
      },
      formLabelWidth: "120px",
      value: [1, 4],
      parentData: [],
      currentPage: 1,
      dialogFormVisible: false,
      imagesBaseUrl: window.configs.static_IMAGES_BASEURL,
      imgData: [],
      defaultProps: {
        children: "childrenList",
        label: "typeCname",
        value: "id",
        checkStrictly: true,
        expandTrigger: "hover",
        emitPath: false
      },
      rules: {
        typeCname: [{ required: true, message: "必填项", trigger: "blur" }]
      }
    };
  },
  inject: ["getClassifyData"],
  computed: {
    ...mapGetters([])
  },
  components: { image_choice },
  methods: {
    handleClose(form) {
      this.clearForm();
      this.dialogFormVisible = false;
    },
    clearForm() {
      this.$refs["form"].clearValidate();
    },
    setImg(item, type) {
      if (type == 0) {
        this.labelPicUrl = this.imagesBaseUrl + item.picPath;
        // this.form.labelPic = item;
        this.form.labelpicId = item.id;
      } else if (type == 1) {
        this.detailPicUrl = this.imagesBaseUrl + item.picPath;
        // this.form.detailPic = item;
        this.form.detailpicId = item.id;
      } else {
        this.iconPicUrl = this.imagesBaseUrl + item.picPath;
        // this.form.iconPic = item;
        this.form.iconId = item.id;
      }
    },
    getImages(tab) {
      let formateData = {
        levelId: this.levelId,
        pageNum: this.currentPage,
        pageSize: 12,
        temp: 0
      };

      if (this.levelId == 0) {
        delete formateData.levelId;
      }

      this.$store
        .dispatch("axios_get_pic_resouce", formateData)
        .then(rs => {
          this.imgData = rs.data.data.records;
        })
        .catch(err => {});
    },

    showIconPanel(arg) {
      this.iconView = arg;
    },
    addClassify() {
      this.action = "add";
      this.dialogFormVisible = true;
      this.parentData = this.getClassifyData();
      this.form = {
        parent: { id: "" },
        typeCname: "",
        typeEname: "",
        detailPic: { id: "" },
        labelPic: { id: "" },
        iconPic: { id: "" },
        rankId: ""
      };
      this.detailPicUrl = this.imagesBaseUrl + defaultFocus;
      this.labelPicUrl = this.imagesBaseUrl + defaultFocus;
      this.iconPicUrl = this.imagesBaseUrl + defaultFocus;
    },
    editClassify(Classify) {
      // debugger;
      this.action = "edit";
      this.dialogFormVisible = true;
      this.parentData = this.getClassifyData();
      this.form = Classify;
      this.form = {
        id: Classify.id,
        parent: { id: 1 },
        typeCname: Classify.typeCname,
        typeEname: Classify.typeEname,
        rankId: Classify.rankId
      };
      this.form.labelpicId = Classify.labelPic && Classify.labelPic.id;
      this.form.detailpicId = Classify.detailPic && Classify.detailPic.id;
      this.form.iconId = Classify.iconPic && Classify.iconPic.id;
      this.detailPicUrl = Classify.detailPic
        ? this.imagesBaseUrl + Classify.detailPic.picPath
        : this.imagesBaseUrl + defaultFocus;
      this.labelPicUrl = Classify.labelPic
        ? this.imagesBaseUrl + Classify.labelPic.picPath
        : this.imagesBaseUrl + defaultFocus;
      this.iconPicUrl = Classify.iconPic
        ? this.imagesBaseUrl + Classify.iconPic.picPath
        : this.imagesBaseUrl + defaultFocus;
    },
    onSubmit(formName) {
      let param = {};
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.action == "add") {
            this.$store
              .dispatch("axios_add_typeInfo", this.form)
              .then(res => {
                if (res.data.errorCode == "1000") {
                  this.$message.success("添加成功");
                  eventBus.$emit("refreshClassify");
                } else {
                  this.$message.error("添加失败" + res.data.errorMsg);
                }
              })
              .catch(err => {
                this.$message.error("添加失败");
              });
          } else {
            this.$store
              .dispatch("axios_edit_typeInfo", this.form)
              .then(res => {
                if (res.data.errorCode == "1000") {
                  this.$message.success("修改成功");
                } else {
                  this.$message.error("修改失败：" + res.data.errorMsg);
                }
              })
              .catch(err => {
                this.$message.error("修改成功");
              });
          }
          this.dialogFormVisible = false;
        } else {
          return false;
        }
      });
    }
  },
  created() {
    this.getImages();
  },
  mounted() {
    eventBus.$on("addClassify", v => {
      this.addClassify();
    });
    eventBus.$on("editClassify", v => {
      this.editClassify(v);
    });
  },
  beforeDestroy() {
    eventBus.$off(["addClassify", "editClassify"]);
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
ul li {
  list-style-type: none;
  float: left;
  margin-left: 10px;
  margin-top: 10px;
}
</style>
