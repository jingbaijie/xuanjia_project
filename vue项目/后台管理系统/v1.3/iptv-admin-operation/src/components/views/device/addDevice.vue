<template>
  <div>
    <el-dialog
      width="35vw"
      v-dialogDrag
      ref="dialog__wrapper"
      :title="this.form.id ? '编辑' : '新增'"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="form" ref="form" :rules="rules" style="max-height:500px;overflow-y:auto">
        <el-form-item label="SN-编号" :label-width="formLabelWidth">
          <el-input v-model="form.sn_num" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="厂商名称" :label-width="formLabelWidth">
          <el-select v-model="form.factory_id" placeholder="请选择">
            <el-option
              v-for="item in factoryData"
              :key="item.id"
              :label="item.factoryCname"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户编号" :label-width="formLabelWidth">
          <el-input v-model="form.user_id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="生产日期" :label-width="formLabelWidth">
          <el-date-picker
            v-model="form.production_date"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="激活日期" :label-width="formLabelWidth">
          <el-date-picker
            v-model="form.activation_date"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="软件版本" :label-width="formLabelWidth">
          <!-- <el-input
            v-model="form.software_version"
            autocomplete="off"
          ></el-input> -->
           <el-select
           v-model="form.software_version"
            :style="{ width: itemWidth }"
          >
            <el-option
              v-for="item in softVersions"
              :key="item.id"
              :label="item.dictValue"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="固件版本" :label-width="formLabelWidth">
          <!-- <el-input
            v-model="form.firmware_version"
            autocomplete="off"
          ></el-input> -->
           <el-select
            v-model="form.firmware_version"
            :style="{ width: itemWidth }"
          >
            <el-option
              v-for="item in firmVersions"
              :key="item.id"
              :label="item.dictValue"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="盒子类型" :label-width="formLabelWidth">
          <el-input v-model="form.system_version" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="设备状态" :label-width="formLabelWidth">
          <el-input v-model="form.device_status" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="盒子目前是否有效" :label-width="formLabelWidth">
          <el-input v-model="form.is_effective" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" >
        <el-button type="primary" @click="onSubmit('form')">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "addDevice",
  data() {
    return {
      itemWidth: "195px",
       firmVersions: [], // 固件版本 
      softVersions: [], // 软件版本
      dialogFormVisible: false,
      form: {},
      factoryData: [],
      editUrl: "axios_edit_device",
      addUrl: "axios_add_device",
      formLabelWidth: "140px",
      rules: {
        menuName: [{ required: true, message: "必填项", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getDicInfo();
    this.$store
      .dispatch("axios_get_factoryList")
      .then(res => {

        if (res && res != "undefined" && res.data.data) {
          this.factoryData = res.data.data.records;

          //console.log("厂商名称---",this.res.data);
        }
        this.loading = false;
      })
      .catch(err => {
        this.loading = false;
      });
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
              
              case "firm_version":
                this.firmVersions.push(item);
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
    addMenu() {
      this.form = {};
      this.dialogFormVisible = true;
    },
    editMenu(menu) {
      this.form = menu;
      this.dialogFormVisible = true;
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$store
            .dispatch(this.form.id ? this.editUrl : this.addUrl, this.form)
            .then(response => {
              if (response.data.errorCode == "1000") {
                this.$message.success("操作成功");
                this.$emit('getDeviceList');
              } else {
                this.$message.error(response.data.errorMsg);
              }
            })
            .catch(err => {
              this.$message.error("操作失败");
            });
          this.dialogFormVisible = false;
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
</style>
