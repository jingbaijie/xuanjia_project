<template>
  <div>
    <el-dialog
      width="35vw"
      v-dialogDrag
      ref="dialog__wrapper"
      title="创建元素"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="width" :label-width="formLabelWidth">
          <el-input v-model.number="form.width" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="height" :label-width="formLabelWidth">
          <el-input v-model.number="form.height" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="元素起始坐标top"
          prop="top"
          :label-width="formLabelWidth"
        >
          <el-input v-model.number="form.top" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="元素起始坐标left"
          prop="left"
          :label-width="formLabelWidth"
        >
          <el-input v-model.number="form.left" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="元素行数"
          prop="rowNum"
          :label-width="formLabelWidth"
        >
          <el-input v-model.number="form.rowNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="元素列数"
          prop="lineNum"
          :label-width="formLabelWidth"
        >
          <el-input v-model.number="form.lineNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="元素间距-行"
          prop="paddingRow"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model.number="form.paddingRow"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="元素间距-列"
          prop="paddingLine"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model.number="form.paddingLine"
            autocomplete="off"
          ></el-input>
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
  name: "createElementForm",
  data() {
    return {
      dialogFormVisible: false,
      form: {
        width: undefined,
        height: undefined,
        top: undefined,
        left: undefined,
        rowNum: undefined,
        lineNum: undefined,
        paddingLine: undefined,
        paddingRow: undefined
      },
      formLabelWidth: "140px",
      rules: {
        width: [{ required: true, message: "必填项", trigger: "blur" }],
        height: [{ required: true, message: "必填项", trigger: "blur" }],
        top: [{ required: true, message: "必填项", trigger: "blur" }],
        left: [{ required: true, message: "必填项", trigger: "blur" }],
        top: [{ required: true, message: "必填项", trigger: "blur" }],
        rowNum: [{ required: true, message: "必填项", trigger: "blur" }],
        lineNum: [{ required: true, message: "必填项", trigger: "blur" }],
        paddingLine: [{ required: true, message: "必填项", trigger: "blur" }],
        paddingRow: [{ required: true, message: "必填项", trigger: "blur" }]
      }
    };
  },
  created() {},
  methods: {
    addE() {
      this.form = {
        width: undefined,
        height: undefined,
        top: undefined,
        left: undefined,
        rowNum: undefined,
        lineNum: undefined,
        padding: undefined
      };
      this.dialogFormVisible = true;
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          this.$parent.createElementInfo(this.form);
        } else {
          return false;
        }
      });
    }
  },
  mounted() {
    eventBus.$on("addE", v => {
      this.activeData = v;
      this.addE();
    });
  },
  beforeDestroy() {
    eventBus.$off("addE");
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
