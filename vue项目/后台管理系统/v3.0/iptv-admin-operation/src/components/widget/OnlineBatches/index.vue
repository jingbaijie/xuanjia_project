<template  width="190" >
  <div>
    <el-popover placement="top" width="190" trigger="click" ref="pop">
      <el-button
        :style="{ float: 'right', margin: '0 10px 0 0' }"
        size="mini"
        type="info"
        plain
        @click="switchOnline(0)"
        >下架</el-button
      >
      <el-button
        :style="{ float: 'right', margin: '0 10px 0 0' }"
        size="mini"
        type="success"
        plain
        @click="switchOnline(2)"
        >上架</el-button
      >
      <el-button
        slot="reference"
        :style="{ float: 'right', margin: '0 10px 0 0' }"
        size="mini"
        type="success"
        plain
        >批量上架</el-button
      >
    </el-popover>
    <el-dialog
      title="操作"
      :visible.sync="dialogVisible"
      :modal-append-to-body="false"
    >
      <span>请选择为接下来勾选的节目子集选择全部上架或部分上架</span>
      <el-form ref="form" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="范围" prop="booleanUpAll">
          <el-radio-group v-model="form.booleanUpAll" @change="All">
            <el-radio :label="1">全部</el-radio>
            <el-radio :label="0">部分</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('form')"
            >立即创建</el-button
          >
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "OnlineBatches",
  data() {
    return {
      dialogVisible: false,
      radio: 1,
      form: {
        booleanUpAll: 1
      },
      booleanUpAll: 1,
      rules: {
        booleanUpAll: [
          { required: true, message: "请选择范围", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    cancel() {
      this.dialogVisible = false;
      this.$refs.pop.doClose();
    },
    All(val) {
      this.booleanUpAll = val;
    },
    switchOnline(action) {
      this.action = action;
      this.dialogVisible = true;
    },
    onSubmit(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.$emit("batchOnLine", this.action, this.booleanUpAll);
          this.dialogVisible = false;
        } else {
          console.log("error submit!!");

          return false;
        }
      });
    },
    close() {
      this.$refs.pop.doClose();
    }
  }
};
</script>
