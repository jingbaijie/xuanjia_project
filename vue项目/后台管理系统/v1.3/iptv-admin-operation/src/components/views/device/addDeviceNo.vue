<template>
  <div>
    <el-dialog
      width="35vw"
      v-dialogDrag
      ref="dialog__wrapper"
      :title="'新增'"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="合同编号" :label-width="formLabelWidth">
          <el-select v-model="form.contractNum" placeholder="请选择">
            <el-option
              v-for="item in factoryData"
              :key="item.id"
              :label="item.contractNum"
              :value="item.contractNum"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="厂商名称" :label-width="formLabelWidth">
          <el-select v-model="form.factory_id" placeholder="请选择">
            <el-option
              v-for="item in factoryData"
              :key="item.id"
              :label="item.factoryCname"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="渠道编号" :label-width="formLabelWidth">
          <el-input v-model="form.canelNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="渠道类型" :label-width="formLabelWidth">
          <el-input v-model="form.canelType" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="省份" :label-width="formLabelWidth">
          <el-input v-model="form.provice" autocomplete="off"></el-input>
        </el-form-item>

        <!-- <el-form-item label="盒子数量" :label-width="formLabelWidth">
          <el-input v-model="form.deviceNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="盒子类型" :label-width="formLabelWidth">
          <el-input v-model="form.terminalType" autocomplete="off"></el-input>
        </el-form-item> -->

        <el-form-item label="批次编号" :label-width="formLabelWidth">
          <el-input
            v-model="form.boxTypeofsameFactory"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="序列编号" :label-width="formLabelWidth">
          <el-input v-model="form.uniqueCode" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="终端型号" :label-width="formLabelWidth">
          <el-input
            v-model="form.teminalTypeByFactory"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="终端识别类型" :label-width="formLabelWidth">
          <el-input
            v-model="form.terminalDistinguishType"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="终端识别符" :label-width="formLabelWidth">
          <el-input
            v-model="form.terminalDistinguish"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="终端批次" :label-width="formLabelWidth">
          <el-input v-model="form.terminalBatch" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="onSubmit('form')">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/**
 * 
 * 
 
//15位串号编码规则  序号格式为，AAABBBCCDDDDDDD
    //合同编码  B段BBB厂商编码由南京炫佳为每个机顶盒厂商统一分配
    private String contractNum;
    //同厂商不同类型的盒子   C段CC机顶盒编码由各厂商白行定义，要求相同机顶盒型号唯一编码
    private String boxTypeofsameFactory;
    //厂商唯一编码  D段DDDDDDD唯一编码由各厂商自行定义.要求各厂商确保每个设备唯一編码
    private String uniqueCode;
    //渠道编号详见版本表//01：行业版//02：公网版//03：运营商版    BBbb
    private String canelNum;
    //终端类型01：低端机商用机顶盒
    private String terminalType;
    //渠道类型0001：昕艺程      32:最终出货为江苏省  CCCCCC
    private String canelType;
    private String provice;
    //终端型号十六进制编码.厂商自行定义 DDD
    private String teminalTypeByFactory;
    //终端的识别符类型0： 表示以MAC地址1:表示终端产品序列号  E
    private String terminalDistinguishType;
    //终端批次十六进制编码.厂商自行定义（由工厂根据批次自行定义） FFFF
    private String terminalBatch;
    //终端的识别符  如果E=0：表示网口MAC地址：如果终端有多个网口，则默认为0号网口的MAC   GGGGGGGGGGGG
    private String terminalDistinguish;
    //生成的盒子数量
    private Integer deviceNum;
    //厂商id
    private Integer factory_id;

*/
export default {
  name: "addDeviceNo",
  data() {
    return {
      dialogFormVisible: false,
      form: {},
      factoryData: [],
      addUrl: "axios_add_deviceno",
      formLabelWidth: "140px",
      rules: {
        menuName: [{ required: true, message: "必填项", trigger: "blur" }]
      }
    };
  },
  created() {
    this.$store
      .dispatch("axios_get_factoryList")
      .then(res => {
        if (
          res &&
          res.data &&
          res.data.data &&
          res.data.data.records.constructor === Array
        ) {
          this.factoryData = res.data.data.records;
        }
        this.loading = false;
      })
      .catch(err => {
        this.loading = false;
      });
  },
  methods: {
    show() {
      this.form = {};
      this.dialogFormVisible = true;
    },

    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.factoryData.forEach(item => {
            if (item.contractNum == this.form.contractNum) {
              this.form["deviceNum"]=item.deviceNum || 0;
              this.form["terminalType"]=item.systemVersion ||0;
              this.form["factory_id"]=item.id ||0;
            }
          });
          //console.log(this.form);
          this.$store
            .dispatch(this.addUrl, this.form)
            .then(response => {
              if (response.data.errorCode == "1000") {
                this.$message.success("操作成功");
                this.$emit("getDeviceList");
              } else {
                this.$message.error("操作失败");
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
