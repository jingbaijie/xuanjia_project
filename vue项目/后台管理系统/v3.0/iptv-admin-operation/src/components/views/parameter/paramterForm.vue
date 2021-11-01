<template>
  <div>
    <el-dialog
      width="35vw"
      v-dialogDrag
      ref="dialog__wrapper"
      :title="titleE[action]"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="归属分类" :label-width="formLabelWidth">
          <el-switch
            v-model="form.configType"
            :active-value="1"
            :inactive-value="0"
            :style="{ 'margin-left': '20px' }"
          ></el-switch>
        </el-form-item>
        <el-form-item
          label="参数名称"
          prop="configName"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.configName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="参数键名" :label-width="formLabelWidth">
          <el-input v-model="form.configKey" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="参数键值" :label-width="formLabelWidth">
          <el-input v-model="form.configValue" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="form.remark" autocomplete="off"></el-input>
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
export default {
  name: "paramterForm",
  props: ["menuId"],
  inject: ["getActiveData"],
  data() {
    return {
      dialogFormVisible: false,
      action: "",
      activeData: [],
      form: {
        configType: 1,
        configName: "",
        configKey: "",
        configValue: "",
        remark: ""
      },
      formLabelWidth: "120px",
      titleE: {
        New: "新建",
        Edit: "编辑"
      },
      rules: {
        configName: [{ required: true, message: "必填项", trigger: "blur" }]
      }
    };
  },
  created() {},
  methods: {
    addParam() {
      this.form = {};
      this.action = "New";
      this.dialogFormVisible = true;
    },
    editParam(v) {
      for (let i in v) {
        this.form[i] = v[i];
      }
      this.action = "Edit";
      this.dialogFormVisible = true;
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.action == "New") {
            this.$store
              .dispatch("axios_add_configList", this.form)
              .then(res => {
                if (res.data.errorCode == "1000") {
                  this.$message.success("添加成功");
                  eventBus.$emit("refreshParamList");
                } else {
                  this.$message.error(res.data.errorMsg);
                }
              })
              .catch(err => {
                this.$message.error("添加失败");
              });
          } else if (this.action == "Edit") {
            this.$store
              .dispatch("axios_edit_configList", this.form)
              .then(res => {
                if (res.data.errorCode == "1000") {
                  this.$message.success("修改成功");
                  eventBus.$emit("refreshParamList");
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
    eventBus.$on("addParam", v => {
      this.activeData = v;
      this.addParam();
    });
    eventBus.$on("editParam", (v, a) => {
      this.activeData = a;
      this.editParam(v, a);
    });
  },
  beforeDestroy() {
    eventBus.$off("addParam");
    eventBus.$off("editParam");
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
