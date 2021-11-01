<template>
  <div>
    <el-dialog
      v-dialogDrag
      ref="dialog__wrapper"
      :title="this.form.id ? '编辑' : '新增'"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="昵称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="类型" :label-width="formLabelWidth">
          <el-select v-model="form.typeId" placeholder="请选择">
            <el-option label="头像数据" :value="1"></el-option>
            <el-option label="昵称数据" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否上线" :label-width="formLabelWidth">
          <el-select v-model="form.booleanUp" placeholder="请选择">
            <el-option label="未上线" :value="0"></el-option>
            <el-option label="上线" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户头像图片" :label-width="formLabelWidth">
          <el-popover placement="right" width="535" trigger="hover">
            <img class="flagImage" slot="reference" :src="avatarPicUrl" />
            <image_choice @getSelectImage="img => setImg(img)"></image_choice>
          </el-popover>
        </el-form-item>
        <el-form-item label="more1" :label-width="formLabelWidth">
          <el-input v-model="form.more1" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="more2" :label-width="formLabelWidth">
          <el-input v-model="form.more2" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="more3" :label-width="formLabelWidth">
          <el-input v-model="form.more3" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="more4" :label-width="formLabelWidth">
          <el-input v-model="form.more4" autocomplete="off"></el-input>
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
  name: "userForm",
  data() {
    return {
      imagesBaseUrl: window.configs.static_IMAGES_BASEURL,
      dialogFormVisible: false,
      avatarPicUrl: "",
      form: {
        id: "",
        name: "",
        typeId: "",
        avatarPicId: "",
        booleanUp: "",
        more1: "",
        more2: "",
        more3: "",
        more4: ""
      },
      editCurUname: "",
      rules: {
        name: [{ required: true, message: "必填", trigger: "blur" }]
      },
      formLabelWidth: "120px",
      roleData: [{ id: "", rname: "" }]
    };
  },
  components: { image_choice },
  created() {
    eventBus.$on("addAvatar", () => {
      this.add();
    });
    eventBus.$on("editAvatar", v => {
      this.edit(v);
    });
  },
  beforeDestroy() {
    eventBus.$off(["addAvatar", "editAvatar"]);
  },
  methods: {
    setImg(item) {
      this.avatarPicUrl = this.imagesBaseUrl + item.picPath;
      this.form.avatarPic = {};
      this.form.avatarPicId = item.id;
    },
    add() {
      this.dialogFormVisible = true;
      this.form.name = "";
      this.form.typeId = "";
      this.form.avatarPicId = "";
      this.form.booleanUp = "";
      this.form.more1 = "";
      this.form.more2 = "";
      this.form.more3 = "";
      this.form.more4 = "";
    },
    edit(v) {
      this.dialogFormVisible = true;
      this.form.id = v.id;
      this.form.name = v.name;
      this.form.typeId = v.typeId;
      // this.form.avatarPicId = v.avatarPicId;
      this.form.booleanUp = v.booleanUp;
      this.form.more1 = v.more1;
      this.form.more2 = v.more2;
      this.form.more3 = v.more3;
      this.form.more4 = v.more4;
      v.avatarPic
        ? (this.avatarPicUrl = this.imagesBaseUrl + v.avatarPic.picPath)
        : (this.avatarPicUrl = this.imagesBaseUrl + defaultFocus);
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let actionUrl;
          this.form.id
            ? (actionUrl = "axios_edit_userAvatar")
            : (actionUrl = "axios_add_userAvatar");

          this.$store
            .dispatch(actionUrl, this.form)
            .then(response => {
              if (response.data.errorCode == "1000") {
                this.$message.success("操作成功");
                this.$parent.getAvatar();
              } else {
                this.$message.error(response.data.errorMsg);
              }
            })
            .catch(err => {
              this.$message.error("操作失败");
            });
          this.dialogFormVisible = false;
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.flagImage {
  width: 50px;
}
</style>
