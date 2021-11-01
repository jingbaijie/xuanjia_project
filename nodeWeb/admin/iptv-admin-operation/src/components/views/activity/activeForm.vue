<template>
  <div>
    <el-dialog
      v-dialogDrag
      ref="dialog__wrapper"
      :title="titleE[action]"
      width="35vw"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="活动名称" prop="activityCname" :label-width="formLabelWidth">
          <el-input v-model="form.activityCname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="form.activityStartTime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="结束时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="form.activityEndTime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="活动图片" :label-width="formLabelWidth">
          <el-popover placement="right" width="545" trigger="hover">
            <img class="flagImage" slot="reference" :src="activeImg" />
            <image_choice @getSelectImage="img => setImg(img,1)"></image_choice>
          </el-popover>
        </el-form-item>

        <el-form-item label="标签图片" :label-width="formLabelWidth">
          <el-popover placement="right" width="545" trigger="hover">
            <img class="flagImage" slot="reference" :src="labelImg" />
            <image_choice @getSelectImage="img => setImg(img,0)"></image_choice>
          </el-popover>
        </el-form-item>

        <el-form-item label="排行ID" :label-width="formLabelWidth">
          <el-input-number v-model="form.rankId" :min="0" controls-position="right"></el-input-number>
        </el-form-item>

        <el-form-item label="是否上架" :label-width="formLabelWidth">
          <el-select v-model="form.booleanUp" placeholder="请选择">
            <el-option v-for="item in booleanUp" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="活动地址" :label-width="formLabelWidth">
          <el-input v-model="form.activityUrl" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
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
  name: "activeForm",
  inject: ["getMenuId"],
  data() {
    const validatorEname = (rule, value, callback) => {
      if (this.action == "New") {
        this.$store
          .dispatch("axios_check_activity", {
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
      } else {
        callback();
      }
    };
    return {
      baseUrl: window.configs.static_IMAGES_BASEURL,
      action: "",
      levelId: "",
      dialogFormVisible: false,
      menuId: this.getMenuId(),
      titleE: {
        New: "新建",
        Edit: "编辑"
      },
      booleanUp: [
        {
          id: "0",
          name: "未上线"
        },
        {
          id: "1",
          name: "测试"
        },
        {
          id: "2",
          name: "上线"
        }
      ],
      form: {
        activityCname: "",
        activityStartTime: "",
        activityEndTime: "",
        activityPicId: "",
        activityLabelpicId: "",
        activityUrl: "",
        booleanUp: "",
        rankId: "1",
        labelPicUrl: "",
        picUrl: ""
      },

      formLabelWidth: "120px",
      labelImg: defaultFocus,
      activeImg: defaultFocus,
      rules: {
        activityCname: [{ required: true, message: "必填项", trigger: "blur" }]
      }
    };
  },
  methods: {
    setImg(item, type) {
      if (type) {
        this.activeImg = item.domainUrl + item.picPath;
        this.form.activityPicId = item.id;
      } else {
        this.labelImg = item.domainUrl + item.picPath;
        this.form.activityLabelpicId = item.id;
      }
    },
    getRole() {
      this.$store
        .dispatch("axios_get_role", {
          menuId: this.menuId
        })
        .then(res => {
          this.roleData = res.data.data.list.records;
        })
        .catch(err => {});
    },
    addActive() {
      this.action = "New";
      this.dialogFormVisible = true;
      this.form = {
        activityCname: "",
        activityStartTime: "",
        activityEndTime: "",
        activityPicId: "",
        activityLabelpicId: "",
        activityUrl: "",
        booleanUp: "",
        rankId: "1",
        labelPicUrl: "",
        picUrl: ""
      };
      this.labelImg = defaultFocus;
      this.activeImg = defaultFocus;
    },
    editActive(v) {
      this.form = v;
      this.form.booleanUp = v.booleanUp + "";
      this.activeImg = this.baseUrl + v.picUrl;
      this.labelImg = this.baseUrl + v.labelPicUrl;
      this.action = "Edit";
      this.dialogFormVisible = true;
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.action == "New") {
            this.$store
              .dispatch("axios_add_active", this.form)
              .then(res => {
                if (res.data.errorCode == "1000") {
                  this.$message.success("添加成功");
                  this.$emit("refreshActive");
                } else {
                  this.$message.error(res.data.errorMsg);
                }
              })
              .catch(err => {
                this.$message.error("添加失败");
              });
          } else if (this.action == "Edit") {
            this.$store
              .dispatch("axios_edit_active", this.form)
              .then(res => {
                if (res.data.errorCode == "1000") {
                  this.$message.success("修改成功");
                  this.$emit("refreshActive");
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
  created() {},
  mounted() {
    eventBus.$on("addActive", () => {
      this.addActive();
    });
    eventBus.$on("editActive", v => {
      this.editActive(v);
    });
  },
  beforeDestroy() {
    eventBus.$off("addActive");
    eventBus.$off("editActive");
  },
  components: { image_choice }
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
</style>
