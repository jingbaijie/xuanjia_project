<template>
  <div>
    <el-dialog
      width="35vw"
      height="50"
      v-dialogDrag
      ref="dialog__wrapper"
      :title="cpspConfigForm.id ? '编辑' : '新增'"
      :visible.sync="dialogFormCPSP"
    >
      <el-form
        :model="cpspConfigForm"
        ref="cpspConfigForm"
        :rules="rules"
        style="max-height:500px;overflow-y:auto"
      >
        <el-form-item label="名称" prop="cpCname" :label-width="formLabelWidth">
          <el-input type="text" v-model="cpspConfigForm.cpCname"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="cpType" :label-width="formLabelWidth">
          <el-radio v-model="cpspConfigForm.cpType" :label="0">cp</el-radio>
          <el-radio v-model="cpspConfigForm.cpType" :label="1">sp</el-radio>
        </el-form-item>
        <el-form-item
          label="英文名称"
          prop="cpEname"
          :label-width="formLabelWidth"
        >
          <el-input type="text" v-model="cpspConfigForm.cpEname"></el-input>
        </el-form-item>
        <el-form-item
          label="cpCode"
          prop="cpCode"
          :label-width="formLabelWidth"
        >
          <el-input type="text" v-model="cpspConfigForm.cpCode"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="cpspConfigForm.cpStarttime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="cpspConfigForm.cpEndtime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item
          label="说明"
          prop="cpIntroduction"
          :label-width="formLabelWidth"
        >
          <el-input
            type="text"
            v-model="cpspConfigForm.cpIntroduction"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="cpPhone"
          prop="cpPhone"
          :label-width="formLabelWidth"
        >
          <el-input type="text" v-model="cpspConfigForm.cpPhone"></el-input>
        </el-form-item>
        <el-form-item
          label="cpProductName"
          prop="cpProductName"
          :label-width="formLabelWidth"
        >
          <el-input
            type="text"
            v-model="cpspConfigForm.cpProductName"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="cpProductAddress"
          prop="cpProductAddress"
          :label-width="formLabelWidth"
        >
          <el-input
            type="text"
            v-model="cpspConfigForm.cpProductAddress"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="cpUptime"
          prop="cpUptime"
          :label-width="formLabelWidth"
        >
          <el-input type="text" v-model="cpspConfigForm.cpUptime"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit('cpspConfigForm')"
          >提 交</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { Message, Loading } from "element-ui";
import { eventBus } from "@/common/eventBus";
import Pagination from "@/components/widget/Pagination";
export default {
  data() {
    return {
      formLabelWidth: "150px",
      cpspConfigForm: {
        id: "",
        booleanUp: "",
        cpCname: "",
        cpCode: "",
        cpEname: "",
        cpEndtime: "",
        cpIntroduction: "",
        cpPhone: "",
        cpProductAddress: "",
        cpProductName: "",
        cpStarttime: "",
        cpType: "",
        cpUptime: ""
      },
      dialogFormCPSP: false, //主题form
      rules: {
        cpCname: [
          { required: true, message: "请输入中文主题名称", trigger: "blur" }
        ],
        cpEname: [
          { required: true, message: "请输入英文主题名称", trigger: "blur" }
        ],
        cpType: [{ required: true, message: "请选择类型", trigger: "change" }]
      }
    };
  },
  created() {
    eventBus.$on("addcpsp", () => {
      this.addcpsp();
    });
    eventBus.$on("editcpsp", v => {
      this.editcpsp(v);
    });
  },
  methods: {
    addcpsp() {
      this.dialogFormCPSP = true;
      this.cpspConfigForm.booleanUp = "";
      this.cpspConfigForm.cpCname = "";
      this.cpspConfigForm.cpCode = "";
      this.cpspConfigForm.cpEname = "";
      this.cpspConfigForm.cpEndtime = "";
      this.cpspConfigForm.cpIntroduction = "";
      this.cpspConfigForm.cpPhone = "";
      this.cpspConfigForm.cpProductAddress = "";
      this.cpspConfigForm.cpProductName = "";
      this.cpspConfigForm.cpStarttime = "";
      this.cpspConfigForm.cpType = "";
      this.cpspConfigForm.cpUptime = "";
    },
    editcpsp(v) {
      this.dialogFormCPSP = true;
      this.cpspConfigForm.id = v.id;
      this.cpspConfigForm.booleanUp = v.booleanUp;
      this.cpspConfigForm.cpCname = v.cpCname;
      this.cpspConfigForm.cpCode = v.cpCode;
      this.cpspConfigForm.cpEname = v.cpEname;
      this.cpspConfigForm.cpEndtime = v.cpEndtime;
      this.cpspConfigForm.cpIntroduction = v.cpIntroduction;
      this.cpspConfigForm.cpPhone = v.cpPhone;
      this.cpspConfigForm.cpProductAddress = v.cpProductAddress;
      this.cpspConfigForm.cpProductName = v.cpProductName;
      this.cpspConfigForm.cpStarttime = v.cpStarttime;
      this.cpspConfigForm.cpType = v.cpType;
      this.cpspConfigForm.cpUptime = v.cpUptime;
    },
    onSubmit(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          let actionUrl;
          this.cpspConfigForm.id
            ? (actionUrl = "axios_update_cpDetail")
            : (actionUrl = "axios_add_cpDetail");

          this.$store
            .dispatch(actionUrl, {
              id: this.cpspConfigForm.id || undefined,
              booleanUp: this.cpspConfigForm.booleanUp,
              cpCname: this.cpspConfigForm.cpCname,
              cpCode: this.cpspConfigForm.cpCode,
              cpEname: this.cpspConfigForm.cpEname,
              cpEndtime: this.cpspConfigForm.cpEndtime,
              cpIntroduction: this.cpspConfigForm.cpIntroduction,
              cpPhone: this.cpspConfigForm.cpPhone,
              cpProductAddress: this.cpspConfigForm.cpProductAddress,
              cpProductName: this.cpspConfigForm.cpProductName,
              cpStarttime: this.cpspConfigForm.cpStarttime,
              cpType: this.cpspConfigForm.cpType,
              cpUptime: this.cpspConfigForm.cpUptime
            })
            .then(response => {
              if (response.data.errorCode == "1000") {
                this.$message.success("操作成功");
                this.$emit("refreshList");
              } else {
                this.$message.error(response.data.errorMsg);
              }
            })
            .catch(err => {
              this.$message.error("操作失败");
            });
          this.dialogFormCPSP = false;
        } else {
          return false;
        }
      });
    }
  },

  beforeDestroy() {
    eventBus.$off(["addTheme", "editTheme", "refreshList"]);
  }
};
</script>
<style scoped lang='scss'>
</style>

