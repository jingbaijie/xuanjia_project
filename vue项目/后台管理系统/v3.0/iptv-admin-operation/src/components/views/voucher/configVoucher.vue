<template>
  <div>
    <el-dialog
      width="40vw"
      height="50"
      v-dialogDrag
      ref="dialog__wrapper"
      title="体验券生成管理"
      :visible.sync="dialogFormVoucher"
    >
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item
          label="卡号位数"
          prop="cardNumLength"
          :label-width="formLabelWidth"
        >
          <!-- <el-input type="text" v-model="form.cardNumLength"></el-input> -->
          <el-select v-model="form.cardNumLength" placeholder="请选择">
            <el-option :key="16" label="16位" :value="16"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="限制用户使用"
          prop="isRestrictUser"
          :label-width="formLabelWidth"
        >
          <el-radio v-model="form.isRestrictUser" label="0">不限制</el-radio>
          <el-radio v-model="form.isRestrictUser" label="1">限制</el-radio>
        </el-form-item>
        <el-form-item
          label="是否生成密码"
          prop="hasPassword"
          :label-width="formLabelWidth"
        >
          <el-radio v-model="form.hasPassword" label="0">否</el-radio>
          <el-radio v-model="form.hasPassword" label="1">是</el-radio>
        </el-form-item>
        <el-form-item
          label="秘钥规则"
          prop="isMixedPassword"
          :label-width="formLabelWidth"
        >
          <el-radio v-model="form.isMixedPassword" label="0">纯数字</el-radio>
          <el-radio v-model="form.isMixedPassword" label="1">混合</el-radio>
        </el-form-item>

        <el-form-item label="类型" prop="more1" :label-width="formLabelWidth">
          <el-radio-group
            v-model="form.more1"
            @change="handleActivity"
            size="small"
          >
            <el-radio label="1">线上</el-radio>
            <el-radio label="0">线下</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="isActivity"
          label="活动"
          prop="more2"
          :label-width="formLabelWidth"
        >
          <el-input type="text" v-model="form.more2"></el-input>
        </el-form-item>

        <el-form-item label="有效期开始时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="form.effectiveStartTime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="有效期结束时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="form.effectiveEndTime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item
          label="生成数量"
          prop="genNumber"
          :label-width="formLabelWidth"
        >
          <!-- <el-input type="text" v-model="form.genNumber"></el-input> -->
          <el-input-number
            v-model="form.genNumber"
            :min="1"
            :max="5000"
            label="生成数量"
          ></el-input-number>
        </el-form-item>
        <el-form-item
          label="免费时长"
          prop="freeTime"
          :label-width="formLabelWidth"
        >
          <el-input type="text" v-model="form.freeTime"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          :disabled="previewStatus == 1 ? true : false"
          @click="handlePreview(form)"
        >
          预览&nbsp;
          <i class="el-icon-caret-right" />
        </el-button>
        <el-button
          type="primary"
          :disabled="createStatus == 1 ? true : false"
          @click="handleCreate(form)"
        >
          生成&nbsp;
          <i class="el-icon-caret-right" />
        </el-button>
        <el-button
          type="primary"
          :disabled="downloadStatus == 1 ? true : false"
          @click="handleDownload()"
        >
          下载&nbsp;
          <i class="el-icon-bottom"></i>
        </el-button>
        <p>*注:先预览后生成，下载前请生成体验券</p>
      </div>
    </el-dialog>
    <el-dialog
      width="35vw"
      height="200px"
      v-dialogDrag
      ref="dialog__wrapper"
      title="体验券"
      style="{height:'200px'}"
      :visible.sync="dialogPreview"
    >
      <ul class="scrollbar">
        <li v-for="(u, i) in previewData.cardNo" v-bind:key="i">{{ u }}</li>
      </ul>
      <!-- <span :style="{color:'red'}">{{previewData}}</span> -->
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
      isActivity: true,
      form: {
        genNumber: 1,
        isRestrictUser: "0",
        hasPassword: "0",
        isMixedPassword: "0",
        effectiveStartTime: "",
        effectiveEndTime: "",
        more1: "1",
        more2: ""
      },
      isCreate: false,
      formLabelWidth: "140px",
      dialogPreview: false, //预览table
      dialogFormVoucher: false,
      previewStatus: 0,
      createStatus: 1,
      downloadStatus: 1,
      previewData: [],
      currentPage: 1, //分页当前页码
      pageSize: 20,
      total: 1,
      data: [],
      rules: {
        cardNumLength: [{ required: true, message: "必填项", trigger: "blur" }],
        genNumber: [{ required: true, message: "必填项", trigger: "blur" }],
        freeTime: [{ required: true, message: "必填项", trigger: "blur" }]
      }
      // viewRule: {
      //   cardNumLength: [{ required: true, message: "必填项", trigger: "blur" }],
      //   genNumber: [{ required: true, message: "必填项", trigger: "blur" }]
      // },
      // proRule: {
      //   freeTime: [{ required: true, message: "必填项", trigger: "blur" }]
      // }
    };
  },
  components: {
    Pagination
  },
  mounted() {},
  created() {
    eventBus.$on("addVoucher", () => {
      this.addVoucher();
    });
  },

  methods: {
    handleActivity() {
      if (this.form.more1 == "1") {
        this.isActivity = true;
      } else {
        this.isActivity = false;
      }
    },
    addVoucher() {
      this.dialogFormVoucher = true;
    },
    resetForm() {
      this.$refs["form"].resetFields();
    },
    handleCreate(form) {
      let param = {
        freeTime: form.freeTime,
        hasPassword: form.hasPassword,
        isMixedPassword: form.isMixedPassword,
        isRestrictUser: form.isRestrictUser,
        cardNumLength: form.cardNumLength,
        genNumber: form.genNumber,
        effectiveStartTime: form.effectiveStartTime,
        effectiveEndTime: form.effectiveEndTime,
        more1: form.more1,
        more2: form.more2
      };
      this.create(param);
    },
    handlePreview(form) {
      this.dialogPreview = true;
      // this.rules=this.viewRule;
      let param = {
        freeTime: form.freeTime,
        hasPassword: form.hasPassword,
        isMixedPassword: form.isMixedPassword,
        isRestrictUser: form.isRestrictUser,
        cardNumLength: form.cardNumLength,
        genNumber: form.genNumber,
        effectiveStartTime: form.effectiveStartTime,
        effectiveEndTime: form.effectiveEndTime,
        more1: form.more1,
        more2: form.more2
      };
      this.preview(param);
      this.previewStatus = 1;
      this.createStatus = 0;
      this.downloadStatus = 1;
    },
    /**
     * 下载体验劵
     */
    handleDownload() {
      if (this.isCreate) {
        const loadOption = {
          text: "导出中",
          fullscreen: true,
          lock: true,
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        };
        this.$store
          .dispatch("axios_download_saleCard")
          .then(res => {
            this.$message.success("下载成功");
            this.resetForm();
          })
          .catch(err => {
            this.$message.error("下载失败");
          });
      } else {
        this.$message.error("请生成优惠券后再次下载！");
      }
    },
    /**
     * 预览
     */
    preview(param) {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.$store
            .dispatch("axios_preview_saleCard", param)
            .then(res => {
              if (res.data.errorCode == "1000") {
                this.previewData = res.data.data;
                Message({ message: res.data.errorMsg, type: "success" });
              } else {
                Message({ message: res.data.errorMsg, type: "error" });
                this.dialogPreview = false;
              }
            })
            .catch(err => {
              this.$message.error("操作失败");
              this.dialogPreview = false;
            });
        }
      });
    },

    /**
     * 生成
     */
    create(param) {
      this.$confirm("确定生成体验卷吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        // this.rules = this.proRule;
        this.$refs["form"]
          .validate(valid => {
            if (valid) {
              this.$store
                .dispatch("axios_add_saleCard", param)
                .then(res => {
                  if (res.data.errorCode == "1000") {
                    this.$emit("refreshList");
                    Message({ message: res.data.errorMsg, type: "success" });
                    this.isCreate = true;
                    this.dialogPreview = false;
                    this.previewStatus = 1;
                    this.createStatus = 1;
                    this.downloadStatus = 0;
                    // this.resetForm();
                  } else {
                    Message({ message: res.data.errorMsg, type: "error" });
                  }
                })
                .catch(err => {
                  this.$message.error("操作失败");
                });
            } else {
              return false;
              this.dialogPreview = false;
              this.resetForm();
            }
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消"
            });
          });
      });
    }
  },
  beforeDestroy() {
    eventBus.$off("refreshList");
  }
};
</script>
<style scoped lang='scss'>
$height-300: 300px;
.scrollbar {
  max-height: $height-300;
  overflow-y: auto;
  li {
    border: 1px solid #b6b4b4;
    border-bottom: 0px;
    margin: 2px;
    padding: 2px;
  }
}
p {
  color: rgb(109, 117, 112);
  font-size: 12px;
}
</style>

