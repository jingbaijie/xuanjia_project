<template v-dialogDrag>
  <el-dialog :title="type === 'add' ? '添加版本' : '编辑版本'" :visible.sync="isShowModal" width="35vw">
    <el-form
      ref="form"
      :model="form"
      style="max-height:500px;overflow-y:auto"
      :label-width="labelWidth"
      :rules="rules"
    >
      <el-form-item label="升级类型: " prop="updateType">
        <el-radio v-model="form.updateType" label="0">固件</el-radio>
        <el-radio v-model="form.updateType" label="1">软件</el-radio>
      </el-form-item>
      <el-form-item label="升级策略: " prop="updateStrategy">
        <el-radio v-model="form.updateStrategy" label="0">全部升级</el-radio>
        <el-radio v-model="form.updateStrategy" label="1">部分升级</el-radio>
      </el-form-item>
      <el-form-item label="固件版本: " prop="firmVersion" v-if="form.updateType == 0">
        <el-select v-model="form.firmVersion" size="small" :style="{ width: itemWidth }">
          <el-option
            v-for="item in firmVersions"
            :key="item.id"
            :label="item.dictValue"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="软件版本: " prop="softVersion" v-else>
        <el-select v-model="form.softVersion" size="small" :style="{ width: itemWidth }">
          <el-option
            v-for="item in softVersions"
            :key="item.id"
            :label="item.dictValue"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="版本名称: " prop="versionName">
        <el-input v-model="form.versionName" placeholder="请输入" size="small" style="width: 195px" />
      </el-form-item>
      <!-- <el-form-item label="中间件版本: " prop="midVersion">
          <el-select
            v-model="form.midVersion"
            size="small"
            :style="{ width: itemWidth }"
          >
            <el-option
              v-for="item in midVersions"
              :key="item.id"
              :label="item.dictValue"
              :value="item.id"
            ></el-option>
          </el-select>
      </el-form-item>-->
      <el-form-item label="升级说明: " prop="updateDescription">
        <el-input
          v-model="form.updateDescription"
          placeholder="请输入"
          size="small"
          :style="{ width: itemWidth }"
        />
      </el-form-item>
      <!-- <el-form-item label="升级地址: " prop="updateAddress">
          <el-input
            v-model="form.updateAddress"
            placeholder="请输入"
            size="small"
            :style="{ width: itemWidth }"
          />
      </el-form-item>-->
      <el-form-item label="版本状态" prop="versionStatus">
        <el-select v-model="form.versionStatus" size="small" :style="{ width: itemWidth }">
          <el-option
            v-for="item in versionStatuses"
            :key="item.id"
            :label="item.dictValue"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="启用时间" prop="startTime">
        <el-date-picker
          v-model="form.startTime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          placeholder="选择日期"
          :style="{ width: itemWidth }"
          size="small"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker
          v-model="form.endTime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          placeholder="选择日期"
          :style="{ width: itemWidth }"
          size="small"
        ></el-date-picker>
      </el-form-item>
      <el-form-item prop="more1">
        <el-switch
          v-model="form.more1"
          active-text="测试包"
          inactive-text="默认"
          active-value="2"
          inactive-value="1"
        ></el-switch>
      </el-form-item>
      <el-form-item :label="type == 'add' ? '上传文件' : '重新上传'" prop="upload">
        <el-upload
          class="upload-demo"
          action
          :on-change="handleChange"
          :auto-upload="false"
          :file-list="fileList"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传一个文件</div>
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" :style="{'text-align':'center'}">
      <el-button
        type="primary"
        size="small"
        @click="submit('form')"
        :style="{ marginLeft: '40px' }"
      >添加</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { eventBus } from "@/common/eventBus";
import axios from "axios";
export default {
  data() {
    // 验证时间
    var _this = this;
    var validateStartDate = (rule, value, callback) => {
      if (value === "") {
        callback();
      } else if (this.$moment().isBefore(value)) {
        callback(new Error("当前时间大于等于启用时间后才会升级"));
      } else {
        callback();
      }
    };
    var validateEndDate = (rule, value, callback) => {
      if (value === "" || _this.form.startTime === "") {
        callback();
      } else if (this.$moment(_this.form.startTime).isBefore(value)) {
        callback();
      } else {
        callback(new Error("当前时间小于等于启用时间后才会升级"));
      }
    };
    return {
      isShowModal: false,
      fileList: [],
      labelWidth: "100px",
      itemWidth: "195px",
      type: "",
      // 表单
      form: {
        updateType: "0", // 升级类型
        updateStrategy: "0", // 升级策略
        softVersion: "", // 版本编号
        versionName: "", // 版本名称
        firmVersion: "", // 固定版本
        midVersion: "", // 中间件版本
        updateDescription: "", // 升级说明
        updateAddress: "", // 升级地址
        versionStatus: "", // 版本状态
        startTime: "", // 启用时间
        more1: "1",
        endTime: "" // 结束时间
      },
      updateAddress: "", // 编辑是不重新上传是使用
      // 表单校验规则
      rules: {
        //startTime: [{ validator: validateStartDate, trigger: "blur" }],
        endTime: [{ validator: validateEndDate, trigger: "blur" }]
      },
      // 字典
      versions: [], // 版本编号 '0'
      versionNos: [], // 版本编号 '3'
      firmVersions: [], // 固件版本
      softVersions: [], // 软件版本
      midVersions: [], // 中间件版本 '1'
      versionStatuses: [] // 版本状态 '5'
    };
  },
  created() {
    this.getDicInfo();
    eventBus.$on("addVersion", () => {
      this.type = "add";
      this.addVersion();
    });
    eventBus.$on("editVersion", v => {
      this.type = "edit";
      this.editVersion(v);
    });
  },
  beforeDestroy() {
    eventBus.$off(["addVersion", "editVersion", "getVersionList"]);
  },
  methods: {
    /** 获取字典数据 */
    getDicInfo() {
      this.$store
        .dispatch("axios_query_dicInfo", {})
        .then(res => {
          //console.log("字典", res.data.data);
          let records = res.data.data;
          records.forEach(item => {
            switch (item.dictType) {
              case "soft_version":
                this.softVersions.push(item);
                break;
              case "mid_version":
                this.midVersions.push(item);
                break;
              case "firm_version":
                this.firmVersions.push(item);
                break;
              case "version_status":
                this.versionStatuses.push(item);
                break;
              default:
                break;
            }
          });
        })
        .catch(err => {
          //console.log("字典", err);
        });
    },
    /** 初始化弹窗 */
    addVersion() {
      this.isShowModal = true;
      this.form.updateType = "0"; // 升级类型
      this.form.updateStrategy = "0"; // 升级策略
      this.form.softVersion = ""; // 版本编号
      this.form.versionName = ""; // 版本名称
      this.form.firmVersion = ""; // 固定版本
      // this.form.midVersion = "midVersion"; // 中间件版本
      this.form.midVersion = "";
      this.form.updateDescription = ""; // 升级说明
      this.form.updateAddress = ""; // 升级地址
      this.form.versionStatus = ""; // 版本状态
      this.form.startTime = ""; // 启用时间
      this.form.endTime = ""; // 结束时间
      delete this.form.id;
    },
    editVersion(v) {
      //console.log("版本编辑", v);
      this.isShowModal = true;
      this.form.updateType = v.updateType; // 升级类型
      this.form.updateStrategy = v.updateStrategy + ""; // 升级策略
      this.form.softVersion = Number(v.softVersion); // 版本编号
      this.form.versionName = v.versionName; // 软件名称
      this.form.firmVersion = Number(v.firmVersion); // 固定版本
      this.form.midVersion = Number(v.midVersion); // 中间件版本
      this.form.updateDescription = v.updateDescription; // 升级说明
      this.form.updateAddress = v.updateAddress; // 升级地址
      this.form.versionStatus = Number(v.versionStatus); // 版本状态
      this.form.startTime = v.startTime; // 启用时间
      this.form.endTime = v.endTime; // 结束时间
      this.form.id = v.id; // 编辑用id
      this.updateAddress = v.updateAddress; // 升级地址
    },
    /** 提交 */

    submit(formName) {
      let _this = this;
      let formData = new FormData();
      if (this.fileList.length > 0 && this.fileList[0].raw) {
        formData.append("file", this.fileList[0].raw);
      }
      for (let key in this.form) {
        formData.append(key, this.form[key]);
      }
      let actionUrl =
        this.type === "add"
          ? "boxadmin/versionInfo/insert"
          : "boxadmin/versionInfo/update";
      let url = window.configs.axios_BASEURL + actionUrl;
      let config = {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      };
      this.$refs[formName].validate(valid => {
        if (valid) {
          axios
            .post(url, formData, config)
            .then(res => {
              eventBus.$emit("getVersionList");
              this.isShowModal = false;
              if (_this.type == "add") {
                _this.$message.success("添加版本成功");
              } else {
                _this.$message.success("编辑版本成功");
              }
            })
            .catch(err => {
              if (_this.type == "add") {
                _this.$message.error("添加版本失败");
              } else {
                _this.$message.error("编辑版本失败");
              }
            });
        } else {
          if (_this.type == "add") {
            _this.$message.error("添加版本失败");
          } else {
            _this.$message.error("编辑版本失败");
          }
        }
      });
    },
    /** 上传文件 */
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-1);
    }
  }
};
</script>

<style></style>
<!-- <el-form-item label="终端品牌: " prop="factoryId">
          <el-select
            v-model="form.factoryId"
            size="small"
            :style="{ width: itemWidth }"
          >
            <el-option
              v-for="item in factoryCnames"
              :key="item.factoryId"
              :label="item.factoryCname"
              :value="item.factoryId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="终端型号: " prop="terminalType">
          <el-select
            v-model="form.terminalType"
            size="small"
            :style="{ width: itemWidth }"
          >
            <el-option
              v-for="item in terminalTypes"
              :key="item.terminalType"
              :label="item.terminalTypeCname"
              :value="item.terminalType"
            ></el-option>
          </el-select>
        </el-form-item> -->
