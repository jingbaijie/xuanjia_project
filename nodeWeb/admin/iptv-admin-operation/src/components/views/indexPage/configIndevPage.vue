<template>
  <div>
    <el-dialog
      width="35vw"
      v-dialogDrag
      ref="dialog__wrapper"
      :title="titleE[action]"
      :visible.sync="dialogForm"
    >
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="参数名称" prop="configName" :label-width="formLabelWidth">
          <el-input v-model="form.configName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="参数键名" :label-width="formLabelWidth">
          <el-input v-model="form.configKey" :disabled="true" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="参数键值" :label-width="formLabelWidth">
          <el-input v-model="form.configValue" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="form.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="isShow" @click="onSubmit('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { eventBus } from "@/common/eventBus";
export default {
  name: "indexPageForm",
  data() {
    return {
      isShow: false,
      dialogForm: false,
      action: "",
      activeData: [],
      form: {
        configName: "",
        configKey: "",
        configValue: "",
        remark: "",
        id: ""
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
  mounted() {
    eventBus.$on("editInfo", (v, data) => {
      this.editInfo(v, data);
      if (data) {
        this.form = data;
        this.id = data.id;
        console.log(this.id);
      } else {
        this.form = {
          configName: "",
          configKey: "",
          configValue: "",
          remark: ""
        };
      }
      console.log(v);
    });
  },
  methods: {
    editInfo(v, a) {
      if (v == 1) {
        this.action = "Edit";
        this.dialogForm = true;
        this.isShow = false;
      } else {
        this.dialogForm = true;
        this.isShow = true;
      }
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        this.$store
          .dispatch("axios_update_configById", this.form)
          .then(res => {
            if (res.data.errorCode == "1000") {
              this.$message.success("设置成功");
              this.$emit("getMediaInfo");
            } else {
              this.$message.error(res.data.errorMsg);
            }
          })
          .catch(err => {
            this.$message.error("设置失败");
          });

        this.dialogForm = false;
      });
    }
  },

  beforeDestroy() {
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
