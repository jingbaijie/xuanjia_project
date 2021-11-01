<template>
  <div>
    <el-dialog
      v-dialogDrag
      width="35vw"
      ref="dialog__wrapper"
      :title="titleE[action]"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item
          label="字典类型"
          prop="dictType"
          :label-width="formLabelWidth"
        >
          <el-input
            :disabled="true"
            v-model="form.dictType"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="字典名称"
          prop="dictLabel"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.dictLabel" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="字典键值"
          prop="dictValue"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.dictValue" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="字典排序" :label-width="formLabelWidth">
          <el-input v-model="form.dictSort" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="0"
            :style="{ 'margin-left': '20px' }"
          ></el-switch>
        </el-form-item>
        <el-form-item label="是否默认" :label-width="formLabelWidth">
          <el-switch
            v-model="form.isDefault"
            :active-value="1"
            :inactive-value="0"
            :style="{ 'margin-left': '20px' }"
          ></el-switch>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="form.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="onSubmit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { eventBus } from "@/common/eventBus";
export default {
  name: "dicDForm",
  inject: ["getMenuId"],
  data() {
    return {
      dialogFormVisible: false,
      menuId: this.getMenuId(),
      action: "",
      form: {
        dictType: "",
        dictLabel: "",
        dictValue: "",
        dictSort: "",
        status: 1,
        isDefault: 1,
        remark: ""
      },
      formLabelWidth: "120px",
      imgData: [],
      titleE: {
        New: "新建",
        Edit: "编辑"
      },
      rules: {
        // dictType: [{ required: true, message: "请填写字典类型", trigger: "blur" }],
        dictLabel: [
          { required: true, message: "请填写字典名称", trigger: "blur" }
        ],
        dictValue: [
          { required: true, message: "请填写字典键值", trigger: "blur" }
        ]
      }
    };
  },
  created() {},
  methods: {
    addDic(t) {
      this.action = "New";
      this.dialogFormVisible = true;
      this.form = {
        dictType: t
      };
    },
    editDic(v, a) {
      for (let i in v) {
        this.form[i] = v[i];
      }
      this.action = "Edit";
      this.dialogFormVisible = true;
    },
    onSubmit() {
      if (this.action == "New") {
        this.$store
          .dispatch("axios_add_dictDataList", this.form)
          .then(res => {
            if (res.data.errorCode == "1000") {
              this.$message.success("添加成功");
              eventBus.$emit("refreshDetail");
            } else {
              this.$message.error(res.data.errorMsg);
            }
          })
          .catch(err => {
            this.$message.error("添加失败");
          });
      } else if (this.action == "Edit") {
        this.$store
          .dispatch("axios_edit_dictDataList", this.form)
          .then(res => {
            this.$message.success("修改成功");
            eventBus.$emit("refreshDetail");
          })
          .catch(err => {
            this.$message.error("修改失败");
          });
      }
      this.dialogFormVisible = false;
    }
  },
  mounted() {
    eventBus.$on("addDictData", v => {
      this.addDic(v);
    });
    eventBus.$on("editDictData", v => {
      this.editDic(v);
    });
  },
  beforeDestroy() {
    eventBus.$off("addDic");
    eventBus.$off("editDic");
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

/* .dialog-footer {
  text-align: center;
} */

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
