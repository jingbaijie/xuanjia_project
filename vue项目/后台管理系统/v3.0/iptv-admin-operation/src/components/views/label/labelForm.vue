<template>
  <div>
    <el-dialog
      width="35vw"
      v-dialogDrag
      ref="dialog__wrapper"
      title="添加标签"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="form" ref="form">
        <el-form-item
          label="标签中文名"
          prop="typeCname"
          :label-width="formLabelWidth"
        >
          <el-input type="text" v-model="form.typeCname"></el-input>
        </el-form-item>

        <el-form-item
          label="标签英文名"
          prop="typeEname"
          :label-width="formLabelWidth"
        >
          <el-input type="text" v-model="form.typeEname"></el-input>
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

export default {
  name: "labelForm",
  data() {
    return {
      dialogFormVisible: false,
      form: {
        typeCname: "",
        typeEname: ""
      },
      formLabelWidth: "120px"
    };
  },
  methods: {
    addlabel() {
      this.action = "add";
      this.dialogFormVisible = true;
      this.form = { typeCname: "", typeEname: "" };
    },
    editlabel(v) {
      this.dialogFormVisible = true;
      this.form = {
        id: v.id,
        typeCname: v.typeCname,
        typeEname: v.typeEname
      };
      this.action = "edit";
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.action == "add") {
            this.$store
              .dispatch("axios_add_tagList", this.form)
              .then(res => {
                if (res.data.errorCode == "1000") {
                  this.$message.success("添加成功");
                  this.$parent.getlabelList();
                } else {
                  this.$message.error(res.data.errorMsg);
                }
              })
              .catch(err => {
                this.$message.error("添加失败");
              });
          } else {
            this.$store
              .dispatch("axios_update_tagList", this.form)
              .then(res => {
                if (res.data.errorCode == "1000") {
                  this.$message.success("修改成功");
                  this.$parent.getlabelList();
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
  mounted() {},
  beforeDestroy() {
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
